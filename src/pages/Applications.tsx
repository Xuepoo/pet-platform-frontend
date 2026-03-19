import { useEffect } from 'react';
import { useApplicationStore } from '../store/useApplicationStore';
import { useAuthStore } from '../store/useAuthStore';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, Calendar, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Applications = () => {
  const { applications, loading, error, fetchMyApplications } = useApplicationStore();
  const { isAuthenticated } = useAuthStore();
  const { t } = useTranslation();

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyApplications();
    }
  }, [isAuthenticated, fetchMyApplications]);

  if (!isAuthenticated) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('applications.loginRequired')}</h2>
        <Link to="/login" className="text-amber-600 hover:text-amber-500">
          {t('applications.goToLogin')}
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-600">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('applications.title')}</h1>

      {applications.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <h3 className="mt-2 text-sm font-medium text-gray-900">{t('applications.noApplications')}</h3>
          <p className="mt-1 text-sm text-gray-500">{t('applications.findPet')}</p>
          <div className="mt-6">
            <Link
              to="/pets"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700"
            >
              {t('applications.browsePets')}
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => (
            <div key={app.id} className="bg-white shadow rounded-lg overflow-hidden border border-gray-100">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  {app.pet && app.pet.image_url ? (
                    <img 
                      src={app.pet.image_url} 
                      alt={app.pet.name} 
                      className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-xl">🐾</div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {app.pet ? (
                        <Link to={`/pets/${app.pet_id}`} className="hover:underline text-amber-600">
                          {app.pet.name}
                        </Link>
                      ) : (
                        <span>{t('applications.petId')}: {app.pet_id}</span>
                      )}
                    </h3>
                    {app.pet && (
                      <p className="text-sm text-gray-500">
                        {app.pet.breed} • {app.pet.species}
                      </p>
                    )}
                  </div>
                  
                  <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize
                    ${app.status === 'approved' ? 'bg-green-100 text-green-800' : 
                      app.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'}`}>
                    {app.status === 'approved' && <CheckCircle className="w-4 h-4 mr-1.5" />}
                    {app.status === 'rejected' && <XCircle className="w-4 h-4 mr-1.5" />}
                    {app.status === 'pending' && <Clock className="w-4 h-4 mr-1.5" />}
                    {t(`applications.status.${app.status}`)}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                      <MessageSquare className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">{t('applications.message')}</p>
                        <p className="mt-1 text-gray-900">{app.message}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">{t('applications.submittedOn')}</p>
                        <p className="mt-1 text-gray-900">
                          {new Date(app.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applications;
