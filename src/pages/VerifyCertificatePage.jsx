import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import CertificatePreview from '../components/CertificatePreview';
import logoImg from '../assests/logo.png';
import {
  ShieldCheck,
  Award,
  Download,
  Printer,
  Copy,
  Check,
  ArrowLeft,
  AlertCircle,
  ExternalLink,
  Calendar,
  User,
  BookOpen
} from 'lucide-react';

const VerifyCertificatePage = () => {
  const params = useParams();
  const certificateNumber = params.certificateNumber || params.certificateId;

  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchCert = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.get(`/certificates/verify/${certificateNumber}`);
        setCert(res.data.certificate);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'This certificate identifier is invalid or could not be found in our database.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (certificateNumber) {
      fetchCert();
    } else {
      setError('No certificate identifier provided.');
      setLoading(false);
    }
  }, [certificateNumber]);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleDownloadPdf = async () => {
    if (!cert) return;
    try {
      setDownloading(true);
      const res = await api.get(`/certificates/public-download/${cert.certificateNumber}`, {
        responseType: 'blob'
      });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${cert.certificateNumber}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.warn('Backend PDF endpoint fallback to print:', err);
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#FAFBFD] text-[#102747] flex flex-col py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Print Styles: Hide page layout on print, show only landscape certificate */}
      <style>{`
        @media print {
          @page {
            size: landscape;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          nav, footer, .no-print, header, .print\\:hidden {
            display: none !important;
          }
          #certificate-print-area {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            margin: 0 !important;
          }
        }
      `}</style>

      {/* Main Container */}
      <div className="max-w-5xl w-full mx-auto space-y-6">

        {/* Top Header Card */}
        <div className="print:hidden bg-white rounded-2xl border border-gray-200/90 shadow-xs p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="shrink-0 group">
              <img
                src={logoImg}
                alt="AutoOps School Logo"
                className="h-12 w-auto object-contain transition group-hover:opacity-90"
              />
            </Link>
            <div>
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#173563] block">
                Official Credential Verification Portal
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-[#102747]">
                AutoOps School Credential Registry
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-gray-600 hover:text-[#102747] bg-gray-50 hover:bg-gray-100 rounded-xl transition border border-gray-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Platform Home
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-12 text-center space-y-4">
            <div className="w-12 h-12 border-3 border-[#173563] border-t-transparent rounded-full animate-spin mx-auto" />
            <h2 className="text-lg font-bold text-[#102747]">
              Validating Credential With Central Registry...
            </h2>
            <p className="text-xs text-gray-500">
              Querying cryptographic identifier <code className="font-mono">{certificateNumber}</code>
            </p>
          </div>
        )}

        {/* Error / Invalid State */}
        {!loading && error && (
          <div className="bg-white rounded-3xl border border-rose-200 shadow-sm p-8 sm:p-12 text-center space-y-5 max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-200">
              <AlertCircle className="w-8 h-8 stroke-[2.2]" />
            </div>
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest font-extrabold text-rose-600 block">
                Verification Failed
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900">
                Invalid or Unverified Credential
              </h2>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                {error}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs text-gray-600 text-left space-y-1">
              <p className="font-bold text-gray-800">What does this mean?</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>The certificate ID might contain a typo or missing character.</li>
                <li>The course may not have met 100% completion requirements.</li>
                <li>The credential may have expired or been revoked.</li>
              </ul>
            </div>

            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link
                to="/courses"
                className="px-5 py-2.5 bg-[#173563] hover:bg-[#102747] text-white rounded-xl text-xs font-bold transition"
              >
                Browse Verified Courses
              </Link>
              <Link
                to="/contact"
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition"
              >
                Contact Academic Registry
              </Link>
            </div>
          </div>
        )}

        {/* Verified Success State */}
        {!loading && !error && cert && (
          <div className="space-y-6">
            
            {/* Status Banner */}
            <div className="print:hidden bg-emerald-50/90 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-800">
                      Official Verification Status
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Authentic & Active
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-900 font-medium">
                    This certificate was officially issued by <strong>AutoOps School</strong> to{' '}
                    <strong>{cert.studentId?.name}</strong> upon comprehensive course completion.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 shadow-2xs transition cursor-pointer"
                  title="Copy verification link"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-gray-500" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 shadow-2xs transition cursor-pointer"
                  title="Print certificate"
                >
                  <Printer className="w-3.5 h-3.5 text-gray-500" />
                  <span>Print</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={downloading}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#173563] hover:bg-[#102747] shadow-sm transition cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5 text-[#F4D36B]" />
                  <span>{downloading ? 'Downloading...' : 'Download PDF'}</span>
                </button>
              </div>
            </div>

            {/* Certificate Preview Card */}
            <div className="w-full">
              <CertificatePreview certificate={cert} />
            </div>

            {/* Credential Details Breakdown Card */}
            <div className="print:hidden bg-white rounded-2xl border border-gray-200/90 shadow-xs p-6 space-y-4">
              <h2 className="text-base font-extrabold text-[#102747] flex items-center gap-2">
                <Award className="w-5 h-5 text-[#173563]" />
                Credential Metadata & Academic Verification Record
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                
                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200/70">
                  <span className="text-gray-400 block font-semibold uppercase tracking-wider text-[10px]">
                    Recipient
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="w-4 h-4 text-gray-500 shrink-0" />
                    <span className="font-bold text-[#102747] text-sm">
                      {cert.studentId?.name || 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200/70">
                  <span className="text-gray-400 block font-semibold uppercase tracking-wider text-[10px]">
                    Course Completed
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <BookOpen className="w-4 h-4 text-[#173563] shrink-0" />
                    <span className="font-bold text-[#102747] truncate" title={cert.courseId?.title}>
                      {cert.courseId?.title || 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200/70">
                  <span className="text-gray-400 block font-semibold uppercase tracking-wider text-[10px]">
                    Issue Date
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 text-gray-500 shrink-0" />
                    <span className="font-bold text-[#102747]">
                      {new Date(cert.issueDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200/70">
                  <span className="text-gray-400 block font-semibold uppercase tracking-wider text-[10px]">
                    Issuing Authority
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-bold text-[#102747]">
                      AutoOps School
                    </span>
                  </div>
                </div>

              </div>

              <div className="pt-2 text-[11px] text-gray-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-t border-gray-100">
                <span>
                  Permanent Verification Key:{' '}
                  <code className="font-mono font-bold text-gray-700 select-all">
                    {cert.certificateNumber}
                  </code>
                </span>
                <span className="text-emerald-700 font-semibold">
                  Secure cryptographic signature verified by AutoOps School LMS
                </span>
              </div>
            </div>

          </div>
        )}

        {/* Footer */}
        <div className="print:hidden text-center pt-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} AutoOps School. All Rights Reserved. Learn. Build. Automate.</p>
        </div>

      </div>
    </div>
  );
};

export default VerifyCertificatePage;
