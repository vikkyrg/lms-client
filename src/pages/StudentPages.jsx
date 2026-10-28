import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Panel = ({ title, children }) => (
  <section className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6">
    <h1 className="text-xl font-extrabold text-gray-900 mb-5">{title}</h1>
    {children}
  </section>
);

const Empty = ({ children }) => <p className="py-10 text-center text-sm text-gray-500">{children}</p>;

export const AssessmentsPage = () => {
  const [attempts, setAttempts] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    api.get('/quizzes/attempts/my').then(res => setAttempts(res.data.attempts || []))
      .catch(err => setError(err.response?.data?.message || 'Unable to load assessment history'));
  }, []);
  return <Panel title="My Assessments">
    {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {attempts.length === 0 ? <Empty>No quiz attempts yet. Start a quiz from one of your classrooms.</Empty> : (
      <div className="overflow-x-auto"><table className="w-full min-w-[560px] text-left text-sm">
        <thead className="border-b text-xs uppercase text-gray-500"><tr><th className="p-3">Quiz</th><th className="p-3">Course</th><th className="p-3">Score</th><th className="p-3">Result</th><th className="p-3">Date</th></tr></thead>
        <tbody className="divide-y">{attempts.map(item => <tr key={item._id}>
          <td className="p-3 font-semibold">{item.quizId?.title || 'Quiz'}</td>
          <td className="p-3 text-gray-600">{item.courseId?.title || 'Course'}</td>
          <td className="p-3">{item.score}/{item.totalScore} ({item.percentage}%)</td>
          <td className={`p-3 font-semibold ${item.passed ? 'text-emerald-600' : 'text-red-600'}`}>{item.passed ? 'Passed' : 'Not passed'}</td>
          <td className="p-3 text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</td>
        </tr>)}</tbody>
      </table></div>
    )}
  </Panel>;
};

export const AssignmentsPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    api.get('/assignments/submissions/my').then(res => setSubmissions(res.data.submissions || []))
      .catch(err => setError(err.response?.data?.message || 'Unable to load assignments'));
  }, []);
  return <Panel title="My Assignments">
    {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {submissions.length === 0 ? <Empty>No submissions yet. Assignment work appears here after you submit it from a classroom.</Empty> : (
      <div className="space-y-3">{submissions.map(item => <article key={item._id} className="rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h2 className="font-bold">{item.assignmentId?.title || 'Assignment'}</h2><p className="text-sm text-gray-500">{item.courseId?.title || 'Course'} · Submitted {new Date(item.createdAt).toLocaleDateString()}</p></div>
        <div className="text-sm sm:text-right"><p className="font-semibold capitalize">{item.status.replace('_', ' ')}</p>{item.marksObtained !== undefined && <p className="text-gray-500">{item.marksObtained}/{item.assignmentId?.totalMarks || 0} marks</p>}{item.feedback && <p className="text-gray-600">{item.feedback}</p>}</div>
      </article>)}</div>
    )}
  </Panel>;
};

