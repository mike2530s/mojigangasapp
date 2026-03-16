"use client";

import { useState } from "react";
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

export default function DateTimePicker({ onConfirm, onClose }: DateTimePickerProps) {
    const today = new Date();

    // CALENDAR STATE
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(today);

    // TIME STATE
    const [selectedHour, setSelectedHour] = useState(10);
    const [selectedMinute, setSelectedMinute] = useState(0);
    const [ampm, setAmpm] = useState<"AM" | "PM">("AM");

    // DURATION STATE
    const [duracion, setDuracion] = useState<string | null>(null);

    // Calendar Navigation
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    // Time Navigation
    const incrementHour = () => setSelectedHour((prev) => (prev === 12 ? 1 : prev + 1));
    const decrementHour = () => setSelectedHour((prev) => (prev === 1 ? 12 : prev - 1));
    const incrementMinute = () => setSelectedMinute((prev) => (prev >= 55 ? 0 : prev + 5));
    const decrementMinute = () => setSelectedMinute((prev) => (prev <= 0 ? 55 : prev - 5));

    const handleConfirm = () => {
        if (!selectedDate || !duracion) return;

        // Construct final Date object
        let hours = selectedHour;
        if (ampm === "PM" && hours !== 12) hours += 12;
        if (ampm === "AM" && hours === 12) hours = 0;

        const finalDate = new Date(selectedDate);
        finalDate.setHours(hours, selectedMinute, 0, 0);

        onConfirm(finalDate, duracion);
    };

    // Render Calendar Grid
    const renderHeader = () => {
        return (
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={prevMonth}
                    className="p-1 text-gray-400 hover:text-gray-700 transition"
                >
                    <ChevronLeft size={20} />
                </button>
                <div className="font-heading text-sm text-gray-800 capitalize select-none">
                    {format(currentMonth, "MMMM yyyy", { locale: es })}
                </div>
                <button
                    onClick={nextMonth}
                    className="p-1 text-gray-400 hover:text-gray-700 transition"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        );
    };

    const renderDays = () => {
        const days = ["do", "lu", "ma", "mi", "ju", "vi", "sá"];
        return (
            <div className="grid grid-cols-7 mb-2">
                {days.map((day, i) => (
                    <div
                        key={i}
                        className="text-center font-heading text-xs text-gray-400 uppercase select-none"
                    >
                        {day}
                    </div>
                ))}
            </div>
        );
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // 0 = Sunday
        const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = "";

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, "d");
                const cloneDay = day;
                
                const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
                const isTodayStr = isSameDay(day, today);
                const isCurrentMonth = isSameMonth(day, monthStart);

                let cellClass = "w-8 h-8 flex items-center justify-center rounded-[8px] text-sm transition-colors cursor-pointer select-none ";

                if (!isCurrentMonth) {
                    cellClass += "text-gray-300 ";
                } else if (isSelected) {
                    cellClass += "bg-[#E91E8C] text-white font-medium shadow-sm ";
                } else if (isTodayStr) {
                    cellClass += "border-[1.5px] border-[#00BCD4] text-[#00BCD4] font-medium ";
                } else {
                    cellClass += "text-gray-700 hover:bg-gray-100 ";
                }

                days.push(
                    <div
                        key={day.toString()}
                        className="flex justify-center"
                    >
                        <div
                            className={cellClass}
                            onClick={() => setSelectedDate(cloneDay)}
                        >
                            {formattedDate}
                        </div>
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div className="grid grid-cols-7 gap-y-1" key={day.toString()}>
                    {days}
                </div>
            );
            days = [];
        }

        return <div>{rows}</div>;
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="w-full max-w-sm bg-white rounded-[16px] shadow-hard-lg border border-gray-100 flex flex-col overflow-hidden"
            >
                {/* Header / Title */}
                <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
                    <h3 className="font-heading text-fiesta-ink">Fecha y Hora</h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-5 flex flex-col gap-6">
                    {/* CALENDAR */}
                    <div>
                        {renderHeader()}
                        {renderDays()}
                        {renderCells()}
                    </div>

                    <div className="h-px bg-gray-100 w-full" />

                    {/* TIME PICKER */}
                    <div className="flex items-center justify-center gap-6 select-none">
                        {/* Hour */}
                        <div className="flex flex-col items-center">
                            <button onClick={incrementHour} className="p-1 text-gray-400 hover:text-[#E91E8C] transition">
                                <ChevronUp size={24} />
                            </button>
                            <span className="text-[32px] font-medium font-heading w-12 text-center text-fiesta-ink">
                                {selectedHour < 10 ? `0${selectedHour}` : selectedHour}
                            </span>
                            <button onClick={decrementHour} className="p-1 text-gray-400 hover:text-[#E91E8C] transition">
                                <ChevronDown size={24} />
                            </button>
                        </div>
                        <span className="text-2xl font-medium text-gray-300 -mt-2">:</span>
                        {/* Minute */}
                        <div className="flex flex-col items-center">
                            <button onClick={incrementMinute} className="p-1 text-gray-400 hover:text-[#E91E8C] transition">
                                <ChevronUp size={24} />
                            </button>
                            <span className="text-[32px] font-medium font-heading w-12 text-center text-fiesta-ink">
                                {selectedMinute < 10 ? `0${selectedMinute}` : selectedMinute}
                            </span>
                            <button onClick={decrementMinute} className="p-1 text-gray-400 hover:text-[#E91E8C] transition">
                                <ChevronDown size={24} />
                            </button>
                        </div>

                        {/* AM/PM */}
                        <div className="flex flex-col gap-2 ml-2">
                            <button
                                onClick={() => setAmpm("AM")}
                                className={`text-xs font-heading px-3 py-1.5 rounded-[8px] transition ${
                                    ampm === "AM"
                                        ? "bg-[#E91E8C] text-white"
                                        : "bg-white text-gray-500 border border-gray-200"
                                }`}
                            >
                                AM
                            </button>
                            <button
                                onClick={() => setAmpm("PM")}
                                className={`text-xs font-heading px-3 py-1.5 rounded-[8px] transition ${
                                    ampm === "PM"
                                        ? "bg-[#E91E8C] text-white"
                                        : "bg-white text-gray-500 border border-gray-200"
                                }`}
                            >
                                PM
                            </button>
                        </div>
                    </div>

                    <div className="h-px bg-gray-100 w-full" />

                    {/* DURATION PICKER */}
                    <div>
                        <span className="block text-xs font-heading uppercase text-gray-400 mb-3 tracking-wide">
                            Duración Estimada
                        </span>
                        <div className="flex gap-2 w-full">
                            {DURATIONS.map((d) => (
                                <button
                                    key={d}
                                    onClick={() => setDuracion(d)}
                                    className={`flex-1 text-xs font-body py-2 rounded-[8px] transition border ${
                                        duracion === d
                                            ? "bg-[#00BCD4] text-white border-[#00BCD4]"
                                            : "bg-gray-50 text-gray-600 border-transparent hover:border-gray-200"
                                    }`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* CONFIRM BUTTON */}
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedDate || !duracion}
                        className="w-full mt-2 py-3 rounded-[12px] text-sm font-heading bg-[#E91E8C] text-white shadow-md shadow-[#E91E8C]/20 hover:bg-[#D81B80] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Confirmar
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
