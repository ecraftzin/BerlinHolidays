// src/Context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
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
      console.log('[AuthContext] Initializing auth...');
      try {
        // Add timeout to prevent hanging
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Session check timeout')), 5000)
        );

        const { data: { session }, error } = await Promise.race([sessionPromise, timeoutPromise]);
        console.log('[AuthContext] getSession result - session:', !!session, 'error:', error);

        if (error) {
          console.error('[AuthContext] Session error, clearing auth state');
          setUser(null);
          setCustomerProfile(null);
        } else if (session?.user) {
          setUser(session.user);
          // Don't await loadCustomerProfile to prevent blocking
          loadCustomerProfile(session.user.id).catch(err => {
            console.error('[AuthContext] Failed to load customer profile:', err);
          });
        }
      } catch (error) {
        console.error("[AuthContext] Error initializing auth:", error);
        // Clear auth state on error to prevent hanging
        setUser(null);
        setCustomerProfile(null);
      } finally {
        setLoading(false);
        console.log('[AuthContext] Auth initialization complete');
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[AuthContext] Auth state changed:', event);
        if (event === "SIGNED_IN" && session?.user) {
          setUser(session.user);
          // Don't await loadCustomerProfile to prevent blocking
          loadCustomerProfile(session.user.id).catch(err => {
            console.error('[AuthContext] Failed to load customer profile:', err);
          });
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setCustomerProfile(null);
        } else if (event === "TOKEN_REFRESHED") {
          console.log('[AuthContext] Token refreshed successfully');
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  // Load customer profile from database
  const loadCustomerProfile = async (userId) => {
    try {
      console.log('[AuthContext] Loading customer profile for userId:', userId);
      const { data, error } = await supabase
        .from("customer_profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      console.log('[AuthContext] Customer profile load result - data:', data, 'error:', error);
      if (error) throw error;
      setCustomerProfile(data);
    } catch (error) {
      console.error("[AuthContext] Error loading customer profile:", error);
    }
  };

  // Update customer profile
  const updateCustomerProfile = async (updates) => {
    try {
      if (!user?.id) throw new Error("User not authenticated");

      console.log('[AuthContext] Updating customer profile:', updates);
      const { data, error } = await supabase
        .from("customer_profiles")
        .update(updates)
        .eq("user_id", user.id)
        .select()
        .maybeSingle();

      if (error) throw error;

      // If profile was not found, return a clear error
      if (!data) {
        throw new Error("Profile not found for the current user.");
      }
      
      // Update local state immediately
      setCustomerProfile(data);
      console.log('[AuthContext] Customer profile updated successfully:', data);
      
      return { data, error: null };
    } catch (error) {
      console.error("[AuthContext] Error updating customer profile:", error);
      return { data: null, error };
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
      // Clear state first to ensure UI updates immediately
      setUser(null);
      setCustomerProfile(null);

      // Clear all auth-related localStorage items
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('sb-') || key === 'auth')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));

      // Sign out from Supabase (use 'local' scope for reliability)
      const { error } = await supabase.auth.signOut({ scope: 'local' });

      if (error) {
        console.error("Sign out error:", error);
      }

      return { error: null };
    } catch (error) {
      console.error("Sign out error:", error);
      // State already cleared above
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
    updateCustomerProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

