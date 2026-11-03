import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertCircle, Loader2, RotateCcw } from 'lucide-react';
import { resolveMediaUrl, getEmbedVideoUrl, isEmbedVideo } from '../utils/videoUtils';

/**
 * Reusable Video Playback Player
 *
 * Two presentation variants:
 * - "minimal" (default): professional video lightbox — the page behind stays visible
 *   but gets a true backdrop blur (backdrop-filter on a dedicated overlay layer,
 *   rgba(10,20,40,0.45) + ~10px blur) with a subtle dark tint for contrast. The video
 *   itself renders above that layer at its original aspect ratio, fully sharp, with
 *   native controls (play, pause, seek, volume, fullscreen) and a minimal close button
 *   in the top-right corner of the player. No solid white wash, no large dark modal.
 * - "detailed": the original framed modal with the navy header, title/category and
 *   description body. Kept for surfaces like course video reviews.
 *
 * Shared behavior for both variants:
 * - Rendered via createPortal to document.body so position:fixed is genuinely
 *   viewport-relative (z-[9999]), never trapped by ancestor transforms/overflow.
 * - Viewport clamping with dvh so the video never overflows on any screen size.
 * - object-contain preserves the source aspect ratio — never cropped or stretched.
 * - Playback always stops (and the stream is released) on close, Escape, or unmount.
 * - Backdrop click closes the player; clicks on the video itself never bubble out.
 * - Scroll-locking preserves the scrollbar gutter to avoid layout shift.
 */
