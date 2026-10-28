import React, { useState } from 'react';
import api from '../services/api';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });

    try {
      await api.post('/admin/enquiry', formData);
      setStatus({ loading: false, success: true, error: '' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({ loading: false, success: false, error: err.response?.data?.message || 'Failed to submit enquiry' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <span className="text-xs uppercase font-bold tracking-wider text-indigo-600">Contact Us</span>
          <h1 className="text-4xl font-extrabold text-gray-900">Let’s discuss your learning goals</h1>
          <p className="text-gray-600 leading-relaxed text-sm">
            Have questions about course curriculums, team corporate training, or certification validity? Our education specialists are here to guide you.
          </p>

          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Direct Support</p>
                <p className="text-sm font-bold text-gray-900">support@skillelevate.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Global Campus Hub</p>
                <p className="text-sm font-bold text-gray-900">Bengaluru & Silicon Valley</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xl space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Send an Enquiry</h3>

          {status.success && (
            <div className="p-4 bg-emerald-50 text-emerald-700 text-xs rounded-xl flex items-center gap-2 font-medium">
              <CheckCircle className="h-4 w-4" /> Your message has been received! Our team will contact you shortly.
            </div>
          )}

          {status.error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl font-medium">
              {status.error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Your Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Enrollment / Curriculum Question"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Message</label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="How can we assist you?"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={status.loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {status.loading ? 'Sending...' : 'Submit Enquiry'}
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

