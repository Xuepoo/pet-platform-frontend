import { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { usePetStore } from '../store/usePetStore';
import { useAuthStore } from '../store/useAuthStore';
import { useApplicationStore } from '../store/useApplicationStore';
import ApplicationModal from '../components/ApplicationModal';
import { Heart, ArrowLeft, Share2, MapPin, Calendar, Clock, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { selectedPet, loading, error, fetchPetById, toggleFavorite } = usePetStore();
  const { isAuthenticated } = useAuthStore();
  const [adoptionStatus, setAdoptionStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (id) {
      fetchPetById(id);
    }
  }, [id, fetchPetById]);

  const { submitApplication } = useApplicationStore();

  const handleAdoptClick = () => {
    setIsModalOpen(true);
  };

  const handleFavoriteClick = async () => {
    if (!isAuthenticated) {
      // Ideally show toast or redirect
      return;
    }
    if (selectedPet) {
      await toggleFavorite(selectedPet.id);
    }
  };

  const handleApplicationSubmit = async (message: string) => {
    if (!id) return;
    setAdoptionStatus('submitting');
    try {
      await submitApplication(id, message);
      setAdoptionStatus('success');
    } catch (err) {
      setAdoptionStatus('error');
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (error || !selectedPet) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('petDetail.notFound')}</h2>
        <Link to="/pets" className="text-amber-600 hover:text-amber-500">
          {t('petDetail.backToAll')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden my-8">
      <div className="relative h-96 w-full">
        {selectedPet.image_url ? (
          <img
            src={selectedPet.image_url}
            alt={selectedPet.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-6xl">🐾</span>
          </div>
        )}
        <Link
          to="/pets"
          className="absolute top-4 left-4 bg-white/90 p-2 rounded-full shadow-md hover:bg-white transition-colors"
        >
          <ArrowLeft className="h-6 w-6 text-gray-700" />
        </Link>
      </div>

      <div className="p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{selectedPet.name}</h1>
            <div className="flex items-center gap-4 text-gray-600">
               <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800 capitalize">
                {selectedPet.species}
              </span>
              <span className="text-sm">•</span>
              <span className="text-lg">{selectedPet.breed}</span>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
              <Share2 className="h-5 w-5 text-gray-600" />
            </button>
            <button 
              onClick={handleFavoriteClick}
              className={`p-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors ${selectedPet.is_favorited ? 'bg-red-50 border-red-200' : ''}`}
            >
              <Heart className={`h-5 w-5 ${selectedPet.is_favorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="col-span-2 space-y-6">
            <div className="prose max-w-none text-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('petDetail.about')} {selectedPet.name}</h3>
              <p>{selectedPet.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">{t('petDetail.age')}</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">{selectedPet.age} {t('petDetail.years')}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Activity className="h-4 w-4" />
                  <span className="text-sm font-medium">{t('petDetail.gender')}</span>
                </div>
                <p className="text-lg font-semibold text-gray-900 capitalize">{selectedPet.gender}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Activity className="h-4 w-4" />
                  <span className="text-sm font-medium">{t('petDetail.size')}</span>
                </div>
                <p className="text-lg font-semibold text-gray-900 capitalize">{selectedPet.size}</p>
              </div>
               <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">{t('petDetail.status')}</span>
                </div>
                <p className={`text-lg font-semibold capitalize ${
                    selectedPet.status === 'available' ? 'text-green-600' : 
                    selectedPet.status === 'adopted' ? 'text-blue-600' : 'text-orange-600'
                }`}>
                    {t(`pets.${selectedPet.status}`, selectedPet.status)}
                </p>
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('petDetail.interested')} {selectedPet.name}?</h3>
              
              {isAuthenticated ? (
                adoptionStatus === 'success' ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <p className="text-green-800 font-medium">{t('petDetail.submitted')}</p>
                    <p className="text-green-600 text-sm mt-1">{t('petDetail.weWillContact')}</p>
                  </div>
                ) : (
                  <button
                    onClick={handleAdoptClick}
                    disabled={selectedPet.status !== 'available' || adoptionStatus === 'submitting'}
                    className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors shadow-sm ${
                      selectedPet.status === 'available'
                        ? 'bg-amber-600 hover:bg-amber-700'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {adoptionStatus === 'submitting' ? t('petDetail.submitting') : 
                     selectedPet.status === 'available' ? t('petDetail.apply') : t('petDetail.notAvailable')}
                  </button>
                )
              ) : (
                <div className="text-center space-y-4">
                  <p className="text-gray-600 text-sm">{t('petDetail.loginRequired')}</p>
                  <Link
                    to="/login"
                    state={{ from: location }}
                    className="block w-full py-3 px-4 bg-amber-100 text-amber-700 rounded-lg font-medium hover:bg-amber-200 transition-colors"
                  >
                    {t('petDetail.loginToAdopt')}
                  </Link>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-100 space-y-3 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{t('petDetail.location')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span>{t('petDetail.health')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ApplicationModal
        petName={selectedPet.name}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleApplicationSubmit}
      />
    </div>
  );
};

export default PetDetail;
