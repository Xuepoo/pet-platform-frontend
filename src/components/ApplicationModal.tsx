import { useState } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ApplicationModalProps {
  petName: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (message: string) => Promise<void>;
}

const ApplicationModal = ({ petName, isOpen, onClose, onSubmit }: ApplicationModalProps) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError(t('petDetail.modal.errorEmpty'));
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      await onSubmit(message);
      onClose();
    } catch {
      setError(t('petDetail.modal.errorSubmit'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-10">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    {t('petDetail.modal.adopt')} {petName}
                  </h3>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-4">
                    {t('petDetail.modal.intro')} {petName}.
                  </p>
                  <form onSubmit={handleSubmit}>
                    <textarea
                      className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-amber-500 focus:border-amber-500"
                      rows={4}
                      placeholder={t('petDetail.modal.placeholder')}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                    {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
                    <div className="mt-4 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 sm:text-sm"
                      >
                        {t('petDetail.modal.cancel')}
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-amber-600 text-base font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 sm:text-sm disabled:bg-gray-400"
                      >
                        {isSubmitting ? t('petDetail.modal.submitting') : t('petDetail.modal.submit')}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationModal;
