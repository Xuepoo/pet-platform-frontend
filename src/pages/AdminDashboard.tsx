import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, type User } from '../store/useAuthStore';
import { getUsers, deleteUser, updateUser } from '../services/userService';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch if user is superuser
    if (user && !user.is_superuser) {
      navigate('/');
      return;
    }
    
    // If no user is logged in, they should probably be redirected to login, 
    // but the route protection might handle that.
    if (!user) {
       // Let ProtectedRoute handle it or navigate to login
       return; 
    }

    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        setError('Failed to fetch users');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user, navigate]);

  const handleDelete = async (id: string) => {
    if (window.confirm(t('admin.confirm_delete', 'Are you sure you want to delete this user?'))) {
      try {
        await deleteUser(id);
        setUsers(users.filter((u) => u.id !== id));
      } catch (err) {
        console.error('Failed to delete user', err);
        alert('Failed to delete user');
      }
    }
  };

  const handleToggleActive = async (userToToggle: User) => {
    try {
      const updatedUser = await updateUser(userToToggle.id, { is_active: !userToToggle.is_active });
      // The backend returns the updated user. We need to replace it in the state.
      // Note: updateUser returns Promise<User>
      setUsers(users.map((u) => (u.id === userToToggle.id ? { ...u, is_active: updatedUser.is_active } : u)));
    } catch (err) {
      console.error('Failed to toggle active status', err);
      alert('Failed to update user status');
    }
  };

  if (!user?.is_superuser) {
    return null; 
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">{t('admin.dashboard')}</h1>

      {/* Desktop View */}
      <div className="hidden md:block overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 font-medium">
            <tr>
              <th className="px-6 py-4">{t('admin.name')}</th>
              <th className="px-6 py-4">{t('admin.email')}</th>
              <th className="px-6 py-4">{t('admin.active')}</th>
              <th className="px-6 py-4">{t('admin.superuser')}</th>
              <th className="px-6 py-4 text-right">{t('admin.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{u.full_name || 'N/A'}</td>
                <td className="px-6 py-4 text-gray-600">{u.email}</td>
                <td className="px-6 py-4">
                  <Badge variant={u.is_active ? 'success' : 'secondary'}>
                    {u.is_active ? t('admin.active') : t('admin.inactive')}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  {u.is_superuser ? (
                    <Badge variant="warning">{t('admin.superuser')}</Badge>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleActive(u)}
                    disabled={u.id === user.id} // Prevent toggling own status
                  >
                    {t('admin.toggle_active')}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(u.id)}
                    disabled={u.id === user.id} // Prevent deleting self
                  >
                    {t('admin.delete')}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {users.map((u) => (
          <Card key={u.id} className="p-4 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="font-semibold text-lg text-gray-900">{u.full_name || 'N/A'}</h3>
                <p className="text-sm text-gray-500">{u.email}</p>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <Badge variant={u.is_active ? 'success' : 'secondary'}>
                  {u.is_active ? t('admin.active') : t('admin.inactive')}
                </Badge>
                {u.is_superuser && (
                  <Badge variant="warning" className="w-fit">{t('admin.superuser')}</Badge>
                )}
              </div>
            </div>
            
            <div className="flex gap-2 mt-2 pt-4 border-t border-gray-100">
               <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleToggleActive(u)}
                  disabled={u.id === user.id}
                >
                  {t('admin.toggle_active')}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleDelete(u.id)}
                  disabled={u.id === user.id}
                >
                  {t('admin.delete')}
                </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
