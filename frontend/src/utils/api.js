const API_BASE = 'https://candidate-referral-management.onrender.com/api'; 

export const getToken = () => localStorage.getItem('token');

export const apiRequest = async (endpoint, method = 'GET', data = null, isForm = false) => {
  const headers = {};
  if (!isForm) headers['Content-Type'] = 'application/json';
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let options = { method, headers };
  if (data) {
    if (isForm) {
      options.body = data;
    } else {
      options.body = JSON.stringify(data);
    }
  }
  const res = await fetch(`${API_BASE}${endpoint}`, options);
  const contentType = res.headers.get('content-type');
  let body = null;
  if (contentType && contentType.includes('application/json')) {
    body = await res.json();
  } else {
    body = await res.text();
  }
  if (!res.ok) throw body;
  return body;
}; 