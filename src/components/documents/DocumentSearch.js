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

  useEffect(() => {
    handleSearch();
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
    if (e) e.preventDefault();
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
    <div className="max-w-7xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-8 text-gray-800">Search Documents</h2>
      
      <form onSubmit={handleSearch} className="space-y-6 mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={searchParams.major_head}
              onChange={handleMajorHeadChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors bg-white"
            >
              <option value="">Select Category</option>
              <option value="Personal">Personal</option>
              <option value="Professional">Professional</option>
              <option value="Company">Company</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Sub-category</label>
            <select
              value={searchParams.minor_head}
              onChange={(e) => setSearchParams(prev => ({ ...prev, minor_head: e.target.value }))}
              disabled={!searchParams.major_head}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed bg-white"
            >
              <option value="">Select Sub-category</option>
              {minorHeadOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

         

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">From Date</label>
            <DatePicker
              selected={searchParams.from_date}
              onChange={date => setSearchParams(prev => ({ ...prev, from_date: date }))}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors bg-white"
              dateFormat="dd-MM-yyyy"
              placeholderText="DD-MM-YYYY"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">To Date</label>
            <DatePicker
              selected={searchParams.to_date}
              onChange={date => setSearchParams(prev => ({ ...prev, to_date: date }))}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors bg-white"
              dateFormat="dd-MM-yyyy"
              placeholderText="DD-MM-YYYY"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Search</label>
            <input
              type="text"
              value={searchParams.search.value}
              onChange={(e) => setSearchParams(prev => ({ 
                ...prev, 
                search: { ...prev.search, value: e.target.value } 
              }))}
              placeholder="Search documents..."
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors bg-white"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                Search
              </>
            )}
          </button>
        </div>
      </form>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : documents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="h-40 bg-gray-100 flex items-center justify-center">
                {doc.file_name && doc.file_name.toLowerCase().endsWith('.pdf') ? (
                  <svg className="h-16 w-16 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path>
                  </svg>
                ) : doc.file_name && doc.file_name.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/) ? (
                  <img 
                    src={doc.file_url} 
                    alt={doc.file_name} 
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNCAxNmgxNm0tMTYtNHYxNm0xNi0xNnYxNm0tMTYtMTZoMTYiIHN0cm9rZT0iI2RlZGUiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==';
                    }}
                  />
                ) : (
                  <svg className="h-16 w-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path>
                  </svg>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 truncate">{doc.file_name || 'Unnamed Document'}</h3>
                    <p className="text-sm text-gray-500">{doc.major_head} - {doc.minor_head}</p>
                  </div>
                  <div className="ml-4">
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                      View
                    </a>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {doc.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700"
                    >
                      {tag.tag_name}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-gray-500">
                  <p className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    {doc.document_date}
                  </p>
                  {doc.document_remarks && (
                    <p className="mt-1 text-gray-600 line-clamp-2 flex items-start">
                      <svg className="w-4 h-4 mr-1 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                      </svg>
                      {doc.document_remarks}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No documents found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default DocumentSearch; 