'use client';
import { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const planetData = [
  { name: 'Sun', texture: '/images/planets/sun.jpg', size: 4, distance: 0, speed: 0 },
  { name: 'Mercury', texture: '/images/planets/mercury.jpg', size: 0.5, distance: 8, speed: 1.8 },
  { name: 'Venus', texture: '/images/planets/venus.jpg', size: 0.8, distance: 11, speed: 1.4 },
  { name: 'Earth', texture: '/images/planets/earth.jpg', size: 0.9, distance: 14, speed: 1.0 },
  { name: 'Mars', texture: '/images/planets/mars.jpg', size: 0.7, distance: 17, speed: 0.8 },
  { name: 'Jupiter', texture: '/images/planets/jupiter.jpg', size: 2.0, distance: 23, speed: 0.5 },
  { name: 'Saturn', texture: '/images/planets/saturn.jpg', size: 1.7, distance: 30, speed: 0.4 },
  { name: 'Uranus', texture: '/images/planets/uranus.jpg', size: 1.3, distance: 36, speed: 0.3 },
  { name: 'Neptune', texture: '/images/planets/neptune.jpg', size: 1.2, distance: 42, speed: 0.2 },
];

interface ScrollData {
  y: number;
  height: number;
  wrapperEnd: number;
}

function Planet({ data }: { data: any }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  const map = useTexture(data.texture) as THREE.Texture;
  
  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    // 10x slower orbital speed for a majestic cosmic background
    if (groupRef.current && data.speed > 0) {
      groupRef.current.rotation.y = elapsedTime * data.speed * 0.02;
    }
    // 5x slower axial rotation for smoother visuals
    if (meshRef.current) {
      meshRef.current.rotation.y += data.speed > 0 ? 0.002 : 0.001;
    }
  });

  return (
    <group ref={groupRef}>
      <Sphere ref={meshRef} args={[data.size, 32, 32]} position={[data.distance, 0, 0]}>
        <meshStandardMaterial 
          map={map} 
          transparent={true} 
          emissive={data.name === 'Sun' ? '#ffffee' : '#000000'}
          emissiveMap={data.name === 'Sun' ? map : undefined}
          emissiveIntensity={data.name === 'Sun' ? 1 : 0}
          roughness={data.name === 'Sun' ? 1 : 0.5}
        />
      </Sphere>
    </group>
  );
}

function SolarSystemScene({ scrollData }: { scrollData: React.MutableRefObject<ScrollData> }) {
  const { camera, scene } = useThree();

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    // 5x slower scene rotation
    scene.rotation.y = elapsedTime * 0.01;

    let targetCameraY = 15;
    let targetCameraZ = 45;

    const { y, height, wrapperEnd } = scrollData.current;
    const currentScroll = y + window.innerHeight;
    
    if (wrapperEnd > 0 && currentScroll > wrapperEnd) {
      const scrollableHeight = height - wrapperEnd;
      if (scrollableHeight > 0) {
        const scrollProgress = Math.max(0, Math.min(1, (y - (wrapperEnd - window.innerHeight)) / scrollableHeight));
        targetCameraY = 15 - (scrollProgress * 10);
        targetCameraZ = 45 - (scrollProgress * 25);
      }
    }

    // Smooth camera transition with snapping to prevent microscopic jittering when scroll stops
    const deltaY = targetCameraY - camera.position.y;
    const deltaZ = targetCameraZ - camera.position.z;

    if (Math.abs(deltaY) > 0.005) {
      camera.position.y += deltaY * 0.05;
    } else {
      camera.position.y = targetCameraY;
    }

    if (Math.abs(deltaZ) > 0.005) {
      camera.position.z += deltaZ * 0.05;
    } else {
      camera.position.z = targetCameraZ;
    }

    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight intensity={3} distance={300} color={0xffffff} />
      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
      {planetData.map((planet) => (
        <Planet key={planet.name} data={planet} />
      ))}
    </>
  );
}

export default function SolarSystem() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollData = useRef<ScrollData>({ y: 0, height: 0, wrapperEnd: 0 });

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const y = window.scrollY;
      const height = document.body.scrollHeight;
      
      const initialScrollAnimationSection = document.getElementById('scroll-animation');
      let wrapperEnd = 0;
      if (initialScrollAnimationSection) {
        wrapperEnd = initialScrollAnimationSection.offsetTop + initialScrollAnimationSection.scrollHeight;
        
        const maxScrollTop = initialScrollAnimationSection.scrollHeight - window.innerHeight;
        const scrollTop = Math.max(0, y - initialScrollAnimationSection.offsetTop);
        const scrollFraction = Math.max(0, Math.min(1, scrollTop / maxScrollTop));

        if (scrollFraction > 0.65) {
            const opacity = Math.min(1, (scrollFraction - 0.65) / 0.20);
            containerRef.current.style.opacity = opacity.toString();
        } else {
            containerRef.current.style.opacity = '0';
        }
        
        const currentScroll = y + window.innerHeight;
        if (currentScroll > wrapperEnd) {
            containerRef.current.style.opacity = '1';
        }
      }

      scrollData.current = { y, height, wrapperEnd };
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      id="solar-system-container" 
      className="fixed top-0 left-0 w-full h-full z-[5] pointer-events-none opacity-0 bg-black"
    >
      <Canvas camera={{ position: [0, 15, 45], fov: 60 }} gl={{ alpha: true, antialias: true }}>
        <Suspense fallback={null}>
          <SolarSystemScene scrollData={scrollData} />
        </Suspense>
      </Canvas>
    </div>
  );
}
