"use client";

import React, { useState, useEffect } from "react";
import PillNav from "@/components/PillNav";
import dynamic from "next/dynamic";
const Background3D = dynamic(() => import("./AchievementsBackground3D"), { ssr: false });
import AchievementImageCard from "./AchievementsImageCard";
import AchievementDescriptionCard from "./AchievementsDescriptionCard";
import { SpotlightContainer } from "./AchievementsSpotlightCard";
import Footer from "./AchievementsFooter";
import { getImageUrl, getOptimizedImageUrl } from "@/sanity/lib/image";

interface AchievementItem {
  title: string;
  tag: string;
  description: string;
  imageSrc: any;
}

interface AchievementsClientProps {
  achievements: AchievementItem[];
}

const navItems = [
  { label: "HOME", href: "/" },
  { label: "EVENTS", href: "/events" },
  { label: "BLOGS", href: "/blogs" },
  { label: "ACHIEVEMENTS", href: "/achievements" },
  { label: "BOARD MEMBERS", href: "/board-members" },
  { label: "IMAGE GALLERY", href: "/image-gallery" },
  { label: "SPONSORS", href: "/sponsors" },
];

export default function AchievementsClient({ achievements }: AchievementsClientProps) {
  const [activeTab, setActiveTab] = useState("/achievements");
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  useEffect(() => {
    if (achievements.length === 0) return;
    const interval = setInterval(() => {
      setHighlightedIndex((prev) => (prev + 1) % achievements.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [achievements.length]);

  return (
    <>
      <PillNav
        items={navItems}
        activeHref={activeTab}
        setActiveHref={setActiveTab}
      />
      <main className="relative min-h-screen text-white overflow-x-hidden pb-32">
        {/* 3D Antigravity Floating Particles Background */}
        <Background3D />

        {/* Ambient background accent glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none z-0" />

        {/* Header Section */}
        <div className="relative z-10 pt-32 pb-20 px-4 text-center space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-yellow-500/20 bg-yellow-500/5 text-yellow-400 text-xs font-bold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-ping" />
            SESI Milestones
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none">
            OUR <span className="bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 bg-clip-text text-transparent">ACHIEVEMENTS</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg md:text-xl font-light">
            Celebrating innovation, technical excellence, and pioneering milestones at the School of Electronics and Communication Engineering.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-amber-500 mx-auto mt-8 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
        </div>

        {/* Achievements Bento Grid - Zigzag layout matching mockup */}
        <SpotlightContainer className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 grid grid-cols-1 gap-6">
          {achievements.map((item, index) => {
            const isEven = index % 2 === 1; // 0-based index: 0 is Odd Row (item 1), 1 is Even Row (item 2), etc.
            const imageUrl = getOptimizedImageUrl(item.imageSrc, 600, 600);

            const isHighlighted = index === highlightedIndex;

            const imageCard = (
              <AchievementImageCard
                imageSrc={imageUrl}
                title={item.title}
                tag={item.tag}
                index={index}
                isHighlighted={isHighlighted}
              />
            );

            const descCard = (
              <AchievementDescriptionCard
                title={item.title}
                tag={item.tag}
                description={item.description}
                index={index}
                isHighlighted={isHighlighted}
              />
            );

            return (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {isEven ? (
                  <>
                    {/* Even Row (Achievement 2, 4) - Desktop: Description Left (2/3), Image Right (1/3) */}
                    <div className="col-span-1 md:col-span-2 order-2 md:order-1">
                      {descCard}
                    </div>
                    <div className="col-span-1 md:col-span-1 order-1 md:order-2 animate-tilt-wrapper">
                      {imageCard}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Odd Row (Achievement 1, 3, 5) - Desktop: Image Left (1/3), Description Right (2/3) */}
                    <div className="col-span-1 md:col-span-1 order-1">
                      {imageCard}
                    </div>
                    <div className="col-span-1 md:col-span-2 order-2">
                      {descCard}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </SpotlightContainer>
      </main>
      <Footer />
    </>
  );
}
