import React, { useState, useEffect } from 'react';

const LinkModal = ({ isOpen, onClose, onSave, linkToEdit, isLoading }) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState(''); // Comma-separated tags

  useEffect(() => {
    if (linkToEdit) {
      setUrl(linkToEdit.url || '');
      setTitle(linkToEdit.title || '');
      setDescription(linkToEdit.description || '');
      setTags(linkToEdit.tags ? linkToEdit.tags.join(', ') : '');
    } else {
      // Reset form for new link
      setUrl('');
      setTitle('');
      setDescription('');
      setTags('');
    }
  }, [linkToEdit, isOpen]); // Depend on isOpen to reset form when modal opens for a new link

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const linkData = {
      url,
      title,
      description,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''), // Convert comma-separated string to array
    };
    if (linkToEdit && linkToEdit.id) {
      linkData.id = linkToEdit.id; // Include id if editing
    }
    onSave(linkData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            {linkToEdit ? 'Edit Link' : 'Add New Link'}
          </h3>
          <form onSubmit={handleSubmit} className="mt-2 px-7 py-3 space-y-4 text-left">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">URL*</label>
              <input 
                type="url" 
                name="url" 
                id="url" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                required 
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
              <input 
                type="text" 
                name="title" 
                id="title" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white" 
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <textarea 
                name="description" 
                id="description" 
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white" 
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tags (comma-separated)</label>
              <input 
                type="text" 
                name="tags" 
                id="tags" 
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white" 
                disabled={isLoading}
              />
            </div>
            <div className="items-center px-4 py-3 flex justify-end space-x-3">
              <button
                id="cancel-btn"
                onClick={onClose}
                type="button"
                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 text-base font-medium rounded-md w-auto shadow-sm hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                id="save-btn"
                type="submit"
                className={`px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-auto shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (linkToEdit ? 'Saving...' : 'Adding...') : (linkToEdit ? 'Save Changes' : 'Add Link')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LinkModal;

