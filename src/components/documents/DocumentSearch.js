import React, { useState, useEffect } from 'react';
import { documentAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const DocumentSearch = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    major_head: '',
    minor_head: '',
    from_date: null,
    to_date: null,
    tags: [],
    uploaded_by: '',
    start: 0,
    length: 10,
    filterId: '',
    search: {
      value: ''
    }
  });
  const [minorHeadOptions, setMinorHeadOptions] = useState([]);
  const [existingTags, setExistingTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await documentAPI.getDocumentTags();
      if (response.data && response.data.data) {
        setExistingTags(response.data.data.map(tag => tag.tag_name));
      }
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    }
  };

  const handleMajorHeadChange = (e) => {
    const value = e.target.value;
    setSearchParams(prev => ({ ...prev, major_head: value, minor_head: '' }));
    
    // Update minor head options based on major head
    if (value === 'Personal') {
      setMinorHeadOptions(['John', 'Tom', 'Emily']);
    } else if (value === 'Professional') {
      setMinorHeadOptions(['Accounts', 'HR', 'IT', 'Finance']);
    } else if (value === 'Company') {
      setMinorHeadOptions(['Work Order', 'Invoice', 'Contract', 'Report']);
    } else {
      setMinorHeadOptions([]);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Prepare search parameters
      const searchData = {
        ...searchParams,
        from_date: formatDate(searchParams.from_date),
        to_date: formatDate(searchParams.to_date),
        tags: selectedTags.map(tag => ({ tag_name: tag }))
      };
      
      const response = await documentAPI.searchDocuments(searchData);
      
      if (response.data && response.data.status) {
        setDocuments(response.data.data || []);
      } else {
        toast.error(response.data?.data || 'Failed to search documents');
      }
    } catch (error) {
      toast.error(error.response?.data?.data || 'Failed to search documents');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Search Documents</h2>
      
      <form onSubmit={handleSearch} className="space-y-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={searchParams.major_head}
              onChange={handleMajorHeadChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select Category</option>
              <option value="Personal">Personal</option>
              <option value="Professional">Professional</option>
              <option value="Company">Company</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Sub-category</label>
            <select
              value={searchParams.minor_head}
              onChange={(e) => setSearchParams(prev => ({ ...prev, minor_head: e.target.value }))}
              disabled={!searchParams.major_head}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select Sub-category</option>
              {minorHeadOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tags</label>
            <select
              multiple
              value={selectedTags}
              onChange={(e) => setSelectedTags(Array.from(e.target.selectedOptions, option => option.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {existingTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">From Date</label>
            <DatePicker
              selected={searchParams.from_date}
              onChange={date => setSearchParams(prev => ({ ...prev, from_date: date }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              dateFormat="dd-MM-yyyy"
              placeholderText="DD-MM-YYYY"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">To Date</label>
            <DatePicker
              selected={searchParams.to_date}
              onChange={date => setSearchParams(prev => ({ ...prev, to_date: date }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              dateFormat="dd-MM-yyyy"
              placeholderText="DD-MM-YYYY"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Search</label>
            <input
              type="text"
              value={searchParams.search.value}
              onChange={(e) => setSearchParams(prev => ({ 
                ...prev, 
                search: { ...prev.search, value: e.target.value } 
              }))}
              placeholder="Search documents..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : documents.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
            >
              <div className="flex-1 min-w-0">
                <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="focus:outline-none">
                  <p className="text-sm font-medium text-gray-900">{doc.file_name}</p>
                  <p className="text-sm text-gray-500 truncate">{doc.major_head} - {doc.minor_head}</p>
                  <p className="text-xs text-gray-400">{doc.document_date}</p>
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">No documents found</div>
      )}
    </div>
  );
};

export default DocumentSearch; 