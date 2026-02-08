export const lightColors = {
  background: '#f2f4f6', 
  surface: '#f0f0f3',     
  textPrimary: '#1c1c1e', 
  textSecondary: '#4b5563',
  border: '#d1d5db',       
  accent: '#2563eb',     
  onAccent: '#fff',   
  subtle: '#6b7280',     
};

export const darkColors = {
  background: '#121212',  
  surface: '#1e1e1e',     
  textPrimary: '#f5f5f5', 
  textSecondary: '#9ca3af', 
  border: '#2a2a2a',     
  accent: '#1b3897',  
  onAccent: '#fff',     
  subtle: '#9ca3af',     
};

export const getColors = (theme: 'light' | 'dark') =>
  theme === 'light' ? lightColors : darkColors;