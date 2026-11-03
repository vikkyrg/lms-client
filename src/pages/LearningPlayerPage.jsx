import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [curriculum, setCurriculum] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(null);
  const [activeTab, setActiveTab] = useState('lessons'); // lessons | materials
  const [certificate, setCertificate] = useState(null);
  const [certLoading, setCertLoading] = useState(false);
  const [notice, setNotice] = useState('');
  const [busyMaterialId, setBusyMaterialId] = useState(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [videoMaxTime, setVideoMaxTime] = useState(0);
  const [watchedSecondsSet, setWatchedSecondsSet] = useState(new Set());
  const [isCompletedState, setIsCompletedState] = useState(false);
  const [completionSubmitting, setCompletionSubmitting] = useState(false);

  const videoRef = useRef(null);
  const lastTimeRef = useRef(0);
  const maxTimeRef = useRef(0);
  const watchedSetRef = useRef(new Set());
  const hasCompletedRef = useRef(false);
  const lastSyncTimeRef = useRef(0);

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

      // Set initial active lesson: choose last accessed or first unlocked lesson
      const allLessons = loadedCurriculum.flatMap((m) => m.lessons || []);
      if (allLessons.length > 0) {
        const completedIds = new Set((res.data.enrollment?.completedLessons || []).map((id) => id.toString()));
        let initialLesson = allLessons[0];
        if (res.data.enrollment?.lastAccessedLesson) {
          const match = allLessons.find(
            (l) => l._id.toString() === res.data.enrollment.lastAccessedLesson.toString()
          );
          if (match) initialLesson = match;
        } else {
          // Find first uncompleted lesson
          const firstIncomplete = allLessons.find((l) => !completedIds.has(l._id.toString()));
          if (firstIncomplete) initialLesson = firstIncomplete;
        }
        setActiveLesson(initialLesson);
      }

      // Fetch materials
      const mRes = await api.get(`/materials/course/${courseId}`).catch(() => ({ data: { data: [] } }));
      setMaterials(mRes.data.data || []);
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

  // Flat, ordered lesson list across the whole curriculum for Prev/Next navigation & unlock checking
  const flatLessons = curriculum.flatMap((m) => m.lessons || []);
  const currentIdx = flatLessons.findIndex((l) => activeLesson && l._id === activeLesson._id);

  // Check if a specific lesson is unlocked for the student
  const isLessonUnlocked = (lessonIndex) => {
    if (lessonIndex <= 0) return true;
    if (!enrollment) return false;
    const completedIds = new Set((enrollment.completedLessons || []).map((id) => id.toString()));
    // All preceding lessons must be in completedLessons
    for (let i = 0; i < lessonIndex; i++) {
      if (!completedIds.has(flatLessons[i]._id.toString())) {
        return false;
      }
    }
    return true;
  };

  // Reset/restore playback tracker state when active lesson changes
  useEffect(() => {
    if (!activeLesson) return;

    const isAlreadyCompleted = (enrollment?.completedLessons || []).some(
      (id) => id.toString() === activeLesson._id.toString()
    );
    setIsCompletedState(isAlreadyCompleted);
    hasCompletedRef.current = isAlreadyCompleted;

    // Check saved progress from enrollment
    const savedProgress = (enrollment?.lessonProgress || []).find(
      (lp) => (lp.lesson?._id || lp.lesson)?.toString() === activeLesson._id.toString()
    );

    const initialPos = savedProgress?.playbackPosition || 0;
    const initialWatched = savedProgress?.secondsWatched || 0;

    lastTimeRef.current = initialPos;
    maxTimeRef.current = isAlreadyCompleted ? 999999 : Math.max(initialPos, initialWatched);
    setVideoMaxTime(maxTimeRef.current);
    setVideoCurrentTime(initialPos);

    const initialSet = new Set();
    if (initialWatched > 0) {
      for (let s = 0; s < Math.floor(initialWatched); s++) {
        initialSet.add(s);
      }
    }
    watchedSetRef.current = initialSet;
    setWatchedSecondsSet(new Set(initialSet));
  }, [activeLesson?._id, enrollment]);

  // Video event handlers to strictly prevent forward seeking and enforce complete watching
  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    const dur = videoRef.current.duration || 0;
    setVideoDuration(dur);

    const isAlreadyCompleted = (enrollment?.completedLessons || []).some(
      (id) => id.toString() === activeLesson?._id.toString()
    );

    if (isAlreadyCompleted) {
      maxTimeRef.current = dur;
      setVideoMaxTime(dur);
    } else {
      // Restore playback position if within verified reached bounds
      const savedProgress = (enrollment?.lessonProgress || []).find(
        (lp) => (lp.lesson?._id || lp.lesson)?.toString() === activeLesson?._id.toString()
      );
      if (savedProgress?.playbackPosition && savedProgress.playbackPosition < dur) {
        // Only restore up to verified seconds watched to prevent spoofed positions
        const safePos = Math.min(savedProgress.playbackPosition, (savedProgress.secondsWatched || 0) + 2);
        videoRef.current.currentTime = safePos;
        lastTimeRef.current = safePos;
        maxTimeRef.current = safePos;
        setVideoMaxTime(safePos);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 0;

    const isAlreadyCompleted = (enrollment?.completedLessons || []).some(
      (id) => id.toString() === activeLesson?._id.toString()
    );

    // Forward seeking prevention: strictly reject any jump forward past maxTimeRef
    if (!isAlreadyCompleted) {
      if (curr > maxTimeRef.current + 1.0) {
        videoRef.current.currentTime = maxTimeRef.current;
        setNotice('Forward skipping is disabled. Please watch the video in sequence.');
        return;
      }
    }

    // Advance verified maximum time reached linearly
    if (curr > maxTimeRef.current) {
      maxTimeRef.current = curr;
      setVideoMaxTime(curr);
    }
    lastTimeRef.current = curr;
    setVideoCurrentTime(curr);

    // Track contiguous/segmented watch seconds
    const sec = Math.floor(curr);
    if (!watchedSetRef.current.has(sec)) {
      watchedSetRef.current.add(sec);
      setWatchedSecondsSet(new Set(watchedSetRef.current));
    }

    // Periodically sync progress to backend (every 10s or when advancing)
    const now = Date.now();
    if (now - lastSyncTimeRef.current > 10000 && activeLesson) {
      lastSyncTimeRef.current = now;
      api.post('/enrollments/video-progress', {
        courseId,
        lessonId: activeLesson._id,
        playbackPosition: curr,
        secondsWatched: watchedSetRef.current.size
      }).catch(() => {});
    }

    // Automatic video completion when student genuinely reaches the end
    // Requires both reaching the end of the timeline AND having watched >= 95% of duration
    if (!isAlreadyCompleted && !hasCompletedRef.current && dur > 0) {
      const watchedPct = (watchedSetRef.current.size / dur) * 100;
      if (curr >= dur - 1.5 && watchedPct >= 95) {
        triggerCompletion();
      }
    }
  };

  const handleSeeking = () => {
    if (!videoRef.current) return;
    const isAlreadyCompleted = (enrollment?.completedLessons || []).some(
      (id) => id.toString() === activeLesson?._id.toString()
    );
    // Strict forward seek block: rewind immediately to verified max time
    if (!isAlreadyCompleted && videoRef.current.currentTime > maxTimeRef.current + 0.5) {
      videoRef.current.currentTime = maxTimeRef.current;
      setNotice('Forward skipping is disabled. You can rewind to review, but unwatched parts must be played through.');
    }
  };

  // Keyboard shortcut listener to prevent ArrowRight or 'l' skip ahead
  const handleKeyDown = (e) => {
    const isAlreadyCompleted = (enrollment?.completedLessons || []).some(
      (id) => id.toString() === activeLesson?._id.toString()
    );
    if (isAlreadyCompleted) return;

    if (e.key === 'ArrowRight' || e.key === 'l' || e.key === 'L') {
      e.preventDefault();
      e.stopPropagation();
      setNotice('Forward skipping is disabled.');
    }
  };

  const triggerCompletion = async () => {
    if (!activeLesson || completionSubmitting) return;
    const isAlreadyCompleted = (enrollment?.completedLessons || []).some(
      (id) => id.toString() === activeLesson._id.toString()
    );
    if (isAlreadyCompleted) {
      setIsCompletedState(true);
      return;
    }

    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    setCompletionSubmitting(true);

    try {
      const dur = videoRef.current?.duration || (activeLesson.duration ? activeLesson.duration * 60 : 60);
      const res = await api.post('/enrollments/complete-lesson', {
        courseId,
        lessonId: activeLesson._id,
        duration: dur,
        watchedSeconds: Math.max(watchedSetRef.current.size, dur)
      });
      setEnrollment(res.data.enrollment);
      setIsCompletedState(true);
      raiseNotice('Lesson completed! The next lesson is now unlocked.');
    } catch (err) {
      hasCompletedRef.current = false;
      console.error(err);
      setNotice(err.response?.data?.message || 'Could not record lesson completion');
    } finally {
      setCompletionSubmitting(false);
    }
  };

  const selectLesson = (lesson, index) => {
    if (!isLessonUnlocked(index)) {
      setNotice('Complete the previous lessons to unlock this video.');
      return;
    }
    setActiveLesson(lesson);
  };

  const markLessonComplete = async (lessonId) => {
    const isAlreadyCompleted = (enrollment?.completedLessons || []).some(
      (id) => id.toString() === lessonId.toString()
    );
    if (isAlreadyCompleted) return;

    const hasVideo = !!activeLesson?.videoUrl;
    if (hasVideo) {
      const dur = videoRef.current?.duration || 0;
      const watched = watchedSetRef.current.size;
      const watchedPct = dur > 0 ? (watched / dur) * 100 : 0;
      if (dur > 0 && watchedPct < 95) {
        setNotice(
          `You must watch the complete video before this lesson can be completed (${Math.round(watchedPct)}% watched).`
        );
        return;
      }
    }
    await triggerCompletion();
  };

  const handleViewOrClaimCertificate = async () => {
    if (certificate?.certificateNumber) {
      window.open(`/verify-certificate/${certificate.certificateNumber}`, '_blank');
      return;
    }
    setCertLoading(true);
    try {
      const res = await api.post('/certificates/generate', { courseId });
      const certData = res.data.certificate;
      setCertificate(certData);
      if (certData?.certificateNumber) {
        window.open(`/verify-certificate/${certData.certificateNumber}`, '_blank');
      }
    } catch (err) {
      setNotice(err.response?.data?.message || 'Failed to claim certificate');
    } finally {
      setCertLoading(false);
    }
  };

  const handleClaimCertificate = handleViewOrClaimCertificate;

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-[#162F57] flex flex-col items-center justify-center space-y-3">
        <div className="animate-spin h-9 w-9 border-4 border-[#3B82F6] border-t-transparent rounded-full" />
        <p className="text-xs font-semibold text-[#64748B]">Loading your classroom...</p>
      </div>
    );
  }

  // Access denied screen (Pending approval or Expired 3-month access)
  if (accessDenied) {
    const isPending = accessDenied.code === 'PENDING_APPROVAL';
    const isExpired = accessDenied.code === 'ACCESS_EXPIRED';

    return (
      <div className="min-h-screen bg-[#F8FAFC] text-[#162F57] flex items-center justify-center p-4">
        <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 max-w-lg w-full text-center space-y-5 shadow-xl">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto border ${
              isPending
                ? 'bg-amber-50 text-amber-600 border-amber-200'
                : 'bg-rose-50 text-rose-600 border-rose-200'
            }`}
          >
            {isPending ? <Clock className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
          </div>

          <h2 className="text-xl font-extrabold text-[#162F57]">
            {isPending ? 'Enrollment Awaiting Admin Approval' : isExpired ? 'Course Access Expired' : 'Access Restricted'}
          </h2>

          <p className="text-sm text-[#64748B] leading-relaxed">
            {accessDenied.message}
          </p>

          <div className="pt-2">
            <Link
              to="/student/dashboard"
              className="inline-block bg-[#162F57] hover:bg-[#0f213d] text-white font-bold text-xs px-6 py-3 rounded-xl shadow-sm transition"
            >
              Return to My Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const goToLesson = (offset) => {
    const targetIdx = currentIdx + offset;
    const next = flatLessons[targetIdx];
    if (!next) return;
    if (offset > 0 && !isLessonUnlocked(targetIdx)) {
      raiseNotice('Complete this video to unlock the next lesson.');
      return;
    }
    setActiveLesson(next);
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
    <div className="min-h-screen bg-[#F8FAFC] text-[#162F57] flex flex-col">
      {notice && (
        <div
          className="fixed top-20 right-4 z-50 max-w-sm rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700 shadow-xl flex items-center justify-between gap-3 animate-in fade-in"
          role="alert"
        >
          <span>{notice}</span>
          <button className="font-bold text-red-700 hover:text-red-900 cursor-pointer" onClick={() => setNotice('')}>
            ×
          </button>
        </div>
      )}

      {/* Top Header - White background, crisp border, dark navy branding */}
      <header className="sticky top-0 z-30 h-16 bg-white border-b border-[#E2E8F0] px-4 sm:px-6 flex items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <Link
            to="/student/dashboard"
            className="flex items-center gap-1.5 shrink-0 text-xs font-bold text-[#162F57] hover:text-[#3B82F6] bg-[#F1F5F9] hover:bg-[#E2E8F0] border border-[#CBD5E1] px-3 py-1.5 rounded-lg transition"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">My Dashboard</span>
          </Link>
          <span className="font-extrabold text-sm sm:text-base text-[#162F57] line-clamp-1 min-w-0">
            {course?.title}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 text-xs shrink-0">
          {enrollment?.accessExpiryDate && (
            <span className="hidden md:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#EAF4FF] text-[#162F57] border border-[#BFDBFE] text-[11px] font-semibold">
              <Clock className="w-3 h-3 text-[#3B82F6]" />
              Expires {new Date(enrollment.accessExpiryDate).toLocaleDateString()}
            </span>
          )}

          <div className="hidden sm:flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-1 rounded-xl">
            <span className="text-[#64748B] text-xs font-medium">Progress:</span>
            <span className="font-black text-[#10B981] text-xs">{enrollment?.progress || 0}%</span>
            <div className="w-24 bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#10B981] h-2 rounded-full transition-all duration-300"
                style={{ width: `${enrollment?.progress || 0}%` }}
              />
            </div>
          </div>

          {(enrollment?.progress >= 100 || enrollment?.status === 'completed') && (
            <button
              onClick={handleClaimCertificate}
              disabled={certLoading}
              className="bg-[#FFD65A] hover:bg-[#ffcd36] text-[#162F57] font-black px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
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
        {/* Left: Video Player & Content Container */}
        <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Clean White Player Card with Light-Gray Border */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl sm:rounded-3xl p-2 sm:p-3 shadow-xs">
            <div className="relative aspect-video w-full rounded-xl sm:rounded-2xl overflow-hidden bg-black flex items-center justify-center">
              {activeLesson?.videoUrl ? (
                <div className="relative w-full h-full flex items-center justify-center group">
                  <video
                    ref={videoRef}
                    key={activeLesson._id}
                    controls
                    controlsList="nodownload"
                    className="w-full h-full object-contain"
                    src={activeLesson.videoUrl}
                    onLoadedMetadata={handleLoadedMetadata}
                    onTimeUpdate={handleTimeUpdate}
                    onSeeking={handleSeeking}
                    onKeyDown={handleKeyDown}
                    onEnded={() => {
                      if (!isCompletedState && !hasCompletedRef.current && !completionSubmitting) {
                        triggerCompletion();
                      }
                    }}
                  >
                    Your browser does not support HTML5 video.
                  </video>
                </div>
              ) : (
                <div className="text-center p-8 space-y-2 bg-[#F8FAFC] w-full h-full flex flex-col items-center justify-center">
                  <PlayCircle className="h-12 w-12 text-[#94A3B8] mx-auto" />
                  <p className="text-sm font-semibold text-[#162F57]">No media attached for this lesson</p>
                </div>
              )}
            </div>
          </div>

          {/* Lesson Actions & Info Card */}
          <div className="p-5 sm:p-6 bg-white border border-[#E2E8F0] rounded-2xl shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#162F57] tracking-tight">
                  {activeLesson?.title}
                </h2>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#64748B]">
                    <Clock className="w-3.5 h-3.5 text-[#94A3B8]" />
                    Duration: {activeLesson?.duration || 10} minutes
                  </span>
                  {activeLesson?.isFreePreview && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Free Preview
                    </span>
                  )}
                </div>
              </div>

              {activeLesson && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      if (!isCompletedState) {
                        markLessonComplete(activeLesson._id);
                      }
                    }}
                    disabled={isCompletedState || completionSubmitting}
                    className={`w-full sm:w-auto justify-center px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition shadow-xs ${
                      isCompletedState
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 cursor-default'
                        : 'bg-[#F1F5F9] text-[#162F57] border border-[#CBD5E1] hover:bg-[#E2E8F0] cursor-pointer'
                    }`}
                  >
                    <CheckCircle className={`h-4 w-4 ${isCompletedState ? 'text-emerald-600' : 'text-[#3B82F6]'}`} />
                    {isCompletedState
                      ? 'Lesson Completed'
                      : completionSubmitting
                      ? 'Verifying...'
                      : 'Watching in Progress'}
                  </button>
                </div>
              )}
            </div>

            <p className="text-sm text-[#475569] leading-relaxed max-w-4xl">
              {activeLesson?.description || 'Study this lesson carefully and complete the exercises.'}
            </p>

            {/* Downloadable resources (from Admin-managed curriculum) */}
            {activeLesson?.resources?.length > 0 && (
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Lesson Resources</h3>
                <div className="flex flex-wrap gap-2">
                  {activeLesson.resources.map((res, i) => (
                    <a
                      key={i}
                      href={res.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] px-3.5 py-1.5 text-xs font-bold text-[#162F57] hover:text-[#3B82F6] transition shadow-2xs"
                    >
                      <FileText className="h-3.5 w-3.5 text-[#3B82F6]" />
                      {res.title || res.fileUrl}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Previous / Next lesson navigation */}
            {flatLessons.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#E2E8F0]">
                {/* Previous Lesson: White background, navy text, light border */}
                <button
                  onClick={() => goToLesson(-1)}
                  disabled={currentIdx <= 0}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-white hover:bg-slate-50 disabled:opacity-40 border border-[#CBD5E1] px-4 py-2.5 text-xs font-extrabold text-[#162F57] transition shadow-2xs cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous Lesson
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#64748B]">
                    Lesson {(currentIdx >= 0 ? currentIdx + 1 : 0)} of {flatLessons.length}
                  </span>
                  {!isLessonUnlocked(currentIdx + 1) && currentIdx < flatLessons.length - 1 && (
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Lock className="w-3 h-3 text-amber-600" /> Complete this video to unlock next
                    </span>
                  )}
                </div>

                {/* Next Lesson: Navy blue background, white text */}
                <button
                  onClick={() => goToLesson(1)}
                  disabled={currentIdx >= flatLessons.length - 1 || !isLessonUnlocked(currentIdx + 1)}
                  title={!isLessonUnlocked(currentIdx + 1) ? 'Complete this video to unlock the next lesson' : 'Next Lesson'}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#162F57] hover:bg-[#0f213d] disabled:opacity-40 disabled:cursor-not-allowed px-5 py-2.5 text-xs font-extrabold text-white transition shadow-sm cursor-pointer"
                >
                  {!isLessonUnlocked(currentIdx + 1) && currentIdx < flatLessons.length - 1 && (
                    <Lock className="h-3.5 w-3.5 mr-0.5 text-[#FFD65A]" />
                  )}
                  <span>Next Lesson</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Certificate View Modal / Box */}
          {certificate && (
            <div className="p-5 sm:p-6 bg-[#EAF4FF] border border-[#BFDBFE] rounded-2xl space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-[#162F57] font-black text-base sm:text-lg">
                <Award className="h-6 w-6 text-[#3B82F6]" /> Certificate Issued!
              </div>
              <p className="text-xs font-medium text-[#475569]">
                Congratulations on completing the curriculum! Certificate Serial: <code className="font-bold text-[#162F57]">{certificate.certificateNumber}</code>
              </p>
              <Link
                to={`/verify-certificate/${certificate.certificateNumber}`}
                target="_blank"
                className="inline-block bg-[#FFD65A] hover:bg-[#ffcd36] text-[#162F57] font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition"
              >
                Open Verification Certificate
              </Link>
            </div>
          )}
        </div>

        {/* Right: Sidebar Tabs (Curriculum & Learning Materials/PDFs) - Light Theme */}
        <div className="w-full lg:w-96 bg-white border-l border-[#E2E8F0] flex flex-col h-auto lg:h-[calc(100vh-4rem)] shadow-2xs">
          {/* Tab Navigation */}
          <div className="flex border-b border-[#E2E8F0] text-xs font-bold overflow-x-auto bg-[#F8FAFC]">
            <button
              onClick={() => setActiveTab('lessons')}
              className={`flex-1 min-w-[70px] py-3.5 text-center transition cursor-pointer ${
                activeTab === 'lessons'
                  ? 'text-[#162F57] border-b-2 border-[#162F57] bg-white font-extrabold'
                  : 'text-[#64748B] hover:text-[#162F57]'
              }`}
            >
              Curriculum
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className={`flex-1 min-w-[90px] py-3.5 text-center transition cursor-pointer ${
                activeTab === 'materials'
                  ? 'text-[#162F57] border-b-2 border-[#162F57] bg-white font-extrabold'
                  : 'text-[#64748B] hover:text-[#162F57]'
              }`}
            >
              PDFs &amp; Resources ({materials.length})
            </button>
          </div>

          {/* Tab Contents */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Curriculum Tab */}
            {activeTab === 'lessons' && (
              <div className="space-y-4">
                {curriculum.length === 0 ? (
                  <p className="text-xs text-[#94A3B8] text-center py-8">No lessons have been published for this course yet.</p>
                ) : curriculum.map((mod) => (
                  <div key={mod._id} className="space-y-2">
                    <h4 className="text-xs font-black text-[#162F57] bg-[#F1F5F9] border border-[#E2E8F0] px-3 py-2 rounded-lg uppercase tracking-wider">
                      {mod.title}
                    </h4>
                    <div className="space-y-1.5">
                      {(mod.lessons || []).map((l) => {
                        const lessonIdx = flatLessons.findIndex((item) => item._id === l._id);
                        const isCompleted = (enrollment?.completedLessons || []).some(
                          (id) => id.toString() === l._id.toString()
                        );
                        const isCurrent = activeLesson?._id === l._id;
                        const unlocked = isLessonUnlocked(lessonIdx);

                        return (
                          <button
                            key={l._id}
                            onClick={() => selectLesson(l, lessonIdx)}
                            disabled={!unlocked}
                            className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-xs transition border ${
                              isCurrent
                                ? 'bg-[#EAF4FF] text-[#162F57] border-[#3B82F6] font-extrabold shadow-2xs'
                                : isCompleted
                                ? 'bg-emerald-50/60 border-emerald-100 text-[#162F57] hover:bg-emerald-50'
                                : unlocked
                                ? 'bg-white hover:bg-slate-50 border-[#E2E8F0] text-[#162F57] cursor-pointer'
                                : 'opacity-50 bg-[#F8FAFC] border-slate-200 text-[#94A3B8] cursor-not-allowed'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {isCompleted ? (
                                <CheckCircle className="h-4 w-4 text-[#10B981] shrink-0" />
                              ) : unlocked ? (
                                <PlayCircle className={`h-4 w-4 shrink-0 ${isCurrent ? 'text-[#3B82F6]' : 'text-[#64748B]'}`} />
                              ) : (
                                <Lock className="h-4 w-4 text-[#94A3B8] shrink-0" />
                              )}
                              <span className="line-clamp-1">{l.title}</span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0 ml-2">
                              {l.isFreePreview && (
                                <span className="text-[9px] font-black uppercase text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-sm">
                                  Free
                                </span>
                              )}
                              {!unlocked && <Lock className="w-3 h-3 text-[#94A3B8]" />}
                              <span className="text-[10px] font-semibold text-[#64748B]">{l.duration}m</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* PDFs and Course Materials Tab */}
            {activeTab === 'materials' && (
              <div className="space-y-3">
                <div className="p-3 bg-[#EAF4FF] rounded-xl border border-[#BFDBFE] text-xs text-[#162F57] font-medium">
                  Exclusive reference notes, study guides, and slide PDFs uploaded by Admin for your 3-month access period.
                </div>

                {materials.length === 0 ? (
                  <p className="text-xs text-[#94A3B8] text-center py-8">
                    No course materials have been uploaded yet. Check back soon!
                  </p>
                ) : (
                  materials.map((mat) => (
                    <div
                      key={mat._id}
                      className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 space-y-2.5 hover:border-[#CBD5E1] transition shadow-2xs"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-xs text-[#162F57] truncate">{mat.title}</h4>
                          {mat.description && (
                            <p className="text-[11px] text-[#64748B] line-clamp-2 mt-0.5">{mat.description}</p>
                          )}
                          <div className="text-[10px] text-[#94A3B8] mt-1 flex items-center gap-2">
                            <span>{formatFileSize(mat.fileSize)}</span>
                            <span>•</span>
                            <span>{new Date(mat.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1F5F9]">
                        <button
                          onClick={() => handleMaterialAction(mat, true)}
                          disabled={busyMaterialId === mat._id}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold text-[#162F57] bg-[#F1F5F9] hover:bg-[#E2E8F0] border border-[#CBD5E1] transition cursor-pointer disabled:opacity-50"
                        >
                          <ExternalLink className="w-3 h-3" /> View
                        </button>
                        <button
                          onClick={() => handleMaterialAction(mat, false)}
                          disabled={busyMaterialId === mat._id}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold text-white bg-[#162F57] hover:bg-[#0f213d] transition cursor-pointer disabled:opacity-50 shadow-2xs"
                        >
                          <Download className="w-3 h-3" /> Download
                        </button>
                      </div>
                    </div>
                  ))
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
