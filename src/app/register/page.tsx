'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Lock, Mail } from 'lucide-react';
import axios from 'axios';
import { AuthCard } from '@/components/ui/AuthCard';
import { AuthInput } from '@/components/ui/AuthInput';
import { AuthButton } from '@/components/ui/AuthButton';

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            await axios.post('/api/auth/register', {
                username: formData.username,
                email: formData.email,
                password: formData.password
            });

            // Redirect to login on success
            router.push('/login');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 relative overflow-hidden">
            {/* Background Gradient & Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-indigo-950/20" />
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.1),transparent_50%)]" />

            {/* Decorative Orbs */}
            <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-[100px] animate-pulse delay-1000" />

            <AuthCard
                title="Create Account"
                subtitle="Join our system today"
                className="w-full max-w-md mx-4"
            >
                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4 text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <AuthInput
                        id="username"
                        type="text"
                        label="Username"
                        placeholder="Choose a username"
                        icon={User}
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                    />

                    <AuthInput
                        id="email"
                        type="email"
                        label="Email Address"
                        placeholder="Enter your email"
                        icon={Mail}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />

                    <AuthInput
                        id="password"
                        type="password"
                        label="Password"
                        placeholder="Create a password"
                        icon={Lock}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />

                    <AuthInput
                        id="confirmPassword"
                        type="password"
                        label="Confirm Password"
                        placeholder="Confirm your password"
                        icon={Lock}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                    />

                    <AuthButton type="submit" isLoading={isLoading} className="mt-2">
                        Register
                    </AuthButton>

                    <div className="mt-6 text-center text-sm text-zinc-400">
                        Already have an account?{' '}
                        <Link
                            href="/login"
                            className="text-accent hover:text-accent/80 font-medium transition-colors hover:underline"
                        >
                            Login Here
                        </Link>
                    </div>
                </form>
            </AuthCard>
        </div>
    );
}
