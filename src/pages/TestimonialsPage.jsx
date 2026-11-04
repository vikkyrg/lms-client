import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import api from '../services/api';
import VideoTestimonialCard from '../components/VideoTestimonialCard';
import StudentTestimonials from '../components/StudentTestimonials';
import {
  CheckCircle2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  PlayCircle
} from 'lucide-react';
import HeroBackgroundWaves from '../components/HeroBackgroundWaves';
import { AnimatedSection } from '../components/AnimatedSection';

/**
 * TestimonialsPage Component
 * Displays Text-based reviews and Video Testimonials with continuous right-to-left marquee carousel
 */
const TestimonialsPage = () => {
  const [videos, setVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
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
        setLoadingVideos(true);
        const res = await api.get('/video-testimonials').catch(() => ({ data: { videoTestimonials: [] } }));
        if (isMounted) {
          setVideos(res.data?.videoTestimonials || []);
        }
      } catch (err) {
        console.error('Error fetching video testimonials:', err);
      } finally {
        if (isMounted) setLoadingVideos(false);
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

  const handleStep = (direction) => {
    if (!containerRef.current || isVideoPlaying) return;
    const step = (cardWidth + 24) * (direction === 'next' ? 1 : -1);
    containerRef.current.scrollBy({ left: step, behavior: 'smooth' });
  };

  const marqueeDuration = Math.max(24, singleSetCount * 8.5);

  return (
    <div className="bg-[#FAFBFD] min-h-screen text-[#344054]">
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

      {/* Hero Section with Modern Blue & Brand Accent Waves Background */}
      <section className="relative bg-[#F8FAFD] text-[#344054] py-12 sm:py-16 md:py-20 min-h-[calc(100vh-5rem)] min-h-[calc(100svh-5rem)] flex items-center border-b border-[#E5EDF6] overflow-hidden">
        <HeroBackgroundWaves variant="testimonials" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full my-auto space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#EBF3FE] border border-[#BFDBFE] text-[#1F70F7] px-4 py-1.5 rounded-full text-xs sm:text-[13px] font-bold tracking-wide shadow-2xs">
            <Sparkles className="h-4 w-4 text-[#1F70F7]" />
            <span>Student Success Stories</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight text-[#142B50]">
            Real Learning. <span className="text-[#3478F6]">Real Growth.</span> Real Experiences.
          </h1>

          <p className="text-base sm:text-lg lg:text-[1.08rem] text-[#475467] max-w-3xl mx-auto leading-[1.68] font-normal">
            Discover how learners experience their journey at AutoOps School. Explore student feedback, learning experiences, and the impact of practical training on their technical growth and career preparation.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
            {['Student Experiences', 'Learning Journey', 'Career Development'].map((item, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-xs border border-gray-200/80 rounded-full px-3.5 py-1 text-xs font-semibold text-[#142B50] shadow-2xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Hero CTA Button */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <a
              href="#video-stories"
              onClick={(e) => {
                const el = document.getElementById('video-stories');
                if (el) {
                  e.preventDefault();
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="inline-flex items-center justify-center gap-2 bg-[#142B50] hover:bg-[#10223d] text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-xl shadow-md transition-all duration-200 cursor-pointer group"
            >
              <PlayCircle className="w-4 h-4 text-[#FFD95A]" />
              <span>Watch Student Stories</span>
              <ArrowRight className="w-4 h-4 text-[#FFD95A] transition group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* TEXT-BASED DYNAMIC STUDENT REVIEWS                                        */}
      {/* ========================================================================= */}
      <StudentTestimonials />

      {/* ========================================================================= */}
      {/* VIDEO TESTIMONIALS SECTION (CONTINUOUS RIGHT-TO-LEFT MOVING CAROUSEL)    */}
      {/* ========================================================================= */}
      {videos.length > 0 && (
        <div
          id="video-stories"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 overflow-hidden scroll-mt-24"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <AnimatedSection direction="up" delay={50} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest font-extrabold text-[#3478F6] block mb-1">
                Video Stories
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142B50] tracking-tight">
                Watch Student Video Testimonials
              </h2>
            </div>

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
                className="w-10 h-10 rounded-xl bg-white border border-gray-200 text-[#142B50] hover:text-[#3478F6] hover:border-[#3478F6]/40 flex items-center justify-center shadow-xs transition cursor-pointer"
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
                className="w-10 h-10 rounded-xl bg-white border border-gray-200 text-[#142B50] hover:text-[#3478F6] hover:border-[#3478F6]/40 flex items-center justify-center shadow-xs transition cursor-pointer"
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
      )}
    </div>
  );
};

export default TestimonialsPage;
