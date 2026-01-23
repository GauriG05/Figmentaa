import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const EditorialSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !textRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        textRef.current,
        {
          opacity: 0,
          y: 100,
          filter: "blur(14px)",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            end: "top 35%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center"
    >
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-8 md:px-12 lg:px-16">
        <p 
          ref={textRef} 
          className="editorial-text text-center"
        >
          Figmenta is an independent boutique agency rooted in Italy, powered in UK and globally operating through a diverse range of talent.
        </p>
      </div>
    </section>
  );
};

export default EditorialSection;
