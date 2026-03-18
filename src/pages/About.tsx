import { useTranslation } from 'react-i18next';
import { Mail, MapPin, Phone, User } from 'lucide-react';

const About = () => {
  const { t } = useTranslation();

  const team = [
    { id: 1, nameKey: 'member1.name', roleKey: 'member1.role' },
    { id: 2, nameKey: 'member2.name', roleKey: 'member2.role' },
    { id: 3, nameKey: 'member3.name', roleKey: 'member3.role' },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-indigo-800 text-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            {t('about.title')}
          </h1>
          <p className="mt-6 text-xl max-w-3xl mx-auto text-indigo-100">
            {t('about.subtitle')}
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-8">
            {t('about.mission.title')}
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-3xl mx-auto leading-relaxed">
            {t('about.mission.description')}
          </p>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
            {t('about.team.title')}
          </h2>
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <div key={member.id} className="text-center group">
                <div className="mx-auto h-40 w-40 rounded-full bg-indigo-100 flex items-center justify-center mb-6 group-hover:bg-indigo-200 transition-colors duration-300">
                  <User className="h-20 w-20 text-indigo-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{t(`about.team.${member.nameKey}`)}</h3>
                <p className="text-md text-indigo-600 font-medium">{t(`about.team.${member.roleKey}`)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-indigo-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
            {t('about.contact.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
              <div className="p-3 bg-indigo-100 rounded-full mb-4">
                <Mail className="h-6 w-6 text-indigo-600" />
              </div>
              <p className="text-lg font-medium text-gray-900">Email Us</p>
              <p className="text-gray-500 mt-2">contact@petplatform.com</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
              <div className="p-3 bg-indigo-100 rounded-full mb-4">
                <Phone className="h-6 w-6 text-indigo-600" />
              </div>
              <p className="text-lg font-medium text-gray-900">Call Us</p>
              <p className="text-gray-500 mt-2">+1 (555) 123-4567</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
              <div className="p-3 bg-indigo-100 rounded-full mb-4">
                <MapPin className="h-6 w-6 text-indigo-600" />
              </div>
              <p className="text-lg font-medium text-gray-900">Visit Us</p>
              <p className="text-gray-500 mt-2">123 Pet Lane, Cityville</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
