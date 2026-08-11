import { getSession } from './session.js';

const API_BASE_URL = 'https://localhost:7035/api';

function getAuthHeaders(headers = {}) {
  const session = getSession();

  if (!session?.token) {
    return headers;
  }

  return {
    ...headers,
    Authorization: `Bearer ${session.token}`
  };
}

async function parseJsonResponse(response) {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Request failed');
  }

  return response.json();
}

export async function getFlowers() {
  const response = await fetch(`${API_BASE_URL}/flowers`, {
    headers: getAuthHeaders()
  });
  return parseJsonResponse(response);
}

export async function createFlower(payload) {
  const response = await fetch(`${API_BASE_URL}/flowers`, {
    method: 'POST',
    headers: getAuthHeaders({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(payload)
  });

  return parseJsonResponse(response);
}

export async function updateFlower(id, payload) {
  const response = await fetch(`${API_BASE_URL}/flowers/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Update flower failed');
  }

  return payload;
}

export async function deleteFlower(id) {
  const response = await fetch(`${API_BASE_URL}/flowers/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Delete flower failed');
  }

  return true;
}

export async function login(payload) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: payload.username,
      password: payload.password
    })
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || 'Login failed');
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    return { success: true, user: null, message: 'Login successful' };
  }
}

export async function register(payload) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: payload.username,
      password: payload.password
    })
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || 'Registration failed');
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    return { success: true, message: 'Registration successful' };
  }
}

export async function getSupplies() {
  const response = await fetch(`${API_BASE_URL}/supplies`, {
    headers: getAuthHeaders()
  });
  return parseJsonResponse(response);
}
