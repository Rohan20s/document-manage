import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import OtpInput from 'otp-input-react';

const OTPLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Function to remove country code from phone number
  const removeCountryCode = (phone) => {
  
    if (phone.startsWith('91') && phone.length > 10) {
      return phone.substring(2);
    }
    
    if (phone.startsWith('+91')) {
      return phone.substring(3);
    }
    

    const countryCodes = ['1', '44', '33', '49', '81', '86', '61', '7', '55', '52',"91"];
    for (const code of countryCodes) {
      if (phone.startsWith(code) && phone.length > code.length + 5) {
        return phone.substring(code.length);
      }
    }
    
    // If no country code is found, return the original number
    return phone;
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!phoneNumber) {
      toast.error('Please enter your phone number');
      return;
    }
    
    // Remove country code for any country
    const cleanPhoneNumber = removeCountryCode(phoneNumber);
    console.log('Original:', phoneNumber, 'Cleaned:', cleanPhoneNumber);
    
    setLoading(true);
    try {
      const response = await authAPI.sendOTP(cleanPhoneNumber);
      if (response.data.status) {
        setShowOTP(true);
        toast.success('OTP sent successfully!');
      } else {
        toast.error(response.data.data || 'Failed to send OTP');
      }
    } catch (error) {
      toast.error(error.response?.data?.data || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      toast.error('Please enter OTP');
      return;
    }
    
    // Remove country code for any country
    const cleanPhoneNumber = removeCountryCode(phoneNumber);
    
    setLoading(true);
    try {
      const response = await authAPI.verifyOTP(cleanPhoneNumber, otp);
      if (response.data.status) {
        const userData = {
          id: response.data.data.user_id,
          name: response.data.data.user_name,
          roles: response.data.data.roles
        };
        login(userData, response.data.data.token);
        toast.success('Login successful!');
        navigate('/documents/search');
      } else {
        toast.error(response.data.data || 'Invalid OTP');
      }
    } catch (error) {
      toast.error(error.response?.data?.data || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        {!showOTP ? (
          <form className="mt-8 space-y-6" onSubmit={handleSendOTP}>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1">
                <PhoneInput
                  country={'in'}
                  value={phoneNumber}
                  onChange={phone => setPhoneNumber(phone)}
                  inputClass="form-control"
                  containerClass="w-full"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP
              </label>
              <OtpInput
                value={otp}
                onChange={setOtp}
                OTPLength={6}
                otpType="number"
                disabled={false}
                autoFocus
                className="opt-container"
              />
            </div>
            <div>
              <button
                onClick={handleVerifyOTP}
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowOTP(false)}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Change Phone Number
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OTPLogin; 