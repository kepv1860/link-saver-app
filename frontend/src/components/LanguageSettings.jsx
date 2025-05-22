import React, { useState, useEffect } from 'react';

// Placeholder for Language Settings Component
// In a real application, you would use a library like i18next or react-intl for internationalization.
const LanguageSettings = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem('appLanguage') || 'en'); // Default to English

  // Supported languages (example)
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية (Arabic)' },
    // Add other languages as needed
  ];

  useEffect(() => {
    // Persist language choice
    localStorage.setItem('appLanguage', selectedLanguage);
    // Apply language to the document (e.g., for CSS :lang selectors or to inform i18n library)
    document.documentElement.lang = selectedLanguage;
    // Here you would typically trigger your i18n library to change the language
    console.log(`Language changed to: ${selectedLanguage}`);
    // For demonstration, we can change document direction for Arabic
    if (selectedLanguage === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }, [selectedLanguage]);

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Language Preference</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Choose your preferred language for the application.</p>
        <div className="mt-2">
          <select 
            id="language-select"
            value={selectedLanguage}
            onChange={handleLanguageChange}
            className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Note: Full multilingual support requires integration with an internationalization (i18n) library.
        </p>
      </div>
    </div>
  );
};

export default LanguageSettings;

