export const lightColors = {
  background: '#f2f4f6', 
  surface: '#f0f0f3',     
  textPrimary: '#1c1c1e', 
  textSecondary: '#4b5563',
  border: '#d1d5db',       
  accent: '#2563eb',     
  onAccent: '#fff',   
  subtle: '#6b7280',     
  
  bannerWarningBg: '#FFF7ED',     
  bannerWarningText: '#7C2D12', 
  bannerWarningBorder: '#FED7AA',

  bannerInfoBg: '#F1F5F9',     
  bannerInfoText: '#1E3A8A',    
  bannerInfoBorder: '#CBD5E1',   
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

  bannerWarningBg: '#1F2933',
  bannerWarningText: '#927e2d',
  bannerWarningBorder: '#4B5563',

  bannerInfoBg: '#111827',
  bannerInfoText: '#93C5FD',
  bannerInfoBorder: '#374151',
};

export type Colors = typeof lightColors;

export const getColors = (theme: 'light' | 'dark') =>
  theme === 'light' ? lightColors : darkColors;