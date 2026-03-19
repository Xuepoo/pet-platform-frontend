import { useTranslation } from 'react-i18next';
import { Mail, MapPin, Phone } from 'lucide-react';

const About = () => {
  const { t } = useTranslation();

  const team = [
    { 
      id: 1, 
      nameKey: 'member1.name', 
      roleKey: 'member1.role',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80'
    },
    { 
      id: 2, 
      nameKey: 'member2.name', 
      roleKey: 'member2.role',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80'
    },
    { 
      id: 3, 
      nameKey: 'member3.name', 
      roleKey: 'member3.role',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=256&q=80'
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-amber-400 to-orange-500 dark:from-amber-500 dark:to-orange-600 text-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            {t('about.title')}
          </h1>
          <p className="mt-6 text-xl max-w-3xl mx-auto text-amber-50">
            {t('about.subtitle')}
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl mb-8">
            {t('about.mission.title')}
          </h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {t('about.mission.description')}
          </p>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center mb-12">
            {t('about.team.title')}
          </h2>
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <div key={member.id} className="text-center group">
                <div className="mx-auto h-40 w-40 rounded-full overflow-hidden mb-6 ring-4 ring-amber-100 dark:ring-amber-900 group-hover:ring-amber-300 dark:group-hover:ring-amber-700 transition-all duration-300 transform group-hover:scale-105">
                  <img 
                    src={member.avatar} 
                    alt={t(`about.team.${member.nameKey}`)}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t(`about.team.${member.nameKey}`)}</h3>
                <p className="text-md text-amber-600 dark:text-amber-400 font-medium">{t(`about.team.${member.roleKey}`)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-amber-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center mb-12">
            {t('about.contact.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-full mb-4">
                <Mail className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">Email Us</p>
              <p className="text-gray-500 dark:text-gray-300 mt-2">contact@petplatform.com</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-full mb-4">
                <Phone className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">Call Us</p>
              <p className="text-gray-500 dark:text-gray-300 mt-2">+1 (555) 123-4567</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-full mb-4">
                <MapPin className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">Visit Us</p>
              <p className="text-gray-500 dark:text-gray-300 mt-2">123 Pet Lane, Cityville</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
