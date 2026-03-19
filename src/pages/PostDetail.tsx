import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, MessageCircle, Send, User, Loader2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { formatDistanceToNow } from 'date-fns';
import postService, { type PostDetail, type Comment } from '../services/postService';
import { useAuthStore } from '../store/useAuthStore';

export default function PostDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await postService.getPost(parseInt(id));
      setPost(data);
    } catch (error) {
      console.error('Failed to load post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!post) return;
    try {
      if (post.is_liked) {
        await postService.unlikePost(post.id);
        setPost({
          ...post,
          is_liked: false,
          likes_count: post.likes_count - 1,
        });
      } else {
        await postService.likePost(post.id);
        setPost({
          ...post,
          is_liked: true,
          likes_count: post.likes_count + 1,
        });
      }
    } catch (error) {
      console.error('Failed to like/unlike post:', error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !post) return;

    try {
      setSubmitting(true);
      await postService.createComment(post.id, { content: commentText.trim() });
      setCommentText('');
      // Reload post to get new comment
      await loadPost();
    } catch (error) {
      console.error('Failed to post comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const CommentComponent = ({ comment }: { comment: Comment }) => {
    const timeAgo = formatDistanceToNow(new Date(comment.created_at), { addSuffix: true });

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4"
      >
        <div className="flex gap-3">
          {comment.author.avatar ? (
            <img
              src={comment.author.avatar}
              alt={comment.author.full_name || 'User'}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-gray-900 dark:text-white text-sm">
                {comment.author.full_name || 'Anonymous'}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{timeAgo}</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap">
              {comment.content}
            </p>
            <div className="flex items-center gap-4 mt-2">
              <button className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors">
                <Heart className={`w-3 h-3 ${comment.is_liked ? 'fill-red-500 text-red-500' : ''}`} />
                <span>{comment.likes_count}</span>
              </button>
            </div>
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-3 space-y-3">
                {comment.replies.map((reply) => (
                  <CommentComponent key={reply.id} comment={reply} />
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('feed.postDetail.notFound')}
          </h2>
          <Link to="/feed" className="text-amber-500 hover:text-amber-600">
            {t('feed.backToFeed')}
          </Link>
        </div>
      </div>
    );
  }

  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <Link
            to="/feed"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-amber-500 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t('feed.backToFeed')}</span>
          </Link>

          {/* Post */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6"
          >
            {/* Author */}
            <div className="p-6 flex items-center gap-3 border-b border-gray-100 dark:border-gray-700">
              {post.author.avatar ? (
                <img
                  src={post.author.avatar}
                  alt={post.author.full_name || 'User'}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {post.author.full_name || 'Anonymous'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{timeAgo}</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {post.title && (
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {post.title}
                </h1>
              )}
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </div>

              {/* Media */}
              {post.media.length > 0 && (
                <div className={`grid gap-2 mt-6 ${post.media.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  {post.media.map((media) => (
                    <img
                      key={media.id}
                      src={media.url}
                      alt="Post media"
                      className="w-full h-auto object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center gap-6">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleLike}
                className="flex items-center gap-2 group"
              >
                <Heart
                  className={`w-6 h-6 transition-colors ${
                    post.is_liked
                      ? 'fill-red-500 text-red-500'
                      : 'text-gray-500 dark:text-gray-400 group-hover:text-red-500'
                  }`}
                />
                <span className={`font-medium ${post.is_liked ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}`}>
                  {post.likes_count}
                </span>
              </motion.button>

              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <MessageCircle className="w-6 h-6" />
                <span className="font-medium">{post.comments_count}</span>
              </div>
            </div>
          </motion.div>

          {/* Comments */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {t('feed.postDetail.comments')} ({post.comments_count})
            </h2>

            {/* Add Comment */}
            {user && (
              <form onSubmit={handleCommentSubmit} className="mb-6">
                <div className="flex gap-3">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.full_name || 'User'}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.ctrlKey && e.key === 'Enter') {
                          handleCommentSubmit(e);
                        }
                      }}
                      placeholder={t('feed.postDetail.writeComment')}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all resize-none text-gray-900 dark:text-white"
                    />
                    <div className="flex justify-end mt-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={!commentText.trim() || submitting}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        <span>{t('feed.postDetail.comment')}</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {post.comments.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  {t('feed.postDetail.noComments')}
                </p>
              ) : (
                post.comments.map((comment) => (
                  <CommentComponent key={comment.id} comment={comment} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
