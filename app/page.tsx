// page.tsx
"use client";
import StartScreen from '@/components/StartScreen';
import ButtonGlass from '@/components/ButtonGlass';

import { RiVolumeUpFill, RiVolumeMuteFill } from '@remixicon/react';

import { useRef, useState, useEffect } from 'react';

type Categories = {
  trivia_categories: { id: number; name: string }[];
};

export default function Home() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioReady, setIsAudioReady] = useState(false);

  const [category, setCategory] = useState("General Knowledge");
  const [difficulty, setDifficulty] = useState("Medium");
  const [numQuestions, setNumQuestions] = useState("10 Questions");

  const [categories, setCategories] = useState<Categories>({} as Categories);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = "/audio/fastest-answer.mp3";
    audio.load();
    const handleCanPlay = () => setIsAudioReady(true);
    audio.addEventListener("canplaythrough", handleCanPlay);
    return () => audio.removeEventListener("canplaythrough", handleCanPlay);
  }, []);

  useEffect(() => {
    fetch("https://opentdb.com/api_category.php")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio || !isAudioReady) return;
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

  const getCategoryId = (name: string) => {
    const cat = categories.trivia_categories?.find((c) => c.name === name);
    return cat ? cat.id : null;
  };

  const handleStartGame = () => {
    const categoryId = getCategoryId(category);
    const amount = parseInt(numQuestions);
    const diff = difficulty.toLowerCase();

    const url = `https://opentdb.com/api.php?amount=${amount}&category=${categoryId}&difficulty=${diff}&type=multiple`;
    console.log("Fetching questions from:", url);

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log("Questions:", data);
        // TODO: pass data to your game screen
      })
      .catch((err) => console.error("Error fetching questions:", err));
  };

  return (
    <main className="relative flex flex-col items-center justify-center h-full">
      <audio ref={audioRef} preload="auto" loop />

      <div className="absolute z-10 top-0 right-0 w-full flex justify-end p-4">
        <ButtonGlass size="small" onClick={toggleMusic} disabled={!isAudioReady}>
          <div className="flex items-center gap-2">
            {isPlaying ?
              <><RiVolumeMuteFill size={20} /> Disable Music</> :
              <><RiVolumeUpFill size={20} /> Enable Music</>}
          </div>
        </ButtonGlass>
      </div>

      <StartScreen
        categories={categories.trivia_categories}
        category={category}
        difficulty={difficulty}
        numQuestions={numQuestions}
        onCategoryChange={setCategory}
        onDifficultyChange={setDifficulty}
        onNumQuestionsChange={setNumQuestions}
        onStart={handleStartGame}
      />
    </main>
  );
}