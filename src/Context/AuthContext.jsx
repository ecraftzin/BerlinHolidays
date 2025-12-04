// src/Context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../config/supabaseClient";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [customerProfile, setCustomerProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    // Check current session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await loadCustomerProfile(session.user.id);
        } 
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          setUser(session.user);
          await loadCustomerProfile(session.user.id);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setCustomerProfile(null);
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  // Load customer profile from database
  const loadCustomerProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("customer_profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;
      setCustomerProfile(data);
    } catch (error) {
      console.error("Error loading customer profile:", error);
    }
  };

  // Sign up new user
  const signUp = async (email, password, userData) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            phone: userData.phone,
          },
        },
      });

      if (error) throw error;

      // Create customer profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from("customer_profiles")
          .insert({
            user_id: data.user.id,
            name: userData.name,
            email: email,
            phone: userData.phone || null,
          });

        if (profileError) throw profileError;
      }

      return { data, error: null };
    } catch (error) {
      console.error("Signup error:", error);
      return { data: null, error };
    }
  };

  // Sign in existing user
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Sign in error:", error);
      return { data: null, error };
    }
  };

  // Sign out user
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setCustomerProfile(null);
      return { error: null };
    } catch (error) {
      console.error("Sign out error:", error);
      return { error };
    }
  };

  // Get user initial (first letter of email)
  const getUserInitial = () => {
    if (customerProfile?.name) {
      return customerProfile.name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  const value = {
    user,
    customerProfile,
    loading,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signOut,
    getUserInitial,
    loadCustomerProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

