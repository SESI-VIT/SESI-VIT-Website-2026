"use client";

import SpotlightCard from "./AchievementsSpotlightCard";

interface AchievementDescriptionCardProps {
  title: string;
  subtitle?: string;
  tag: string;
  description: string;
  index: number;
  highlights?: string[];
  isHighlighted?: boolean;
}

export default function AchievementDescriptionCard({
  title,
  subtitle = "",
  tag,
  description,
  index,
  highlights = [],
  isHighlighted = false,
}: AchievementDescriptionCardProps) {
  return (
    <SpotlightCard className={`h-full w-full ${isHighlighted ? "mobile-pulse-active" : "mobile-pulse-inactive"}`}>
      <div className="flex flex-col justify-center h-full space-y-6 p-6 md:p-8 lg:p-10">
        
        {/* Title, Date & Description Header block */}
        <div className="space-y-3">
          <div className="text-[10px] font-extrabold text-yellow-500/80 tracking-[0.2em] uppercase flex items-center gap-2">
            <span>0{index + 1}</span>
            {subtitle && (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                <span>{subtitle}</span>
              </>
            )}
          </div>

          <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white group-hover/card:text-yellow-400 transition-colors duration-300">
            {title}
          </h3>

          <p className="text-zinc-400 leading-relaxed font-light text-sm md:text-base">
            {description}
          </p>
        </div>

        {/* Highlights checklist block */}
        {highlights.length > 0 && (
          <div className="pt-4 border-t border-white/5 space-y-3">
            <div className="text-[9px] font-extrabold text-zinc-500 uppercase tracking-widest">
              Key Achievements
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
              {highlights.map((highlight, hIdx) => (
                <li key={hIdx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                  {/* Glowing Arrow Icon */}
                  <svg
                    className="w-3.5 h-3.5 text-yellow-500 mt-0.5 flex-shrink-0 transition-transform duration-300 group-hover/card:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="4"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="leading-tight">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </SpotlightCard>
  );
}
