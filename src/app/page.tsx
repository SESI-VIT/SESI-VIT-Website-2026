'use client';
// Vercel deployment trigger
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import PillNav from '@/components/PillNav';
import HeroSequence from '@/components/HeroSequence';
const SolarSystem = dynamic(() => import('@/components/SolarSystem'), { ssr: false });
import Footer from '@/components/Footer';

export default function Home() {
  const [activeTab, setActiveTab] = useState("/");

  const navItems = [
    { label: "HOME", href: "/" },
    { label: "EVENTS", href: "/events" },
    { label: "BLOGS", href: "/blogs" },
    { label: "ACHIEVEMENTS", href: "/achievements" },
    { label: "BOARD MEMBERS", href: "/board-members" },
    { label: "IMAGE GALLERY", href: "/image-gallery" },
    { label: "SPONSORS", href: "/sponsors" },
  ];

  useEffect(() => {
    // 1. Mouse Tracking Glow for Glass Cards
    const cards = document.querySelectorAll('.glass-card');
    const handleMouseMove = (e: Event) => {
      const card = e.currentTarget as HTMLElement;
      const mouseEvent = e as unknown as MouseEvent;
      const rect = card.getBoundingClientRect();
      const x = mouseEvent.clientX - rect.left;
      const y = mouseEvent.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    };

    cards.forEach(card => {
      card.addEventListener('mousemove', handleMouseMove);
    });

    // 2. Intersection Observer for Scroll Reveals & Lines
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
      const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
      };

      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      document.querySelectorAll('.scroll-reveal, .anim-line-v, .anim-line-h').forEach(el => {
        revealObserver.observe(el);
      });
    }

    // 3. Carousel logic
    let currentSlide = 0;
    const slides = document.querySelectorAll('.quote-slide');
    const rotateSlides = () => {
      if (slides.length === 0) return;
      slides.forEach(s => s.classList.remove('active'));
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    };
    const interval = setInterval(rotateSlides, 5000);

    return () => {
      cards.forEach(card => card.removeEventListener('mousemove', handleMouseMove));
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <PillNav
        items={navItems}
        activeHref={activeTab}
        setActiveHref={setActiveTab}
      />

      {/* Nebula Overlays globally */}
      <div className="fixed inset-0 pointer-events-none z-0 nebula-cloud-1"></div>
      <div className="fixed inset-0 pointer-events-none z-0 nebula-cloud-2"></div>
      <div className="fixed inset-0 pointer-events-none z-0 nebula-cloud-3"></div>

      <HeroSequence />
      <SolarSystem />

      {/* About / Stats Section */}
      <section className="py-32 relative z-10 bg-black/20" id="mission">
        <div className="max-w-[1440px] mx-auto px-4 md:px-[64px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Text Content */}
            <div className="space-y-8 scroll-reveal">
              <div className="max-w-xl p-6 md:p-8 rounded-[2.5rem] shadow-2xl glass-card">
                <h2 className="text-3xl md:text-4xl font-extrabold mt-2 mb-4 bg-gradient-to-r from-white via-amber-400 to-orange-500 bg-clip-text text-transparent">
                  Core Vision
                </h2>
                <p className="text-slate-200 text-lg leading-relaxed mb-6">
                  At SESI, our vision is to foster a community of innovators dedicated to advancing sustainable energy solutions. We strive to empower students through hands-on learning, groundbreaking projects, and industry connections, shaping the future of renewable technology.
                </p>
              </div>
            </div>
            {/* Board Members Group Photo */}
            <div className="flex flex-col justify-center items-center scroll-reveal delay-100 h-full w-full">
              <div className="text-center mb-6 w-full">
                <h4 className="font-headline-lg text-3xl md:text-4xl text-amber-400 font-extrabold mb-2 drop-shadow-md">Board Members</h4>
                <p className="font-label-sm text-[14px] text-orange-500 font-bold uppercase tracking-widest drop-shadow-md">SESI VIT Chapter</p>
              </div>
              <div className="glass-card rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl relative w-full group border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/IMG_0349.JPG.jpeg"
                  alt="Board Members Group Photo"
                  className="w-full h-auto block transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 relative z-10 bg-black/20 overflow-hidden" id="solar-wisdom">
        <div className="max-w-[1440px] mx-auto px-4 md:px-[64px] text-center relative z-10 scroll-reveal">
          <h3 className="font-headline-xl uppercase tracking-wider text-[48px] bg-gradient-to-r from-white via-amber-400 to-orange-500 bg-clip-text text-transparent font-extrabold mb-6 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]">Solar Wisdom</h3>
          <p className="font-body-md text-[16px] text-slate-200 max-w-3xl mx-auto text-lg mb-12">
            The core philosophy of our chapter is driven by the limitless energy of the cosmos. We believe that by harnessing the fundamental laws of nature, we can engineer a sustainable tomorrow. Let these principles guide your journey.
          </p>

          {/* Quotes Carousel Card */}
          <div className="glass-card max-w-4xl mx-auto p-6 md:p-16 rounded-[3rem] shadow-2xl mb-16">
            <div className="quote-container h-[250px] relative">
              {/* Quote 1 */}
              <div className="quote-slide active absolute w-full top-1/2 -translate-y-1/2 left-0 transition-opacity duration-1000">
                <p className="font-headline-lg text-2xl md:text-[64px] quote-text mb-6 leading-tight">
                  "The sun does not shine for a few trees and flowers, but for the wide world's joy."
                </p>
                <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto mt-6"></div>
              </div>
              {/* Quote 2 */}
              <div className="quote-slide absolute w-full top-1/2 -translate-y-1/2 left-0 opacity-0 transition-opacity duration-1000">
                <p className="font-headline-lg text-2xl md:text-[64px] quote-text mb-6 leading-tight">
                  "Innovation is the flare that lights the path to the stars."
                </p>
                <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto mt-6"></div>
              </div>
              {/* Quote 3 */}
              <div className="quote-slide absolute w-full top-1/2 -translate-y-1/2 left-0 opacity-0 transition-opacity duration-1000">
                <p className="font-headline-lg text-2xl md:text-[64px] quote-text mb-6 leading-tight">
                  "Engineering the future under the heat of a thousand dreams."
                </p>
                <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto mt-6"></div>
              </div>
            </div>
          </div>

          {/* Principle Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mt-8">
            <div className="glass-card p-6 md:p-10 rounded-[2.5rem] group hover:-translate-y-2 transition-transform duration-300">
              <span className="material-symbols-outlined text-3xl md:text-4xl text-amber-500 mb-6 block group-hover:scale-110 transition-transform drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]">history_edu</span>
              <h4 className="font-headline-lg text-[32px] text-amber-400 font-extrabold mb-4 text-2xl">History of SESI India</h4>
              <p className="font-body-md text-slate-300 text-base leading-relaxed">
                The Solar Energy Society of India (SESI) has been at the forefront of renewable energy advocacy since its inception. It has played a pivotal role in shaping solar policies, organizing national conventions, and bringing together researchers, industries, and students to build a sustainable and energy-independent India.
              </p>
            </div>

            <div className="glass-card p-6 md:p-10 rounded-[2.5rem] group hover:-translate-y-2 transition-transform duration-300">
              <span className="material-symbols-outlined text-3xl md:text-4xl text-amber-500 mb-6 block group-hover:scale-110 transition-transform drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]">emoji_events</span>
              <h4 className="font-headline-lg text-[32px] text-amber-400 font-extrabold mb-4 text-2xl">SESI in VIT</h4>
              <p className="font-body-md text-slate-300 text-base leading-relaxed">
                SESI VIT is a premier technical chapter dedicated to clean energy. We have successfully organized 20+ annual events, 5+ major workshops, and multiple outreach drives, achieving numerous accolades for our innovative approach towards student development and sustainability.
              </p>
            </div>

            <div className="glass-card p-6 md:p-10 rounded-[2.5rem] group hover:-translate-y-2 transition-transform duration-300">
              <span className="material-symbols-outlined text-3xl md:text-4xl text-amber-500 mb-6 block group-hover:scale-110 transition-transform drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]">workspaces</span>
              <h4 className="font-headline-lg text-[32px] text-amber-400 font-extrabold mb-4 text-2xl">Work Environment</h4>
              <p className="font-body-md text-slate-300 text-base leading-relaxed">
                At SESI, you will experience a dynamic and collaborative work environment. Members gain hands-on experience with real-world projects, learn industry-standard skills, and cultivate leadership qualities while working alongside passionate peers and expert mentors.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Timeline Section (Star Path) */}
      <section className="py-32 relative z-10 bg-black/20" id="timeline">
        <div className="max-w-[1440px] mx-auto px-4 md:px-[64px]">
          <div className="text-center mb-20 scroll-reveal">
            <h3 className="font-headline-xl uppercase tracking-wider text-[48px] bg-gradient-to-r from-white via-amber-400 to-orange-500 bg-clip-text text-transparent font-extrabold mb-6 ">Mission Logs</h3>
            <p className="font-body-md text-[16px] text-slate-300 max-w-2xl mx-auto text-lg">Exploring real-world energy infrastructure and learning from industry leaders.</p>
          </div>
          {/* Horizontal Star Path */}
          <div className="relative w-full overflow-x-auto pb-24 pt-24 hide-scrollbar snap-x snap-mandatory scroll-smooth flex items-center">
            {/* Soft glow path line */}
            <div className="absolute top-1/2 left-0 w-[200%] md:w-full h-[2px] bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent -translate-y-1/2 z-0 shadow-[0_0_20px_rgba(234,179,8,0.3)]"></div>
            <div className="flex gap-8 md:gap-16 px-6 md:px-20 min-w-max mx-auto relative z-10 items-center">
              {/* Timeline Item 1 */}
              <div className="relative w-[280px] md:w-[350px] snap-center scroll-reveal group">
                <div className="absolute left-1/2 -top-[3.5rem] transform -translate-x-1/2 w-6 h-6 rounded-full bg-amber-500 border-4 border-black shadow-[0_0_25px_rgba(249,115,22,0.8)] z-10 group-hover:scale-125 transition-transform duration-300"></div>
                <div className="absolute left-1/2 -top-[3.5rem] transform -translate-x-1/2 w-[2px] h-[3.5rem] bg-gradient-to-b from-amber-500/50 to-transparent"></div>
                <div className="glass-card p-6 md:p-8 rounded-[2.5rem] mt-12 text-center">
                  <span className="font-label-sm text-[12px] text-orange-500 font-bold uppercase tracking-[0.2em] block mb-3">Automobile</span>
                  <h4 className="font-headline-lg-mobile text-[24px] text-amber-400 font-extrabold mb-3">Amphenol, Chennai</h4>
                  <p className="font-body-md text-[16px] text-slate-300 text-sm">An industrial visit to Amphenol Automobile company in Chennai, exploring advanced automotive electronics and manufacturing processes.</p>
                </div>
              </div>
              {/* Timeline Item 2 */}
              <div className="relative w-[280px] md:w-[350px] snap-center scroll-reveal delay-100 group">
                <div className="absolute left-1/2 -bottom-[3.5rem] transform -translate-x-1/2 w-5 h-5 rounded-full bg-[#22254a] border-4 border-black shadow-[0_0_15px_rgba(234,179,8,0.5)] z-10 group-hover:scale-125 group-hover:bg-amber-500 transition-all duration-300"></div>
                <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 w-[2px] h-[3.5rem] bg-gradient-to-t from-[#22254a]/50 to-transparent"></div>
                <div className="glass-card p-6 md:p-8 rounded-[2.5rem] mb-12 text-center opacity-80 group-hover:opacity-100">
                  <span className="font-label-sm text-[12px] text-orange-500 font-bold uppercase tracking-[0.2em] block mb-3">Space Research</span>
                  <h4 className="font-headline-lg-mobile text-[24px] text-amber-400 font-extrabold mb-3">ISRO, Bengaluru</h4>
                  <p className="font-body-md text-[16px] text-slate-300 text-sm">An inspiring visit to the Space Research Center in Bengaluru, learning about satellite technologies and space missions.</p>
                </div>
              </div>
              {/* Timeline Item 3 */}
              <div className="relative w-[280px] md:w-[350px] snap-center scroll-reveal delay-200 group">
                <div className="absolute left-1/2 -top-[3.5rem] transform -translate-x-1/2 w-6 h-6 rounded-full bg-amber-500 border-4 border-black shadow-[0_0_25px_rgba(249,115,22,0.8)] z-10 group-hover:scale-125 transition-transform duration-300"></div>
                <div className="absolute left-1/2 -top-[3.5rem] transform -translate-x-1/2 w-[2px] h-[3.5rem] bg-gradient-to-b from-amber-500/50 to-transparent"></div>
                <div className="glass-card p-6 md:p-8 rounded-[2.5rem] mt-12 text-center">
                  <span className="font-label-sm text-[12px] text-orange-500 font-bold uppercase tracking-[0.2em] block mb-3">Outreach</span>
                  <h4 className="font-headline-lg-mobile text-[24px] text-amber-400 font-extrabold mb-3">Sunbeam Schools</h4>
                  <p className="font-body-md text-[16px] text-slate-300 text-sm">An engaging outreach event conducted at Sunbeam Schools to promote sustainable energy awareness among students.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
}
