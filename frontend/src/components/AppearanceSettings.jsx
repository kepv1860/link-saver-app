import React, { useState, useEffect } from 'react';

// This is a placeholder. In a real app, you would use a state management library (like Redux, Zustand, or Context API)
// to manage and persist theme settings across the application.
const AppearanceSettings = () => {
  const [theme, setTheme] = useState(localStorage.getItem('appTheme') || 'light'); // 'light', 'dark', 'system'
  const [darkModeVariant, setDarkModeVariant] = useState(localStorage.getItem('darkModeVariant') || 'dark'); // 'dark' (grayish), 'black' (true black)
  const [accentColor, setAccentColor] = useState(localStorage.getItem('accentColor') || 'blue'); // e.g., 'blue', 'green', 'purple'

  useEffect(() => {
    // Apply theme to the document body or root element
    document.documentElement.classList.remove('light', 'dark', 'theme-black');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      if (darkModeVariant === 'black') {
        document.documentElement.classList.add('theme-black'); // Custom class for true black
      }
    } else {
      document.documentElement.classList.add('light');
    }
    // Persist settings
    localStorage.setItem('appTheme', theme);
    localStorage.setItem('darkModeVariant', darkModeVariant);
  }, [theme, darkModeVariant]);

  useEffect(() => {
    // Apply accent color (this is a simplified example, might involve CSS variables)
    // For a real implementation, you'd update CSS variables that control accent colors throughout the app.
    document.documentElement.style.setProperty('--accent-color-500', `var(--color-${accentColor}-500)`);
    document.documentElement.style.setProperty('--accent-color-600', `var(--color-${accentColor}-600)`);
    document.documentElement.style.setProperty('--accent-color-700', `var(--color-${accentColor}-700)`);
    localStorage.setItem('accentColor', accentColor);
    console.log(`Accent color set to: ${accentColor}`);
  }, [accentColor]);

  const handleThemeChange = (selectedTheme) => {
    setTheme(selectedTheme);
  };

  const handleDarkModeVariantChange = (variant) => {
    setDarkModeVariant(variant);
    if (theme !== 'dark') setTheme('dark'); // Switch to dark mode if a variant is chosen
  };

  const handleAccentColorChange = (color) => {
    setAccentColor(color);
  };

  // Define some accent color options (tailwind color names)
  const accentColorOptions = [
    { name: 'Blue', value: 'blue' },
    { name: 'Green', value: 'green' },
    { name: 'Purple', value: 'purple' },
    { name: 'Red', value: 'red' },
    { name: 'Orange', value: 'orange' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Theme</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Select your preferred application theme.</p>
        <div className="mt-2 space-y-2 sm:space-y-0 sm:flex sm:space-x-4">
          <button 
            onClick={() => handleThemeChange('light')} 
            className={`px-4 py-2 rounded-md text-sm font-medium ${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
          >
            Light
          </button>
          <button 
            onClick={() => handleThemeChange('dark')} 
            className={`px-4 py-2 rounded-md text-sm font-medium ${theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
          >
            Dark
          </button>
          {/* <button onClick={() => handleThemeChange('system')} className={`px-3 py-1 rounded ${theme === 'system' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>System</button> */}
        </div>
      </div>

      {theme === 'dark' && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Dark Mode Variant</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Choose the shade for dark mode.</p>
          <div className="mt-2 space-y-2 sm:space-y-0 sm:flex sm:space-x-4">
            <button 
                onClick={() => handleDarkModeVariantChange('dark')} 
                className={`px-4 py-2 rounded-md text-sm font-medium ${darkModeVariant === 'dark' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
            >
                Dark (Grayish)
            </button>
            <button 
                onClick={() => handleDarkModeVariantChange('black')} 
                className={`px-4 py-2 rounded-md text-sm font-medium ${darkModeVariant === 'black' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
            >
                Black (True Black)
            </button>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Accent Color</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Personalize the look with an accent color.</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {accentColorOptions.map(colorOption => (
            <button 
              key={colorOption.value} 
              onClick={() => handleAccentColorChange(colorOption.value)} 
              className={`w-8 h-8 rounded-full border-2 ${accentColor === colorOption.value ? 'border-blue-500 ring-2 ring-blue-500' : 'border-transparent'}`} 
              style={{ backgroundColor: `var(--color-${colorOption.value}-500, ${getTailwindColorFallback(colorOption.value)})` }} // Fallback for direct style
              title={colorOption.name}
            />
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Note: Accent color application is simplified. Full theming requires CSS variable setup in Tailwind config.</p>
      </div>
    </div>
  );
};

// Helper function to get Tailwind color fallbacks for the style attribute (simplified)
// In a real app, these colors would be defined in tailwind.config.js and accessed via CSS variables.
const getTailwindColorFallback = (colorName) => {
  const colors = {
    blue: '#3B82F6', // blue-500
    green: '#10B981', // green-500
    purple: '#8B5CF6', // purple-500
    red: '#EF4444', // red-500
    orange: '#F97316', // orange-500
  };
  return colors[colorName] || '#6B7280'; // gray-500 as default
};

export default AppearanceSettings;

