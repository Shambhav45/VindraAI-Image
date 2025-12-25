import React, { useEffect, useState } from 'react';
import { UserProfile, GeneratedImage } from '../types';
import { getAllImagesAdmin } from '../services/firebase';
import { ShieldAlert, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AdminProps {
  user: UserProfile;
}

const Admin: React.FC<AdminProps> = ({ user }) => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.role !== 'admin') {
      navigate('/');
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    setLoading(true);
    const data = await getAllImagesAdmin();
    setImages(data);
    setLoading(false);
  };

  if (loading) return <div className="p-12 text-center text-slate-600 dark:text-slate-400"><Loader2 className="animate-spin inline" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
        <ShieldAlert className="text-indigo-600 dark:text-indigo-400" /> Admin Dashboard
      </h1>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <h2 className="font-semibold text-lg text-slate-900 dark:text-white">Recent Generations (Global)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase">
              <tr>
                <th className="px-6 py-3">Image</th>
                <th className="px-6 py-3">Prompt</th>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {images.map((img) => (
                <tr key={img.id} className="border-b dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-6 py-4">
                    <img src={img.imageUrl} alt="thumb" className="w-16 h-10 object-cover rounded" />
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate">{img.prompt}</td>
                  <td className="px-6 py-4">{img.userId.slice(0, 8)}...</td>
                  <td className="px-6 py-4">{new Date(img.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <button className="text-red-600 dark:text-red-400 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;