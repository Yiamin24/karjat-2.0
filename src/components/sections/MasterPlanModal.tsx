'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-6 h-6">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

type Props = { isOpen: boolean; onClose: () => void };

export default function MasterPlanModal({ isOpen, onClose }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 z-50 flex justify-center overflow-y-auto p-2 sm:p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 260 }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-6xl my-auto bg-[#1a5c3a] border-2 border-[#d4af37]/60 overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-10 h-10 bg-[#d4af37] hover:bg-[#f5f1e8] text-[#0d3320] flex items-center justify-center transition-all duration-300"
              aria-label="Close master plan"
            >
              <CloseIcon />
            </button>
            <div className="w-full flex items-center justify-center p-4 sm:p-6 md:p-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://static.wixstatic.com/media/cef78c_9d10890449a24efab942b1644b09f8e2~mv2.jpg"
                alt="Karjat Blooms Master Plan — Luxury Estate Layout"
                className="w-auto h-auto max-w-full object-contain"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
