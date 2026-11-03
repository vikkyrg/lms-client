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

export const CertificatesPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    api.get('/certificates/my')
      .then(res => setCertificates(res.data.certificates || []))
      .catch(err => setError(err.response?.data?.message || 'Unable to load certificates'))
      .finally(() => setLoading(false));
  }, []);

  const download = async cert => {
    try {
      setDownloadingId(cert._id);
      const response = await api.get(`/certificates/${cert._id}/download`, { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${cert.certificateNumber}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download certificate:', err);
    } finally {
      setDownloadingId(null);
    }
  };

  return <Panel title="My Certificates">
    {error && <p className="mb-4 rounded-xl bg-red-50 p-3.5 text-xs font-semibold text-red-700 border border-red-200">{error}</p>}
    {loading ? (
      <div className="py-12 text-center text-xs text-gray-400">Loading your verified certificates...</div>
    ) : certificates.length === 0 ? (
      <Empty>Complete an enrolled course to earn a verified certificate.</Empty>
    ) : (
      <div className="grid gap-5 md:grid-cols-2">
        {certificates.map(cert => (
          <article key={cert._id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Verified Credential
                </span>
                <span className="text-[11px] font-mono text-gray-400">AutoOps School</span>
              </div>
              <h2 className="text-base font-extrabold text-[#102747] leading-snug pt-1">
                {cert.courseId?.title}
              </h2>
              <div className="text-xs text-gray-500 space-y-0.5 pt-1">
                <p>Serial: <code className="font-mono font-bold text-gray-700">{cert.certificateNumber}</code></p>
                <p>Issued: {new Date(cert.issueDate).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => download(cert)}
                disabled={downloadingId === cert._id}
                className="rounded-xl bg-[#173563] hover:bg-[#102747] px-3.5 py-2 text-xs font-bold text-white shadow-2xs transition cursor-pointer disabled:opacity-50"
              >
                {downloadingId === cert._id ? 'Generating...' : 'Download PDF'}
              </button>
              <Link
                className="rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 px-3.5 py-2 text-xs font-bold text-[#102747] transition"
                to={`/verify-certificate/${cert.certificateNumber}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Verify Publicly
              </Link>
            </div>
          </article>
        ))}
      </div>
    )}
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
