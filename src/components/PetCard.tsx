import { Link } from 'react-router-dom';
import type { Pet } from '../store/usePetStore';
import { Calendar, Activity } from 'lucide-react';

interface PetCardProps {
  pet: Pet;
}

const PetCard: React.FC<PetCardProps> = ({ pet }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="h-48 w-full bg-gray-200 relative">
        {pet.imageUrl ? (
          <img
            src={pet.imageUrl}
            alt={pet.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <span className="text-4xl">🐾</span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-semibold text-indigo-600 shadow-sm uppercase tracking-wider">
          {pet.status}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900 truncate">{pet.name}</h3>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
            {pet.species}
          </span>
        </div>
        
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{pet.description}</p>
        
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>{pet.age} years</span>
          </div>
          <div className="flex items-center gap-1">
            <Activity className="w-4 h-4 text-gray-400" />
            <span>{pet.gender}</span>
          </div>
        </div>

        <Link
          to={`/pets/${pet.id}`}
          className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PetCard;
