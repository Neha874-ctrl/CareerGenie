import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice';
import { authAPI } from '../services/api';
import type { RootState } from '../store/store';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Lock, Mail, User as UserIcon } from 'lucide-react';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state: RootState) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'student' | 'recruiter'>('student');

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    dispatch(loginStart());
    try {
      const response = await authAPI.signup({ ...data, role: selectedRole });
      const { user, token } = response.data;
      
      dispatch(loginSuccess({ user, token }));
      toast.success(`Welcome to CareerGenie, ${user.name}!`);

      if (user.role === 'recruiter') {
        navigate('/dashboard/recruiter');
      } else {
        navigate('/dashboard/student');
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.error || 'Failed to sign up. Please try again.';
      dispatch(loginFailure(errMsg));
      toast.error(errMsg);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50/50 px-6 py-12">
      <div className="bg-white border border-border-custom p-8 rounded-3xl shadow-xl max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-text-h mb-2">Create Account</h2>
          <p className="text-sm text-text-body/80">Get started with CareerGenie today</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1.5 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setSelectedRole('student')}
            className={`py-2 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
              selectedRole === 'student' ? 'bg-white text-accent shadow-xs' : 'text-text-body hover:text-text-h'
            }`}
          >
            I'm a Student
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('recruiter')}
            className={`py-2 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
              selectedRole === 'recruiter' ? 'bg-white text-accent shadow-xs' : 'text-text-body hover:text-text-h'
            }`}
          >
            I'm a Recruiter
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div className="text-left">
            <label className="block text-xs font-semibold text-text-h uppercase tracking-wider mb-2">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-body/60">
                <UserIcon size={18} />
              </span>
              <input
                type="text"
                placeholder="Jane Doe"
                {...register('name', { required: 'Name is required' })}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-border-custom rounded-xl text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-text-h"
              />
            </div>
            {errors.name && (
              <span className="text-xs text-red-500 mt-1 block">{(errors.name as any).message}</span>
            )}
          </div>

          {/* Email */}
          <div className="text-left">
            <label className="block text-xs font-semibold text-text-h uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-body/60">
                <Mail size={18} />
              </span>
              <input
                type="email"
                placeholder="you@university.edu"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Please enter a valid email address',
                  },
                })}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-border-custom rounded-xl text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-text-h"
              />
            </div>
            {errors.email && (
              <span className="text-xs text-red-500 mt-1 block">{(errors.email as any).message}</span>
            )}
          </div>

          {/* Password */}
          <div className="text-left">
            <label className="block text-xs font-semibold text-text-h uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-body/60">
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters long',
                  },
                })}
                className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-border-custom rounded-xl text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-text-h"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-body/60 hover:text-accent"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <span className="text-xs text-red-500 mt-1 block">{(errors.password as any).message}</span>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-accent text-white font-semibold rounded-xl hover:bg-accent/90 transition-all shadow-md shadow-accent/20 disabled:bg-accent/50 cursor-pointer text-sm"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-xs text-text-body/80 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-accent font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
