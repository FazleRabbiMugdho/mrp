import React, { createContext, useState, useContext, useEffect, useRef } from "react";
import { message } from "antd";

const UserContext = createContext();
const API_BASE = "http://localhost:5000/api";
const TOKEN_KEY = "userToken";
const USER_KEY = "userData";

const readStoredUser = () => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error("Invalid stored user data:", error);
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

const clearStoredAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const activeRequestRef = useRef(null);

  const abortActiveRequest = () => {
    if (activeRequestRef.current) {
      activeRequestRef.current.abort();
      activeRequestRef.current = null;
    }
  };

  const fetchUser = async () => {
    abortActiveRequest();
    const controller = new AbortController();
    activeRequestRef.current = controller;

    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setUser(null);
        return;
      }

      const userDataFromStorage = readStoredUser();
      const username = userDataFromStorage?.username;

      let response = await fetch(`${API_BASE}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        signal: controller.signal
      });

      if (response.status === 404 && username) {
        response = await fetch(`${API_BASE}/users/${username}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          signal: controller.signal
        });
      }

      if (response.status === 401 || response.status === 403) {
        clearStoredAuth();
        setUser(null);
        message.error("Session expired. Please log in again.");
        return;
      }

      if (localStorage.getItem(TOKEN_KEY) !== token) {
        return;
      }

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        if (userDataFromStorage && Object.keys(userDataFromStorage).length > 0) {
          setUser(userDataFromStorage);
        } else {
          setUser(null);
          message.error("Failed to load user data");
        }
      }
    } catch (error) {
      if (error?.name === "AbortError") {
        return;
      }
      console.error("Failed to fetch user:", error);
      const userDataFromStorage = readStoredUser();
      if (userDataFromStorage && Object.keys(userDataFromStorage).length > 0) {
        setUser(userDataFromStorage);
      } else {
        setUser(null);
        message.error("Server not available");
      }
    } finally {
      if (activeRequestRef.current === controller) {
        activeRequestRef.current = null;
        setLoading(false);
      }
    }
  };

  const refreshUser = async () => {
    setLoading(true);
    await fetchUser();
  };

  const logout = () => {
    abortActiveRequest();
    clearStoredAuth();
    setUser(null);
    setLoading(false);
  };

  const setAuthenticatedUser = (nextUser) => {
    setUser(nextUser);
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
    return () => abortActiveRequest();
  }, []);

  const updateUser = async (patch) => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const userDataFromStorage = readStoredUser();
      const username = userDataFromStorage?.username;

      if (!username) {
        throw new Error('No username found for update');
      }

      const response = await fetch(`${API_BASE}/users/${username}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(patch),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        const nextUser = updatedUser.user || updatedUser;
        const mergedUser = {
          ...readStoredUser(),
          ...nextUser
        };
        setUser(mergedUser);

        localStorage.setItem(USER_KEY, JSON.stringify(mergedUser));
        
        message.success("Profile updated successfully");
        return mergedUser;
      } else if (response.status === 401 || response.status === 403) {
        logout();
        message.error("Session expired. Please log in again.");
        throw new Error("Authentication failed");
      } else {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        message.error(errorData.message || errorData.error || "Update failed");
        throw new Error(errorData.message || "Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
      if (error?.message === "Authentication failed") {
        throw error;
      }
      message.error("Failed to update profile");
      throw error;
    }
  };

  const changePassword = async ({ oldPassword, newPassword }) => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const userDataFromStorage = readStoredUser();
      const username = userDataFromStorage?.username;

      if (!username) {
        throw new Error('No username found for password change');
      }

      const response = await fetch(`${API_BASE}/users/${username}/password`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      
      if (response.ok) {
        message.success("Password updated");
        return true;
      } else if (response.status === 401 || response.status === 403) {
        logout();
        message.error("Session expired. Please log in again.");
        throw new Error("Authentication failed");
      } else {
        const errorData = await response.json();
        message.error(errorData.message || "Password update failed");
        return false;
      }
    } catch (error) {
      console.error("Password error:", error);
      if (error?.message === "Authentication failed") {
        throw error;
      }
      message.error("Failed to update password");
      return false;
    }
  };

  const value = {
    user,
    loading,
    updateUser,
    changePassword,
    refreshUser,
    logout,
    setAuthenticatedUser
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
