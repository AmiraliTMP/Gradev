import { createContext, useContext, useEffect, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication when the application starts
  useEffect(() => {
    let isMounted = true;

    async function checkAuthentication() {
      try {
        const response = await authServices.getMe();

        if (isMounted) {
          setUser(getUserFromResponse(response));
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    checkAuthentication();

    return () => {
      isMounted = false;
    };
  }, []);

  // Clear all cached data from the previous account
  async function clearPreviousAccountData() {
    await queryClient.cancelQueries();
    queryClient.clear();
  }

  // Login
  async function login(credentials) {
    const response = await authServices.login(credentials);

    const authenticatedUser = getUserFromResponse(response);

    await clearPreviousAccountData();

    setUser(authenticatedUser);

    return authenticatedUser;
  }

  // Logout
  async function logout() {
    try {
      await authServices.logout();
    } finally {
      await clearPreviousAccountData();
      setUser(null);
    }
  }

  // Update user in context after profile changes
  function updateUser(updatedUser) {
    setUser((currentUser) => ({
      ...currentUser,
      ...updatedUser,
    }));
  }

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
