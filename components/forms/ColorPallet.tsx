import { colors } from "@/utils/types";
import { Palette, Check } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

interface props {
    selectedColor: string;
    onChange: (col: string) => void;
}

const ColorPallet: React.FC<props> = ({ selectedColor, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    function handleColorChange(col: string) {
        onChange(col);
        setIsOpen(false);
    }

    const currentColorClass = colors.includes(selectedColor)
        ? `bg-${selectedColor}-300`
        : "bg-white";

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Toggle Button - Always visible */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors flex items-center gap-2"
                title="Change color"
            >
                <Palette size={18} />
                {/* Show current color indicator */}
                <div
                    className={`w-4 h-4 rounded-full ${currentColorClass} border border-gray-300 hidden sm:block`}
                ></div>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 bottom-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-50 min-w-[200px]">
                    {/* Header */}
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1">
                        Choose Color
                    </div>

                    {/* Color Grid */}
                    <div className="grid grid-cols-4 gap-2">
                        {/* All Colors */}
                        {colors.map((col) => (
                            <button
                                key={col}
                                className={`relative w-10 h-10 rounded-lg bg-${col}-300 hover:scale-110 transition-transform border-2 ${
                                    selectedColor === col
                                        ? "border-gray-800 shadow-md"
                                        : "border-transparent hover:border-gray-300"
                                }`}
                                onClick={() => handleColorChange(col)}
                                title={col}
                            >
                                {selectedColor === col && (
                                    <Check
                                        className="absolute inset-0 m-auto text-gray-800"
                                        size={18}
                                        strokeWidth={3}
                                    />
                                )}
                            </button>
                        ))}

                        {/* White/Default Option */}
                        <button
                            className={`relative w-10 h-10 rounded-lg bg-white hover:scale-110 transition-transform border-2 ${
                                !colors.includes(selectedColor)
                                    ? "border-gray-800 shadow-md"
                                    : "border-gray-300 hover:border-gray-400"
                            }`}
                            onClick={() => handleColorChange("white")}
                            title="default"
                        >
                            {!colors.includes(selectedColor) && (
                                <Check
                                    className="absolute inset-0 m-auto text-gray-800"
                                    size={18}
                                    strokeWidth={3}
                                />
                            )}
                        </button>
                    </div>

                    {/* Footer hint */}
                    <div className="text-xs text-gray-400 mt-3 px-1">
                        Click to apply color
                    </div>
                </div>
            )}
        </div>
    );
};

export default ColorPallet;
