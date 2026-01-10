export const API_URL = 'http://localhost:5001/api';

export const api = {
  // Get all members
  getMembers: async () => {
    const response = await fetch(`${API_URL}/members`);
    if (!response.ok) throw new Error('Failed to fetch members');
    return response.json();
  },

  // Initialize Jedi members
  initializeJedi: async () => {
    const response = await fetch(`${API_URL}/initialize-jedi`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to initialize Jedi');
    return response.json();
  },

  // Endorse
  endorse: async (endorser, endorsed) => {
    const response = await fetch(`${API_URL}/endorse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endorser, endorsed })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to endorse');
    }
    return response.json();
  },

  // De-endorse
  deendorse: async (endorser, endorsed) => {
    const response = await fetch(`${API_URL}/deendorse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endorser, endorsed })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to de-endorse');
    }
    return response.json();
  },

  // Mark defaulter
  markDefaulter: async (endorsed) => {
    const response = await fetch(`${API_URL}/defaulter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endorsed })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to mark defaulter');
    }
    return response.json();
  },

  // Get activity logs
  getLogs: async () => {
    const response = await fetch(`${API_URL}/logs`);
    if (!response.ok) throw new Error('Failed to fetch logs');
    return response.json();
  }
};