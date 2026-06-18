import he from 'he';

export default function WhoWantsToWinBraggingRights({ stage }: { stage: 'start' | 'game' | 'win' }) {

    const topText = stage === 'start' ? he.decode('W e l c o m e &nbsp; T o') : 'W I N N E R';

    return (
        <div id="mainLogo" className="animate-slide-in text-center">
            <div className="w-[400px] md:w-[732px] bg-black/30 backdrop-blur-sm text-white text-center rounded-t-full mb-4">
                <p className='uppercase tracking-widest py-1 font-bold'>{topText}</p>
            </div>
            <h1 className="text-2xl md:text-5xl font-bold mb-2 uppercase tracking-widest text-shadow-lg text-white">
                &#10022; Who Wants To Win &#10022;
            </h1>
            <h1 className="text-4xl md:text-7xl font-bold mb-4 uppercase text-shadow-lg text-white">Bragging Rights</h1>
            <div className="w-[400px] md:w-[732px] bg-black/30 backdrop-blur-sm text-white text-center rounded-b-full mb-4">
                <p className='uppercase tracking-widest py-1 font-bold'>T R I V I A</p>
            </div>
        </div>
    )
}