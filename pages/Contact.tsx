import React, { useState } from 'react';
import { Send, Mail, CheckCircle2 } from 'lucide-react';
import { sendContactMessage } from '../services/firebase';
import { ADMIN_EMAIL } from '../constants';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendContactMessage(formData.name, formData.email, formData.message);
      // In a real app, trigger a cloud function to email shambhavjha3@gmail.com
      setSent(true);
    } catch (error) {
      console.error(error);
      alert("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-green-100 dark:border-green-900/30">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Message Sent!</h2>
          <p className="text-slate-500 dark:text-slate-400">We'll get back to you shortly.</p>
          <button onClick={() => setSent(false)} className="mt-6 text-indigo-600 dark:text-indigo-400 font-medium hover:underline">Send another</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Get in Touch</h1>
        <p className="text-slate-600 dark:text-slate-400">Have questions about credits, plans, or features?</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
            <input 
              type="email" 
              required
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
            <textarea 
              required
              rows={4}
              value={formData.message}
              onChange={e => setFormData({...formData, message: e.target.value})}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
          >
            {loading ? 'Sending...' : <><Send size={18} /> Send Message</>}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Direct Email:</p>
          <a href={`mailto:${ADMIN_EMAIL}`} className="flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
            <Mail size={16} /> {ADMIN_EMAIL}
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;