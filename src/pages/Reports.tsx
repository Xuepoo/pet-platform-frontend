import { useEffect, useState } from 'react';
import { useReportStore } from '../store/useReportStore';
import { useAuthStore } from '../store/useAuthStore';
import { MapPin, AlertCircle, CheckCircle, Search, Plus, Filter, User, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';

const Reports = () => {
  const { t } = useTranslation();
  const { reports, loading, error, fetchReports } = useReportStore();
  const { isAuthenticated } = useAuthStore();
  const [filter, setFilter] = useState<'all' | 'lost' | 'found'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const filteredReports = reports.filter((report) => {
    const matchesFilter = filter === 'all' || report.report_type === filter;
    const matchesSearch = 
      report.pet_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('reports.title')}</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">{t('reports.subtitle')}</p>
        </div>
        
        {isAuthenticated && (
          <Link
            to="/reports/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 transition-colors"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            {t('reports.reportButton')}
          </Link>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="focus:ring-amber-500 focus:border-amber-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md py-2 border"
              placeholder={t('reports.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'lost' | 'found')}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md border"
            >
              <option value="all">{t('reports.allReports')}</option>
              <option value="lost">{t('reports.lostPets')}</option>
              <option value="found">{t('reports.foundPets')}</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">
          <p>{error}</p>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">{t('reports.noReports')}</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('reports.adjustFilters')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredReports.map((report) => (
            <div key={report.id} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
              {report.image_url && (
                <div className="h-48 w-full bg-gray-200 dark:bg-gray-700">
                  <img src={report.image_url} alt={report.pet_name} className="h-full w-full object-cover" />
                </div>
              )}
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{report.pet_name}</h3>
                    <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      {report.location}
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    report.report_type === 'lost' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {t(`reports.${report.report_type}`)}
                  </span>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{report.description}</p>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center">
                    {report.status === 'resolved' ? (
                      <span className="flex items-center text-sm text-green-600 dark:text-green-400 font-medium">
                        <CheckCircle className="mr-1.5 h-4 w-4" />
                        {t('reports.resolved')}
                      </span>
                    ) : (
                      <span className="flex items-center text-sm text-amber-600 dark:text-amber-400 font-medium">
                        <AlertCircle className="mr-1.5 h-4 w-4" />
                        {t('reports.open')}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {report.created_at ? formatDistanceToNow(new Date(report.created_at), { addSuffix: true }) : t('reports.unknown')}
                  </div>
                </div>

                {/* Author Info */}
                {report.author && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      {report.author.avatar ? (
                        <img 
                          src={report.author.avatar} 
                          alt={report.author.full_name || t('reports.reporter')}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {report.author.full_name || t('reports.anonymous')}
                        </p>
                        {report.contact_info && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {report.contact_info}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reports;
