"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import WhatsAppPulse from "./WhatsAppPulse";

type Theme = "standard" | "jungle";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("standard");

  useEffect(() => {
    if (theme === "jungle") {
      document.documentElement.setAttribute("data-theme", "jungle");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
      <WhatsAppPulse />
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
