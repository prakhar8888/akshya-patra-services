import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import api from '../lib/api';

// Initial state for our reducer
const initialState = {
  user: null,
  isLoading: true, // Start in loading state to check for existing session
};

// Reducer function to manage state transitions in a predictable way
const authReducer = (state, action) => {
  switch (action.type) {
    case 'INITIALIZE':
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isLoading: false,
      };
    case 'LOGOUT':
    case 'INITIALIZE_FAIL':
      return {
        ...state,
        user: null,
        isLoading: false,
      };
    default:
      return state;
  }
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();

  // On initial app load, check for an existing token and validate it
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Check if token is expired
          const decodedToken = jwtDecode(token);
          if (decodedToken.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            dispatch({ type: 'INITIALIZE_FAIL' });
            return;
          }

          // ENTERPRISE FIX: Fetch fresh user data from the server
          // This ensures the user's role/status is always up-to-date.
          const { data: user } = await api.get('/auth/me');
          dispatch({ type: 'INITIALIZE', payload: user });

        } catch (error) {
          localStorage.removeItem('token');
          dispatch({ type: 'INITIALIZE_FAIL' });
        }
      } else {
        dispatch({ type: 'INITIALIZE_FAIL' });
      }
    };
    initializeAuth();
  }, []);

  // Helper function to handle navigation after successful login
  const navigateToDashboard = (userRole) => {
    const roleBase = userRole.split('-')[0]; // 'hr-manager' -> 'hr'
    navigate(`/${roleBase}/dashboard`);
  };

  const login = async (email, password) => {
    const toastId = toast.loading('Logging in...');
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data) {
        const { token, ...user } = response.data;
        localStorage.setItem('token', token);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        toast.success('Login successful!', { id: toastId });
        navigateToDashboard(user.role);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed!';
      toast.error(message, { id: toastId });
    }
  };

  const setAuthUser = async (token) => {
    try {
      localStorage.setItem('token', token);
      // After getting token from OAuth, fetch the full user object
      const { data: user } = await api.get('/auth/me');
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      toast.success('Login successful!');
      navigateToDashboard(user.role);
    } catch (error) {
      toast.error("Authentication failed. Please try again.");
      logout();
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('token');
    toast.success('You have been logged out.');
    navigate('/login');
  };

  // The value provided to the context consumers
  const value = {
    user: state.user,
    isLoading: state.isLoading,
    login,
    logout,
    setAuthUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to easily consume the AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
