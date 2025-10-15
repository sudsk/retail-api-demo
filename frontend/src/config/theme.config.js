import { useEffect, useState } from 'react';

export const useTheme = () => {
  const [branding, setBranding] = useState(null);

  useEffect(() => {
    // Load branding configuration
    fetch('/config/branding.json')
      .then(res => res.json())
      .then(data => {
        setBranding(data);
        
        // Apply theme CSS variables
        if (data.theme) {
          document.documentElement.style.setProperty('--primary-color', data.theme.primaryColor);
          document.documentElement.style.setProperty('--secondary-color', data.theme.secondaryColor);
          document.documentElement.style.setProperty('--accent-color', data.theme.accentColor);
          document.documentElement.style.setProperty('--font-family', data.theme.fontFamily);
        }
      })
      .catch(err => console.error('Failed to load branding:', err));
  }, []);

  return branding;
};

export default useTheme;
