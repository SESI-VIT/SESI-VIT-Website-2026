"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, Download, GraduationCap, Network, 
  Presentation, Sun, Building2, Users, 
  Calendar, CheckCircle2, ChevronDown, Award, X 
} from "lucide-react";
import dynamic from "next/dynamic";
import PillNav from "@/components/PillNav";
import SponsarFooter from "./sponsarFooter";
import { getImageUrl, getOptimizedImageUrl } from "@/sanity/lib/image";

const SponsarLightfall = dynamic(() => import("./sponsarLightfall"), {
  ssr: false,
});

const LIGHTFALL_COLORS = ['#EAB308', '#EAB308', '#000000'];

function FAQItem({ q, a, isOpen, onToggle }: { q: string, a: string, isOpen: boolean, onToggle: () => void }) {
  return (
    <div className={`border rounded-[2rem] overflow-hidden transition-colors hover:border-[#d4af37]/30 bg-neutral-900/30 ${isOpen ? 'border-[#d4af37]/30' : 'border-neutral-800'}`}>
      <button 
        onClick={onToggle}
        className="w-full py-5 px-8 text-left flex justify-between items-center group bg-neutral-900/50"
      >
        <h3 className={`font-semibold transition-colors pr-4 ${isOpen ? 'text-[#d4af37]' : 'text-gray-200 group-hover:text-[#d4af37]'}`}>{q}</h3>
        <ChevronDown className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#d4af37]' : 'text-neutral-500 group-hover:text-[#d4af37]'}`} />
      </button>
      <motion.div 
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden bg-neutral-950/40"
      >
        <div className="px-8 pb-6 pt-2 text-gray-300 text-sm leading-relaxed border-t border-neutral-800/30">
          {a}
        </div>
      </motion.div>
    </div>
  );
}

interface SponsorsClientProps {
  ivSlides: Array<{ name: string; image: any }>;
  faqs: Array<{ question: string; answer: string }>;
  achievements: Array<{ title: string; tag: string; imageSrc: any }>;
  sponsorPageData?: any;
}

const iconMap: Record<string, any> = {
  GraduationCap,
  Network,
  Presentation,
  Sun
};

