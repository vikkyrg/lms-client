import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Star,
  Upload,
  FileText,
  Video,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Clock,
  BookOpen
} from 'lucide-react';
import api from '../services/api';

/**
 * AddCourseReviewModal
 * Clean, responsive modal allowing students and learners to submit text or video reviews
 * directly for the currently opened course.
 *
 * Sizing & Scrolling Architecture:
 * - max-h-[90vh] / max-h-[90dvh] viewport clamping.
 * - Portal-rendered to document.body to avoid parent container stacking/overflow constraints.
 * - Background scroll locking with scrollbar gutter compensation.
 * - Fixed header (shrink-0), scrollable body (min-h-0 flex-1 overflow-y-auto overscroll-contain),
 *   and fixed footer (shrink-0) so the submit button is always accessible.
 */
const AddCourseReviewModal = ({
  isOpen,
  onClose,
  courseId,
  courseTitle = 'Course',
  user,
  onReviewSubmitted
}) => {
  const [reviewType, setReviewType] = useState('text');
  const [reviewerName, setReviewerName] = useState(user?.name || '');
  const [reviewerDesignation, setReviewerDesignation] = useState(
    user?.role === 'student' ? 'Student' : ''
  );
  const [headline, setHeadline] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewDate, setReviewDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    if (user?.name && !reviewerName) {
      setReviewerName(user.name);
    }
  }, [user]);

  // Video specifics
  const [videoSourceType, setVideoSourceType] = useState('external');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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

  const handleAvatarSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPG, PNG, WebP) for avatar');
      return;
    }
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleThumbnailSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file for video cover');
      return;
    }
    setThumbnailFile(file);
    const reader = new FileReader();
    reader.onload = () => setThumbnailPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleVideoFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 100 * 1024 * 1024) {
      setErrorMessage('Video file size exceeds maximum limit of 100MB');
      return;
    }
    setVideoFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!reviewerName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    if (!content.trim()) {
      setErrorMessage('Please enter your review description / feedback');
      return;
    }
    if (reviewType === 'video') {
      if (videoSourceType === 'external' && !videoUrl.trim()) {
        setErrorMessage('Please enter a YouTube, Vimeo, or direct MP4 URL');
        return;
      }
      if (videoSourceType === 'upload' && !videoFile) {
        setErrorMessage('Please select an MP4, WebM, or MOV video file to upload');
        return;
      }
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append('courseId', courseId);
      formData.append('reviewerName', reviewerName.trim());
      formData.append('reviewerDesignation', reviewerDesignation.trim());
      formData.append('headline', headline.trim());
      formData.append('content', content.trim());
      formData.append('rating', String(rating));
      formData.append('reviewDate', reviewDate);
      formData.append('reviewType', reviewType);
      formData.append('status', 'published');

      if (avatarFile) {
        formData.append('avatarFile', avatarFile);
      }

      if (reviewType === 'video') {
        formData.append('videoSourceType', videoSourceType);
        if (videoSourceType === 'upload' && videoFile) {
          formData.append('videoFile', videoFile);
        } else if (videoSourceType === 'external') {
          formData.append('videoUrl', videoUrl.trim());
        }
        if (thumbnailFile) {
          formData.append('thumbnailFile', thumbnailFile);
        }
      }

      // Send to course-specific review creation endpoint
      const res = await api.post(`/courses/${courseId}/reviews`, formData);

      if (res.data?.success) {
        setSuccessMessage('Thank you! Your review has been submitted successfully.');
        setTimeout(() => {
          onReviewSubmitted?.();
          onClose();
        }, 900);
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
        aria-labelledby="course-review-modal-title"
        className="relative flex w-full max-w-xl max-h-[90vh] max-h-[90dvh] flex-col overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-2xl border border-gray-100 z-10 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Fixed Modal Header */}
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
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form id="add-course-review-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Review Type Selector: Text vs Video */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Review Type *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setReviewType('text')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition border cursor-pointer ${
                    reviewType === 'text'
                      ? 'bg-[#142D52] text-white border-[#142D52] shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Text Review</span>
                </button>
                <button
                  type="button"
                  onClick={() => setReviewType('video')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition border cursor-pointer ${
                    reviewType === 'video'
                      ? 'bg-[#142D52] text-white border-[#142D52] shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Video className="w-4 h-4 text-[#F4D36B]" />
                  <span>Video Review</span>
                </button>
              </div>
            </div>

            {/* Reviewer Name and Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Johnson"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full p-2.5 text-xs text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Designation / Role (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cloud Engineer at TechCorp"
                  value={reviewerDesignation}
                  onChange={(e) => setReviewerDesignation(e.target.value)}
                  className="w-full p-2.5 text-xs text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB]"
                />
              </div>
            </div>

            {/* Star Rating and Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Star Rating
                </label>
                <div className="flex items-center gap-1.5 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300 fill-gray-100'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-2">
                    {rating} of 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Review Date
                </label>
                <input
                  type="date"
                  value={reviewDate}
                  onChange={(e) => setReviewDate(e.target.value)}
                  className="w-full p-2.5 text-xs text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB]"
                />
              </div>
            </div>

            {/* Avatar Upload (Optional) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Profile Photo / Avatar (Optional)
              </label>
              <div className="flex items-center gap-3">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                    {reviewerName ? reviewerName.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarSelect}
                  className="text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#2563EB] hover:file:bg-blue-100 cursor-pointer"
                />
              </div>
            </div>

            {/* Headline / Title */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Review Headline (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Best practical DevOps training in the industry!"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full p-2.5 text-xs text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB]"
              />
            </div>

            {/* Review Content / Description */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Review Content / Description *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Share details about your learning experience, hands-on labs, real-world applicability..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-2.5 text-xs text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB]"
              />
            </div>

            {/* Video Specific Section */}
            {reviewType === 'video' && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-[#2563EB]" />
                    Video Review Details
                  </span>
                  <div className="flex items-center gap-2 text-xs">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="videoSourceType"
                        checked={videoSourceType === 'external'}
                        onChange={() => setVideoSourceType('external')}
                      />
                      <span>External URL</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="videoSourceType"
                        checked={videoSourceType === 'upload'}
                        onChange={() => setVideoSourceType('upload')}
                      />
                      <span>Direct Upload</span>
                    </label>
                  </div>
                </div>

                {videoSourceType === 'external' ? (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Video URL (YouTube, Vimeo, or MP4) *
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=... or .mp4 link"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="w-full p-2.5 text-xs text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB]"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Upload Video File (MP4, WebM, MOV - Max 100MB) *
                    </label>
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      onChange={handleVideoFileSelect}
                      className="w-full text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#2563EB] hover:file:bg-blue-100 cursor-pointer"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Video Thumbnail / Cover Image (Optional)
                  </label>
                  <div className="flex items-center gap-3">
                    {thumbnailPreview && (
                      <img
                        src={thumbnailPreview}
                        alt="Cover preview"
                        className="w-16 h-10 object-cover rounded-lg border border-gray-200"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailSelect}
                      className="text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#2563EB] hover:file:bg-blue-100 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
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
            form="add-course-review-form"
            disabled={submitting}
            className="px-5 py-2.5 rounded-xl bg-[#142B50] hover:bg-[#0f213d] text-white text-xs font-extrabold shadow-md hover:shadow-lg transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-[#F4D36B] border-t-transparent rounded-full animate-spin" />
                <span>Submitting Review...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#F4D36B]" />
                <span>Submit Course Review</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalNode, document.body);
};

export default AddCourseReviewModal;