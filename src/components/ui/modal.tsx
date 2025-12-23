'use client';

import * as React from 'react';
import { X, CheckCircle2, XCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  variant?: 'success' | 'error' | 'default';
}

export function Modal({ isOpen, onClose, title, children, variant = 'default' }: ModalProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const variantConfig = {
    success: {
      icon: CheckCircle2,
      iconColor: 'text-emerald-500',
      iconBg: 'bg-emerald-500/10',
      borderGradient: 'from-emerald-500/20 to-emerald-600/20',
      glow: 'shadow-[0_0_40px_rgba(16,185,129,0.3)]',
    },
    error: {
      icon: XCircle,
      iconColor: 'text-red-500',
      iconBg: 'bg-red-500/10',
      borderGradient: 'from-red-500/20 to-red-600/20',
      glow: 'shadow-[0_0_40px_rgba(239,68,68,0.3)]',
    },
    default: {
      icon: Info,
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-500/10',
      borderGradient: 'from-blue-500/20 to-blue-600/20',
      glow: 'shadow-[0_0_40px_rgba(59,130,246,0.3)]',
    },
  };

  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Overlay avec animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          
          {/* Modal Content avec animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ 
              type: "spring",
              damping: 25,
              stiffness: 300,
              duration: 0.3
            }}
            className={cn(
              'relative max-w-3xl w-full max-h-[90vh] overflow-y-auto',
              'bg-white/90 dark:bg-[#0A0A0A]/95',
              'backdrop-blur-2xl',
              'rounded-3xl',
              'border border-white/20 dark:border-gray-800/50',
              'shadow-2xl',
              config.glow,
              'overflow-hidden'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gradient border effect */}
            <div className={cn(
              'absolute inset-0 rounded-3xl',
              'bg-gradient-to-br',
              config.borderGradient,
              'opacity-50',
              '-z-10'
            )} />

            {/* Content */}
            <div className="p-8">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-200 backdrop-blur-sm"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Icon - masqué si pas de title pour le modal d'email */}
              {title && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className={cn(
                    'w-16 h-16 rounded-full flex items-center justify-center mb-6',
                    config.iconBg
                  )}
                >
                  <Icon className={cn('w-8 h-8', config.iconColor)} />
                </motion.div>
              )}

              {/* Title */}
              {title && (
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 pr-8 break-words">
                  {title}
                </h2>
              )}

              {/* Content */}
              <div className="text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-6">
                {children}
              </div>

              {/* Footer */}
              <div className="flex justify-end">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={onClose}
                    className={cn(
                      'px-6 py-2.5 rounded-xl font-medium transition-all duration-200',
                      variant === 'success' && 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/30',
                      variant === 'error' && 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/30',
                      variant === 'default' && 'bg-[#d23f26] hover:bg-[#b8351e] text-white shadow-lg shadow-[#d23f26]/30'
                    )}
                  >
                    OK
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

