import React, { createContext, useEffect, useState, useMemo } from "react";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onUserChanged((firebaseUser) => {
      setUser(firebaseUser);
      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    await GoogleSignin.signOut().catch(() => {});
    await auth().signOut();
    setUser(null);
  };

  // 🧠 Prevent child components from re-rendering unnecessarily
  const value = useMemo(() => ({ user, logout }), [user]);

  return (
    <AuthContext.Provider value={value}>
      {!initializing && children}
    </AuthContext.Provider>
  );
}
