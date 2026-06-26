"use client";

import Image from "next/image";
import SpotlightCard from "./AchievementsSpotlightCard";

interface AchievementImageCardProps {
  imageSrc: string;
  title: string;
  tag: string;
  index: number;
  isHighlighted?: boolean;
}

export default function AchievementImageCard({
  imageSrc,
  title,
  tag,
  index,
  isHighlighted = false,
}: AchievementImageCardProps) {
  return (
    <SpotlightCard className={`h-full w-full ${isHighlighted ? "mobile-pulse-active" : "mobile-pulse-inactive"}`}>
      <div className="relative w-full h-full min-h-[320px] md:min-h-[380px] rounded-[22px] overflow-hidden bg-zinc-950 border border-white/5">
        {/* Soft yellow ambient glow on card hover */}
        <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 blur-2xl z-0" />
        
        {/* Blurred background image to fill the card bounds dynamically */}
        <Image
          src={imageSrc}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover blur-xl opacity-35 z-0 scale-110 pointer-events-none"
        />

        {/* Foreground fully-contained image */}
        <Image
          src={imageSrc}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-contain z-10 p-3.5 transition-transform duration-700 ease-out group-hover/card:scale-[1.02]"
        />

        {/* Top gradient shadow overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/20 z-20 pointer-events-none" />

        {/* Floating Category tag badge */}
        <div className="absolute top-4 left-4 z-30 bg-zinc-950/85 backdrop-blur-md border border-yellow-500/30 text-yellow-400 text-[9px] font-extrabold uppercase px-3 py-1.5 rounded-full tracking-widest shadow-lg">
          {tag}
        </div>

        {/* Floating index identifier */}
        <div className="absolute bottom-4 right-4 z-30 bg-zinc-950/85 backdrop-blur-md border border-white/10 text-zinc-400 text-[10px] font-mono font-bold px-3 py-1.5 rounded-xl shadow-md">
          #0{index + 1}
        </div>
      </div>
    </SpotlightCard>
  );
}
