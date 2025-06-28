import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckSquare,
  ArrowRight,
  User,
  Github,
  Chrome,
  Apple,
  Check,
  AlertCircle
} from 'lucide-react';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  acceptTerms: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
  acceptTerms?: string;
  general?: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    acceptTerms: false
  });

  // Mock user database (in production, this would be a real database)
  const mockUsers = [
    { id: '1', email: 'demo@taskflow.com', password: 'demo123', name: 'Demo User' },
    { id: '2', email: 'john@example.com', password: 'password123', name: 'John Doe' },
    { id: '3', email: 'jane@example.com', password: 'password123', name: 'Jane Smith' }
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Sign up specific validations
    if (!isLogin) {
      // Name validation
      if (!formData.name.trim()) {
        newErrors.name = 'Full name is required';
      } else if (formData.name.trim().length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      }

      // Confirm password validation
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      // Terms acceptance validation
      if (!formData.acceptTerms) {
        newErrors.acceptTerms = 'You must accept the terms and conditions';
      }

      // Check if email already exists
      const existingUser = mockUsers.find(user => user.email.toLowerCase() === formData.email.toLowerCase());
      if (existingUser) {
        newErrors.email = 'An account with this email already exists';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (isLogin) {
        // Handle sign in
        const user = mockUsers.find(
          u => u.email.toLowerCase() === formData.email.toLowerCase() && 
               u.password === formData.password
        );

        if (user) {
          // Store user session (in production, use proper auth tokens)
          localStorage.setItem('taskflow-user', JSON.stringify({
            id: user.id,
            email: user.email,
            name: user.name,
            loginTime: new Date().toISOString()
          }));
          
          console.log('✅ Sign in successful:', user.name);
          navigate('/');
        } else {
          setErrors({ general: 'Invalid email or password. Please try again.' });
        }
      } else {
        // Handle sign up
        const newUser = {
          id: Date.now().toString(),
          email: formData.email,
          password: formData.password,
          name: formData.name
        };

        // Store user session
        localStorage.setItem('taskflow-user', JSON.stringify({
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          loginTime: new Date().toISOString()
        }));

        console.log('✅ Sign up successful:', newUser.name);
        navigate('/');
      }
    } catch (error) {
      setErrors({ general: 'Something went wrong. Please try again.' });
      console.error('Authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    setErrors({});
    
    try {
      console.log(`🔗 Attempting to login with ${provider}...`);
      
      // Simulate social login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful social login
      const socialUser = {
        id: Date.now().toString(),
        email: `user@${provider.toLowerCase()}.com`,
        name: `${provider} User`,
        provider
      };

      localStorage.setItem('taskflow-user', JSON.stringify({
        ...socialUser,
        loginTime: new Date().toISOString()
      }));

      console.log(`✅ ${provider} login successful:`, socialUser.name);
      navigate('/');
    } catch (error) {
      setErrors({ general: `Failed to sign in with ${provider}. Please try again.` });
      console.error(`${provider} login error:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear specific field error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      acceptTerms: false
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Main container */}
      <div className="w-full max-w-md relative z-10">
        {/* Logo and brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-400/30 to-purple-600/30 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl mb-4 hover:scale-110 transition-transform duration-300">
            <CheckSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-2">
            TaskFlow
          </h1>
          <p className="text-white/70 text-lg">
            {isLogin ? 'Welcome back! Sign in to continue.' : 'Create your account to get started.'}
          </p>
        </div>

        {/* Auth form */}
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-8">
          {/* Toggle buttons */}
          <div className="flex bg-white/10 backdrop-blur-xl rounded-2xl p-1 mb-8 border border-white/20">
            <button
              type="button"
              onClick={() => !isLoading && setIsLogin(true)}
              disabled={isLoading}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 ${
                isLogin 
                  ? 'bg-gradient-to-r from-blue-500/80 to-purple-600/80 text-white shadow-lg transform scale-105' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => !isLoading && setIsLogin(false)}
              disabled={isLoading}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 ${
                !isLogin 
                  ? 'bg-gradient-to-r from-blue-500/80 to-purple-600/80 text-white shadow-lg transform scale-105' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Demo credentials info for sign in */}
          {isLogin && (
            <div className="mb-6 p-4 bg-blue-500/10 border border-blue-400/30 rounded-xl">
              <h4 className="text-blue-300 font-medium mb-2 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Demo Credentials
              </h4>
              <div className="text-sm text-blue-200/80 space-y-1">
                <p><strong>Email:</strong> demo@taskflow.com</p>
                <p><strong>Password:</strong> demo123</p>
              </div>
            </div>
          )}

          {/* General error message */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-400/30 rounded-xl flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name field for sign up */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-xl border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-white placeholder-white/60 ${
                      errors.name 
                        ? 'border-red-400/50 focus:ring-red-400/50 focus:border-red-400/50' 
                        : 'border-white/20 focus:ring-blue-400/50 focus:border-blue-400/50'
                    }`}
                    placeholder="Enter your full name"
                    disabled={isLoading}
                  />
                </div>
                {errors.name && (
                  <p className="mt-2 text-red-300 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>
            )}

            {/* Email field */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-xl border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-white placeholder-white/60 ${
                    errors.email 
                      ? 'border-red-400/50 focus:ring-red-400/50 focus:border-red-400/50' 
                      : 'border-white/20 focus:ring-blue-400/50 focus:border-blue-400/50'
                  }`}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-red-300 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-xl border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-white placeholder-white/60 ${
                    errors.password 
                      ? 'border-red-400/50 focus:ring-red-400/50 focus:border-red-400/50' 
                      : 'border-white/20 focus:ring-blue-400/50 focus:border-blue-400/50'
                  }`}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-red-300 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm password field for sign up */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-xl border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-white placeholder-white/60 ${
                      errors.confirmPassword 
                        ? 'border-red-400/50 focus:ring-red-400/50 focus:border-red-400/50' 
                        : 'border-white/20 focus:ring-blue-400/50 focus:border-blue-400/50'
                    }`}
                    placeholder="Confirm your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-red-300 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {/* Remember me / Terms acceptance */}
            <div className="flex items-center justify-between">
              {isLogin ? (
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      disabled={isLoading}
                    />
                    <div className="w-5 h-5 bg-white/10 border-2 border-white/30 rounded group-hover:border-white/50 transition-colors"></div>
                  </div>
                  <span className="text-sm text-white/80 group-hover:text-white transition-colors">Remember me</span>
                </label>
              ) : (
                <label className="flex items-start space-x-3 cursor-pointer group">
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleInputChange}
                      className="sr-only"
                      disabled={isLoading}
                    />
                    <div className={`w-5 h-5 border-2 rounded transition-all duration-200 flex items-center justify-center ${
                      formData.acceptTerms 
                        ? 'bg-blue-500 border-blue-500' 
                        : errors.acceptTerms 
                          ? 'bg-white/10 border-red-400/50' 
                          : 'bg-white/10 border-white/30 group-hover:border-white/50'
                    }`}>
                      {formData.acceptTerms && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                  <span className={`text-sm transition-colors ${
                    errors.acceptTerms ? 'text-red-300' : 'text-white/80 group-hover:text-white'
                  }`}>
                    I accept the{' '}
                    <button type="button" className="text-blue-300 hover:text-blue-200 underline">
                      Terms of Service
                    </button>{' '}
                    and{' '}
                    <button type="button" className="text-blue-300 hover:text-blue-200 underline">
                      Privacy Policy
                    </button>
                  </span>
                </label>
              )}

              {isLogin && (
                <button
                  type="button"
                  className="text-sm text-blue-300 hover:text-blue-200 transition-colors"
                  disabled={isLoading}
                >
                  Forgot password?
                </button>
              )}
            </div>

            {errors.acceptTerms && (
              <p className="text-red-300 text-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.acceptTerms}
              </p>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-blue-500/80 to-purple-600/80 hover:from-blue-500 hover:to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-xl border border-white/20 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <span className="px-4 text-sm text-white/60">or continue with</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>

          {/* Social login buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleSocialLogin('Google')}
              disabled={isLoading}
              className="p-4 bg-white/10 backdrop-blur-xl hover:bg-white/20 rounded-xl transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group transform hover:scale-105 active:scale-95"
            >
              <Chrome className="w-6 h-6 text-white/80 group-hover:text-white mx-auto transition-colors" />
            </button>
            <button
              onClick={() => handleSocialLogin('GitHub')}
              disabled={isLoading}
              className="p-4 bg-white/10 backdrop-blur-xl hover:bg-white/20 rounded-xl transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group transform hover:scale-105 active:scale-95"
            >
              <Github className="w-6 h-6 text-white/80 group-hover:text-white mx-auto transition-colors" />
            </button>
            <button
              onClick={() => handleSocialLogin('Apple')}
              disabled={isLoading}
              className="p-4 bg-white/10 backdrop-blur-xl hover:bg-white/20 rounded-xl transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group transform hover:scale-105 active:scale-95"
            >
              <Apple className="w-6 h-6 text-white/80 group-hover:text-white mx-auto transition-colors" />
            </button>
          </div>

          {/* Footer text */}
          <p className="text-center text-sm text-white/60 mt-8">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={toggleAuthMode}
              disabled={isLoading}
              className="text-blue-300 hover:text-blue-200 font-medium transition-colors disabled:opacity-50"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        {/* Additional info */}
        <div className="text-center mt-8">
          <p className="text-white/50 text-sm">
            By continuing, you agree to our{' '}
            <button className="text-blue-300 hover:text-blue-200 transition-colors underline">
              Terms of Service
            </button>{' '}
            and{' '}
            <button className="text-blue-300 hover:text-blue-200 transition-colors underline">
              Privacy Policy
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;