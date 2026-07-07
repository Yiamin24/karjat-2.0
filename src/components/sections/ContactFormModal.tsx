'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-5 h-5">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

type Props = { isOpen: boolean; onClose: () => void };

export default function ContactFormModal({ isOpen, onClose }: Props) {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate a brief submission delay (replace with your own API call)
    await new Promise(r => setTimeout(r, 800));
    setIsSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', phone: '', email: '', message: '' });
      onClose();
    }, 2000);
  };

  const inputCls = "w-full bg-[#0f3a1f]/50 border border-[#d4af37]/30 text-[#f5f1e8] placeholder-[#f5f1e8]/30 px-4 py-3 focus:outline-none focus:border-[#d4af37] focus:bg-[#0f3a1f]/80 transition-all duration-300 font-paragraph text-sm";
  const labelCls = "block text-xs font-paragraph tracking-[0.1em] uppercase text-[#d4af37] mb-2";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a1510]/95 backdrop-blur-lg p-4 overflow-y-auto"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-gradient-to-br from-[#0f3a1f] via-[#1a5c3a] to-[#0f3a1f] border border-[#d4af37]/50 p-8 md:p-10 max-w-md w-full relative shadow-2xl my-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-[#d4af37]/60 pointer-events-none" />
            <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-[#d4af37]/60 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-[#d4af37]/60 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-[#d4af37]/60 pointer-events-none" />

            {/* Close */}
            <motion.button
              onClick={onClose}
              className="absolute top-5 right-5 z-20 w-10 h-10 flex items-center justify-center text-[#f5f1e8]/60 hover:text-[#d4af37] hover:bg-[#d4af37]/15 rounded-full border border-[#d4af37]/30 hover:border-[#d4af37]/60 transition-all duration-300"
              aria-label="Close" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
            >
              <CloseIcon />
            </motion.button>

            <div className="relative z-10">
              {submitted ? (
                <div className="py-10 text-center">
                  <div className="w-14 h-14 border-2 border-[#d4af37] rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className="font-heading text-2xl text-[#d4af37] mb-3">Thank You</h3>
                  <p className="font-paragraph text-[#f5f1e8]/70 text-sm">We&apos;ll be in touch within 24 hours.</p>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-px w-8 bg-[#d4af37]" />
                      <span className="text-[#d4af37] text-xs font-paragraph tracking-[0.2em] uppercase font-semibold">Contact Us</span>
                    </div>
                    <h3 className="font-heading text-3xl md:text-4xl text-[#f5f1e8] mb-3 leading-tight">Get In Touch</h3>
                    <p className="font-paragraph text-[#f5f1e8]/70 text-sm leading-relaxed">Share your details and we&apos;ll respond within 24 hours.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className={labelCls}>Full Name</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Your name" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Phone Number</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+91 XXXXX XXXXX" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Email Address</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="your@email.com" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Message</label>
                      <textarea name="message" value={formData.message} onChange={handleChange} required placeholder="Tell us about your interest..." rows={4} className={`${inputCls} resize-none`} />
                    </div>
                    <button
                      type="submit" disabled={isSubmitting}
                      className="w-full bg-[#d4af37] text-[#0d3320] hover:bg-[#f5f1e8] disabled:opacity-50 disabled:cursor-not-allowed py-4 text-xs tracking-[0.2em] uppercase font-bold transition-all duration-500 mt-2"
                    >
                      {isSubmitting ? 'Sending…' : 'Send Message'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
