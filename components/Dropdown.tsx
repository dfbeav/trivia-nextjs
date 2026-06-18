import { useState, useRef, useEffect } from "react";

interface DropdownProps {
  label?: string;
  width?: string;
  selection?: string;
  options: string[];
  onChange: (value: string) => void;
}

export default function Dropdown({
  label,
  width,
  selection,
  options,
  onChange,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Use 'pointerdown' to handle both mouse and touch events
    function handleOutside(event: PointerEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleOutside);
    return () => document.removeEventListener("pointerdown", handleOutside);
  }, []);

  // Lock body scroll when open on mobile (prevents background scroll behind the overlay)
  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 639px)").matches;
    if (isMobile) {
      document.body.style.overflow = open ? "hidden" : "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <style>{`
        @keyframes dropdown-in {
          from { opacity: 0; transform: scaleY(0.85) translateY(-6px); }
          to   { opacity: 1; transform: scaleY(1)    translateY(0); }
        }
        @keyframes dropdown-out {
          from { opacity: 1; transform: scaleY(1)    translateY(0); }
          to   { opacity: 0; transform: scaleY(0.85) translateY(-6px); }
        }
        .dropdown-open  { animation: dropdown-in  160ms cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .dropdown-close { animation: dropdown-out 120ms ease-in             forwards; }

        @keyframes sheet-in {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        @keyframes sheet-out {
          from { transform: translateY(0); }
          to   { transform: translateY(100%); }
        }
        .sheet-open  { animation: sheet-in  240ms cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .sheet-close { animation: sheet-out 180ms ease-in             forwards; }
      `}</style>

      {/* Mobile bottom-sheet overlay backdrop */}
      <div
        className="sm:hidden"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 40,
          background: "rgba(0,0,0,0.45)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 200ms ease",
        }}
        onPointerDown={() => setOpen(false)}
      />

      <div ref={dropdownRef} className="relative flex flex-col">
        {/* Trigger button */}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          style={width ? { width } : {}}
          className="flex justify-between items-center px-8 py-4 text-white bg-black/10 border border-gray-900 backdrop-blur-sm rounded-full cursor-pointer"
        >
          {selection || label}
          <span
            className="ml-2 inline-block transition-transform duration-200"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            &#9662;
          </span>
        </button>

        {/* Desktop dropdown — standard absolute panel below the trigger */}
        <div
          style={{
            ...(width ? { width } : {}),
            transformOrigin: "top center",
            pointerEvents: open ? "auto" : "none",
          }}
          className={`hidden sm:block absolute z-10 top-full mt-2 w-full max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent bg-black/40 border border-gray-900 backdrop-blur-lg rounded-lg p-4 ${
            open ? "dropdown-open" : "dropdown-close"
          }`}
        >
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-white/20 rounded cursor-pointer text-white"
            >
              {option}
            </button>
          ))}
        </div>

        {/* Mobile bottom sheet — slides up from the bottom of the viewport */}
        <div
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 50,
            pointerEvents: open ? "auto" : "none",
          }}
          className={`sm:hidden bg-black/80 backdrop-blur-lg border-t border-gray-800 rounded-t-2xl p-4 max-h-[70vh] overflow-y-auto ${
            open ? "sheet-open" : "sheet-close"
          }`}
        >
          {/* Drag handle */}
          <div className="flex justify-center mb-4">
            <div className="w-10 h-1 rounded-full bg-white/30" />
          </div>

          {/* Optional label as sheet header */}
          {label && (
            <p className="text-white/50 text-xs uppercase tracking-widest px-4 mb-2">
              {label}
            </p>
          )}

          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              // Minimum 44px touch target (py-3 = 12px × 2 + text ≈ 44px)
              className="block w-full text-left px-4 py-3 hover:bg-white/10 active:bg-white/20 rounded-lg cursor-pointer text-white text-base"
            >
              {option}
            </button>
          ))}

          {/* Safe-area spacer for notched phones */}
          <div style={{ height: "env(safe-area-inset-bottom, 12px)" }} />
        </div>
      </div>
    </>
  );
}