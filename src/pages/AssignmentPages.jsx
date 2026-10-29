import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

/* ------------------------------------------------------------------ */
/* Shared helpers                                                      */
/* ------------------------------------------------------------------ */

const Loading = ({ text = 'Loading...' }) => (
  <div className="flex items-center justify-center py-16">
    <div className="animate-spin h-8 w-8 border-4 border-[#173563] border-t-transparent rounded-full" />
    <span className="ml-3 text-sm text-slate-500">{text}</span>
  </div>
);

const NoticeBanner = ({ notice, onDismiss }) => {
  if (!notice) return null;
  return (
    <div role="alert" className={`rounded-xl px-4 py-3 text-sm font-semibold ${notice.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
      <div className="flex items-center justify-between gap-3">
        <span>{notice.text}</span>
        {onDismiss && <button onClick={onDismiss} aria-label="Dismiss" className="font-bold">×</button>}
      </div>
    </div>
  );
};

const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const formatDateTime = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
};

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(1))} ${units[i]}`;
};

// Maps the backend displayStatus + raw status to a student-facing label.
const STATUS_META = {
  'not-submitted': { label: 'Not Started', tone: 'bg-slate-100 text-slate-600 border-slate-200' },
  draft: { label: 'Draft', tone: 'bg-amber-50 text-amber-700 border-amber-200' },
  submitted: { label: 'Submitted', tone: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  late: { label: 'Late', tone: 'bg-orange-50 text-orange-700 border-orange-200' },
  'under-review': { label: 'Under Review', tone: 'bg-sky-50 text-sky-700 border-sky-200' },
  graded: { label: 'Graded', tone: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  returned: { label: 'Returned for Revision', tone: 'bg-rose-50 text-rose-700 border-rose-200' },
  missed: { label: 'Missed Deadline', tone: 'bg-rose-50 text-rose-700 border-rose-200' }
};

const StatusBadge = ({ summary }) => {
  const meta = STATUS_META[summary?.displayStatus] || STATUS_META['not-submitted'];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${meta.tone}`}>
      {meta.label}
    </span>
  );
};

const SUBMISSION_TYPE_LABELS = {
  text: 'Text response',
  file: 'File upload',
  github: 'GitHub repository URL',
  'live-url': 'Live project URL'
};

// Authenticated blob download (the file routes require the JWT header).
const toBlobError = async (blob) => {
  try {
    const parsed = JSON.parse(await blob.text());
    return parsed?.message || 'Unable to download this file.';
  } catch (e) {
    return 'Unable to download this file.';
  }
};

const downloadBlob = async (url, params, fileName) => {
  let res;
  try {
    res = await api.get(url, { params: params || {}, responseType: 'blob' });
  } catch (err) {
    const payload = err?.response?.data;
    if (payload instanceof Blob) throw new Error(await toBlobError(payload));
    throw err;
  }
  const type = res.headers?.['content-type'] || 'application/octet-stream';
  if (type.includes('application/json')) throw new Error(await toBlobError(res.data));
  const objectUrl = window.URL.createObjectURL(new Blob([res.data], { type }));
  const link = window.document.createElement('a');
  link.href = objectUrl;
  link.download = fileName || 'file';
  window.document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => window.URL.revokeObjectURL(objectUrl), 60000);
};

/* ------------------------------------------------------------------ */
/* Assignment list                                                     */
/* ------------------------------------------------------------------ */

export const StudentAssignmentListPage = () => {
  const { courseId } = useParams();
  const [assignments, setAssignments] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/assignments/course/${courseId}/my`)
      .then((res) => setAssignments(res.data.assignments || []))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load assignments'));
  }, [courseId]);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-[#102747] text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-5 flex items-center gap-3">
          <Link to={`/student/courses/${courseId}`} className="text-xs font-bold bg-white/10 hover:bg-white/20 rounded-lg px-3 py-1.5 transition">← Course</Link>
          <h1 className="text-lg sm:text-xl font-extrabold">Assignments &amp; Projects</h1>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-6 space-y-4">
        {error && <NoticeBanner notice={{ type: 'error', text: error }} />}
        {!assignments && !error && <Loading text="Loading assignments..." />}
        {assignments && assignments.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
            No assignments or projects have been published for this course yet.
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          {assignments?.map((a) => {
            const summary = a.mySubmission || {};
            const pastDue = a.dueDate && new Date(a.dueDate) < new Date();
            return (
              <article key={a._id} className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col gap-3 shadow-xs">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="font-bold text-[#173563] text-sm truncate">{a.title}</h2>
                      {a.isProject && <span className="shrink-0 text-[10px] font-bold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">Project</span>}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {a.moduleTitle || 'Whole course'}{a.lessonTitle ? ` · ${a.lessonTitle}` : ''}
                    </p>
                  </div>
                  <StatusBadge summary={summary} />
                </div>
                {a.description && <p className="text-xs text-slate-600 line-clamp-2">{a.description}</p>}
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500">
                  <span>Due: <span className={`font-bold ${pastDue ? 'text-rose-600' : 'text-slate-700'}`}>{formatDate(a.dueDate)}</span></span>
                  <span>Total: <span className="font-bold text-slate-700">{a.totalMarks} marks</span></span>
                  <span>Pass: <span className="font-bold text-slate-700">{a.passingMarks ?? 0}</span></span>
                </div>
                {summary.displayStatus === 'graded' && summary.marksObtained != null && (
                  <p className={`text-xs font-bold ${summary.passed ? 'text-emerald-700' : 'text-rose-700'}`}>
                    Scored {summary.marksObtained} / {a.totalMarks} · {summary.passed ? 'Passed' : 'Below pass mark'}
                  </p>
                )}
                <Link
                  to={`/student/courses/${courseId}/assignments/${a._id}`}
                  className="mt-auto rounded-xl bg-[#173563] px-4 py-2 text-xs font-bold text-white text-center hover:bg-[#102747] transition"
                >
                  {summary.hasSubmission ? 'View & manage submission' : 'Open assignment'}
                </Link>
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Assignment detail + submission                                      */
/* ------------------------------------------------------------------ */

export const StudentAssignmentDetailPage = () => {
  const { courseId, assignmentId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [summary, setSummary] = useState(null);

  // Submission form state
  const [subType, setSubType] = useState('text');
  const [textValue, setTextValue] = useState('');
  const [githubValue, setGithubValue] = useState('');
  const [liveValue, setLiveValue] = useState('');
  const [fileObj, setFileObj] = useState(null);
  const [hasExistingFile, setHasExistingFile] = useState(false);
  const [busy, setBusy] = useState(''); // 'draft' | 'submit' | 'download' | ''
  const [notice, setNotice] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const allowedTypes = assignment?.submissionTypes?.length ? assignment.submissionTypes : ['text'];

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [detailRes, subRes] = await Promise.all([
        api.get(`/assignments/${assignmentId}`),
        api.get(`/assignments/${assignmentId}/my-submission`).catch(() => ({ data: { submission: null, summary: null } }))
      ]);
      setAssignment(detailRes.data.assignment);
      setSummary(detailRes.data.mySubmission || subRes.data.summary || null);
      const sub = subRes.data.submission;
      if (sub) {
        setSubmission(sub);
        // Prefill the editor with the existing (draft/returned) content
        if (sub.status === 'draft' || sub.status === 'returned_for_revision' || sub.status === 'resubmission_required') {
          setSubType(sub.submissionType || 'text');
          setTextValue(sub.submissionText || '');
          setGithubValue(sub.githubUrl || '');
          setLiveValue(sub.liveUrl || '');
          setHasExistingFile(Boolean(sub.fileUrl));
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load the assignment');
    } finally {
      setLoading(false);
    }
  }, [assignmentId]);

  useEffect(() => { loadAll(); }, [loadAll]);

  // Keep the selected submission type valid for the assignment
  useEffect(() => {
    if (allowedTypes.length && !allowedTypes.includes(subType)) setSubType(allowedTypes[0]);
  }, [assignment]); // eslint-disable-line react-hooks/exhaustive-deps

  const buildFormData = () => {
    const fd = new FormData();
    fd.append('submissionType', subType);
    fd.append('submissionText', textValue);
    fd.append('githubUrl', githubValue);
    fd.append('liveUrl', liveValue);
    fd.append('hasExistingFile', String(hasExistingFile));
    if (fileObj) fd.append('file', fileObj);
    return fd;
  };

  const validate = () => {
    if (subType === 'text' && !textValue.trim()) return 'Enter your text response before submitting.';
    if (subType === 'github' && !/^https?:\/\/(www\.)?github\.com\/[^\s]+$/i.test(githubValue.trim())) return 'Enter a valid GitHub repository URL (https://github.com/...).';
    if (subType === 'live-url' && !/^https?:\/\/[^\s]+\.[^\s]+$/i.test(liveValue.trim())) return 'Enter a valid live project URL (https://...).';
    if (subType === 'file' && !fileObj && !hasExistingFile) return 'Attach the required file for this submission.';
    return '';
  };

  const saveDraft = async () => {
    const invalid = validate();
    // Drafts tolerate empty content but not a half-filled active field type
    if (invalid && (textValue || githubValue || liveValue || fileObj || hasExistingFile)) {
      setNotice({ type: 'error', text: invalid });
      return;
    }
    setBusy('draft');
    try {
      const res = await api.post(`/assignments/${assignmentId}/draft`, buildFormData());
      setSubmission(res.data.submission);
      setSummary(res.data.summary);
      if (res.data.submission?.fileUrl) setHasExistingFile(true);
      setNotice({ type: 'success', text: 'Draft saved. It is not submitted for grading yet.' });
    } catch (err) {
      setNotice({ type: 'error', text: err.response?.data?.message || 'Could not save the draft' });
    } finally {
      setBusy('');
    }
  };

  const finalizeSubmit = async () => {
    const invalid = validate();
    if (invalid) { setNotice({ type: 'error', text: invalid }); setConfirmOpen(false); return; }
    setBusy('submit');
    try {
      const res = await api.post(`/assignments/${assignmentId}/submit`, buildFormData());
      setSubmission(res.data.submission);
      setSummary(res.data.summary);
      setFileObj(null);
      setHasExistingFile(Boolean(res.data.submission?.fileUrl));
      setNotice({ type: 'success', text: 'Assignment submitted for grading successfully.' });
    } catch (err) {
      setNotice({ type: 'error', text: err.response?.data?.message || 'Submission failed' });
    } finally {
      setBusy('');
      setConfirmOpen(false);
    }
  };

  const downloadReference = async () => {
    setBusy('download');
    try {
      await downloadBlob(`/assignments/${assignmentId}/reference-file`, {}, assignment.referenceFile?.fileName || 'reference-file');
    } catch (err) {
      setNotice({ type: 'error', text: err.message || 'Download failed' });
    } finally {
      setBusy('');
    }
  };

  const downloadStarter = async (index, fileName) => {
    setBusy('download');
    try {
      await downloadBlob(`/assignments/${assignmentId}/starter-file/${index}`, {}, fileName || `starter-${index + 1}`);
    } catch (err) {
      setNotice({ type: 'error', text: err.message || 'Download failed' });
    } finally {
      setBusy('');
    }
  };

  const downloadMyFile = async (sub) => {
    setBusy('download');
    try {
      await downloadBlob(`/assignments/submissions/${sub._id}/download`, {}, sub.fileName || 'submission-file');
    } catch (err) {
      setNotice({ type: 'error', text: err.message || 'Download failed' });
    } finally {
      setBusy('');
    }
  };

  const openFilePicker = () => {
    const input = window.document.createElement('input');
    input.type = 'file';
    const accept = (assignment?.allowedFileTypes || []).join(',');
    if (accept) input.accept = accept;
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const maxMb = Number(assignment?.maxFileSizeMb || 25);
      if (file.size > maxMb * 1024 * 1024) {
        setNotice({ type: 'error', text: `File exceeds the ${maxMb} MB limit for this assignment.` });
        return;
      }
      setFileObj(file);
      setHasExistingFile(false);
    };
    input.click();
  };

  if (loading) return <div className="min-h-screen bg-slate-50"><Loading text="Loading assignment..." /></div>;

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <NoticeBanner notice={{ type: 'error', text: error }} />
          <Link to={`/student/courses/${courseId}/assignments`} className="mt-4 block text-center text-sm font-bold text-[#173563] underline">Back to assignments</Link>
        </div>
      </div>
    );
  }

  const canEdit = !summary || summary.canResubmit;
  const isGraded = summary?.displayStatus === 'graded';
  const gradingHistory = submission?.gradingHistory || [];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-[#102747] text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-5 flex items-center gap-3">
          <Link to={`/student/courses/${courseId}/assignments`} className="text-xs font-bold bg-white/10 hover:bg-white/20 rounded-lg px-3 py-1.5">← Assignments</Link>
          <h1 className="text-lg font-extrabold truncate">{assignment.title}</h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-6 space-y-5">
        {notice && <NoticeBanner notice={notice} onDismiss={() => setNotice(null)} />}

        {/* Overview */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {assignment.isProject && <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Real-world project</span>}
              <span className="text-[11px] text-slate-500">{assignment.moduleTitle || 'Whole course'}{assignment.lessonTitle ? ` · ${assignment.lessonTitle}` : ''}</span>
            </div>
            <StatusBadge summary={summary} />
          </div>

          {assignment.description && <p className="text-sm text-slate-700 leading-relaxed">{assignment.description}</p>}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="rounded-xl border border-slate-200 p-2.5">
              <p className="text-[10px] uppercase text-slate-400 font-bold">Due date</p>
              <p className="text-xs font-bold text-[#173563]">{formatDate(assignment.dueDate)}</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-2.5">
              <p className="text-[10px] uppercase text-slate-400 font-bold">Total marks</p>
              <p className="text-xs font-bold text-[#173563]">{assignment.totalMarks}</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-2.5">
              <p className="text-[10px] uppercase text-slate-400 font-bold">Passing</p>
              <p className="text-xs font-bold text-[#173563]">{assignment.passingMarks ?? 0}</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-2.5">
              <p className="text-[10px] uppercase text-slate-400 font-bold">Submission type(s)</p>
              <p className="text-[11px] font-bold text-[#173563] leading-tight">{allowedTypes.map((t) => SUBMISSION_TYPE_LABELS[t]).join(', ')}</p>
            </div>
          </div>

          {Array.isArray(assignment.learningObjectives) && assignment.learningObjectives.length > 0 && (
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wide text-[#173563] mb-1.5">Learning objectives</h3>
              <ul className="space-y-1 text-sm text-slate-700 list-disc pl-5">
                {assignment.learningObjectives.map((obj, i) => <li key={i}>{obj}</li>)}
              </ul>
            </div>
          )}

          {assignment.instructions && (
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wide text-[#173563] mb-1.5">Instructions</h3>
              <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">{assignment.instructions}</p>
            </div>
          )}

          {assignment.rubric && (
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wide text-slate-500 mb-1">Grading rubric</h3>
              <p className="text-xs text-slate-600 whitespace-pre-line">{assignment.rubric}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="font-bold text-slate-500">Allowed files:</span>
            <span className="text-slate-600">{(assignment.allowedFileTypes || []).join(', ') || 'any'}</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-600">Max {assignment.maxFileSizeMb || 25} MB</span>
          </div>

          {/* Reference & starter files */}
          {(assignment.referenceFile?.fileUrl || (assignment.starterFiles || []).length > 0) && (
            <div className="space-y-2 border-t border-slate-100 pt-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wide text-[#173563]">Resources</h3>
              {assignment.referenceFile?.fileUrl && (
                <button onClick={downloadReference} disabled={busy === 'download'} className="flex items-center gap-2 text-xs font-semibold text-[#173563] hover:underline disabled:opacity-50">
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 3a1 1 0 0 1 1 1v6.6l2.3-2.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L9 10.6V4a1 1 0 0 1 1-1Z" /><path d="M4 15a1 1 0 0 1 1 1v1h10v-1a1 1 0 1 1 2 0v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1Z" /></svg>
                  Reference: {assignment.referenceFile.fileName || 'Download'}
                </button>
              )}
              {(assignment.starterFiles || []).map((sf, i) => (
                <button key={i} onClick={() => downloadStarter(i, sf.fileName)} disabled={busy === 'download'} className="block text-xs font-semibold text-slate-600 hover:underline disabled:opacity-50">
                  Starter file {i + 1}: {sf.fileName || 'Download'}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Feedback when graded / returned */}
        {(isGraded || summary?.displayStatus === 'returned') && (submission?.feedback || summary?.feedback) && (
          <section className={`rounded-2xl border p-5 ${isGraded ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}>
            <h3 className={`text-sm font-extrabold ${isGraded ? 'text-emerald-700' : 'text-rose-700'}`}>
              {isGraded ? 'Instructor feedback' : 'Returned for revision'}
            </h3>
            {isGraded && submission?.marksObtained != null && (
              <p className="text-sm text-slate-700 mt-1">
                Marks: <span className="font-bold">{submission.marksObtained} / {assignment.totalMarks}</span>
                <span className={summary.passed ? 'text-emerald-700 font-bold ml-2' : 'text-rose-700 font-bold ml-2'}>{summary.passed ? '· Passed' : '· Below pass mark'}</span>
              </p>
            )}
            <p className="text-sm text-slate-700 mt-2 whitespace-pre-line">{submission?.feedback || summary?.feedback}</p>
          </section>
        )}

        {/* Submission editor */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-extrabold text-[#173563] uppercase tracking-wide">Your submission</h3>

          {!canEdit ? (
            <p className="text-sm text-slate-500">
              {isGraded
                ? 'This submission has been graded. Resubmission is closed for this assignment.'
                : 'Under the assignment rules, this submission can no longer be edited or resubmitted.'}
            </p>
          ) : (
            <>
              {allowedTypes.length > 1 && (
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Submission type</label>
                  <div className="flex flex-wrap gap-2">
                    {allowedTypes.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSubType(t)}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition ${subType === t ? 'border-[#173563] bg-[#173563] text-white' : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'}`}
                      >
                        {SUBMISSION_TYPE_LABELS[t]}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {subType === 'text' && (
                <label className="block">
                  <span className="block text-xs font-bold text-slate-600 mb-1">Text response</span>
                  <textarea rows={6} value={textValue} onChange={(e) => setTextValue(e.target.value)} className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#173563] focus:outline-none" placeholder="Type your answer here..." />
                </label>
              )}

              {subType === 'github' && (
                <label className="block">
                  <span className="block text-xs font-bold text-slate-600 mb-1">GitHub repository URL</span>
                  <input type="url" value={githubValue} onChange={(e) => setGithubValue(e.target.value)} className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#173563] focus:outline-none" placeholder="https://github.com/username/repository" />
                </label>
              )}

              {subType === 'live-url' && (
                <label className="block">
                  <span className="block text-xs font-bold text-slate-600 mb-1">Live project URL</span>
                  <input type="url" value={liveValue} onChange={(e) => setLiveValue(e.target.value)} className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#173563] focus:outline-none" placeholder="https://your-project.example.com" />
                </label>
              )}

              {subType === 'file' && (
                <div className="space-y-2">
                  <span className="block text-xs font-bold text-slate-600">File upload</span>
                  {hasExistingFile && !fileObj && (
                    <p className="text-xs text-slate-500">Existing file attached: <span className="font-semibold text-slate-700">{submission?.fileName}</span> ({formatFileSize(submission?.fileSize)})</p>
                  )}
                  <button type="button" onClick={openFilePicker} className="inline-flex items-center gap-2 rounded-xl border border-[#173563] px-4 py-2 text-xs font-bold text-[#173563] hover:bg-indigo-50">
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 4a1 1 0 0 1 .9.6L12 7l3.2.2a1 1 0 0 1 .6 1.8l-2.5 1.9.8 3.1a1 1 0 0 1-1.5 1.1L10 13l-2.6 2.1a1 1 0 0 1-1.5-1.1l.8-3.1-2.5-1.9a1 1 0 0 1 .6-1.8L8 7l1.1-2.4A1 1 0 0 1 10 4Z"/></svg>
                    {fileObj ? 'Change file' : 'Choose file'}
                  </button>
                  {fileObj && <p className="text-xs text-slate-600">Selected: <span className="font-semibold">{fileObj.name}</span> ({formatFileSize(fileObj.size)})</p>}
                  <p className="text-[11px] text-slate-400">Allowed: {(assignment.allowedFileTypes || []).join(', ') || 'any file type'} · Max {assignment.maxFileSizeMb || 25} MB</p>
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-1">
                <button type="button" onClick={saveDraft} disabled={Boolean(busy)} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
                  {busy === 'draft' ? 'Saving...' : 'Save draft'}
                </button>
                <button type="button" onClick={() => setConfirmOpen(true)} disabled={Boolean(busy)} className="rounded-xl bg-[#173563] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#102747] disabled:opacity-50">
                  Submit assignment
                </button>
              </div>
              {submission?.status === 'draft' && (
                <p className="text-[11px] text-amber-600 font-semibold">You have an unsent draft. Click "Submit assignment" to send it for grading.</p>
              )}
            </>
          )}
        </section>

        {/* Submission history */}
        {submission && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-[#173563] uppercase tracking-wide">Submission record</h3>
              <StatusBadge summary={summary} />
            </div>
            <dl className="grid grid-cols-2 gap-y-1.5 gap-x-4 text-xs">
              <div><dt className="text-slate-400 font-bold">Attempt</dt><dd className="text-slate-700">#{submission.submissionNumber || 1}</dd></div>
              <div><dt className="text-slate-400 font-bold">Submitted</dt><dd className="text-slate-700">{formatDateTime(submission.submittedAt)}</dd></div>
              <div><dt className="text-slate-400 font-bold">Type</dt><dd className="text-slate-700">{SUBMISSION_TYPE_LABELS[submission.submissionType] || 'Text'}</dd></div>
              {submission.marksObtained != null && <div><dt className="text-slate-400 font-bold">Marks</dt><dd className="text-slate-700">{submission.marksObtained} / {assignment.totalMarks}</dd></div>}
            </dl>
            {submission.submissionText && <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-xs text-slate-700 whitespace-pre-line">{submission.submissionText}</div>}
            {submission.githubUrl && <a href={submission.githubUrl} target="_blank" rel="noopener noreferrer" className="block text-xs font-semibold text-indigo-700 hover:underline">{submission.githubUrl}</a>}
            {submission.liveUrl && <a href={submission.liveUrl} target="_blank" rel="noopener noreferrer" className="block text-xs font-semibold text-indigo-700 hover:underline">{submission.liveUrl}</a>}
            {submission.fileUrl && (
              <button onClick={() => downloadMyFile(submission)} disabled={busy === 'download'} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#173563] hover:underline disabled:opacity-50">
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 3a1 1 0 0 1 1 1v6.6l2.3-2.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L9 10.6V4a1 1 0 0 1 1-1Z"/><path d="M4 15a1 1 0 0 1 1 1v1h10v-1a1 1 0 1 1 2 0v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1Z"/></svg>
                Download my file: {submission.fileName}
              </button>
            )}

            {gradingHistory.length > 0 && (
              <div className="border-t border-slate-100 pt-3">
                <h4 className="text-xs font-bold text-slate-500 mb-2">Grading history</h4>
                <ul className="space-y-2">
                  {gradingHistory.map((g, i) => (
                    <li key={i} className="text-xs rounded-lg bg-slate-50 border border-slate-200 p-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-600">{STATUS_META[g.status === 'returned_for_revision' ? 'returned' : g.status]?.label || g.status}</span>
                        <span className="text-slate-400">{formatDateTime(g.performedAt)}</span>
                      </div>
                      {g.marksObtained != null && <p className="text-slate-600 mt-0.5">Marks: {g.marksObtained} / {assignment.totalMarks}</p>}
                      {g.feedback && <p className="text-slate-600 mt-0.5 whitespace-pre-line">{g.feedback}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        <div className="flex gap-3">
          <Link to={`/student/courses/${courseId}`} className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-center text-sm font-bold text-slate-700 hover:bg-slate-100">Return to course</Link>
          <Link to={`/student/courses/${courseId}/assignments`} className="flex-1 rounded-xl bg-[#173563] px-4 py-2.5 text-center text-sm font-bold text-white hover:bg-[#102747]">All assignments</Link>
        </div>
      </main>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-base font-bold text-slate-900">Submit this assignment?</h2>
            <p className="mt-2 text-sm text-slate-600">
              Your work will be sent to the instructor for grading.
              {submission?.status === 'draft' ? ' This will convert your draft into a final submission.' : ''}
              {summary?.displayStatus === 'submitted' || summary?.displayStatus === 'under-review' ? ' This will replace your previous submission with a new attempt.' : ''}
            </p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setConfirmOpen(false)} disabled={busy === 'submit'} className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700">Cancel</button>
              <button onClick={finalizeSubmit} disabled={busy === 'submit'} className="flex-1 rounded-xl bg-[#173563] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60">{busy === 'submit' ? 'Submitting...' : 'Confirm submit'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Submission history (all assignments for the student)                */
/* ------------------------------------------------------------------ */

export const StudentSubmissionHistoryPage = () => {
  const [submissions, setSubmissions] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/assignments/submissions/my')
      .then((res) => setSubmissions(res.data.submissions || []))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load submission history'));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-[#102747] text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-5">
          <h1 className="text-lg sm:text-xl font-extrabold">My Assignment Submissions</h1>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-6 space-y-3">
        {error && <NoticeBanner notice={{ type: 'error', text: error }} />}
        {!submissions && !error && <Loading text="Loading submissions..." />}
        {submissions && submissions.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
            You have not submitted any assignments yet.
          </div>
        )}
        {submissions?.map((s) => {
          const a = s.assignmentId || {};
          const statusKey = s.status === 'returned_for_revision' || s.status === 'resubmission_required' ? 'returned' : s.status === 'under_review' ? 'under-review' : (s.status === 'submitted' && s.submittedAt && a.dueDate && new Date(s.submittedAt) > new Date(a.dueDate)) ? 'late' : s.status;
          const meta = STATUS_META[statusKey] || STATUS_META['not-submitted'];
          return (
            <article key={s._id} className="rounded-2xl border border-slate-200 bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="min-w-0">
                <p className="font-bold text-sm text-[#173563] truncate">{a.title || 'Assignment'}</p>
                <p className="text-[11px] text-slate-500">{s.courseId?.title || 'Course'} · Submitted {formatDateTime(s.submittedAt)}</p>
                {s.feedback && <p className="text-xs text-slate-600 mt-1 line-clamp-2">{s.feedback}</p>}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {s.marksObtained != null && <span className="text-sm font-bold text-slate-700">{s.marksObtained}/{a.totalMarks}</span>}
                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${meta.tone}`}>{meta.label}</span>
                {s.courseId && <Link to={`/student/courses/${s.courseId._id}/assignments/${a._id || s.assignmentId}`} className="text-xs font-bold text-[#173563] hover:underline">Open</Link>}
              </div>
            </article>
          );
        })}
      </main>
    </div>
  );
};
