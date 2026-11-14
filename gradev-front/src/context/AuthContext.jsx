import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import authServices from "../services/auth/auth";

const AuthContext = createContext(null);

function getUserFromResponse(response) {
  return (
    response?.data?.data?.user ??
    response?.data?.user ??
    response?.data?.data ??
    response?.data
  );
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuthentication() {
      try {
        const response = await authServices.getCurrentUser();
        setUser(getUserFromResponse(response));
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuthentication();
  }, []);

  async function login(credentials) {
    const response = await authServices.login(credentials);
    const authenticatedUser = getUserFromResponse(response);

    setUser(authenticatedUser);

    return authenticatedUser;
  }

  async function logout() {
    try {
      await authServices.logout();
    } finally {
      setUser(null);
    }
  }

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}