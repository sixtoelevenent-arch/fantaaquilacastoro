"use client";

import { useEffect, useRef } from "react";

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);

 useEffect(() => {
  const audio = audioRef.current;

  if (!audio) return;

  audio.volume = 0.3;

  const savedMuted =
    localStorage.getItem("music_muted") === "true";

  audio.muted = savedMuted;

  audio.play().catch(() => {
      });

  const handleToggle = (e: Event) => {
    const customEvent =
      e as CustomEvent<{ muted: boolean }>;

    audio.muted = customEvent.detail.muted;
  };

  window.addEventListener(
    "music-toggle",
    handleToggle
  );

  return () => {
    window.removeEventListener(
      "music-toggle",
      handleToggle
    );
  };
}, []);

  return (
    <audio
      ref={audioRef}
      loop
      preload="auto"
    >
      <source
        src="/audio/fantaquilacastoro.mp3"
        type="audio/mpeg"
      />
    </audio>
  );
}