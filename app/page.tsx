// page.tsx
"use client";
import StartScreen from '@/components/StartScreen';
import ButtonGlass from '@/components/ButtonGlass';
import Game from '@/components/Game';

import { RiVolumeUpFill, RiVolumeMuteFill } from '@remixicon/react';

import { useRef, useState, useEffect } from 'react';

type Categories = {
  trivia_categories: { id: number; name: string }[];
};

type Questions = {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};

export default function Home() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const wrongAnswer = useRef<HTMLAudioElement>(null);
  const rightAnswer = useRef<HTMLAudioElement>(null);

  const pendingAutoPlay = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioReady, setIsAudioReady] = useState(false);

  const [category, setCategory] = useState("General Knowledge");
  const [difficulty, setDifficulty] = useState("Medium");
  const [numQuestions, setNumQuestions] = useState("9 Questions");

  const [categories, setCategories] = useState<Categories>({} as Categories);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Questions[]>([]);
  const [currentSong, setCurrentSong] = useState<string | null>(null);

  // Fade transition state
  const [visibleScreen, setVisibleScreen] = useState<'start' | 'game'>('start');
  const [startVisible, setStartVisible] = useState(true);
  const [gameVisible, setGameVisible] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setIsAudioReady(false);
    audio.src = currentSong || "";
    audio.load();
    const handleCanPlay = async () => {
      setIsAudioReady(true);
      if (pendingAutoPlay.current) {
        pendingAutoPlay.current = false;
        try {
          await audio.play();
          setIsPlaying(true);
        } catch (err) {
          console.error("Auto-play after song switch failed:", err);
        }
      }
    };
    audio.addEventListener("canplaythrough", handleCanPlay);
    return () => audio.removeEventListener("canplaythrough", handleCanPlay);
  }, [currentSong]);

  useEffect(() => {
    //set audio source to a random song from the public folder
    setCurrentSong(`/audio/fastest-answer.mp3`);

    fetch("https://opentdb.com/api_category.php")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setError("Failed to fetch categories. Please try again later.");
      });
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

  const numberOfQuestions = parseInt(numQuestions);

  const FADE_DURATION = 400; // ms

  const handleStartGame = async () => {
    const categoryId = getCategoryId(category);
    const amount = parseInt(numQuestions);
    const diff = difficulty.toLowerCase();

    const url = new URL("https://opentdb.com/api.php");

    if (isPlaying) {
      const audio = audioRef.current;
      audio?.pause();
      pendingAutoPlay.current = true;
    }

    const fetchQuestions = async (difficulty: string) => {
      let quantity = amount / 3;

      const response = await fetch(`${url}?amount=${Math.ceil(quantity)}&category=${categoryId}&difficulty=${difficulty}&ammount=${quantity}&type=multiple`).then((res) => res.json())

      setQuestions((prevQuestions) => [...prevQuestions, ...response.results]);
      return response;
    };

    // Fade out StartScreen
    setStartVisible(false);

    const [data] = await Promise.all([
      fetchQuestions('easy'),
      new Promise((resolve) => setTimeout(resolve, FADE_DURATION)),
    ]);

    setQuestions(data.results);
    setVisibleScreen('game');

    // Fade in Game on next tick so the element is mounted first
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setGameVisible(true));
    });

    setCurrentSong(`/audio/speculation-under-glass.mp3`);

    setTimeout(() => {
      fetchQuestions('medium')
    }, 10000);

    setTimeout(() => {
      fetchQuestions('hard')
    }, 20000);
  };

  const handleRightAnswer = () => {
    // pause audio and play wrong answer sound
    const audio = audioRef.current;
    const rightAudio = rightAnswer.current;
    if (audio && rightAudio && isPlaying) {
      audio.pause();
      rightAudio.currentTime = 0;
      setTimeout(() => {
        rightAudio.play();
      }, 300);

      setTimeout(() => {
          audio.play();
        }, 4000);
    }
  }

  const handleWrongAnswer = () => {
    // pause audio and play wrong answer sound
    const audio = audioRef.current;
    const wrongAudio = wrongAnswer.current;
    if (audio && wrongAudio && isPlaying) {
      audio.pause();
      wrongAudio.currentTime = 0;
      setTimeout(() => {
        wrongAudio.play();
      }, 300);
    }

    setTimeout(() => {
      wrongAudio?.pause();
      wrongAudio!.currentTime = 0;
    
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setGameVisible(false));
      });

      setTimeout(() => {
        setVisibleScreen('start');
        setStartVisible(true);
      }, FADE_DURATION);
    }, 4000);

    setCurrentSong(`/audio/fastest-answer.mp3`);

    audio?.play();

  }

  return (
    <main className="relative flex flex-col items-center justify-center h-full bg-black">
      <audio ref={audioRef} preload="auto" loop />
      <audio ref={wrongAnswer} preload="auto" src="/audio/wrong-answer.mp3" />
      <audio ref={rightAnswer} preload="auto" src="/audio/correct-answer.mp3" />

      <div className="absolute z-10 top-0 right-0 w-full flex justify-end p-4">
        <ButtonGlass size="small" onClick={toggleMusic} disabled={!isAudioReady}>
          <div className="flex items-center gap-2">
            {isPlaying ?
              <><RiVolumeMuteFill size={20} /> Disable Music</> :
              <><RiVolumeUpFill size={20} /> Enable Music</>}
          </div>
        </ButtonGlass>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div
        className="w-full h-full flex items-center justify-center transition-opacity duration-400"
        style={{ opacity: startVisible ? 1 : 0, display: visibleScreen === 'game' ? 'none' : 'flex' }}
      >
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
      </div>

      {visibleScreen === 'game' && questions.length > 0 && (
        <div
          className="w-full h-full flex items-center justify-center transition-opacity duration-400"
          style={{ opacity: gameVisible ? 1 : 0 }}
        >
          <Game questions={questions} quantity={numberOfQuestions} rightAnswer={handleRightAnswer} wrongAnswer={handleWrongAnswer} />
        </div>
      )}
    </main>
  );
}