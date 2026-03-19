import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, MoreHorizontal, User, Edit2, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import type { Post } from '../services/postService';
import postService from '../services/postService';
import { formatDistanceToNow } from 'date-fns';
import { useAuthStore } from '../store/useAuthStore';

interface PostCardProps {
  post: Post;
  onLike: () => void;
  onUnlike: () => void;
  onDelete?: () => void;
}

export default function PostCard({ post, onLike, onUnlike, onDelete }: PostCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isLiked, setIsLiked] = useState(post.is_liked);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [showMenu, setShowMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Compare as strings to handle type mismatch (user.id is string, author_id is number)
  const isOwner = user?.id?.toString() === post.author_id?.toString();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLike = async () => {
    if (isLiked) {
      setIsLiked(false);
      setLikesCount(prev => prev - 1);
      await onUnlike();
    } else {
      setIsLiked(true);
      setLikesCount(prev => prev + 1);
      await onLike();
    }
  };

  const handleEdit = () => {
    setShowMenu(false);
    navigate(`/posts/${post.id}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm(t('feed.confirmDelete', '确定要删除这条动态吗？'))) {
      return;
    }
    try {
      setDeleting(true);
      await postService.deletePost(post.id);
      setShowMenu(false);
      onDelete?.();
    } catch (error) {
      console.error('Failed to delete post:', error);
    } finally {
      setDeleting(false);
    }
  };

  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <Link to={`/profile/${post.author_id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          {post.author.avatar ? (
            <img
              src={post.author.avatar}
              alt={post.author.full_name || 'User'}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {post.author.full_name || 'Anonymous'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{timeAgo}</p>
          </div>
        </Link>
        
        {/* Dropdown Menu */}
        {isOwner && (
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <MoreHorizontal className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                <button
                  onClick={handleEdit}
                  className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  {t('feed.edit', '编辑')}
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="w-full px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  {deleting ? t('feed.deleting', '删除中...') : t('feed.delete', '删除')}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <Link to={`/posts/${post.id}`} className="block">
        <div className="px-4 pb-3">
          {post.title && (
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {post.title}
            </h3>
          )}
          <div className="prose prose-sm dark:prose-invert max-w-none line-clamp-6">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </div>

        {/* Media */}
        {post.media.length > 0 && (
          <div className={`grid gap-2 px-4 pb-3 ${post.media.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {post.media.slice(0, 4).map((media) => (
              <img
                key={media.id}
                src={media.url}
                alt="Post media"
                className="w-full h-64 object-cover rounded-lg"
              />
            ))}
          </div>
        )}
      </Link>

      {/* Actions */}
      <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
            className="flex items-center gap-2 group"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isLiked
                  ? 'fill-red-500 text-red-500'
                  : 'text-gray-500 dark:text-gray-400 group-hover:text-red-500'
              }`}
            />
            <span className={`text-sm font-medium ${isLiked ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}`}>
              {likesCount}
            </span>
          </motion.button>

          <Link
            to={`/posts/${post.id}`}
            className="flex items-center gap-2 group hover:text-amber-500 transition-colors"
          >
            <MessageCircle className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-amber-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-amber-500">
              {post.comments_count}
            </span>
          </Link>

          <button className="flex items-center gap-2 group hover:text-amber-500 transition-colors">
            <Share2 className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-amber-500" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
