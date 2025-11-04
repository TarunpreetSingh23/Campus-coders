"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

const Icon = ({ name, className = "w-4 h-4 mr-1.5" }) => {
  const icons = {
    ShieldCheck: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="m9 12 2 2 4-4"/>
      </svg>
    ),
    Edit3: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
    ListChecks: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m3 16 2 2 4-4"/><path d="m3 12 2 2 4-4"/><path d="M10 6h11"/><path d="M10 12h11"/><path d="M10 18h11"/>
      </svg>
    ),
    Users: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    Info: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
      </svg>
    ),
    Menu: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="4" x2="20" y1="12" y2="12"/>
        <line x1="4" x2="20" y1="6" y2="6"/>
        <line x1="4" x2="20" y1="18" y2="18"/>
      </svg>
    ),
    X: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
      </svg>
    ),
    UserPlus: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <line x1="19" x2="19" y1="8" y2="14"/>
        <line x1="16" x2="22" y1="11" y2="11"/>
      </svg>
    ),
  };
  return icons[name] || null;
};

const Navbar = () => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const mainLinks = [
    { name: "File Complaint", href: "/file-complaint", icon: "Edit3" },
    { name: "View Complaints", href: "/view-complaint", icon: "ListChecks" },
    { name: "Lost & Found", href: "/lost-found", icon: "ListChecks" },
    { name: "NGO Directory", href: "/ngo-listing", icon: "Users" },
    { name: "Community Events", href: "/community-events", icon: "Users" },
    { name: "Insights", href: "/insights", icon: "Info" },
  ];

  const primaryLink = session
    ? { name: "Profile", href: "/profile", icon: "Users" }
    : { name: "Register", href: "/register", icon: "UserPlus" };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed top-3 left-1/2 -translate-x-1/2 p-3 z-50 w-[95%] md:w-[85%]"
    >
      <div className="backdrop-blur-md bg-white/90 border  border-gray-200 shadow-lg rounded-xl px-5 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <a href="/" className="flex items-center font-bold tracking-tight text-2xl text-gray-800">
          <motion.div whileHover={{ rotate: 10 }} transition={{ type: "spring", stiffness: 250 }}>
            <Icon name="ShieldCheck" className="w-5 h-5 mr-1.5 text-blue-600" />
          </motion.div>
          <span className="text-gray-900">GovServe</span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {mainLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="flex items-center text-gray-700 hover:text-blue-600 transition font-medium text-md"
            >
              <Icon name={link.icon} className="text-blue-600 w-4 h-4 mr-1.5" />
              {link.name}
            </a>
          ))}

          <a
            href={primaryLink.href}
            className="flex items-center bg-blue-600 text-white px-4 py-1.5 rounded-full font-medium shadow-sm hover:bg-blue-700 transition text-sm"
          >
            <Icon name={primaryLink.icon} className="text-white w-4 h-4 mr-1.5" />
            {primaryLink.name}
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
        >
          <Icon name={isMenuOpen ? "X" : "Menu"} className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mt-2 bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl p-4 shadow-lg space-y-1"
          >
            {[...mainLinks, primaryLink].map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center text-gray-800 py-1.5 px-3 rounded-lg hover:bg-gray-100 transition text-sm"
              >
                <Icon name={link.icon} className="text-blue-600 w-4 h-4 mr-2" />
                {link.name}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
