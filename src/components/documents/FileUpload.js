import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { documentAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const FileUpload = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [majorHead, setMajorHead] = useState('');
  const [minorHead, setMinorHead] = useState('');
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  const [minorHeadOptions, setMinorHeadOptions] = useState([]);
  const [existingTags, setExistingTags] = useState([]);

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

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
    setMajorHead(value);
    setMinorHead('');
    
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

  const handleAddTag = (e) => {
    e.preventDefault();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!acceptedFiles.length) {
      toast.error('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', acceptedFiles[0]);
    
    // Format the data as a JSON string
    const documentData = {
      major_head: majorHead,
      minor_head: minorHead,
      document_date: formatDate(selectedDate),
      document_remarks: remarks,
      tags: tags.map(tag => ({ tag_name: tag })),
      user_id: localStorage.getItem('user_id') || 'default_user'
    };
    
    formData.append('data', JSON.stringify(documentData));

    setLoading(true);
    try {
      const response = await documentAPI.uploadDocument(formData);
      if (response.data && response.data.status) {
        toast.success('Document uploaded successfully!');
        // Reset form
        setSelectedDate(new Date());
        setMajorHead('');
        setMinorHead('');
        setTags([]);
        setRemarks('');
        acceptedFiles.length = 0;
      } else {
        toast.error(response.data?.data || 'Failed to upload document');
      }
    } catch (error) {
      toast.error(error.response?.data?.data || 'Failed to upload document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg my-4 py-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Upload Documents</h2>
        <Link 
          to="/documents/search" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          Search Documents
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <DatePicker
            selected={selectedDate}
            onChange={date => setSelectedDate(date)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
            dateFormat="dd-MM-yyyy"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            value={majorHead}
            onChange={handleMajorHeadChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
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
            value={minorHead}
            onChange={(e) => setMinorHead(e.target.value)}
            disabled={!majorHead}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Select Sub-category</option>
            {minorHeadOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Tags</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
              placeholder="Add a tag"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              Add
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 inline-flex items-center p-0.5 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Remarks</label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors resize-none"
          />
        </div>

        <div {...getRootProps()} className="mt-4 p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 transition-colors cursor-pointer">
          <div className="space-y-3 text-center">
            <input {...getInputProps()} />
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="text-sm text-gray-600">
              <p className="font-medium">Drag and drop a file here, or click to select a file</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
          </div>
        </div>

        {acceptedFiles.length > 0 && (
          <div className="mt-2 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Selected file: {acceptedFiles[0].name}</p>
          </div>
        )}

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Uploading...' : 'Upload Document'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FileUpload; 