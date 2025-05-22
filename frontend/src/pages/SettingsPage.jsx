import React from 'react';
import AppearanceSettings from '../components/AppearanceSettings';
import LanguageSettings from '../components/LanguageSettings';

// Settings Page - Main container for various settings sections
const SettingsPage = () => {
  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-8">Settings</h1>
        
        <div className="space-y-8">
          {/* Appearance Settings Section */}
          <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Appearance</h2>
            <AppearanceSettings />
          </section>

          {/* Language Settings Section */}
          <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Language</h2>
            <LanguageSettings />
          </section>

          {/* Account Settings Section (Placeholder) */}
          <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Account</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your account details, password, and other security settings. (Coming Soon)
            </p>
            {/* Placeholder for account management options like change password, delete account etc. */}
          </section>

           {/* Ad Settings Section (Placeholder) */}
           <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Advertising Preferences</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your advertising preferences and consent. (Coming Soon)
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

