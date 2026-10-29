import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { openMaterial } from '../utils/materialAccess';
import {
  PlayCircle,
  CheckCircle,
  FileText,
  Award,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  HelpCircle,
  FolderDown,
  Download,
  ExternalLink,
  Lock,
  Clock
} from 'lucide-react';

const LearningPlayerPage = () => {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [curriculum, setCurriculum] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(null);
  const [activeTab, setActiveTab] = useState('lessons'); // lessons | materials | quizzes | assignments
  const [certificate, setCertificate] = useState(null);
  const [certLoading, setCertLoading] = useState(false);
  const [notice, setNotice] = useState('');
  const [busyMaterialId, setBusyMaterialId] = useState(null);
  const mediaOrigin = (import.meta.env.VITE_API_URL || '').replace(/\/api\/v1\/?$/, '');
  const apiOrigin = mediaOrigin ? `${mediaOrigin}/api/v1` : '/api/v1';

  const resolveMediaUrl = (url) => {
    if (!url || /^https?:\/\//i.test(url)) return url;
    const token = localStorage.getItem('token');
    const separator = url.includes('?') ? '&' : '?';
    const base = url.startsWith('/uploads') || url.startsWith('/api/')
      ? mediaOrigin
      : apiOrigin;
    return `${base}${url}${token ? `${separator}token=${encodeURIComponent(token)}` : ''}`;
  };

  useEffect(() => {
    fetchClassroom();
  }, [courseId]);

  useEffect(() => {
    if (enrollment?.status !== 'completed' || certificate) return;

    api.post('/certificates/generate', { courseId })
      .then((res) => setCertificate(res.data.certificate))
      .catch((err) => setNotice(err.response?.data?.message || 'Certificate issuance is unavailable'));
  }, [courseId, enrollment?.status, certificate]);

  const fetchClassroom = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/enrollments/classroom/${courseId}`);
      setCourse(res.data.course);
      const loadedCurriculum = (res.data.curriculum || []).map((module) => ({
        ...module,
        lessons: (module.lessons || []).map((lesson) => ({
          ...lesson,
          videoUrl: resolveMediaUrl(
            lesson.video?.fileId
              ? `/curriculum/courses/${courseId}/lessons/${lesson._id}/video`
              : lesson.videoUrl
          )
        }))
      }));
      setCurriculum(loadedCurriculum);
      setEnrollment(res.data.enrollment);

      // Set initial active lesson
      const allLessons = loadedCurriculum.flatMap((m) => m.lessons || []);
      if (allLessons.length > 0) {
        setActiveLesson(allLessons[0]);
      }

      // Fetch materials, quizzes & assignments in parallel. The /my variants
      // return the signed-in student's own attempt & submission status so the
      // sidebar can show accurate classroom status labels.
      const [mRes, qRes, aRes] = await Promise.all([
        api.get(`/materials/course/${courseId}`).catch(() => ({ data: { data: [] } })),
        api.get(`/quizzes/course/${courseId}/my`).catch(() => api.get(`/quizzes/course/${courseId}`).catch(() => ({ data: { quizzes: [] } }))),
        api.get(`/assignments/course/${courseId}/my`).catch(() => api.get(`/assignments/course/${courseId}`).catch(() => ({ data: { assignments: [] } })))
      ]);

      setMaterials(mRes.data.data || []);
      setQuizzes(qRes.data.quizzes || []);
      setAssignments(aRes.data.assignments || []);
    } catch (err) {
      console.error(err);
      if (err.response?.data?.code) {
        setAccessDenied({
          code: err.response.data.code,
          message: err.response.data.message
        });
      } else {
        setNotice(err.response?.data?.message || 'Failed to load classroom');
      }
    } finally {
      setLoading(false);
    }
  };

  const markLessonComplete = async (lessonId) => {
    try {
      const res = await api.post('/enrollments/complete-lesson', {
        courseId,
        lessonId
      });
      setEnrollment(res.data.enrollment);
    } catch (err) {
      console.error(err);
      setNotice(err.response?.data?.message || 'Could not record lesson completion');
    }
  };

  const handleClaimCertificate = async () => {
    setCertLoading(true);
    try {
      const res = await api.post('/certificates/generate', { courseId });
      setCertificate(res.data.certificate);
    } catch (err) {
      setNotice(err.response?.data?.message || 'Failed to claim certificate');
    } finally {
      setCertLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Classroom status label for a quiz, derived from the student's own stats.
  const quizStatusLabel = (quiz) => {
    const stats = quiz.stats || {};
    if (stats.inProgressAttempt) return { label: 'In Progress', tone: 'text-sky-300 bg-sky-950/60 border-sky-800' };
    if (stats.bestPercentage !== null && stats.bestPercentage !== undefined) {
      return stats.bestPercentage >= quiz.passingPercentage
        ? { label: 'Quiz Passed', tone: 'text-emerald-300 bg-emerald-950/60 border-emerald-800' }
        : { label: 'Quiz Failed', tone: 'text-rose-300 bg-rose-950/60 border-rose-800' };
    }
    return { label: 'Not Started', tone: 'text-gray-400 bg-gray-800 border-gray-700' };
  };

  // Classroom status label for an assignment, derived from mySubmission.
  const assignmentStatusLabel = (assignment) => {
    const s = assignment.mySubmission || {};
    const map = {
      draft: { label: 'Draft', tone: 'text-amber-300 bg-amber-950/60 border-amber-800' },
      submitted: { label: 'Assignment Submitted', tone: 'text-indigo-300 bg-indigo-950/60 border-indigo-800' },
      late: { label: 'Submitted Late', tone: 'text-orange-300 bg-orange-950/60 border-orange-800' },
      'under-review': { label: 'Under Review', tone: 'text-sky-300 bg-sky-950/60 border-sky-800' },
      graded: { label: 'Assignment Graded', tone: 'text-emerald-300 bg-emerald-950/60 border-emerald-800' },
      returned: { label: 'Returned for Revision', tone: 'text-rose-300 bg-rose-950/60 border-rose-800' },
      missed: { label: 'Missed Deadline', tone: 'text-rose-300 bg-rose-950/60 border-rose-800' }
    };
    return map[s.displayStatus] || { label: 'Not Started', tone: 'text-gray-400 bg-gray-800 border-gray-700' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  // Access denied screen (Pending approval or Expired 3-month access)
  if (accessDenied) {
    const isPending = accessDenied.code === 'PENDING_APPROVAL';
    const isExpired = accessDenied.code === 'ACCESS_EXPIRED';

    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 max-w-lg w-full text-center space-y-5 shadow-2xl">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
            isPending ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'
          }`}>
            {isPending ? <Clock className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
          </div>

          <h2 className="text-xl font-bold">
            {isPending ? 'Enrollment Awaiting Admin Approval' : isExpired ? 'Course Access Expired' : 'Access Restricted'}
          </h2>

          <p className="text-sm text-gray-400 leading-relaxed">
            {accessDenied.message}
          </p>

          <div className="pt-3">
            <Link
              to="/student/dashboard"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition"
            >
              Return to My Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Flat, ordered lesson list across the whole curriculum for Prev/Next navigation.
  const flatLessons = curriculum.flatMap((m) => m.lessons || []);
  const currentIdx = flatLessons.findIndex((l) => activeLesson && l._id === activeLesson._id);
  const goToLesson = (offset) => {
    const next = flatLessons[currentIdx + offset];
    if (next) setActiveLesson(next);
  };

  const raiseNotice = (text) => {
    setNotice(text);
    window.setTimeout(() => setNotice(''), 7000);
  };

  // Protected PDFs need the student's Authorization header, so the file is
  // fetched through the API client instead of a plain link navigation.
  const handleMaterialAction = async (material, inline) => {
    setBusyMaterialId(material._id);
    try {
      await openMaterial(material, { inline });
    } catch (err) {
      raiseNotice(
        err.response?.data?.message
        || err.message
        || 'This document is unavailable for your current access status.'
      );
    } finally {
      setBusyMaterialId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {notice && (
        <div className="fixed top-20 right-4 z-50 max-w-sm rounded-xl border border-red-500/30 bg-red-950 px-4 py-3 text-sm text-red-100 shadow-xl" role="alert">
          {notice}
          <button className="ml-3 font-bold" onClick={() => setNotice('')}>×</button>
        </div>
      )}

      {/* Top Bar */}
      <header className="h-16 bg-gray-900 border-b border-gray-800 px-3 sm:px-6 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Link
            to="/student/dashboard"
            className="flex items-center gap-1.5 shrink-0 text-xs font-semibold text-gray-400 hover:text-white bg-gray-800 px-2.5 sm:px-3 py-1.5 rounded-lg transition"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">My Dashboard</span>
          </Link>
          <span className="font-bold text-xs sm:text-sm text-gray-200 line-clamp-1 min-w-0">
            {course?.title}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 text-xs shrink-0">
          {enrollment?.accessExpiryDate && (
            <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 text-[11px]">
              <Clock className="w-3 h-3 text-indigo-400" />
              Expires {new Date(enrollment.accessExpiryDate).toLocaleDateString()}
            </span>
          )}

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-gray-400">Progress:</span>
            <span className="font-bold text-emerald-400">{enrollment?.progress || 0}%</span>
            <div className="w-24 bg-gray-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${enrollment?.progress || 0}%` }}
              />
            </div>
          </div>

          {(enrollment?.progress >= 100 || enrollment?.status === 'completed') && (
            <button
              onClick={handleClaimCertificate}
              disabled={certLoading}
              className="bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition"
            >
              <Award className="h-4 w-4" />
              <span className="hidden sm:inline">{certificate ? 'View Certificate' : 'Claim Certificate'}</span>
              <span className="sm:hidden">{certificate ? 'View' : 'Claim'}</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Learning Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Video Player & Content */}
        <div className="flex-1 flex flex-col bg-black overflow-y-auto">
          {/* Video Box */}
          <div className="relative aspect-video max-h-[65vh] w-full bg-black flex items-center justify-center">
            {activeLesson?.videoUrl ? (
              <video
                key={activeLesson._id}
                controls
                className="w-full h-full object-contain"
                src={activeLesson.videoUrl}
              >
                Your browser does not support HTML5 video.
              </video>
            ) : (
              <div className="text-center p-8 space-y-2">
                <PlayCircle className="h-12 w-12 text-gray-600 mx-auto" />
                <p className="text-sm text-gray-400">No media attached for this lesson</p>
              </div>
            )}
          </div>

          {/* Lesson Actions & Info */}
          <div className="p-4 sm:p-6 bg-gray-900 border-t border-gray-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">{activeLesson?.title}</h2>
                <p className="text-xs text-gray-400 mt-1">
                  Duration: {activeLesson?.duration || 10} minutes
                </p>
              </div>

              {activeLesson && (
                <button
                  onClick={() => markLessonComplete(activeLesson._id)}
                  className={`w-full sm:w-auto justify-center px-4 py-2.5 sm:py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                    enrollment?.completedLessons?.includes(activeLesson._id)
                      ? 'bg-emerald-600 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  <CheckCircle className="h-4 w-4" />
                  {enrollment?.completedLessons?.includes(activeLesson._id)
                    ? 'Completed'
                    : 'Mark as Complete'}
                </button>
              )}
            </div>

            <p className="text-sm text-gray-300 leading-relaxed max-w-4xl">
              {activeLesson?.description || 'Study this lesson carefully and complete the exercises.'}
            </p>

            {/* Downloadable resources (from Admin-managed curriculum) */}
            {activeLesson?.resources?.length > 0 && (
              <div className="space-y-2 pt-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Lesson Resources</h3>
                <div className="flex flex-wrap gap-2">
                  {activeLesson.resources.map((res, i) => (
                    <a
                      key={i}
                      href={res.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 px-3 py-1.5 text-xs font-semibold text-indigo-300 transition"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      {res.title || res.fileUrl}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Previous / Next lesson navigation */}
            {flatLessons.length > 0 && (
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-800">
                <button
                  onClick={() => goToLesson(-1)}
                  disabled={currentIdx <= 0}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-40 px-3 py-2 text-xs font-bold text-white transition"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous Lesson
                </button>
                <span className="text-[11px] text-gray-500">{(currentIdx >= 0 ? currentIdx + 1 : 0)} / {flatLessons.length}</span>
                <button
                  onClick={() => goToLesson(1)}
                  disabled={currentIdx >= flatLessons.length - 1}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 px-3 py-2 text-xs font-bold text-white transition"
                >
                  Next Lesson <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Certificate View Modal / Box */}
          {certificate && (
            <div className="p-4 sm:p-6 bg-indigo-950 border border-indigo-800 rounded-2xl m-4 sm:m-6 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-base sm:text-lg">
                <Award className="h-6 w-6" /> Certificate Issued!
              </div>
              <p className="text-xs text-indigo-200">
                Congratulations on completing the curriculum! Certificate Serial: <code>{certificate.certificateNumber}</code>
              </p>
              <Link
                to={`/verify-certificate/${certificate.certificateNumber}`}
                target="_blank"
                className="inline-block bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs px-4 py-2 rounded-lg"
              >
                Open Verification Certificate
              </Link>
            </div>
          )}
        </div>

        {/* Right: Sidebar Tabs (Lessons, Materials/PDFs, Quizzes, Assignments) */}
        <div className="w-full lg:w-96 bg-gray-900 border-l border-gray-800 flex flex-col h-auto lg:h-[calc(100vh-4rem)]">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-800 text-xs font-bold overflow-x-auto">
            <button
              onClick={() => setActiveTab('lessons')}
              className={`flex-1 min-w-[70px] py-3 text-center transition ${
                activeTab === 'lessons'
                  ? 'text-indigo-400 border-b-2 border-indigo-500 bg-gray-800/50'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Curriculum
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className={`flex-1 min-w-[90px] py-3 text-center transition ${
                activeTab === 'materials'
                  ? 'text-indigo-400 border-b-2 border-indigo-500 bg-gray-800/50'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              PDFs &amp; Resources ({materials.length})
            </button>
            <button
              onClick={() => setActiveTab('quizzes')}
              className={`flex-1 min-w-[70px] py-3 text-center transition ${
                activeTab === 'quizzes'
                  ? 'text-indigo-400 border-b-2 border-indigo-500 bg-gray-800/50'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Quizzes ({quizzes.length})
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className={`flex-1 min-w-[85px] py-3 text-center transition ${
                activeTab === 'assignments'
                  ? 'text-indigo-400 border-b-2 border-indigo-500 bg-gray-800/50'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Assignments ({assignments.length})
            </button>
          </div>

          {/* Tab Contents */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Curriculum Tab */}
            {activeTab === 'lessons' && (
              <div className="space-y-4">
                {curriculum.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-8">No lessons have been published for this course yet.</p>
                ) : curriculum.map((mod) => {
                  const moduleQuizzes = quizzes.filter((q) => String(q.moduleId || '') === String(mod._id) && !q.lessonId);
                  return (
                  <div key={mod._id} className="space-y-2">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      {mod.title}
                    </h4>
                    <div className="space-y-1">
                      {(mod.lessons || []).map((l) => {
                        const isCompleted = enrollment?.completedLessons?.includes(l._id);
                        const isCurrent = activeLesson?._id === l._id;
                        const lessonQuizzes = quizzes.filter((q) => String(q.lessonId || '') === String(l._id));
                        const lessonAssignments = assignments.filter((a) => String(a.lessonId || '') === String(l._id));
                        return (
                          <div key={l._id} className="space-y-1">
                            <button
                              onClick={() => setActiveLesson(l)}
                              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition ${
                                isCurrent
                                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50 font-bold'
                                  : 'hover:bg-gray-800 text-gray-300'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {isCompleted ? (
                                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                                ) : (
                                  <PlayCircle className="h-4 w-4 text-gray-500 shrink-0" />
                                )}
                                <span className="line-clamp-1">{l.title}</span>
                              </div>
                              <span className="text-[10px] text-gray-500 ml-2">{l.duration}m</span>
                            </button>
                            {(lessonQuizzes.length > 0 || lessonAssignments.length > 0) && (
                              <div className="flex flex-wrap gap-1 pl-6">
                                {lessonQuizzes.map((q) => (
                                  <Link key={q._id} to={`/student/courses/${courseId}/quizzes/${q._id}`} className="inline-flex items-center gap-1 rounded-md bg-gray-800/70 hover:bg-gray-700 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-300">
                                    <HelpCircle className="h-3 w-3" /> Quiz
                                  </Link>
                                ))}
                                {lessonAssignments.map((a) => (
                                  <Link key={a._id} to={`/student/courses/${courseId}/assignments/${a._id}`} className="inline-flex items-center gap-1 rounded-md bg-gray-800/70 hover:bg-gray-700 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                                    <BookOpen className="h-3 w-3" /> {a.isProject ? 'Project' : 'Assignment'}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                      {moduleQuizzes.length > 0 && (
                        <div className="flex flex-wrap gap-1 pl-2 pt-1">
                          {moduleQuizzes.map((q) => (
                            <Link key={q._id} to={`/student/courses/${courseId}/quizzes/${q._id}`} className="inline-flex items-center gap-1 rounded-md bg-indigo-950/50 hover:bg-indigo-900/60 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-300 border border-indigo-900/50">
                              <HelpCircle className="h-3 w-3" /> Module quiz: {q.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  );
                })}
              </div>
            )}

            {/* PDFs and Course Materials Tab */}
            {activeTab === 'materials' && (
              <div className="space-y-3">
                <div className="p-3 bg-indigo-950/40 rounded-xl border border-indigo-900/60 text-xs text-indigo-200">
                  Exclusive reference notes, study guides, and slide PDFs uploaded by Admin for your 3-month access period.
                </div>

                {materials.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-8">
                    No course materials have been uploaded yet. Check back soon!
                  </p>
                ) : (
                  materials.map((mat) => (
                    <div
                      key={mat._id}
                      className="bg-gray-800/80 border border-gray-700 rounded-xl p-3.5 space-y-2 hover:border-gray-600 transition"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-red-950/60 text-red-400 border border-red-800/40 rounded-lg shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-xs text-white truncate">{mat.title}</h4>
                          {mat.description && (
                            <p className="text-[11px] text-gray-400 line-clamp-2 mt-0.5">{mat.description}</p>
                          )}
                          <div className="text-[10px] text-gray-500 mt-1 flex items-center gap-2">
                            <span>{formatFileSize(mat.fileSize)}</span>
                            <span>•</span>
                            <span>{new Date(mat.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1 border-t border-gray-700/50">
                        <button
                          onClick={() => handleMaterialAction(mat, true)}
                          disabled={busyMaterialId === mat._id}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 transition disabled:opacity-50"
                        >
                          <ExternalLink className="w-3 h-3" /> View
                        </button>
                        <button
                          onClick={() => handleMaterialAction(mat, false)}
                          disabled={busyMaterialId === mat._id}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition disabled:opacity-50"
                        >
                          <Download className="w-3 h-3" /> Download
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Quizzes Tab */}
            {activeTab === 'quizzes' && (
              <div className="space-y-3">
                {quizzes.length > 0 && (
                  <Link to={`/student/courses/${courseId}/quizzes`} className="block rounded-lg bg-indigo-950/50 border border-indigo-900/60 px-3 py-2 text-[11px] font-bold text-indigo-300 hover:bg-indigo-900/60 text-center">
                    View all quizzes →
                  </Link>
                )}
                {quizzes.length === 0 ? (
                  <div className="text-center py-10 space-y-2">
                    <HelpCircle className="h-8 w-8 text-gray-600 mx-auto" />
                    <p className="text-xs text-gray-400">No quizzes have been published for this course yet.</p>
                  </div>
                ) : (
                  quizzes.map((quiz) => {
                    const status = quizStatusLabel(quiz);
                    const stats = quiz.stats || {};
                    return (
                      <div key={quiz._id} className="bg-gray-800 p-4 rounded-xl space-y-2 border border-gray-700">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-xs text-white">{quiz.title}</h4>
                          <span className={`shrink-0 text-[10px] font-bold border px-2 py-0.5 rounded-full ${status.tone}`}>{status.label}</span>
                        </div>
                        <p className="text-[11px] text-gray-400">{quiz.moduleTitle || 'Whole course'}{quiz.lessonTitle ? ` · ${quiz.lessonTitle}` : ''}</p>
                        <p className="text-[11px] text-gray-400">
                          {quiz.questions?.length || 0} Questions • Passing: {quiz.passingPercentage}% • {quiz.feedbackMode === 'immediate' ? 'Practice' : 'Assessment'}
                        </p>
                        <div className="flex gap-2 pt-1">
                          <Link
                            to={`/student/courses/${courseId}/quizzes/${quiz._id}`}
                            className={`flex-1 text-center py-1.5 rounded-lg text-xs font-bold transition ${stats.canStart ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-gray-700 text-gray-500 pointer-events-none'}`}
                          >
                            {stats.inProgressAttempt ? 'Resume quiz' : stats.attemptsUsed > 0 ? (stats.canStart ? 'Retry quiz' : 'No attempts left') : 'Start quiz'}
                          </Link>
                          {stats.latestAttempt && (
                            <Link to={`/student/courses/${courseId}/quizzes/${quiz._id}/results/${stats.latestAttempt._id}`} className="py-1.5 px-3 rounded-lg text-xs font-bold bg-gray-700 hover:bg-gray-600 text-gray-200">
                              Result
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Assignments & Projects Tab */}
            {activeTab === 'assignments' && (
              <div className="space-y-3">
                {assignments.length > 0 && (
                  <div className="flex gap-2">
                    <Link to={`/student/courses/${courseId}/assignments`} className="flex-1 rounded-lg bg-indigo-950/50 border border-indigo-900/60 px-3 py-2 text-[11px] font-bold text-indigo-300 hover:bg-indigo-900/60 text-center">
                      View all assignments →
                    </Link>
                    <Link to="/student/assignments/history" className="rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-[11px] font-bold text-gray-300 hover:bg-gray-700">
                      History
                    </Link>
                  </div>
                )}
                {assignments.length === 0 ? (
                  <div className="text-center py-10 space-y-2">
                    <BookOpen className="h-8 w-8 text-gray-600 mx-auto" />
                    <p className="text-xs text-gray-400">No assignments or projects have been published for this course yet.</p>
                  </div>
                ) : (
                  assignments.map((ass) => {
                    const status = assignmentStatusLabel(ass);
                    return (
                      <div key={ass._id} className="bg-gray-800 p-4 rounded-xl space-y-2 border border-gray-700">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-xs text-white">{ass.title}</h4>
                          <span className={`shrink-0 text-[10px] font-bold border px-2 py-0.5 rounded-full ${status.tone}`}>{status.label}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400">
                          {ass.isProject && <span className="bg-purple-900/50 text-purple-300 px-1.5 py-0.5 rounded font-bold">Project</span>}
                          <span>{ass.moduleTitle || 'Whole course'}{ass.lessonTitle ? ` · ${ass.lessonTitle}` : ''}</span>
                        </div>
                        <p className="text-[11px] text-gray-400">Due {ass.dueDate ? new Date(ass.dueDate).toLocaleDateString() : '—'} • {ass.totalMarks} marks</p>
                        <Link
                          to={`/student/courses/${courseId}/assignments/${ass._id}`}
                          className="block w-full text-center py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition"
                        >
                          {ass.mySubmission?.hasSubmission ? 'View submission' : 'Open & submit'}
                        </Link>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPlayerPage;
