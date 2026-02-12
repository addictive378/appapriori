'use client';

import React, { InputHTMLAttributes } from 'react';
import { LucideIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
    icon?: LucideIcon;
    label?: string;
    error?: string;
}

export const AuthInput: React.FC<AuthInputProps> = ({
    icon: Icon,
    label,
    error,
    className,
    id,
    ...props
}) => {
    return (
        <div className="w-full mb-4">
            {label && (
                <label
                    htmlFor={id}
                    className="block text-sm font-medium text-zinc-300 mb-1.5 ml-1"
                >
                    {label}
                </label>
            )}
            <div className="relative group">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-accent transition-colors duration-300">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    id={id}
                    className={twMerge(
                        'w-full bg-zinc-950/50 border border-zinc-800 text-white rounded-xl py-3 px-4 outline-none transition-all duration-300',
                        'focus:border-accent focus:ring-1 focus:ring-accent/50 focus:shadow-[0_0_15px_rgba(34,211,238,0.1)]',
                        'placeholder:text-zinc-600',
                        Icon ? 'pl-10' : '',
                        error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : '',
                        className
                    )}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1 text-xs text-red-400 ml-1">{error}</p>
            )}
        </div>
    );
};
