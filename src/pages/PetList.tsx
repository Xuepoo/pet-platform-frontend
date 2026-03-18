import React, { useEffect, useState } from 'react';
import { usePetStore } from '../store/usePetStore';
import PetCard from '../components/PetCard';
import { Search, Filter } from 'lucide-react';

const PetList = () => {
  const { pets, loading, error, fetchPets } = usePetStore();
  const [filters, setFilters] = useState({
    species: '',
    breed: '',
    status: 'available'
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPets(filters);
  }, [fetchPets, filters]); // Intentionally not including filters to avoid loop, we'll handle filter submission manually or use debounce

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPets({ ...filters, search: searchTerm });
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value };
    setFilters(newFilters);
    fetchPets({ ...newFilters, search: searchTerm });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <form onSubmit={handleSearch} className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              placeholder="Search pets..."
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 border"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
          
          <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <div className="flex items-center gap-2 min-w-[140px]">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                name="species"
                value={filters.species}
                onChange={handleFilterChange}
                className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-8 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm border"
              >
                <option value="">All Species</option>
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="bird">Bird</option>
                <option value="other">Other</option>
              </select>
            </div>
             <div className="min-w-[140px]">
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-8 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm border"
              >
                <option value="">All Statuses</option>
                <option value="available">Available</option>
                <option value="adopted">Adopted</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-10 bg-red-50 rounded-lg">
          <p>{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pets.length > 0 ? (
            pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))
          ) : (
             <div className="col-span-full text-center py-20 text-gray-500">
                <p className="text-xl">No pets found matching your criteria.</p>
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PetList;
