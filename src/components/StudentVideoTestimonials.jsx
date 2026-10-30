import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Play,
  X,
  Clock,
  Video as VideoIcon,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

const StudentVideoTestimonials = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await api.get('/video-testimonials');
        if (res.data && res.data.videoTestimonials) {
          setVideos(res.data.videoTestimonials);
        }
      } catch (err) {
        console.error('Error fetching video testimonials:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (activeVideo) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setActiveVideo(null);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [activeVideo]);

  if (loading) {
    return (
      <section className="bg-[#FAFBFD] py-16 sm:py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 animate-pulse">
            <div className="h-5 w-36 bg-gray-200 rounded-full mx-auto mb-3" />
            <div className="h-8 w-72 bg-gray-200 rounded-lg mx-auto mb-3" />
            <div className="h-4 w-96 bg-gray-200 rounded mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-gray-200 p-4 h-80 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Gracefully hide section if no videos exist
  if (!videos || videos.length === 0) {
    return null;
  }

  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return null;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === videos.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? videos.length - 1 : prev - 1));
  };

  const currentMobileVideo = videos[currentIndex];

  return (
    <section className="bg-[#FAFBFD] py-16 sm:py-20 lg:py-24 border-b border-gray-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block bg-[#EAF2FC] text-[#12294B] border border-[#D0E2F6] text-xs font-bold px-3.5 py-1 rounded-full tracking-wider uppercase mb-3 shadow-2xs">
            VIDEO TESTIMONIALS
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#173563] tracking-tight leading-tight">
            Hear From Our <span className="text-[#2B6FE0]">Successful Students</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#344054] leading-relaxed">
            Watch real stories from students who transformed their careers with our DevOps training programs.
          </p>
        </div>

        {/* Desktop View: 3-column video cards */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-7">
          {videos.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col group"
            >
              {/* Thumbnail Container & Play Trigger */}
              <div
                className="relative aspect-video bg-slate-900 cursor-pointer overflow-hidden"
                onClick={() => setActiveVideo(item)}
              >
                {item.thumbnailUrl ? (
                  <img
                    src={item.thumbnailUrl}
                    alt={item.studentName}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-[#102747] flex flex-col items-center justify-center text-white/50">
                    <VideoIcon className="w-12 h-12 stroke-1" />
                    <span className="text-xs mt-2 text-white/70">Watch Student Story</span>
                  </div>
                )}

                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Video Testimonial Pill Badge */}
                <div className="absolute top-3 left-3 bg-[#173563]/90 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-white/20">
                  Student Story
                </div>

                {/* Duration Badge */}
                {item.duration > 0 && (
                  <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#F4D36B]" />
                    <span>{formatDuration(item.duration)}</span>
                  </div>
                )}

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-13 h-13 rounded-full bg-[#F4D36B] group-hover:bg-[#ebd068] text-[#102747] flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-110">
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-[#173563] text-base group-hover:text-[#2B6FE0] transition">
                    {item.studentName}
                  </h3>
                  <p className="text-xs font-semibold text-[#667085] mt-0.5">
                    {item.designation}
                  </p>
                  {item.description && (
                    <p className="text-xs text-[#344054] mt-2.5 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveVideo(item)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#173563] hover:text-[#2B6FE0] transition cursor-pointer"
                  >
                    <span>Watch Testimonial</span>
                    <Play className="w-3 h-3 fill-current" />
                  </button>
                  {item.isFeatured && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#A67B10] bg-[#FFF2BF] px-2 py-0.5 rounded-full border border-[#F4D36B]/60">
                      Featured
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tablet & Mobile View: Responsive Card & Carousel */}
        <div className="block lg:hidden max-w-md mx-auto">
          {currentMobileVideo && (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col">
              <div
                className="relative aspect-video bg-slate-900 cursor-pointer overflow-hidden"
                onClick={() => setActiveVideo(currentMobileVideo)}
              >
                {currentMobileVideo.thumbnailUrl ? (
                  <img
                    src={currentMobileVideo.thumbnailUrl}
                    alt={currentMobileVideo.studentName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#102747] flex flex-col items-center justify-center text-white/50">
                    <VideoIcon className="w-12 h-12 stroke-1" />
                    <span className="text-xs mt-2 text-white/70">Watch Student Story</span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute top-3 left-3 bg-[#173563]/90 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  Student Story
                </div>

                {currentMobileVideo.duration > 0 && (
                  <div className="absolute top-3 right-3 bg-black/75 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#F4D36B]" />
                    <span>{formatDuration(currentMobileVideo.duration)}</span>
                  </div>
                )}

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#F4D36B] text-[#102747] flex items-center justify-center shadow-lg">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-[#173563] text-base">
                  {currentMobileVideo.studentName}
                </h3>
                <p className="text-xs font-semibold text-[#667085] mt-0.5">
                  {currentMobileVideo.designation}
                </p>
                {currentMobileVideo.description && (
                  <p className="text-xs text-[#344054] mt-2.5 leading-relaxed">
                    {currentMobileVideo.description}
                  </p>
                )}

                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveVideo(currentMobileVideo)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#173563] cursor-pointer"
                  >
                    <span>Watch Testimonial</span>
                    <Play className="w-3 h-3 fill-current" />
                  </button>
                  {currentMobileVideo.isFeatured && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#A67B10] bg-[#FFF2BF] px-2 py-0.5 rounded-full">
                      Featured
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Carousel controls */}
          {videos.length > 1 && (
            <div className="flex items-center justify-between mt-5 px-2">
              <div className="flex items-center gap-1.5">
                {videos.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      currentIndex === idx ? 'w-6 bg-[#173563]' : 'w-2 bg-gray-300'
                    }`}
                    aria-label={`Go to video ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prevSlide}
                  className="w-9 h-9 rounded-xl bg-white border border-gray-200 text-[#173563] flex items-center justify-center shadow-xs transition hover:bg-gray-50 cursor-pointer"
                  aria-label="Previous video"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  className="w-9 h-9 rounded-xl bg-white border border-gray-200 text-[#173563] flex items-center justify-center shadow-xs transition hover:bg-gray-50 cursor-pointer"
                  aria-label="Next video"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Video Playback Modal Popup */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="bg-[#102747] rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl border border-white/10 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 bg-[#0d213c]">
              <div>
                <h3 className="text-white font-bold text-sm sm:text-base leading-snug">
                  {activeVideo.studentName} — Student Story
                </h3>
                <p className="text-xs text-gray-400">
                  {activeVideo.designation}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                aria-label="Close video modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Display */}
            <div className="relative aspect-video bg-black">
              {activeVideo.videoUrl.includes('youtube.com') || activeVideo.videoUrl.includes('youtu.be') ? (
                <iframe
                  src={`${activeVideo.videoUrl}${activeVideo.videoUrl.includes('?') ? '&' : '?'}autoplay=1&rel=0`}
                  title={`${activeVideo.studentName} Testimonial Video`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={activeVideo.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                >
                  Your browser does not support HTML5 video playback.
                </video>
              )}
            </div>

            {/* Modal Footer Description */}
            {activeVideo.description && (
              <div className="px-5 sm:px-6 py-3.5 bg-[#0d213c] text-xs text-gray-300">
                {activeVideo.description}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default StudentVideoTestimonials;

