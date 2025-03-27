
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

type CardColor = "purple" | "emerald" | "blue" | "amber" | "pink";

interface CardColorSettings {
  name: string;
  from: string;
  to: string;
  textColor: string;
}

export const CARD_COLOR_MAP: Record<CardColor, CardColorSettings> = {
  purple: {
    name: "Purple",
    from: "from-purple-600",
    to: "to-purple-400",
    textColor: "text-white"
  },
  emerald: {
    name: "Emerald",
    from: "from-emerald-600",
    to: "to-emerald-400",
    textColor: "text-white"
  },
  blue: {
    name: "Blue",
    from: "from-blue-600",
    to: "to-blue-400",
    textColor: "text-white"
  },
  amber: {
    name: "Amber", 
    from: "from-amber-500",
    to: "to-amber-300",
    textColor: "text-gray-800"
  },
  pink: {
    name: "Pink",
    from: "from-pink-500",
    to: "to-pink-300",
    textColor: "text-white"
  }
};

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  cardColor: CardColor;
  setTheme: (theme: Theme) => void;
  setCardColor: (color: CardColor) => void;
  getCardColorClasses: () => {
    gradientClasses: string;
    textColorClass: string;
  };
};

const initialState: ThemeProviderState = {
  theme: "system",
  cardColor: "purple",
  setTheme: () => null,
  setCardColor: () => null,
  getCardColorClasses: () => ({ gradientClasses: "", textColorClass: "" }),
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "moves-ssp-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  
  const [cardColor, setCardColor] = useState<CardColor>(
    () => (localStorage.getItem("moves-ssp-card-color") as CardColor) || "purple"
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const getCardColorClasses = () => {
    const colorSettings = CARD_COLOR_MAP[cardColor];
    return {
      gradientClasses: `bg-gradient-to-r ${colorSettings.from} ${colorSettings.to}`,
      textColorClass: colorSettings.textColor
    };
  };

  const value = {
    theme,
    cardColor,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    setCardColor: (color: CardColor) => {
      localStorage.setItem("moves-ssp-card-color", color);
      setCardColor(color);
    },
    getCardColorClasses,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
