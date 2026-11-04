import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Star,
  Sparkles,
  AlertCircle,
  BookOpen,
  Send,
  Lock,
  CheckCircle2
} from 'lucide-react';
import api from '../services/api';

/**
 * AddCourseReviewModal Component
 *
 * Requirements:
 * 1. Only students enrolled with approved & active access can submit reviews.
 * 2. Only 1 review per student per course.
 * 3. Rating (1-5 stars), Review title, Review message.
 * 4. Submitted reviews initially have 'pending' status.
 * 5. Clean, professional AutoOps School modal with viewport clamping and body scroll lock.
 */
const AddCourseReviewModal = ({
  isOpen,
  onClose,
  courseId,
  courseTitle = 'Course',
  user,
  onReviewSubmitted
}) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [headline, setHeadline] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [checkingEligibility, setCheckingEligibility] = useState(true);
  const [eligibility, setEligibility] = useState({ canReview: true, reason: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Check student eligibility upon opening
  useEffect(() => {
    if (!isOpen || !courseId) return;

    let isMounted = true;
    const checkEligibility = async () => {
      try {
        setCheckingEligibility(true);
        setErrorMessage('');
        setSuccessMessage('');

        if (!user) {
          if (isMounted) {
            setEligibility({
              canReview: false,
              reason: 'Please log in to your student account to submit a review for this course.'
            });
            setCheckingEligibility(false);
          }
          return;
        }

        const res = await api.get(`/reviews/check-eligibility/${courseId}`);
        if (isMounted) {
          setEligibility({
            canReview: res.data?.canReview,
            reason: res.data?.reason || '',
            hasReviewed: res.data?.hasReviewed || false,
            review: res.data?.review || null
          });
          if (res.data?.hasReviewed && res.data?.review) {
            setRating(res.data.review.rating || 5);
            setHeadline(res.data.review.headline || res.data.review.title || '');
            setContent(res.data.review.content || res.data.review.comment || '');
          }
        }
      } catch (err) {
        if (isMounted) {
          setEligibility({
            canReview: false,
            reason: err.response?.data?.message || 'Could not verify course enrollment status.'
          });
        }
      } finally {
        if (isMounted) setCheckingEligibility(false);
      }
    };

    checkEligibility();

    return () => {
      isMounted = false;
    };
  }, [isOpen, courseId, user]);

  // Lock background body scroll and listen for Escape key
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

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!user) {
      setErrorMessage('Please sign in to submit your review');
      return;
    }

    if (!headline.trim()) {
      setErrorMessage('Please provide a brief review title');
      return;
    }

    if (!content.trim()) {
      setErrorMessage('Please write your review feedback');
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        courseId,
        studentName: user.name,
        studentEmail: user.email,
        reviewerName: user.name,
        reviewerDesignation: 'Student',
        headline: headline.trim(),
        title: headline.trim(),
        content: content.trim(),
        comment: content.trim(),
        rating: Number(rating) || 5,
        reviewType: 'text',
        status: 'pending' // Enforces admin approval workflow
      };

      const res = await api.post(`/courses/${courseId}/reviews`, payload);

      if (res.data?.success) {
        setSuccessMessage(
          'Thank you! Your review has been submitted successfully and is pending Admin approval.'
        );
        setTimeout(() => {
          onReviewSubmitted?.();
          onClose();
        }, 1500);
      } else {
        setErrorMessage(res.data?.message || 'Failed to submit review');
      }
    } catch (err) {
      console.error('Review submission error:', err);
      setErrorMessage(
        err.response?.data?.message || 'Failed to submit review. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const modalNode = (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4 md:p-6">
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
        aria-labelledby="course-review-modal-title"
        className="relative flex w-full max-w-lg max-h-[90vh] max-h-[90dvh] flex-col overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-2xl border border-gray-100 z-10 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="shrink-0 flex items-center justify-between p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-r from-[#EFF6FF] via-white to-[#FEF9E7]/50">
          <div className="space-y-1 pr-4 min-w-0">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-100 text-[#2563EB] shrink-0">
                <Sparkles className="w-4 h-4" />
              </span>
              <h3
                id="course-review-modal-title"
                className="text-base sm:text-lg font-black text-[#142D52] tracking-tight truncate"
              >
                Add Review for This Course
              </h3>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 truncate">
              <BookOpen className="w-3.5 h-3.5 text-[#3478F6] shrink-0" />
              <span className="font-semibold text-slate-700 truncate">{courseTitle}</span>
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

        {/* Modal Body */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-4">
          {checkingEligibility ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-semibold text-gray-500">Checking course enrollment access...</p>
            </div>
          ) : !eligibility.canReview ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-200">
                <Lock className="w-7 h-7" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h4 className="font-extrabold text-gray-900 text-base">Course Access Required</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{eligibility.reason}</p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-[#142B50] text-white text-xs font-bold hover:bg-[#0f213d] transition cursor-pointer"
                >
                  Understood
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Star Rating Select */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">
                  Your Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const filled = (hoverRating || rating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                        >
                          <Star
                            className={`w-6 h-6 ${
                              filled
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-gray-300 fill-gray-100'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-xs font-bold text-slate-700">
                    {rating} out of 5
                  </span>
                </div>
              </div>

              {/* Review Title / Headline */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">
                  Review Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Excellent hands-on labs and practical guidance!"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  maxLength={120}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition"
                />
              </div>

              {/* Review Message */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">
                  Review Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share details about what you learned, practical exercises, and how this course helped your skills..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  maxLength={1000}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition resize-none"
                />
                <p className="text-[11px] text-gray-400 text-right">
                  {content.length}/1000 characters
                </p>
              </div>

              {/* Reviewer Note */}
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-[11px] text-slate-500 leading-relaxed">
                Reviewing as <strong className="text-slate-800">{user?.name}</strong> ({user?.email}).
                Your review will be verified and published after Admin review.
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#142B50] hover:bg-[#0f213d] text-white text-xs font-extrabold shadow-sm hover:shadow-md transition cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Review</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalNode, document.body);
};

export default AddCourseReviewModal;
