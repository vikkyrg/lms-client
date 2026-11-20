import React, { useEffect, useState } from 'react';
import { X, GraduationCap } from 'lucide-react';
import api from '../services/api';

const imageUrlFor = (path) => {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  const base = api.defaults.baseURL || '/api/v1';
  if (/^https?:\/\//i.test(base)) return `${base.replace(/\/+$/, '')}${path.replace(/^\/api\/v1/, '')}`;
  return `${window.location.origin}${path}`;
};

const wasShown = (frequency) => {
  if (frequency === 'session') return sessionStorage.getItem('website-popup-session') === '1';
  if (frequency === 'daily') return localStorage.getItem('website-popup-day') === new Date().toISOString().slice(0, 10);
  return false;
};

const markShown = (frequency) => {
  if (frequency === 'session') sessionStorage.setItem('website-popup-session', '1');
  if (frequency === 'daily') localStorage.setItem('website-popup-day', new Date().toISOString().slice(0, 10));
};

const getHeadingLines = (heading) => {
  const text = (heading || '').trim();
  if (!text) return [];

  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length > 1) {
    return lines.map((line, index) => ({ text: line, highlighted: index === lines.length - 1 }));
  }

  const words = text.split(/\s+/);
  if (words.length === 1) return [{ text, highlighted: true }];
  const splitAt = Math.ceil(words.length / 2);
  return [
    { text: words.slice(0, splitAt).join(' '), highlighted: false },
    { text: words.slice(splitAt).join(' '), highlighted: true }
  ];
};

const WebsitePopupModal = () => {
  const [popup, setPopup] = useState(null);
  const [visible, setVisible] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    let timer;
    let cancelled = false;

    const loadPopup = async () => {
      try {
        const response = await api.get('/website-popup/active');
        const config = response.data.popup;
        if (cancelled || !config || wasShown(config.displayFrequency)) return;
        setImageFailed(false);
        setPopup(config);
        timer = window.setTimeout(() => {
          if (cancelled) return;
          markShown(config.displayFrequency);
          setVisible(true);
        }, Math.max(0, Number(config.delaySeconds) || 0) * 1000);
      } catch (error) {
        console.error('Unable to load public website popup:', error);
      }
    };

    loadPopup();
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!visible) return undefined;
    const previousOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setVisible(false);
    };
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [visible]);

  if (!visible || !popup) return null;

  const showImage = Boolean(popup.hasImage && !imageFailed);
  const image = showImage ? imageUrlFor(popup.imageUrl) : '';
  const headingLines = getHeadingLines(popup.heading);

  return (
    <div
      className="website-popup-overlay fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/65 p-4 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && popup.closeOnOverlay) setVisible(false);
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
          aria-labelledby={popup.heading ? 'website-popup-heading' : undefined}
          aria-label={!popup.heading ? popup.title || 'Announcement' : undefined}
          className={`website-popup-card relative grid max-h-[90vh] max-h-[90dvh] w-[calc(100vw-32px)] max-w-[820px] grid-cols-1 overflow-hidden rounded-[20px] bg-white text-slate-900 shadow-[0_24px_80px_rgba(15,35,75,0.28)] ${
            showImage ? 'md:grid-cols-[45%_55%]' : 'md:max-w-[620px] md:grid-cols-1'
          }`}
      >
        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Close announcement"
            className="absolute right-3 top-3 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-800 shadow-sm transition duration-200 hover:rotate-90 hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
            <X className="h-5 w-5" />
        </button>

        {image ? (
            <div className="website-popup-image relative h-[200px] min-h-0 min-w-0 overflow-hidden bg-slate-100 md:h-[min(460px,90dvh)] md:min-h-0">
              <img
                src={image}
                alt={popup.heading || popup.title || 'Announcement'}
                className="absolute inset-0 h-full w-full object-contain object-center"
                onError={() => setImageFailed(true)}
              />
              <span className="website-popup-image-corner" aria-hidden="true" />
          </div>
        ) : null}

          <div className={`website-popup-content relative flex min-h-0 min-w-0 flex-col justify-center overflow-x-hidden overflow-y-auto px-6 py-9 pr-14 sm:px-8 sm:pr-16 md:px-7 md:py-10 lg:px-10 ${
            showImage ? 'max-h-[calc(90dvh-200px)]' : 'max-h-[90dvh]'
          } md:max-h-[90dvh]`}>
            <div className="website-popup-decoration website-popup-decoration-dots" aria-hidden="true" />
            <div className="website-popup-decoration website-popup-decoration-curve" aria-hidden="true" />

            {popup.badgeText ? (
              <span className="relative z-10 mb-5 inline-flex w-fit max-w-full items-center gap-2 rounded-full bg-[#ffdf79] px-4 py-2 text-[13px] font-bold leading-tight text-slate-900 shadow-[0_2px_8px_rgba(240,190,50,0.14)] sm:mb-5">
                <GraduationCap className="h-[17px] w-[17px] shrink-0 text-slate-900" aria-hidden="true" />
                <span className="break-words">{popup.badgeText}</span>
              </span>
            ) : null}

            {popup.title ? (
              <div className="relative z-10 mb-5 flex min-w-0 items-center gap-3">
                <p className="min-w-0 break-words text-[11px] font-bold uppercase tracking-[0.28em] text-slate-500 sm:text-xs">
                  {popup.title}
                </p>
                <span className="h-px w-12 shrink-0 bg-slate-300 sm:w-14" aria-hidden="true" />
              </div>
            ) : null}

            {headingLines.length ? (
              <div className="website-popup-heading-wrap relative z-10">
                <h2 id="website-popup-heading" className="website-popup-heading text-[32px] font-extrabold leading-[1.06] tracking-[-0.04em] text-[#0c1a39] sm:text-[38px] md:text-[34px] lg:text-[40px]">
                  {headingLines.map((line, index) => (
                    <span key={`${line.text}-${index}`} className={line.highlighted ? 'website-popup-heading-highlight' : 'website-popup-heading-line'}>
                      {line.text}
                    </span>
                  ))}
                </h2>
                <svg className="website-popup-heading-strokes" viewBox="0 0 38 38" fill="none" aria-hidden="true">
                  <path d="M12 19 8 9M22 15l2-11M27 24l9-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
            ) : null}

            {popup.subtitle ? (
              <p className="relative z-10 mt-5 break-words text-[16px] font-bold leading-snug text-slate-600 sm:text-[18px]">
                {popup.subtitle}
              </p>
            ) : null}
            {popup.description ? (
              <p className="relative z-10 mt-5 max-w-[390px] break-words text-[14px] leading-[1.65] text-slate-600 sm:text-[15px]">
                {popup.description}
              </p>
            ) : null}

            <svg className="website-popup-paper-plane" viewBox="0 0 60 60" fill="none" aria-hidden="true">
              <path d="m8 26 43-18-17 43-7-17-19-8Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
              <path d="m27 34 24-26" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
              <path d="M7 43c5 4 11 4 15 0m-9 10c6 1 11-1 14-5" stroke="currentColor" strokeWidth="1.2" strokeDasharray="1 3" strokeLinecap="round" />
            </svg>
          </div>
      </section>
    </div>
  );
};

export default WebsitePopupModal;
