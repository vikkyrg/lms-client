import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  Star,
  Quote,
  Play,
  X,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Video as VideoIcon,
  ChevronRight
} from 'lucide-react';

const TestimonialsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);
  const [selectedRating, setSelectedRating] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [reviewsRes, videosRes] = await Promise.all([
          api.get('/testimonials').catch(() => ({ data: { testimonials: [] } })),
          api.get('/video-testimonials').catch(() => ({ data: { videoTestimonials: [] } }))
        ]);

        setReviews(reviewsRes.data?.testimonials || []);
        setVideos(videosRes.data?.videoTestimonials || []);
      } catch (err) {
        console.error('Error fetching testimonials:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle escape key and body overflow when video modal is open
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

  const filteredReviews = reviews.filter((r) => {
    if (selectedRating === 'all') return true;
    return Number(r.rating) === Number(selectedRating);
  });

  const getInitials = (name) => {
    if (!name) return 'S';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const renderStars = (rating = 5) => {
    const valid = Math.max(1, Math.min(5, Number(rating) || 5));
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= valid
                ? 'fill-[#FFC107] text-[#FFC107]'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return null;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="bg-[#FAFBFD] min-h-screen">
      {/* Hero Header */}
      <section className="bg-white border-b border-gray-100 py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#3F6FA8] bg-[#FFFAE9] border border-[#FFF2BF] px-3.5 py-1.5 rounded-full mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#173563]" />
              Real Student Feedback
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#102747] tracking-tight">
              Student Experiences & Testimonials
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              Explore authentic feedback and video stories from learners who completed hands-on training at AutoOps School.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Verified Enrolled Learners</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Real Project Experiences</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Transparent Reviews</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
        {/* VIDEO TESTIMONIALS SECTION */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#3F6FA8] block mb-1">
                Watch & Listen
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#102747]">
                Video Testimonials
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Hear directly from our graduates about their learning journey, instructors, and projects.
              </p>
            </div>
            {videos.length > 0 && (
              <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 self-start sm:self-auto">
                {videos.length} {videos.length === 1 ? 'Video' : 'Videos'} Available
              </span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-2xl border border-slate-200 p-4 h-72 animate-pulse" />
              ))}
            </div>
          ) : videos.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center max-w-xl mx-auto shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[#FFFAE9] border border-[#FFF2BF] text-[#173563] flex items-center justify-center mx-auto mb-3">
                <VideoIcon className="w-6 h-6 text-[#3F6FA8]" />
              </div>
              <h3 className="font-bold text-[#102747] text-base">Video Testimonials Coming Soon</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                We are currently recording and editing new graduate interviews. Check back soon or browse our written reviews below.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((item) => (
                <div
                  key={item._id}
                  className="group bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 overflow-hidden flex flex-col"
                >
                  {/* Thumbnail & Play Overlay */}
                  <div
                    onClick={() => setActiveVideo(item)}
                    className="relative aspect-video w-full bg-slate-900 cursor-pointer overflow-hidden"
                  >
                    {item.thumbnailUrl ? (
                      <img
                        src={item.thumbnailUrl}
                        alt={item.studentName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#102747] to-[#173563] flex items-center justify-center p-4">
                        <VideoIcon className="w-12 h-12 text-white/30" />
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />

                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#F4D36B] text-[#102747] flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-current ml-1" />
                      </div>
                    </div>

                    {/* Duration badge if available */}
                    {item.duration > 0 && (
                      <span className="absolute bottom-3 right-3 bg-black/75 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 backdrop-blur-xs">
                        <Clock className="w-3 h-3" />
                        {formatDuration(item.duration)}
                      </span>
                    )}

                    {item.isFeatured && (
                      <span className="absolute top-3 left-3 bg-[#F4D36B] text-[#102747] text-[10px] font-extrabold uppercase px-2 py-0.5 rounded shadow-xs">
                        Featured Story
                      </span>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-[#102747] text-base group-hover:text-[#3F6FA8] transition">
                            {item.studentName}
                          </h3>
                          <p className="text-xs text-slate-500 font-medium">
                            {item.designation || 'AutoOps School Graduate'}
                          </p>
                        </div>
                      </div>

                      {/* Course badge */}
                      {item.courseName && (
                        <div className="mt-3 flex items-center gap-1.5 text-xs text-[#173563] font-semibold bg-[#FFFAE9] border border-[#FFF2BF] px-2.5 py-1 rounded-lg w-fit">
                          <BookOpen className="w-3.5 h-3.5 text-[#3F6FA8]" />
                          <span>{item.courseName}</span>
                        </div>
                      )}

                      {/* Description */}
                      {item.description && (
                        <p className="mt-3 text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setActiveVideo(item)}
                        className="text-xs font-bold text-[#173563] hover:text-[#3F6FA8] flex items-center gap-1 transition"
                      >
                        <span>Watch Video Story</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* STUDENT REVIEWS SECTION */}
        <section className="pt-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#3F6FA8] block mb-1">
                Student Experiences
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#102747]">
                Written Reviews & Ratings
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Read how our project-first approach helped students build career-ready technical skills.
              </p>
            </div>

            {/* Filter by Stars */}
            {reviews.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Filter:</span>
                <select
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(e.target.value)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#173563]"
                >
                  <option value="all">All Ratings ({reviews.length})</option>
                  <option value="5">5 Stars only</option>
                  <option value="4">4 Stars only</option>
                </select>
              </div>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white rounded-2xl border border-slate-200 p-6 h-64 animate-pulse" />
              ))}
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center max-w-xl mx-auto shadow-xs">
              <ShieldCheck className="w-12 h-12 text-[#3F6FA8] mx-auto mb-3" />
              <h3 className="font-bold text-[#102747] text-base">No Testimonials Found</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                {selectedRating !== 'all'
                  ? 'No reviews match your rating filter. Try selecting "All Ratings".'
                  : 'Testimonials will appear here once published by the administrator.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReviews.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Student Avatar, Name, and Course */}
                    <div className="flex items-center gap-3.5 mb-4">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.studentName}
                          className="w-12 h-12 rounded-full object-cover border-2 border-[#F4D36B]/60 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[#173563] text-[#F4D36B] font-extrabold flex items-center justify-center text-sm shrink-0 shadow-2xs">
                          {getInitials(item.studentName)}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-[#102747] text-sm sm:text-base truncate">
                          {item.studentName}
                        </h3>
                        <p className="text-xs text-slate-500 truncate">
                          {item.designation || 'Student'}
                        </p>
                      </div>
                    </div>

                    {/* Course and Batch Badges if available */}
                    {(item.courseName || item.batch || item.completionDate) && (
                      <div className="mb-4 flex flex-wrap items-center gap-1.5">
                        {item.courseName && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-[#FFFAE9] border border-[#FFF2BF] text-[#173563] px-2.5 py-0.5 rounded-md">
                            <BookOpen className="w-3 h-3 text-[#3F6FA8]" />
                            {item.courseName}
                          </span>
                        )}
                        {item.batch && (
                          <span className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                            {item.batch}
                          </span>
                        )}
                        {item.completionDate && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
                            <Calendar className="w-3 h-3" />
                            {item.completionDate}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Rating Stars */}
                    <div className="mb-3">
                      {renderStars(item.rating)}
                    </div>

                    {/* Review Body */}
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed relative pl-4 border-l-2 border-[#F4D36B]">
                      &quot;{item.review}&quot;
                    </p>
                  </div>

                  <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified Learner
                    </span>
                    <span>AutoOps School</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-[#102747] to-[#173563] rounded-3xl p-8 sm:p-12 text-white shadow-md relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#F4D36B]">
              Start Your Learning Journey
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">
              Ready to Build Practical Skills and Advance in Tech?
            </h2>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              Join interactive, hands-on batches in DevOps Engineering, Java, and Python Full Stack Development with real projects and mentor support.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 rounded-xl bg-[#F4D36B] hover:bg-[#ebd068] px-6 py-3 font-bold text-[#102747] text-xs sm:text-sm shadow-sm transition"
              >
                <span>Browse All Courses</span>
                <ArrowRight className="w-4 h-4 text-[#102747]" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3 font-bold text-white text-xs sm:text-sm transition"
              >
                <span>Speak with an Advisor</span>
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Video Player Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 z-20">
              <div className="text-white">
                <h3 className="font-bold text-sm sm:text-base drop-shadow-md">
                  {activeVideo.studentName}
                </h3>
                <p className="text-xs text-white/70">
                  {activeVideo.courseName || activeVideo.designation || 'Student Experience'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="p-2 rounded-full bg-black/50 text-white hover:bg-white/20 transition"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Container */}
            <div className="aspect-video w-full bg-black flex items-center justify-center pt-12 sm:pt-0">
              {activeVideo.videoSourceType === 'upload' ? (
                <video
                  src={activeVideo.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                >
                  Your browser does not support HTML5 video playback.
                </video>
              ) : activeVideo.videoUrl?.includes('youtube.com') || activeVideo.videoUrl?.includes('youtu.be') ? (
                <iframe
                  src={`${activeVideo.videoUrl}?autoplay=1&rel=0`}
                  title={activeVideo.studentName}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                <iframe
                  src={activeVideo.videoUrl}
                  title={activeVideo.studentName}
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              )}
            </div>

            {/* Modal Footer Description if available */}
            {activeVideo.description && (
              <div className="p-4 bg-slate-900 border-t border-slate-800 text-slate-300 text-xs sm:text-sm">
                <p>{activeVideo.description}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialsPage;

