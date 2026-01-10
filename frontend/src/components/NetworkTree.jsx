import React from 'react';

const NetworkTree = ({ person, network, healthPoints, level, selectedNode, setSelectedNode }) => {
  if (!network[person] || network[person].endorses.length === 0) return null;
  
  const marginLeft = level * 20;
  
  return (
    <div style={{ marginLeft: `${marginLeft}px` }} className="mt-2 space-y-2">
      {network[person].endorses.map(endorsed => (
        <div key={endorsed}>
          <div className="flex items-center gap-2">
            <div className="w-0.5 h-6 bg-indigo-300"></div>
            <div 
              className={`px-3 py-1.5 rounded-lg border-2 cursor-pointer transition-all ${
                selectedNode === endorsed 
                  ? 'bg-indigo-100 border-indigo-500' 
                  : 'bg-blue-50 border-blue-300 hover:bg-blue-100'
              }`}
              onClick={() => setSelectedNode(selectedNode === endorsed ? null : endorsed)}
            >
              <div className="text-sm font-medium">{endorsed}</div>
              <div className="text-xs text-gray-600">
                HP: {Math.round(healthPoints[endorsed] || 100)} | 
                Endorses: {network[endorsed]?.endorses.length || 0}
              </div>
            </div>
          </div>
          <NetworkTree 
            person={endorsed}
            network={network}
            healthPoints={healthPoints}
            level={level + 1}
            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode}
          />
        </div>
      ))}
    </div>
  );
};

export default NetworkTree;
