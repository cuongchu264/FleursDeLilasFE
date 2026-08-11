const SESSION_KEY = 'fleurs_de_lilas_session';

export function getSession() {
  const stored = localStorage.getItem(SESSION_KEY);

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored);
  } catch (err) {
    return null;
  }
}

export function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}
