import { Link } from 'react-router-dom';
import type { Pet } from '../store/usePetStore';
import { Calendar, Activity, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PetCardProps {
  pet: Pet;
}

const PetCard: React.FC<PetCardProps> = ({ pet }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col h-full">
      <div className="h-48 w-full bg-gray-200 dark:bg-gray-700 relative overflow-hidden group">
        {pet.image_url ? (
          <img
            src={pet.image_url}
            alt={pet.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <span className="text-4xl">🐾</span>
          </div>
        )}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm 
          ${pet.status === 'available' ? 'bg-green-100 text-green-800' : 
            pet.status === 'adopted' ? 'bg-blue-100 text-blue-800' : 
            'bg-orange-100 text-orange-800'}`}>
          {t(`pets.${pet.status}`, pet.status)}
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">{pet.name}</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 capitalize">
            {pet.species}
          </span>
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 flex-grow">{pet.description}</p>
        
        <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-300 mb-5">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-500" />
            <span>{pet.age} {t('profile.age')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-500" />
            <span className="capitalize">{pet.gender}</span>
          </div>
        </div>

        <Link
          to={`/pets/${pet.id}`}
          className="block w-full text-center bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <span>{t('pets.learnMore')}</span>
          <Info size={16} />
        </Link>
      </div>
    </div>
  );
};

export default PetCard;
