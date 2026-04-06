const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://204.168.208.53:5000/api';
export const SERVER_BASE_URL = API_BASE_URL.replace(/\/api$/, '');

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Create headers with auth token if available
const createHeaders = (additionalHeaders = {}) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...additionalHeaders,
  };

  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: createHeaders(),
  });
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
}

export async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: createHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
}

export async function putJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'PUT',
    headers: createHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
}

export async function postFormData<T>(path: string, formData: FormData): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).error || 'Network response was not ok');
  }
  return res.json();
}

export async function deleteJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'DELETE',
    headers: createHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
}
