import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";

// ── Public handle type — import this in the parent ──────────────────────────
export interface CountdownTimerHandle {
  start: () => void;
  pause: () => void;
  reset: () => void;
}

interface CountdownTimerProps {
  /** Total duration in seconds */
  duration: number;
  /** Called when the timer reaches zero */
  onComplete?: () => void;
}

const CountdownTimer = forwardRef<CountdownTimerHandle, CountdownTimerProps>(
  ({ duration, onComplete }, ref) => {

    const tiktok = useRef<HTMLAudioElement>(null);

    const [timeLeft, setTimeLeft] = useState(duration);
    const [isRunning, setIsRunning] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const isUrgent = timeLeft <= 5 && timeLeft > 0;
    const isFinished = timeLeft === 0;

    // SVG donut config
    const size = 200;
    const strokeWidth = 10;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference * (1 - timeLeft / duration);

    // Expose imperative API to parent
    useImperativeHandle(ref, () => ({
      start() {
        if (isFinished) {
          setTimeLeft(duration);
          // Let state flush before kicking off the interval
          setTimeout(() => {
            setIsRunning(true);
            setHasStarted(true);
          }, 0);
        } else {
          setIsRunning(true);
          setHasStarted(true);
        }
      },
      pause() {
        setIsRunning(false);
        tiktok.current?.pause();
        tiktok.current!.currentTime = 0;
      },
      reset() {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsRunning(false);
        setHasStarted(false);
        setTimeLeft(duration);
      },
    }));

    useEffect(() => {
      if (!isRunning) return;
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            onComplete?.();
            return 0;
          }

          if (prev === 6) {
            tiktok.current?.play();
          }

          return prev - 1;
        });
      }, 1000);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }, [isRunning, onComplete]);

    const formatTime = (s: number) => {
      const m = Math.floor(s / 60);
      const sec = s % 60;
      return m > 0 ? `${m}:${sec.toString().padStart(2, "0")}` : `${sec}`;
    };

    const trackColor = "#1f2937";
    const activeStroke = isUrgent ? "#ef4444" : "#f59e0b";
    const textColor = isFinished ? "#6b7280" : isUrgent ? "#ef4444" : "#f59e0b";

    return (
      <>
        <style jsx>{`
          .opacity-0 {
            opacity: 0!important;
          }
        `}</style>
        <div className={`flex flex-col items-center select-none transition-opacity duration-400 opacity-100 ${ isRunning ? '' : 'opacity-0' }`}>
          <audio ref={tiktok} src="/audio/tik-tok.mp3" preload="auto" />

          <div className={`relative transition-all duration-400 blur-none ${ isRunning ? '' : 'blur-xl' }`} style={{ width: size, height: size }}>
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              className="-rotate-90"
              aria-hidden="true"
            >
              {/* Track */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={trackColor}
                strokeWidth={strokeWidth}
              />
              {/* Progress arc */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={isFinished ? trackColor : activeStroke}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{
                  transition: hasStarted
                    ? "stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1), stroke 0.3s ease"
                    : "none",
                }}
              />
            </svg>

            {/* Center content */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center"
              style={{ color: textColor, transition: "color 0.3s ease" }}
            >
              <span
                className="font-mono font-semibold tabular-nums leading-none"
                style={{
                  fontSize: duration >= 600 ? "2.5rem" : "3.25rem",
                  letterSpacing: "-0.02em",
                }}
              >
                {isFinished ? "0" : formatTime(timeLeft)}
              </span>
              {isFinished && (
                <span className="mt-1 text-xs tracking-widest uppercase text-gray-500">
                  Done
                </span>
              )}
              {isUrgent && !isFinished && (
                <span className="mt-1 text-xs tracking-widest uppercase animate-pulse">
                  Hurry!
                </span>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
);

CountdownTimer.displayName = "CountdownTimer";
export default CountdownTimer;