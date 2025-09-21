import axios from 'axios';
import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);

  useEffect(() => {
    const storedTokens = localStorage.getItem('authTokens');
    const storedUser = localStorage.getItem('authUser');

    if (storedTokens && storedUser) {
      setTokens(JSON.parse(storedTokens));
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const getIsAuthenticated = () => isAuthenticated;

  const getUser = () => user;

  const getAccessToken = () => tokens?.accessToken;

  const changeAuthState = (newState: boolean) => {
    setIsAuthenticated(newState);
  };

  const login = async (credentials: { email: string; password: string }) => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3333/api/v1';
    const res = await axios.post(`${API_BASE_URL}/login`, credentials);
    console.log(res);

    if (res.status === 200 && res.data.accessToken) {
      const authTokens: AuthTokens = {
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken
      };

      const userData: User = {
        id: res.data.user.id,
        email: res.data.user.email,
        name: res.data.user.email.split('@')[0]
      };

      setTokens(authTokens);
      setUser(userData);
      setIsAuthenticated(true);

      localStorage.setItem('authTokens', JSON.stringify(authTokens));
      localStorage.setItem('authUser', JSON.stringify(userData));
    }

    return res;
  }

  const register = async (credentials: { email: string; password: string }) => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3333/api/v1';
    const res = await axios.post(`${API_BASE_URL}/register`, credentials)
    if(res.status === 200){
      changeAuthState(true);
    }
    return res;
  }

  const logout = async () => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3333/api/v1';

    try {
      if (tokens?.refreshToken) {
        await axios.delete(`${API_BASE_URL}/logout`, {
          data: { token: tokens.refreshToken }
        });
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    }

    setTokens(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('authTokens');
    localStorage.removeItem('authUser');
  }
  
  return {
    getIsAuthenticated,
    getUser,
    getAccessToken,
    changeAuthState,
    logout,
    isLoading: false,
    login,
    register,
  };
};