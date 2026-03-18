"use client";

import { useState, useReducer, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    addDays,
} from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, X } from "lucide-react";

interface DateTimePickerProps {
    onConfirm: (fecha: Date, duracion: string) => void;
    onClose: () => void;
}

const DURATIONS = ["30 min", "1 hr", "2 hr", "3 hr+"];

// Reducer for time to track direction for animations
type TimeAction =
    | { type: "INC_HOUR" }
    | { type: "DEC_HOUR" }
    | { type: "INC_MIN" }
    | { type: "DEC_MIN" };

type TimeState = { hour: number; minute: number; direction: 1 | -1 };

function timeReducer(state: TimeState, action: TimeAction): TimeState {
    switch (action.type) {
        case "INC_HOUR": return { ...state, hour: state.hour === 12 ? 1 : state.hour + 1, direction: 1 };
        case "DEC_HOUR": return { ...state, hour: state.hour === 1 ? 12 : state.hour - 1, direction: -1 };
        case "INC_MIN": return { ...state, minute: state.minute >= 55 ? 0 : state.minute + 5, direction: 1 };
        case "DEC_MIN": return { ...state, minute: state.minute <= 0 ? 55 : state.minute - 5, direction: -1 };
    }
}

// A single animated digit display
function AnimatedDigit({ value, direction }: { value: string; direction: 1 | -1 }) {
    const variants = {
        enter: (d: number) => ({ opacity: 0, y: d > 0 ? 14 : -14 }),
        center: { opacity: 1, y: 0 },
        exit:  (d: number) => ({ opacity: 0, y: d > 0 ? -14 : 14 }),
    };
    return (
        <div className="relative w-12 h-10 overflow-hidden flex items-center justify-center">
            <AnimatePresence mode="popLayout" custom={direction}>
                <motion.span
                    key={value}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute text-[32px] font-medium font-heading text-fiesta-ink"
                    style={{ lineHeight: 1 }}
                >
                    {value}
                </motion.span>
            </AnimatePresence>
        </div>
    );
}

