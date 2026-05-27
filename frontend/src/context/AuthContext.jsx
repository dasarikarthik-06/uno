import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext(null);
const API_URL = 'http://localhost:8000';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('uno_token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('uno_user') || 'null'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('uno_token', token || '');
    localStorage.setItem('uno_user', JSON.stringify(user || {}));
  }, [token, user]);

  const login = async (username, password) => {
    setLoading(true);
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) throw new Error(data.message || 'Login failed');
    setToken(data.token);
    setUser({ username: data.username, userId: data.userId });
  };

  const signup = async (username, password) => {
    setLoading(true);
    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) throw new Error(data.message || 'Signup failed');
    setToken(data.token);
    setUser({ username: data.username, userId: data.userId });
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('uno_token');
    localStorage.removeItem('uno_user');
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, signup, logout, apiUrl: API_URL }}>
      {children}
    </AuthContext.Provider>
  );
}
