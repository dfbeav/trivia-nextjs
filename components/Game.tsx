import DarkVeil from './DarkVeil';

type Questions = {
    category: string;
    type: string;
    difficulty: string;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
};

export default function Game({ questions }: { questions: Questions[] }) {

    return (
        <>
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
        </>
    )

}