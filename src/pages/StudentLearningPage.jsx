import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { courseThumbnail, PLACEHOLDER_THUMBNAIL } from '../utils/courseAccess';
import {
  BookOpen,
  PlayCircle,
  CheckCircle,
  Clock,
  Lock,
  ChevronDown,
  ChevronUp,
  Layers,
  FileVideo,
  CalendarClock,
  GraduationCap
} from 'lucide-react';

/**
 * Learning hub — the single place where students reach their enrolled courses,
 * module/lesson curriculum and learning progress. Replaces the old duplicated
 * "My Courses" sidebar entry; Overview keeps the account/access summary.
 *
 * Data is fully dynamic: enrollments from /enrollments/my, curriculum from the
 * existing /enrollments/classroom/:courseId endpoint (only fetched for courses
 * the student actually has active access to — the API enforces permissions).
 */
const StudentLearningPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [details, setDetails] = useState({}); // courseId -> { curriculum }
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchEnrollments = async () => {
      try {
        const res = await api.get('/enrollments/my');
        if (!isMounted) return;
        const list = res.data.enrollments || [];
        setEnrollments(list);
        setLoading(false);

        // Load curriculum only for courses with access (API guards the rest)
        for (const enr of list) {
          const courseId = enr.course?._id;
          if (!courseId) continue;
          const canOpen =
            (enr.status === 'approved' && enr.hasActiveAccess) || enr.status === 'completed';
          if (!canOpen) continue;
          api
            .get(`/enrollments/classroom/${courseId}`)
            .then((cRes) => {
              if (!isMounted) return;
              setDetails((prev) => ({
                ...prev,
                [courseId]: { curriculum: cRes.data.curriculum || [] }
              }));
            })
            .catch(() => {});
        }
      } catch (err) {
        console.error(err);
        if (isMounted) setLoading(false);
      }
    };

    fetchEnrollments();
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleExpanded = useCallback((id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const isLessonCompleted = (enr, lessonId) =>
    (enr.completedLessons || []).some((c) => String(c) === String(lessonId));

  const courseStats = (enr) => {
    const curriculum = details[enr.course?._id]?.curriculum;
    if (!curriculum) return null;
    const lessonCount = curriculum.reduce((sum, m) => sum + (m.lessons?.length || 0), 0);
    const completedCount = curriculum.reduce(
      (sum, m) => sum + (m.lessons || []).filter((l) => isLessonCompleted(enr, l._id)).length,
      0
    );
    return { modules: curriculum.length, lessonCount, completedCount };
  };

  const renderStatusBadge = (enr) => {
    if (enr.status === 'pending_approval' || enr.status === 'pending') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
          <Clock className="w-3 h-3" /> Awaiting approval
        </span>
      );
    }
    if (enr.status === 'rejected') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200">
          <Lock className="w-3 h-3" /> Rejected
        </span>
      );
    }
    if (enr.status === 'expired' || !enr.hasActiveAccess) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-300">
          <Lock className="w-3 h-3" /> Access expired
        </span>
      );
    }
    if (enr.progress >= 100 || enr.status === 'completed') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <CheckCircle className="w-3 h-3" /> Completed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#EAF2FC] text-[#2B6FE0] border border-[#D0E2F6]">
        <PlayCircle className="w-3 h-3" /> In progress
      </span>
    );
  };

  const renderCurriculum = (enr) => {
    const courseId = enr.course?._id;
    const curriculum = details[courseId]?.curriculum;
    if (!curriculum) {
      return (
        <p className="text-xs text-gray-400 py-2 pl-1">
          {enr.status === 'approved' && enr.hasActiveAccess
            ? 'Loading curriculum...'
            : 'Curriculum unlocks once your course access is active.'}
        </p>
      );
    }
    if (curriculum.length === 0) {
      return <p className="text-xs text-gray-400 py-2 pl-1">No modules published for this course yet.</p>;
    }
    return (
      <div className="space-y-2.5">
        {curriculum.map((mod, idx) => (
          <div key={mod._id} className="rounded-xl border border-gray-100 bg-[#FAFBFD] p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-bold text-[#173563] flex items-center gap-2 min-w-0">
                <Layers className="w-3.5 h-3.5 text-[#2B6FE0] shrink-0" />
                <span className="truncate">
                  {idx + 1}. {mod.title}
                </span>
              </p>
              <span className="text-[11px] font-semibold text-gray-500 shrink-0">
                {(mod.lessons || []).filter((l) => isLessonCompleted(enr, l._id)).length}/
                {(mod.lessons || []).length} lessons
              </span>
            </div>
            {(mod.lessons || []).length > 0 && (
              <ul className="mt-2 space-y-1">
                {mod.lessons.map((lesson) => {
                  const done = isLessonCompleted(enr, lesson._id);
                  return (
                    <li key={lesson._id} className="flex items-center gap-2 text-xs text-gray-600">
                      {done ? (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      ) : (
                        <FileVideo className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      )}
                      <span className={`truncate ${done ? 'text-gray-400 line-through decoration-gray-300' : ''}`}>
                        {lesson.title}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="h-6 w-40 bg-gray-200 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white rounded-2xl border border-gray-200 p-6 h-56 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#EAF2FC] text-[#2B6FE0] flex items-center justify-center border border-[#D0E2F6]">
            <GraduationCap className="h-5.5 w-5.5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-[#173563] tracking-tight">Learning</h1>
            <p className="text-xs text-gray-500">
              Your enrolled courses, modules, lessons and progress in one place.
            </p>
          </div>
        </div>
        <Link
          to="/courses"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#173563] bg-white border border-gray-200 hover:border-[#D0E2F6] hover:bg-[#FAFBFD] px-3.5 py-2 rounded-xl transition self-start sm:self-auto"
        >
          <BookOpen className="h-3.5 w-3.5" />
          Browse more courses
        </Link>
      </div>

      {enrollments.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border border-dashed border-gray-300 text-center space-y-3">
          <GraduationCap className="w-10 h-10 text-gray-300 mx-auto" />
          <p className="text-sm text-gray-600 font-medium">You are not enrolled in any course yet.</p>
          <Link
            to="/courses"
            className="inline-block text-xs font-bold text-white bg-[#173563] hover:bg-[#102747] px-4 py-2 rounded-xl transition"
          >
            Explore the Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enrollments.map((enr) => {
            const courseId = enr.course?._id;
            const isOpen = enr.status === 'approved' && enr.hasActiveAccess;
            const isCompleted = enr.progress >= 100 || enr.status === 'completed';
            const canInteract = isOpen || isCompleted;
            const stats = courseStats(enr);
            const expanded = expandedId === enr._id;

            return (
              <div
                key={enr._id}
                className="bg-white rounded-2xl border border-gray-200 shadow-xs hover:shadow-sm transition-shadow p-6 flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="flex gap-4 items-start">
                    <img
                      src={courseThumbnail(enr.course)}
                      alt={enr.course?.title}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = PLACEHOLDER_THUMBNAIL;
                      }}
                      className="w-24 h-16 rounded-xl object-cover shrink-0 bg-slate-100"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-sm text-[#173563] line-clamp-1">
                        {enr.course?.title}
                      </h3>
                      <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1 flex-wrap">
                        <span>Enrolled {new Date(enr.createdAt).toLocaleDateString()}</span>
                        {enr.daysRemaining > 0 && isOpen && (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                            <CalendarClock className="w-3 h-3" />
                            {enr.daysRemaining} days left
                          </span>
                        )}
                      </p>
                      <div className="mt-2">{renderStatusBadge(enr)}</div>
                    </div>
                  </div>

                  {/* Lesson-level progress */}
                  {canInteract && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-semibold text-gray-600">
                        <span>
                          {stats
                            ? `${stats.completedCount} of ${stats.lessonCount} lessons · ${stats.modules} modules`
                            : 'Course Progress'}
                        </span>
                        <span>{enr.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-[#2B6FE0] h-2 rounded-full transition-all duration-500"
                          style={{ width: `${enr.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  {canInteract ? (
                    <button
                      type="button"
                      onClick={() => toggleExpanded(enr._id)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#173563] hover:text-[#2B6FE0] transition cursor-pointer"
                      aria-expanded={expanded}
                    >
                      {expanded ? 'Hide modules' : 'Modules & lessons'}
                      {expanded ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )}
                    </button>
                  ) : (
                    <span className="text-[11px] text-gray-400 font-medium">
                      {enr.status === 'rejected'
                        ? enr.rejectionReason || 'Enrollment rejected'
                        : 'Unlock to see modules & lessons'}
                    </span>
                  )}

                  {canInteract && (
                    <Link
                      to={`/student/courses/${courseId}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#173563] hover:bg-[#2B6FE0] px-4 py-2 rounded-xl transition"
                    >
                      <PlayCircle className="h-4 w-4" />
                      {isCompleted ? 'Revisit Course' : isOpen && enr.progress > 0 ? 'Continue' : 'Start Learning'}
                    </Link>
                  )}
                </div>

                {expanded && canInteract && (
                  <div className="border-t border-gray-100 pt-4">{renderCurriculum(enr)}</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentLearningPage;
