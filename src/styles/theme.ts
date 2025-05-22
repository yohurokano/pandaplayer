// Theme configuration for styled-components - Panda themed with pastel pink
export const theme = {
  colors: {
    // Panda theme colors
    primary: '#ffc0cb', // Pastel pink
    secondary: '#000000', // Black (panda)
    tertiary: '#ffffff', // White (panda)
    background: '#fff5f7', // Light pink background
    darkBackground: '#2d3748', // Darker background for contrast
    text: '#1a202c',
    secondaryText: '#4a5568',
    
    // Color palette for different tracks
    palette: {
      purple: {
        light: '#f9a8d4',
        main: '#d8b4fe',
        dark: '#a855f7',
      },
      pink: {
        light: '#f9a8d4',
        main: '#f472b6',
        dark: '#db2777',
      },
      sky: {
        light: '#7dd3fc',
        main: '#38bdf8',
        dark: '#0284c7',
      },
      rose: {
        light: '#fca5a5',
        main: '#fb7185',
        dark: '#e11d48',
      },
      amber: {
        light: '#fcd34d',
        main: '#f59e0b',
        dark: '#d97706',
      },
      indigo: {
        light: '#a5b4fc',
        main: '#818cf8',
        dark: '#4f46e5',
      },
      teal: {
        light: '#5eead4',
        main: '#2dd4bf',
        dark: '#0d9488',
      },
      lime: {
        light: '#bef264',
        main: '#a3e635',
        dark: '#65a30d',
      },
    }
  },
  
  // Panda-themed gradients for backgrounds
  gradients: {
    pandaPink: 'linear-gradient(135deg, #fff5f7 0%, #ffc0cb 100%)',
    pandaDark: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)',
    pandaLight: 'linear-gradient(135deg, #ffffff 0%, #f7fafc 100%)',
    pandaContrast: 'linear-gradient(135deg, #000000 0%, #2d3748 100%)',
    pandaPastel: 'linear-gradient(135deg, #ffc0cb 0%, #fed7d7 100%)',
    pandaMix: 'linear-gradient(135deg, #000000 0%, #ffc0cb 100%)',
  },
  
  // Animation durations
  animation: {
    fast: '0.2s',
    medium: '0.4s',
    slow: '0.8s',
  },
  
  // Border radius values
  borderRadius: {
    small: '8px',
    medium: '12px',
    large: '20px',
    round: '50%',
  },
  
  // Shadows
  shadows: {
    soft: '0 4px 20px rgba(0, 0, 0, 0.1)',
    medium: '0 8px 30px rgba(0, 0, 0, 0.2)',
    strong: '0 12px 40px rgba(0, 0, 0, 0.3)',
    glow: (color: string) => `0 0 20px ${color}`,
  },
  
  // Spacing
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  
  // Media queries for responsive design
  breakpoints: {
    mobile: '576px',
    tablet: '768px',
    laptop: '992px',
    desktop: '1200px',
  },
  
  // Font sizes
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.5rem',
    xxl: '2rem',
  },
};

// Helper to convert hex to rgba
export const hexToRgba = (hex: string, alpha = 1) => {
  if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) {
    return `rgba(220, 220, 255, ${alpha})`; // Default to a light lavender with alpha
  }
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return `rgba(220, 220, 255, ${alpha})`; 
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Types
export type ThemeColor = keyof typeof theme.colors.palette;
export type ColorShade = 'light' | 'main' | 'dark';
export type GradientName = keyof typeof theme.gradients;

export default theme;