const VideoPlayerModal = ({ video, onClose, variant = 'minimal' }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [visible, setVisible] = useState(false);
  const videoRef = useRef(null);
  const closeTimerRef = useRef(null);

  const videoSrc = video
    ? resolveMediaUrl(
        video.videoUrl || (video._id ? `/api/v1/video-testimonials/${video._id}/video` : '')
      )
    : '';
  const isEmbed = video ? isEmbedVideo(video.videoUrl) : false;
  const posterUrl = video?.thumbnailUrl ? resolveMediaUrl(video.thumbnailUrl) : undefined;

  // Cleanup video playback when modal closes or unmounts
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        try {
          videoRef.current.pause();
          videoRef.current.removeAttribute('src');
          videoRef.current.load();
        } catch (_) {}
      }
      clearTimeout(closeTimerRef.current);
    };
  }, []);

  // Enter transition once the player is mounted
  useEffect(() => {
    if (!video) return;
    setLoading(true);
    setError(false);
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [video]);

  // Keyboard shortcut (Escape) and background page scroll-locking
  useEffect(() => {
    if (!video) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      window.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video]);

  const stopPlayback = () => {
    if (videoRef.current) {
      try {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      } catch (_) {}
    }
  };

  const handleClose = () => {
    stopPlayback();
    if (variant === 'minimal') {
      // Play the short fade-out before unmounting the player.
      setVisible(false);
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = setTimeout(onClose, 180);
      return;
    }
    onClose();
  };

  const handleRetry = () => {
    setError(false);
    setLoading(true);
    setRetryKey((k) => k + 1);
  };

  if (!video) return null;

  /* ------------------------------------------------------------------ */
  /* Minimal variant — video only, no surrounding chrome                 */
  /* ------------------------------------------------------------------ */
  if (variant === 'minimal') {
    const minimalContent = (
      <div
        className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
        role="dialog"
        aria-modal="true"
        aria-label={`${video.studentName || 'Student'} testimonial video`}
      >
        {/*
          Blur layer: a sibling *behind* the player, not a filter on the parent.
          backdrop-filter here blurs only the website content underneath it, while
          the video (a later sibling, painted above) stays completely sharp.
        */}
        <div className="absolute inset-0 bg-[rgba(10,20,40,0.45)] backdrop-blur-[10px] backdrop-saturate-150" />

        <div
          className={`relative aspect-video w-[min(94vw,1100px,calc((100dvh-140px)*16/9))] rounded-xl overflow-hidden transition-transform duration-200 ${visible ? 'scale-100' : 'scale-[0.98]'}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Minimal close control — top-right corner of the player */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full bg-black/45 hover:bg-black/65 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close video player"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Video frame — original aspect ratio, letterboxed over the blurred page, never cropped */}
          <div className="relative w-full h-full flex items-center justify-center">
            {loading && !error && (
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <Loader2 className="w-7 h-7 animate-spin text-white" />
              </div>
            )}

            {error ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center gap-3 z-10 bg-black/30">
                <AlertCircle className="w-9 h-9 text-rose-400" />
                <p className="text-sm font-semibold text-white">Video could not be loaded</p>
                <p className="text-xs text-gray-300 max-w-sm">
                  Please retry or check your network connection.
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#F4D36B] hover:bg-[#ebd068] text-[#102747] font-bold text-xs transition cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retry</span>
                  </button>
                  {videoSrc && (
                    <a
                      href={videoSrc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-300 hover:text-white underline underline-offset-4"
                    >
                      Open Direct Stream
                    </a>
                  )}
                </div>
              </div>
            ) : isEmbed ? (
              <iframe
                key={`embed-${video._id || video.videoUrl}-${retryKey}`}
                src={getEmbedVideoUrl(video.videoUrl)}
                title={`${video.studentName || 'Student'} Testimonial Video`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                onLoad={() => setLoading(false)}
              />
            ) : (
              <video
                ref={videoRef}
                key={`stream-${video._id || video.videoUrl}-${retryKey}`}
                src={videoSrc}
                poster={posterUrl}
                controls
                autoPlay
                playsInline
                preload="metadata"
                className="w-full h-full object-contain"
                onLoadedData={() => setLoading(false)}
                onCanPlay={() => setLoading(false)}
                onError={(e) => {
                  console.error('Video playback error:', e);
                  setLoading(false);
                  setError(true);
                }}
              >
                Your browser does not support HTML5 video playback.
              </video>
            )}
          </div>
        </div>
      </div>
    );

    return typeof document !== 'undefined' ? createPortal(minimalContent, document.body) : null;
  }

  /* ------------------------------------------------------------------ */
  /* Detailed variant — original framed modal (title, category, body)    */
  /* ------------------------------------------------------------------ */
  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto overscroll-contain transition-opacity duration-200"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
    >
      <div
        className="bg-[#102747] text-white rounded-2xl sm:rounded-3xl overflow-hidden w-full max-w-[1000px] max-h-[90dvh] shadow-2xl border border-white/10 relative flex flex-col my-auto transition-transform duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-white/10 bg-[#0d213c] shrink-0">
          <div className="min-w-0 pr-3">
            <h3
              id="video-modal-title"
              className="text-white font-bold text-sm sm:text-base leading-snug truncate"
            >
              {video.studentName || 'Student Story'} — Video Testimonial
            </h3>
            {(video.designation || video.courseName) && (
              <p className="text-xs text-gray-400 truncate mt-0.5">
                {[video.designation, video.courseName].filter(Boolean).join(' • ')}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content (Video + Description/Metadata) */}
        <div className="flex-1 overflow-y-auto overscroll-contain flex flex-col bg-black/40">
          {/* Responsive Video Container - preserves aspect ratio without overflowing viewport */}
          <div className="relative w-full bg-black flex items-center justify-center shrink-0 aspect-video max-h-[calc(90dvh-120px)] overflow-hidden">
            {/* Loading Indicator */}
            {loading && !error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-10 text-white gap-2 pointer-events-none">
                <Loader2 className="w-8 h-8 animate-spin text-[#F4D36B]" />
                <span className="text-xs text-gray-300 font-medium">Loading video stream...</span>
              </div>
            )}

            {/* Error View */}
            {error ? (
              <div className="flex flex-col items-center justify-center p-6 text-center text-white gap-3 z-20">
                <AlertCircle className="w-10 h-10 text-rose-400" />
                <p className="text-sm font-semibold">Video Playback Error</p>
                <p className="text-xs text-gray-400 max-w-sm">
                  Unable to load this video stream. Please retry or verify your network connection.
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F4D36B] hover:bg-[#ebd068] text-[#102747] font-bold text-xs shadow-sm transition cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retry Playback</span>
                  </button>
                  {videoSrc && (
                    <a
                      href={videoSrc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-gray-300 hover:text-white underline underline-offset-4"
                    >
                      Open Direct Stream
                    </a>
                  )}
                </div>
              </div>
            ) : isEmbed ? (
              <iframe
                key={`embed-${video._id || video.videoUrl}-${retryKey}`}
                src={getEmbedVideoUrl(video.videoUrl)}
                title={`${video.studentName || 'Student'} Testimonial Video`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                onLoad={() => setLoading(false)}
              />
            ) : (
              <video
                ref={videoRef}
                key={`stream-${video._id || video.videoUrl}-${retryKey}`}
                src={videoSrc}
                controls
                autoPlay
                playsInline
                preload="metadata"
                className="w-full h-full object-contain bg-black"
                onLoadedData={() => setLoading(false)}
                onCanPlay={() => setLoading(false)}
                onError={(e) => {
                  console.error('Video playback error:', e);
                  setLoading(false);
                  setError(true);
                }}
              >
                Your browser does not support HTML5 video playback.
              </video>
            )}
          </div>

          {/* Testimonial Story / Description section */}
          {video.description && (
            <div className="px-4 sm:px-6 py-4 bg-[#0d213c] text-xs sm:text-sm text-gray-200 border-t border-white/10 shrink-0">
              <div className="font-semibold text-gray-300 mb-1 text-[11px] uppercase tracking-wider">
                Student Review & Experience
              </div>
              <p className="leading-relaxed whitespace-pre-line text-gray-300">
                {video.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
};

export default VideoPlayerModal;
