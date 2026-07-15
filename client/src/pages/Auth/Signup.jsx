import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff, FiKey } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import brandLogo from '../../assets/logo.png';

export default function SignupPage() {
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');

  const onSendOtp = async (data) => {
    setError('');
    setLoading(true);
    try {
      const res = await authAPI.sendOtp({ email: data.email });
      if (res.data.success) {
        setUserData(data);
        setStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const onVerifyOtp = async (data) => {
    setError('');
    setLoading(true);
    const result = await authRegister(userData.name, userData.email, userData.password, userData.phone, data.otp);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-gradient flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <img
              src={brandLogo}
              alt="Perk Foodz Logo"
              style={{ width: '56px', height: '56px', objectFit: 'contain', borderRadius: '12px' }}
            />
            <div className="text-left">
              <div className="font-serif font-bold text-2xl text-gray-900">Perk Foodz</div>
              <div className="text-mustard-500 text-xs font-semibold tracking-widest uppercase">Create Your Account</div>
            </div>
          </Link>
        </div>

        <div className="card p-8">
          <h1 className="font-serif text-2xl font-bold text-gray-900 mb-1">
            {step === 1 ? 'Join the family!' : 'Verify Email'}
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            {step === 1 
              ? 'Create your account to start shopping authentic flavours' 
              : `We've sent an OTP to ${userData?.email}`}
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 mb-4 text-sm">{error}</div>
          )}

          {step === 1 && (
            <form onSubmit={handleSubmit(onSendOtp)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <div className="relative">
                  <FiUser size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name too short' } })} placeholder="Your full name" className="input-field !pl-10" id="signup-name" />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <div className="relative">
                  <FiMail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Valid email required' } })} type="email" placeholder="you@example.com" className="input-field !pl-10" id="signup-email" />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="relative">
                  <FiPhone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input {...register('phone', { pattern: { value: /^[6-9]\d{9}$/, message: 'Enter a valid 10-digit number' } })} placeholder="10-digit mobile (optional)" className="input-field !pl-10" id="signup-phone" />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <div className="relative">
                  <FiLock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })} type={showPassword ? 'text' : 'password'} placeholder="Create a password" className="input-field !pl-10 !pr-10" id="signup-password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                <div className="relative">
                  <FiLock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input {...register('confirmPassword', { required: 'Please confirm your password', validate: (v) => v === password || 'Passwords do not match' })} type="password" placeholder="Re-enter password" className="input-field !pl-10" id="signup-confirm-password" />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-base !py-3.5 disabled:opacity-60" id="signup-submit">
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit(onVerifyOtp)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP *</label>
                <div className="relative">
                  <FiKey size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input {...register('otp', { required: 'OTP is required', minLength: { value: 6, message: 'OTP must be 6 digits' } })} placeholder="6-digit OTP" className="input-field !pl-10 text-center tracking-widest text-lg font-bold" id="signup-otp" />
                </div>
                {errors.otp && <p className="text-red-500 text-xs mt-1">{errors.otp.message}</p>}
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-base !py-3.5 disabled:opacity-60">
                {loading ? 'Verifying & Creating Account...' : 'Verify & Register'}
              </button>
              
              <button type="button" onClick={() => setStep(1)} className="w-full text-center text-sm text-mustard-500 font-semibold hover:underline mt-2">
                Back to edit details
              </button>
            </form>
          )}

          {step === 1 && (
            <>
              <p className="text-center text-xs text-gray-400 mt-4">
                By signing up, you agree to our{' '}
                <Link to="/terms" className="text-mustard-500 hover:underline">Terms</Link> and{' '}
                <Link to="/privacy-policy" className="text-mustard-500 hover:underline">Privacy Policy</Link>
              </p>

              <p className="text-center text-sm text-gray-500 mt-4">
                Already have an account?{' '}
                <Link to="/login" className="text-mustard-500 font-semibold hover:text-mustard-600 transition-colors">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
