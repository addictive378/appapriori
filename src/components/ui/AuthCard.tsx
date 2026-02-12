'use client';

import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface AuthCardProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
    className?: string;
}

export const AuthCard: React.FC<AuthCardProps> = ({
    children,
    title,
    subtitle,
    className,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={twMerge(
                'w-full max-w-md p-8 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl bg-zinc-900/60 relative overflow-hidden',
                className
            )}
        >
            {/* Subtle background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-24 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-zinc-400 text-sm">{subtitle}</p>
                    )}
                </div>
                {children}
            </div>
        </motion.div>
    );
};
