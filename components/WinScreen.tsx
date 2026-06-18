import WhoWantsToWinBraggingRights from '@/components/WhoWantsToWinBraggingRights';
import PrismaticBurst from './PrismaticBurst';
import ButtonGlass from './ButtonGlass';

export default function WinScreen({handleGoHome}: {handleGoHome: () => void}) {

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-blue-500">
            <div style={{ width: '100%', height: '100vh', position: 'relative', zIndex: 1, opacity: 0.5 }}>
                <PrismaticBurst
                    animationType="rotate3d"
                    intensity={2}
                    speed={0.5}
                    distort={0}
                    paused={false}
                    offset={{ x: 0, y: 0 }}
                    hoverDampness={0.25}
                    rayCount={0}
                    mixBlendMode="lighten"
                    colors={['#ff007a', '#4d3dff', '#ffffff']}
                    color0="#55a3f7"
                    color1="#3a43ed"
                    color2="#6366F1"
                />
            </div>

            <div className="absolute top-0 left-0 z-2 w-full h-full flex flex-col items-center justify-center gap-4">

                <WhoWantsToWinBraggingRights stage="win" />

                <h1 className="text-xl sm:text-2xl md:text-4xl font-bold mb-2 uppercase tracking-widest text-shadow-lg text-white text-center">
                    C o n g r a t u l a t i o n s !
                </h1>
                <p className="text-lg md:text-2xl text-white/80 text-center">You have won the game!</p>

                <ButtonGlass onClick={handleGoHome} size="large" bold>
                    Play Again
                </ButtonGlass>
            </div>
        </div>
    )
}