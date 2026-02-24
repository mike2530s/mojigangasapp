/**
 * 🔵 StoriesRow — Fila horizontal de historias destacadas
 *
 * Círculos tipo Instagram Stories con borde de color y label.
 * Se muestran en la sección "DESTACADOS HOY".
 */

"use client";

interface StoryCircle {
    id: string;
    label: string;
    imageUrl: string;
    color?: string;
}

interface StoriesRowProps {
    stories: StoryCircle[];
    onStoryClick?: (id: string) => void;
}

export default function StoriesRow({ stories, onStoryClick }: StoriesRowProps) {
    return (
        <div className="flex gap-5 overflow-x-auto hide-scrollbar px-5 py-2">
            {stories.map((story) => (
                <button
                    key={story.id}
                    onClick={() => onStoryClick?.(story.id)}
                    className="flex flex-col items-center gap-1.5 flex-shrink-0"
                >
                    {/* Círculo con borde de color */}
                    <div
                        className="w-16 h-16 rounded-full p-[3px]"
                        style={{
                            background: story.color || "linear-gradient(135deg, #FF005C, #9C27B0)",
                        }}
                    >
                        <img
                            src={story.imageUrl}
                            alt={story.label}
                            className="w-full h-full rounded-full object-cover border-2 border-paper-white"
                        />
                    </div>
                    {/* Label */}
                    <span className="text-xs font-body text-gray-600 max-w-[64px] truncate">
                        {story.label}
                    </span>
                </button>
            ))}
        </div>
    );
}
