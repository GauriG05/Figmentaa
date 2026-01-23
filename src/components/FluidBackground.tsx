import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FluidBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const blob3Ref = useRef<HTMLDivElement>(null);
  const blob4Ref = useRef<HTMLDivElement>(null);
  const blob5Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Ambient floating animations
      gsap.to(blob1Ref.current, {
        x: "random(-100, 100)",
        y: "random(-50, 80)",
        scale: "random(0.9, 1.3)",
        duration: "random(15, 25)",
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.to(blob2Ref.current, {
        x: "random(-120, 60)",
        y: "random(-80, 120)",
        scale: "random(0.8, 1.2)",
        duration: "random(18, 28)",
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 2,
      });

      gsap.to(blob3Ref.current, {
        x: "random(-80, 150)",
        y: "random(-100, 60)",
        scale: "random(0.85, 1.25)",
        duration: "random(20, 30)",
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 4,
      });

      gsap.to(blob4Ref.current, {
        x: "random(-130, 100)",
        y: "random(-90, 90)",
        scale: "random(0.7, 1.4)",
        duration: "random(14, 22)",
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 1,
      });

      gsap.to(blob5Ref.current, {
        x: "random(-100, 80)",
        y: "random(-80, 70)",
        scale: "random(0.9, 1.3)",
        duration: "random(16, 26)",
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 3,
      });

      // Parallax scroll effects - different speeds create depth
      ScrollTrigger.create({
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          
          // Slow layer - appears furthest back
          gsap.set(blob1Ref.current, {
            yPercent: progress * 30,
          });
          
          // Medium-slow layer
          gsap.set(blob3Ref.current, {
            yPercent: progress * 50,
          });
          
          // Medium layer
          gsap.set(blob2Ref.current, {
            yPercent: progress * 80,
          });
          
          // Fast layer - appears closest
          gsap.set(blob4Ref.current, {
            yPercent: progress * 120,
          });
          
          // Fastest layer - creates strong depth
          gsap.set(blob5Ref.current, {
            yPercent: progress * 150,
          });
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden bg-background">
      {/* Primary purple blob - top center (slowest parallax - back layer) */}
      <div
        ref={blob1Ref}
        className="absolute w-[800px] h-[800px] rounded-full will-change-transform"
        style={{
          background: "radial-gradient(circle, hsl(270 80% 50%) 0%, transparent 70%)",
          top: "-20%",
          left: "30%",
          filter: "blur(120px)",
          opacity: 0.6,
        }}
      />

      {/* Deep violet blob - bottom left (medium-slow parallax) */}
      <div
        ref={blob3Ref}
        className="absolute w-[700px] h-[700px] rounded-full will-change-transform"
        style={{
          background: "radial-gradient(circle, hsl(280 75% 35%) 0%, transparent 70%)",
          bottom: "-10%",
          left: "-15%",
          filter: "blur(130px)",
          opacity: 0.55,
        }}
      />

      {/* Magenta blob - right side (medium parallax) */}
      <div
        ref={blob2Ref}
        className="absolute w-[600px] h-[600px] rounded-full will-change-transform"
        style={{
          background: "radial-gradient(circle, hsl(300 70% 45%) 0%, transparent 70%)",
          top: "20%",
          right: "-10%",
          filter: "blur(100px)",
          opacity: 0.5,
        }}
      />

      {/* Bright accent blob - center (fast parallax - front layer) */}
      <div
        ref={blob4Ref}
        className="absolute w-[500px] h-[500px] rounded-full will-change-transform"
        style={{
          background: "radial-gradient(circle, hsl(260 90% 60%) 0%, transparent 70%)",
          top: "40%",
          left: "40%",
          filter: "blur(80px)",
          opacity: 0.4,
        }}
      />

      {/* Pink glow - bottom right (fastest parallax - closest layer) */}
      <div
        ref={blob5Ref}
        className="absolute w-[550px] h-[550px] rounded-full will-change-transform"
        style={{
          background: "radial-gradient(circle, hsl(320 65% 50%) 0%, transparent 70%)",
          bottom: "10%",
          right: "20%",
          filter: "blur(100px)",
          opacity: 0.45,
        }}
      />
    </div>
  );
};

export default FluidBackground;
