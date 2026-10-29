import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

/* ------------------------------------------------------------------ */
/* Shared helpers                                                      */
/* ------------------------------------------------------------------ */

export const formatMinutes = (mins) => {
  if (!mins || Number(mins) <= 0) return 'No time limit';
  return `${mins} min`;
};

const StatChip = ({ label, value }) => (
  <div className="rounded-lg bg-slate-50 border border-slate-200 px-2.5 py-1.5">
    <p className="text-[10px] uppercase tracking-wide text-slate-400 font-bold">{label}</p>
    <p className="text-xs font-bold text-[#173563]">{value}</p>
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

const Loading = ({ text = 'Loading...' }) => (
  <div className="flex items-center justify-center py-16">
    <div className="animate-spin h-8 w-8 border-4 border-[#173563] border-t-transparent rounded-full" />
    <span className="ml-3 text-sm text-slate-500">{text}</span>
  </div>
);

/* ------------------------------------------------------------------ */
/* Quiz list                                                           */
/* ------------------------------------------------------------------ */

export const StudentQuizListPage = () => {
  const { courseId } = useParams();
  const [quizzes, setQuizzes] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/quizzes/course/${courseId}/my`)
      .then((res) => setQuizzes(res.data.quizzes || []))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load quizzes'));
  }, [courseId]);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-[#102747] text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-5 flex items-center gap-3">
          <Link to={`/student/courses/${courseId}`} className="text-xs font-bold bg-white/10 hover:bg-white/20 rounded-lg px-3 py-1.5 transition">← Course</Link>
          <h1 className="text-lg sm:text-xl font-extrabold">Quizzes</h1>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-6 space-y-4">
        {error && <NoticeBanner notice={{ type: 'error', text: error }} />}
        {!quizzes && !error && <Loading text="Loading quizzes..." />}
        {quizzes && quizzes.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
            No quizzes have been published for this course yet.
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          {quizzes?.map((quiz) => {
            const stats = quiz.stats || {};
            const passed = stats.bestPercentage !== null && stats.bestPercentage >= quiz.passingPercentage;
            return (
              <article key={quiz._id} className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col gap-3 shadow-xs">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-bold text-[#173563] text-sm">{quiz.title}</h2>
                    {passed && <span className="shrink-0 text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Passed</span>}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {quiz.moduleTitle || 'Whole course'}{quiz.lessonTitle ? ` · ${quiz.lessonTitle}` : ''}
                  </p>
                  {quiz.description && <p className="text-xs text-slate-600 mt-2 line-clamp-2">{quiz.description}</p>}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <StatChip label="Duration" value={formatMinutes(quiz.timeLimitMinutes)} />
                  <StatChip label="Pass" value={`${quiz.passingPercentage}%`} />
                  <StatChip label="Questions" value={String(quiz.questions?.length ?? 0)} />
                </div>
                <p className="text-[11px] text-slate-500">
                  {quiz.maxAttempts > 0
                    ? `Attempt ${Math.min((stats.attemptsUsed || 0) + 1, quiz.maxAttempts)} of ${quiz.maxAttempts}`
                    : `${stats.attemptsUsed || 0} attempt(s) taken`}
                  {' · '}{quiz.feedbackMode === 'immediate' ? 'Practice mode' : 'Assessment mode'}
                </p>
                <div className="mt-auto flex gap-2">
                  <Link
                    to={`/student/courses/${courseId}/quizzes/${quiz._id}`}
                    className={`flex-1 rounded-xl px-4 py-2 text-xs font-bold text-center transition ${stats.canStart ? 'bg-[#173563] text-white hover:bg-[#102747]' : 'bg-slate-100 text-slate-400 pointer-events-none'}`}
                  >
                    {stats.inProgressAttempt ? 'Resume quiz' : stats.attemptsUsed > 0 ? (stats.canStart ? 'Retry quiz' : 'No attempts left') : 'Start quiz'}
                  </Link>
                  {stats.latestAttempt && (
                    <Link
                      to={`/student/courses/${courseId}/quizzes/${quiz._id}/results/${stats.latestAttempt._id}`}
                      className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100"
                    >
                      Result
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Quiz take                                                           */
/* ------------------------------------------------------------------ */

const answerKey = (a) => (Array.isArray(a) ? a.join(',') : String(a ?? ''));

export const StudentQuizTakePage = () => {
  const { courseId, quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState({});        // idx -> option index or array
  const [checked, setChecked] = useState({});        // idx -> {isCorrect, explanation, correctAnswerTexts}
  const [current, setCurrent] = useState(0);
  const [remaining, setRemaining] = useState(null);  // seconds
  const [notice, setNotice] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const submittedRef = useRef(false);
  const saveTimers = useRef({});
  const remainingRef = useRef(null);

  useEffect(() => {
    api.post(`/quizzes/${quizId}/start`)
      .then((res) => {
        setQuiz(res.data.quiz);
        setAttempt(res.data.attempt);
        const restored = {};
        (res.data.attempt.answers || []).forEach((a) => { restored[a.questionIndex] = a.userAnswer; });
        setAnswers(restored);
        const limit = Number(res.data.quiz.timeLimitMinutes) || 0;
        const elapsed = (Date.now() - new Date(res.data.attempt.startedAt).getTime()) / 1000;
        const left = limit > 0 ? Math.max(0, Math.round(limit * 60 - elapsed)) : null;
        remainingRef.current = left;
        setRemaining(left);
      })
      .catch((err) => {
        setNotice({ type: 'error', text: err.response?.data?.message || 'Could not start the quiz' });
      });
  }, [quizId]);

  // Countdown + auto submit
  useEffect(() => {
    if (remaining === null || !attempt) return undefined;
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev === null) return prev;
        const next = prev - 1;
        remainingRef.current = next;
        if (next <= 0 && !submittedRef.current) {
          submittedRef.current = true;
          finalize();
        }
        return Math.max(0, next);
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [attempt, remaining !== null]);

  const finalize = useCallback(async () => {
    if (!attempt) return;
    setSubmitting(true);
    try {
      const payload = Object.entries(answers).map(([idx, answer]) => ({ questionIndex: Number(idx), answer }));
      const res = await api.post(`/quizzes/${quizId}/attempt/${attempt._id}/submit`, { answers: payload });
      navigate(`/student/courses/${courseId}/quizzes/${quizId}/results/${attempt._id}`, { replace: true });
    } catch (err) {
      if (err.response?.data?.code === 'ALREADY_SUBMITTED') {
        navigate(`/student/courses/${courseId}/quizzes/${quizId}/results/${attempt._id}`, { replace: true });
      } else {
        submittedRef.current = false;
        setNotice({ type: 'error', text: err.response?.data?.message || 'Submission failed. Please try again.' });
      }
    } finally {
      setSubmitting(false);
      setConfirmOpen(false);
    }
  }, [attempt, answers, quizId, courseId, navigate]);

  // Persist answer to the backend (debounced per question, refresh-safe)
  const persistAnswer = (idx, value) => {
    if (!attempt) return;
    clearTimeout(saveTimers.current[idx]);
    saveTimers.current[idx] = setTimeout(() => {
      api.put(`/quizzes/${quizId}/attempt/${attempt._id}/answer`, { questionIndex: idx, answer: value })
        .catch(() => {});
    }, 500);
  };

  const selectAnswer = (idx, value) => {
    setAnswers((prev) => {
      const next = { ...prev, [idx]: value };
      return next;
    });
    setChecked((prev) => { const n = { ...prev }; delete n[idx]; return n; });
    persistAnswer(idx, value);
  };

  const toggleMulti = (idx, oIdx) => {
    let committed;
    setAnswers((prev) => {
      const set = new Set(Array.isArray(prev[idx]) ? prev[idx] : []);
      set.has(oIdx) ? set.delete(oIdx) : set.add(oIdx);
      committed = [...set].sort((a, b) => a - b);
      return { ...prev, [idx]: committed };
    });
    setChecked((prev) => { const n = { ...prev }; delete n[idx]; return n; });
    if (committed !== undefined) persistAnswer(idx, committed);
  };

  const checkAnswer = async (idx) => {
    const q = quiz.questions[idx];
    const answer = answers[idx];
    if (answer === undefined || answer === '' || (Array.isArray(answer) && answer.length === 0)) {
      setNotice({ type: 'error', text: 'Select an answer first.' });
      return;
    }
    persistAnswer(idx, answer);
    try {
      const res = await api.post(`/quizzes/${quizId}/attempt/${attempt._id}/check`, { questionIndex: idx, answer });
      setChecked((prev) => ({ ...prev, [idx]: res.data }));
    } catch (err) {
      setNotice({ type: 'error', text: err.response?.data?.message || 'Could not check the answer' });
    }
  };

  if (!quiz || !attempt) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 p-4">
        {notice ? (
          <div className="max-w-md w-full">
            <NoticeBanner notice={notice} />
            <Link to={`/student/courses/${courseId}/quizzes`} className="mt-4 block text-center text-sm font-bold text-[#173563] underline">Back to quiz list</Link>
          </div>
        ) : <Loading text="Preparing your quiz..." />}
      </div>
    );
  }

  const total = quiz.questions.length;
  const q = quiz.questions[current];
  const answeredCount = Object.keys(answers).filter((k) => {
    const a = answers[k];
    return a !== undefined && a !== '' && !(Array.isArray(a) && a.length === 0);
  }).length;
  const unanswered = total - answeredCount;
  const feedback = checked[current];
  const isPractice = quiz.feedbackMode === 'immediate';
  const selected = answers[current];

  const fmtTime = (s) => {
    if (s === null) return null;
    const m = Math.floor(s / 60);
    const sec = String(s % 60).padStart(2, '0');
    return `${m}:${sec}`;
  };

  const optionState = (oIdx) => {
    const isSelected = q.questionType === 'multiple-select' ? (selected || []).includes(oIdx) : selected === oIdx;
    if (!feedback) return { isSelected, tone: 'neutral' };
    const correctIdxs = Array.isArray(feedback.correctAnswer)
      ? feedback.correctAnswer.map(Number)
      : feedback.correctAnswer !== undefined && feedback.correctAnswer !== null ? [Number(feedback.correctAnswer)] : [];
    const isCorrectOption = correctIdxs.includes(oIdx);
    if (isCorrectOption) return { isSelected, tone: 'correct' };
    if (isSelected && !isCorrectOption) return { isSelected, tone: 'wrong' };
    return { isSelected, tone: 'neutral' };
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-[#102747] text-white sticky top-0 z-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-extrabold truncate">{quiz.title}</h1>
            <p className="text-[11px] text-indigo-200">
              Attempt {attempt.attemptNumber}{quiz.maxAttempts > 0 ? ` of ${quiz.maxAttempts}` : ''} · {isPractice ? 'Practice mode' : 'Assessment mode'}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {remaining !== null && (
              <span className={`rounded-lg px-2.5 py-1 text-xs font-bold ${remaining <= 60 ? 'bg-rose-500 text-white animate-pulse' : 'bg-white/10 text-white'}`}>
                ⏱ {fmtTime(remaining)}
              </span>
            )}
          </div>
        </div>
        <div className="h-1 bg-white/10">
          <div className="h-1 bg-[#F4D36B] transition-all" style={{ width: `${(answeredCount / Math.max(total, 1)) * 100}%` }} />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-5 space-y-4">
        {notice && <NoticeBanner notice={notice} onDismiss={() => setNotice(null)} />}
        {quiz.instructions && current === 0 && (
          <p className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-2.5 text-xs text-indigo-900">{quiz.instructions}</p>
        )}

        {/* Question card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
            <span className="font-bold text-[#173563]">Question {current + 1} of {total}</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-bold">{q.points} mark{q.points !== 1 ? 's' : ''}</span>
          </div>
          <p className="text-sm font-semibold text-slate-900 leading-relaxed">{q.questionText}</p>
          {q.questionType === 'multiple-select' && (
            <p className="text-[11px] text-slate-500 -mt-2">Select every option you believe is correct, then move on.</p>
          )}

          <fieldset className="space-y-2">
            <legend className="sr-only">Answer options</legend>
            {q.options.map((opt, oIdx) => {
              const state = optionState(oIdx);
              const border = state.tone === 'correct' ? 'border-emerald-400 bg-emerald-50'
                : state.tone === 'wrong' ? 'border-rose-400 bg-rose-50'
                : state.isSelected ? 'border-[#173563] bg-indigo-50'
                : 'border-slate-200 hover:bg-slate-50';
              return (
                <label key={oIdx} className={`flex items-center gap-3 rounded-xl border-2 px-3.5 py-3 cursor-pointer transition text-sm ${border}`}>
                  <input
                    type={q.questionType === 'multiple-select' ? 'checkbox' : 'radio'}
                    name={`question-${current}`}
                    checked={state.isSelected}
                    onChange={() => (q.questionType === 'multiple-select' ? toggleMulti(current, oIdx) : selectAnswer(current, oIdx))}
                    className="h-4 w-4 accent-[#173563]"
                  />
                  <span className="flex-1 text-slate-800">{opt}</span>
                  {state.tone === 'correct' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700" aria-label="Correct answer">
                      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.79 6.8-6.8a1 1 0 0 1 1.4 0Z" clipRule="evenodd" /></svg>
                      Correct
                    </span>
                  )}
                  {state.tone === 'wrong' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700" aria-label="Your answer is incorrect">
                      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M6.3 5 5 6.3l3.7 3.7L5 13.7 6.3 15l3.7-3.7 3.7 3.7 1.3-1.3-3.7-3.7L15 6.3 13.7 5 10 8.7 6.3 5Z" /></svg>
                      Your pick
                    </span>
                  )}
                </label>
              );
            })}
          </fieldset>

          {/* Correct-set validation message for multi-select in practice mode */}
          {feedback && q.questionType === 'multiple-select' && (
            <div className={`rounded-xl px-3.5 py-2.5 text-xs font-semibold ${feedback.isCorrect ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
              {feedback.isCorrect ? '✓ All selected options are correct.' : '✗ Your selected set does not match the correct combination.'}
            </div>
          )}

          {feedback && (isPractice || q.questionType === 'multiple-select') && feedback.explanation && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-600">
              <p className="font-bold text-slate-700 mb-0.5">Explanation</p>
              {feedback.explanation}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {isPractice && (
              <button
                type="button"
                onClick={() => checkAnswer(current)}
                disabled={Boolean(feedback)}
                className="rounded-xl border border-[#173563] px-4 py-2 text-xs font-bold text-[#173563] hover:bg-indigo-50 disabled:opacity-40"
              >
                {feedback ? 'Answer checked' : 'Check answer'}
              </button>
            )}
            <button
              type="button"
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              disabled={current === 0}
              className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-40"
            >
              ← Previous
            </button>
            {current < total - 1 ? (
              <button
                type="button"
                onClick={() => setCurrent((c) => Math.min(total - 1, c + 1))}
                className="rounded-xl bg-[#173563] px-4 py-2 text-xs font-bold text-white hover:bg-[#102747]"
              >
                Next →
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                disabled={submitting}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                Submit quiz
              </button>
            )}
          </div>
        </div>

        {/* Question palette */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-2">Progress — {answeredCount} of {total} answered</p>
          <div className="flex flex-wrap gap-1.5">
            {quiz.questions.map((_, idx) => {
              const a = answers[idx];
              const isAnswered = a !== undefined && a !== '' && !(Array.isArray(a) && a.length === 0);
              const f = checked[idx];
              return (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  aria-label={`Go to question ${idx + 1}${isAnswered ? ', answered' : ', unanswered'}`}
                  className={`h-8 w-8 rounded-lg text-[11px] font-bold border transition ${
                    idx === current ? 'ring-2 ring-[#173563] ' : ''
                  }${
                    f ? (f.isCorrect ? 'bg-emerald-100 border-emerald-300 text-emerald-700' : 'bg-rose-100 border-rose-300 text-rose-700')
                    : isAnswered ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                    : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setConfirmOpen(true)}
            disabled={submitting}
            className="mt-4 w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            Submit quiz
          </button>
        </div>
      </main>

      {/* Confirmation dialog (prevents accidental/duplicate submission) */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-base font-bold text-slate-900">Submit your quiz?</h2>
            <p className="mt-2 text-sm text-slate-600">
              {unanswered > 0
                ? `You still have ${unanswered} unanswered question${unanswered > 1 ? 's' : ''}. Unanswered questions score 0 marks.`
                : `You answered all ${total} questions.`}
              {' '}Once submitted, your answers are sent for grading and cannot be changed.
            </p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setConfirmOpen(false)} disabled={submitting} className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700">Keep working</button>
              <button onClick={finalize} disabled={submitting} className="flex-1 rounded-xl bg-[#173563] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60">{submitting ? 'Submitting...' : 'Submit now'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Quiz results                                                        */
/* ------------------------------------------------------------------ */

export const StudentQuizResultPage = () => {
  const { courseId, quizId, attemptId } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/quizzes/${quizId}/attempt/${attemptId}/result`)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load the result'));
  }, [quizId, attemptId]);

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <NoticeBanner notice={{ type: 'error', text: error }} />
          <Link to={`/student/courses/${courseId}/quizzes`} className="mt-4 block text-center text-sm font-bold text-[#173563] underline">Back to quizzes</Link>
        </div>
      </div>
    );
  }
  if (!data) {
    return <div className="min-h-screen bg-slate-50"><Loading text="Loading your result..." /></div>;
  }

  const { attempt, quiz, result, attemptsLeft } = data;
  const review = result.review || [];
  const correctCount = review.filter((r) => r.isCorrect).length;
  const wrongCount = review.filter((r) => r.answered && !r.isCorrect).length;
  const unansweredCount = review.filter((r) => !r.answered).length;
  const fmtDuration = (seconds) => {
    if (seconds === undefined || seconds === null) return '—';
    const m = Math.floor(seconds / 60);
    const s = String(Math.round(seconds % 60)).padStart(2, '0');
    return `${m}m ${s}s`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-[#102747] text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-5 flex items-center gap-3">
          <Link to={`/student/courses/${courseId}/quizzes`} className="text-xs font-bold bg-white/10 hover:bg-white/20 rounded-lg px-3 py-1.5">← Quizzes</Link>
          <h1 className="text-lg font-extrabold truncate">{quiz.title} — Result</h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-6 space-y-5">
        {/* Summary card */}
        <section className={`rounded-2xl border p-5 sm:p-6 ${result.passed ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div>
              <p className={`text-2xl font-extrabold ${result.passed ? 'text-emerald-700' : 'text-rose-700'}`}>
                {result.passed ? 'Passed' : 'Failed'} · {result.percentage}%
              </p>
              <p className="text-sm text-slate-600 mt-1">
                Marks: <span className="font-bold text-slate-800">{result.score} / {result.totalScore}</span> · Pass mark {quiz.passingPercentage}% · Attempt #{attempt.attemptNumber}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Time taken: {fmtDuration(result.timeSpentSeconds)}</p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center shrink-0">
              <div className="rounded-xl bg-white border border-emerald-200 p-3">
                <p className="text-xl font-extrabold text-emerald-600">{correctCount}</p>
                <p className="text-[10px] font-bold uppercase text-slate-400">Correct</p>
              </div>
              <div className="rounded-xl bg-white border border-rose-200 p-3">
                <p className="text-xl font-extrabold text-rose-600">{wrongCount}</p>
                <p className="text-[10px] font-bold uppercase text-slate-400">Incorrect</p>
              </div>
              <div className="rounded-xl bg-white border border-slate-200 p-3">
                <p className="text-xl font-extrabold text-slate-500">{unansweredCount}</p>
                <p className="text-[10px] font-bold uppercase text-slate-400">Skipped</p>
              </div>
            </div>
          </div>
          {result.percentage < quiz.passingPercentage && (
            <p className="mt-3 text-xs text-rose-700 bg-white/70 rounded-lg px-3 py-2 border border-rose-200">
              Review the questions below, then retry when you are ready.
            </p>
          )}
        </section>

        {/* Actions */}
        <section className="flex flex-col sm:flex-row gap-3">
          <Link to={`/student/courses/${courseId}`} className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-center text-sm font-bold text-slate-700 hover:bg-slate-100">Return to course</Link>
          {attemptsLeft === null || attemptsLeft > 0 ? (
            <Link to={`/student/courses/${courseId}/quizzes/${quizId}`} className="flex-1 rounded-xl bg-[#173563] px-4 py-2.5 text-center text-sm font-bold text-white hover:bg-[#102747]">
              {attemptsLeft !== null ? `Retry quiz (${attemptsLeft} attempt${attemptsLeft === 1 ? '' : 's'} left)` : 'Retry quiz'}
            </Link>
          ) : (
            <div className="flex-1 rounded-xl bg-slate-100 px-4 py-2.5 text-center text-sm font-bold text-slate-400">No attempts remaining</div>
          )}
        </section>

        {/* Question-wise review */}
        <section className="space-y-3">
          <h2 className="text-sm font-extrabold text-[#173563] uppercase tracking-wide">Question-wise review</h2>
          {review.length === 0 && (
            <p className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
              The detailed review for this quiz is released by the instructor after all attempts are reviewed.
            </p>
          )}
          {review.map((r) => (
            <article key={r.questionIndex} className={`rounded-2xl border bg-white p-4 sm:p-5 shadow-xs ${r.isCorrect ? 'border-emerald-200' : r.answered ? 'border-rose-200' : 'border-amber-200'}`}>
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900">{r.questionIndex + 1}. {r.questionText}</p>
                <span className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                  r.isCorrect ? 'bg-emerald-100 text-emerald-700' : r.answered ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {r.isCorrect ? (
                    <><svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.79 6.8-6.8a1 1 0 0 1 1.4 0Z" clipRule="evenodd" /></svg> Correct</>
                  ) : r.answered ? (
                    <><svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M6.3 5 5 6.3l3.7 3.7L5 13.7 6.3 15l3.7-3.7 3.7 3.7 1.3-1.3-3.7-3.7L15 6.3 13.7 5 10 8.7 6.3 5Z" /></svg> Incorrect</>
                  ) : (
                    'Not answered'
                  )}
                </span>
              </div>

              <div className="mt-3 space-y-1.5 text-xs">
                <p className="text-slate-600">
                  <span className="font-bold text-slate-500">Your answer: </span>
                  {r.answered ? r.userAnswerText || <span className="italic">(option {String(r.userAnswer)})</span> : <span className="italic text-slate-400">—</span>}
                </p>
                {r.correctAnswerTexts && (
                  <p className="text-emerald-700">
                    <span className="font-bold">Correct answer: </span>{r.correctAnswerTexts.join(', ')}
                  </p>
                )}
                {!r.correctAnswerTexts && !r.isCorrect && r.answered && (
                  <p className="text-slate-400 italic">The correct answer is revealed based on this quiz&apos;s review settings.</p>
                )}
                {r.explanation && (
                  <p className="mt-1 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-slate-600"><span className="font-bold text-slate-700">Explanation: </span>{r.explanation}</p>
                )}
                <p className="text-slate-400">Marks earned: {r.marksEarned} / {r.points}</p>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
};
