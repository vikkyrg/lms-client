import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Award, CheckCircle, ShieldCheck, ArrowLeft, Calendar, User } from 'lucide-react';

const VerifyCertificatePage = () => {
  const { certificateNumber } = useParams();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCert = async () => {
      try {
        const res = await api.get(`/certificates/verify/${certificateNumber}`);
        setCert(res.data.certificate);
      } catch (err) {
        setError('This certificate is invalid or could not be verified in our records.');
      } finally {
        setLoading(false);
      }
    };
    fetchCert();
  }, [certificateNumber]);

  return (
    <div className="min-h-[85vh] bg-gray-50 flex flex-col items-center justify-center p-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-3xl border border-gray-200 shadow-2xl p-8 sm:p-12 space-y-8 relative overflow-hidden">
        {/* Top badge */}
        <div className="flex items-center justify-between border-b pb-6">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
            <Award className="h-7 w-7" />
            AutoOps School Verified Credential
          </div>
          <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold">
            <ShieldCheck className="h-4 w-4" /> Authenticated
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Verifying credential against database...</div>
        ) : error ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              !
            </div>
            <h3 className="text-lg font-bold text-gray-900">{error}</h3>
            <Link to="/" className="text-indigo-600 text-sm font-semibold hover:underline">
              Return Home
            </Link>
          </div>
        ) : (
          <div className="space-y-6 text-center">
            <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">
              Certificate of Completion
            </p>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              {cert.studentId?.name}
            </h1>

            <p className="text-sm text-gray-600 max-w-lg mx-auto">
              has successfully fulfilled all curriculum requirements, quizzes, and project evaluations for
            </p>

            <div className="p-6 bg-indigo-50/60 rounded-2xl border border-indigo-100">
              <h2 className="text-xl sm:text-2xl font-bold text-indigo-900">
                {cert.courseId?.title}
              </h2>
              <p className="text-xs text-indigo-700 mt-2 font-medium">
                Issued by AutoOps School.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs text-left bg-gray-50 p-4 rounded-xl">
              <div>
                <span className="text-gray-400 block font-medium">Certificate Identifier:</span>
                <code className="font-bold text-gray-800">{cert.certificateNumber}</code>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Issue Date:</span>
                <span className="font-bold text-gray-800">
                  {new Date(cert.issueDate).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t text-center">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-indigo-600 font-semibold">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Platform
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyCertificatePage;
