import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

type HeroSectionProps = {
  onOpenAgent?: () => void;
};

const HeroSection = ({ onOpenAgent }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      
      {/* Content */}
      <div className="relative z-10 text-center px-4">
        
        <motion.h1 
          className="hero-line-sans mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Figmenta means
        </motion.h1>

        <motion.h2 
          className="hero-line-serif"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Imaginary things
        </motion.h2>
        
        {/* Talk to Agent trigger */}
        <motion.button
          onClick={onOpenAgent}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-16 inline-flex items-center gap-2.5 px-6 py-3 text-sm font-normal tracking-wider text-white/80 hover:text-white border border-white/20 hover:border-white/40 rounded-full transition-all duration-300 group backdrop-blur-sm bg-white/5 hover:bg-white/10"
        >
          <span>Talk to Agent</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </motion.button>

      </div>
    </section>
  );
};

export default HeroSection;
