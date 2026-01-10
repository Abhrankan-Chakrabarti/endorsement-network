// src/App.jsx - COMPLETE VERSION
import React, { useState, useEffect, useCallback } from 'react';
import { Network, Users, TrendingUp, AlertTriangle, Award } from 'lucide-react';
import { api } from './api/api';
import StatsCard from './components/StatsCard';
import NetworkActions from './components/NetworkActions';
import NetworkVisualization from './components/NetworkVisualization';

const App = () => {
  const [network, setNetwork] = useState({});
  const [healthPoints, setHealthPoints] = useState({});
  const [endorser, setEndorser] = useState('');
  const [endorsed, setEndorsed] = useState('');
  const [floatingIslands, setFloatingIslands] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMembers = useCallback(async () => {
    try {
      setLoading(true);
      const members = await api.getMembers();
      
      if (members.length === 0) {
        await api.initializeJedi();
        const newMembers = await api.getMembers();
        processMembers(newMembers);
      } else {
        processMembers(members);
      }
    } catch (error) {
      setMessage(`⚠️ Error loading data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const processMembers = (members) => {
    const networkData = {};
    const healthData = {};

    members.forEach(member => {
      networkData[member.name] = {
        endorsedBy: member.endorsedBy,
        endorses: member.endorses,
        isJedi: member.isJedi,
        tier: member.tier
      };
      healthData[member.name] = member.healthPoints;
    });

    setNetwork(networkData);
    setHealthPoints(healthData);
    updateFloatingIslands(networkData);
  };

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const normalizeString = (str) => str.trim().toLowerCase();

  const findOriginalName = (inputName) => {
    const normalized = normalizeString(inputName);
    const found = Object.keys(network).find(name => normalizeString(name) === normalized);
    return found || inputName.trim();
  };

  const findPathToJedi = (person, currentNetwork, visited = new Set()) => {
    if (visited.has(person)) return null;
    visited.add(person);
    
    if (!currentNetwork[person]) return null;
    if (currentNetwork[person].isJedi) return [person];
    if (!currentNetwork[person].endorsedBy) return null;
    
    const path = findPathToJedi(currentNetwork[person].endorsedBy, currentNetwork, visited);
    return path ? [person, ...path] : null;
  };

  const updateFloatingIslands = (currentNetwork) => {
    const floating = [];
    Object.keys(currentNetwork).forEach(person => {
      if (!currentNetwork[person].isJedi) {
        const path = findPathToJedi(person, currentNetwork, new Set());
        if (!path) floating.push(person);
      }
    });
    setFloatingIslands(floating);
  };

  const handleEndorse = async () => {
    if (!endorser.trim() || !endorsed.trim()) {
      setMessage('⚠️ Please enter both names');
      return;
    }

    if (!confirmAction) {
      setConfirmAction('endorse');
      setMessage(`❓ Are you sure you want ${endorser} to endorse ${endorsed}? Click Endorse again to confirm.`);
      return;
    }

    const endorserName = findOriginalName(endorser);
    const endorsedName = endorsed.trim();

    if (normalizeString(endorserName) === normalizeString(endorsedName)) {
      setMessage('⚠️ Cannot endorse yourself');
      setConfirmAction(null);
      return;
    }

    try {
      setLoading(true);
      const result = await api.endorse(endorserName, endorsedName);
      
      if (result.pathToJedi && result.pathToJedi.length > 0) {
        setMessage(`✅ ${endorserName} endorsed ${endorsedName}! Connected to Jedi through: ${result.pathToJedi.slice(1).join(' → ')}. Health points updated.`);
      } else {
        setMessage(`⚠️ ${endorsedName} is now a floating island - no connection to Jedi!`);
      }
      
      await loadMembers();
      setEndorser('');
      setEndorsed('');
      setConfirmAction(null);
    } catch (error) {
      setMessage(`⚠️ ${error.message}`);
      setConfirmAction(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDeEndorse = async () => {
    if (!endorser.trim() || !endorsed.trim()) {
      setMessage('⚠️ Please enter both names');
      return;
    }

    if (!confirmAction) {
      setConfirmAction('deendorse');
      setMessage(`❓ Are you sure you want ${endorser} to de-endorse ${endorsed}? This will create floating islands. Click De-Endorse again to confirm.`);
      return;
    }

    const endorserName = findOriginalName(endorser);
    const endorsedName = endorsed.trim();

    try {
      setLoading(true);
      const result = await api.deendorse(endorserName, endorsedName);
      setMessage(`⚠️ ${endorserName} de-endorsed ${endorsedName}. ${result.floatingCount} members now floating.`);
      
      await loadMembers();
      setEndorser('');
      setEndorsed('');
      setConfirmAction(null);
    } catch (error) {
      setMessage(`⚠️ ${error.message}`);
      setConfirmAction(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDefaulter = async () => {
    if (!endorsed.trim()) {
      setMessage('⚠️ Please enter defaulter name');
      return;
    }

    if (!confirmAction) {
      setConfirmAction('default');
      setMessage(`❓ Are you sure you want to mark ${endorsed} as a defaulter? This will remove them and all connected members with 50% penalty. Click Mark Defaulter again to confirm.`);
      return;
    }

    const endorsedName = endorsed.trim();

    try {
      setLoading(true);
      const result = await api.markDefaulter(endorsedName);
      setMessage(`🚨 Defaulter ${endorsedName} and ${result.removedCount - 1} connected members removed! 50% penalty applied.`);
      
      await loadMembers();
      setEndorsed('');
      setConfirmAction(null);
    } catch (error) {
      setMessage(`⚠️ ${error.message}`);
      setConfirmAction(null);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalMembers: Object.keys(network).length,
    totalJedi: Object.keys(network).filter(n => network[n].isJedi).length,
    totalFloating: floatingIslands.length,
    avgHealth: Object.keys(healthPoints).length > 0 
      ? Math.round(Object.values(healthPoints).reduce((a, b) => a + b, 0) / Object.keys(healthPoints).length)
      : 100
  };

  if (loading && Object.keys(network).length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading network data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Network className="text-indigo-600" size={40} />
            <h1 className="text-4xl font-bold text-gray-800">Jedi Endorsement Network</h1>
          </div>
          <p className="text-gray-600">Self-Healing Trust Network Dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatsCard title="Total Members" value={stats.totalMembers} icon={Users} color="indigo" />
          <StatsCard title="Jedi Members" value={stats.totalJedi} icon={Award} color="purple" />
          <StatsCard title="Floating Islands" value={stats.totalFloating} icon={AlertTriangle} color="red" />
          <StatsCard title="Avg Health" value={stats.avgHealth} icon={TrendingUp} color="green" />
        </div>

        <NetworkActions
          endorser={endorser}
          setEndorser={setEndorser}
          endorsed={endorsed}
          setEndorsed={setEndorsed}
          confirmAction={confirmAction}
          setConfirmAction={setConfirmAction}
          handleEndorse={handleEndorse}
          handleDeEndorse={handleDeEndorse}
          handleDefaulter={handleDefaulter}
          message={message}
        />

        <NetworkVisualization
          network={network}
          healthPoints={healthPoints}
          floatingIslands={floatingIslands}
          selectedNode={selectedNode}
          setSelectedNode={setSelectedNode}
        />
      </div>
    </div>
  );
};

export default App;