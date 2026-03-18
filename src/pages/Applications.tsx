import { useEffect } from 'react';
import { useApplicationStore } from '../store/useApplicationStore';
import { useAuthStore } from '../store/useAuthStore';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, Calendar, MessageSquare } from 'lucide-react';

const Applications = () => {
  const { applications, loading, error, fetchMyApplications } = useApplicationStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyApplications();
    }
  }, [isAuthenticated, fetchMyApplications]);

  if (!isAuthenticated) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your applications</h2>
        <Link to="/login" className="text-indigo-600 hover:text-indigo-500">
          Go to Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Adoption Applications</h1>

      {applications.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <h3 className="mt-2 text-sm font-medium text-gray-900">No applications yet</h3>
          <p className="mt-1 text-sm text-gray-500">Find a pet you love and apply for adoption!</p>
          <div className="mt-6">
            <Link
              to="/pets"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Browse Pets
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => (
            <div key={app.id} className="bg-white shadow rounded-lg overflow-hidden border border-gray-100">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900">
                      Application for Pet ID: <Link to={`/pets/${app.pet_id}`} className="text-indigo-600 hover:underline">{app.pet_id}</Link>
                    </h3>
                  </div>
                  <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize
                    ${app.status === 'approved' ? 'bg-green-100 text-green-800' : 
                      app.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'}`}>
                    {app.status === 'approved' && <CheckCircle className="w-4 h-4 mr-1.5" />}
                    {app.status === 'rejected' && <XCircle className="w-4 h-4 mr-1.5" />}
                    {app.status === 'pending' && <Clock className="w-4 h-4 mr-1.5" />}
                    {app.status}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                      <MessageSquare className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Your Message</p>
                        <p className="mt-1 text-gray-900">{app.message}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Submitted On</p>
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
