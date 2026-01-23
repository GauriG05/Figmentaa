import { Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative z-20 w-full">
      
      {/* Footer content directly on page background */}
      <div className="w-full px-10 py-6 flex items-center justify-between text-sm text-white/85">
        
        {/* Left */}
        <div className="flex items-center gap-4">
          <span>©Copyright Figmenta 2025</span>
          <span className="text-white/40">|</span>
          <a 
            href="#" 
            className="hover:text-white transition-colors duration-200"
          >
            Privacy Policy
          </a>
        </div>

        {/* Right */}
        <div className="flex items-center gap-6">
          
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-white transition-colors duration-200"
          >
            <Instagram className="w-6 h-6" />
          </a>

          <a 
            href="https://linkedin.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-white transition-colors duration-200"
          >
            <Linkedin className="w-6 h-6" />
          </a>

          <a 
            href="mailto:info@figmenta.com"
            className="hover:text-white transition-colors duration-200"
          >
            info@figmenta.com
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
