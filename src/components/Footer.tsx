import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 mt-auto transition-colors duration-200">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} Pet Platform. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>for animals</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
