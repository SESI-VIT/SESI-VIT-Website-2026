"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

import dynamic from "next/dynamic";

// Relative imports for local files
const MagicRings = dynamic(() => import("./eventsMagicRings"), { ssr: false });
import PillNav from "@/components/PillNav";
import Footer from "./eventsFooter";
import { getImageUrl, getOptimizedImageUrl } from "@/sanity/lib/image";

export interface EventItem {
  title: string;
  category: string;
  image: any;
  description: string;
  details?: string;
  date: string;
  venue: string;
}

interface EventsClientProps {
  initialEvents: EventItem[];
}

function TwinklingStarBackground() {
  const [stars, setStars] = useState<Array<{ id: number; size: string; pace: string; top: string; left: string; delay: string }>>([]);

  useEffect(() => {
    const generatedStars = [...Array(120)].map((_, i) => {
      const size = i % 3 === 0 ? "1px" : i % 2 === 0 ? "1.5px" : "2px";
      const pace = i % 3 === 0 ? "fast" : i % 2 === 0 ? "medium" : "slow";
      return {
        id: i,
        size,
        pace,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 5}s`,
      };
    });
    setStars(generatedStars);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#02010A]">
      <div className="absolute inset-0 bg-grid" />
      <div className="aurora aurora1" />
      <div className="aurora aurora2" />
      <div className="aurora aurora3" />
      {stars.map((star) => (
        <span
          key={star.id}
          className="tiny-star"
          data-speed={star.pace}
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            animationDelay: star.delay,
          }}
        />
      ))}
    </div>
  );
}

const navItems = [
  { label: 'HOME', href: '/' },
  { label: 'EVENTS', href: '/events' },
  { label: 'BLOGS', href: '/blogs' },
  { label: 'ACHIEVEMENTS', href: '/achievements' },
  { label: 'BOARD MEMBERS', href: '/board-members' },
  { label: 'IMAGE GALLERY', href: '/image-gallery' },
  { label: 'SPONSORS', href: '/sponsors' }
];

export default function EventsClient({ initialEvents }: EventsClientProps) {
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [currentTab, setCurrentTab] = useState("/events");
  const [filter, setFilter] = useState("All");
  const [time, setTime] = useState("");

  const eventsSchema = {
    "@context": "https://schema.org",
    "@graph": initialEvents.map((event) => ({
      "@type": "Event",
      "name": event.title,
      "description": event.description,
      "startDate": event.date.includes('T') ? event.date : `${event.date}T00:00:00`,
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "location": {
        "@type": "Place",
        "name": event.venue,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Vellore",
          "addressRegion": "Tamil Nadu",
          "addressCountry": "India"
        }
      },
      "image": getImageUrl(event.image).startsWith('http') ? getImageUrl(event.image) : `${process.env.NEXT_PUBLIC_SITE_URL || "https://sesivit.org.in"}${getImageUrl(event.image)}`,
      "organizer": {
        "@type": "Organization",
        "name": "SESI Student Chapter VIT Vellore",
        "url": process.env.NEXT_PUBLIC_SITE_URL || "https://sesivit.org.in"
      }
    }))
  };

  useEffect(() => {
    setTime(new Date().toLocaleTimeString());
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredEvents = useMemo(() => {
    return filter === "All" ? initialEvents : initialEvents.filter((e) => e.category === filter);
  }, [filter, initialEvents]);

  function getCountdown(date: string, category: string) {
    const difference = +new Date(date) - +new Date();
    if (category === "Past") return "Event Ended";
    if (category === "Ongoing") return "Live Now";
    if (category === "Outreach") return "Outreach Active"; 
    if (difference <= 0) return "Starting Soon";

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    return `${days}d ${hours}h ${minutes}m left`;
  }

  return (
    <>
      <main className="relative min-h-screen text-white overflow-x-hidden flex flex-col justify-start items-center w-full pb-16">
        {/* SHADER ENGINES (Fixed backgrounds) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsSchema) }}
        />
        <TwinklingStarBackground />
        <MagicRings
          color="#FACC15"
          colorTwo="#FEF08A"
          speed={1.1}
          ringCount={5}
          attenuation={7}
          noiseAmount={0.03}
          followMouse={true}
          clickBurst={true}
        />

        {/* GSAP NAV COMPONENT */}
        <PillNav
          items={navItems}
          activeHref={currentTab}
          setActiveHref={setCurrentTab}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full flex flex-col justify-start items-center flex-1"
        >

          <AnimatePresence mode="wait">
            {currentTab === "/events" && (
              <motion.div
                key="eventsSliderView"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="w-full flex flex-col items-center"
              >
                <div className="text-center pt-36 pb-3 px-4 flex flex-col items-center select-none w-full max-w-4xl">
                  <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase mb-6">
                    EXPLORE <span className="text-yellow-400">EVENTS</span>
                  </h1>

                  <div className="px-5 py-1.5 mb-8 rounded-full bg-white/5 border border-white/10 text-yellow-400 font-mono text-[11px] tracking-widest shadow-2xl backdrop-blur-md uppercase font-bold">
                    {time || "LOADING..."}
                  </div>

                  {/* FILTERING BAR WITH "OUTREACH" ADDED AFTER "PAST" */}
                  <div className="flex justify-center gap-3 flex-wrap z-20 relative w-full mb-4">
                    {["All", "Upcoming", "Ongoing", "Past", "Outreach"].map((item) => (
                      <button
                        key={item}
                        onClick={() => setFilter(item)}
                        className={`creative-nav-btn text-xs font-bold tracking-wider uppercase transition-all duration-300 ${filter === item ? "active" : ""}`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="px-8 w-full max-w-7xl overflow-visible flex justify-center items-center">
                  {filteredEvents.length > 0 ? (
                    <Swiper
                      effect={"coverflow"}
                      grabCursor={true}
                      centeredSlides={true}
                      loop={filteredEvents.length >= 5}
                      slidesPerView={"auto"}
                      speed={750}
                      autoplay={{ delay: 4000, disableOnInteraction: false }}
                      coverflowEffect={{
                        rotate: 20,
                        stretch: -30,
                        depth: 250,
                        modifier: 1,
                        slideShadows: false,
                        scale: 0.88,
                      }}
                      pagination={{ clickable: true }}
                      modules={[EffectCoverflow, Pagination, Autoplay]}
                      className="premiumSwiper w-full !overflow-visible"
                    >
                      {filteredEvents.map((event) => (
                        <SwiperSlide key={event.title} className="!w-[300px] md:!w-[400px] pb-12 px-2">
                          <motion.div whileHover={{ scale: 1.02, y: -4 }} className="relative group cursor-pointer">
                            <div className="absolute -inset-[1px] rounded-[2rem] bg-gradient-to-r from-yellow-400 to-purple-600 opacity-10 blur-xl group-hover:opacity-40 transition duration-500" />

                            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0A0914]/95 backdrop-blur-3xl shadow-2xl h-[530px] md:h-[590px] flex flex-col justify-between">
                              <div className="w-full">
                                <div className="relative w-full aspect-[4/3] overflow-hidden rounded-t-[2rem]">
                                  <img src={getOptimizedImageUrl(event.image, 600, 450)} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 duration-700 transition-all pointer-events-none" />
                                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0914] via-[#0A0914]/20 to-transparent" />
                                </div>

                                <div className="p-6 flex flex-col items-start">
                                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black tracking-wider mb-3.5 uppercase status-badge" data-status={event.category}>
                                    <span className="w-1.5 h-1.5 rounded-full status-dot bg-current" />
                                    {event.category}
                                  </span>
                                  <h2 className="text-xl md:text-2xl font-black leading-tight mb-2 tracking-tight text-white line-clamp-1">{event.title}</h2>
                                  <p className="text-gray-400 text-xs leading-relaxed line-clamp-3">{event.description}</p>
                                </div>
                              </div>

                              <div className="px-6 pb-6 pt-0 w-full">
                                <div className="flex items-center gap-1.5 text-yellow-400 mb-4 text-[11px] font-bold tracking-wider uppercase">
                                  <div className="w-1 h-1 rounded-full bg-yellow-400 animate-ping" />
                                  {getCountdown(event.date, event.category)}
                                </div>
                                <button onClick={() => setSelectedEvent(event)} className="w-full py-3.5 rounded-xl bg-yellow-400 text-black font-black text-xs tracking-widest uppercase transition-all duration-300 hover:shadow-[0_0_25px_rgba(250,204,21,0.5)]">
                                  VIEW DETAILS
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  ) : (
                    <div className="text-gray-500 font-mono text-sm py-20">
                      No events found in this category.
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* DETAIL SCROLLABLE OVERLAY MODAL */}
          <AnimatePresence>
            {selectedEvent && (
              <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
                <motion.div
                  initial={{ scale: 0.92, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.92, opacity: 0, y: 20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 180 }}
                  className="bg-[#0C0B18] border border-white/10 rounded-[2rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden relative scrollbar-thin scrollbar-thumb-yellow-400/20 shadow-2xl"
                >
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center text-xl hover:bg-black/90 border border-white/15 transition z-30 shadow-lg cursor-pointer"
                  >
                    &times;
                  </button>

                  {/* POSTER CONTEXT: Fits completely without cutting edges */}
                  <div className="relative w-full overflow-hidden bg-black/40 border-b border-white/5">
                    <img
                      src={getOptimizedImageUrl(selectedEvent.image, 1000)}
                      alt={selectedEvent.title}
                      className="w-full h-auto object-contain block max-h-[50vh] mx-auto"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0C0B18] to-transparent pointer-events-none" />
                  </div>

                  <div className="p-6 md:p-8">
                    <h2 className="text-3xl font-black mb-2.5 tracking-tight text-white uppercase">
                      {selectedEvent.title}
                    </h2>

                    <p className="text-gray-300 text-xs md:text-sm mb-6 leading-relaxed font-medium">
                      {selectedEvent.details || selectedEvent.description}
                    </p>

                    <div className="grid grid-cols-2 gap-3.5 mb-6">
                      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3.5">
                        <p className="text-yellow-400 text-[10px] font-bold uppercase tracking-wider mb-1">Venue</p>
                        <p className="text-white text-xs md:text-sm font-semibold">{selectedEvent.venue}</p>
                      </div>
                      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3.5">
                        <p className="text-yellow-400 text-[10px] font-bold uppercase tracking-wider mb-1">Date</p>
                        <p className="text-white text-xs md:text-sm font-semibold">{new Date(selectedEvent.date).toDateString()}</p>
                      </div>
                      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3.5">
                        <p className="text-yellow-400 text-[10px] font-bold uppercase tracking-wider mb-1">Timeline</p>
                        <p className="text-white text-xs md:text-sm font-semibold">{getCountdown(selectedEvent.date, selectedEvent.category)}</p>
                      </div>
                      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3.5">
                        <p className="text-yellow-400 text-[10px] font-bold uppercase tracking-wider mb-1">Status</p>
                        <p className="text-white text-xs md:text-sm font-semibold uppercase">{selectedEvent.category}</p>
                      </div>
                    </div>

                    {(() => {
                      const isEventPast = selectedEvent.category === "Past" || new Date() > new Date(selectedEvent.date);
                      return !isEventPast ? (
                        <a 
                          href="https://vtop.vit.ac.in/vtop/open/page"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-black tracking-widest text-xs uppercase shadow-xl hover:opacity-95 transition cursor-pointer flex items-center justify-center"
                        >
                          Register For Event
                        </a>
                      ) : (
                        <a 
                          href="https://vtop.vit.ac.in/vtop/open/page"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-4 rounded-xl bg-white/5 text-gray-500 font-bold border border-white/5 cursor-not-allowed text-xs tracking-widest uppercase flex items-center justify-center"
                        >
                          Registration Closed
                        </a>
                      );
                    })()}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}
