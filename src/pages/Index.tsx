import { useRef } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import EditorialSection from "@/components/EditorialSection";
import FluidBackground from "@/components/FluidBackground";
import FigAgent, { FigAgentHandle } from "@/components/FigAgent";
import Footer from "@/components/Footer";
import CursorGlow from "@/components/CursorGlow";

const Index = () => {
  const agentRef = useRef<FigAgentHandle>(null);

  return (
    <main className="relative bg-background overflow-hidden">
      
      {/* Animated fluid gradient background (global) */}
      <div className="fixed inset-0 z-0">
        <FluidBackground />
      </div>

      {/* Cursor glow */}
      <CursorGlow />
      
      {/* Content */}
      <div className="relative z-10">
        <Navbar />

        {/* HERO */}
        <HeroSection onOpenAgent={() => agentRef.current?.open()} />

        {/* EDITORIAL */}
        <EditorialSection />

        {/* FOOTER directly after editorial */}
        <Footer />
      </div>

      {/* AI Chat Agent */}
      <FigAgent ref={agentRef} />
    </main>
  );
};

export default Index;
