"use client";

import React, { useState } from "react";
import BoardOrbitImages from "./BoardOrbitImages";
import dynamic from 'next/dynamic';
import BoardElectricBorder from "./BoardElectricBorder";
import BoardFooter from "./BoardFooter";
import PillNav from "@/components/PillNav";
import { getImageUrl, getOptimizedImageUrl } from "@/sanity/lib/image";

const BoardGalaxy = dynamic(() => import('./BoardGalaxy'), { ssr: false });
const BoardSunCanvas = dynamic(() => import('./BoardSunCanvas'), { ssr: false });

interface BoardMemberItem {
  name: string;
  role: string;
  type: string;
  avatar: any;
  department?: string;
  link?: string;
}

interface BoardMembersClientProps {
  faculty: BoardMemberItem[];
  students: BoardMemberItem[];
}

export default function BoardMembersClient({ faculty, students }: BoardMembersClientProps) {
  const [activeTab, setActiveTab] = useState("/board-members");

  const navItems = [
    { label: "HOME", href: "/" },
    { label: "EVENTS", href: "/events" },
    { label: "BLOGS", href: "/blogs" },
    { label: "ACHIEVEMENTS", href: "/achievements" },
    { label: "BOARD MEMBERS", href: "/board-members" },
    { label: "IMAGE GALLERY", href: "/image-gallery" },
    { label: "SPONSORS", href: "/sponsors" },
  ];

  // Map student board members to orbit image format
  const orbitImages = students.map((s) => ({
    src: getOptimizedImageUrl(s.avatar, 200, 200),
    hqSrc: getOptimizedImageUrl(s.avatar, 600, 600),
    link: s.link || ""
  }));

  return (
    <main className="w-full min-h-screen bg-[#120F17] flex flex-col items-center overflow-x-hidden font-sans relative">
      <PillNav
        items={navItems}
        activeHref={activeTab}
        setActiveHref={setActiveTab}
      />

      {/* Background Galaxy */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <BoardGalaxy twinkleIntensity={1} glowIntensity={0.1} />
      </div>

      {/* Title Section */}
      <div className="w-full text-center z-10 pointer-events-none mt-24 md:mt-32 absolute top-0 left-0">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 tracking-wider">
          Visionaries of SESI
        </h1>
      </div>

      {/* Orbit Section */}
      <div className="w-full max-w-[1000px] flex items-center justify-center mt-[220px] mb-[120px] md:mt-[380px] md:mb-[200px] relative mx-auto z-10">
        {orbitImages.length > 0 ? (
          <BoardOrbitImages
            images={orbitImages}
            shape="ellipse"
            baseWidth={1000}
            radiusX={360}
            radiusY={260}
            rotation={-20}
            tilt={0}
            duration={40}
            itemSize={100}
            width="100%"
            height="100%"
            showPath={true}
            responsive={true}
            centerContent={
              <div className="w-[180px] h-[180px] md:w-[300px] md:h-[300px] pointer-events-none animate-pulse-glow">
                <BoardSunCanvas />
              </div>
            }
          />
        ) : (
          <div className="w-[180px] h-[180px] md:w-[300px] md:h-[300px] flex items-center justify-center relative bg-yellow-500/10 rounded-full border border-yellow-500/20">
            <BoardSunCanvas />
          </div>
        )}
      </div>

      {/* Faculty Coordinators Section */}
      <div id="board-members" className="w-full flex flex-col items-center pb-32 mt-[60px] md:mt-[120px] relative z-20">
        <h2 className="text-3xl md:text-4xl font-bold text-yellow-500 tracking-widest mb-12 uppercase text-center">
          Faculty Coordinators
        </h2>

        <div className="flex flex-col md:flex-row gap-12 px-4">
          {faculty.map((member) => (
            <BoardElectricBorder
              key={member.name}
              color="#eab308"
              borderRadius={12}
              className="w-80 md:w-96 rounded-xl bg-[#1a1a1a] shadow-[0_0_20px_rgba(255,204,0,0.05)] hover:shadow-[0_0_30px_rgba(255,204,0,0.2)] transition-shadow duration-300"
            >
              <div className="p-8 flex flex-col items-center text-center w-full h-full">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-yellow-500 mb-6 bg-gray-800">
                  <img
                    src={getOptimizedImageUrl(member.avatar, 300, 300)}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{member.name}</h3>
                <p className="text-yellow-500 font-semibold mb-2">{member.role}</p>
                {member.department && (
                  <p
                    className="text-gray-300 text-sm"
                    dangerouslySetInnerHTML={{
                      __html: member.department.includes('\n')
                        ? member.department.replace(/\n/g, '<br />')
                        : member.department
                    }}
                  />
                )}
              </div>
            </BoardElectricBorder>
          ))}
        </div>
      </div>

      <BoardFooter />
    </main>
  );
}
