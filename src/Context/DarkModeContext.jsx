// src/Context/DarkModeContext.jsx
import React, { createContext, useContext } from "react";

const DarkModeContext = createContext();

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    return { isDarkMode: false }; // Default fallback
  }
  return context;
};

export const DarkModeProvider = ({ children, isDarkMode }) => {
  return (
    <DarkModeContext.Provider value={{ isDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

