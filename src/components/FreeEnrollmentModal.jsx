import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  User,
  ShieldCheck,
  Clock,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import api from '../services/api';

/**
 * FreeEnrollmentModal Component
 * Provides a clean, responsive modal dialog for submitting a Free Course Enrollment.
 * Collects learner details (Name, Email, Phone Number, Optional notes/goals),
 * preserves background scroll locking, internal overscroll-contain scrolling,
 * fixed header, and accessible submit action footer.
 */
const FreeEnrollmentModal = ({
  isOpen,
  onClose,
  course,
  user,
  onEnrollmentSuccess
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [learningGoal, setLearningGoal] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Prefill details from active logged-in user
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user, isOpen]);

  // Prevent background page scrolling when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !course) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Phone number is required for enrollment and admin verification');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('Please confirm agreement to course access guidelines');
      return;
    }

    try {
      setSubmitting(true);

      // If user phone is missing on profile, update profile phone concurrently
      if (user && !user.phone && phone.trim()) {
        try {
          await api.put('/auth/profile', {
            name: name.trim(),
            phone: phone.trim()
          });
        } catch (_) {}
      }

      // Submit enrollment to existing /enrollments/free API
      const res = await api.post('/enrollments/free', {
        courseId: course._id,
        phone: phone.trim(),
        learningGoal: learningGoal.trim()
      });

      if (res.data?.success) {
        setSuccessMessage('Enrollment request submitted! Awaiting Admin review.');
        setTimeout(() => {
          onEnrollmentSuccess?.(res.data);
          onClose();
        }, 900);
      } else {
        setErrorMessage(res.data?.message || 'Enrollment request failed');
      }
    } catch (err) {
      console.error('Enrollment error:', err);
      setErrorMessage(
        err.response?.data?.message ||
          'Enrollment submission failed. Please verify your details and try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const modalNode = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="free-enrollment-title"
        className="relative flex w-full max-w-xl max-h-[90vh] max-h-[90dvh] flex-col overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-2xl border border-gray-100 z-10 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Fixed Modal Header */}
        <div className="shrink-0 flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-[#EFF6FF] via-white to-[#FEF9E7]/50 p-4 sm:p-5">
          <div className="space-y-1 pr-4 min-w-0">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
                <Sparkles className="w-4 h-4 text-emerald-600" />
              </span>
              <h3
                id="free-enrollment-title"
                className="text-base sm:text-lg font-black text-[#142D52] tracking-tight truncate"
              >
                Enroll for Free
              </h3>
              <span className="shrink-0 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                100% Free
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 truncate">
              <BookOpen className="w-3.5 h-3.5 text-[#3478F6] shrink-0" />
              <span className="font-semibold text-slate-700 truncate">{course.title}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 p-2 text-gray-400 hover:text-gray-700 hover:bg-white rounded-full transition shadow-2xs cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-4">
          {errorMessage && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Value Callout */}
          <div className="rounded-2xl bg-gradient-to-r from-[#EFF6FF] via-[#F8FAFC] to-[#FEF9E7]/40 border border-[#DBEAFE] p-3.5 sm:p-4 text-xs text-slate-700 space-y-2">
            <p className="font-bold text-[#142D52]">Included in Free Enrollment:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-medium text-slate-600">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>3 Months Full Access</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Downloadable Study PDFs</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Practical DevOps Labs</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Official Verified Certificate</span>
              </li>
            </ul>
          </div>

          <form id="free-enrollment-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Student Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Student Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB]"
                />
              </div>
            </div>

            {/* Email and Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    disabled={Boolean(user?.email)}
                    placeholder="learner@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs text-gray-900 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] disabled:text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Phone Number * <span className="text-[10px] font-normal text-slate-400">(Verification)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB]"
                  />
                </div>
              </div>
            </div>

            {/* Learning Goals or Background */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Learning Goals or Current Role <span className="text-[10px] font-normal text-slate-400">(Optional)</span>
              </label>
              <textarea
                rows={2}
                placeholder="Tell us what you hope to achieve with this course (e.g. CI/CD mastery, transitioning to DevOps)..."
                value={learningGoal}
                onChange={(e) => setLearningGoal(e.target.value)}
                className="w-full p-2.5 text-xs text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB]"
              />
            </div>

            {/* Admin Review Agreement Notice */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-[11px] text-slate-600">
              <ShieldCheck className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800">Admin Approval Workflow</p>
                <p className="mt-0.5">
                  To ensure quality learning cohorts, free enrollments are reviewed by administrators. You will be notified immediately upon approval.
                </p>
              </div>
            </div>

            {/* Checkbox agreement */}
            <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded border-gray-300 text-[#2563EB] focus:ring-blue-500"
              />
              <span>I confirm that my details are accurate and agree to AutoOps School student guidelines.</span>
            </label>
          </form>
        </div>

        {/* Fixed Modal Footer */}
        <div className="shrink-0 flex items-center justify-end gap-3 border-t border-gray-100 bg-white p-4 sm:p-5">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50 transition cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="free-enrollment-form"
            disabled={submitting}
            className="px-5 py-2.5 rounded-xl bg-[#142B50] hover:bg-[#0f213d] active:bg-[#0a172c] text-white text-xs font-extrabold shadow-md hover:shadow-lg transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-[#F4D36B] border-t-transparent rounded-full animate-spin" />
                <span>Submitting Enrollment...</span>
              </>
            ) : (
              <>
                <span>Complete Free Enrollment</span>
                <ArrowRight className="w-4 h-4 text-[#F4D36B]" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalNode, document.body);
};

export default FreeEnrollmentModal;
