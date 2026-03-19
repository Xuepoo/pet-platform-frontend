import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PenSquare, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import postService, { type Post } from '../services/postService';
import PostCard from '../components/PostCard';
import { useAuthStore } from '../store/useAuthStore';

export default function Feed() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadPosts();
  }, [page]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await postService.getPosts(page, 20);
      if (page === 1) {
        setPosts(response.items);
      } else {
        setPosts(prev => [...prev, ...response.items]);
      }
      setHasMore(response.page < response.pages);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: number) => {
    try {
      await postService.likePost(postId);
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleUnlike = async (postId: number) => {
    try {
      await postService.unlikePost(postId);
    } catch (error) {
      console.error('Failed to unlike post:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"
            >
              {t('feed.title')}
            </motion.h1>
            {user && (
              <Link to="/posts/new">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  <PenSquare className="w-5 h-5" />
                  <span className="font-medium">{t('feed.newPost')}</span>
                </motion.button>
              </Link>
            )}
          </div>

          {/* Posts */}
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={() => handleLike(post.id)}
                onUnlike={() => handleUnlike(post.id)}
              />
            ))}

            {loading && (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
              </div>
            )}

            {!loading && posts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                  {t('feed.noPostsYet')}
                </p>
                {user && (
                  <Link to="/posts/new">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all font-medium"
                    >
                      {t('feed.createFirst')}
                    </motion.button>
                  </Link>
                )}
              </motion.div>
            )}

            {!loading && hasMore && posts.length > 0 && (
              <div className="flex justify-center py-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPage(prev => prev + 1)}
                  className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full shadow-md hover:shadow-lg transition-all font-medium"
                >
                  {t('feed.loadMore')}
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