export default function SponsorsClient({ ivSlides, faqs, achievements, sponsorPageData }: SponsorsClientProps) {
  const [openFAQIndex, setOpenFAQIndex] = React.useState<number | null>(null);
  const [lightboxImg, setLightboxImg] = React.useState<string | null>(null);
  const [ivSlideIndex, setIvSlideIndex] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState("/sponsors");
  const [heroImageError, setHeroImageError] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    { label: "HOME", href: "/" },
    { label: "EVENTS", href: "/events" },
    { label: "BLOGS", href: "/blogs" },
    { label: "ACHIEVEMENTS", href: "/achievements" },
    { label: "BOARD MEMBERS", href: "/board-members" },
    { label: "IMAGE GALLERY", href: "/image-gallery" },
    { label: "SPONSORS", href: "/sponsors" },
  ];

  React.useEffect(() => {
    if (ivSlides.length === 0) return;
    const interval = setInterval(() => {
      setIvSlideIndex((prev) => (prev + 1) % ivSlides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [ivSlides]);

  // Hero Section data fallback
  const heroTitle = sponsorPageData?.heroTitle || "Building Connections Between Industry and Future Engineers";
  const heroDescription = sponsorPageData?.heroDescription || "Partner with VIT Vellore's premier community of engineering talent. We bridge the gap between academia and the renewable energy industry through high-impact technical initiatives.";
  const heroImageSrc = sponsorPageData?.heroImage ? getOptimizedImageUrl(sponsorPageData.heroImage, 1200) : "/sponsar-images/hero.jpg";

  // Who We Are fallback
  const whoTitle = sponsorPageData?.whoTitle || "Who We Are";
  const whoDescription1 = sponsorPageData?.whoDescription1 || "The Solar Energy Society of India (SESI) Student Chapter at VIT Vellore is a community focused on renewable energy, sustainability, engineering innovation, and industry engagement.";
  const whoDescription2 = sponsorPageData?.whoDescription2 || "Through technical events, workshops, competitions, and collaborative initiatives, we connect students with organizations shaping the future of energy and technology.";
  
  const getWhoImage = (index: number, defaultSrc: string) => {
    if (sponsorPageData?.whoImages && sponsorPageData.whoImages[index]) {
      return getOptimizedImageUrl(sponsorPageData.whoImages[index], 500, 500);
    }
    return defaultSrc;
  };

  // Why Partner With Us fallback
  const defaultWhyCards = [
    { title: "Talent Engagement", desc: "Connect with motivated engineering students interested in technology, sustainability, and innovation.", icon: GraduationCap },
    { title: "Industry Presence", desc: "Build visibility within a focused technical community through events and collaborative initiatives.", icon: Network },
    { title: "Technical Outreach", desc: "Share expertise through workshops, sessions, challenges, and industry interactions.", icon: Presentation },
    { title: "Sustainability Leadership", desc: "Support renewable energy awareness and innovation-driven activities.", icon: Sun }
  ];

  const getWhyCards = () => {
    if (sponsorPageData?.whyCards && sponsorPageData.whyCards.length > 0) {
      return sponsorPageData.whyCards.map((card: any, idx: number) => {
        const IconComp = iconMap[card.icon] || defaultWhyCards[idx]?.icon || Sun;
        return {
          title: card.title || defaultWhyCards[idx]?.title || "",
          desc: card.desc || defaultWhyCards[idx]?.desc || "",
          icon: IconComp
        };
      });
    }
    return defaultWhyCards;
  };
  const whyCardsData = getWhyCards();

  // Achievements text fallback
  const achievementsTitle = sponsorPageData?.achievementsTitle || "Achievements";
  const achievementsDescription = sponsorPageData?.achievementsDescription || (
    <>
      Our chapter has been honoured with the{" "}
      <span
        className="font-bold"
        style={{
          background: "linear-gradient(to right, #c084fc, #e879f9, #f0abfc)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: "drop-shadow(0 0 8px rgba(192,132,252,0.7)) drop-shadow(0 0 20px rgba(232,121,249,0.4))",
        }}
      >Best Chapter Award</span>{" "}
      for two consecutive years —{" "}
      <span className="text-[#14b8a6] font-semibold">2024–2025</span> and{" "}
      <span className="text-[#14b8a6] font-semibold">2025–2026</span> — reflecting our
      deep-rooted dedication to advancing sustainable energy, driving engineering
      excellence, and building a community that actively shapes the future of
      renewables.
    </>
  );

  // Partnership Opportunities fallback
  const defaultPartnerships = [
    { title: "Event Partnerships", desc: "Brand visibility through technical events and student initiatives.", img: "/sponsar-images/offer-events.jpg" },
    { title: "Industry Collaborations", desc: "Workshops, expert talks, technical sessions, and knowledge sharing.", img: "/sponsar-images/offer-collab.jpg" },
    { title: "Talent Engagement", desc: "Internships, recruitment branding, and student interaction opportunities.", img: "/sponsar-images/offer-talent.jpg" },
    { title: "Innovation Programs", desc: "Hackathons, competitions, project showcases, and technical challenges.", img: "/sponsar-images/offer-innovation.jpg" }
  ];

  const getPartnerships = () => {
    if (sponsorPageData?.partnerships && sponsorPageData.partnerships.length > 0) {
      return sponsorPageData.partnerships.map((item: any, i: number) => ({
        title: item.title || defaultPartnerships[i]?.title || "",
        desc: item.desc || defaultPartnerships[i]?.desc || "",
        img: item.image ? getOptimizedImageUrl(item.image, 600, 400) : defaultPartnerships[i]?.img
      }));
    }
    return defaultPartnerships;
  };
  const partnershipsData = getPartnerships();

  // Community Impact Stats fallback
  const defaultImpactStats = [
    { value: "86", label: "Events Conducted" },
    { value: "1500+", label: "Students Engaged" },
    { value: "20+", label: "Industry Sessions" },
    { value: "18", label: "Collaborative Initiatives" }
  ];

  const getImpactStats = () => {
    if (sponsorPageData?.impactStats && sponsorPageData.impactStats.length > 0) {
      return sponsorPageData.impactStats.map((stat: any, i: number) => ({
        value: stat.value || defaultImpactStats[i]?.value || "",
        label: stat.label || defaultImpactStats[i]?.label || ""
      }));
    }
    return defaultImpactStats;
  };
  const impactStatsData = getImpactStats();

  // Ways to Collaborate Table fallback
  const defaultFeatures = [
    "Brand Visibility", 
    "Dedicated segment in stall during Expo", 
    "Dedicated media reels and posts", 
    "Partnership Certificates", 
    "Outreach projects showcase", 
    "Special expert talks at VIT", 
    "Direct recruitment & talent pool access",
    "Co-branded technical hackathons",
    "Exclusive Student Chapter Integration"
  ];

  const getCollaborations = () => {
    if (sponsorPageData?.collaborations && sponsorPageData.collaborations.length > 0) {
      return sponsorPageData.collaborations.map((row: any) => ({
        feature: row.feature || "",
        eventPartner: row.eventPartner ?? false,
        industryPartner: row.industryPartner ?? false,
        renewablePartner: row.renewablePartner ?? false
      }));
    }
    return null;
  };
  const collaborationsData = getCollaborations();

  // Industrial Visits text fallback
  const industrialVisitsTitle = sponsorPageData?.industrialVisitsTitle || "Our Industrial Visits";
  const industrialVisitsDescription = sponsorPageData?.industrialVisitsDescription || "We believe in bridging the gap between academia and industry. Our chapter organizes regular industrial visits to major engineering and technology hubs like Amphenol and URSC Bangalore. These visits provide our members with invaluable hands-on exposure to cutting-edge manufacturing, research, and sustainable energy practices.";

  // Gallery Highlights fallback
  const defaultGallery = [
    { img: "/sponsar-images/gallery-1.jpg", h: "h-48 md:h-64" },
    { img: "/sponsar-images/gallery-2.jpg", h: "h-64 md:h-96" },
    { img: "/sponsar-images/gallery-3.png", h: "h-48 md:h-64" },
    { img: "/sponsar-images/gallery-4.jpg", h: "h-64 md:h-96" },
    { img: "/sponsar-images/gallery-5.jpg", h: "h-48 md:h-64" },
    { img: "/sponsar-images/gallery-6.jpg", h: "h-48 md:h-64" }
  ];

  const getGallery = () => {
    if (sponsorPageData?.galleryImages && sponsorPageData.galleryImages.length > 0) {
      return sponsorPageData.galleryImages.map((img: any, i: number) => ({
        img: getOptimizedImageUrl(img, 600),
        h: defaultGallery[i]?.h || "h-48 md:h-64"
      }));
    }
    return defaultGallery;
  };
  const galleryData = getGallery();

  // Partnership Impact Metrics fallback
  const defaultMetrics = [
    { 
      title: "Core Member Career Focus", 
      value: "92%", 
      desc: "of our graduating members actively transition into renewable energy and core engineering roles.",
      detail: "High-concentration of specialized engineering talent."
    },
    { 
      title: "EEE STUDENT ENGAGEMENT", 
      value: "68%", 
      desc: "of the Electrical Engineering student body at VIT Vellore interacts with SESI initiatives annually.",
      detail: "Targeted brand penetration within the core engineering department."
    },
    { 
      title: "Project Success Rate", 
      value: "100%", 
      desc: "of our industry-collaborated technical projects reach successful completion or prototype stage.",
      detail: "Guaranteed outcomes for technical R&D partnerships."
    }
  ];

  const getMetrics = () => {
    if (sponsorPageData?.impactMetrics && sponsorPageData.impactMetrics.length > 0) {
      return sponsorPageData.impactMetrics.map((metric: any, i: number) => ({
        title: metric.title || defaultMetrics[i]?.title || "",
        value: metric.value || defaultMetrics[i]?.value || "",
        desc: metric.desc || defaultMetrics[i]?.desc || "",
        detail: metric.detail || defaultMetrics[i]?.detail || ""
      }));
    }
    return defaultMetrics;
  };
  const metricsData = getMetrics();

  const defaultSponsoredEvents = [
    {
      eventTitle: "Renewable Tech Hackathon",
      sponsorName: "GreenTech Corp",
      description: "GreenTech Corp sponsored our 24-hour hackathon, offering mentorship and cash prizes for innovative student solar tracker designs.",
      eventImage: "/sponsar-images/gallery-1.jpg",
      sponsorLogo: "/sponsar-images/partner-1.jpg",
    },
    {
      eventTitle: "Annual Solar Innovation Summit",
      sponsorName: "CleanEnergy Ltd",
      description: "CleanEnergy Ltd partnered with us for a keynote-driven summit covering advanced photovoltaics and local grid load balance solutions.",
      eventImage: "/sponsar-images/gallery-2.jpg",
      sponsorLogo: "/sponsar-images/partner-2.jpg",
    }
  ];

  const getSponsoredEvents = () => {
    if (sponsorPageData?.sponsoredEvents && sponsorPageData.sponsoredEvents.length > 0) {
      return sponsorPageData.sponsoredEvents.map((item: any) => ({
        eventTitle: item.eventTitle || "",
        sponsorName: item.sponsorName || "",
        description: item.description || "",
        eventImage: item.eventImage ? getOptimizedImageUrl(item.eventImage, 800, 450) : "/sponsar-images/gallery-1.jpg",
        sponsorLogo: item.sponsorLogo ? getOptimizedImageUrl(item.sponsorLogo, 150, 150) : "/sponsar-images/partner-1.jpg",
      }));
    }
    return defaultSponsoredEvents;
  };
  const sponsoredEventsData = getSponsoredEvents();

  // Contact section fallback
  const contactTitle = sponsorPageData?.contactTitle || "Let's Build Something Meaningful Together";
  const contactDescription = sponsorPageData?.contactDescription || "Interested in collaborating with SESI? We would love to explore opportunities for industry engagement, technical initiatives, sustainability programs, and student development.";
  const pocName = sponsorPageData?.pocName || "Partnership POC";
  const pocEmail = sponsorPageData?.pocEmail || "thilipan.m2023@vitstudent.ac.in";
  const pocPhone = sponsorPageData?.pocPhone || "+91 7305499052";
  const pocLinkedin = sponsorPageData?.pocLinkedin || "https://www.linkedin.com/in/thilipan-murugesan/";

  return (
    <main className="min-h-screen bg-transparent md:bg-[#050505] text-[#ededed] font-sans relative overflow-x-hidden">
      <PillNav 
        items={navItems} 
        activeHref={activeTab} 
        setActiveHref={setActiveTab} 
      />
      <div className="fixed inset-0 z-0 pointer-events-none">
        <SponsarLightfall
          colors={isMobile ? ['#EAB308', '#EAB308', '#EAB308'] : LIGHTFALL_COLORS}
          backgroundColor="#EAB308"
          streakWidth={0.9}
          streakCount={1}
          backgroundGlow={isMobile ? 2.6 : 1.4}
          density={0.3}
          glow={isMobile ? 1.6 : 1.0}
          mouseRadius={isMobile ? 0.5 : 1.0}
        />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION - SPONSORED EVENTS SHOWCASE (Temporarily disabled) */}
        {false && (
        <section className="pt-32 pb-20 border-b border-[#d4af37]/20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 uppercase tracking-wider text-gradient-gold heading-readable">
              Sponsor Spotlights
            </h2>
            <p className="text-gray-400 text-lg">
              Showcasing the high-impact events and technical initiatives made possible by our industry partners.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10">
            {sponsoredEventsData.map((item: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="bg-neutral-900/30 border border-neutral-800/80 rounded-[2rem] overflow-hidden hover:border-[#d4af37]/30 transition-all duration-300 group shadow-lg"
              >
                {/* Event Image Container */}
                <div className="relative aspect-video w-full overflow-hidden bg-neutral-950">
                  <img
                    src={item.eventImage}
                    alt={item.eventTitle}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                  
                  {/* Sponsoring Company Logo (Badge overlay) */}
                  <div className="absolute bottom-4 right-4 flex items-center gap-3 bg-black/80 backdrop-blur-md border border-[#d4af37]/30 px-4 py-2 rounded-full shadow-lg">
                    <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 bg-white p-0.5">
                      <img
                        src={item.sponsorLogo}
                        alt={item.sponsorName}
                        className="w-full h-full object-contain rounded-full"
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-200 uppercase tracking-wider">
                      {item.sponsorName}
                    </span>
                  </div>
                </div>

                {/* Text Content */}
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-[#d4af37]/10 text-[#d4af37] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-[#d4af37]/20">
                      SPONSORED EVENT
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#d4af37] transition-colors">
                    {item.eventTitle}
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-sm">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
        )}

        {/* SECTION 1 - HERO */}
        <section className="pt-32 pb-20 border-b border-[#d4af37]/20 relative">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold tracking-tight mb-6 uppercase text-gradient-gold heading-readable"
            >
              {heroTitle}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed font-medium max-w-3xl mx-auto"
            >
              {heroDescription}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-transparent relative overflow-hidden text-black px-8 py-3 rounded-full uppercase font-bold tracking-wider flex items-center justify-center gap-2 btn-fill-anim before:bg-white cursor-pointer"
                style={{ backgroundColor: '#d4af37' }}
              >
                Become a Partner <ArrowRight size={18} />
              </button>
              <a 
                href="/SESIBROCHURE.pdf"
                download="SESIBROCHURE.pdf"
                className="border border-[#d4af37] text-[#d4af37] px-8 py-3 rounded-full uppercase font-bold tracking-wider flex items-center justify-center gap-2 transition-all duration-300 hover:bg-[#d4af37] hover:text-black hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:scale-105 active:scale-98 cursor-pointer"
              >
                Download Partnership Brochure <Download size={18} />
              </a>
            </motion.div>
          </div>

          {/* Hero Visual Placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-16 border-2 border-[#d4af37] rounded-lg p-2 max-w-5xl mx-auto shadow-[0_0_30px_rgba(212,175,55,0.15)] bg-black/50 backdrop-blur-sm overflow-hidden"
          >
            <div className="aspect-video bg-neutral-900 rounded overflow-hidden relative">
              {!heroImageError ? (
                <img 
                  src={heroImageSrc} 
                  alt="Industry and Student Connection" 
                  className="w-full h-full object-cover"
                  onError={() => setHeroImageError(true)}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <svg className="text-[#d4af37] mb-4 opacity-50" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                  <p className="text-xl font-bold text-[#d4af37] uppercase tracking-widest">HERO IMAGE</p>
                  <p className="text-gray-400 mt-2">Place hero.jpg in public/sponsar-images/</p>
                </div>
              )}
            </div>
          </motion.div>

        </section>

        {/* SECTION 2 - WHO WE ARE */}
        <section className="py-24 border-b border-[#d4af37]/20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 uppercase tracking-wider text-gradient-gold heading-readable">{whoTitle}</h2>
              <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                <p>
                  {whoDescription1}
                </p>
                <p>
                  {whoDescription2}
                </p>
              </div>
            </motion.div>
            <motion.div 
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="border border-[#14b8a6]/30 bg-neutral-900 rounded-2xl aspect-square overflow-hidden relative">
                <img src={getWhoImage(0, "/sponsar-images/who-workshop.jpg")} alt="SESI VIT Solar Energy Workshop" className="w-full h-full object-cover" />
              </div>
              <div className="border border-[#14b8a6]/30 bg-neutral-900 rounded-2xl aspect-square mt-8 overflow-hidden relative">
                <img src={getWhoImage(1, "/sponsar-images/who-event.jpg")} alt="SESI Student Chapter Technical Event" className="w-full h-full object-cover" />
              </div>
              <div className="border border-[#14b8a6]/30 bg-neutral-900 rounded-2xl aspect-square -mt-8 overflow-hidden relative">
                <img src={getWhoImage(2, "/sponsar-images/who-team.jpg")} alt="SESI VIT Chapter Team Members" className="w-full h-full object-cover" />
              </div>
              <div className="border border-[#14b8a6]/30 bg-neutral-900 rounded-2xl aspect-square overflow-hidden relative">
                <img src={getWhoImage(3, "/sponsar-images/who-industry.jpg")} alt="SESI VIT Solar Industry Training Session" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 3 - WHY PARTNER WITH SESI */}
        <section className="py-24 border-b border-[#d4af37]/20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12 text-center uppercase tracking-wider text-gradient-gold heading-readable"
          >
            Why Organizations Partner With Us
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyCardsData.map((item: any, i: number) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-neutral-900/30 backdrop-blur-xl border border-neutral-800/50 p-8 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:border-[#d4af37]/50 transition-all group"
              >
                <item.icon size={36} className="text-[#d4af37] mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-4 uppercase tracking-wide">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTION 3.5 - ACHIEVEMENTS */}
        <section className="py-24 border-b border-[#d4af37]/20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="flex justify-center mb-6">
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.2 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-[#f5d061] to-[#d4af37] flex items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.4)]"
              >
                <Award size={40} className="text-black" />
              </motion.div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 uppercase tracking-wider text-gradient-gold heading-readable">
              {achievementsTitle}
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {achievementsDescription}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {achievements.map((cert, i) => {
              const imgUrl = getOptimizedImageUrl(cert.imageSrc, 800);
              // Deduce year from title
              const yearText = cert.title.includes('2024-25') || cert.title.includes('2024') 
                ? '2024–2025' 
                : '2025–2026';

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                  className="group relative cursor-pointer"
                  onClick={() => setLightboxImg(imgUrl)}
                >
                  {/* Glow ring behind the card */}
                  <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-[#f5d061]/40 via-[#d4af37]/20 to-[#14b8a6]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />

                  <div className="relative bg-neutral-900/70 backdrop-blur-md border border-neutral-800 rounded-2xl overflow-hidden transition-all duration-500 group-hover:border-[#d4af37]/60 group-hover:shadow-[0_0_40px_rgba(212,175,55,0.15)]">
                    {/* Certificate Image */}
                    <div className="overflow-hidden">
                      <img
                        src={imgUrl}
                        alt={`Best Chapter Award Certificate ${yearText}`}
                        className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    </div>

                    {/* Label bar */}
                    <div className="p-5 border-t border-neutral-800/60 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Award size={20} className="text-[#d4af37]" />
                        <span className="font-bold text-sm uppercase tracking-widest text-gray-200">
                          {cert.tag}
                        </span>
                      </div>
                      <span className="text-[#14b8a6] font-mono font-bold text-sm tracking-wide">
                        {yearText}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {lightboxImg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md cursor-pointer"
              onClick={() => setLightboxImg(null)}
            >
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: 0.1 }}
                className="absolute top-6 right-6 w-12 h-12 rounded-full border border-neutral-700 bg-neutral-900/80 flex items-center justify-center text-gray-300 hover:text-white hover:border-[#d4af37] transition-colors z-[110] cursor-pointer"
                onClick={(e) => { e.stopPropagation(); setLightboxImg(null); }}
              >
                <X size={24} />
              </motion.button>
              <motion.img
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                src={lightboxImg}
                alt="Certificate Full View"
                className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-[0_0_60px_rgba(212,175,55,0.2)]"
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* SECTION 4 - WHAT WE OFFER */}
        <section className="py-24 border-b border-[#d4af37]/20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12 text-center uppercase tracking-wider text-gradient-gold heading-readable"
          >
            Partnership Opportunities
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-8">
            {partnershipsData.map((item: any, i: number) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col md:flex-row bg-neutral-900/30 backdrop-blur-xl border border-neutral-800/50 rounded-[2rem] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] group hover:border-[#14b8a6]/50 transition-all"
              >
                <div className="w-full md:w-1/3 bg-neutral-800 overflow-hidden relative min-h-[150px]">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-8 w-full md:w-2/3 flex flex-col justify-center">
                  <h3 className="text-xl font-bold mb-2 uppercase text-[#14b8a6]">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTION 5 - IMPACT SECTION */}
        <section className="py-24 border-b border-[#d4af37]/20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12 text-center uppercase tracking-wider text-gradient-gold heading-readable"
          >
            Community Impact
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {impactStatsData.map((stat: any, i: number) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100, delay: i * 0.1 }}
                className="text-center bg-neutral-900/30 backdrop-blur-xl border border-neutral-800/50 rounded-[2rem] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:border-[#d4af37]/50 transition-all"
              >
                <div className="text-5xl md:text-6xl font-bold text-[#d4af37] mb-4 font-mono tracking-tighter">{stat.value}</div>
                <div className="text-gray-400 uppercase tracking-widest text-sm font-semibold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTION 6 - PARTNERSHIP TYPES */}
        <section className="py-24 border-b border-[#d4af37]/20 overflow-x-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12 text-center uppercase tracking-wider text-gradient-gold heading-readable"
          >
            Ways to Collaborate
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="min-w-[800px] bg-neutral-900/60 backdrop-blur-xl border border-[#d4af37]/30 rounded-[2rem] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
          >
            <div className="grid grid-cols-4 gap-4 mb-4 border-b border-[#d4af37]/50 pb-4 font-bold text-sm uppercase tracking-wider items-end">
              <div className="col-span-1 text-gray-400">Features</div>
              <div className="text-center text-[#14b8a6]">Event Partner</div>
              <div className="text-center text-[#14b8a6]">Industry Partner</div>
              <div className="text-center text-[#d4af37]">Renewable Energy Partner<br/><span className="text-xs text-[#d4af37]/70">(Year-Long)</span></div>
            </div>
            {collaborationsData ? (
              collaborationsData.map((row: any, i: number, arr: any[]) => (
                <div key={i} className={`grid grid-cols-4 gap-4 py-6 items-center hover:bg-white/5 transition-colors rounded-lg px-2 ${i !== arr.length - 1 ? 'border-b border-neutral-800/50' : ''}`}>
                  <div className="col-span-1 text-gray-300 pr-4">{row.feature}</div>
                  <div className="flex justify-center">
                    {row.eventPartner ? <CheckCircle2 className="text-[#14b8a6]" /> : <CheckCircle2 className="text-red-500" />}
                  </div>
                  <div className="flex justify-center">
                    {row.industryPartner ? <CheckCircle2 className="text-[#14b8a6]" /> : <CheckCircle2 className="text-red-500" />}
                  </div>
                  <div className="flex justify-center">
                    {row.renewablePartner ? <CheckCircle2 className="text-[#d4af37]" /> : <CheckCircle2 className="text-red-500" />}
                  </div>
                </div>
              ))
            ) : (
              defaultFeatures.map((feature, i, arr) => (
                <div key={i} className={`grid grid-cols-4 gap-4 py-6 items-center hover:bg-white/5 transition-colors rounded-lg px-2 ${i !== arr.length - 1 ? 'border-b border-neutral-800/50' : ''}`}>
                  <div className="col-span-1 text-gray-300 pr-4">{feature}</div>
                  <div className="flex justify-center"><CheckCircle2 className={i <= 3 ? "text-[#14b8a6]" : "text-red-500"} /></div>
                  <div className="flex justify-center"><CheckCircle2 className={i <= 6 ? "text-[#14b8a6]" : "text-red-500"} /></div>
                  <div className="flex justify-center"><CheckCircle2 className="text-[#d4af37]" /></div>
                </div>
              ))
            )}
          </motion.div>
        </section>

        {/* SECTION 6.8 - INDUSTRIAL VISITS */}
        {ivSlides.length > 0 && (
          <section className="py-24 border-b border-[#d4af37]/20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 uppercase tracking-wider text-gradient-gold heading-readable">
                {industrialVisitsTitle}
              </h2>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                {industrialVisitsDescription}
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-[#d4af37]/30 shadow-[0_0_30px_rgba(212,175,55,0.15)] bg-neutral-900 group">
                <AnimatePresence initial={false}>
                  <motion.img
                    key={ivSlideIndex}
                    src={getOptimizedImageUrl(ivSlides[ivSlideIndex].image, 1000, 562)}
                    alt={`Industrial Visit to ${ivSlides[ivSlideIndex].name}`}
                    initial={{ opacity: 0, scale: 1.15 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      opacity: { duration: 0.8, ease: "easeInOut" },
                      scale: { duration: 3.5, ease: "linear" } 
                    }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>
                
                {/* Overlay with Tag */}
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-between z-10">
                  <div className="bg-[#d4af37]/90 text-black px-4 py-2 rounded-full font-bold uppercase tracking-wider text-sm shadow-lg backdrop-blur-sm">
                    {ivSlides[ivSlideIndex].name}
                  </div>
                  
                  {/* Dots indicator */}
                  <div className="flex gap-2">
                    {ivSlides.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setIvSlideIndex(i)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                          i === ivSlideIndex ? "bg-[#d4af37] w-6" : "bg-white/40 hover:bg-white/60"
                        }`}
                        aria-label={`Go to slide ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 7 - GALLERY */}
        <section className="py-24 border-b border-[#d4af37]/20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12 text-center uppercase tracking-wider text-gradient-gold heading-readable"
          >
            Highlights From Our Activities
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryData.map((item: any, i: number) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`bg-neutral-900/30 backdrop-blur-xl border border-neutral-800/50 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden group relative ${item.h}`}
              >
                <img 
                  src={item.img} 
                  alt={`SESI VIT Gallery Highlight ${i + 1}`} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTION 8 - PARTNERSHIP IMPACT METRICS */}
        <section className="py-24 border-b border-[#d4af37]/20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12 text-center uppercase tracking-wider text-gradient-gold heading-readable"
          >
            Partnership Impact Metrics
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {metricsData.map((metric: any, i: number) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-neutral-900/30 backdrop-blur-xl border border-neutral-800/50 p-8 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:border-[#14b8a6]/50 transition-all group"
              >
                <div className="text-4xl font-bold text-[#d4af37] mb-2">{metric.value}</div>
                <h3 className="text-xl font-bold mb-4 uppercase text-[#14b8a6]">{metric.title}</h3>
                <p className="text-gray-300 mb-6 text-sm">{metric.desc}</p>
                <div className="pt-6 border-t border-neutral-800 text-xs text-neutral-500 uppercase tracking-widest font-semibold group-hover:text-[#d4af37] transition-colors">
                  {metric.detail}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTION 9 - FAQ */}
        {faqs.length > 0 && (
          <section className="py-24 border-b border-[#d4af37]/20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-12 text-center uppercase tracking-wider text-gradient-gold heading-readable"
            >
              Frequently Asked Questions
            </motion.h2>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto space-y-4"
            >
              {faqs.map((faq, i) => (
                <FAQItem 
                  key={i} 
                  q={faq.question} 
                  a={faq.answer} 
                  isOpen={openFAQIndex === i}
                  onToggle={() => setOpenFAQIndex(openFAQIndex === i ? null : i)}
                />
              ))}
            </motion.div>
          </section>
        )}

        {/* SECTION 10 - CONTACT */}
        <section id="contact" className="py-24 text-center max-w-4xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-8 uppercase tracking-wider text-gradient-gold heading-readable"
          >
            {contactTitle}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 mb-12"
          >
            {contactDescription}
          </motion.p>
          
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center mb-12">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-neutral-900/40 backdrop-blur-xl border border-[#d4af37]/30 p-8 rounded-[2rem] w-full max-w-md shadow-[0_8px_32px_rgba(212,175,55,0.15)]"
            >
              <h3 className="text-2xl font-bold mb-6 uppercase text-[#14b8a6]">{pocName}</h3>
              <div className="space-y-4 text-left">
                <p className="text-gray-400 border-b border-neutral-800 pb-2">
                  <span className="text-neutral-500 mr-2">Email</span> 
                  <a href={`mailto:${pocEmail}`} className="hover:text-[#d4af37] transition-colors">{pocEmail}</a>
                </p>
                <p className="text-gray-400 border-b border-neutral-800 pb-2">
                  <span className="text-neutral-500 mr-2">Phone</span> 
                  <a href={`tel:${pocPhone}`} className="hover:text-[#d4af37] transition-colors">{pocPhone}</a>
                </p>
                <p className="text-gray-400">
                  <span className="text-neutral-500 mr-2">LinkedIn</span> 
                  <a href={pocLinkedin.startsWith('http') ? pocLinkedin : `https://${pocLinkedin}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#d4af37] transition-colors">{pocLinkedin.replace('https://www.linkedin.com/in/', '').replace('https://linkedin.com/in/', '').replace(/\/$/, '')}</a>
                </p>
              </div>
            </motion.div>
          </div>
          
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            onClick={() => window.location.href = `mailto:${pocEmail}`}
            className="bg-transparent relative overflow-hidden text-black px-10 py-4 rounded-full uppercase font-bold tracking-widest text-lg shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-shadow btn-fill-anim before:bg-white cursor-pointer"
            style={{ backgroundColor: '#d4af37' }}
          >
            Contact {pocName}
          </motion.button>
        </section>

      </div>

      {/* SECTION 11 - FOOTER BAR */}
      <SponsarFooter />
    </main>
  );
}
