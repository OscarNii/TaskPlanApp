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
  AlertCircle,
  Home
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

  const handleGoToHomepage = () => {
    // Create a guest user session for demo purposes
    const guestUser = {
      id: 'guest',
      email: 'guest@taskflow.com',
      name: 'Guest User',
      loginTime: new Date().toISOString(),
      isGuest: true
    };

    localStorage.setItem('taskflow-user', JSON.stringify(guestUser));
    console.log('🏠 Navigating to homepage as guest');
    navigate('/');
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-3 sm:p-4 lg:p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-br from-pink-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Homepage button - responsive positioning */}
      <button
        onClick={handleGoToHomepage}
        disabled={isLoading}
        className="fixed top-3 right-3 sm:top-4 sm:right-4 lg:top-6 lg:right-6 z-50 flex items-center space-x-1 sm:space-x-2 px-3 py-2 sm:px-4 sm:py-2.5 lg:px-6 lg:py-3 bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 group disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 text-sm sm:text-base"
      >
        <Home className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
        <span className="font-medium hidden xs:inline">Go to Homepage</span>
        <span className="font-medium xs:hidden">Home</span>
        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Main container - responsive width and spacing */}
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl relative z-10">
        {/* Logo and brand - responsive sizing */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-400/30 to-purple-600/30 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/20 shadow-2xl mb-3 sm:mb-4 hover:scale-110 transition-transform duration-300">
            <CheckSquare className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-2">
            TaskFlow
          </h1>
          <p className="text-white/70 text-sm sm:text-base lg:text-lg px-4">
            {isLogin ? 'Welcome back! Sign in to continue.' : 'Create your account to get started.'}
          </p>
        </div>

        {/* Auth form - responsive padding */}
        <div className="bg-white/10 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl p-4 sm:p-6 lg:p-8">
          {/* Toggle buttons - responsive sizing */}
          <div className="flex bg-white/10 backdrop-blur-xl rounded-xl sm:rounded-2xl p-1 mb-6 sm:mb-8 border border-white/20">
            <button
              type="button"
              onClick={() => !isLoading && setIsLogin(true)}
              disabled={isLoading}
              className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl font-medium transition-all duration-300 disabled:opacity-50 text-sm sm:text-base ${
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
              className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl font-medium transition-all duration-300 disabled:opacity-50 text-sm sm:text-base ${
                !isLogin 
                  ? 'bg-gradient-to-r from-blue-500/80 to-purple-600/80 text-white shadow-lg transform scale-105' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Demo credentials info for sign in - responsive text */}
          {isLogin && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg sm:rounded-xl">
              <h4 className="text-blue-300 font-medium mb-2 flex items-center text-sm sm:text-base">
                <User className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Demo Credentials
              </h4>
              <div className="text-xs sm:text-sm text-blue-200/80 space-y-1">
                <p><strong>Email:</strong> demo@taskflow.com</p>
                <p><strong>Password:</strong> demo123</p>
              </div>
            </div>
          )}

          {/* Guest access info - responsive text */}
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-500/10 border border-green-400/30 rounded-lg sm:rounded-xl">
            <h4 className="text-green-300 font-medium mb-2 flex items-center text-sm sm:text-base">
              <Home className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Quick Access
            </h4>
            <p className="text-xs sm:text-sm text-green-200/80">
              Want to explore TaskFlow? Click the "Go to Homepage" button above to access the app as a guest user.
            </p>
          </div>

          {/* General error message - responsive text */}
          {errors.general && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-500/10 border border-red-400/30 rounded-lg sm:rounded-xl flex items-center space-x-3">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-xs sm:text-sm">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Name field for sign up - responsive input */}
            {!isLogin && (
              <div>
                <label className="block text-xs sm:text-sm font-medium text-white/80 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-white/10 backdrop-blur-xl border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-white placeholder-white/60 text-sm sm:text-base ${
                      errors.name 
                        ? 'border-red-400/50 focus:ring-red-400/50 focus:border-red-400/50' 
                        : 'border-white/20 focus:ring-blue-400/50 focus:border-blue-400/50'
                    }`}
                    placeholder="Enter your full name"
                    disabled={isLoading}
                  />
                </div>
                {errors.name && (
                  <p className="mt-2 text-red-300 text-xs sm:text-sm flex items-center">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>
            )}

            {/* Email field - responsive input */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-white/80 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-white/10 backdrop-blur-xl border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-white placeholder-white/60 text-sm sm:text-base ${
                    errors.email 
                      ? 'border-red-400/50 focus:ring-red-400/50 focus:border-red-400/50' 
                      : 'border-white/20 focus:ring-blue-400/50 focus:border-blue-400/50'
                  }`}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-red-300 text-xs sm:text-sm flex items-center">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password field - responsive input */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-white/80 mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 bg-white/10 backdrop-blur-xl border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-white placeholder-white/60 text-sm sm:text-base ${
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
                  className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-red-300 text-xs sm:text-sm flex items-center">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm password field for sign up - responsive input */}
            {!isLogin && (
              <div>
                <label className="block text-xs sm:text-sm font-medium text-white/80 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 bg-white/10 backdrop-blur-xl border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-white placeholder-white/60 text-sm sm:text-base ${
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
                    className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-red-300 text-xs sm:text-sm flex items-center">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {/* Remember me / Terms acceptance - responsive layout */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              {isLogin ? (
                <>
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        disabled={isLoading}
                      />
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white/10 border-2 border-white/30 rounded group-hover:border-white/50 transition-colors"></div>
                    </div>
                    <span className="text-xs sm:text-sm text-white/80 group-hover:text-white transition-colors">Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="text-xs sm:text-sm text-blue-300 hover:text-blue-200 transition-colors self-start sm:self-auto"
                    disabled={isLoading}
                  >
                    Forgot password?
                  </button>
                </>
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
                    <div className={`w-4 h-4 sm:w-5 sm:h-5 border-2 rounded transition-all duration-200 flex items-center justify-center ${
                      formData.acceptTerms 
                        ? 'bg-blue-500 border-blue-500' 
                        : errors.acceptTerms 
                          ? 'bg-white/10 border-red-400/50' 
                          : 'bg-white/10 border-white/30 group-hover:border-white/50'
                    }`}>
                      {formData.acceptTerms && <Check className="w-2 h-2 sm:w-3 sm:h-3 text-white" />}
                    </div>
                  </div>
                  <span className={`text-xs sm:text-sm transition-colors ${
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
            </div>

            {errors.acceptTerms && (
              <p className="text-red-300 text-xs sm:text-sm flex items-center">
                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                {errors.acceptTerms}
              </p>
            )}

            {/* Submit button - responsive sizing */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 sm:py-4 bg-gradient-to-r from-blue-500/80 to-purple-600/80 hover:from-blue-500 hover:to-purple-600 text-white rounded-lg sm:rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-xl border border-white/20 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 text-sm sm:text-base"
            >
              {isLoading ? (
                <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider - responsive spacing */}
          <div className="flex items-center my-6 sm:my-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <span className="px-3 sm:px-4 text-xs sm:text-sm text-white/60">or continue with</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>

          {/* Social login buttons - responsive grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <button
              onClick={() => handleSocialLogin('Google')}
              disabled={isLoading}
              className="p-3 sm:p-4 bg-white/10 backdrop-blur-xl hover:bg-white/20 rounded-lg sm:rounded-xl transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group transform hover:scale-105 active:scale-95"
            >
              <Chrome className="w-5 h-5 sm:w-6 sm:h-6 text-white/80 group-hover:text-white mx-auto transition-colors" />
            </button>
            <button
              onClick={() => handleSocialLogin('GitHub')}
              disabled={isLoading}
              className="p-3 sm:p-4 bg-white/10 backdrop-blur-xl hover:bg-white/20 rounded-lg sm:rounded-xl transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group transform hover:scale-105 active:scale-95"
            >
              <Github className="w-5 h-5 sm:w-6 sm:h-6 text-white/80 group-hover:text-white mx-auto transition-colors" />
            </button>
            <button
              onClick={() => handleSocialLogin('Apple')}
              disabled={isLoading}
              className="p-3 sm:p-4 bg-white/10 backdrop-blur-xl hover:bg-white/20 rounded-lg sm:rounded-xl transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group transform hover:scale-105 active:scale-95"
            >
              <Apple className="w-5 h-5 sm:w-6 sm:h-6 text-white/80 group-hover:text-white mx-auto transition-colors" />
            </button>
          </div>

          {/* Footer text - responsive sizing */}
          <p className="text-center text-xs sm:text-sm text-white/60 mt-6 sm:mt-8">
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

        {/* Additional info - responsive text */}
        <div className="text-center mt-6 sm:mt-8 px-4">
          <p className="text-white/50 text-xs sm:text-sm">
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