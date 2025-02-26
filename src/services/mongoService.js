const API_URL = 'https://api.flazu.my/api';

// Setup Collection Functions
export async function getSetupInfo(serverId) {
  try {
    const response = await fetch(`${API_URL}/setup/${serverId}`);
    if (!response.ok) throw new Error('Failed to get setup info');
    return await response.json();
  } catch (error) {
    console.error('Error getting setup info:', error);
    throw error;
  }
}

export async function saveSetupInfo(serverId, setupType, channelId) {
  try {
    const response = await fetch(`${API_URL}/setup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        serverId,
        setupType,
        channelId
      })
    });
    if (!response.ok) throw new Error('Failed to save setup info');
    return await response.json();
  } catch (error) {
    console.error('Error saving setup info:', error);
    throw error;
  }
}

// Q&A Collection Functions
export async function getQAData(serverId) {
  try {
    const response = await fetch(`${API_URL}/qa/${serverId}`);
    if (!response.ok) throw new Error('Failed to get QA data');
    return await response.json();
  } catch (error) {
    console.error('Error getting QA data:', error);
    throw error;
  }
}

export async function addQA(serverId, question, answer) {
  try {
    const response = await fetch(`${API_URL}/qa`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        serverId: String(serverId),
        question,
        answer
      })
    });
    if (!response.ok) throw new Error('Failed to add QA');
    return await response.json();
  } catch (error) {
    console.error('Error adding QA:', error);
    throw error;
  }
}

export async function removeQA(serverId, question) {
  try {
    const response = await fetch(`${API_URL}/qa/${serverId}/${encodeURIComponent(question)}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to remove QA');
    return await response.json();
  } catch (error) {
    console.error('Error removing QA:', error);
    throw error;
  }
}

export async function removeQABulk(serverId, questions) {
  try {
    const response = await fetch(`${API_URL}/qa/bulk/${serverId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ questions })
    });
    if (!response.ok) throw new Error('Failed to remove QAs');
    return await response.json();
  } catch (error) {
    console.error('Error removing QAs:', error);
    throw error;
  }
}
