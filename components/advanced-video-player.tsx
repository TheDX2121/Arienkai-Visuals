"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";

type AdvancedVideoPlayerProps = {
  src: string;
  poster?: string | null;
  title: string;
  watermarkText?: string;
  captionsUrl?: string | null;
};

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
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
  const [captionsEnabled, setCaptionsEnabled] = useState(false);
  const [message, setMessage] = useState("");

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
  }, [captionsEnabled]);

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

  function handleVolume(value: string) {
    const nextVolume = Number(value);

    setVolume(nextVolume);
    setIsMuted(nextVolume === 0);
  }

  function toggleMute() {
    setIsMuted((current) => !current);
  }

  function changeSpeed(value: string) {
    const nextSpeed = Number(value);

    setSpeed(nextSpeed);

    if (videoRef.current) {
      videoRef.current.playbackRate = nextSpeed;
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

  function toggleCaptions() {
    setMessage("");

    if (!captionsUrl) {
      setCaptionsEnabled(false);
      setMessage("Captions are not generated yet for this lesson.");
      return;
    }

    setCaptionsEnabled((current) => !current);
  }

  function blockRightClick(event: MouseEvent) {
    event.preventDefault();
  }

  return (
    <div
      ref={playerRef}
      className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-card"
      onContextMenu={blockRightClick}
    >
      <div className="relative bg-black">
        <video
          ref={videoRef}
          src={src}
          poster={poster || undefined}
          className="aspect-video w-full bg-black object-contain"
          playsInline
          controls={false}
          controlsList="nodownload"
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

        <button
          type="button"
          onClick={togglePlay}
          className="absolute inset-0 grid place-items-center bg-black/0 transition hover:bg-black/10"
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {!isPlaying ? (
            <span className="grid h-20 w-20 place-items-center rounded-full bg-white/15 text-3xl text-white backdrop-blur">
              ▶
            </span>
          ) : null}
        </button>

        <div className="pointer-events-none absolute left-5 top-5 flex items-center gap-3 rounded-full bg-black/30 px-4 py-2 text-white/90 backdrop-blur">
          <span className="h-6 w-[2px] rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.85)]" />
          <span className="text-sm font-black tracking-wide">
            Arienkai
          </span>
          <span className="text-xs text-white/45">
            {watermarkText}
          </span>
        </div>
      </div>

      <div className="bg-black/95 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="line-clamp-1 text-sm font-black text-white">
            {title}
          </div>

          <div className="text-xs text-white/50">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        <input
          type="range"
          min="0"
          max={duration || 0}
          step="0.1"
          value={currentTime}
          onChange={(event) => handleSeek(event.target.value)}
          className="w-full"
        />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={togglePlay}
              className="rounded-full bg-white px-5 py-2 text-sm font-black text-black"
            >
              {isPlaying ? "Pause" : "Play"}
            </button>

            <button
              type="button"
              onClick={toggleMute}
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white"
            >
              {isMuted ? "Unmute" : "Mute"}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(event) => handleVolume(event.target.value)}
              className="w-24"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={speed}
              onChange={(event) => changeSpeed(event.target.value)}
              className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm font-bold text-white"
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
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white"
            >
              CC {captionsEnabled ? "On" : "Off"}
            </button>

            <button
              type="button"
              onClick={openPictureInPicture}
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white"
            >
              Mini player
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white"
            >
              Fullscreen
            </button>
          </div>
        </div>

        {message ? (
          <div className="mt-3 rounded-xl bg-white/5 px-4 py-2 text-xs text-white/55">
            {message}
          </div>
        ) : null}
      </div>
    </div>
  );
}
