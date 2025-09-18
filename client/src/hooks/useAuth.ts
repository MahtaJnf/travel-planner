import { useState } from 'react';

export const useAuth = () => {
  // TODO: implement real authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const mockUser = {
    id: 'user123',
    email: 'demo@example.com',
    name: 'Demo User'
  };

  const getIsAuthenticated = () => isAuthenticated;

  const getUser = () => mockUser;

  const changeAuthState = (newState: boolean) => {
    setIsAuthenticated(newState);
  };
  
  const handleLogout = () => {
    changeAuthState(false);
  };
  
  return {
    getIsAuthenticated,
    getUser,
    changeAuthState,
    logout: handleLogout,
    isLoading: false
  };
};