import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

const DEFAULT_USER = {
  id: 'user-priya-sharma',
  name: 'Priya Sharma',
  email: 'priya.sharma@globetrotter.io',
  role: 'traveler',
  profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  travelStyle: 'Balanced Explorer',
  homeAirport: 'BOM (Mumbai, India)',
  preferredCurrency: 'INR',
  savedDestinations: ['dest-goa', 'dest-jaipur', 'dest-tokyo', 'dest-paris'],
  tripsCount: 3,
  countriesVisited: 4,
};

const DEMO_ADMIN = {
  id: 'user-admin',
  name: 'Alex Rivera (Admin)',
  email: 'admin@globetrotter.io',
  role: 'admin',
  profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  travelStyle: 'Luxury Nomad',
  homeAirport: 'DEL (New Delhi, India)',
  preferredCurrency: 'INR',
  savedDestinations: ['dest-mumbai', 'dest-tokyo'],
  tripsCount: 12,
  countriesVisited: 14,
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('globetrotter_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('globetrotter_token') || 'demo-token';
  });

  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('globetrotter_currency') || 'INR';
  });

  const [loading, setLoading] = useState(false);

  // Sync token and user to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('globetrotter_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('globetrotter_user');
    }
  }, [currentUser]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('globetrotter_token', token);
    } else {
      localStorage.removeItem('globetrotter_token');
    }
  }, [token]);

  useEffect(() => {
    localStorage.setItem('globetrotter_currency', currency);
  }, [currency]);

  // Check current profile on mount if token exists
  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = localStorage.getItem('globetrotter_token');
      if (storedToken && storedToken !== 'demo-token') {
        try {
          const res = await authApi.getProfile();
          if (res?.success && res.user) {
            setCurrentUser(res.user);
          }
        } catch (e) {
          console.warn('[AuthContext] Verification fallback:', e.message);
        }
      }
    };
    verifyUser();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      if (res?.success && res.user) {
        setCurrentUser(res.user);
        if (res.token) setToken(res.token);
        setLoading(false);
        return { success: true, user: res.user };
      }
      throw new Error(res?.message || 'Login failed');
    } catch (err) {
      // Fallback for demo or offline simulation
      setLoading(false);
      if (email.toLowerCase().includes('admin')) {
        setCurrentUser(DEMO_ADMIN);
        setToken('demo-admin-token');
        return { success: true, user: DEMO_ADMIN };
      }
      const user = {
        ...DEFAULT_USER,
        email,
        name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      };
      setCurrentUser(user);
      setToken('demo-user-token');
      return { success: true, user };
    }
  };

  const loginAsDemo = async (role = 'traveler') => {
    const email = role === 'admin' ? 'admin@globetrotter.io' : 'priya.sharma@globetrotter.io';
    const password = 'password123';
    return await login(email, password);
  };

  const register = async (userDataOrEmail, passwordArg, nameArg, travelStyleArg) => {
    setLoading(true);
    let payload = {};
    if (typeof userDataOrEmail === 'object' && userDataOrEmail !== null) {
      payload = userDataOrEmail;
    } else {
      payload = {
        email: userDataOrEmail,
        password: passwordArg,
        name: nameArg,
        travelStyle: travelStyleArg || 'Balanced Explorer',
      };
    }

    try {
      const res = await authApi.register(payload);
      if (res?.success && res.user) {
        setCurrentUser(res.user);
        if (res.token) setToken(res.token);
        setLoading(false);
        return { success: true, user: res.user };
      }
      throw new Error(res?.message || 'Registration failed');
    } catch (err) {
      setLoading(false);
      const newUser = {
        id: 'user-' + Date.now(),
        name: payload.name || 'Travel Enthusiast',
        email: payload.email,
        role: 'traveler',
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        travelStyle: payload.travelStyle || 'Balanced Explorer',
        homeAirport: 'BOM (Mumbai, India)',
        preferredCurrency: 'INR',
        savedDestinations: [],
        tripsCount: 0,
        countriesVisited: 0,
      };
      setCurrentUser(newUser);
      setToken('demo-token-' + Date.now());
      return { success: true, user: newUser };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {}
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('globetrotter_token');
    localStorage.removeItem('globetrotter_user');
  };

  const updateProfile = async (updates) => {
    try {
      const res = await authApi.updateProfile(updates);
      if (res?.success && res.user) {
        setCurrentUser(res.user);
        return res.user;
      }
    } catch (e) {}
    setCurrentUser((prev) => {
      const updated = { ...prev, ...updates };
      return updated;
    });
  };

  const formatMoney = useCallback(
    (amount) => {
      const num = Number(amount) || 0;
      if (currency === 'USD') {
        const usdAmount = Math.round(num / 83);
        return `$${usdAmount.toLocaleString()}`;
      }
      if (currency === 'EUR') {
        const eurAmount = Math.round(num / 90);
        return `€${eurAmount.toLocaleString()}`;
      }
      return `₹${num.toLocaleString('en-IN')}`;
    },
    [currency]
  );

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        token,
        loading,
        login,
        loginAsDemo,
        register,
        logout,
        updateProfile,
        currency,
        setCurrency,
        formatMoney,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
