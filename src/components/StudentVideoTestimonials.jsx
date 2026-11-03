import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import api from '../services/api';
import VideoTestimonialCard from './VideoTestimonialCard';
import { AnimatedSection } from './AnimatedSection';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

/**
 * StudentVideoTestimonials Component
 *
 * Requirements:
 * 1. Continuous Right-to-Left Carousel Animation:
 *    - Seamless, smooth marquee-style right-to-left continuous moving animation.
 *    - Consistent card spacing (24px).
 *    - No sudden jumps when reaching the last testimonial (seamless duplicated track loop).
 * 2. Pause on Mouse Hover:
 *    - When cursor enters the carousel area, pause movement immediately.
 *    - When cursor leaves, resume movement smoothly without resetting position.
 * 3. Pause When Video Is Playing:
 *    - If user starts playing a testimonial, carousel pauses immediately.
 *    - Carousel stays stationary while video plays.
 *    - Video plays inside its card with native controls.
 *    - When video is paused or finished, resume carousel only if mouse is not hovering.
 *    - Only 1 video plays at a time.
 * 4. Previous / Next navigation arrows allow manual stepping.
 */
const StudentVideoTestimonials = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);

  const containerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const fetchVideos = async () => {
      try {
        const res = await api.get('/video-testimonials');
        if (isMounted && res.data && res.data.videoTestimonials) {
          setVideos(res.data.videoTestimonials);
        }
      } catch (err) {
        console.error('Error fetching video testimonials:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchVideos();
    return () => {
      isMounted = false;
    };
  }, []);

  // Measure container width
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    const observer = new ResizeObserver(() => updateWidth());
    if (containerRef.current) observer.observe(containerRef.current);
    window.addEventListener('resize', updateWidth);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  // Reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Card width calculation:
  // Desktop (>= 1024px): 3 complete cards across with 24px gap
  // Tablet (640px - 1023px): 2 complete cards with 24px gap
  // Mobile (< 640px): 1 card
  const cardWidth = useMemo(() => {
    if (!containerWidth) return 320;
    if (containerWidth >= 1024) {
      return Math.floor((containerWidth - 48) / 3);
    }
    if (containerWidth >= 640) {
      return Math.floor((containerWidth - 24) / 2);
    }
    return Math.min(320, Math.floor(containerWidth * 0.88));
  }, [containerWidth]);

  // Seamless looping duplicated list (at least 2 identical sets of >= 3 items)
  const { displayItems, singleSetCount } = useMemo(() => {
    if (!videos || videos.length === 0) return { displayItems: [], singleSetCount: 0 };
    let baseList = [...videos];
    while (baseList.length < 3) {
      baseList = [...baseList, ...videos];
    }
    return {
      displayItems: [...baseList, ...baseList],
      singleSetCount: baseList.length
    };
  }, [videos]);

  // Whether continuous animation should be paused
  const isPaused = isHovered || isTouching || isNavigating || isVideoPlaying || prefersReducedMotion;

  const handlePlayVideo = useCallback((id, playingVideo = null) => {
    containerRef.current?.querySelectorAll('video').forEach((video) => {
      if (video !== playingVideo && !video.paused) video.pause();
    });
    setActiveVideoId(id);
    setIsVideoPlaying(true);
  }, []);

  const handlePauseVideo = useCallback((id) => {
    if (activeVideoId === id) {
      setIsVideoPlaying(false);
    }
  }, [activeVideoId]);

  const handleVideoEnded = useCallback((id) => {
    if (activeVideoId === id) {
      setActiveVideoId(null);
      setIsVideoPlaying(false);
    }
  }, [activeVideoId]);

  const handleVideoError = useCallback((id) => {
    if (activeVideoId === id) {
      setActiveVideoId(null);
      setIsVideoPlaying(false);
    }
  }, [activeVideoId]);

  // Manual Previous / Next step handling
  const handleStep = (direction) => {
    if (!containerRef.current || isVideoPlaying) return;
    const step = (cardWidth + 24) * (direction === 'next' ? 1 : -1);
    containerRef.current.scrollBy({ left: step, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <section className="bg-[#FAFBFD] py-14 sm:py-18 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 animate-pulse">
            <div className="h-5 w-36 bg-gray-200 rounded-full mx-auto mb-3" />
            <div className="h-8 w-72 bg-gray-200 rounded-lg mx-auto mb-3" />
            <div className="h-4 w-96 bg-gray-200 rounded mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-gray-200 p-4 h-[440px] animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!videos || videos.length === 0) {
    return null;
  }

  // Consistent speed: 8 seconds per unique card, minimum 24 seconds
  const marqueeDuration = Math.max(24, singleSetCount * 8.5);

  return (
    <section
      className="bg-[#FAFBFD] py-14 sm:py-18 border-b border-gray-100 relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Keyframe animation for continuous smooth right-to-left marquee */}
      <style>{`
        @keyframes videoMarqueeRTL {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .animate-video-ticker {
          animation: videoMarqueeRTL ${marqueeDuration}s linear infinite;
          will-change: transform;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Controls */}
        <AnimatedSection direction="up" delay={50} className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#EAF2FC] text-[#12294B] border border-[#D0E2F6] text-xs font-bold px-3 py-1 rounded-full tracking-wider uppercase mb-2 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#2B6FE0]" />
              <span>VIDEO TESTIMONIALS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#173563] tracking-tight leading-tight">
              Hear From Our <span className="text-[#2B6FE0]">Successful Students</span>
            </h2>
            <p className="mt-2 text-sm text-[#475467] leading-relaxed max-w-2xl">
              Watch real stories from learners who leveled up their skills and transformed their careers with AutoOps School.
            </p>
          </div>

          {/* Previous / Next Arrow Controls */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => handleStep('prev')}
              onPointerDown={(event) => {
                setIsNavigating(true);
                event.currentTarget.setPointerCapture(event.pointerId);
              }}
              onPointerUp={() => setIsNavigating(false)}
              onPointerCancel={() => setIsNavigating(false)}
              onKeyDown={() => setIsNavigating(true)}
              onKeyUp={() => setIsNavigating(false)}
              className="w-10 h-10 rounded-xl bg-white border border-gray-200 text-[#173563] hover:text-[#2B6FE0] hover:border-[#2B6FE0]/40 flex items-center justify-center shadow-xs hover:shadow-sm transition cursor-pointer"
              aria-label="Previous video"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => handleStep('next')}
              onPointerDown={(event) => {
                setIsNavigating(true);
                event.currentTarget.setPointerCapture(event.pointerId);
              }}
              onPointerUp={() => setIsNavigating(false)}
              onPointerCancel={() => setIsNavigating(false)}
              onKeyDown={() => setIsNavigating(true)}
              onKeyUp={() => setIsNavigating(false)}
              className="w-10 h-10 rounded-xl bg-white border border-gray-200 text-[#173563] hover:text-[#2B6FE0] hover:border-[#2B6FE0]/40 flex items-center justify-center shadow-xs hover:shadow-sm transition cursor-pointer"
              aria-label="Next video"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </AnimatedSection>

        {/* Continuous Right-to-Left Carousel Viewport */}
        <div
          ref={containerRef}
          onTouchStart={() => setIsTouching(true)}
          onTouchEnd={() => setIsTouching(false)}
          className="w-full overflow-hidden select-none"
        >
          <div
            className="animate-video-ticker flex items-stretch gap-6"
            style={{
              width: 'max-content',
              animationPlayState: isPaused ? 'paused' : 'running'
            }}
          >
            {displayItems.map((item, index) => (
              <div
                key={`${item._id || item.videoUrl || 'video'}-${index}`}
                style={{ width: `${cardWidth}px`, flexShrink: 0 }}
                className="transition-transform duration-200 hover:-translate-y-1"
              >
                <VideoTestimonialCard
                  item={item}
                  playbackId={`${item._id || item.videoUrl || 'video'}-${index}`}
                  isPlaying={activeVideoId === `${item._id || item.videoUrl || 'video'}-${index}`}
                  onPlay={handlePlayVideo}
                  onPause={handlePauseVideo}
                  onEnded={handleVideoEnded}
                  onError={handleVideoError}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentVideoTestimonials;
