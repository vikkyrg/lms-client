import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Lock, Play, ShoppingCart, Sparkles, CheckCircle, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { formatCoursePrice, isFreeCourse } from '../utils/courseAccess';
import { getEmbedVideoUrl, isEmbedVideo } from '../utils/videoUtils';

/**
 * PreviewLessonModal
 * Plays free preview lessons immediately without authentication or enrollment.
 * Includes smooth stop-on-close and viewport clamping.
 */
export const PreviewLessonModal = ({ lesson, course, onClose, onBuyOrEnroll }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      if (videoRef.current) {
        try {
          videoRef.current.pause();
        } catch (_) {}
      }
    };
  }, [onClose]);

  if (!lesson) return null;

  const videoSrc = lesson.videoUrl || '';
  const isEmbed = isEmbedVideo(videoSrc);
  const isFree = isFreeCourse(course);

  const modalNode = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        className="relative flex w-full max-w-4xl max-h-[92vh] max-h-[92dvh] flex-col overflow-hidden rounded-[20px] bg-white text-slate-800 shadow-2xl border border-[#E2E8F0] z-10 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header - White background, muted blue-gray course title, dark navy lesson title, green free preview badge */}
        <div className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0] bg-white">
          <div className="min-w-0 pr-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 tracking-wider">
                FREE PREVIEW
              </span>
              <span className="text-xs font-semibold text-[#64748B] truncate max-w-md">
                {course?.title}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#162F57] tracking-tight mt-1 truncate">
              {lesson.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Area - Clean 16:9 player container */}
        <div className="min-h-0 flex-1 bg-slate-950 flex items-center justify-center relative overflow-hidden">
          {videoSrc ? (
            isEmbed ? (
              <div className="w-full aspect-video">
                <iframe
                  src={getEmbedVideoUrl(videoSrc)}
                  title={lesson.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="w-full aspect-video max-h-[64vh] bg-black flex items-center justify-center">
                <video
                  ref={videoRef}
                  src={videoSrc}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )
          ) : (
            <div className="p-12 text-center text-slate-400 space-y-2 bg-[#F8FAFC] w-full">
              <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
              <p className="text-sm font-bold text-[#162F57]">Preview video is being processed.</p>
              <p className="text-xs text-[#64748B]">
                This preview lesson has been scheduled by the instructor and will be viewable shortly.
              </p>
            </div>
          )}
        </div>

        {/* Footer - White background with professional Navy button */}
        <div className="shrink-0 px-5 py-4 bg-white border-t border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <p className="text-xs sm:text-sm font-bold text-[#162F57] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#FFD65A] fill-[#FFD65A] shrink-0" />
              Enjoyed this free preview lesson?
            </p>
            <p className="text-xs text-[#64748B]">
              Unlock the complete course to access all lessons, study materials, and your certificate.
            </p>
          </div>
          <button
            onClick={() => {
              onClose();
              onBuyOrEnroll?.();
            }}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#162F57] hover:bg-[#0f213d] active:bg-[#0a172c] text-white font-extrabold text-xs sm:text-sm shadow-sm hover:shadow-md transition cursor-pointer shrink-0"
          >
            <span>
              {isFree ? 'Enroll for Free Access' : `Unlock Course · ${formatCoursePrice(course)}`}
            </span>
            <ArrowRight className="w-4 h-4 text-[#FFD65A]" />
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalNode, document.body);
};

/**
 * PremiumLockModal
 * Displayed when an un-enrolled user clicks a locked lesson (lesson 3 onward).
 */
export const PremiumLockModal = ({ course, lesson, onClose, onBuyOrEnroll, onWatchPreview }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

  if (!course) return null;

  const isFree = isFreeCourse(course);

  const modalNode = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        className="relative flex w-full max-w-md flex-col overflow-hidden rounded-3xl bg-white shadow-2xl border border-gray-100 z-10 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-6 text-center space-y-3 bg-gradient-to-b from-[#EFF6FF] via-white to-white">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-900 border border-amber-200">
              Premium Lesson Locked
            </span>
            <h3 className="text-xl font-black text-[#142D52] tracking-tight mt-2">
              {lesson?.title || 'Course Lesson'}
            </h3>
            <p className="text-xs font-semibold text-slate-500 mt-1">{course.title}</p>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-2 space-y-3 text-center">
          <p className="text-sm font-semibold text-slate-700">
            Enjoyed the free previews? Unlock the complete course to continue learning.
          </p>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-left text-xs space-y-2">
            <div className="flex items-center justify-between font-bold text-[#142D52] pb-1.5 border-b border-slate-200">
              <span>Course Access</span>
              <span className="text-sm text-[#2563EB]">{formatCoursePrice(course)}</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-600 font-medium">
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>All video modules unlocked</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Downloadable study PDFs &amp; code guides</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Verified Certificate of Completion</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 pt-3 space-y-2.5">
          <button
            onClick={() => {
              onClose();
              onBuyOrEnroll?.();
            }}
            className="w-full py-3.5 px-4 rounded-xl bg-[#142D52] hover:bg-[#0f213d] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {isFree ? (
              <>
                <Sparkles className="w-4 h-4 text-[#F4D36B]" />
                <span>Enroll for Free Access</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 text-[#3478F6]" />
                <span>Buy Course · {formatCoursePrice(course)}</span>
              </>
            )}
          </button>

          {onWatchPreview && (
            <button
              onClick={() => {
                onClose();
                onWatchPreview?.();
              }}
              className="w-full py-2.5 px-4 rounded-xl border border-gray-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition cursor-pointer"
            >
              Continue Watching Free Preview
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full py-2 text-center text-xs text-slate-400 hover:text-slate-600 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalNode, document.body);
};

