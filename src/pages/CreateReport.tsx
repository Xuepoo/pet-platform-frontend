import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReportStore } from '../store/useReportStore';
import api from '../services/api';
import { Upload, X } from 'lucide-react';

const CreateReport = () => {
  const navigate = useNavigate();
  const { createReport, loading: submitLoading } = useReportStore();
  
  const [formData, setFormData] = useState({
    pet_name: '',
    description: '',
    location: '',
    report_type: 'lost', // lost or found
    contact_info: '',
    image_url: '',
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      let finalImageUrl = formData.image_url;

      // Upload image if selected
      if (imageFile) {
        setUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append('file', imageFile);

        try {
          const response = await api.post('/upload/', uploadFormData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          finalImageUrl = response.data.url;
        } catch {
          setError('Failed to upload image. Please try again.');
          setUploading(false);
          return;
        }
        setUploading(false);
      }

      await createReport({
        ...formData,
        report_type: formData.report_type as 'lost' | 'found',
        image_url: finalImageUrl,
      });

      navigate('/reports');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create report');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Report a Lost or Found Pet</h1>
        
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="report_type"
                  value="lost"
                  checked={formData.report_type === 'lost'}
                  onChange={(e) => setFormData({ ...formData, report_type: e.target.value })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <span className="ml-2 text-gray-700">Lost Pet</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="report_type"
                  value="found"
                  checked={formData.report_type === 'found'}
                  onChange={(e) => setFormData({ ...formData, report_type: e.target.value })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <span className="ml-2 text-gray-700">Found Pet</span>
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="pet_name" className="block text-sm font-medium text-gray-700">Pet Name (if known)</label>
            <input
              type="text"
              id="pet_name"
              required
              value={formData.pet_name}
              onChange={(e) => setFormData({ ...formData, pet_name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
              placeholder={formData.report_type === 'lost' ? "e.g. Max" : "Leave blank if unknown"}
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              id="location"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
              placeholder="e.g. Central Park, near 5th Ave"
            />
          </div>

          <div>
            <label htmlFor="contact_info" className="block text-sm font-medium text-gray-700">Contact Information</label>
            <input
              type="text"
              id="contact_info"
              required
              value={formData.contact_info}
              onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
              placeholder="Phone number or email"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
              placeholder="Color, breed, distinctive markings, collar details..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
            {!imagePreview ? (
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            ) : (
              <div className="relative mt-2 w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/reports')}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitLoading || uploading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
            >
              {uploading ? 'Uploading Image...' : submitLoading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateReport;
