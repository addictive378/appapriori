"use client";

import { motion } from "framer-motion";
import { ArrowRight, Database, Network, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface HeroProps {
    onStart: () => void;
}

export default function Hero({ onStart }: HeroProps) {
    const { user, logout } = useAuth();
    return (
        <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background text-center px-4">
            {/* Background Decor */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 via-background to-background pointer-events-none" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-soft-light"></div>

            {/* Animated Grid Pattern */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="z-10 flex flex-col items-center gap-6 max-w-4xl"
            >
                <div className="flex items-center gap-3 rounded-full bg-secondary/50 px-4 py-1.5 text-sm font-medium text-accent ring-1 ring-accent/20 backdrop-blur-md">
                    <Network className="h-4 w-4" />
                    <span>{user ? `Welcome, ${user.username}` : "Selamat Datang"}</span>
                </div>

                <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl md:text-8xl bg-clip-text text-transparent bg-gradient-to-br from-white via-white/90 to-white/50">
                    Sistem Analisa <br /> Penjualan Cafetaria
                </h1>

                <p className="text-lg font-light text-muted-foreground md:text-xl max-w-2xl leading-relaxed text-zinc-400">
                    Membantu anda dalam melakukan analisa pada pola penjualan untuk meningkatkan strategi penjualan menggunakan <span className="text-accent font-medium">Algoritma Apriori</span>.
                </p>

                <div className="flex gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onStart}
                        className="group relative mt-4 flex items-center gap-3 overflow-hidden rounded-full bg-primary px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-primary/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                        <span className="relative z-10">Get Started</span>
                        <ArrowRight className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        <div className="absolute inset-0 -z-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:animate-shimmer" />
                    </motion.button>

                    {user && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={logout}
                            className="group relative mt-4 flex items-center gap-3 overflow-hidden rounded-full bg-zinc-800 px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-zinc-900/20 transition-all hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                            <span className="relative z-10">Logout</span>
                            <LogOut className="relative z-10 h-5 w-5" />
                        </motion.button>
                    )}
                </div>
            </motion.div>

            {/* Floating Elements for visual interest */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/4 left-1/4 -z-0 h-96 w-96 rounded-full bg-primary/10 blur-[100px]"
            />
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-1/4 right-1/4 -z-0 h-96 w-96 rounded-full bg-accent/5 blur-[100px]"
            />
        </section>
    );
}
