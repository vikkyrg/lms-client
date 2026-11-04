import React, { useCallback, useRef } from 'react';
import {
  Play,
  Clock,
  Video as VideoIcon
} from 'lucide-react';
import { resolveMediaUrl, getEmbedVideoUrl, isEmbedVideo } from '../utils/videoUtils';

const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return null;
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

/** Inline testimonial card; thumbnail styling is separate from video playback rendering. */
const VideoTestimonialCard = ({
  item,
  isPlaying,
  playbackId,
  onPlay,
  onPause,
  onEnded,
  onError
}) => {
  const videoRef = useRef(null);
  const shouldStartPlaybackRef = useRef(false);

  const videoSrc = resolveMediaUrl(
    item.videoUrl || (item._id ? `/api/v1/video-testimonials/${item._id}/video` : '')
  );
  const isEmbed = isEmbedVideo(item.videoUrl);
  const embedUrl = isEmbed ? getEmbedVideoUrl(item.videoUrl) : '';

  const requestPlayback = useCallback((video) => {
    if (!video || !video.paused || video.ended) return;

    video.play().catch((error) => {
      console.error(`Unable to play testimonial video ${playbackId}:`, error);
      onError?.(playbackId, error);
    });
  }, [onError, playbackId]);

  const handleVideoRef = useCallback((video) => {
    videoRef.current = video;
    if (video && shouldStartPlaybackRef.current) {
      shouldStartPlaybackRef.current = false;
      requestPlayback(video);
    }
  }, [requestPlayback]);

  const handleStartPlay = (e) => {
    e?.stopPropagation();
    if (isPlaying) {
      requestPlayback(videoRef.current);
      return;
    }

    shouldStartPlaybackRef.current = true;
    onPlay(playbackId);
  };

  const handleVideoPlay = (event) => {
    onPlay(playbackId, event.currentTarget);
  };

  const handleVideoPause = () => {
    if (!videoRef.current?.ended && onPause) {
      onPause(playbackId);
    }
  };

  const handleVideoEnded = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    onEnded?.(playbackId);
  };

  const handleVideoError = (event) => {
    const error = event.currentTarget.error;
    console.error(`Testimonial video failed to load ${playbackId}:`, error);
    onError?.(playbackId, error);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group h-full select-none">
      <div className="relative aspect-[3/4] max-h-[450px] w-full overflow-hidden bg-slate-900 rounded-t-2xl">
        {isPlaying ? (
          isEmbed ? (
            <iframe
              src={embedUrl}
              title={item.studentName}
              className="absolute inset-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              ref={handleVideoRef}
              src={videoSrc}
              controls
              playsInline
              preload="metadata"
              className="absolute inset-0 h-full w-full object-cover object-center"
              onPlay={handleVideoPlay}
              onPause={handleVideoPause}
              onEnded={handleVideoEnded}
              onError={handleVideoError}
            />
          )
        ) : (
          /* Thumbnail preview */
          <div
            className="w-full h-full cursor-pointer relative overflow-hidden"
            onClick={handleStartPlay}
          >
            {item.thumbnailUrl ? (
              <img
                src={resolveMediaUrl(item.thumbnailUrl)}
                alt={item.studentName}
                className="video-testimonial-thumbnail"
              />
            ) : (
              <div className="w-full h-full bg-[#102747] flex flex-col items-center justify-center text-white/60 p-4 text-center">
                <VideoIcon className="w-12 h-12 stroke-1" />
                <span className="text-xs mt-2 text-white/80 font-medium">Watch Student Story</span>
              </div>
            )}

            {/* Gradient overlay for contrast and label readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/25 pointer-events-none" />

            {/* Top Badges */}
            <div className="absolute top-3 left-3 bg-[#173563]/90 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-white/20 pointer-events-none">
              Student Story
            </div>

            {item.duration > 0 && (
              <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 pointer-events-none">
                <Clock className="w-3 h-3 text-[#F4D36B]" />
                <span>{formatDuration(item.duration)}</span>
              </div>
            )}

            {/* Centered Play / Replay Action Button */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-13 h-13 rounded-full bg-[#F4D36B] group-hover:bg-[#ebd068] text-[#102747] flex items-center justify-center shadow-lg transition-all duration-200 group-hover:scale-110">
                <Play className="w-6 h-6 fill-current ml-0.5" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Testimonial Card Details Footer */}
      <div className="p-[18px] sm:p-5 flex-1 flex flex-col justify-between bg-white">
        <div>
          <h3 className="font-bold text-[#172F56] text-[17px] sm:text-[18px] tracking-tight group-hover:text-[#2B6FE0] transition truncate leading-snug">
            {item.studentName}
          </h3>
          <p className="text-[14px] sm:text-[15px] font-medium text-[#64748B] mt-1 truncate">
            {item.designation || item.courseName || 'Alumni'}
          </p>
          {item.description && (
            <p className="text-xs sm:text-sm text-[#475467] mt-2.5 leading-relaxed line-clamp-2">
              {item.description}
            </p>
          )}
        </div>

        <div className="pt-3.5 mt-4 border-t border-gray-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handleStartPlay}
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#172F56] hover:text-[#2B6FE0] transition cursor-pointer group/link"
          >
            <span className="transition-colors group-hover/link:text-[#2B6FE0]">{isPlaying ? 'Playing' : 'Watch Story'}</span>
            <Play className="w-3.5 h-3.5 fill-current transition-colors group-hover/link:text-[#2B6FE0]" />
          </button>
          {item.isFeatured && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A67B10] bg-[#FFF2BF] px-2.5 py-0.5 rounded-full border border-[#F4D36B]/60">
              Featured
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoTestimonialCard;
