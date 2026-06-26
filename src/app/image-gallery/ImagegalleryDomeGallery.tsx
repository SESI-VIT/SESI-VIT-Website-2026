"use client";

import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { Image, OrbitControls, Environment, ContactShadows, Html, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import { getImageUrl } from '@/sanity/lib/image';

interface ImageItem {
  id: number;
  src: string;
  title: string;
  subtitle: string;
}

// Static images removed, now loaded dynamically from Sanity.

interface DomeImageProps {
  url: string;
  position: [number, number, number];
  rotation: [number, number, number];
  onClick: () => void;
}

const DomeImage = ({ url, position, rotation, onClick }: DomeImageProps) => {
  const meshRef = useRef<any>(null);
  const [hovered, setHover] = useState(false);

  useFrame(() => {
    const targetScale = hovered ? 1.15 : 1;
    if (meshRef.current) {
      meshRef.current.scale.lerp(new THREE.Vector3(3 * targetScale, 2 * targetScale, 1), 0.1);
      const forwardVec = new THREE.Vector3(0, 0, hovered ? 0.5 : 0).applyEuler(new THREE.Euler(...rotation));
      const targetPos = new THREE.Vector3(...position).add(forwardVec);
      meshRef.current.position.lerp(targetPos, 0.1);
    }
  });

  return (
    <Image 
      ref={meshRef}
      url={url}
      transparent
      radius={0.15}
      position={position}
      rotation={rotation}
      scale={[3, 2]}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={(e) => { e.stopPropagation(); setHover(false); document.body.style.cursor = 'auto'; }}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
    />
  );
};

interface RotatingGroupProps {
  children: React.ReactNode;
  position?: [number, number, number];
}

const RotatingGroup = ({ children, ...props }: RotatingGroupProps) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y -= 0.001;
    }
  });

  return <group ref={groupRef} {...props}>{children}</group>;
};

function useSafeProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const manager = THREE.DefaultLoadingManager;
    let started = false;

    // Fallback timer: if loading doesn't start in 200ms, assume all textures are cached
    const timer = setTimeout(() => {
      if (!started) {
        setProgress(100);
      }
    }, 200);

    const handleStartOrProgress = (url: string, loaded: number, total: number) => {
      started = true;
      clearTimeout(timer);
      setTimeout(() => {
        if (total > 0) {
          setProgress((loaded / total) * 100);
        }
      }, 0);
    };

    const handleLoad = () => {
      started = true;
      clearTimeout(timer);
      setTimeout(() => {
        setProgress(100);
      }, 0);
    };

    manager.onStart = handleStartOrProgress;
    manager.onProgress = handleStartOrProgress;
    manager.onLoad = handleLoad;

    return () => {
      clearTimeout(timer);
      manager.onStart = () => {};
      manager.onProgress = () => {};
      manager.onLoad = () => {};
    };
  }, []);

  return progress;
}

function CanvasLoader() {
  const progress = useSafeProgress();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (progress === 100) {
      setShow(false);
      return;
    }
    const timer = setTimeout(() => {
      setShow(true);
    }, 250); // Only show the loader if it takes longer than 250ms

    return () => clearTimeout(timer);
  }, [progress]);

  if (progress === 100 || !show) return null;

  return (
    <Html center>
      <div className="flex flex-col items-center justify-center select-none w-64 text-center">
        <div className="relative w-16 h-16 flex items-center justify-center mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-yellow-500/20 border-t-yellow-500 animate-spin" />
          <span className="text-[10px] font-bold text-yellow-500 font-mono">
            {Math.round(progress)}%
          </span>
        </div>
        <p className="text-xs font-bold tracking-widest text-yellow-500/70 uppercase">
          Loading Textures...
        </p>
      </div>
    </Html>
  );
}

const getDomeImageUrl = (image: any, index: number) => {
  let url = getImageUrl(image);
  if (!url) {
    const fallbacks = [
      "/sponsar-images/who-workshop.jpg",
      "/sponsar-images/who-event.jpg",
      "/sponsar-images/who-team.jpg",
      "/sponsar-images/who-industry.jpg"
    ];
    url = fallbacks[index % fallbacks.length];
  }
  // Append cache-busting parameter for WebGL CORS compatibility
  if (url.includes('cdn.sanity.io') || url.startsWith('http')) {
    const separator = url.includes('?') ? '&' : '?';
    url = `${url}${separator}webgl-cors=1`;
  }
  return url;
};

export default function ImagegalleryDomeGallery({ images = [] }: { images: any[] }) {
  const [selectedImage, setSelectedImage] = useState<any | null>(null);

  const clusterData = useMemo(() => {
    if (images.length === 0) return [];
    const rows = 5;
    const cols = 12;
    const radius = 16;
    const verticalSpacing = 2.8;
    const items = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const imageObj = images[(r * cols + c) % images.length];
        const angle = (c / cols) * Math.PI * 2;
        const staggeredAngle = r % 2 === 0 ? angle : angle + (Math.PI * 2 / cols) / 2;
        const x = Math.sin(staggeredAngle) * radius;
        const z = Math.cos(staggeredAngle) * radius;
        const y = (r - Math.floor(rows / 2)) * verticalSpacing;

        items.push({
          ...imageObj,
          uniqueId: `${r}-${c}`,
          position: [x, y, z] as [number, number, number],
          rotation: [0, staggeredAngle + Math.PI, 0] as [number, number, number]
        });
      }
    }
    return items;
  }, [images]);

  return (
    <div className="w-full h-full relative pointer-events-auto">
      <Canvas camera={{ position: [0, 0, 0.1], fov: 70 }}>
        <ambientLight intensity={0.8} />
        <spotLight position={[0, 10, 0]} intensity={1.5} angle={0.5} penumbra={1} />
        
        <Suspense fallback={null}>
          <RotatingGroup position={[0, 0, 0]}>
            {clusterData.map((item, idx) => (
              <DomeImage 
                key={item.uniqueId} 
                url={getDomeImageUrl(item.image, idx)} 
                position={item.position} 
                rotation={item.rotation}
                onClick={() => setSelectedImage(item)}
              />
            ))}
          </RotatingGroup>
          <Environment preset="city" />
          <ContactShadows position={[0, -6.0, 0]} opacity={0.4} scale={50} blur={2} far={15} />
        </Suspense>

        <CanvasLoader />

        <OrbitControls 
          enableZoom={false} 
          minDistance={0.1}
          maxDistance={5}
          enablePan={false}
          rotateSpeed={0.5}
          reverseOrbit={true}
        />
      </Canvas>

      {/* Lightbox Modal styled with Tailwind */}
      {selectedImage && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 w-screen h-screen bg-black/85 backdrop-blur-md z-[100] flex items-center justify-center animate-in fade-in duration-300" 
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center animate-in zoom-in-95 duration-300" 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute -top-[40px] right-0 bg-transparent border-none text-[#fca311] text-4xl cursor-pointer leading-none transition-all hover:scale-110 hover:text-[#ffb703]" 
              onClick={() => setSelectedImage(null)}
            >
              &times;
            </button>
            <img src={getImageUrl(selectedImage.image) || "/sponsar-images/who-workshop.jpg"} alt={selectedImage.title} className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-[0_10px_30px_rgba(252,163,17,0.2)] border border-[#fca311]/20" />
            <div className="mt-[15px] text-center text-[#fca311]">
              <h3 className="m-0 mb-[5px] text-2xl font-bold text-[#fca311]">{selectedImage.title}</h3>
              <p className="m-0 text-base text-[#fca311]/80">{selectedImage.subtitle}</p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
