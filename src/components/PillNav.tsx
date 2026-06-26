"use client";

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { gsap } from 'gsap';
import './PillNav.css';

interface NavItem {
  label: string;
  href: string;
  ariaLabel?: string;
}

interface PillNavProps {
  items: NavItem[];
  activeHref: string;
  setActiveHref: (href: string) => void;
  className?: string;
  ease?: string;
}

export default function PillNav({
  items,
  activeHref,
  setActiveHref,
  className = '',
  ease = 'power2.out'
}: PillNavProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const circleRefs = useRef<HTMLSpanElement[]>([]);
  const tlRefs = useRef<gsap.core.Timeline[]>([]);
  const activeTweenRefs = useRef<any[]>([]);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const navItemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const computeLiquidLayout = () => {
      circleRefs.current.forEach((circle) => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;

        if (w === 0 || h === 0) return;

        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`
        });

        const label = pill.querySelector('.pill-label');
        const white = pill.querySelector('.pill-label-hover');

        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        const index = circleRefs.current.indexOf(circle);
        if (index === -1) return;

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });

        tl.to(circle, { scale: 1.25, xPercent: -50, duration: 0.45, ease, overwrite: 'auto' }, 0);

        if (label) {
          tl.to(label, { y: -(h + 8), duration: 0.45, ease, overwrite: 'auto' }, 0);
        }

        if (white) {
          gsap.set(white, { y: Math.ceil(h + 10), opacity: 0 });
          tl.to(white, { y: 0, opacity: 1, duration: 0.45, ease, overwrite: 'auto' }, 0);
        }

        tlRefs.current[index] = tl;
      });
    };

    const timer = setTimeout(computeLiquidLayout, 100);
    window.addEventListener('resize', computeLiquidLayout);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', computeLiquidLayout);
    };
  }, [items, ease]);

  useEffect(() => {
    if (tlRefs.current.length === 0) return;

    items.forEach((item, i) => {
      const tl = tlRefs.current[i];
      if (!tl) return;

      activeTweenRefs.current[i]?.kill();
      activeTweenRefs.current[i] = tl.tweenTo(0, { duration: 0.25, ease, overwrite: 'auto' });
    });
  }, [activeHref, items, ease]);

  const handleMouseEnter = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), { duration: 0.3, ease, overwrite: 'auto' });
  };

  const handleMouseLeave = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, { duration: 0.2, ease, overwrite: 'auto' });
  };

  const handlePillClick = (href: string, label: string) => {
    setActiveHref(href);
  };

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    const menu = mobileMenuRef.current;
    if (menu) {
      if (newState) {
        gsap.set(menu, { visibility: 'visible' });
        gsap.fromTo(menu, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.3 });
      } else {
        gsap.to(menu, { opacity: 0, y: -10, duration: 0.2, onComplete: () => gsap.set(menu, { visibility: 'hidden' }) });
      }
    }
  };

  return (
    <div className="pill-nav-container">
      <nav className={`pill-nav ${className}`} aria-label="Primary">

        <button
          className="pill-logo-btn cursor-pointer outline-none"
          onClick={() => alert("Welcome to SESI VIT Vellore!")}
          aria-label="Home"
        >
          <img
            src="/sesi logo circle.jpeg"
            alt="SESI Logo"
            className="w-[34px] h-[34px] rounded-full object-cover"
          />
          <div className="brand-text-wrapper select-none">
            SESI <span className="brand-yellow">VIT</span>
          </div>
        </button>

        <div className="pill-nav-items desktop-only" ref={navItemsRef}>
          <ul className="pill-list" role="menubar">
            {items.map((item, i) => {
              const isHomeActive = (item.href === '/' || item.href === '/home') && (pathname === '/' || activeHref === '/' || activeHref === '/home');
              const isActive = isHomeActive || (item.href !== '/' && item.href !== '/home' && (activeHref === item.href || pathname === item.href));
              const targetHref = item.href === '/home' ? '/' : item.href;
              const isImplemented = targetHref === '/' || targetHref === '/events' || targetHref === '/blogs' || targetHref === '/achievements' || targetHref === '/board-members' || targetHref === '/image-gallery' || targetHref === '/sponsors';

              return (
                <li key={item.href || `item-${i}`} role="none">
                  <Link
                    href={targetHref}
                    role="menuitem"
                    onClick={(e) => {
                      if (!isImplemented) {
                        e.preventDefault();
                        alert(`${item.label} page is coming soon!`);
                      } else {
                        handlePillClick(item.href, item.label);
                      }
                    }}
                    className={`pill ${isActive ? 'is-active' : ''} whitespace-nowrap cursor-pointer`}
                    onMouseEnter={() => handleMouseEnter(i)}
                    onMouseLeave={() => handleMouseLeave(i)}
                  >
                    <span
                      className="hover-circle"
                      aria-hidden="true"
                      ref={(el) => { if (el) circleRefs.current[i] = el; }}
                    />
                    <span className="label-stack">
                      <span className="pill-label">{item.label}</span>
                      <span className="pill-label-hover" aria-hidden="true">
                        {item.label}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>


        {/*
        Vertical Divider
        <span className="h-4 w-[1px] bg-[#111]/20 ml-5 mr-5 desktop-only self-center" />

        Sponsor Badge Inside Navbar
        <div className="sponsor-badge-inside desktop-only select-none mr-3">
          <Link href="/sponsors" className="cursor-pointer">
            <span className="sponsor-label-text-inside">sponsor:</span>
            <span className="sponsor-brand-text-inside">Hooba Booba</span>
          </Link>
        </div>
        */}

        <button className="mobile-menu-button mobile-only" onClick={toggleMobileMenu} ref={hamburgerRef}>
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </nav>

      <div className="mobile-menu-popover mobile-only shadow-2xl" ref={mobileMenuRef}>
        <ul className="mobile-menu-list">
          {items.map((item) => {
            const isHomeActive = (item.href === '/' || item.href === '/home') && (pathname === '/' || activeHref === '/' || activeHref === '/home');
            const isActive = isHomeActive || (item.href !== '/' && item.href !== '/home' && (activeHref === item.href || pathname === item.href));
            const targetHref = item.href === '/home' ? '/' : item.href;
            const isImplemented = targetHref === '/' || targetHref === '/events' || targetHref === '/blogs' || targetHref === '/achievements' || targetHref === '/board-members' || targetHref === '/image-gallery' || targetHref === '/sponsors';

            return (
              <li key={item.href}>
                <Link
                  href={targetHref}
                  className={`mobile-menu-link w-full text-center ${isActive ? 'is-active' : ''}`}
                  onClick={(e) => {
                    if (!isImplemented) {
                      e.preventDefault();
                      alert(`${item.label} page is coming soon!`);
                    } else {
                      handlePillClick(item.href, item.label);
                      toggleMobileMenu();
                    }
                  }}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
          {/*
          <li className="border-t border-[#FACC15]/20 pt-4 mt-2 flex justify-center select-none">
            <Link href="/sponsors" className="text-center w-full cursor-pointer">
              <span className="sponsor-label-text-mobile">sponsor:</span>
              <span className="sponsor-brand-text-mobile">Hooba Booba</span>
            </Link>
          </li>
          */}
        </ul>
      </div>
    </div>
  );
}
