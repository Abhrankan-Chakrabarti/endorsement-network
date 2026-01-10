import React from 'react';
import { UserPlus, UserMinus, Shield } from 'lucide-react';

const NetworkActions = ({
  endorser,
  setEndorser,
  endorsed,
  setEndorsed,
  confirmAction,
  setConfirmAction,
  handleEndorse,
  handleDeEndorse,
  handleDefaulter,
  message
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <UserPlus size={24} className="text-indigo-600" />
        Network Actions
      </h2>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-blue-800">
          <strong>How it works:</strong> Jedi members or anyone already in the network can endorse new people. 
          Each person can only be endorsed by ONE person. When you endorse someone, they join your network branch.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="Endorser Name"
          value={endorser}
          onChange={(e) => {
            setEndorser(e.target.value);
            setConfirmAction(null);
          }}
          className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Endorsed/Defaulter Name"
          value={endorsed}
          onChange={(e) => {
            setEndorsed(e.target.value);
            setConfirmAction(null);
          }}
          className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleEndorse}
          className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
            confirmAction === 'endorse'
              ? 'bg-green-700 text-white ring-4 ring-green-300 animate-pulse'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          <UserPlus size={20} />
          {confirmAction === 'endorse' ? 'Confirm Endorse' : 'Endorse'}
        </button>
        <button
          onClick={handleDeEndorse}
          className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
            confirmAction === 'deendorse'
              ? 'bg-orange-700 text-white ring-4 ring-orange-300 animate-pulse'
              : 'bg-orange-600 text-white hover:bg-orange-700'
          }`}
        >
          <UserMinus size={20} />
          {confirmAction === 'deendorse' ? 'Confirm De-Endorse' : 'De-Endorse'}
        </button>
        <button
          onClick={handleDefaulter}
          className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
            confirmAction === 'default'
              ? 'bg-red-700 text-white ring-4 ring-red-300 animate-pulse'
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          <Shield size={20} />
          {confirmAction === 'default' ? 'Confirm Mark Defaulter' : 'Mark Defaulter'}
        </button>
      </div>

      {confirmAction && (
        <button
          onClick={() => {
            setConfirmAction(null);
          }}
          className="w-full mt-3 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      )}

      {message && (
        <div className={`mt-4 p-4 rounded-lg font-medium ${
          message.includes('✅') ? 'bg-green-100 text-green-800 border border-green-300' :
          message.includes('🚨') ? 'bg-red-100 text-red-800 border border-red-300' :
          'bg-yellow-100 text-yellow-800 border border-yellow-300'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default NetworkActions;
