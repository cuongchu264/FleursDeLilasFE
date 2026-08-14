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
    let message = '';
    try {
      const json = await response.json();

      // If server returned validation ProblemDetails (errors object), flatten them
      if (json && json.errors && typeof json.errors === 'object') {
        const errorList = Object.values(json.errors)
          .flat()
          .filter(Boolean)
          .map(String);

        const title = json.title || json.message || 'Validation error';
        message = title + (errorList.length ? ': ' + errorList.join('; ') : '');
      } else {
        message = json?.message || json?.error || JSON.stringify(json);
      }
    } catch (e) {
      message = await response.text();
    }

    const err = new Error(message || 'Request failed');
    err.status = response.status;
    throw err;
  }

  // Some successful responses have no body (204 No Content, 205 Reset Content)
  if (response.status === 204 || response.status === 205) {
    return null;
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
  await parseJsonResponse(response);
  return payload;
}

export async function deleteFlower(id) {
  const response = await fetch(`${API_BASE_URL}/flowers/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  await parseJsonResponse(response);
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

  return parseJsonResponse(response);
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

  return parseJsonResponse(response);
}

export async function getSupplies() {
  const response = await fetch(`${API_BASE_URL}/supplies`, {
    headers: getAuthHeaders()
  });
  return parseJsonResponse(response);
}

export async function createSupply(payload) {
  const response = await fetch(`${API_BASE_URL}/supplies`, {
    method: 'POST',
    headers: getAuthHeaders({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(payload)
  });

  return parseJsonResponse(response);
}

export async function updateSupply(id, payload) {
  const response = await fetch(`${API_BASE_URL}/supplies/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(payload)
  });
  await parseJsonResponse(response);
  return payload;
}

export async function deleteSupply(id) {
  const response = await fetch(`${API_BASE_URL}/supplies/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  await parseJsonResponse(response);
  return true;
}

export async function getOrders() {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    headers: getAuthHeaders()
  });
  return parseJsonResponse(response);
}

export async function getOrderById(id) {
  const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
    headers: getAuthHeaders()
  });
  return parseJsonResponse(response);
}

export async function createOrder(payload) {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload)
  });
  return parseJsonResponse(response);
}
