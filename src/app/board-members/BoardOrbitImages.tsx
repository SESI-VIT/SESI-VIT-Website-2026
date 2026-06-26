"use client";

import React, { useMemo, useEffect, useLayoutEffect, useRef, useState, ReactNode } from 'react';
import { motion, useMotionValue, useTransform, animate, MotionValue, AnimatePresence } from 'framer-motion';
import './BoardOrbitImages.css';

function generateEllipsePath(cx: number, cy: number, rx: number, ry: number) {
  return `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy}`;
}

function generateCirclePath(cx: number, cy: number, r: number) {
  return generateEllipsePath(cx, cy, r, r);
}

function generateSquarePath(cx: number, cy: number, size: number) {
  const h = size / 2;
  return `M ${cx - h} ${cy - h} L ${cx + h} ${cy - h} L ${cx + h} ${cy + h} L ${cx - h} ${cy + h} Z`;
}

function generateRectanglePath(cx: number, cy: number, w: number, h: number) {
  const hw = w / 2;
  const hh = h / 2;
  return `M ${cx - hw} ${cy - hh} L ${cx + hw} ${cy - hh} L ${cx + hw} ${cy + hh} L ${cx - hw} ${cy + hh} Z`;
}

function generateTrianglePath(cx: number, cy: number, size: number) {
  const height = (size * Math.sqrt(3)) / 2;
  const hs = size / 2;
  return `M ${cx} ${cy - height / 1.5} L ${cx + hs} ${cy + height / 3} L ${cx - hs} ${cy + height / 3} Z`;
}

function generateStarPath(cx: number, cy: number, outerR: number, innerR: number, points: number) {
  const step = Math.PI / points;
  let path = '';
  for (let i = 0; i < 2 * points; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = i * step - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    path += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  }
  return path + ' Z';
}

function generateHeartPath(cx: number, cy: number, size: number) {
  const s = size / 30;
  return `M ${cx} ${cy + 12 * s} C ${cx - 20 * s} ${cy - 5 * s}, ${cx - 12 * s} ${cy - 18 * s}, ${cx} ${cy - 8 * s} C ${cx + 12 * s} ${cy - 18 * s}, ${cx + 20 * s} ${cy - 5 * s}, ${cx} ${cy + 12 * s}`;
}

function generateInfinityPath(cx: number, cy: number, w: number, h: number) {
  const hw = w / 2;
  const hh = h / 2;
  return `M ${cx} ${cy} C ${cx + hw * 0.5} ${cy - hh}, ${cx + hw} ${cy - hh}, ${cx + hw} ${cy} C ${cx + hw} ${cy + hh}, ${cx + hw * 0.5} ${cy + hh}, ${cx} ${cy} C ${cx - hw * 0.5} ${cy + hh}, ${cx - hw} ${cy + hh}, ${cx - hw} ${cy} C ${cx - hw} ${cy - hh}, ${cx - hw * 0.5} ${cy - hh}, ${cx} ${cy}`;
}

function generateWavePath(cx: number, cy: number, w: number, amplitude: number, waves: number) {
  const pts = [];
  const segs = waves * 20;
  const hw = w / 2;
  for (let i = 0; i <= segs; i++) {
    const x = cx - hw + (w * i) / segs;
    const y = cy + Math.sin((i / segs) * waves * 2 * Math.PI) * amplitude;
    pts.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
  }
  for (let i = segs; i >= 0; i--) {
    const x = cx - hw + (w * i) / segs;
    const y = cy - Math.sin((i / segs) * waves * 2 * Math.PI) * amplitude;
    pts.push(`L ${x} ${y}`);
  }
  return pts.join(' ') + ' Z';
}

interface OrbitItemProps {
  item: ReactNode;
  hqItem?: ReactNode;
  index: number;
  totalItems: number;
  path: string;
  itemSize: number;
  rotation: number;
  tilt: number;
  progress: MotionValue<number>;
  fill: boolean;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  isMobile?: boolean;
  link?: string;
  closeTrigger?: number;
  onPopoutStateChange?: (isPoppedOut: boolean) => void;
}

