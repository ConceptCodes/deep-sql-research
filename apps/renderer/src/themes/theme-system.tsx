import React, { useContext } from "react";

interface Theme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
}

interface ThemeContextValue {
  theme: Theme;
  updateTheme: (theme: Partial<Theme>) => void;
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

export const useTheme = (themeOverrides?: Partial<Theme>) => {
  const context = useContext(ThemeContext);
  if (!context) {
    // Default theme if no context provider
    return getDefaultTheme(themeOverrides);
  }
  
  return {
    ...context.theme,
    ...themeOverrides,
  };
};

export const ThemeProvider: React.FC<{ theme: Partial<Theme>; children: React.ReactNode }> = ({ 
  theme: themeOverrides, 
  children 
}) => {
  const [theme, setTheme] = React.useState<Theme>(getDefaultTheme(themeOverrides));
  
  const updateTheme = (updates: Partial<Theme>) => {
    setTheme(prev => ({ ...prev, ...updates }));
  };

  const contextValue: ThemeContextValue = {
    theme,
    updateTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

const getDefaultTheme = (overrides?: Partial<Theme>): Theme => {
  const defaultTheme: Theme = {
    primary: "#3b82f6",
    secondary: "#64748b",
    accent: "#f59e0b",
    background: "#0f172a",
    surface: "#1e293b",
  };

  return {
    ...defaultTheme,
    ...overrides,
  };
};

export const getTypographyScale = (speed: "slow" | "normal" | "fast") => {
  switch (speed) {
    case "slow":
      return {
        heading: { fontSize: "56px", lineHeight: 1.1 },
        body: { fontSize: "28px", lineHeight: 1.3 },
        caption: { fontSize: "20px", lineHeight: 1.2 },
      };
    case "normal":
      return {
        heading: { fontSize: "48px", lineHeight: 1.2 },
        body: { fontSize: "24px", lineHeight: 1.4 },
        caption: { fontSize: "18px", lineHeight: 1.3 },
      };
    case "fast":
      return {
        heading: { fontSize: "40px", lineHeight: 1.2 },
        body: { fontSize: "20px", lineHeight: 1.4 },
        caption: { fontSize: "16px", lineHeight: 1.3 },
      };
  }
};

export const getAnimationDuration = (speed: "slow" | "normal" | "fast", baseDuration: number) => {
  switch (speed) {
    case "slow":
      return baseDuration * 1.5;
    case "normal":
      return baseDuration;
    case "fast":
      return baseDuration * 0.7;
  }
};

export const getSpacingScale = (density: "compact" | "normal" | "spacious") => {
  switch (density) {
    case "compact":
      return {
        xs: "4px",
        sm: "8px", 
        md: "12px",
        lg: "16px",
        xl: "24px",
      };
    case "normal":
      return {
        xs: "6px",
        sm: "12px",
        md: "18px", 
        lg: "24px",
        xl: "32px",
      };
    case "spacious":
      return {
        xs: "8px",
        sm: "16px",
        md: "24px",
        lg: "32px", 
        xl: "48px",
      };
  }
};
