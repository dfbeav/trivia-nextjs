import DarkVeil from './DarkVeil';
import CountdownTimer, { CountdownTimerHandle } from "./CountdownTimer";

import { useEffect, useState, useRef, useCallback } from 'react';

type Questions = {
    category: string;
    type: string;
    difficulty: string;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
};

export default function Game({ questions, quantity, rightAnswer, wrongAnswer }: { questions: Questions[]; quantity: number; rightAnswer: () => void; wrongAnswer: (type: 'timer' | 'answered') => void }) {

    const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [revealedAnswer, setRevealedAnswer] = useState<string | null>(null);
    const [colorState, setColorState] = useState<string>('');

    const timerRef = useRef<CountdownTimerHandle>(null);

    function decodeHtml(html: string) {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    useEffect(() => {
        if (timerRef.current) {
            timerRef.current.reset();
            timerRef.current.start();
        }
    }, [currentQuestionIndex]);

    // Shuffle once when the question changes
    useEffect(() => {
        const answers = [
            ...questions[currentQuestionIndex].incorrect_answers,
            questions[currentQuestionIndex].correct_answer
        ].sort(() => Math.random() - 0.5);
        setShuffledAnswers(answers);
        setSelectedAnswer(null);
    }, [currentQuestionIndex]);

    function handleAnswerIsCorrect() {

        rightAnswer();

        setColorState('bg-green-600');

        setTimeout(() => {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }, 4000);
    }

    function handleAnswerIsWrong() {
        wrongAnswer('answered');

        setRevealedAnswer(questions[currentQuestionIndex].correct_answer);
    }

    async function checkAnswer(answer: string) {
        //Stop the timer immediately when an answer is selected
        if (timerRef.current) {
            timerRef.current.pause();
        }

        setSelectedAnswer(answer);
        setColorState('bg-amber-500');

        await new Promise(resolve => setTimeout(resolve, 2000));

        if (answer === questions[currentQuestionIndex].correct_answer) {
            if (currentQuestionIndex < quantity - 1) {
                handleAnswerIsCorrect()
            } else {
                alert("Congratulations! You've won!");
                // Optionally reset the game here
            }   
        } else {
            handleAnswerIsWrong();
        }    
    }

    function questionsTracker() {
        return Array.from({ length: quantity }, (_, i) => quantity - i);
    }

    const timerRanOut = useCallback(() => {
        setTimeout(() => {
            setSelectedAnswer(questions[currentQuestionIndex].correct_answer);
            setColorState('bg-red-600');
            wrongAnswer('timer');
            setRevealedAnswer(questions[currentQuestionIndex].correct_answer);
        }, 0);
    }, [currentQuestionIndex, questions, wrongAnswer]);

    return (
        <div className="relative w-full h-full">
            <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
                <DarkVeil
                hueShift={10}
                noiseIntensity={0}
                scanlineIntensity={0}
                speed={0.5}
                scanlineFrequency={0}
                warpAmount={0}
                />
            </div>
            <div className="absolute top-0 left-0 w-full h-full grid grid-cols-4 grid-rows-1 gap-4 p-8">
                <aside className={`bg-black/50 backdrop-blur-sm text-white text-center rounded-lg p-2 w-full max-w-md grid grid-cols-1 grid-rows-${quantity} place-items-center justify-center`}>
                    <div id="mainLogo" className="animate-slide-in text-center flex flex-col items-center justify-center">
                        <div className="w-[200px] h-[5px] bg-blue-500 text-white text-center rounded-t-full mb-1">
                        </div>
                        <h1 className="text-sm font-bold uppercase tracking-wide text-shadow-lg text-white -mb-1">
                            &#10022; Who Wants To Win &#10022;
                        </h1>
                        <h1 className="text-xl font-bold uppercase text-shadow-lg text-white">Bragging Rights</h1>
                        <div className="w-[200px] h-[5px] bg-blue-500 text-white text-center rounded-b-full">
                        </div>
                    </div>
                    
                    { questionsTracker().map((q, index) => (
                        <div  key={index} className={`mb-3 pt-1 w-full ${(quantity - index) === currentQuestionIndex + 1 ? 'font-bold bg-amber-500 rounded-full' : ''} ${currentQuestionIndex + 1 > (quantity - index) ? 'font-bold text-amber-500' : ''}`}>
                            <h2 style={{ fontSize: `${24-(index * 0.75)}px`}}>Question {quantity - index}</h2>
                        </div>
                    )) }
                </aside>
                <div className="col-span-3 flex flex-col justify-start text-center gap-8">

                    <div className="flex my-12"></div>

                    <CountdownTimer ref={timerRef} duration={30} onComplete={() => { timerRanOut(); }} />

                    <div className="flex justify-center items-center max-w-4xl w-full mt-24 mx-auto px-4 rounded-xl h-24 bg-black text-white border-2 border-blue-500">
                        <h2 className="text-lg font-bold text-white">{decodeHtml(questions[currentQuestionIndex].question)}</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4 max-w-4xl w-full mx-auto">
                        { shuffledAnswers.map((answer, index) => (
                            <button 
                                key={index} 
                                onClick={() => checkAnswer(answer)}
                                disabled={!!selectedAnswer}
                                className={`
                                    text-white border-2 border-blue-500 text-lg font-bold
                                    py-2 px-4 rounded-full 
                                    ${selectedAnswer ? '' : 'hover:bg-amber-500 cursor-pointer'}
                                    transition
                                    ${answer === selectedAnswer ? colorState : 'bg-black'}
                                    ${revealedAnswer === answer ? 'bg-green-600' : ''}
                                    `}>
                                {decodeHtml(answer)}
                            </button>
                        )) }
                    </div>
                </div>
            </div>
        </div>
    )

}