import React from 'react';
import logoImg from '../assests/logo.png';
import { ShieldCheck, Award } from 'lucide-react';

/**
 * Premium Landscape Certificate Preview Component for AutoOps School
 * Strictly follows AutoOps School branding:
 * Deep Navy (#102747), Royal Blue Accent (#173563), Subtle Gold (#D4AF37 / #F4D36B), Soft Ivory (#FCFCFD)
 */
const CertificatePreview = ({ certificate, className = '' }) => {
  if (!certificate) return null;

  const studentName = certificate.studentId?.name || 'Valued Student';
  const courseTitle = certificate.courseId?.title || 'Professional IT Course';
  const formatDuration = (course) => {
    if (!course) return 'Duration not specified';
    if (course.videoDuration !== undefined && course.videoDuration !== null && course.videoDuration !== '') {
      return `${course.videoDuration} Hours`;
    }
    if (course.duration) {
      const match = String(course.duration).match(/(\d+(\.\d+)?)/);
      if (match) {
        return `${match[1]} Hours`;
      }
      return course.duration;
    }
    return 'Duration not specified';
  };

  const courseDuration = formatDuration(certificate.courseId);
  const certificateNumber = certificate.certificateNumber || 'CERT-N/A';
  const issueDate = certificate.issueDate
    ? new Date(certificate.issueDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: '2-digit'
      })
    : new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: '2-digit'
      });

  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
  const verificationUrl = `${origin}/verify-certificate/${certificateNumber}`;

  return (
    <div
      className={`relative w-full bg-[#FCFCFD] text-[#102747] rounded-2xl shadow-xl overflow-hidden print:shadow-none print:rounded-none border-4 border-[#102747] ${className}`}
      style={{
        aspectRatio: '1.414 / 1', // A4 Landscape ratio
        minHeight: '480px'
      }}
      id="certificate-print-area"
    >
      {/* Corner Trim Accents (Gold Triangles) */}
      <div className="absolute top-0 left-0 w-8 sm:w-12 h-8 sm:h-12 overflow-hidden pointer-events-none z-10">
        <div className="w-16 h-16 bg-[#F4D36B] -rotate-45 -translate-x-8 -translate-y-8" />
      </div>
      <div className="absolute top-0 right-0 w-8 sm:w-12 h-8 sm:h-12 overflow-hidden pointer-events-none z-10">
        <div className="w-16 h-16 bg-[#F4D36B] rotate-45 translate-x-8 -translate-y-8" />
      </div>
      <div className="absolute bottom-0 left-0 w-8 sm:w-12 h-8 sm:h-12 overflow-hidden pointer-events-none z-10">
        <div className="w-16 h-16 bg-[#F4D36B] rotate-45 -translate-x-8 translate-y-8" />
      </div>
      <div className="absolute bottom-0 right-0 w-8 sm:w-12 h-8 sm:h-12 overflow-hidden pointer-events-none z-10">
        <div className="w-16 h-16 bg-[#F4D36B] -rotate-45 translate-x-8 translate-y-8" />
      </div>

      {/* Inner Decorative Borders */}
      <div className="absolute inset-2 sm:inset-3 border border-[#D4AF37] pointer-events-none z-10 rounded-sm">
        {/* Corner dots */}
        <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-[#D4AF37]" />
        <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#D4AF37]" />
        <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-[#D4AF37]" />
        <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-[#D4AF37]" />

        {/* Faint fine inner border */}
        <div className="absolute inset-1 border border-[#173563]/25 pointer-events-none" />
      </div>

      {/* Subtle Background Watermark: 5% opacity, grayscale, centered behind all text */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden"
        aria-hidden="true"
      >
        <img
          src={logoImg}
          alt=""
          className="w-2/3 max-w-[440px] opacity-[0.05] grayscale object-contain filter"
          loading="eager"
        />
      </div>

      {/* Certificate Content Container */}
      <div className="relative z-20 h-full flex flex-col justify-between p-6 sm:p-8 md:p-10 select-none">
        
        {/* 1. Header Section */}
        <div className="text-center pt-2 sm:pt-3">
          <div className="inline-flex items-center justify-center mb-2">
            <img
              src={logoImg}
              alt="AutoOps School Logo"
              className="h-11 sm:h-14 md:h-16 w-auto object-contain"
            />
          </div>
          <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] text-[#102747]">
            AutoOps School
          </p>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-wide text-[#173563] mt-1">
            CERTIFICATE OF COMPLETION
          </h1>

          {/* Decorative Gold Separator */}
          <div className="flex items-center justify-center gap-3 my-2 sm:my-3">
            <div className="h-[1px] w-20 sm:w-28 bg-[#D4AF37]" />
            <div className="w-2 h-2 bg-[#D4AF37] rotate-45" />
            <div className="h-[1px] w-20 sm:w-28 bg-[#D4AF37]" />
          </div>
        </div>

        {/* 2. Main Body Section */}
        <div className="text-center my-auto py-1 sm:py-2">
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#64748B]">
            This certificate is proudly presented to
          </p>

          {/* Student Name */}
          <div className="my-2 sm:my-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#102747] tracking-tight">
              {studentName}
            </h2>
            <div className="w-24 sm:w-36 h-[2px] bg-[#D4AF37] mx-auto mt-2 rounded-full" />
          </div>

          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto font-normal">
            for successfully completing the course curriculum and practical evaluations for
          </p>

          {/* Course Title */}
          <h3 className="text-base sm:text-xl md:text-2xl font-bold text-[#173563] mt-1.5 sm:mt-2 px-4 max-w-2xl mx-auto">
            {courseTitle}
          </h3>

          {/* Course Duration / Verification Statement */}
          <p className="text-[10px] sm:text-xs text-slate-500 mt-1 sm:mt-2">
            {courseDuration
              ? `Curriculum Duration: ${courseDuration} • Practical Exercises & Technical Evaluation Completed`
              : 'Comprehensive Curriculum, Practical Exercises & Technical Evaluation Completed'}
          </p>
        </div>

        {/* 3. Bottom Credential & Verification Section */}
        <div className="mt-auto pt-3 border-t border-slate-200/90">
          <div className="bg-slate-50/90 rounded-xl border border-slate-200 p-3.5 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Left: Certificate Identifier */}
            <div className="text-left space-y-1">
              <span className="block text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                Certificate Identifier
              </span>
              <span className="font-mono font-bold text-xs sm:text-sm text-[#102747] tracking-wider break-all">
                {certificateNumber}
              </span>
            </div>

            {/* Center: Issue Date */}
            <div className="text-left sm:text-center space-y-1">
              <span className="block text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                Issue Date
              </span>
              <span className="font-medium text-xs sm:text-sm text-[#102747]">
                {issueDate}
              </span>
            </div>

            {/* Right: Verification Status Badge */}
            <div className="text-left sm:text-right flex items-center sm:justify-end">
              <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                Verified & Authenticated
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default CertificatePreview;

