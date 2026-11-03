import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { resolveMediaUrl } from '../utils/videoUtils';
import VideoPlayerModal from '../components/VideoPlayerModal';
import StudentTestimonials from '../components/StudentTestimonials';
import {
  Play,
  Clock,
  CheckCircle2,
  Sparkles,
  Video as VideoIcon
} from 'lucide-react';
import HeroBackgroundWaves from '../components/HeroBackgroundWaves';
import { AnimatedSection } from '../components/AnimatedSection';
import RevealGroup from '../components/RevealGroup';

const TestimonialsPage = () => {
  const [videos, setVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoadingVideos(true);
        const res = await api.get('/video-testimonials').catch(() => ({ data: { videoTestimonials: [] } }));
        setVideos(res.data?.videoTestimonials || []);
      } catch (err) {
        console.error('Error fetching video testimonials:', err);
      } finally {
        setLoadingVideos(false);
      }
    };
    fetchVideos();
  }, []);

  const handleOpenVideo = (videoItem) => {
    setActiveVideo(videoItem);
  };

  const handleCloseModal = () => {
    setActiveVideo(null);
  };

  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return null;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="bg-[#FAFBFD] min-h-screen text-[#344054]">
      {/* Hero Section with Sky Blue & Yellow Flowing Waves Background */}
      <section className="relative bg-[#FFFCF6] text-[#344054] py-12 sm:py-16 md:py-20 min-h-[calc(100vh-5rem)] min-h-[calc(100svh-5rem)] flex items-center border-b border-[#F0EBE1] overflow-hidden">
        <HeroBackgroundWaves variant="about" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full my-auto space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#FFF2BF] border border-[#F4D36B]/70 text-[#142B50] px-4 py-1.5 rounded-full text-xs sm:text-[13px] font-bold tracking-wide shadow-2xs">
            <Sparkles className="h-4 w-4 text-[#A67B10]" />
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
        </div>
      </section>

      {/* ========================================================================= */}
      {/* TEXT-BASED DYNAMIC STUDENT REVIEWS (EXACT HOMEPAGE DARK NAVY STYLE)      */}
      {/* ========================================================================= */}
      <StudentTestimonials />

      {/* ========================================================================= */}
      {/* VIDEO TESTIMONIALS SECTION (if any exist)                                */}
      {/* ========================================================================= */}
      {videos.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
          <AnimatedSection direction="up" delay={50} className="flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-widest font-extrabold text-[#3478F6] block mb-1">
                Video Stories
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142B50] tracking-tight">
                Watch Student Video Testimonials
              </h2>
            </div>
          </AnimatedSection>

          <RevealGroup stagger={110} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {videos.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col group"
              >
                <div
                  className="relative aspect-video bg-slate-900 cursor-pointer overflow-hidden"
                  onClick={() => handleOpenVideo(item)}
                >
                  {item.thumbnailUrl ? (
                    <img
                      src={resolveMediaUrl(item.thumbnailUrl)}
                      alt={item.studentName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#102747] flex flex-col items-center justify-center text-white/50">
                      <VideoIcon className="w-12 h-12 stroke-1" />
                      <span className="text-xs mt-2 text-white/70">Watch Student Story</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

                  <div className="absolute top-3 left-3 bg-[#173563]/90 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full pointer-events-none">
                    Student Story
                  </div>

                  {item.duration > 0 && (
                    <div className="absolute top-3 right-3 bg-black/75 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 pointer-events-none">
                      <Clock className="w-3 h-3 text-[#F4D36B]" />
                      <span>{formatDuration(item.duration)}</span>
                    </div>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-13 h-13 rounded-full bg-[#F4D36B] text-[#102747] flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-110">
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-[#142B50] text-base group-hover:text-[#2B6FE0] transition">
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
                      onClick={() => handleOpenVideo(item)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#142B50] hover:text-[#2B6FE0] transition cursor-pointer"
                    >
                      <span>Watch Video</span>
                      <Play className="w-3 h-3 fill-current" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </RevealGroup>
        </div>
      )}

      {/* Video Modal Popup */}
      <VideoPlayerModal video={activeVideo} onClose={handleCloseModal} />
    </div>
  );
};

export default TestimonialsPage;
