import React, { useState } from 'react';
import api from '../services/api';
import { Mail, Phone, MapPin, Send, CheckCircle, MessageSquare, Clock, GraduationCap } from 'lucide-react';
import { PageHero } from '../components/BrandComponents';

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
    <div className="bg-[#FAFBFD] min-h-screen text-[#344054]">
      {/* Page Hero matching brand */}
      <PageHero
        badge="Contact AutoOps School"
        title="Let’s Discuss Your Learning Goals"
        subtitle="Have questions about our training programs in DevOps Engineering, Java Full Stack Development, or Python Full Stack Development? Get in touch with our team."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#3F6FA8] block">
              Direct Contact
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#173563] tracking-tight">
              Reach Our Admissions & Support Team
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              We guide students and working professionals through batch schedules, course modules, fee structures, and enrollment requirements.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-gray-200/90 shadow-2xs">
                <div className="p-3 bg-[#EAF2FC] text-[#2B6FE0] border border-[#D5E4F7] rounded-xl shrink-0">
                  <Mail className="h-5 w-5 stroke-[2.2]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Email Us</p>
                  <a href="mailto:autoopsschool@gmail.com" className="text-sm sm:text-base font-bold text-[#102747] hover:text-[#2B6FE0] transition">
                    autoopsschool@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-gray-200/90 shadow-2xs">
                <div className="p-3 bg-[#EAF2FC] text-[#2B6FE0] border border-[#D5E4F7] rounded-xl shrink-0">
                  <Phone className="h-5 w-5 stroke-[2.2]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Phone / Call</p>
                  <a href="tel:+917483085370" className="text-sm sm:text-base font-bold text-[#102747] hover:text-[#2B6FE0] transition">
                    +91 74830 85370
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-gray-200/90 shadow-2xs">
                <div className="p-3 bg-[#E7F6E7] text-[#1E7E34] border border-[#C3E6CB] rounded-xl shrink-0">
                  <MessageSquare className="h-5 w-5 stroke-[2.2]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">WhatsApp Support</p>
                  <a
                    href="https://wa.me/917483085370"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm sm:text-base font-bold text-[#102747] hover:text-[#1E7E34] transition block"
                  >
                    +91 74830 85370 <span className="text-xs font-normal text-gray-500">(Direct Chat)</span>
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-gray-200/90 shadow-2xs">
                <div className="p-3 bg-[#FFF2BF] text-[#102747] border border-[#F4D36B] rounded-xl shrink-0">
                  <MapPin className="h-5 w-5 stroke-[2.2]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Location</p>
                  <p className="text-sm sm:text-base font-bold text-[#102747]">Bengaluru, Karnataka, India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200/90 shadow-xl space-y-6">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-[#3F6FA8] block mb-1">
                  Online Inquiry
                </span>
                <h3 className="text-2xl font-extrabold text-[#102747]">Send an Enquiry</h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Fill in your details and an AutoOps School advisor will contact you within 24 hours.
                </p>
              </div>

              {status.success && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-2xl flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span>Thank you! Your enquiry has been received. Our team will contact you shortly.</span>
                </div>
              )}

              {status.error && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl">
                  {status.error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#102747] uppercase tracking-wider mb-1.5">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173563]/10 focus:border-[#173563] transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#102747] uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="yourname@gmail.com"
                      className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173563]/10 focus:border-[#173563] transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#102747] uppercase tracking-wider mb-1.5">
                      Course / Subject
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. DevOps Engineering"
                      className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173563]/10 focus:border-[#173563] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#102747] uppercase tracking-wider mb-1.5">
                    Your Message / Questions
                  </label>
                  <textarea
                    required
                    rows="4"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your background, career goals, or any questions about batch schedules..."
                    className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173563]/10 focus:border-[#173563] transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status.loading}
                  className="w-full py-3 px-6 rounded-xl bg-[#173563] hover:bg-[#102747] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="h-4 w-4 text-[#F4D36B]" />
                  <span>{status.loading ? 'Sending Enquiry...' : 'Submit Enquiry'}</span>
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;
