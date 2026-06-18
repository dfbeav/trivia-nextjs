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
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div ref={dropdownRef} className="sm:relative flex flex-col">
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
      `}</style>

      <button
        type="button"
        onClick={() => setOpen(!open)}
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

      <div
        style={{
          ...(width ? { width } : {}),
          transformOrigin: "top center",
          pointerEvents: open ? "auto" : "none",
        }}
        className={`absolute z-10 w-full max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent bottom-4 sm:top-full w-full sm:w-unset mt-2 bg-black/40 border border-gray-900 backdrop-blur-lg rounded-lg p-4 ${
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
            className="block w-full text-left px-4 py-1 hover:bg-white/20 rounded cursor-pointer text-white"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}