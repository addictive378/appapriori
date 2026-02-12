"use client";

import { useState } from "react";
import Hero from "@/components/Hero";
import Dashboard from "@/components/Dashboard";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";

export default function Home() {
  const [showDashboard, setShowDashboard] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleStart = () => {
    if (user) {
      setShowDashboard(true);
    } else {
      router.push("/login");
    }
  }

  return (
    <AuthGuard>
      <main className="flex min-h-screen flex-col items-center justify-between bg-background text-foreground overflow-x-hidden">
        <AnimatePresence mode="wait">
          {!showDashboard ? (
            <motion.div
              key="hero"
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <Hero onStart={handleStart} />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <Dashboard onBack={() => setShowDashboard(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </AuthGuard>
  );
}

