"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";

type AdvancedVideoPlayerProps = {
  src: string;
  poster?: string | null;
  title: string;
  watermarkText?: string;
  captionsUrl?: string | null;
};

type QualityOption = "auto" | "1080" | "720" | "480" | "360";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function cloudinaryQualitySrc(src: string, quality: QualityOption) {
  if (quality === "auto") return src;

  if (!src.includes("/video/upload/")) {
    return src;
  }

  const widthMap: Record<Exclude<QualityOption, "auto">, string> = {
    "1080": "w_1920,q_auto",
    "720": "w_1280,q_auto",
    "480": "w_854,q_auto",
    "360": "w_640,q_auto"
  };

  const transformation = widthMap[quality];

  return src.replace("/video/upload/", `/video/upload/${transformation}/`);
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  );
}

function VolumeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05A4.5 4.5 0 0 0 16.5 12zm0-8.5v2.06A8 8 0 0 1 20 12a8 8 0 0 1-3.5 6.44v2.06A10 10 0 0 0 22 12a10 10 0 0 0-5.5-8.5z" />
    </svg>
  );
}

function MuteIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M3 9v6h4l5 5V4L7 9H3zm14.59 3 2.7-2.71-1.41-1.41-2.71 2.7-2.7-2.7-1.41 1.41 2.7 2.71-2.7 2.7 1.41 1.41 2.7-2.7 2.71 2.7 1.41-1.41-2.7-2.7z" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M19.43 12.98c.04-.32.07-.65.07-.98s-.02-.66-.07-.98l2.11-1.65-2-3.46-2.49 1a7.1 7.1 0 0 0-1.69-.98L15 3h-4l-.36 2.93c-.6.23-1.17.56-1.69.98l-2.49-1-2 3.46 2.11 1.65c-.04.32-.07.65-.07.98s.02.66.07.98l-2.11 1.65 2 3.46 2.49-1c.52.4 1.09.73 1.69.98L11 21h4l.36-2.93c.6-.23 1.17-.56 1.69-.98l2.49 1 2-3.46-2.11-1.65zM13 15.75A3.75 3.75 0 1 1 13 8a3.75 3.75 0 0 1 0 7.75z" />
    </svg>
  );
}

function FullscreenIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M5 5h6v2H7v4H5V5zm8 0h6v6h-2V7h-4V5zM5 13h2v4h4v2H5v-6zm12 4v-4h2v6h-6v-2h4z" />
    </svg>
  );
}

function MiniPlayerIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M19 7H5v10h14V7zm-2 8h-6v-4h6v4z" />
    </svg>
  );
}

