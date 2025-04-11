import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import OTPLogin from './components/auth/OTPLogin';
import CreateUser from './components/admin/CreateUser';
import FileUpload from './components/documents/FileUpload';
import DocumentSearch from './components/documents/DocumentSearch';

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

const Layout = ({ children }) => {
  const { logout } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-indigo-600">Document Management System</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <a href="/documents/upload" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Upload
                </a>
                <a href="/documents/search" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Search
                </a>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={logout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<OTPLogin />} />
          <Route
            path="/documents/upload"
            element={
              <PrivateRoute>
                <Layout>
                  <FileUpload />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/documents/search"
            element={
              <PrivateRoute>
                <Layout>
                  <DocumentSearch />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/create-user"
            element={
              <PrivateRoute>
                <Layout>
                  <CreateUser />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/documents/upload" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
