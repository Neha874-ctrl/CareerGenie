import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice';
import { authAPI } from '../services/api';
import type { RootState } from '../store/store';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state: RootState) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    dispatch(loginStart());
    try {
      const response = await authAPI.login(data);
      const { user, token } = response.data;
      
      dispatch(loginSuccess({ user, token }));
      toast.success(`Welcome back, ${user.name}!`);

      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'recruiter') {
        navigate('/dashboard/recruiter');
      } else {
        navigate('/dashboard/student');
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.error || 'Failed to login. Please try again.';
      dispatch(loginFailure(errMsg));
      toast.error(errMsg);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50/50 px-6 py-12">
      <div className="bg-white border border-border-custom p-8 rounded-3xl shadow-xl max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-text-h mb-2">Welcome Back</h2>
          <p className="text-sm text-text-body/80">Sign in to manage your campus applications</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                    message: 'Please enter a valid email',
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
                    message: 'Password must be at least 6 characters',
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
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-text-body/80 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-accent font-semibold hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
