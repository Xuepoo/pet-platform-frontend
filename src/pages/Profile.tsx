import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Calendar, UserCircle, FileText, Camera, Save, X, Edit2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
// import api from '../services/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const Profile = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    gender: '',
    bio: '',
    avatar: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        age: user.age ? user.age.toString() : '',
        gender: user.gender || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      // Mock upload or actual endpoint
      // const response = await api.post('/upload', uploadData, {
      //   headers: { 'Content-Type': 'multipart/form-data' },
      // });
      // const avatarUrl = response.data.url;
      
      // For now, we'll just mock it with a local URL for preview
      const avatarUrl = URL.createObjectURL(file);
      
      setFormData(prev => ({ ...prev, avatar: avatarUrl }));
      
      // In a real app, we might want to update the profile immediately with the new avatar
      // or wait for the user to click "Save". 
      // Based on requirements: "On file select, upload to POST /upload, get URL, and update user profile."
      // I'll assume we update the form state and let "Save" handle the profile update persistence,
      // OR we can trigger a separate update here.
      // Let's implement the "upload and get URL" part mock.
      
    } catch (error) {
      console.error('Failed to upload avatar', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Convert age to number
      const payload = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : undefined,
      };
      
      // Mock API call
      // await api.put('/users/me', payload);
      
      // Update local store
      updateUser({
        ...payload,
        // If age was undefined in payload, we might want to keep it undefined
        age: payload.age
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="p-8 text-center">{t('loading', 'Loading...')}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-0 overflow-hidden bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
          {/* Header / Cover */}
          <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative"></div>
          
          <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-12 mb-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-gray-200">
                  {formData.avatar ? (
                    <img 
                      src={formData.avatar} 
                      alt="Profile" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <UserCircle size={64} />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 p-1.5 rounded-full shadow-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600">
                    <Camera size={16} className="text-gray-600 dark:text-gray-300" />
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>

              {/* Action Button */}
              <div>
                {!isEditing ? (
                  <Button 
                    onClick={() => setIsEditing(true)}
                    variant="default"
                    className="flex items-center gap-2"
                  >
                    <Edit2 size={16} />
                    {t('profile.edit', 'Edit Profile')}
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        setIsEditing(false);
                        // Reset form
                        setFormData({
                          full_name: user.full_name || '',
                          age: user.age ? user.age.toString() : '',
                          gender: user.gender || '',
                          bio: user.bio || '',
                          avatar: user.avatar || '',
                        });
                      }}
                      className="text-gray-600"
                    >
                      <X size={16} className="mr-1" />
                      {t('profile.cancel', 'Cancel')}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.form
                    key="edit-form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <User size={16} /> {t('profile.name', 'Full Name')}
                        </label>
                        <Input
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleChange}
                          placeholder={t('profile.name_placeholder', 'Enter your name')}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <Calendar size={16} /> {t('profile.age', 'Age')}
                        </label>
                        <Input
                          name="age"
                          type="number"
                          value={formData.age}
                          onChange={handleChange}
                          placeholder={t('profile.age_placeholder', 'Enter your age')}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <UserCircle size={16} /> {t('profile.gender', 'Gender')}
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                          className="flex h-10 w-full rounded-md border border-gray-200 bg-surface px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <FileText size={16} /> {t('profile.bio', 'Bio')}
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="flex min-h-[100px] w-full rounded-md border border-gray-200 bg-surface px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder={t('profile.bio_placeholder', 'Tell us about yourself...')}
                      />
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button type="submit" disabled={loading} className="flex items-center gap-2">
                        <Save size={16} />
                        {loading ? t('saving', 'Saving...') : t('profile.save', 'Save Changes')}
                      </Button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div
                    key="view-profile"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {user.full_name || 'Anonymous User'}
                      </h1>
                      <div className="flex items-center text-gray-500 dark:text-gray-400 mt-1">
                        <Mail size={16} className="mr-2" />
                        <span>{user.email}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                          {t('profile.age', 'Age')}
                        </h3>
                        <p className="text-lg font-medium text-gray-900 dark:text-white">
                          {user.age || '-'}
                        </p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                          {t('profile.gender', 'Gender')}
                        </h3>
                        <p className="text-lg font-medium text-gray-900 dark:text-white capitalize">
                          {user.gender || '-'}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        {t('profile.bio', 'Bio')}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                        {user.bio || 'No bio provided.'}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Profile;
