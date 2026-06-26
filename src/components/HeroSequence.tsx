'use client';
import { useEffect, useRef, useState } from 'react';

const FRAME_COUNT = 514;
const currentFrame = (index: number) => `/images/${index.toString().padStart(5, '0')}.jpg`;

export default function HeroSequence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const textOverlayRef = useRef<HTMLDivElement>(null);
  
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = 1920;
    canvas.height = 1080;

    const imagesCache: { [key: number]: HTMLImageElement } = {};

    const drawImage = (img: HTMLImageElement) => {
      if (!isMounted) return;
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    // Load the first frame immediately
    const firstImg = new Image();
    firstImg.src = currentFrame(1);
    firstImg.onload = () => {
      imagesCache[1] = firstImg;
      drawImage(firstImg);
    };

    // If on mobile, do not preload the 500+ other frames or listen to scroll
    if (isMobile) {
      return () => {
        isMounted = false;
      };
    }

    // Preload remaining frames sequentially with limit to concurrency and cancellation support
    const preloadImages = () => {
      let nextFrameToLoad = 2;
      
      const loadNext = () => {
        if (!isMounted) return;
        if (nextFrameToLoad > FRAME_COUNT) return;
        
        const currentFrameIndex = nextFrameToLoad++;
        const img = new Image();
        img.src = currentFrame(currentFrameIndex);
        
        img.onload = () => {
          imagesCache[currentFrameIndex] = img;
          loadNext();
        };
        img.onerror = () => {
          loadNext();
        };
      };

      // Limit concurrency to 4 parallel streams to avoid overloading the local dev server
      const concurrencyLimit = 4;
      for (let j = 0; j < concurrencyLimit; j++) {
        loadNext();
      }
    };

    preloadImages();

    const updateImage = (index: number) => {
      if (!isMounted) return;
      
      // If the image is cached, draw it instantly (zero network latency)
      if (imagesCache[index]) {
        drawImage(imagesCache[index]);
      } else {
        // Fallback: If not cached yet, load it on-demand
        const img = new Image();
        img.src = currentFrame(index);
        img.onload = () => {
          imagesCache[index] = img;
          drawImage(img);
        };
      }
    };

    const handleScroll = () => {
      if (!wrapperRef.current) return;
      
      const wrapper = wrapperRef.current;
      const scrollTop = window.scrollY - wrapper.offsetTop;
      const maxScrollTop = wrapper.scrollHeight - window.innerHeight;
      let scrollFraction = scrollTop / maxScrollTop;
      
      if (scrollFraction < 0) scrollFraction = 0;
      if (scrollFraction > 1) scrollFraction = 1;
      
      const frameIndex = Math.min(
        FRAME_COUNT,
        Math.max(1, Math.ceil(scrollFraction * FRAME_COUNT))
      );
      
      let tOpacity = 1 - (scrollFraction / 0.3);
      if (tOpacity < 0) tOpacity = 0;
      if (tOpacity > 1) tOpacity = 1;
      
      let canvasOpacity = 1;
      if (scrollFraction > 0.80) {
        canvasOpacity = Math.max(0, 1 - ((scrollFraction - 0.80) / 0.20));
      }

      // Direct DOM style manipulation for extreme scroll performance (no React state updates)
      if (textOverlayRef.current) {
        textOverlayRef.current.style.opacity = String(tOpacity);
        textOverlayRef.current.style.transform = `translateY(${(1 - tOpacity) * -50}px)`;
      }

      if (canvasRef.current) {
        canvasRef.current.style.opacity = String(canvasOpacity);
      }
      
      requestAnimationFrame(() => updateImage(frameIndex));
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      isMounted = false;
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile]);

  return (
    <div className={isMobile ? "h-screen relative z-10 w-full" : "h-[500vh] relative z-10 w-full"} ref={wrapperRef} id="scroll-animation">
      <div className="h-screen w-full sticky top-0 flex justify-center items-center overflow-hidden bg-transparent relative">
        <canvas 
          ref={canvasRef} 
          id="hero-lightpass" 
          className="absolute inset-0 z-0 w-full h-full object-cover transition-opacity duration-75"
          style={{ opacity: 1 }}
        ></canvas>
        
        <div 
          ref={textOverlayRef}
          id="animation-text-overlay" 
          className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none text-center px-4 md:px-8 transition-opacity duration-75"
          style={{ opacity: 1 }}
        >
          <h1 className="font-display-lg text-5xl md:text-display-lg font-extrabold leading-tight mb-2 transition-opacity duration-75 flex flex-col items-center text-center">
              <span className="bg-gradient-to-r from-white via-amber-400 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_5px_20px_rgba(0,0,0,1)] drop-shadow-[0_2px_4px_rgba(0,0,0,1)] pb-1">Solar Energy Society of India</span>
              <span className="bg-gradient-to-r from-white via-amber-400 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_5px_20px_rgba(0,0,0,1)] drop-shadow-[0_2px_4px_rgba(0,0,0,1)] text-3xl md:text-[40px] mt-2 pb-1">VIT Vellore Institute of Technology</span>
              <span className="bg-gradient-to-r from-white via-amber-400 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_5px_20px_rgba(0,0,0,1)] drop-shadow-[0_2px_4px_rgba(0,0,0,1)] text-3xl md:text-[40px] mt-2 pb-1">Student Chapter</span>
          </h1>
          <div className="relative mt-4">
              <div className="absolute inset-[-2rem] bg-black/60 blur-[30px] rounded-[100%] pointer-events-none z-0"></div>
              <p className="relative z-10 font-body-md text-body-md text-white font-semibold max-w-3xl text-lg md:text-2xl leading-relaxed tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,1)] transition-opacity duration-75">
                  Empowering students to innovate, collaborate, and lead the future of sustainable energy
              </p>
          </div>
        </div>
      </div>
    </div>
  );
}
