import React, { createContext, useState, useContext, useEffect } from "react";
import { message } from "antd";

const UserContext = createContext();
const API_BASE = "http://localhost:5000/api";

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      console.log('Fetching user from server...');
      
      // Get the token from localStorage
      const token = localStorage.getItem('userToken');
      if (!token) {
        console.error('No token found');
        setLoading(false);
        return;
      }

      // Get username from localStorage to use as fallback
      const userDataFromStorage = JSON.parse(localStorage.getItem('userData') || '{}');
      const username = userDataFromStorage?.username;
      
      // Try to fetch using the authenticated user endpoint first
      let response = await fetch(`${API_BASE}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // If /me endpoint doesn't exist, fall back to username endpoint
      if (response.status === 404 && username) {
        console.log('Falling back to username endpoint');
        response = await fetch(`${API_BASE}/users/${username}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
      
      if (response.ok) {
        const userData = await response.json();
        console.log('User data received:', userData);
        setUser(userData);
      } else {
        console.error('Failed to fetch user, status:', response.status);
        // If both endpoints fail, use data from localStorage
        if (userDataFromStorage && Object.keys(userDataFromStorage).length > 0) {
          console.log('Using user data from localStorage');
          setUser(userDataFromStorage);
        } else {
          message.error("Failed to load user data");
        }
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      // Fallback to localStorage data
      const userDataFromStorage = JSON.parse(localStorage.getItem('userData') || '{}');
      if (userDataFromStorage && Object.keys(userDataFromStorage).length > 0) {
        setUser(userDataFromStorage);
      } else {
        message.error("Server not available");
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    setLoading(true);
    await fetchUser();
    message.success("Data refreshed");
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const updateUser = async (patch) => {
    try {
      console.log('Sending update to server:', patch);
      
      const token = localStorage.getItem('userToken');
      const userDataFromStorage = JSON.parse(localStorage.getItem('userData') || '{}');
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
      
      console.log('Server response status:', response.status);
      
      if (response.ok) {
        const updatedUser = await response.json();
        console.log('Server response data:', updatedUser);
        setUser(updatedUser.user || updatedUser);
        
        // Update localStorage with new data
        const currentUserData = JSON.parse(localStorage.getItem('userData') || '{}');
        localStorage.setItem('userData', JSON.stringify({
          ...currentUserData,
          ...updatedUser.user || updatedUser
        }));
        
        message.success("Profile updated successfully");
        return updatedUser;
      } else {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        message.error(errorData.message || errorData.error || "Update failed");
        throw new Error(errorData.message || "Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
      message.error("Failed to update profile");
      throw error;
    }
  };

  const changePassword = async ({ oldPassword, newPassword }) => {
    try {
      const token = localStorage.getItem('userToken');
      const userDataFromStorage = JSON.parse(localStorage.getItem('userData') || '{}');
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
      } else {
        const errorData = await response.json();
        message.error(errorData.message || "Password update failed");
        return false;
      }
    } catch (error) {
      console.error("Password error:", error);
      message.error("Failed to update password");
      return false;
    }
  };

  const value = {
    user,
    loading,
    updateUser,
    changePassword,
    refreshUser
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