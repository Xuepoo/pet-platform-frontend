import React, { useEffect, useState } from 'react';
import { usePetStore } from '../store/usePetStore';
import PetCard from '../components/PetCard';
import { Search, Filter } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PetList = () => {
  const { t } = useTranslation();
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
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <form onSubmit={handleSearch} className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              placeholder={t('pets.search')}
              className="pl-10 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm py-2 border"
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
                className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-2 pl-3 pr-8 text-base focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm border"
              >
                <option value="">{t('pets.filter.all')}</option>
                <option value="dog">{t('pets.filter.dogs')}</option>
                <option value="cat">{t('pets.filter.cats')}</option>
                <option value="bird">{t('pets.filter.birds')}</option>
                <option value="other">{t('pets.filter.other')}</option>
              </select>
            </div>
             <div className="min-w-[140px]">
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-2 pl-3 pr-8 text-base focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm border"
              >
                <option value="">{t('pets.allStatuses')}</option>
                <option value="available">{t('pets.available')}</option>
                <option value="adopted">{t('pets.adopted')}</option>
                <option value="pending">{t('pets.pending')}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-10 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p>{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pets.length > 0 ? (
            pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))
          ) : (
             <div className="col-span-full text-center py-20 text-gray-500 dark:text-gray-400">
                <p className="text-xl">{t('pets.noPetsFound')}</p>
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PetList;