export default function DateTimePicker({ onConfirm, onClose }: DateTimePickerProps) {
    const today = new Date();

    // CALENDAR STATE
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [monthDir, setMonthDir] = useState<1 | -1>(1);
    const [selectedDate, setSelectedDate] = useState<Date | null>(today);

    // TIME STATE (reducer-driven for direction tracking)
    const [time, dispatch] = useReducer(timeReducer, { hour: 10, minute: 0, direction: 1 });
    const [ampm, setAmpm] = useState<"AM" | "PM">("AM");

    // DURATION STATE
    const [duracion, setDuracion] = useState<string | null>(null);

    // Calendar Navigation
    const nextMonth = useCallback(() => { setMonthDir(1); setCurrentMonth(m => addMonths(m, 1)); }, []);
    const prevMonth = useCallback(() => { setMonthDir(-1); setCurrentMonth(m => subMonths(m, 1)); }, []);

    const handleConfirm = () => {
        if (!selectedDate || !duracion) return;
        let hours = time.hour;
        if (ampm === "PM" && hours !== 12) hours += 12;
        if (ampm === "AM" && hours === 12) hours = 0;
        const finalDate = new Date(selectedDate);
        finalDate.setHours(hours, time.minute, 0, 0);
        onConfirm(finalDate, duracion);
    };

    const calendarKey = format(currentMonth, "yyyy-MM");
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

    // Build calendar rows
    const rows: React.ReactNode[] = [];
    let row: React.ReactNode[] = [];
    let day = startDate;
    while (day <= endDate) {
        for (let i = 0; i < 7; i++) {
            const cloneDay = day;
            const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
            const isToday = isSameDay(day, today);
            const isCurrentMonth = isSameMonth(day, monthStart);
            let cls = "w-8 h-8 flex items-center justify-center rounded-[8px] text-sm transition-colors cursor-pointer select-none ";
            if (!isCurrentMonth) cls += "text-gray-300 ";
            else if (isSelected) cls += "bg-[#E91E8C] text-white font-medium shadow-sm ";
            else if (isToday) cls += "border-[1.5px] border-[#00BCD4] text-[#00BCD4] font-medium ";
            else cls += "text-gray-700 hover:bg-gray-100 ";

            row.push(
                <div key={day.toString()} className="flex justify-center">
                    <div className={cls} onClick={() => setSelectedDate(cloneDay)}>
                        {format(day, "d")}
                    </div>
                </div>
            );
            day = addDays(day, 1);
        }
        rows.push(<div className="grid grid-cols-7 gap-y-1" key={day.toString()}>{row}</div>);
        row = [];
    }

    const hourStr = time.hour < 10 ? `0${time.hour}` : `${time.hour}`;
    const minStr = time.minute < 10 ? `0${time.minute}` : `${time.minute}`;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="w-full max-w-sm bg-white rounded-[16px] shadow-hard-lg border border-gray-100 flex flex-col overflow-hidden"
            >
                {/* Header */}
                <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
                    <h3 className="font-heading text-fiesta-ink">Fecha y Hora</h3>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-5 flex flex-col gap-6">
                    {/* CALENDAR */}
                    <div>
                        {/* Month header */}
                        <div className="flex justify-between items-center mb-4">
                            <button onClick={prevMonth} className="p-1 text-gray-400 hover:text-gray-700 transition">
                                <ChevronLeft size={20} />
                            </button>
                            <AnimatePresence mode="wait" custom={monthDir}>
                                <motion.div
                                    key={calendarKey + "-header"}
                                    custom={monthDir}
                                    variants={{
                                        enter: (d: number) => ({ opacity: 0, x: d > 0 ? 20 : -20 }),
                                        center: { opacity: 1, x: 0 },
                                        exit:  (d: number) => ({ opacity: 0, x: d > 0 ? -20 : 20 }),
                                    }}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.2 }}
                                    className="font-heading text-sm text-gray-800 capitalize select-none"
                                >
                                    {format(currentMonth, "MMMM yyyy", { locale: es })}
                                </motion.div>
                            </AnimatePresence>
                            <button onClick={nextMonth} className="p-1 text-gray-400 hover:text-gray-700 transition">
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        {/* Day names */}
                        <div className="grid grid-cols-7 mb-2">
                            {["do", "lu", "ma", "mi", "ju", "vi", "sá"].map((d, i) => (
                                <div key={i} className="text-center font-heading text-xs text-gray-400 uppercase select-none">{d}</div>
                            ))}
                        </div>

                        {/* Calendar grid — animates on month change */}
                        <AnimatePresence mode="wait" custom={monthDir}>
                            <motion.div
                                key={calendarKey}
                                custom={monthDir}
                                variants={{
                                    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 20 : -20 }),
                                    center: { opacity: 1, x: 0 },
                                    exit:  (d: number) => ({ opacity: 0, x: d > 0 ? -20 : 20 }),
                                }}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.2 }}
                            >
                                {rows}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="h-px bg-gray-100 w-full" />

                    {/* TIME PICKER */}
                    <div className="flex items-center justify-center gap-6 select-none">
                        {/* Hour */}
                        <div className="flex flex-col items-center">
                            <button onClick={() => dispatch({ type: "INC_HOUR" })} className="p-1 text-gray-400 hover:text-[#E91E8C] transition">
                                <ChevronUp size={24} />
                            </button>
                            <AnimatedDigit value={hourStr} direction={time.direction} />
                            <button onClick={() => dispatch({ type: "DEC_HOUR" })} className="p-1 text-gray-400 hover:text-[#E91E8C] transition">
                                <ChevronDown size={24} />
                            </button>
                        </div>

                        <span className="text-2xl font-medium text-gray-300 -mt-2">:</span>

                        {/* Minute */}
                        <div className="flex flex-col items-center">
                            <button onClick={() => dispatch({ type: "INC_MIN" })} className="p-1 text-gray-400 hover:text-[#E91E8C] transition">
                                <ChevronUp size={24} />
                            </button>
                            <AnimatedDigit value={minStr} direction={time.direction} />
                            <button onClick={() => dispatch({ type: "DEC_MIN" })} className="p-1 text-gray-400 hover:text-[#E91E8C] transition">
                                <ChevronDown size={24} />
                            </button>
                        </div>

                        {/* AM/PM */}
                        <div className="flex flex-col gap-2 ml-2">
                            {(["AM", "PM"] as const).map(p => (
                                <button
                                    key={p}
                                    onClick={() => setAmpm(p)}
                                    className={`text-xs font-heading px-3 py-1.5 rounded-[8px] transition ${ampm === p
                                        ? "bg-[#E91E8C] text-white"
                                        : "bg-white text-gray-500 border border-gray-200"
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-gray-100 w-full" />

                    {/* DURATION PICKER */}
                    <div>
                        <span className="block text-xs font-heading uppercase text-gray-400 mb-3 tracking-wide">Duración Estimada</span>
                        <div className="flex gap-2 w-full">
                            {DURATIONS.map((d) => (
                                <motion.button
                                    key={d}
                                    onClick={() => setDuracion(d)}
                                    whileTap={{ scale: 0.95 }}
                                    className={`flex-1 text-xs font-body py-2 rounded-[8px] transition border ${duracion === d
                                        ? "bg-[#00BCD4] text-white border-[#00BCD4]"
                                        : "bg-gray-50 text-gray-600 border-transparent hover:border-gray-200"
                                    }`}
                                >
                                    {d}
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* CONFIRM BUTTON */}
                    <motion.button
                        onClick={handleConfirm}
                        disabled={!selectedDate || !duracion}
                        whileTap={{ scale: 0.97 }}
                        className="w-full mt-2 py-3 rounded-[12px] text-sm font-heading bg-[#E91E8C] text-white shadow-md shadow-[#E91E8C]/20 hover:bg-[#D81B80] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Confirmar
                    </motion.button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
