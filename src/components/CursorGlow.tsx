import { useEffect, useRef } from "react";
import gsap from "gsap";

const CursorGlow = () => {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    const move = (e: MouseEvent) => {
      gsap.to(glow, {
        x: e.clientX - 150,
        y: e.clientY - 150,
        duration: 0.6,
        ease: "power3.out",
      });
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      ref={glowRef}
      className="
        fixed top-0 left-0 
        w-[300px] h-[300px] 
        rounded-full 
        pointer-events-none 
        z-[5]
        opacity-40
        blur-[120px]
      "
      style={{
        background: "radial-gradient(circle, rgba(180, 100, 255, 0.6) 0%, transparent 70%)",
      }}
    />
  );
};

export default CursorGlow;
