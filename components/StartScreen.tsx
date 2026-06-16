import Button from '@/components/Button';
import Lightfall from '@/components/Lightfall';
import Dropdown from '@/components/Dropdown';

import { useState } from 'react';

export default function StartScreen() {
    const [category, setCategory] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [numQuestions, setNumQuestions] = useState("");

    return (
        <div className="bg-[#172070] w-full h-full flex items-center justify-center relative">
            <div style={{ width: '100%', height: '100vh', position: 'relative', opacity: 0.25 }}>
                <Lightfall
                colors={['#A6C8FF', '#5227FF', '#FF9FFC']}
                backgroundColor="#0A29FF"
                speed={0.7}
                streakCount={2}
                streakWidth={1}
                streakLength={1}
                glow={1}
                density={0.6}
                twinkle={1}
                zoom={3}
                backgroundGlow={0.5}
                opacity={1}
                mouseInteraction
                mouseStrength={0.5}
                mouseRadius={1}
                color1="#A6C8FF"
                color2="#5227FF"
                color3="#d8b74d"
            />
            </div>

            <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                <div className="mb-16 text-center">
                    <div className="w-[550px] bg-black/30 backdrop-blur-sm text-white text-center rounded-t-full mb-4">
                        <p className='uppercase tracking-widest py-1 font-bold'>W e l c o m e &nbsp; T o</p>
                    </div>
                    <h1 className="text-2xl md:text-4xl font-bold mb-2 uppercase tracking-widest text-shadow-lg">
                        &#10022; Who Wants To Win &#10022;
                    </h1>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 uppercase tracking-wide text-shadow-lg">Braging Rights</h1>
                    <div className="w-[550px] bg-black/30 backdrop-blur-sm text-white text-center rounded-b-full mb-4">
                        <p className='uppercase tracking-widest py-1 font-bold'>T R I V I A</p>
                    </div>
                </div>
                <p className="text-white mb-8">
                    Select the trivia options below to create a game and test your knowledge!
                </p>
                <div className="flex gap-4 mb-8">
                    <Dropdown
                        label="Select Category"
                        width="250px"
                        selection={category}
                        options={['General', 'Science', 'History']}
                        onChange={setCategory}
                    />

                    <Dropdown
                        label="Select Difficulty"
                        width="250px"
                        selection={difficulty}
                        options={['Easy', 'Medium', 'Hard']}
                        onChange={setDifficulty}
                    />

                    <Dropdown
                        label="Number of Questions"
                        width="250px"
                        selection={numQuestions}
                        options={['5 Questions', '10 Questions', '15 Questions', '20 Questions']}
                        onChange={setNumQuestions}
                    />
                </div>
                <Button uppercase>
                Start Playing
                </Button>
            </div>
        </div>
    )
}