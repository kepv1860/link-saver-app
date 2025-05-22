import React, { useState } from 'react';

const AiFeatures = () => {
  const [activeTab, setActiveTab] = useState('summarize');

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
        AI Assistant
      </h3>
      
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-4">
          <button
            onClick={() => setActiveTab('summarize')}
            className={`py-2 px-1 text-sm font-medium border-b-2 ${
              activeTab === 'summarize'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Summarize
          </button>
          <button
            onClick={() => setActiveTab('categorize')}
            className={`py-2 px-1 text-sm font-medium border-b-2 ${
              activeTab === 'categorize'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Categorize
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`py-2 px-1 text-sm font-medium border-b-2 ${
              activeTab === 'search'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Smart Search
          </button>
        </nav>
      </div>
      
      <div className="mt-4">
        {activeTab === 'summarize' && (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Let AI summarize the content of your links automatically.
            </p>
            <div className="space-y-3">
              <div>
                <label htmlFor="url-to-summarize" className="label">URL to summarize</label>
                <input
                  id="url-to-summarize"
                  type="url"
                  placeholder="https://example.com"
                  className="input"
                />
              </div>
              <button className="btn btn-primary w-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                Summarize Content
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'categorize' && (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              AI will automatically categorize and tag your links.
            </p>
            <div className="space-y-3">
              <div>
                <label htmlFor="url-to-categorize" className="label">URL to categorize</label>
                <input
                  id="url-to-categorize"
                  type="url"
                  placeholder="https://example.com"
                  className="input"
                />
              </div>
              <button className="btn btn-primary w-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                Auto-Categorize
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'search' && (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Search your links using natural language.
            </p>
            <div className="space-y-3">
              <div>
                <label htmlFor="smart-search" className="label">Search query</label>
                <input
                  id="smart-search"
                  type="text"
                  placeholder="e.g., 'articles about machine learning'"
                  className="input"
                />
              </div>
              <button className="btn btn-primary w-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                Smart Search
              </button>
            </div>
          </div>
        )}
        
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            <span className="font-semibold text-primary-600 dark:text-primary-400">Pro Tip:</span> AI features help you organize and extract value from your links automatically.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AiFeatures;
