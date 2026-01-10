import Member from '../models/Member.js';
import ActivityLog from '../models/ActivityLog.js';
import { findPathToJedi, getAllDescendants } from '../utils/helpers.js';

// Get all members
export const getAllMembers = async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single member
export const getMember = async (req, res) => {
  try {
    const member = await Member.findOne({ name: req.params.name });
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Initialize Jedi Members
export const initializeJedi = async (req, res) => {
  try {
    const JEDI_MEMBERS = {
      gold: ['Ahana Sarkar', 'Himanshu P Dev', 'Pratheek Gaba'],
      silver: [
        'A S R S S Snigdha', 'Abhrankan Chakrabarti', 'Abhijeet Dubey', 
        'Arpita Usadadiya', 'Aradhya Joshi', 'Busetty Balasubramanyam',
        'Debottam Talukdar', 'Divya Chhabra', 'Dnyanesh Agale',
        'Donkena Sri Vivek Chand', 'Gutala Ashwitha', 'Jaisree Ragavi J',
        'Purbasha Roy', 'Sandeep Chagapuram', 'Sayan Deb',
        'Shriyash Gulhane', 'Shruti Jha', 'Suhani Pal', 'Tamada Ramya'
      ],
      bronze: [
        'Abhinav Kumar Jha', 'Aryan Dadich', 'Bollena Varsha',
        'Chilakamarrri Krishna Panchajanya', 'Gokul P', 'M. Goutham Reddy',
        'Manish Kumawat', 'Meda Tarun Venkat', 'Nandini Prasad',
        'Nikhil Dutta Anala', 'Ritesh Kumar Agrawal', 'Shyam Patel',
        'Sruthi S', 'Tejas Jain', 'V Rohith', 'Vedam Venkata Sarma',
        'Vinay Jawahar Lal Yadav', 'Vignesh Rapolu', 'Vipra Ram Bangera'
      ]
    };

    const jediMembers = [];
    
    for (const [tier, names] of Object.entries(JEDI_MEMBERS)) {
      for (const name of names) {
        const existing = await Member.findOne({ name });
        if (!existing) {
          jediMembers.push({
            name,
            isJedi: true,
            tier,
            healthPoints: 100,
            endorsedBy: null,
            endorses: []
          });
        }
      }
    }

    if (jediMembers.length > 0) {
      await Member.insertMany(jediMembers);
    }

    res.json({ message: `Initialized ${jediMembers.length} Jedi members`, count: jediMembers.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Endorse a member
export const endorseMember = async (req, res) => {
  try {
    const { endorser, endorsed } = req.body;

    // Find or create endorser
    let endorserDoc = await Member.findOne({ name: endorser });
    if (!endorserDoc) {
      return res.status(400).json({ error: 'Endorser not in network' });
    }

    // Check if endorsed already has endorsement
    let endorsedDoc = await Member.findOne({ name: endorsed });
    if (endorsedDoc && endorsedDoc.endorsedBy) {
      return res.status(400).json({ error: `${endorsed} is already endorsed by ${endorsedDoc.endorsedBy}` });
    }

    // Create endorsed member if doesn't exist
    if (!endorsedDoc) {
      endorsedDoc = new Member({
        name: endorsed,
        endorsedBy: endorser,
        endorses: [],
        isJedi: false,
        tier: null,
        healthPoints: 100
      });
      await endorsedDoc.save();
    } else {
      endorsedDoc.endorsedBy = endorser;
      await endorsedDoc.save();
    }

    // Add to endorser's endorses list
    if (!endorserDoc.endorses.includes(endorsed)) {
      endorserDoc.endorses.push(endorsed);
      await endorserDoc.save();
    }

    // Calculate health bonus for connected group
    const pathToJedi = await findPathToJedi(endorsed);
    if (pathToJedi && pathToJedi.length > 0) {
      for (const memberName of pathToJedi) {
        const member = await Member.findOne({ name: memberName });
        if (member) {
          const bonus = (member.healthPoints * 0.05) + (endorsedDoc.healthPoints * 0.05);
          member.healthPoints += bonus;
          member.updatedAt = new Date();
          await member.save();
        }
      }
    }

    // Log activity
    await ActivityLog.create({
      action: 'endorse',
      endorser,
      endorsed,
      details: `${endorser} endorsed ${endorsed}`
    });

    res.json({ 
      message: 'Endorsement successful', 
      pathToJedi,
      endorsedDoc 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// De-endorse a member
export const deendorseMember = async (req, res) => {
  try {
    const { endorser, endorsed } = req.body;

    const endorserDoc = await Member.findOne({ name: endorser });
    const endorsedDoc = await Member.findOne({ name: endorsed });

    if (!endorserDoc || !endorsedDoc) {
      return res.status(404).json({ error: 'Member not found' });
    }

    if (!endorserDoc.endorses.includes(endorsed)) {
      return res.status(400).json({ error: 'No endorsement exists' });
    }

    // Remove from endorser's list
    endorserDoc.endorses = endorserDoc.endorses.filter(e => e !== endorsed);
    await endorserDoc.save();

    // Remove endorsedBy
    endorsedDoc.endorsedBy = null;
    await endorsedDoc.save();

    // Get all descendants
    const descendants = await getAllDescendants(endorsed);

    // Log activity
    await ActivityLog.create({
      action: 'deendorse',
      endorser,
      endorsed,
      details: `${endorser} de-endorsed ${endorsed}. ${descendants.length + 1} members floating`
    });

    res.json({ 
      message: 'De-endorsement successful',
      floatingCount: descendants.length + 1,
      descendants
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark as defaulter
export const markDefaulter = async (req, res) => {
  try {
    const { endorsed } = req.body;

    const defaulterDoc = await Member.findOne({ name: endorsed });
    if (!defaulterDoc) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Apply 50% penalty to path
    const pathToJedi = await findPathToJedi(endorsed);
    if (pathToJedi && pathToJedi.length > 0) {
      for (const memberName of pathToJedi) {
        const member = await Member.findOne({ name: memberName });
        if (member) {
          member.healthPoints *= 0.5;
          member.updatedAt = new Date();
          await member.save();
        }
      }
    }

    // Get all descendants
    const descendants = await getAllDescendants(endorsed);
    const toRemove = [endorsed, ...descendants];

    // Remove from parent's endorses list
    if (defaulterDoc.endorsedBy) {
      const parent = await Member.findOne({ name: defaulterDoc.endorsedBy });
      if (parent) {
        parent.endorses = parent.endorses.filter(e => e !== endorsed);
        await parent.save();
      }
    }

    // Delete all
    await Member.deleteMany({ name: { $in: toRemove } });

    // Log activity
    await ActivityLog.create({
      action: 'default',
      endorsed,
      details: `${endorsed} marked as defaulter. ${toRemove.length} members removed`
    });

    res.json({ 
      message: 'Defaulter removed',
      removedCount: toRemove.length,
      removed: toRemove
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get activity logs
export const getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ timestamp: -1 }).limit(50);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};