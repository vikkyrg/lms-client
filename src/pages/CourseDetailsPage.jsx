import React, { useState, useEffect } from 'react';
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
  ExternalLink
} from 'lucide-react';

const CourseDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [curriculum, setCurriculum] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [hasActiveAccess, setHasActiveAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [message, setMessage] = useState('');
  const [messageKind, setMessageKind] = useState('error');
  const [busyMaterialId, setBusyMaterialId] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [approvalNoticeModal, setApprovalNoticeModal] = useState(false);
  const [paidNotice, setPaidNotice] = useState(false);
  const [profileNoticeModal, setProfileNoticeModal] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
  }, [slug]);

  const fetchCourseDetails = async () => {
    try {
      const res = await api.get(`/courses/${slug}`);
      setCourse(res.data.course);
      setCurriculum(res.data.curriculum || []);

      // Expand all modules by default
      const exp = {};
      (res.data.curriculum || []).forEach((m, idx) => {
        exp[m._id] = true;
      });
      setExpandedModules(exp);

      // Fetch dynamic course materials (PDFs)
      try {
        const matRes = await api.get(`/materials/course/${res.data.course._id}`);
        setMaterials(matRes.data.data || matRes.data.materials || []);
        setHasActiveAccess(Boolean(matRes.data.hasActiveAccess));
      } catch (mErr) {
        console.warn('Could not load course materials preview:', mErr);
      }

      // Check enrollment if user is logged in
      if (user && res.data.course) {
        checkUserEnrollment(res.data.course._id);
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
    } catch (err) {
      if (err.response?.status === 401) {
        setIsEnrolled(false);
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
        err.response?.data?.message
        || err.message
        || 'This document is available after enrollment approval.'
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

    // Require complete profile with phone number before enrollment/purchase
    if (!user.phone || user.phone.trim().length < 6) {
      setProfileNoticeModal(true);
      return;
    }

    setEnrolling(true);
    setMessage('');

    try {
      if (isFreeCourse(course)) {
        // Free enrollment: no gateway involved, awaits admin approval
        const res = await api.post('/enrollments/free', { courseId: course._id });
        if (res.data.success) {
          setIsEnrolled(true);
          setPaidNotice(false);
          setApprovalNoticeModal(true);
        }
      } else {
        // Paid enrollment via Razorpay order
        const orderRes = await api.post('/payments/create-order', { courseId: course._id });
        const { orderId, amount, paymentId: paymentDocId, keyId } = orderRes.data;

        // Check if Razorpay SDK script is available in browser window
        if (window.Razorpay) {
          const options = {
            key: keyId,
            amount,
            currency: 'INR',
            name: 'AutoOps School',
            description: `Enrollment for ${course.title}`,
            order_id: orderId,
            handler: async (response) => {
              try {
                const verifyRes = await api.post('/payments/verify', {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  paymentDocId
                });
                if (verifyRes.data.success) {
                  setIsEnrolled(true);
                  setPaidNotice(true);
                  setApprovalNoticeModal(true);
                }
              } catch (verifyErr) {
                showError(verifyErr.response?.data?.message || 'Payment verification failed');
              }
            },
            prefill: {
              name: user.name,
              email: user.email,
              contact: user.phone || ''
            },
            theme: { color: '#4f46e5' }
          };
          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          showError('Razorpay gateway checkout SDK is not loaded. Please ensure gateway configuration is active.');
        }
      }
    } catch (err) {
      showError(
        err.response?.data?.message
        || err.message
        || 'Enrollment failed. Please try again.'
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
      {/* Header Banner */}
      <section className="bg-[#102747] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3 text-xs font-semibold tracking-wider uppercase text-[#F4D36B]">
              <span>{course.category?.name || 'Skill course'}</span>
              <span>•</span>
              <span>{course.level}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight">
              {course.title}
            </h1>

            <p className="text-gray-300 text-base leading-relaxed max-w-2xl">
              {course.shortDescription}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300 pt-2">
              <span className="flex items-center gap-1.5 font-bold text-amber-400">
                <Star className="h-4 w-4 fill-current" />
                {course.rating || '5.0'} ({course.ratingCount || 0} reviews)
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {course.duration || 'Self-paced'}
              </span>
              <span className="flex items-center gap-1.5">
                <Globe className="h-4 w-4" />
                {course.language || 'English'}
              </span>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <div className="w-10 h-10 rounded-full bg-[#3F6FA8] font-bold flex items-center justify-center text-white">
                {course.instructor?.name ? course.instructor.name[0] : 'I'}
              </div>
              <div>
                <p className="text-xs text-gray-400">Created by</p>
                <p className="text-sm font-semibold">{course.instructor?.name || 'Expert Instructor'}</p>
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
                  // Never leave a broken image: fall back to the branded placeholder asset.
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
                {free ? 'Free enrollment · 3 months access after Admin approval'
                  : 'One-time payment · 3 months access after Admin approval'}
              </p>
            </div>

            {message && (
              <div className={`p-3 text-xs rounded-lg ${messageKind === 'error' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                {message}
              </div>
            )}

            {isEnrolled ? (
              <Link
                to={`/student/courses/${course._id}`}
                className="w-full block text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-md transition"
              >
                Go to Classroom
              </Link>
            ) : (
              <button
                onClick={handleEnrollment}
                disabled={enrolling}
                className="w-full bg-[#173563] hover:bg-[#102747] text-white font-bold py-3.5 rounded-xl shadow-md transition disabled:opacity-50"
              >
                {enrolling
                  ? (free ? 'Enrolling...' : 'Preparing checkout...')
                  : (free ? 'Enroll for Free' : 'Buy Course')}
              </button>
            )}

            <div className="space-y-3 text-xs text-gray-600 border-t pt-4">
              <div className="flex items-center gap-2">
                <PlayCircle className="h-4 w-4 text-indigo-600" />
                <span>Structured lessons taught by the instructor</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-600" />
                <span>PDF course materials shared after approval</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-indigo-600" />
                <span>Certificate of completion included</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-indigo-600" />
                <span>Enrollment is reviewed and approved by Admin</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Body: Curriculum & Outcomes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Learning Outcomes */}
          {course.learningOutcomes?.length > 0 && (
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <h3 className="text-xl font-bold text-[#173563]">What you will learn</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.learningOutcomes.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Curriculum / Learning Roadmap (fetched dynamically from the backend) */}
          <div className="space-y-4">
            <div className="flex flex-wrap justify-between items-baseline gap-2 border-b border-slate-100 pb-3">
              <h3 className="text-2xl font-extrabold text-[#173563]">
                {course.curriculumTitle || 'Course Curriculum'}
              </h3>
              <span className="text-xs font-semibold text-[#3F6FA8]">
                {curriculum.length} Modules • {curriculum.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)} Lessons
              </span>
            </div>
          
            {curriculum.length === 0 ? (
              <div className="border border-dashed border-slate-200 rounded-2xl bg-white p-8 text-center text-sm text-slate-500">
                The curriculum for this course is being prepared by the instructors. Please check back soon.
              </div>
            ) : (
              <div className="space-y-3">
                {curriculum.map((mod, idx) => {
                  const isOpen = expandedModules[mod._id];
                  const lessonCount = mod.lessons?.length || 0;
                  return (
                    <div key={mod._id} className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                      <button
                        onClick={() => toggleModule(mod._id)}
                        className={`w-full flex items-start justify-between gap-4 p-4 sm:p-5 text-left transition ${isOpen ? 'bg-[#FFFAE9]' : 'bg-white hover:bg-[#FFF2BF]/40'}`}
                        aria-expanded={isOpen}
                      >
                        <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                          <span className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#173563] text-[#F4D36B] text-sm font-extrabold">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <div className="min-w-0">
                            <h4 className="font-bold text-[#173563] leading-snug">{mod.title}</h4>
                            {mod.description && (
                              <p className="text-xs sm:text-sm text-slate-500 mt-1">{mod.description}</p>
                            )}
                            <span className="inline-block mt-2 text-[11px] font-semibold text-[#3F6FA8]">
                              {lessonCount} {lessonCount === 1 ? 'topic' : 'topics'}
                            </span>
                          </div>
                        </div>
                        <span className="shrink-0 text-slate-400">
                          {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                        </span>
                      </button>
          
                      {/* Smooth expand/collapse */}
                      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden">
                          <div className="border-t border-slate-100 divide-y divide-slate-100 bg-white">
                            {(mod.lessons || []).map((lesson) => (
                              <div key={lesson._id} className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 text-sm">
                                <div className="flex items-center gap-3 min-w-0">
                                  {lesson.isPreview ? (
                                    <PlayCircle className="h-4 w-4 text-[#3F6FA8] shrink-0" />
                                  ) : (
                                    <Lock className="h-4 w-4 text-slate-400 shrink-0" />
                                  )}
                                  <span className="text-slate-700 truncate">{lesson.title}</span>
                                </div>
                                <div className="flex items-center gap-3 shrink-0 text-xs">
                                  {lesson.duration ? <span className="text-slate-400">{lesson.duration}m</span> : null}
                                  {lesson.isPreview ? (
                                    <span className="text-[#3F6FA8] font-semibold bg-[#FFFAE9] px-2 py-0.5 rounded">
                                      Free Preview
                                    </span>
                                  ) : (
                                    <span className="text-slate-400">Enroll to access</span>
                                  )}
                                </div>
                              </div>
                            ))}
                            {lessonCount === 0 && (
                              <p className="px-5 py-3 text-xs text-slate-400 italic">No topics added to this module yet.</p>
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

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-[#173563]">Course Overview</h3>
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line bg-white p-6 rounded-2xl border border-gray-200">
              {course.description}
            </div>
          </div>

          {/* Dedicated Dynamic Course Materials & PDFs Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#173563] flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
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
                  <div key={mat._id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition">
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
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-xs disabled:opacity-50"
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

          {/* Course Requirements / Prerequisites */}
          {course.prerequisites?.length > 0 && (
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <h3 className="text-xl font-bold text-[#173563]">Course Requirements</h3>
              <ul className="space-y-2.5">
                {course.prerequisites.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <BookOpen className="h-5 w-5 text-[#3F6FA8] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Instructor Profile Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <h4 className="font-bold text-gray-900 text-base">AutoOps School</h4>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-bold text-lg flex items-center justify-center">
                {course.instructor?.name ? course.instructor.name[0] : 'I'}
              </div>
              <div>
                <h5 className="font-semibold text-gray-900 text-sm">{course.instructor?.name}</h5>
                <p className="text-xs text-indigo-600">{course.instructor?.headline || 'Program administration'}</p>
              </div>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              {course.instructor?.bio || 'Dedicated to mentoring students and providing industry-grade instruction.'}
            </p>
          </div>
        </div>
      </section>

      {/* Modal: Awaiting Admin Approval Notice */}
      {approvalNoticeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-xl border border-gray-100">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {paidNotice ? 'Payment Successful · Awaiting Approval' : 'Enrolled · Awaiting Approval'}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {paidNotice
                ? 'Your payment was verified by our server. Your enrollment is now awaiting Admin approval, and you will receive access once it is approved.'
                : 'You are enrolled in this free course. Your enrollment is awaiting Admin approval, and you will receive access once it is approved.'}
            </p>
            <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 font-medium">
              Upon approval, you will receive full access to the course content and materials for <strong className="text-slate-900">3 calendar months</strong>.
            </div>
            <div className="pt-2">
              <button
                onClick={() => {
                  setApprovalNoticeModal(false);
                  navigate('/student/dashboard');
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition"
              >
                Go to My Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Complete Profile First */}
      {profileNoticeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-xl border border-gray-100">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Profile Details Required</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Before enrolling, please complete your profile with a valid phone number. Admin reviews your contact information before approving your 3-month course access.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setProfileNoticeModal(false)}
                className="w-1/2 py-2.5 px-4 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setProfileNoticeModal(false);
                  navigate('/student/profile');
                }}
                className="w-1/2 py-2.5 px-4 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition"
              >
                Complete Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetailsPage;
