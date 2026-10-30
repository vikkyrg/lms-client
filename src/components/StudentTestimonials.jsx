import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Quote,
  Star,
  ChevronLeft,
  ChevronRight,
  User
} from 'lucide-react';

const StudentTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await api.get('/testimonials');
        if (res.data && res.data.testimonials) {
          setTestimonials(res.data.testimonials);
        }
      } catch (err) {
        console.error('Error loading testimonials:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <section className="bg-[#102B43] py-16 sm:py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 animate-pulse">
            <div className="h-6 w-28 bg-[#294258] rounded-full mx-auto mb-3" />
            <div className="h-8 w-64 bg-[#294258] rounded-lg mx-auto mb-3" />
            <div className="h-4 w-80 bg-[#294258] rounded mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-[#294258] rounded-2xl p-6 h-64 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // If no testimonials are returned, hide the section cleanly
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const currentTestimonial = testimonials[currentIndex];

  const getInitials = (name) => {
    if (!name) return 'S';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const renderStars = (rating = 5) => {
    const validRating = Math.max(1, Math.min(5, Number(rating) || 5));
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= validRating
                ? 'fill-[#FFC107] text-[#FFC107]'
                : 'fill-slate-600 text-slate-600'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="bg-[#102B43] py-16 sm:py-20 lg:py-24 text-white relative overflow-hidden">
      {/* Subtle background glow accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#2B6FE0]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FF786D]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block bg-[#294258] text-[#CBD5E1] border border-slate-700/60 text-xs font-bold px-4 py-1.5 rounded-full tracking-wide uppercase mb-3 shadow-xs">
            Testimonials
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            What Our <span className="text-[#FF786D]">Students Say</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#CBD5E1] leading-relaxed">
            Join thousands of satisfied students who have transformed their careers.
          </p>
        </div>

        {/* Desktop View: 3-column cards */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div
              key={item._id}
              className="bg-[#294258] rounded-2xl border border-slate-700/60 p-7 shadow-md flex flex-col justify-between hover:border-slate-600 transition duration-200"
            >
              <div>
                {/* Quote Icon */}
                <div className="text-[#FF786D] mb-4">
                  <Quote className="w-8 h-8 fill-[#FF786D]/20 text-[#FF786D] rotate-180" />
                </div>

                {/* Star Rating */}
                <div className="mb-4">
                  {renderStars(item.rating)}
                </div>

                {/* Review Text */}
                <p className="text-sm sm:text-[14.5px] text-[#CBD5E1] leading-relaxed line-clamp-6">
                  "{item.review}"
                </p>
              </div>

              {/* Student Info */}
              <div className="flex items-center gap-3.5 pt-6 mt-6 border-t border-slate-700/60">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.studentName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#FF786D] shrink-0"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      if (e.currentTarget.nextSibling) {
                        e.currentTarget.nextSibling.style.display = 'flex';
                      }
                    }}
                  />
                ) : null}
                <div
                  className={`w-12 h-12 rounded-full bg-[#102B43] text-[#FF786D] border border-slate-600 font-bold flex items-center justify-center text-sm shrink-0 ${
                    item.image ? 'hidden' : 'flex'
                  }`}
                >
                  {getInitials(item.studentName)}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-white truncate leading-snug">
                    {item.studentName}
                  </h4>
                  <p className="text-xs text-[#CBD5E1] truncate mt-0.5">
                    {item.designation}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tablet & Mobile View: Carousel / Slide with navigation buttons */}
        <div className="block lg:hidden max-w-xl mx-auto">
          {currentTestimonial && (
            <div className="bg-[#294258] rounded-2xl border border-slate-700/60 p-6 sm:p-7 shadow-lg flex flex-col justify-between">
              <div>
                {/* Quote Icon */}
                <div className="text-[#FF786D] mb-4">
                  <Quote className="w-8 h-8 fill-[#FF786D]/20 text-[#FF786D] rotate-180" />
                </div>

                {/* Star Rating */}
                <div className="mb-4">
                  {renderStars(currentTestimonial.rating)}
                </div>

                {/* Review Text */}
                <p className="text-sm sm:text-base text-[#CBD5E1] leading-relaxed">
                  "{currentTestimonial.review}"
                </p>
              </div>

              {/* Student Info */}
              <div className="flex items-center gap-3.5 pt-6 mt-6 border-t border-slate-700/60">
                {currentTestimonial.image ? (
                  <img
                    src={currentTestimonial.image}
                    alt={currentTestimonial.studentName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#FF786D] shrink-0"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      if (e.currentTarget.nextSibling) {
                        e.currentTarget.nextSibling.style.display = 'flex';
                      }
                    }}
                  />
                ) : null}
                <div
                  className={`w-12 h-12 rounded-full bg-[#102B43] text-[#FF786D] border border-slate-600 font-bold flex items-center justify-center text-sm shrink-0 ${
                    currentTestimonial.image ? 'hidden' : 'flex'
                  }`}
                >
                  {getInitials(currentTestimonial.studentName)}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-white truncate leading-snug">
                    {currentTestimonial.studentName}
                  </h4>
                  <p className="text-xs text-[#CBD5E1] truncate mt-0.5">
                    {currentTestimonial.designation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          {testimonials.length > 1 && (
            <div className="flex items-center justify-between mt-6 px-2">
              <div className="flex items-center gap-1.5">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      currentIndex === idx ? 'w-6 bg-[#FF786D]' : 'w-2 bg-slate-600'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prevSlide}
                  className="w-9 h-9 rounded-xl bg-[#294258] hover:bg-slate-700 border border-slate-600 text-white flex items-center justify-center transition cursor-pointer"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  className="w-9 h-9 rounded-xl bg-[#294258] hover:bg-slate-700 border border-slate-600 text-white flex items-center justify-center transition cursor-pointer"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default StudentTestimonials;

