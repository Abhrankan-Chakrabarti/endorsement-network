import express from 'express';
import {
  getAllMembers,
  getMember,
  initializeJedi,
  endorseMember,
  deendorseMember,
  markDefaulter,
  getActivityLogs
} from '../controllers/MemberController.js';

const router = express.Router();

// Get all members
router.get('/members', getAllMembers);

// Get single member
router.get('/members/:name', getMember);

// Initialize Jedi Members
router.post('/initialize-jedi', initializeJedi);

// Endorse a member
router.post('/endorse', endorseMember);

// De-endorse a member
router.post('/deendorse', deendorseMember);

// Mark as defaulter
router.post('/defaulter', markDefaulter);

// Get activity logs
router.get('/logs', getActivityLogs);

export default router;