export const CertificatesPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    api.get('/certificates/my').then(res => setCertificates(res.data.certificates || []))
      .catch(err => setError(err.response?.data?.message || 'Unable to load certificates'));
  }, []);
  const download = async cert => {
    const response = await api.get(`/certificates/${cert._id}/download`, { responseType: 'blob' });
    const url = URL.createObjectURL(response.data);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${cert.certificateNumber}.pdf`;
    anchor.click();
    URL.revokeObjectURL(url);
  };
  return <Panel title="My Certificates">
    {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {certificates.length === 0 ? <Empty>Complete an enrolled course to earn a verified certificate.</Empty> : <div className="grid gap-4 md:grid-cols-2">
      {certificates.map(cert => <article key={cert._id} className="rounded-xl border p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-indigo-600">Verified credential</p>
        <h2 className="mt-2 font-bold text-gray-900">{cert.courseId?.title}</h2>
        <p className="mt-1 text-sm text-gray-500">{cert.certificateNumber}</p>
        <p className="mt-1 text-xs text-gray-500">Issued {new Date(cert.issueDate).toLocaleDateString()}</p>
        <div className="mt-4 flex flex-wrap gap-2"><button onClick={() => download(cert)} className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white">Download PDF</button><Link className="rounded-lg border px-3 py-2 text-xs font-bold text-indigo-700" to={`/verify-certificate/${cert.certificateNumber}`}>Verify publicly</Link></div>
      </article>)}
    </div>}
  </Panel>;
};

export const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  useEffect(() => { api.get('/payments/my').then(res => setPayments(res.data.payments || [])); }, []);
  return <Panel title="Payment History">
    {payments.length === 0 ? <Empty>No payment records found.</Empty> : <div className="overflow-x-auto"><table className="w-full min-w-[600px] text-left text-sm">
      <thead className="border-b text-xs uppercase text-gray-500"><tr><th className="p-3">Course</th><th className="p-3">Amount</th><th className="p-3">Status</th><th className="p-3">Reference</th><th className="p-3">Date</th></tr></thead>
      <tbody className="divide-y">{payments.map(payment => <tr key={payment._id}><td className="p-3 font-semibold">{payment.course?.title || 'Course'}</td><td className="p-3">{payment.currency} {payment.amount}</td><td className="p-3 capitalize">{payment.status}</td><td className="p-3 text-xs text-gray-500">{payment.paymentId || payment.orderId}</td><td className="p-3 text-gray-500">{new Date(payment.createdAt).toLocaleDateString()}</td></tr>)}</tbody>
    </table></div>}
  </Panel>;
};

export const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    headline: user?.headline || '',
    bio: user?.bio || ''
  });
  const [password, setPassword] = useState({ currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        phone: user.phone || '',
        headline: user.headline || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const saveProfile = async event => {
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      const res = await api.put('/auth/profile', form);
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setMessage('Profile updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update profile');
    }
  };

  const changePassword = async event => {
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      await api.put('/auth/password', password);
      setPassword({ currentPassword: '', newPassword: '' });
      setMessage('Password changed successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to change password');
    }
  };

  return (
    <div className="space-y-6">
      <Panel title="Profile">
        <form onSubmit={saveProfile} className="space-y-4 max-w-xl">
          {message && <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          
          <label className="block text-sm font-semibold">
            Name
            <input
              required
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full rounded-lg border p-2.5 font-normal"
            />
          </label>

          <label className="block text-sm font-semibold">
            Email
            <input
              disabled
              value={user?.email || ''}
              className="mt-1 w-full rounded-lg border bg-gray-50 p-2.5 font-normal text-gray-500"
            />
          </label>

          <label className="block text-sm font-semibold">
            Phone Number <span className="text-rose-500">*</span> (Required for Enrollment Verification)
            <input
              required
              type="tel"
              placeholder="+91 9876543210"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              className="mt-1 w-full rounded-lg border p-2.5 font-normal"
            />
          </label>

          <label className="block text-sm font-semibold">
            Headline
            <input
              value={form.headline}
              onChange={e => setForm({ ...form, headline: e.target.value })}
              className="mt-1 w-full rounded-lg border p-2.5 font-normal"
            />
          </label>

          <label className="block text-sm font-semibold">
            Bio
            <textarea
              rows="4"
              value={form.bio}
              onChange={e => setForm({ ...form, bio: e.target.value })}
              className="mt-1 w-full rounded-lg border p-2.5 font-normal"
            />
          </label>

          <button className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition">
            Save profile
          </button>
        </form>
      </Panel>

      <Panel title="Change password">
        <form onSubmit={changePassword} className="space-y-4 max-w-xl">
          <label className="block text-sm font-semibold">
            Current password
            <input
              required
              type="password"
              value={password.currentPassword}
              onChange={e => setPassword({ ...password, currentPassword: e.target.value })}
              className="mt-1 w-full rounded-lg border p-2.5 font-normal"
            />
          </label>
          <label className="block text-sm font-semibold">
            New password
            <input
              required
              minLength="8"
              type="password"
              value={password.newPassword}
              onChange={e => setPassword({ ...password, newPassword: e.target.value })}
              className="mt-1 w-full rounded-lg border p-2.5 font-normal"
            />
          </label>
          <button className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-gray-800 transition">
            Change password
          </button>
        </form>
      </Panel>
    </div>
  );
};
