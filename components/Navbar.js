"use client"
import React, { useState } from 'react';
import { useSession } from "next-auth/react"; 

// Helper function to generate Lucide-style SVG icons for a single-file React component.
const Icon = ({ name, className = "w-4 h-4 mr-1" }) => {
    const iconMap = {
        'ShieldCheck': (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>
            </svg>
        ),
        'Edit3': (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
        ),
        'ListChecks': (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                <path d="m3 16 2 2 4-4"/><path d="m3 12 2 2 4-4"/><path d="M10 6h11"/><path d="M10 12h11"/><path d="M10 18h11"/>
            </svg>
        ),
        'Users': (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
        ),
        'Info': (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
            </svg>
        ),
        'Menu': (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                <line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>
            </svg>
        ),
        'X': (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
        ),
        // New Icon for Register/Sign-up (UserPlus)
        'UserPlus': (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="16" x2="22" y1="11" y2="11"/>
            </svg>
        ),
    };
    return iconMap[name] || null;
};

// Main Navbar Component
const Navbar = () => {
      const { data: session } = useSession(); 
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Separating main links from the primary action (Register) for better layout control
    const mainNavItems = [
        { name: 'File Complaint', href: '/file-complaint', icon: 'Edit3', primary: false },
        { name: 'View Complaints', href: '/view-complaint', icon: 'ListChecks', primary: false },
        { name: 'Lost & Found', href: '/lost-found', icon: 'ListChecks', primary: false },
        { name: 'NGO Directory', href: '/ngo-listing', icon: 'Users', primary: false },
        { name: 'Insights', href: '/insights', icon: 'Info', primary: false },
    ];
    
    // The new primary action button
      const primaryNavItem = session
    ? { name: "Profile", href: "/profile", icon: "Users", primary: true }
    : { name: "Register", href: "/register", icon: "UserPlus", primary: true };

    // Combine for mobile menu
    const navItems = [...mainNavItems, primaryNavItem]; 

    // Tailwind classes for link transition effect
    const baseLinkClasses = "transition duration-150 ease-in-out flex items-center nav-link rounded-lg";
    // desktopClasses now only holds the main links, and a new div holds the primary button
    const mainDesktopClasses = "hidden md:flex md:space-x-4 md:items-center"; 
    const mobileClasses = "md:hidden pb-2 space-y-1";

    return (
        <div className="bg-[#2563EB] shadow-xl sticky top-0 z-50 font-sans">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Site Title */}
                    <div className="flex-shrink-0">
                        <a href="/" className="flex items-center text-white text-xl font-extrabold tracking-wider">
                            <Icon name="ShieldCheck" className="w-6 h-6 mr-2 text-blue-300" />
                            GovServe Portal
                        </a>
                    </div>

                    {/* Desktop Menu - Main Links and Register Button */}
                    <div className="flex items-center">
                        {/* Main Navigation Links */}
                        <div className={mainDesktopClasses}>
                            {mainNavItems.map(item => (
                                <a 
                                    key={item.name} 
                                    href={item.href}
                                    className={`${baseLinkClasses} ${item.primary 
                                        ? 'bg-blue-700 text-white px-3 py-2 text-sm font-medium hover:bg-blue-600 shadow-md transform hover:translate-y-[-1px]'
                                        : 'text-white hover:bg-blue-700 px-3 py-2 text-sm font-medium transform hover:translate-y-[-1px]'
                                    }`}
                                >
                                    <Icon name={item.icon} className="w-4 h-4 mr-1" />
                                    {item.name}
                                </a>
                            ))}
                        </div>

                        {/* Primary Action Button (Register) - Desktop */}
                        <div className="hidden md:block md:ml-6">
                             <a 
                                key={primaryNavItem.name} 
                                href={primaryNavItem.href}
                                className={`${baseLinkClasses} bg-white text-[#2563EB] px-4 py-2 text-sm font-bold rounded-full shadow-lg transform transition duration-150 ease-in-out hover:bg-gray-100 hover:scale-[1.02]`}
                            >
                                <Icon name={primaryNavItem.icon} className="w-4 h-4 mr-1 text-[#2563EB]" />
                                {primaryNavItem.name}
                            </a>
                        </div>


                        {/* Mobile Menu Button */}
                        <div className="md:hidden ml-4">
                            <button 
                                type="button" 
                                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                                className="bg-blue-700 inline-flex items-center justify-center p-2 rounded-lg text-white hover:text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-800 focus:ring-white transition duration-150 ease-in-out" 
                                aria-controls="mobile-menu" 
                                aria-expanded={isMenuOpen}
                            >
                                <span className="sr-only">Open main menu</span>
                                {/* Toggle Icons based on state */}
                                {isMenuOpen ? (
                                    <Icon name="X" className="block h-6 w-6" />
                                ) : (
                                    <Icon name="Menu" className="block h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Content (Transition handled by max-height/overflow hidden) */}
                <div 
                    className={`${mobileClasses} ${isMenuOpen ? 'max-h-96' : 'max-h-0'} overflow-hidden transition-all duration-300 ease-in-out`}
                >
                    <div className="px-2 pt-2 pb-3">
                        {navItems.map(item => (
                            <a 
                                key={item.name} 
                                href={item.href}
                                onClick={() => setIsMenuOpen(false)} // Close menu on click
                                className={`${baseLinkClasses} block px-3 py-2 text-base font-medium mt-1 ${item.primary 
                                    ? 'bg-white text-[#2563EB] hover:bg-gray-100 font-bold' // Primary button style for mobile
                                    : 'text-white hover:bg-blue-700'
                                }`}
                            >
                                <Icon name={item.icon} className={`w-5 h-5 mr-2 ${item.primary ? 'text-[#2563EB]' : ''}`} />
                                {item.name}
                            </a>
                        ))}
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;