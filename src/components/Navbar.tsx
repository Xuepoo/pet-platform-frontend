import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/useAuthStore';
import { LogOut, User, PawPrint, Sun, Moon, Globe } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, logout, user } = useAuthStore();
  const { theme, setTheme } = useTheme();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <PawPrint className="h-8 w-8 text-amber-500 dark:text-amber-400" />
              <span className="font-bold text-xl text-gray-900 dark:text-white">PetPlatform</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/feed"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                {t('Feed')}
              </Link>
              <Link
                to="/pets"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                {t('Find a Pet')}
              </Link>
              <Link
                to="/reports"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                {t('Lost & Found')}
              </Link>
              {isAuthenticated && (
                <Link
                  to="/applications"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  {t('My Applications')}
                </Link>
              )}
              <Link
                to="/about"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                {t('About Us')}
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="relative flex items-center">
              <Globe className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
              <select
                value={i18n.language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="bg-transparent text-sm text-gray-500 dark:text-gray-300 border-none focus:outline-none focus:ring-0 cursor-pointer pr-6"
              >
                <option value="en">EN</option>
                <option value="zh-CN">简体</option>
                <option value="zh-TW">繁體</option>
                <option value="ja">日本語</option>
              </select>
            </div>
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 focus:outline-none"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200 hover:text-amber-500">
                  <User className="h-4 w-4" />
                  <span>{user?.full_name || user?.email}</span>
                </Link>
                <button
                  onClick={logout}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {t('Logout')}
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400"
                >
                  {t('Login')}
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400"
                >
                  {t('Register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
