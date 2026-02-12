'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

interface AuthButtonProps extends HTMLMotionProps<"button"> {
    children: React.ReactNode;
    isLoading?: boolean;
    variant?: 'primary' | 'secondary' | 'outline';
}

export const AuthButton: React.FC<AuthButtonProps> = ({
    children,
    className,
    isLoading,
    variant = 'primary',
    disabled,
    ...props
}) => {
    const variants = {
        primary: 'bg-gradient-to-r from-primary to-indigo-600 text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 border-transparent',
        secondary: 'bg-zinc-800 text-white hover:bg-zinc-700 border-transparent',
        outline: 'bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white border'
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={twMerge(
                'w-full relative flex items-center justify-center py-3 px-4 rounded-xl font-medium transition-all duration-300 overflow-hidden',
                variants[variant],
                (disabled || isLoading) && 'opacity-70 cursor-not-allowed grayscale-[0.5]',
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {/* Shimmer effect for primary button */}
            {variant === 'primary' && !isLoading && !disabled && (
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            )}

            {isLoading ? (
                <Loader2 className="animate-spin mr-2" size={20} />
            ) : null}
            {children}
        </motion.button>
    );
};
