import React, { useRef, useState, useEffect, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Play,
  Calendar,
  Sparkles,
  Award,
  Video,
  Quote,
  CheckCircle2,
  Plus
} from 'lucide-react';
import VideoPlayerModal from './VideoPlayerModal';
import { AnimatedSection } from './AnimatedSection';
import { resolveMediaUrl } from '../utils/videoUtils';

/**
 * CourseReviewsCarousel Component
 * Continuous, smooth right-to-left marquee animation across the FULL AVAILABLE WIDTH.
 *
 * Requirements:
 * 1. Automatic continuous linear right-to-left marquee animation using CSS keyframes.
 * 2. Pauses on hover, touch, or active video modal.
 * 3. Responsive card dimensions:
 *    - Desktop (>= 1024px): 3 complete cards across viewport width with 24px gap.
 *    - Tablet (640px - 1023px): 2 complete cards with 24px gap.
 *    - Mobile (< 640px): 1 complete card with full width.
 * 4. Infinite looping: Seamless translateX(0) to translateX(-50%) with 2 identical repeated sets.
 * 5. Manual Previous & Next buttons shift the track by 1 review group.
 * 6. Responsive to prefers-reduced-motion.
 */
const CourseReviewsCarousel = ({
  reviews = [],
  courseTitle = 'Course',
  onOpenAddReview
}) => {
  const [activeVideo, setActiveVideo] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [manualOffset, setManualOffset] = useState(0);
  const containerRef = useRef(null);

  // Measure container width for responsive card calculation
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();

    const resizeObserver = new ResizeObserver(() => updateWidth());
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    window.addEventListener('resize', updateWidth);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  // Detect prefers-reduced-motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Exact card width so:
  // Desktop: 3 cards fit exactly in containerWidth (gap = 24px -> width = (containerWidth - 48) / 3)
  // Tablet: 2 cards fit exactly in containerWidth (gap = 24px -> width = (containerWidth - 24) / 2)
  // Mobile: 1 card fits exactly in containerWidth (width = containerWidth)
  const cardWidth = useMemo(() => {
    if (!containerWidth) return 320;
    if (containerWidth >= 1024) {
      return Math.floor((containerWidth - 48) / 3);
    }
    if (containerWidth >= 640) {
      return Math.floor((containerWidth - 24) / 2);
    }
    return Math.floor(containerWidth);
  }, [containerWidth]);

  // Construct duplicated base sequence for seamless -50% translateX loop
  const { displayItems, singleSetCount } = useMemo(() => {
    if (!reviews || reviews.length === 0) return { displayItems: [], singleSetCount: 0 };
    let baseList = [...reviews];
    // Guarantee base list has at least 3 cards so 1 viewport is fully populated before repeating
    while (baseList.length < 3) {
      baseList = [...baseList, ...reviews];
    }
    const singleSetCount = baseList.length;
    // Exactly 2 sets for perfect translateX(0) to translateX(-50%) loop
    return {
      displayItems: [...baseList, ...baseList],
      singleSetCount
    };
  }, [reviews]);

  const isPaused = isHovered || isTouching || Boolean(activeVideo) || prefersReducedMotion;

  // Manual Previous/Next stepping: scrolls the container smoothly by 1 card step
  const handleStep = (direction) => {
    if (!containerRef.current) return;
    const step = (cardWidth + 24) * (direction === 'next' ? 1 : -1);
    containerRef.current.scrollBy({ left: step, behavior: 'smooth' });
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      handleStep('prev');
    } else if (e.key === 'ArrowRight') {
      handleStep('next');
    }
  };

  // Touch gesture handling
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e) => {
    setIsTouching(true);
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsTouching(false);
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleStep('next');
      } else {
        handleStep('prev');
      }
    }
  };

  if (!reviews || reviews.length === 0) {
    return (
      <section className="w-full min-w-0 space-y-4 pt-4 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3478F6] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Course Testimonials</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#142D52] tracking-tight">
              Student Reviews &amp; Experiences
            </h3>
          </div>
          {onOpenAddReview && (
            <button
              onClick={onOpenAddReview}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#142D52] hover:bg-[#0f213d] text-white text-xs font-bold shadow-xs hover:shadow-md transition cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 text-[#F4D36B]" />
              <span>Add Review for This Course</span>
            </button>
          )}
        </div>

        <div className="bg-gradient-to-br from-[#F8FAFC] to-[#EFF6FF]/40 border border-dashed border-[#BFDBFE] rounded-2xl p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto">
            <Quote className="w-6 h-6 text-[#2563EB]" />
          </div>
          <p className="text-sm font-bold text-gray-800">No reviews published yet for this course.</p>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Be the first student to share your thoughts, learning milestones, and experience with future learners!
          </p>
          {onOpenAddReview && (
            <div className="pt-1">
              <button
                onClick={onOpenAddReview}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-xs font-extrabold shadow-sm transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Write the First Review</span>
              </button>
            </div>
          )}
        </div>
      </section>
    );
  }

  // Calculate average rating
  const validRatings = reviews.filter((r) => r.rating && Number(r.rating) > 0);
  const averageRating =
    validRatings.length > 0
      ? (
          validRatings.reduce((acc, curr) => acc + Number(curr.rating), 0) /
          validRatings.length
        ).toFixed(1)
      : '5.0';

  const renderStars = (rating = 5) => {
    const num = Math.max(1, Math.min(5, Number(rating) || 5));
    return (
      <div className="flex items-center gap-0.5 text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${
              star <= num ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-100'
            }`}
          />
        ))}
      </div>
    );
  };

  // Continuous animation duration based on items count for smooth, steady ticker pacing
  const marqueeDuration = Math.max(20, singleSetCount * 7);

  return (
    <section
      className="w-full min-w-0 space-y-6 pt-4 focus:outline-none select-none"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="Student Reviews Section"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-100 pb-4">
        <AnimatedSection direction="up" delay={50}>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3478F6] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Course Testimonials</span>
          </div>
          <div className="flex items-baseline gap-3 flex-wrap">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#142D52] tracking-tight">
              Student Reviews &amp; Experiences
            </h3>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#DCEEFF] text-[#3478F6] border border-[#3478F6]/20">
              {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
            </span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{averageRating} out of 5</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Hear from learners who completed this course
          </p>
        </AnimatedSection>

        {/* Header Right Actions: Add Review + Navigation Arrows */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {onOpenAddReview && (
            <button
              onClick={onOpenAddReview}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#142D52] hover:bg-[#0f213d] text-white text-xs font-bold shadow-xs hover:shadow-md transition cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#F4D36B]" />
              <span>Add Review for This Course</span>
            </button>
          )}

          {/* Navigation Arrows */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleStep('prev')}
              aria-label="Previous review"
              className="p-2 sm:p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-[#F8FAFC] text-[#142D52] shadow-2xs hover:shadow-xs transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => handleStep('next')}
              aria-label="Next review"
              className="p-2 sm:p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-[#F8FAFC] text-[#142D52] shadow-2xs hover:shadow-xs transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Full-Width Carousel Viewport */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="w-full min-w-0 overflow-hidden relative pb-2 pt-1"
      >
        {/* Continuously Animated Infinite Track */}
        <div
          className={`animate-infinite-marquee flex items-stretch gap-6 ${
            isPaused ? 'is-paused' : ''
          }`}
          style={{
            animationDuration: `${marqueeDuration}s`
          }}
        >
          {displayItems.map((rev, idx) => {
            const isVideo = rev.reviewType === 'video';
            const avatarUrl = rev.studentAvatar || rev.reviewerAvatar
              ? resolveMediaUrl(rev.studentAvatar || rev.reviewerAvatar)
              : '';
            const thumbUrl = rev.thumbnailUrl || rev.videoThumbnail
              ? resolveMediaUrl(rev.thumbnailUrl || rev.videoThumbnail)
              : '';
            const displayName = rev.studentName || rev.reviewerName || 'Student';
            const displayRole = rev.designation || rev.reviewerDesignation || 'Verified Student';
            const displayHeadline = rev.headline || rev.title || '';
            const displayBody = rev.content || rev.comment || '';

            return (
              <div
                key={`${rev._id || idx}-${idx}`}
                className="shrink-0 box-border flex flex-col"
                style={{ width: `${cardWidth}px` }}
              >
                <div className="h-full min-h-[310px] bg-white rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden">
                  {/* VIDEO REVIEW CARD */}
                  {isVideo ? (
                    <div className="flex flex-col h-full justify-between">
                      {/* Video Thumbnail with Play Button */}
                      <div
                        className="relative aspect-video bg-slate-900 overflow-hidden cursor-pointer group shrink-0"
                        onClick={() => setActiveVideo(rev)}
                        role="button"
                        tabIndex={0}
                        aria-label={`Play review video by ${displayName}`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setActiveVideo(rev);
                          }
                        }}
                      >
                        {thumbUrl ? (
                          <img
                            src={thumbUrl}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = '';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#142D52] to-[#1e3a8a] text-slate-400">
                            <Video className="w-10 h-10 opacity-30 text-[#FFE58A]" />
                          </div>
                        )}

                        <div className="absolute inset-0 bg-black/35 group-hover:bg-black/20 transition flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-[#3478F6] text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-[#2563EB] transition-transform">
                            <Play className="w-5 h-5 ml-0.5 fill-current" />
                          </div>
                        </div>

                        {rev.duration > 0 && (
                          <span className="absolute bottom-2 right-2 px-2 py-0.5 text-[10px] font-bold bg-black/75 text-white rounded-md backdrop-blur-xs">
                            {Math.floor(rev.duration / 60)}:{String(rev.duration % 60).padStart(2, '0')}
                          </span>
                        )}

                        <span className="absolute top-2 left-2 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-[#FFE58A] text-[#142D52] border border-[#FFE58A] rounded-full shadow-2xs">
                          Video Story
                        </span>
                      </div>

                      {/* Video Review Info */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            {rev.rating ? renderStars(rev.rating) : null}
                            <span className="text-[10px] font-medium text-gray-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(rev.reviewDate || rev.createdAt).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>

                          {displayHeadline && (
                            <h4 className="font-bold text-[#142D52] text-sm leading-snug line-clamp-1">
                              {displayHeadline}
                            </h4>
                          )}
                          <p className="text-xs text-gray-600 mt-1 line-clamp-3 leading-relaxed">
                            {displayBody}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-gray-100 flex items-center gap-3">
                          {avatarUrl ? (
                            <img
                              src={avatarUrl}
                              alt={displayName}
                              className="w-9 h-9 rounded-full object-cover border border-gray-200 shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-[#142D52] text-white font-bold text-xs flex items-center justify-center shrink-0">
                              {displayName?.[0] || 'S'}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-[#142D52] text-xs truncate">
                              {displayName}
                            </p>
                            <p className="text-[10px] text-gray-500 truncate">
                              {displayRole}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* TEXT REVIEW CARD */
                    <div className="p-6 h-full flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          {renderStars(rev.rating)}
                          <span className="text-[10px] font-medium text-gray-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(rev.reviewDate || rev.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>

                        {displayHeadline && (
                          <h4 className="font-bold text-[#142D52] text-sm leading-snug">
                            {displayHeadline}
                          </h4>
                        )}

                        <div className="relative">
                          <Quote className="w-6 h-6 text-gray-100 absolute -top-1 -left-1 -z-10" />
                          <p className="text-xs text-gray-600 leading-relaxed line-clamp-4 font-normal">
                            "{displayBody}"
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={displayName}
                            className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#142D52] text-[#FFE58A] font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                            {displayName?.[0] || 'S'}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-[#142D52] text-xs truncate">
                            {displayName}
                          </p>
                          <p className="text-[10px] text-emerald-700 font-semibold truncate flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            {displayRole}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reusable Video Player Modal (detailed framing kept for course video reviews) */}
      {activeVideo && (
        <VideoPlayerModal
          video={activeVideo}
          onClose={() => setActiveVideo(null)}
          variant="detailed"
        />
      )}
    </section>
  );
};

export default CourseReviewsCarousel;