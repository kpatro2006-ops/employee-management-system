const API_BASE = '/api/employees';
const AUTH_BASE = '/api/auth';

// Token and User session storage helpers
export function getToken() {
  return localStorage.getItem('staffpulse_token');
}

export function setToken(token) {
  if (token) {
    localStorage.setItem('staffpulse_token', token);
  } else {
    localStorage.removeItem('staffpulse_token');
  }
}

export function getStoredUser() {
  const user = localStorage.getItem('staffpulse_user');
  try {
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  if (user) {
    localStorage.setItem('staffpulse_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('staffpulse_user');
  }
}

export function logoutUser() {
  localStorage.removeItem('staffpulse_token');
  localStorage.removeItem('staffpulse_user');
}

// Request header helper
function getHeaders(customHeaders = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders
  };
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Log in employee
 */
export async function login(email, password) {
  const response = await fetch(`${AUTH_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Login failed. Please check your credentials.');
  }

  if (data.data && data.data.token) {
    setToken(data.data.token);
    setStoredUser(data.data);
  }

  return data;
}

/**
 * Get currently authenticated user profile
 */
export async function getCurrentUser() {
  const response = await fetch(`${AUTH_BASE}/me`, {
    headers: getHeaders()
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch current user profile');
  }
  return data;
}

/**
 * Fetch all employees with optional query filters
 */
export async function getEmployees(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.department && params.department !== 'All') query.append('department', params.department);
  if (params.role && params.role !== 'All') query.append('role', params.role);
  if (params.status && params.status !== 'All') query.append('status', params.status);
  if (params.sortBy) query.append('sortBy', params.sortBy);
  if (params.order) query.append('order', params.order);

  const queryString = query.toString() ? `?${query.toString()}` : '';
  const response = await fetch(`${API_BASE}${queryString}`, {
    headers: getHeaders()
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch employees');
  }
  return data;
}

/**
 * Fetch dashboard statistics
 */
export async function getEmployeeStats() {
  const response = await fetch(`${API_BASE}/stats/summary`, {
    headers: getHeaders()
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch statistics');
  }
  return data;
}

/**
 * Fetch single employee by ID
 */
export async function getEmployeeById(id) {
  const response = await fetch(`${API_BASE}/${id}`, {
    headers: getHeaders()
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch employee');
  }
  return data;
}

/**
 * Create a new employee
 */
export async function createEmployee(employeeData) {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(employeeData)
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create employee');
  }
  return data;
}

/**
 * Update an existing employee
 */
export async function updateEmployee(id, employeeData) {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(employeeData)
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update employee');
  }
  return data;
}

/**
 * Delete an employee
 */
export async function deleteEmployee(id) {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete employee');
  }
  return data;
}
