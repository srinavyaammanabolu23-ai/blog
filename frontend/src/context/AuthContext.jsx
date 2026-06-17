import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth as authApi, setToken, getToken } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, try to restore session from stored token
  useEffect(() => {
    const token = getToken();
    if (token) {
      authApi.me()
        .then(setUser)
        .catch(() => { setToken(null); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authApi.login({ email, password });
    setToken(data.access_token);
    const me = await authApi.me();
    setUser(me);
    return me;
  }, []);

  const register = useCallback(async (username, email, password, role = 'reader') => {
    await authApi.register({ username, email, password, role });
    return login(email, password);
  }, [login]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const value = { user, loading, login, register, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
