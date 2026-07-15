'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface NavigationProps {
  onEnquireClick: () => void;
}

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-6 h-6">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-6 h-6">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Location', href: '#location' },
  { label: 'Amenities', href: '#amenities' },
  { label: 'Master Plan', href: '#masterplan' },
  { label: 'Contact', href: '#contact' },
];

export default function Navigation({ onEnquireClick }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [userClicked, setUserClicked] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const hero = document.getElementById('home');
      if (hero) {
        // Transparent while inside the hero, solid once scrolled past it
        setScrolled(window.scrollY >= hero.offsetHeight - 80);
      } else {
        setScrolled(window.scrollY > 100);
      }
      if (!userClicked) {
        const ids = ['about', 'location', 'vision', 'amenities', 'lifestyle', 'masterplan', 'contact'];
        for (const id of ids) {
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 150 && rect.bottom >= 150) {
              setActiveSection(id);
              break;
            }
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [userClicked]);

  const scrollTo = (href: string) => {
    setUserClicked(true);
    setMobileOpen(false);
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(id);
      }, 50);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#01352A] border-b border-[#44564C] shadow-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[120rem] mx-auto px-5 sm:px-8 lg:px-16 py-3 sm:py-4">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <button
            onClick={() => { setUserClicked(false); setMobileOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); setActiveSection(''); }}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            aria-label="Back to top"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://static.wixstatic.com/media/cef78c_bec60a55156b45779b30a3287c15a165~mv2.png"
              alt="Rudram Realty"
              className="w-10 h-10 object-contain brightness-0 invert flex-shrink-0"
            />
            <div>
              <p className="font-heading text-sm tracking-[0.2em] text-[#A8874A] leading-none">RUDRAM</p>
              <p className="font-label text-[9px] tracking-[0.3em] uppercase text-[#EEE4DA]/60">Realty</p>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-12">
            {navLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                className={`font-label text-xs tracking-[0.15em] uppercase relative group transition-colors duration-300 ${
                  activeSection === link.href.replace('#', '') ? 'text-[#A8874A]' : 'text-[#EEE4DA]/80 hover:text-[#A8874A]'
                }`}
                whileHover={{ y: -2 }}
              >
                {link.label}
                <span className={`absolute -bottom-0.5 left-0 h-px bg-[#A8874A] transition-all duration-300 ${activeSection === link.href.replace('#', '') ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </motion.a>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-3">
            <button
              onClick={onEnquireClick}
              className="bg-[#A8874A] text-[#022921] hover:bg-[#BF9A5A] px-5 sm:px-6 py-2 text-[10px] sm:text-xs tracking-[0.2em] uppercase font-bold font-label transition-all duration-500"
            >
              Enquire
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center text-[#EEE4DA] hover:text-[#A8874A] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <motion.div
          initial={false}
          animate={{ height: mobileOpen ? 'auto' : 0, opacity: mobileOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="flex flex-col gap-4 pt-4 pb-2 border-t border-[#44564C] mt-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                className={`font-label text-sm tracking-[0.15em] uppercase pl-4 transition-colors duration-300 ${
                  activeSection === link.href.replace('#', '') ? 'text-[#A8874A]' : 'text-[#EEE4DA]/80'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </header>
  );
}
