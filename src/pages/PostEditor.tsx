import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Loader2, Image as ImageIcon, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import postService, { type PostCreate } from '../services/postService';
import ReactMarkdown from 'react-markdown';

export default function PostEditor() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
      
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError(t('feed.postEditor.contentRequired'));
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // 1. Create Post
      const postData: PostCreate = {
        content: content.trim(),
      };
      if (title.trim()) {
        postData.title = title.trim();
      }
      const newPost = await postService.createPost(postData);

      // 2. Upload Media if any
      if (selectedFiles.length > 0) {
        await Promise.all(
          selectedFiles.map((file) => postService.uploadMedia(newPost.id, file))
        );
      }

      navigate(`/posts/${newPost.id}`);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              to="/feed"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-amber-500 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{t('feed.backToFeed')}</span>
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {showPreview ? t('feed.postEditor.edit') : t('feed.postEditor.preview')}
              </button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              {t('feed.postEditor.title')}
            </h1>

            {error && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title (optional) */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  {t('feed.postEditor.titleLabel')} <span className="text-gray-400">({t('feed.postEditor.optional')})</span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t('feed.postEditor.titlePlaceholder')}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                />
              </div>

              {/* Content */}
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  {t('feed.postEditor.contentLabel')} <span className="text-red-500">{t('feed.postEditor.required')}</span>
                </label>
                {showPreview ? (
                  <div className="w-full min-h-[300px] p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>{content || t('feed.postEditor.noContent')}</ReactMarkdown>
                    </div>
                  </div>
                ) : (
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.ctrlKey && e.key === 'Enter') {
                        handleSubmit(e);
                      }
                    }}
                    rows={12}
                    placeholder={t('feed.postEditor.contentPlaceholder')}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all resize-none text-gray-900 dark:text-white"
                  />
                )}
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {t('feed.postEditor.markdownSupport')}
                </p>
              </div>

              {/* Media Upload */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('feed.postEditor.images', 'Images')}
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-gray-500 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-gray-700 rounded-full transition-colors"
                    title={t('feed.postEditor.addImage', 'Add Image')}
                  >
                    <ImageIcon className="w-5 h-5" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                {previews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    {previews.map((preview, index) => (
                      <div key={index} className="relative group aspect-square">
                        <img
                          src={preview}
                          alt={`Preview ${index}`}
                          className="w-full h-full object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3">
                <Link
                  to="/feed"
                  className="px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
                >
                  {t('feed.postEditor.cancel')}
                </Link>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading || !content.trim()}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{t('feed.postEditor.posting')}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>{t('feed.postEditor.publish')}</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* Markdown Guide */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              {t('feed.postEditor.markdownGuide')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <code className="text-amber-600 dark:text-amber-400">**bold text**</code>
                <span className="text-gray-600 dark:text-gray-400 ml-2">→ <strong>bold text</strong></span>
              </div>
              <div>
                <code className="text-amber-600 dark:text-amber-400">*italic text*</code>
                <span className="text-gray-600 dark:text-gray-400 ml-2">→ <em>italic text</em></span>
              </div>
              <div>
                <code className="text-amber-600 dark:text-amber-400"># Heading 1</code>
                <span className="text-gray-600 dark:text-gray-400 ml-2">→ Large heading</span>
              </div>
              <div>
                <code className="text-amber-600 dark:text-amber-400">- List item</code>
                <span className="text-gray-600 dark:text-gray-400 ml-2">→ Bulleted list</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
