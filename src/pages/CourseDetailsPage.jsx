import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  courseThumbnail,
  formatCoursePrice,
  isFreeCourse,
  PLACEHOLDER_THUMBNAIL,
  resolvePrice
} from '../utils/courseAccess';
import { openMaterial } from '../utils/materialAccess';
import {
  CheckCircle,
  PlayCircle,
  Play,
  Lock,
  Clock,
  Globe,
  Award,
  BookOpen,
  Star,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  FileText,
  Download,
  ExternalLink,
  Sparkles,
  ArrowRight,
  ShoppingCart,
  Check,
  Zap,
  Target,
  GraduationCap,
  Layers,
  Users
} from 'lucide-react';
import HeroBackgroundWaves from '../components/HeroBackgroundWaves';
import CourseReviewsCarousel from '../components/CourseReviewsCarousel';
import AddCourseReviewModal from '../components/AddCourseReviewModal';
import FreeEnrollmentModal from '../components/FreeEnrollmentModal';
import { PreviewLessonModal, PremiumLockModal } from '../components/CoursePreviewModals';

const CourseDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [curriculum, setCurriculum] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [hasActiveAccess, setHasActiveAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState(null); // 'pending_approval' | 'approved' | 'rejected' | 'completed' | 'expired' | null
  const [enrolling, setEnrolling] = useState(false);
  const [message, setMessage] = useState('');
  const [messageKind, setMessageKind] = useState('error');
  const [busyMaterialId, setBusyMaterialId] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [approvalNoticeModal, setApprovalNoticeModal] = useState(false);
  const [paidNotice, setPaidNotice] = useState(false);
  const [profileNoticeModal, setProfileNoticeModal] = useState(false);
  const [freeEnrollModalOpen, setFreeEnrollModalOpen] = useState(false);
  const [addReviewModalOpen, setAddReviewModalOpen] = useState(false);
  const [activePreviewLesson, setActivePreviewLesson] = useState(null);
  const [premiumLockLesson, setPremiumLockLesson] = useState(null);

  // Prevent background scrolling when approval popup or profile notice popup is open
  useEffect(() => {
    if (approvalNoticeModal || profileNoticeModal) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [approvalNoticeModal, profileNoticeModal]);

  useEffect(() => {
    fetchCourseDetails();
  }, [slug]);

  const fetchCourseReviews = async (courseId) => {
    try {
      const targetId = courseId || course?._id;
      if (!targetId) return;
      const revRes = await api.get(`/reviews/course/${targetId}`);
      setReviews(revRes.data.reviews || []);
    } catch (rErr) {
      console.warn('Could not load course reviews:', rErr);
    }
  };

  const fetchCourseDetails = async () => {
    try {
      const res = await api.get(`/courses/${slug}`);
      const courseData = res.data.course;
      setCourse(courseData);
      setCurriculum(res.data.curriculum || []);

      // Expand all modules by default
      const exp = {};
      (res.data.curriculum || []).forEach((m) => {
        exp[m._id] = true;
      });
      setExpandedModules(exp);

      // Fetch dynamic course materials (PDFs)
      try {
        const matRes = await api.get(`/materials/course/${courseData._id}`);
        setMaterials(matRes.data.data || matRes.data.materials || []);
        setHasActiveAccess(Boolean(matRes.data.hasActiveAccess));
      } catch (mErr) {
        console.warn('Could not load course materials preview:', mErr);
      }

      // Fetch dynamic reviews specific to this course
      await fetchCourseReviews(courseData._id);

      // Check enrollment if user is logged in
      if (user && courseData) {
        checkUserEnrollment(courseData._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkUserEnrollment = async (courseId) => {
    try {
      const res = await api.get(`/enrollments/check/${courseId}`);
      setIsEnrolled(res.data.isEnrolled);
      setHasActiveAccess(Boolean(res.data.hasActiveAccess));
      setEnrollmentStatus(res.data.status || (res.data.isEnrolled ? 'pending_approval' : null));
    } catch (err) {
      if (err.response?.status === 401) {
        setIsEnrolled(false);
        setHasActiveAccess(false);
        setEnrollmentStatus(null);
      } else {
        console.error(err);
      }
    }
  };

  const toggleModule = (id) => {
    setExpandedModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const showError = (text) => {
    setMessageKind('error');
    setMessage(text);
  };

  const handleMaterialAction = async (material, inline) => {
    setBusyMaterialId(material._id);
    try {
      await openMaterial(material, { inline });
      setMessage('');
    } catch (err) {
      showError(
        err.response?.data?.message ||
          err.message ||
          'This document is available after enrollment approval.'
      );
    } finally {
      setBusyMaterialId(null);
    }
  };

  const handleEnrollment = async () => {
    const token = localStorage.getItem('token');
    if (!user || !token) {
      navigate(`/login?redirect=/courses/${slug}`);
      return;
    }

    const free = isFreeCourse(course);

    // If it's a free course, open the dedicated Free Enrollment popup
    if (free) {
      setFreeEnrollModalOpen(true);
      return;
    }

    setEnrolling(true);
    setMessage('');

    try {
      if (user.role === 'student' && !user.phone) {
        setProfileNoticeModal(true);
        setEnrolling(false);
        return;
      }

      try {
        if (!free) {
          // Paid course enrollment request (External / Manual payment verification workflow)
          const paidReq = await api.post('/enrollments/paid', { courseId: course._id });
          if (paidReq.data.success) {
            setIsEnrolled(true);
            setEnrollmentStatus('pending_approval');
            setPaidNotice(true);
            setApprovalNoticeModal(true);
            setMessage(
              'Your enrollment request for this course has been submitted successfully. Our admin team will verify your payment and approve your enrollment.'
            );
            setMessageKind('success');
            return;
          }
        } else {
          // Free course enrollment request
          const freeReq = await api.post('/enrollments/free', { courseId: course._id });
          if (freeReq.data.success) {
            setIsEnrolled(true);
            setEnrollmentStatus('pending_approval');
            setPaidNotice(false);
            setApprovalNoticeModal(true);
            setMessage('Your enrollment request has been successfully submitted. Your access to this course is pending admin approval.');
            setMessageKind('success');
            return;
          }
        }
      } catch (payErr) {
        showError(payErr.response?.data?.message || 'Enrollment request failed. Please try again.');
      }
    } catch (err) {
      showError(
        err.response?.data?.message ||
          err.message ||
          'Enrollment failed. Please try again.'
      );
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
        Loading course details...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Course not found</h2>
        <Link to="/courses" className="text-indigo-600 mt-4 inline-block font-semibold">
          Return to course catalog
        </Link>
      </div>
    );
  }

  const free = isFreeCourse(course);
  const listedPrice = Number(course.price) || 0;
  const payPrice = resolvePrice(course);

  return (
    <div className="space-y-12 pb-20">
      {/* Header Banner with Sky Blue & Yellow Flowing Waves Background */}
      <section className="relative bg-[#FFFCF6] border-b border-[#F0EBE1] py-14 overflow-hidden">
        {/* Flowing sky-blue and yellow background waves */}
        <HeroBackgroundWaves variant="courses" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
              <span className="bg-[#FFF2BF] text-[#142B50] border border-[#F4D36B]/70 px-3 py-1 rounded-full shadow-2xs">
                {course.category?.name || 'Skill course'}
              </span>
              <span className="text-gray-400">•</span>
              <span className="bg-[#EAF2FC] text-[#2B6FE0] border border-[#D5E4F7] px-3 py-1 rounded-full">
                {course.level}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-[#142B50] tracking-tight leading-tight">
              {course.title}
            </h1>

            <p className="text-[#475467] text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
              {course.shortDescription}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-[#475467] pt-2">
              <span className="flex items-center gap-1.5 font-bold text-amber-500">
                <Star className="h-4 w-4 fill-current text-amber-400" />
                {course.rating || '5.0'} ({reviews.length > 0 ? reviews.length : course.ratingCount || 0} reviews)
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-[#3478F6]" />
                {course.duration || 'Self-paced'}
              </span>
              <span className="flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-[#3478F6]" />
                {course.language || 'English'}
              </span>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <div className="w-10 h-10 rounded-full bg-[#142B50] font-bold flex items-center justify-center text-white shadow-xs">
                {course.instructor?.name ? course.instructor.name[0] : 'I'}
              </div>
              <div>
                <p className="text-xs text-gray-500">Created by</p>
                <p className="text-sm font-bold text-[#142B50]">{course.instructor?.name || 'Expert Instructor'}</p>
              </div>
            </div>
          </div>

          {/* Sticky Checkout / Enroll Card */}
          <div className="bg-white text-gray-900 rounded-3xl p-6 border border-gray-200 shadow-2xl space-y-6 h-fit">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
              <img
                src={courseThumbnail(course)}
                alt={course.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = PLACEHOLDER_THUMBNAIL;
                }}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-gray-900">
                  {formatCoursePrice(course)}
                </span>
                {!free && listedPrice > payPrice && (
                  <span className="text-base text-gray-400 line-through">
                    ₹{listedPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-gray-500">
                {free
                  ? 'Free enrollment · 3 months access after Admin approval'
                  : 'One-time payment · 3 months access after Admin approval'}
              </p>
            </div>

            {/* Immediate Confirmation / Status Alert Banner directly above buttons */}
            {enrollmentStatus === 'pending_approval' && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1.5 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="font-extrabold text-xs uppercase tracking-wide">
                    Enrollment Request Submitted
                  </span>
                  <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-300">
                    Pending Approval
                  </span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Your enrollment request has been successfully submitted. Your 3-month course access is currently pending admin review and approval.
                </p>
              </div>
            )}

            {enrollmentStatus === 'rejected' && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 space-y-1.5 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-rose-600 shrink-0" />
                  <span className="font-extrabold text-xs uppercase tracking-wide">
                    Enrollment Rejected
                  </span>
                  <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-100 text-rose-800 border border-rose-300">
                    Rejected
                  </span>
                </div>
                <p className="text-xs text-rose-800 leading-relaxed">
                  Your enrollment request was not approved by the administrator. Please update your profile with a valid phone number and contact support if you need assistance.
                </p>
              </div>
            )}

            {message && (
              <div
                className={`p-3 text-xs rounded-xl font-medium border ${
                  messageKind === 'error'
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}
              >
                {message}
              </div>
            )}

            {/* Dynamic Action Button according to actual enrollment status */}
            {hasActiveAccess || enrollmentStatus === 'approved' || enrollmentStatus === 'completed' ? (
              <Link
                to={`/student/courses/${course._id}`}
                className="w-full block text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-md transition"
              >
                Start Learning (Go to Classroom)
              </Link>
            ) : enrollmentStatus === 'pending_approval' ? (
              <button
                disabled
                className="w-full py-3.5 px-4 rounded-xl bg-amber-100 text-amber-900 font-extrabold text-sm border border-amber-300 flex items-center justify-center gap-2 cursor-not-allowed shadow-xs"
              >
                <Clock className="w-4 h-4 text-amber-700" />
                <span>Pending Admin Approval</span>
              </button>
            ) : enrollmentStatus === 'rejected' ? (
              <button
                onClick={handleEnrollment}
                disabled={enrolling}
                className="w-full py-3.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>Re-submit Enrollment Request</span>
              </button>
            ) : (
              <button
                onClick={handleEnrollment}
                disabled={enrolling}
                className="group relative w-full overflow-hidden rounded-xl bg-[#142B50] hover:bg-[#0f213d] text-white font-bold py-3.5 px-4 shadow-md hover:shadow-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                {enrolling ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#F4D36B] border-t-transparent rounded-full animate-spin" />
                    <span>{free ? 'Enrolling...' : 'Processing...'}</span>
                  </>
                ) : free ? (
                  <>
                    <Sparkles className="w-4 h-4 text-[#F4D36B]" />
                    <span>Enroll for Free</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 text-[#3478F6]" />
                    <span>Buy Course · {formatCoursePrice(course)}</span>
                  </>
                )}
              </button>
            )}

            <div className="space-y-3 text-xs text-gray-600 border-t pt-4">
              <div className="flex items-center gap-2">
                <PlayCircle className="h-4 w-4 text-[#3478F6]" />
                <span>Structured lessons taught by the instructor</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#3478F6]" />
                <span>PDF course materials shared after approval</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-[#3478F6]" />
                <span>Certificate of completion included</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#3478F6]" />
                <span>Enrollment is reviewed and approved by Admin</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Body */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        <div className="lg:col-span-2 space-y-8 sm:space-y-10">
          {/* What You Will Learn Card - Redesigned to match UI Reference */}
          {course.learningOutcomes?.length > 0 && (
            <div className="relative overflow-hidden rounded-[24px] border border-[#DBEAFE] bg-gradient-to-br from-[#EFF6FF] via-[#F8FAFC] to-[#FEF9E7]/40 shadow-xs p-6 sm:p-8">
              {/* Subtle decorative background glow */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-[#3478F6]/10 via-[#F4D36B]/10 to-transparent rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                {/* Left Side: Target Heading + Dynamic Learning Outcomes */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-blue-100/80 text-[#2563EB] shrink-0">
                      <Target className="w-5 h-5 text-[#2563EB]" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-[#142B50] tracking-tight">
                      What you will learn
                    </h3>
                  </div>

                  <div className="space-y-3 pt-1">
                    {course.learningOutcomes.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-sm font-medium text-slate-700">
                        <span className="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 mt-0.5">
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </span>
                        <span className="leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Side: Technology / Cloud / DevOps Illustration */}
                <div className="shrink-0 hidden sm:flex items-center justify-center md:w-[220px] lg:w-[250px]">
                  <svg
                    viewBox="0 0 280 200"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full max-w-[240px] drop-shadow-sm select-none"
                    aria-hidden="true"
                  >
                    {/* Soft background pastel gradient wave */}
                    <path
                      d="M20 180 C80 140, 160 190, 260 130 C270 125, 275 160, 265 180 Z"
                      fill="#FEF08A"
                      opacity="0.35"
                    />
                    <path
                      d="M100 60 C180 20, 240 70, 270 40 C280 90, 260 160, 220 170 Z"
                      fill="#93C5FD"
                      opacity="0.25"
                    />

                    {/* Cloud Computing */}
                    <g transform="translate(160, 24)">
                      <path
                        d="M30 45 A16 16 0 0 1 20 15 A22 22 0 0 1 54 8 A26 26 0 0 1 82 22 A18 18 0 0 1 78 45 Z"
                        fill="#FFFFFF"
                        stroke="#2563EB"
                        strokeWidth="3.5"
                        strokeLinejoin="round"
                      />
                      {/* Upload / Sync Arrow inside Cloud */}
                      <path
                        d="M48 38 L48 24 M42 29 L48 23 L54 29"
                        stroke="#2563EB"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>

                    {/* Stacked Server Racks */}
                    <g transform="translate(165, 92)">
                      {/* Top Server Node */}
                      <rect x="0" y="0" width="70" height="24" rx="5" fill="#2563EB" />
                      <line x1="10" y1="12" x2="35" y2="12" stroke="#93C5FD" strokeWidth="2.5" strokeLinecap="round" />
                      <circle cx="50" cy="12" r="2.5" fill="#4ADE80" />
                      <circle cx="58" cy="12" r="2.5" fill="#FDE047" />

                      {/* Bottom Server Node */}
                      <rect x="0" y="28" width="70" height="24" rx="5" fill="#1D4ED8" />
                      <line x1="10" y1="40" x2="35" y2="40" stroke="#93C5FD" strokeWidth="2.5" strokeLinecap="round" />
                      <circle cx="50" cy="40" r="2.5" fill="#4ADE80" />
                      <circle cx="58" cy="40" r="2.5" fill="#38BDF8" />
                    </g>

                    {/* Laptop with DevOps Code Bracket */}
                    <g transform="translate(30, 68)">
                      {/* Screen Bezel */}
                      <rect x="15" y="8" width="105" height="70" rx="8" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
                      {/* Display / Terminal */}
                      <rect x="20" y="13" width="95" height="60" rx="5" fill="#2563EB" />
                      {/* Code Brackets </> */}
                      <path
                        d="M48 36 L36 43 L48 50"
                        stroke="#FFFFFF"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M62 33 L54 53"
                        stroke="#93C5FD"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <path
                        d="M68 36 L80 43 L68 50"
                        stroke="#FFFFFF"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {/* Laptop Base */}
                      <path
                        d="M5 80 L130 80 L122 88 L13 88 Z"
                        fill="#CBD5E1"
                        stroke="#94A3B8"
                        strokeWidth="1.5"
                      />
                      {/* Touchpad Notch */}
                      <rect x="58" y="81" width="19" height="3" rx="1.5" fill="#64748B" />
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* 1. Curriculum / Learning Roadmap - Redesigned Accordion to Match UI Reference */}
          <div className="space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-blue-50 text-[#2563EB]">
                  <Layers className="w-5 h-5 text-[#2563EB]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#142B50] tracking-tight">
                  {course.curriculumTitle || 'Course Curriculum'}
                </h3>
              </div>
              <span className="text-xs font-bold text-[#2563EB] bg-[#EFF6FF] border border-[#BFDBFE] px-3 py-1 rounded-full">
                {curriculum.length} Modules • {curriculum.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)} Lessons
              </span>
            </div>

            {/* Free Preview Banner */}
            <div className="flex items-center gap-2.5 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#EFF6FF] via-[#F8FAFC] to-[#FEF9E7]/60 border border-[#DBEAFE] shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#2563EB] flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-[#142D52]">
                Start learning for free — Watch the first 2 lessons of this course without enrollment.
              </p>
            </div>

            {/* Interactive DevOps Roadmap Link Callout */}
            {(course.slug?.includes('devops') || course.title?.toLowerCase().includes('devops')) && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#102747] via-[#173563] to-[#142B50] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#F4D36B] tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Interactive Learning Experience
                  </span>
                  <h4 className="text-base font-extrabold text-white">
                    Explore the Complete 8-Stage DevOps Roadmap &amp; CI/CD Pipeline
                  </h4>
                  <p className="text-xs text-slate-200">
                    Interactive timeline with tool mappings, separate AWS &amp; Azure cloud paths, and 5 hands-on projects.
                  </p>
                </div>
                <Link
                  to="/projects#roadmap-stages"
                  className="px-4 py-2.5 rounded-xl bg-[#F4D36B] hover:bg-[#ffe58f] text-[#102747] text-xs font-bold transition shrink-0 self-start sm:self-center flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <span>Open Roadmap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {curriculum.length === 0 ? (
              <div className="border border-dashed border-slate-200 rounded-2xl bg-white p-8 text-center text-sm text-slate-500">
                The curriculum for this course is being prepared by the instructors. Please check back soon.
              </div>
            ) : (
              <div className="space-y-3.5">
                {curriculum.map((mod, idx) => {
                  const isOpen = expandedModules[mod._id];
                  const lessonCount = mod.lessons?.length || 0;
                  const totalModDuration = (mod.lessons || []).reduce(
                    (sum, l) => sum + (parseFloat(l.duration) || 0),
                    0
                  );

                  return (
                    <div
                      key={mod._id}
                      className="border border-[#DBEAFE] rounded-2xl overflow-hidden bg-white shadow-xs transition"
                    >
                      {/* Module Header Strip */}
                      <button
                        onClick={() => toggleModule(mod._id)}
                        className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left bg-gradient-to-r from-[#EFF6FF] via-[#F4F9FF] to-white hover:from-[#E0EDFF] transition cursor-pointer"
                        aria-expanded={isOpen}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          {/* Module Number Dark Navy Badge */}
                          <span className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#142B50] text-[#F4D36B] text-sm font-black shadow-xs">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <div className="min-w-0">
                            <h4 className="font-extrabold text-[#142B50] text-sm sm:text-base leading-snug">
                              {mod.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                              <span>
                                {lessonCount} {lessonCount === 1 ? 'topic' : 'topics'}
                              </span>
                              {totalModDuration > 0 && (
                                <>
                                  <span>•</span>
                                  <span>{totalModDuration} minutes</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Chevron pill */}
                        <div className="shrink-0 w-8 h-8 rounded-full bg-white border border-[#BFDBFE] flex items-center justify-center text-[#2563EB] shadow-2xs">
                          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </div>
                      </button>

                      {/* Smooth expand/collapse lesson list */}
                      <div
                        className={`grid transition-all duration-300 ease-in-out ${
                          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="border-t border-[#E2E8F0] bg-white px-5 sm:px-6 py-2 divide-y divide-slate-100">
                            {(mod.lessons || []).map((lesson, lIdx) => {
                              const isPreview = Boolean(lesson.isFreePreview || lesson.isPreview);
                              const hasAccess = Boolean(hasActiveAccess || isEnrolled || isPreview);

                              return (
                                <div
                                  key={lesson._id || lIdx}
                                  onClick={() => {
                                    if (isPreview) {
                                      setActivePreviewLesson(lesson);
                                    } else if (!hasAccess) {
                                      setPremiumLockLesson(lesson);
                                    } else {
                                      navigate(`/student/courses/${course._id}`);
                                    }
                                  }}
                                  className={`flex items-center justify-between gap-3 py-3 text-sm relative group cursor-pointer rounded-lg px-2 -mx-2 transition ${
                                    isPreview
                                      ? 'hover:bg-blue-50/70'
                                      : !hasAccess
                                      ? 'hover:bg-amber-50/60'
                                      : 'hover:bg-emerald-50/60'
                                  }`}
                                >
                                  {/* Connected vertical track dot & title */}
                                  <div className="flex items-center gap-3.5 min-w-0">
                                    <div
                                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                                        isPreview
                                          ? 'bg-blue-50 border border-blue-200 text-[#2563EB]'
                                          : !hasAccess
                                          ? 'bg-amber-50 border border-amber-200 text-amber-600'
                                          : 'bg-emerald-50 border border-emerald-200 text-emerald-600'
                                      }`}
                                    >
                                      {isPreview || hasAccess ? (
                                        <PlayCircle className="w-3.5 h-3.5 fill-current" />
                                      ) : (
                                        <Lock className="w-3.5 h-3.5" />
                                      )}
                                    </div>
                                    <span className="text-slate-800 font-medium text-xs sm:text-sm truncate">
                                      {lesson.title}
                                    </span>
                                  </div>

                                  {/* Right Side: Duration & Access Badge */}
                                  <div className="flex items-center gap-2.5 shrink-0 text-xs">
                                    {lesson.duration ? (
                                      <span className="flex items-center gap-1 text-slate-500 font-medium">
                                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                                        {lesson.duration}m
                                      </span>
                                    ) : null}

                                    {isPreview ? (
                                      <span className="inline-flex items-center gap-1 text-[#2563EB] font-black bg-[#EFF6FF] border border-[#BFDBFE] px-2.5 py-1 rounded-full text-[10px] tracking-wide uppercase shadow-2xs">
                                        <Play className="w-2.5 h-2.5 fill-current" /> Free Preview
                                      </span>
                                    ) : hasAccess ? (
                                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full text-[11px]">
                                        <PlayCircle className="w-3 h-3" /> Watch Lesson
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 text-amber-800 font-bold bg-[#FEF3C7] border border-[#FDE68A] px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wide">
                                        <Lock className="w-2.5 h-2.5" /> Premium
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}

                            {lessonCount === 0 && (
                              <p className="py-4 text-xs text-slate-400 italic">
                                No topics added to this module yet.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 2. Compact, Clean & Professional "Buy Course" Section */}
          <div className="bg-[#F8FAFC] border-2 border-[#E2E8F0] hover:border-[#CBD5E1] rounded-2xl p-5 sm:p-6 shadow-xs transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              {/* Left Column: Price & Value Proposition */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-[#142B50] tracking-tight">
                    {formatCoursePrice(course)}
                  </span>
                  {!free && listedPrice > payPrice && (
                    <span className="text-sm font-semibold text-slate-400 line-through">
                      ₹{listedPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  {free ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                      100% Free
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#FFF2BF] text-[#142B50] border border-[#F4D36B]">
                      Full Access
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm font-semibold text-slate-700">
                  {free
                    ? 'Get instant 3 months access to all lessons & materials upon Admin review.'
                    : 'One-time secure fee. Includes all videos, downloadable PDF notes & verified certificate.'}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-medium text-slate-500 pt-0.5">
                  <span className="flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> 3 Months Full Access
                  </span>
                  <span className="flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> PDF Notes Included
                  </span>
                  <span className="flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Verified Certificate
                  </span>
                </div>
              </div>

              {/* Right Column: Prominent Buy / Enroll Action Button */}
              <div className="shrink-0 w-full sm:w-auto">
                {hasActiveAccess || enrollmentStatus === 'approved' || enrollmentStatus === 'completed' ? (
                  <Link
                    to={`/student/courses/${course._id}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-150"
                  >
                    <span>Start Learning</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : enrollmentStatus === 'pending_approval' ? (
                  <button
                    disabled
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-sm cursor-not-allowed shadow-xs"
                  >
                    <Clock className="w-4 h-4 text-amber-700" />
                    <span>Pending Approval</span>
                  </button>
                ) : enrollmentStatus === 'rejected' ? (
                  <button
                    onClick={handleEnrollment}
                    disabled={enrolling}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm transition cursor-pointer"
                  >
                    <span>Enrollment Rejected · Re-apply</span>
                  </button>
                ) : (
                  <button
                    onClick={handleEnrollment}
                    disabled={enrolling}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-[#142B50] hover:bg-[#0f213d] active:bg-[#0a172c] text-white font-extrabold text-sm sm:text-base shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer disabled:opacity-50"
                  >
                    {enrolling ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#F4D36B] border-t-transparent rounded-full animate-spin" />
                        <span>{free ? 'Enrolling...' : 'Processing...'}</span>
                      </>
                    ) : free ? (
                      <>
                        <Zap className="w-4 h-4 text-[#F4D36B] fill-current" />
                        <span>Enroll for Free</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 text-[#3478F6]" />
                        <span>Buy Course Now · {formatCoursePrice(course)}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 3. Dynamic Course-Specific Reviews & Experiences Carousel */}
          <CourseReviewsCarousel
            reviews={reviews}
            courseTitle={course.title}
            onOpenAddReview={() => {
              const token = localStorage.getItem('token');
              if (!user || !token) {
                navigate(`/login?redirect=/courses/${slug}`);
                return;
              }
              setAddReviewModalOpen(true);
            }}
          />

          {/* 4. Dedicated Dynamic Course Materials & Documents Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#142B50] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#3478F6]" />
                Course Materials &amp; Documents ({materials.length})
              </h3>
              {hasActiveAccess ? (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Full Access Unlocked (3 Mos)
                </span>
              ) : (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  Included with Enrollment
                </span>
              )}
            </div>

            {materials.length === 0 ? (
              <div className="p-6 bg-white rounded-2xl border border-gray-200 text-center text-xs text-gray-500">
                Additional PDF notes and reference guides will be published by the instructor as modules progress.
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 overflow-hidden shadow-xs">
                {materials.map((mat) => (
                  <div
                    key={mat._id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition"
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className="p-2.5 rounded-xl bg-red-50 text-red-600 border border-red-200 shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-gray-900 text-sm truncate">{mat.title}</h4>
                        {mat.description && (
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{mat.description}</p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-gray-400 mt-1.5 flex-wrap">
                          <span>{mat.fileName}</span>
                          <span>•</span>
                          <span>{mat.fileSize ? `${Math.round(mat.fileSize / 1024)} KB` : 'PDF'}</span>
                          <span>•</span>
                          <span>Added {new Date(mat.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 sm:self-center">
                      {hasActiveAccess ? (
                        <>
                          <button
                            onClick={() => handleMaterialAction(mat, true)}
                            disabled={busyMaterialId === mat._id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition shadow-xs disabled:opacity-50"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            View PDF
                          </button>
                          <button
                            onClick={() => handleMaterialAction(mat, false)}
                            disabled={busyMaterialId === mat._id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-[#142B50] hover:bg-[#102747] transition shadow-xs disabled:opacity-50"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Download
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={handleEnrollment}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-500 bg-slate-100 hover:bg-slate-200 transition"
                          title="Enroll and get Admin approval to download"
                        >
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Unlock with Enrollment</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 5. Course Requirements / Prerequisites */}
          {course.prerequisites?.length > 0 && (
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <h3 className="text-xl font-bold text-[#142B50]">Course Requirements</h3>
              <ul className="space-y-2.5">
                {course.prerequisites.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <BookOpen className="h-5 w-5 text-[#3478F6] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Instructor Profile Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-[24px] border border-[#DBEAFE] shadow-xs p-6 space-y-5">
            {/* Header: Graduation Cap + AutoOps School */}
            <div className="flex items-center gap-2.5 text-[#142B50]">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5 text-[#2563EB]" />
              </div>
              <h4 className="font-extrabold text-[#142B50] text-base tracking-tight">AutoOps School</h4>
            </div>

            {/* Profile Row: Avatar + Name/Role + Pill */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#142B50] to-[#2563EB] text-white font-black text-base flex items-center justify-center shadow-xs">
                  {course.instructor?.name ? course.instructor.name.charAt(0).toUpperCase() : 'S'}
                </div>
                <div className="min-w-0">
                  <h5 className="font-extrabold text-gray-900 text-sm leading-tight truncate">
                    {course.instructor?.name || 'System Administrator'}
                  </h5>
                  <p className="text-xs font-semibold text-[#2563EB] mt-0.5">
                    {course.instructor?.headline || 'Program administration'}
                  </p>
                </div>
              </div>

              {/* Yellow Instructor Pill matching reference */}
              <span className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                Instructor
              </span>
            </div>

            {/* Bio */}
            <p className="text-xs text-slate-600 leading-relaxed">
              {course.instructor?.bio ||
                'Dedicated to mentoring students and providing industry-grade instruction.'}
            </p>

            {/* 3-Column Stats Row: Courses, Students, Rating */}
            <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
              <div className="space-y-0.5">
                <div className="flex items-center justify-center gap-1 text-[#2563EB]">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span className="text-xs font-extrabold text-slate-900">25+</span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Courses</p>
              </div>

              <div className="space-y-0.5 border-x border-slate-100">
                <div className="flex items-center justify-center gap-1 text-[#2563EB]">
                  <Users className="w-3.5 h-3.5" />
                  <span className="text-xs font-extrabold text-slate-900">10K+</span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Students</p>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center justify-center gap-1 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="text-xs font-extrabold text-slate-900">4.8</span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal: Awaiting Admin Approval Notice (Centered in viewport via portal) */}
      {approvalNoticeModal &&
        createPortal(
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 text-center space-y-5 shadow-2xl border border-gray-100 max-h-[90vh] max-h-[90dvh] overflow-y-auto">
              <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-200 shadow-xs">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#142B50] tracking-tight">
                {paidNotice ? 'Enrollment Request Submitted' : 'Enrolled · Awaiting Approval'}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {paidNotice
                  ? 'Your enrollment request for this course has been submitted successfully. Our admin team will verify your payment and approve your enrollment.'
                  : 'You are enrolled in this free course. Your enrollment is awaiting Admin approval, and you will receive access once it is approved.'}
              </p>

              {paidNotice && (
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-left space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Course:</span>
                    <strong className="text-slate-900 font-bold text-right truncate max-w-[220px]">{course.title}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Course Price:</span>
                    <strong className="text-[#1F70F7] font-extrabold">{formatCoursePrice(course)}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Payment Verification:</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                      Pending
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Enrollment Status:</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-900 border border-blue-200">
                      Awaiting Admin Approval
                    </span>
                  </div>
                </div>
              )}

              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs text-slate-600 font-medium">
                Upon approval, you will receive full access to all video lessons and study materials for{' '}
                <strong className="text-slate-900">3 calendar months</strong>.
              </div>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setApprovalNoticeModal(false);
                    navigate('/student/dashboard');
                  }}
                  className="w-full py-3.5 px-5 rounded-xl bg-[#142B50] hover:bg-[#0f213d] text-white font-extrabold text-sm shadow-md transition cursor-pointer"
                >
                  Go to My Dashboard
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Modal: Complete Profile First (Centered in viewport via portal) */}
      {profileNoticeModal &&
        createPortal(
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-center space-y-5 shadow-2xl border border-gray-100 max-h-[90vh] max-h-[90dvh] overflow-y-auto">
              <div className="w-16 h-16 bg-indigo-50 text-[#142B50] rounded-2xl flex items-center justify-center mx-auto border border-indigo-200 shadow-xs">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Profile Details Required</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Before enrolling, please complete your profile with a valid phone number. Admin reviews your contact
                information before approving your 3-month course access.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setProfileNoticeModal(false)}
                  className="w-1/2 py-3 px-4 rounded-xl border border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setProfileNoticeModal(false);
                    navigate('/student/profile');
                  }}
                  className="w-1/2 py-3 px-4 rounded-xl bg-[#142B50] hover:bg-[#102747] text-white font-bold text-sm shadow-md transition cursor-pointer"
                >
                  Complete Profile
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Modal: Free Course Enrollment */}
      {freeEnrollModalOpen && course && (
        <FreeEnrollmentModal
          isOpen={freeEnrollModalOpen}
          onClose={() => setFreeEnrollModalOpen(false)}
          course={course}
          user={user}
          onEnrollmentSuccess={() => {
            setIsEnrolled(true);
            setEnrollmentStatus('pending_approval');
            setPaidNotice(false);
            setApprovalNoticeModal(true);
            setMessage('Your enrollment request has been successfully submitted. Your access to this course is pending admin approval.');
            setMessageKind('success');
          }}
        />
      )}

      {/* Modal: Add Review for This Course */}
      {addReviewModalOpen && course && (
        <AddCourseReviewModal
          isOpen={addReviewModalOpen}
          onClose={() => setAddReviewModalOpen(false)}
          courseId={course._id}
          courseTitle={course.title}
          user={user}
          onReviewSubmitted={() => fetchCourseReviews(course._id)}
        />
      )}

      {/* Modal: Free Preview Video Player (No login or enrollment required) */}
      {activePreviewLesson && (
        <PreviewLessonModal
          lesson={activePreviewLesson}
          course={course}
          onClose={() => setActivePreviewLesson(null)}
          onBuyOrEnroll={() => {
            setActivePreviewLesson(null);
            handleEnrollment();
          }}
        />
      )}

      {/* Modal: Premium Lock - Lesson 3+ Access Wall */}
      {premiumLockLesson && (
        <PremiumLockModal
          lesson={premiumLockLesson}
          course={course}
          onClose={() => setPremiumLockLesson(null)}
          onBuyOrEnroll={() => {
            setPremiumLockLesson(null);
            handleEnrollment();
          }}
          onWatchPreview={() => {
            setPremiumLockLesson(null);
            // Find the first free preview lesson in curriculum
            for (const mod of curriculum) {
              const prev = (mod.lessons || []).find((l) => l.isFreePreview);
              if (prev) {
                setActivePreviewLesson(prev);
                break;
              }
            }
          }}
        />
      )}
    </div>
  );
};

export default CourseDetailsPage;
