"use client";

import { useEffect, useRef } from "react";

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.volume = 0.3;

    audio.play().catch(() => {
      console.log("Autoplay bloccato dal browser");
    });
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