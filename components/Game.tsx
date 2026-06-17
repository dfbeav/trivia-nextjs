import DarkVeil from './DarkVeil';

import { useState } from 'react';

type Questions = {
    category: string;
    type: string;
    difficulty: string;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
};

export default function Game({ questions }: { questions: Questions[] }) {

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    function decodeHtml(html: string) {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    function checkAnswer(answer: string) {
        if (answer === questions[currentQuestionIndex].correct_answer) {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
                alert("Congratulations! You've won!");
                // Optionally reset the game here
            }   
        } else {
            alert("Wrong answer! Try again.");
        }    
    }

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
                <aside className={`bg-black/50 backdrop-blur-sm text-white text-center rounded-lg p-8 w-full max-w-md grid grid-cols-1 grid-rows-${questions.length} place-items-center gap-6 justify-center`}>
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
                    
                    { questions.map((q, index) => (
                        <div  key={index} className={`mb-3 px-12 py-2 ${(questions.length - index) === currentQuestionIndex + 1 ? 'font-bold bg-amber-500 rounded-full' : ''}`}>
                            <h2 className="text-lg font-bold">Question {questions.length - index}</h2>
                        </div>
                    )) }
                </aside>
                <div className="col-span-3 flex flex-col justify-center text-center gap-8">
                    <div className="flex justify-center items-center max-w-4xl w-full mx-auto rounded-xl h-24 bg-black text-white border-2 border-blue-500">
                        <h2 className="text-lg font-bold text-white">{decodeHtml(questions[currentQuestionIndex].question)}</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4 max-w-4xl w-full mx-auto">
                        { [...questions[currentQuestionIndex].incorrect_answers, questions[currentQuestionIndex].correct_answer].sort(() => Math.random() - 0.5).map((answer, index) => (
                            <button 
                                key={index} 
                                onClick={() => checkAnswer(answer)}
                                className="bg-black text-white border-2 border-blue-500 text-lg font-bold py-2 px-4 rounded-full hover:bg-amber-500 transition cursor-pointer">
                                {decodeHtml(answer)}
                            </button>
                        )) }
                    </div>
                </div>
            </div>
        </div>
    )

}