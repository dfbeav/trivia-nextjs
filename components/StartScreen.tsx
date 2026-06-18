// StartScreen.tsx
import WhoWantsToWinBraggingRights from '@/components/WhoWantsToWinBraggingRights';
import ButtonWhite from '@/components/ButtonWhite';
import Lightfall from '@/components/Lightfall';
import Dropdown from '@/components/Dropdown';

interface StartScreenProps {
    categories: { id: number; name: string }[];
    category: string;
    difficulty: string;
    numQuestions: string;
    onCategoryChange: (value: string) => void;
    onDifficultyChange: (value: string) => void;
    onNumQuestionsChange: (value: string) => void;
    onStart: () => void;
}

export default function StartScreen({
    categories,
    category,
    difficulty,
    numQuestions,
    onCategoryChange,
    onDifficultyChange,
    onNumQuestionsChange,
    onStart,
}: StartScreenProps) {
    return (
        <div className="relative bg-[#172070] w-full h-full flex items-center justify-center">
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

            <div className="absolute top-0 left-0 w-full h-full">
                <div className="flex flex-col items-center justify-center h-full">
                    
                    <div className="mb-16">
                        <WhoWantsToWinBraggingRights stage="start" />
                    </div>

                    <p className="text-white text-center mb-8 px-12">
                        Select the trivia options below to create a game and test your knowledge!
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        <Dropdown
                            label="Select Category"
                            width="250px"
                            selection={category}
                            options={categories?.map((cat) => cat.name) || []}
                            onChange={onCategoryChange}
                        />
                        {/* <Dropdown
                            label="Select Difficulty"
                            width="250px"
                            selection={difficulty}
                            options={['Easy', 'Medium', 'Hard']}
                            onChange={onDifficultyChange}
                        /> */}
                        <Dropdown
                            label="Number of Questions"
                            width="250px"
                            selection={numQuestions}
                            options={['3 Questions', '12 Questions', '15 Questions', '18 Questions']}
                            onChange={onNumQuestionsChange}
                        />
                    </div>
                    <ButtonWhite uppercase bold onClick={onStart}>
                        Start Playing
                    </ButtonWhite>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full flex justify-between items-center text-xs px-4 py-2">
                <p className="text-white">Created by <a href="https://www.dbeav.pro" className="underline">David Beaver</a></p>
                <p className="text-white">Powered by <a href="https://opentdb.com/" className="underline">Open Trivia DB</a></p>
            </div>
        </div>
    );
}