export function AdvancedVideoPlayer({
  src,
  poster,
  title,
  watermarkText = "Arienkai",
  captionsUrl
}: AdvancedVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLTrackElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [speed, setSpeed] = useState(1);
  const [quality, setQuality] = useState<QualityOption>("auto");
  const [captionsEnabled, setCaptionsEnabled] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const videoSrc = cloudinaryQualitySrc(src, quality);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    video.volume = volume;
    video.playbackRate = speed;
    video.muted = isMuted;
  }, [volume, speed, isMuted]);

  useEffect(() => {
    const trackElement = trackRef.current;

    if (!trackElement) return;

    trackElement.track.mode = captionsEnabled ? "showing" : "hidden";
  }, [captionsEnabled, captionsUrl]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const savedTime = currentTime;

    video.load();

    video.currentTime = savedTime;
    video.playbackRate = speed;

    if (isPlaying) {
      video.play().catch(() => {});
    }
  }, [videoSrc]);

  async function togglePlay() {
    const video = videoRef.current;

    if (!video) return;

    if (video.paused) {
      await video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }

  function handleTimeUpdate() {
    const video = videoRef.current;

    if (!video) return;

    setCurrentTime(video.currentTime);
  }

  function handleLoadedMetadata() {
    const video = videoRef.current;

    if (!video) return;

    setDuration(video.duration);
  }

  function handleSeek(value: string) {
    const video = videoRef.current;

    if (!video) return;

    const nextTime = Number(value);

    video.currentTime = nextTime;
    setCurrentTime(nextTime);
  }

  function toggleMute() {
    const nextMuted = !isMuted;

    setIsMuted(nextMuted);

    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
    }
  }

  function handleVolume(value: string) {
    const nextVolume = Number(value);

    setVolume(nextVolume);
    setIsMuted(nextVolume === 0);
  }

  function changeSpeed(value: string) {
    const nextSpeed = Number(value);

    setSpeed(nextSpeed);

    if (videoRef.current) {
      videoRef.current.playbackRate = nextSpeed;
    }
  }

  function changeQuality(value: QualityOption) {
    setQuality(value);
  }

  function toggleCaptions() {
    setMessage("");

    if (!captionsUrl) {
      setCaptionsEnabled(false);
      setMessage("Captions are not available for this lesson.");
      return;
    }

    setCaptionsEnabled((current) => !current);
  }

  async function openPictureInPicture() {
    const video = videoRef.current;

    if (!video) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    } catch {
      return;
    }
  }

  async function toggleFullscreen() {
    const player = playerRef.current;

    if (!player) return;

    if (!document.fullscreenElement) {
      await player.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  }

  function blockRightClick(event: MouseEvent) {
    event.preventDefault();
  }

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={playerRef}
      className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-card"
      onContextMenu={blockRightClick}
    >
      <video
        ref={videoRef}
        src={videoSrc}
        poster={poster || undefined}
        className="aspect-video w-full bg-black object-contain"
        playsInline
        controls={false}
        controlsList="nodownload"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      >
        {captionsUrl ? (
          <track
            ref={trackRef}
            kind="captions"
            src={captionsUrl}
            srcLang="en"
            label="English"
          />
        ) : null}
      </video>

      <div className="pointer-events-none absolute left-5 top-5 flex items-center gap-3 rounded-full bg-black/25 px-4 py-2 text-white backdrop-blur">
        <span className="h-7 w-[2px] rounded-full bg-white shadow-[0_0_14px_rgba(255,255,255,0.9)]" />
        <span className="text-sm font-black tracking-wide">
          Arienkai
        </span>
        <span className="text-xs text-white/45">
          {watermarkText}
        </span>
      </div>

      {!isPlaying ? (
        <button
          type="button"
          onClick={togglePlay}
          className="absolute inset-0 grid place-items-center"
          aria-label="Play video"
        >
          <span className="grid h-20 w-20 place-items-center rounded-full bg-white/15 text-white backdrop-blur">
            <PlayIcon />
          </span>
        </button>
      ) : null}

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent px-4 pb-4 pt-16 opacity-100 transition">
        <div className="mb-3 flex items-center gap-3">
          <button
            type="button"
            onClick={togglePlay}
            className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>

          <button
            type="button"
            onClick={toggleMute}
            className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted || volume === 0 ? <MuteIcon /> : <VolumeIcon />}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(event) => handleVolume(event.target.value)}
            className="hidden w-20 sm:block"
            aria-label="Volume"
          />

          <div className="flex flex-1 items-center gap-3">
            <span className="hidden text-xs font-bold text-white/70 sm:inline">
              {formatTime(currentTime)}
            </span>

            <div className="relative h-2 flex-1">
              <div className="absolute inset-0 rounded-full bg-white/20" />
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-white"
                style={{ width: `${progressPercent}%` }}
              />

              <input
                type="range"
                min="0"
                max={duration || 0}
                step="0.1"
                value={currentTime}
                onChange={(event) => handleSeek(event.target.value)}
                className="absolute inset-0 h-2 w-full cursor-pointer opacity-0"
                aria-label="Seek"
              />
            </div>

            <span className="hidden text-xs font-bold text-white/70 sm:inline">
              {formatTime(duration)}
            </span>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setSettingsOpen((current) => !current)}
              className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
              aria-label="Settings"
            >
              <SettingsIcon />
            </button>

            {settingsOpen ? (
              <div className="absolute bottom-12 right-0 w-72 rounded-2xl border border-white/10 bg-black/90 p-4 text-white shadow-card backdrop-blur">
                <div className="mb-4 flex items-center justify-between">
                  <div className="font-black">Settings</div>

                  <button
                    type="button"
                    onClick={() => setSettingsOpen(false)}
                    className="text-sm text-white/50 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <label className="mb-2 block text-xs font-bold text-white/50">
                  Quality
                </label>

                <select
                  value={quality}
                  onChange={(event) => changeQuality(event.target.value as QualityOption)}
                  className="mb-4 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-bold text-white"
                >
                  <option className="bg-black" value="auto">Auto</option>
                  <option className="bg-black" value="1080">1080p</option>
                  <option className="bg-black" value="720">720p</option>
                  <option className="bg-black" value="480">480p</option>
                  <option className="bg-black" value="360">360p</option>
                </select>

                <label className="mb-2 block text-xs font-bold text-white/50">
                  Speed
                </label>

                <select
                  value={speed}
                  onChange={(event) => changeSpeed(event.target.value)}
                  className="mb-4 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-bold text-white"
                >
                  <option className="bg-black" value="0.75">0.75x</option>
                  <option className="bg-black" value="1">1x</option>
                  <option className="bg-black" value="1.25">1.25x</option>
                  <option className="bg-black" value="1.5">1.5x</option>
                  <option className="bg-black" value="2">2x</option>
                </select>

                <button
                  type="button"
                  onClick={toggleCaptions}
                  className="mb-3 flex w-full items-center justify-between rounded-xl bg-white/10 px-3 py-2 text-sm font-bold transition hover:bg-white/15"
                >
                  <span>Captions</span>
                  <span>{captionsEnabled ? "On" : "Off"}</span>
                </button>

                <button
                  type="button"
                  onClick={openPictureInPicture}
                  className="flex w-full items-center justify-between rounded-xl bg-white/10 px-3 py-2 text-sm font-bold transition hover:bg-white/15"
                >
                  <span>Mini player</span>
                  <MiniPlayerIcon />
                </button>

                {message ? (
                  <div className="mt-3 rounded-xl bg-white/5 px-3 py-2 text-xs text-white/55">
                    {message}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
            aria-label="Fullscreen"
          >
            <FullscreenIcon />
          </button>
        </div>

        <div className="line-clamp-1 text-xs font-bold text-white/55">
          {title}
        </div>
      </div>
    </div>
  );
}
