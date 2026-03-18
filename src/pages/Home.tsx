import { Link } from 'react-router-dom';
import { Heart, Search, Home as HomeIcon } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="text-center max-w-2xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl mb-6">
          Find Your Perfect Companion
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-xl text-gray-500 mb-8">
          Give a loving home to a pet in need. Browse our available pets and start your adoption journey today.
        </p>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-12">
          <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Search className="h-12 w-12 text-indigo-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Search</h3>
            <p className="mt-2 text-sm text-gray-500 text-center">
              Browse pets by species, breed, and location.
            </p>
          </div>
          <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Heart className="h-12 w-12 text-pink-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Connect</h3>
            <p className="mt-2 text-sm text-gray-500 text-center">
              Meet your potential new family member.
            </p>
          </div>
          <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <HomeIcon className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Adopt</h3>
            <p className="mt-2 text-sm text-gray-500 text-center">
              Complete the process and bring them home.
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/pets"
            className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 shadow-lg transition-transform transform hover:-translate-y-1"
          >
            Browse Pets
          </Link>
          <Link
            to="/register"
            className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10 transition-colors"
          >
            Join Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
