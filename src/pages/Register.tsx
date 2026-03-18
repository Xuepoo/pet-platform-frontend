import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, Lock, Mail, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { slideUp } from '../utils/animations';

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak');

  useEffect(() => {
    const pwd = formData.password;
    if (pwd.length === 0) {
        setPasswordStrength('weak');
        return;
    }
    if (pwd.length < 8) {
        setPasswordStrength('weak');
    } else if (pwd.length < 12) {
        setPasswordStrength('medium');
    } else {
        setPasswordStrength('strong');
    }
  }, [formData.password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError(t('register.errors.mismatch'));
      return;
    }

    if (formData.password.length < 8) {
        setError(t('register.errors.weak'));
        return;
    }

    setLoading(true);
    setError('');

    try {
      await register(formData.name, formData.email, formData.password);
      navigate('/');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || t('register.errors.generic'));
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
      if (formData.password.length === 0) return 'bg-gray-200';
      switch (passwordStrength) {
          case 'weak': return 'bg-red-500';
          case 'medium': return 'bg-yellow-500';
          case 'strong': return 'bg-green-500';
          default: return 'bg-gray-200';
      }
  };

  const getStrengthWidth = () => {
      if (formData.password.length === 0) return 'w-0';
      switch (passwordStrength) {
          case 'weak': return 'w-1/3';
          case 'medium': return 'w-2/3';
          case 'strong': return 'w-full';
          default: return 'w-0';
      }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50">
      <Card 
        className="max-w-md w-full space-y-8 p-8"
        variants={slideUp}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('register.title')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('register.subtitle')}{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
              {t('register.signin')}
            </Link>
          </p>
        </div>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-r-md"
          >
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </motion.div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <label htmlFor="name" className="sr-only">
                {t('register.name')}
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 z-10">
                <UserPlus className="h-5 w-5" />
              </div>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="pl-10"
                placeholder={t('register.name')}
              />
            </div>
            
            <div className="relative">
              <label htmlFor="email" className="sr-only">
                {t('register.email')}
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 z-10">
                <Mail className="h-5 w-5" />
              </div>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="pl-10"
                placeholder={t('register.email')}
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="sr-only">
                {t('register.password')}
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 z-10">
                <Lock className="h-5 w-5" />
              </div>
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="pl-10 pr-10"
                placeholder={t('register.password')}
              />
               <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none z-10"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {formData.password.length > 0 && (
                <div className="mt-1">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div 
                            className={`h-full transition-all duration-300 ${getStrengthColor()} ${getStrengthWidth()}`}
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-right">
                        {t(`register.${passwordStrength}`)}
                    </p>
                </div>
            )}

            <div className="relative">
              <label htmlFor="confirmPassword" className="sr-only">
                {t('register.confirmPassword')}
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 z-10">
                <Lock className="h-5 w-5" />
              </div>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="pl-10"
                placeholder={t('register.confirmPassword')}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('register.loading')}
                </span>
              ) : (
                t('register.submit')
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Register;
