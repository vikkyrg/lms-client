import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { courseThumbnail, isFreeCourse, PLACEHOLDER_THUMBNAIL } from '../utils/courseAccess';
import { 
  BookOpen, 
  Award, 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  PlayCircle,
  AlertCircle,
  XCircle,
  Calendar,
  Lock
} from 'lucide-react';

const StudentDashboardPage = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      const [enrRes, certRes] = await Promise.all([
        api.get('/enrollments/my'),
        api.get('/certificates/my')
      ]);
      setEnrollments(enrRes.data.enrollments || []);
      setCertificates(certRes.data.certificates || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const activeCourses = enrollments.filter((e) => e.status === 'approved' && e.hasActiveAccess && e.progress < 100);
  const completedCourses = enrollments.filter((e) => e.progress >= 100 || e.status === 'completed');
  const pendingApprovals = enrollments.filter((e) => e.status === 'pending_approval');

  // Free vs paid comes from the course record the API returns; a linked
  // payment record is the secondary signal.
  const enrollmentIsPaid = (enr) =>
    Boolean(enr.payment) || (!!enr.course && !isFreeCourse(enr.course));

  const renderStatusBadge = (enr) => {
    if (enr.status === 'pending_approval') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
          <Clock className="w-3.5 h-3.5" />
          {enrollmentIsPaid(enr)
            ? 'Payment verified — Awaiting Admin Approval'
            : 'Free enrollment — Awaiting Admin Approval'}
        </span>
      );
    }
    if (enr.status === 'rejected') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
          <XCircle className="w-3.5 h-3.5" /> Enrollment Rejected
        </span>
      );
    }
    if (enr.status === 'expired' || !enr.hasActiveAccess) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
          <Lock className="w-3.5 h-3.5" /> Course access has expired
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
        <CheckCircle className="w-3.5 h-3.5" /> Approved — Active Access
      </span>
    );
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-3xl p-8 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-xl shadow-indigo-100">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold">Welcome back, {user?.name}!</h1>
          <p className="text-indigo-100 text-sm max-w-lg">
            Track your 3-month course access, watch modules, and access course PDF notes and study materials.
          </p>
        </div>
        <Link
          to="/courses"
          className="bg-white text-indigo-700 font-bold px-5 py-2.5 rounded-xl text-sm shadow-md hover:bg-indigo-50 transition"
        >
          Explore Courses
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">My Enrollments</p>
            <p className="text-2xl font-extrabold text-gray-900">{enrollments.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Pending Approval</p>
            <p className="text-2xl font-extrabold text-gray-900">{pendingApprovals.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Active (3 Mos)</p>
            <p className="text-2xl font-extrabold text-gray-900">{activeCourses.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Certificates</p>
            <p className="text-2xl font-extrabold text-gray-900">{certificates.length}</p>
          </div>
        </div>
      </div>

      {/* Courses List Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Enrolled Courses &amp; Access Status</h2>

        {loading ? (
          <div className="bg-white p-8 rounded-2xl border text-center text-gray-400">
            Loading courses...
          </div>
        ) : enrollments.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-dashed text-center space-y-3">
            <p className="text-sm text-gray-600">You are not currently enrolled in any course.</p>
            <Link
              to="/courses"
              className="inline-block text-xs font-bold text-white bg-indigo-600 px-4 py-2 rounded-xl"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrollments.map((enr) => {
              const isPending = enr.status === 'pending_approval';
              const isRejected = enr.status === 'rejected';
              const isExpired = enr.status === 'expired' || !enr.hasActiveAccess;
              const isApproved = enr.status === 'approved' && enr.hasActiveAccess;

              return (
                <div
                  key={enr._id}
                  className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex gap-4">
                      <img
                        src={courseThumbnail(enr.course)}
                        alt={enr.course?.title}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = PLACEHOLDER_THUMBNAIL;
                        }}
                        className="w-24 h-16 rounded-xl object-cover shrink-0 bg-slate-100"
                      />
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm text-gray-900 line-clamp-1">
                          {enr.course?.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Enrolled on {new Date(enr.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div>{renderStatusBadge(enr)}</div>

                    {/* Pending approval message */}
                    {isPending && (
                      <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 leading-relaxed">
                        {enrollmentIsPaid(enr)
                          ? 'Your payment has been received and verified by our servers. Your course access is currently pending approval by the Admin. Once approved, you will receive full 3-month access to the classroom, lessons, and PDF materials.'
                          : 'You are enrolled in this free course — no payment was taken. Your enrollment is currently pending approval by the Admin. Once approved, you will receive full 3-month access to the classroom, lessons, and PDF materials.'}
                      </div>
                    )}

                    {/* Rejection notice */}
                    {isRejected && (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
                        <strong>Reason:</strong> {enr.rejectionReason || 'Please contact administration for further details regarding your enrollment.'}
                      </div>
                    )}

                    {/* Expiry notice */}
                    {isExpired && !isPending && !isRejected && (
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
                        Your 3-month course access period expired on{' '}
                        <strong>{enr.accessExpiryDate ? new Date(enr.accessExpiryDate).toLocaleDateString() : 'N/A'}</strong>. Course lessons and downloadable PDF notes are now locked. Your completed progress and certificates remain permanently verified.
                      </div>
                    )}

                    {/* Approved active details */}
                    {isApproved && (
                      <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl text-xs space-y-1">
                        <div className="flex justify-between text-indigo-950 font-medium">
                          <span>Access started:</span>
                          <span>{new Date(enr.accessStartDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between text-indigo-950 font-medium">
                          <span>Access expires:</span>
                          <span>{new Date(enr.accessExpiryDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between text-emerald-700 font-bold pt-1 border-t border-indigo-100">
                          <span>Days Remaining:</span>
                          <span>{enr.daysRemaining} days</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Progress bar (shown for approved or completed) */}
                  {(isApproved || enr.status === 'completed') && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-semibold text-gray-600">
                        <span>Course Progress</span>
                        <span>{enr.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${enr.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="pt-2 flex justify-end">
                    {isApproved ? (
                      <Link
                        to={`/student/courses/${enr.course?._id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl transition"
                      >
                        <PlayCircle className="h-4 w-4" />
                        Continue Learning
                      </Link>
                    ) : isPending ? (
                      <button
                        disabled
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 bg-slate-100 px-4 py-2 rounded-xl cursor-not-allowed"
                      >
                        <Clock className="h-4 w-4" />
                        Awaiting Approval
                      </button>
                    ) : (
                      <button
                        disabled
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 bg-slate-100 px-4 py-2 rounded-xl cursor-not-allowed"
                      >
                        <Lock className="h-4 w-4" />
                        Access Locked
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboardPage;