function BoardOrbitItem({ item, hqItem, index, totalItems, path, itemSize, rotation, tilt, progress, fill, onHoverStart, onHoverEnd, isMobile, link, closeTrigger, onPopoutStateChange }: OrbitItemProps) {
  const itemOffset = fill ? (index / totalItems) * 100 : 0;

  const distanceValue = useTransform(progress, (p) => {
    return (((p + itemOffset) % 100) + 100) % 100;
  });

  const offsetDistance = useTransform(distanceValue, (val) => `${val}%`);

  const [isHovered, setIsHovered] = useState(false);
  const hoverValue = useMotionValue(0);
  const itemRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const unhoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const isMouseInside = useRef(false);

  useEffect(() => {
    if (onPopoutStateChange) {
      onPopoutStateChange(isHovered);
    }
  }, [isHovered]);

  useEffect(() => {
    if (closeTrigger && closeTrigger > 0) {
      setIsHovered(false);
      if (unhoverTimeout.current) clearTimeout(unhoverTimeout.current);
      unhoverTimeout.current = null;
    }
  }, [closeTrigger]);

  useEffect(() => {
    const handleBlur = () => {
      setIsHovered(false);
      if (unhoverTimeout.current) clearTimeout(unhoverTimeout.current);
      unhoverTimeout.current = null;
    };
    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, []);

  useEffect(() => {
    animate(hoverValue, isHovered ? 1 : 0, { type: "spring", stiffness: 400, damping: 25 });

    if (!isMobile && isHovered && itemRef.current) {
      scrollTimeout.current = setTimeout(() => {
        const targetElement = popupRef.current || itemRef.current;
        if (!targetElement) return;

        const rect = targetElement.getBoundingClientRect();
        const scrollY = window.scrollY || window.pageYOffset;
        const elementCenterY = scrollY + rect.top + (rect.height / 2);

        const targetY = elementCenterY - (window.innerHeight / 2);

        window.scrollTo({
          top: targetY,
          behavior: 'smooth'
        });
      }, 150);
    } else {
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    }

    return () => {
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      if (unhoverTimeout.current) clearTimeout(unhoverTimeout.current);
    };
  }, [isHovered, hoverValue, isMobile]);

  const x = useTransform([distanceValue, hoverValue], ([d, h]) => {
    if (isMobile) return 0;
    const angle = Math.PI - (Number(d) / 100) * Math.PI * 2;
    return Math.cos(angle) * 280 * Number(h);
  });

  const y = useTransform([distanceValue, hoverValue], ([d, h]) => {
    if (isMobile) return 0;
    const angle = Math.PI - (Number(d) / 100) * Math.PI * 2;
    return Math.sin(angle) * 280 * Number(h);
  });

  const popupScale = useTransform(hoverValue, (h) => 0.5 + Number(h) * 0.5);
  const mobileThumbnailScale = useTransform(hoverValue, (h) => 1 + Number(h) * 0.4);
  const desktopThumbnailScale = useTransform(hoverValue, (h) => 1 + Number(h) * 0.2);

  return (
    <motion.div
      ref={itemRef}
      className="orbit-item group cursor-pointer"
      onHoverStart={() => {
        if (isMobile) return;
        isMouseInside.current = true;
        setIsHovered(true);
        if (onHoverStart) onHoverStart();
      }}
      onHoverEnd={() => {
        if (isMobile) return;
        isMouseInside.current = false;
        if (!unhoverTimeout.current) {
          unhoverTimeout.current = setTimeout(() => {
            unhoverTimeout.current = null;
            if (!isMouseInside.current) {
              setIsHovered(false);
              if (onHoverEnd) onHoverEnd();
            }
          }, 10000);
        }
      }}
      onClick={(e) => {
        if (isMobile) {
          if (onHoverStart) {
            onHoverStart();
            setTimeout(() => {
              if (onHoverEnd) onHoverEnd();
            }, 5000);
          }
        } else {
          e.stopPropagation();
          setIsHovered(false);
          if (unhoverTimeout.current) clearTimeout(unhoverTimeout.current);
          unhoverTimeout.current = null;
          if (link) window.open(link, '_blank');
        }
      }}
      style={{
        width: itemSize,
        height: itemSize,
        offsetPath: `path("${path}")`,
        offsetRotate: '0deg',
        offsetAnchor: 'center center',
        offsetDistance,
        zIndex: isHovered ? 50 : 1,
      }}
    >
      <motion.div
        className="w-full h-full relative z-10"
        style={{ scale: isMobile ? mobileThumbnailScale : desktopThumbnailScale }}
      >
        <div
          className="w-full h-full rounded-lg overflow-hidden border-2 border-yellow-500/50 shadow-[0_0_10px_rgba(255,204,0,0.1)]"
          style={{ transform: `rotate(${-rotation}deg) rotateX(${-tilt}deg)` }}
        >
          {item}
        </div>
      </motion.div>

      {!isMobile && (
        <motion.div
          ref={popupRef}
          className="absolute z-50 flex items-center justify-center cursor-pointer"
          onPointerDown={(e) => {
            e.stopPropagation();
            setIsHovered(false);
            if (unhoverTimeout.current) clearTimeout(unhoverTimeout.current);
            unhoverTimeout.current = null;
            if (link) window.open(link, '_blank');
          }}
          style={{
            top: "50%",
            left: "50%",
            width: 250,
            height: 250,
            marginLeft: -125,
            marginTop: -125,
            x,
            y,
            scale: popupScale,
            opacity: hoverValue,
            pointerEvents: isHovered ? "auto" : "none"
          }}
        >
          <div
            className="w-full h-full rounded-xl overflow-hidden border-4 border-yellow-400 shadow-[0_0_40px_rgba(255,204,0,0.8)] transition-transform hover:scale-105"
            style={{ transform: `rotate(${-rotation}deg) rotateX(${-tilt}deg)` }}
          >
            {hqItem ?? item}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export interface OrbitImageItem {
  src: string;
  hqSrc?: string;
  link?: string;
}

export interface OrbitImagesProps {
  images?: (string | OrbitImageItem)[];
  altPrefix?: string;
  shape?: 'circle' | 'ellipse' | 'square' | 'rectangle' | 'triangle' | 'star' | 'heart' | 'infinity' | 'wave' | 'custom';
  customPath?: string;
  baseWidth?: number;
  radiusX?: number;
  radiusY?: number;
  radius?: number;
  starPoints?: number;
  starInnerRatio?: number;
  rotation?: number;
  tilt?: number;
  duration?: number;
  itemSize?: number;
  direction?: 'normal' | 'reverse';
  fill?: boolean;
  width?: number | string;
  height?: number | string;
  className?: string;
  showPath?: boolean;
  pathColor?: string;
  pathWidth?: number;
  easing?: string;
  paused?: boolean;
  centerContent?: ReactNode;
  responsive?: boolean;
}

export default function BoardOrbitImages({
  images = [],
  altPrefix = 'Orbiting image',
  shape = 'ellipse',
  customPath,
  baseWidth = 1400,
  radiusX = 700,
  radiusY = 170,
  radius = 300,
  starPoints = 5,
  starInnerRatio = 0.5,
  rotation = 0,
  tilt = 0,
  duration = 40,
  itemSize = 64,
  direction = 'normal',
  fill = true,
  width = 100,
  height = 100,
  className = '',
  showPath = false,
  pathColor = 'rgba(255,204,0,0.3)',
  pathWidth = 2,
  easing = 'linear',
  paused = false,
  centerContent,
  responsive = false,
}: OrbitImagesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const [activeIndex, setActiveIndex] = useState(images.length > 0 ? images.length - 1 : 0);
  const [isAutoPlayPaused, setIsAutoPlayPaused] = useState(false);

  const [poppedOutCount, setPoppedOutCount] = useState(0);
  const [closeTrigger, setCloseTrigger] = useState(0);

  useEffect(() => {
    const handleClickOutside = () => {
      setCloseTrigger(prev => prev + 1);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile || isAutoPlayPaused || images.length === 0) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [isMobile, isAutoPlayPaused, images.length]);

  const designCenterX = baseWidth / 2;
  const designCenterY = baseWidth / 2;

  const path = useMemo(() => {
    switch (shape) {
      case 'circle':
        return generateCirclePath(designCenterX, designCenterY, radius);
      case 'ellipse':
        return generateEllipsePath(designCenterX, designCenterY, radiusX, radiusY);
      case 'square':
        return generateSquarePath(designCenterX, designCenterY, radius * 2);
      case 'rectangle':
        return generateRectanglePath(designCenterX, designCenterY, radiusX * 2, radiusY * 2);
      case 'triangle':
        return generateTrianglePath(designCenterX, designCenterY, radius * 2);
      case 'star':
        return generateStarPath(designCenterX, designCenterY, radius, radius * starInnerRatio, starPoints);
      case 'heart':
        return generateHeartPath(designCenterX, designCenterY, radius * 2);
      case 'infinity':
        return generateInfinityPath(designCenterX, designCenterY, radiusX * 2, radiusY * 2);
      case 'wave':
        return generateWavePath(designCenterX, designCenterY, radiusX * 2, radiusY, 3);
      case 'custom':
        return customPath || generateCirclePath(designCenterX, designCenterY, radius);
      default:
        return generateEllipsePath(designCenterX, designCenterY, radiusX, radiusY);
    }
  }, [shape, customPath, designCenterX, designCenterY, radiusX, radiusY, radius, starPoints, starInnerRatio]);

  useLayoutEffect(() => {
    if (!responsive || !containerRef.current) return;
    const updateScale = () => {
      if (!containerRef.current) return;
      setScale(containerRef.current.clientWidth / baseWidth);
    };
    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [responsive, baseWidth]);

  const progress = useMotionValue(0);
  const controlsRef = useRef<any>(null);
  const effectivelyPaused = paused || isAutoPlayPaused || poppedOutCount > 0;

  useEffect(() => {
    controlsRef.current = animate(progress, direction === 'reverse' ? -100 : 100, {
      duration,
      ease: easing as any,
      repeat: Infinity,
      repeatType: 'loop',
    });

    if (effectivelyPaused) {
      controlsRef.current.pause();
    }

    return () => controlsRef.current?.stop();
  }, [progress, duration, easing, direction]);

  useEffect(() => {
    if (controlsRef.current) {
      if (effectivelyPaused) {
        controlsRef.current.pause();
      } else {
        controlsRef.current.play();
      }
    }
  }, [effectivelyPaused]);

  const containerWidth = responsive ? '100%' : (typeof width === 'number' ? `${width}px` : width);
  const containerHeight = responsive ? 'auto' : (typeof height === 'number' ? `${height}px` : (typeof width === 'number' ? `${width}px` : 'auto'));

  return (
    <div className="flex flex-col items-center w-full relative">
      <div
        ref={containerRef}
        className={`orbit-container ${className}`}
        style={{
          width: containerWidth,
          height: containerHeight,
          aspectRatio: responsive ? '1 / 1' : undefined,
        }}
        aria-hidden="true"
      >
        <div
          className={responsive ? 'orbit-scaling-container orbit-scaling-container--responsive' : 'orbit-scaling-container'}
          style={{
            width: responsive ? baseWidth : '100%',
            height: responsive ? baseWidth : '100%',
            transform: responsive && scale !== null ? `translate(-50%, -50%) scale(${scale})` : undefined,
            visibility: responsive && scale === null ? 'hidden' : undefined,
          }}
        >
          <div
            className="orbit-rotation-wrapper"
            style={{ transform: `rotate(${rotation}deg) rotateX(${tilt}deg)` }}
          >
            {showPath && (
              <svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${baseWidth} ${baseWidth}`}
                className="orbit-path-svg"
              >
                <path d={path} fill="none" stroke={pathColor} strokeWidth={pathWidth / (scale ?? 1)} />
              </svg>
            )}

            {images.map((img, index) => {
              const src = typeof img === 'string' ? img : img.src;
              const hqSrc = typeof img === 'string' ? undefined : img.hqSrc;
              const link = typeof img === 'string' ? undefined : img.link;
              const itemElement = (
                <img
                  key={src}
                  src={src}
                  alt={`${altPrefix} ${index + 1}`}
                  draggable={false}
                  className="orbit-image"
                />
              );
              const hqItemElement = hqSrc ? (
                <img
                  key={hqSrc}
                  src={hqSrc}
                  alt={`${altPrefix} ${index + 1}`}
                  draggable={false}
                  className="orbit-image"
                />
              ) : undefined;
              return (
                <BoardOrbitItem
                  key={index}
                  item={itemElement}
                  hqItem={hqItemElement}
                  index={index}
                  totalItems={images.length}
                  path={path}
                  itemSize={itemSize}
                  rotation={rotation}
                  tilt={tilt}
                  progress={progress}
                  fill={fill}
                  isMobile={isMobile}
                  link={link}
                  closeTrigger={closeTrigger}
                  onPopoutStateChange={(isPoppedOut) => {
                    setPoppedOutCount(prev => isPoppedOut ? prev + 1 : Math.max(0, prev - 1));
                  }}
                  onHoverStart={() => {
                    if (isMobile) {
                      setActiveIndex(index);
                      setIsAutoPlayPaused(true);
                    }
                  }}
                  onHoverEnd={() => {
                    if (isMobile) {
                      setIsAutoPlayPaused(false);
                    }
                  }}
                />
              );
            })}
          </div>
        </div>

        {centerContent && (
          <div className="orbit-center-content">
            <div className="w-full h-full flex items-center justify-center">
              {centerContent}
            </div>
          </div>
        )}
      </div>

      {isMobile && images.length > 0 && (
        <div className="mt-8 md:mt-16 w-full max-w-[300px] md:max-w-[400px] aspect-square flex items-center justify-center relative cursor-pointer"
          onClick={() => {
            const activeImg = images[activeIndex];
            const activeLink = typeof activeImg === 'string' ? undefined : activeImg.link;
            if (activeLink) window.open(activeLink, '_blank');
          }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute inset-0 rounded-2xl overflow-hidden border-4 border-yellow-400 shadow-[0_0_40px_rgba(255,204,0,0.6)] z-50 transition-transform hover:scale-105"
            >
              <img
                src={typeof images[activeIndex] === 'string'
                  ? images[activeIndex] as string
                  : ((images[activeIndex] as OrbitImageItem).hqSrc ?? (images[activeIndex] as OrbitImageItem).src)}
                alt={`${altPrefix} ${activeIndex + 1}`}
                draggable={false}
                className="orbit-image"
                style={{ imageRendering: 'auto' }}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
