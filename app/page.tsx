"use client";
import StartScreen from '@/components/StartScreen';
import ButtonGlass from '@/components/ButtonGlass';

import { RiVolumeUpFill, RiVolumeMuteFill } from '@remixicon/react';

import { useRef, useState } from 'react';

export default function Home() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleMusic = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Playback failed:", error);
      }
    }
  };
  
  
  return (
    <main className="relative flex flex-col items-center justify-center h-full">
      <audio ref={audioRef} src="/audio/one-million-lights.mp3" />

      <div className="absolute z-10 top-0 right-0 w-full flex justify-end p-4">
        <ButtonGlass size="small" onClick={toggleMusic}>
            <div className="flex items-center gap-2">
              {isPlaying ? 
                <>
                  <RiVolumeMuteFill size={20} /> Disable Music
                </> : 
                <>
                  <RiVolumeUpFill size={20} /> Enable Music
                </>}
            </div>
        </ButtonGlass>
      </div>

      <StartScreen />
    </main>
  );
}
