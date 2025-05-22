import React, { useState, useEffect } from 'react';
import LinkList from '../components/LinkList';
import AiFeatures from '../components/AiFeatures';
import AdPlaceholder from '../components/AdPlaceholder';
// import { apiService } from '../services/apiService'; // To fetch links

const Dashboard = () => {
  const [links, setLinks] = useState([]); // Placeholder for links
  const [isLoadingLinks, setIsLoadingLinks] = useState(false);
  const [errorLinks, setErrorLinks] = useState('');
  const [showAddLinkModal, setShowAddLinkModal] = useState(false);

  // TODO: Fetch links from the backend when the component mounts
  useEffect(() => {
    const fetchLinks = async () => {
      setIsLoadingLinks(true);
      setErrorLinks('');
      try {
        // const storedToken = localStorage.getItem('authToken');
        // Assuming an API endpoint like /links
        // const fetchedLinks = await apiService.getLinks(storedToken);
        // setLinks(fetchedLinks || []);
        // For now, using placeholder data
        setTimeout(() => {
          setLinks([
            { id: 1, url: 'https://react.dev', title: 'React Official Docs', description: 'The official documentation for React.', tags: ['react', 'javascript', 'frontend'], createdAt: '2025-05-15T10:30:00Z', category: 'Development' },
            { id: 2, url: 'https://tailwindcss.com', title: 'Tailwind CSS', description: 'A utility-first CSS framework for rapidly building custom designs.', tags: ['css', 'tailwind', 'design'], createdAt: '2025-05-14T08:15:00Z', category: 'Design' },
            { id: 3, url: 'https://github.com', title: 'GitHub', description: 'Where the world builds software.', tags: ['git', 'development', 'collaboration'], createdAt: '2025-05-13T14:45:00Z', category: 'Development' },
            { id: 4, url: 'https://openai.com', title: 'OpenAI', description: 'AI research and deployment company.', tags: ['ai', 'machine-learning', 'technology'], createdAt: '2025-05-12T16:20:00Z', category: 'AI' },
          ]);
          setIsLoadingLinks(false);
        }, 800); // Simulate loading delay
      } catch (err) {
        setErrorLinks(err.message || 'Failed to fetch links.');
        setIsLoadingLinks(false);
      }
    };
    fetchLinks();
  }, []);

  // Placeholder for adding a new link
  const handleAddLink = (newLink) => {
    // TODO: API call to add link
    setLinks(prevLinks => [newLink, ...prevLinks]);
    setShowAddLinkModal(false);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Your Link Collection</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-300">Manage and organize all your important links in one place</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <button 
              className="btn btn-primary flex items-center"
              onClick={() => setShowAddLinkModal(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add New Link
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content area for links */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-white/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium">Total Links</p>
                    <p className="text-2xl font-semibold">{links.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="card bg-gradient-to-br from-secondary-500 to-secondary-600 text-white">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-white/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium">Categories</p>
                    <p className="text-2xl font-semibold">3</p>
                  </div>
                </div>
              </div>
              
              <div className="card bg-gradient-to-br from-accent-500 to-accent-600 text-white">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-white/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium">Last Added</p>
                    <p className="text-sm font-semibold">Today</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Links List */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">My Links</h2>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search links..." 
                    className="input pr-10"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {isLoadingLinks && (
                <div className="flex justify-center items-center py-12">
                  <svg className="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}
              
              {errorLinks && (
                <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700 dark:text-red-200">Error: {errorLinks}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {!isLoadingLinks && !errorLinks && <LinkList links={links} />}
              
              {!isLoadingLinks && !errorLinks && links.length === 0 && (
                <div className="text-center py-12">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No links yet</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by adding your first link.</p>
                  <div className="mt-6">
                    <button 
                      onClick={() => setShowAddLinkModal(true)} 
                      className="btn btn-primary"
                    >
                      Add Your First Link
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar for AI Features and Ads */}
          <div className="space-y-6">
            <AiFeatures />
            <AdPlaceholder adSlotId="dashboard-sidebar-ad" />
            
            {/* Recent Activity */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-600 dark:text-primary-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Added new link</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">OpenAI - 2 days ago</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-secondary-100 dark:bg-secondary-900 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-secondary-600 dark:text-secondary-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Updated link</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">GitHub - 3 days ago</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-accent-100 dark:bg-accent-900 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-accent-600 dark:text-accent-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Created new category</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Development - 5 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add Link Modal - Placeholder */}
      {showAddLinkModal && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setShowAddLinkModal(false)}></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full mx-auto p-6 shadow-xl">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={() => setShowAddLinkModal(false)}
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Add New Link</h3>
              <div className="mt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  This feature will be implemented soon. For now, it's just a placeholder.
                </p>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="btn btn-primary w-full sm:w-auto sm:ml-3"
                onClick={() => setShowAddLinkModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
