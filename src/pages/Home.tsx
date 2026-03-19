import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { fadeIn, slideUp, staggerContainer } from '../utils/animations';
import { usePetStore } from '../store/usePetStore';

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pets, fetchPets, loading } = usePetStore();

  useEffect(() => {
    // Fetch featured pets (available ones)
    fetchPets({ status: 'available' });
  }, [fetchPets]);

  // Use the first 4 available pets as featured
  const featuredPets = pets.slice(0, 4);

  return (
    <motion.div 
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-amber-50 dark:bg-gray-800 py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            variants={fadeIn}
          >
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl mb-6">
              <span className="block">{t('home.hero.titlePart1', 'Find Your Perfect')}</span>
              <span className="block text-amber-600 dark:text-amber-400">{t('home.hero.titlePart2', 'Companion Today')}</span>
            </h1>
            <p className="mt-4 max-w-xl mx-auto text-xl text-gray-500 dark:text-gray-300 mb-8">
              {t('home.hero.description', 'Give a loving home to a pet in need. Browse our available pets and start your adoption journey today.')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                size="lg" 
                onClick={() => navigate('/pets')}
                className="w-full sm:w-auto text-lg px-8 py-6 bg-amber-600 hover:bg-amber-700 text-white"
              >
                {t('home.hero.browseBtn', 'Browse Pets')}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto text-lg px-8 py-6 border-amber-600 text-amber-600 hover:bg-amber-50 dark:hover:bg-gray-700"
              >
                {t('home.hero.joinBtn', 'Join Us')}
              </Button>
            </div>
          </motion.div>
        </div>
        
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob opacity-20"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000 opacity-20"></div>
          <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000 opacity-20"></div>
        </div>
      </section>

      {/* Featured Pets Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            variants={slideUp}
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              {t('home.featured.title', 'Featured Pets')}
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
              {t('home.featured.subtitle', 'Meet some of our newest friends looking for a forever home.')}
            </p>
          </motion.div>

          {loading ? (
             <div className="flex justify-center items-center py-20">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
             </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
              variants={staggerContainer}
            >
              {featuredPets.map((pet) => (
                <Card 
                  key={pet.id} 
                  className="flex flex-col h-full bg-white dark:bg-gray-800 border-none shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                  variants={slideUp}
                  initial="initial"
                  animate="animate"
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-200">
                    {pet.image_url ? (
                      <img 
                        src={pet.image_url} 
                        alt={pet.name} 
                        className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-4xl">🐾</div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <h3 className="text-xl font-bold text-white">{pet.name}</h3>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">{pet.breed}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{pet.age} {t('profile.age', 'years')}</p>
                    </div>
                    <Button 
                      variant="secondary" 
                      className="w-full mt-4 bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300"
                      onClick={() => navigate(`/pets/${pet.id}`)}
                    >
                      {t('home.featured.meetBtn', 'Meet') + ' ' + pet.name}
                    </Button>
                  </div>
                </Card>
              ))}
            </motion.div>
          )}

          <motion.div 
            className="mt-12 text-center"
            variants={fadeIn}
          >
            <Button 
              variant="link" 
              onClick={() => navigate('/pets')}
              className="text-lg text-amber-600 hover:text-amber-700"
            >
              {t('home.featured.viewAll', 'View all available pets')} &rarr;
            </Button>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;
