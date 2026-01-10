import React from 'react';
import { Network, AlertTriangle } from 'lucide-react';
import NetworkTree from './NetworkTree';

const NetworkVisualization = ({ network, healthPoints, floatingIslands, selectedNode, setSelectedNode }) => {
  const jediMembers = Object.keys(network).filter(name => network[name].isJedi);
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Network size={24} className="text-indigo-600" />
        Network Visualization
      </h2>
      
      <div className="space-y-8">
        {jediMembers.map(jedi => {
          const tier = network[jedi].tier;
          const tierColor = tier === 'gold' ? 'bg-yellow-100 border-yellow-400' : 
                           tier === 'silver' ? 'bg-gray-100 border-gray-400' : 
                           'bg-amber-100 border-amber-600';
          const tierIcon = tier === 'gold' ? '🥇' : tier === 'silver' ? '🥈' : '🥉';
          
          const directEndorsements = network[jedi].endorses.length;
          if (directEndorsements === 0) return null;
          
          return (
            <div key={jedi} className="bg-white rounded-lg p-6 shadow-lg border-2 border-indigo-200">
              <div className="flex items-center gap-3 mb-4">
                <div className={`px-4 py-2 rounded-lg border-2 ${tierColor} font-bold`}>
                  {tierIcon} {jedi}
                </div>
                <div className="text-sm text-gray-600">
                  Health: <span className="font-bold text-green-600">{Math.round(healthPoints[jedi] || 100)}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Direct: <span className="font-bold text-indigo-600">{directEndorsements}</span>
                </div>
              </div>
              <NetworkTree 
                person={jedi}
                network={network}
                healthPoints={healthPoints}
                level={1}
                selectedNode={selectedNode}
                setSelectedNode={setSelectedNode}
              />
            </div>
          );
        })}
        
        {floatingIslands.length > 0 && (
          <div className="bg-red-50 rounded-lg p-6 shadow-lg border-2 border-red-300">
            <div className="flex items-center gap-2 mb-4 text-red-700 font-bold">
              <AlertTriangle size={24} />
              Floating Islands ({floatingIslands.length}) - Not Connected to Jedi
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {floatingIslands.map(island => (
                <div key={island} className="bg-white px-3 py-2 rounded border border-red-300 text-sm">
                  {island}
                  <div className="text-xs text-gray-600">
                    HP: {Math.round(healthPoints[island] || 100)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NetworkVisualization;
