import { ChevronDown } from "lucide-react";

const Navbar = () => {
  const navLinks = ["Expertise", "Portfolio", "About", "Careers", "Updates"];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-10 py-6 md:px-12 lg:px-16">
      <div className="flex items-center justify-between">
        
        {/* Left — Logo */}
        <div className="text-[1.25rem] font-serif tracking-wide text-white">
          FIGMENTA
        </div>

        {/* Center Navigation */}
        <div className="hidden md:flex items-center gap-10 text-sm text-white/90">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="hover:text-white transition-colors duration-200"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Right Navigation */}
        <div className="hidden md:flex items-center gap-8 text-sm text-white/90">
          
          {/* Divisions */}
          <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors duration-200">
            <div className="grid grid-cols-2 gap-[2px]">
              <span className="w-1 h-1 rounded-full bg-current" />
              <span className="w-1 h-1 rounded-full bg-current" />
              <span className="w-1 h-1 rounded-full bg-current" />
              <span className="w-1 h-1 rounded-full bg-current" />
            </div>
            <span>Divisions</span>
          </div>

          {/* Contact */}
          <a
            href="#contact"
            className="hover:text-white transition-colors duration-200"
          >
            Contact
          </a>

          {/* Language */}
          <div className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors duration-200">
            <span>EN</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {/* Mobile */}
        <button className="md:hidden text-sm text-white/90">
          Menu
        </button>

      </div>
    </nav>
  );
};

export default Navbar;
