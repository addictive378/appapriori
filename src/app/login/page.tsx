"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Lock } from "lucide-react";
import axios from "axios";
import { AuthCard } from "@/components/ui/AuthCard";
import { AuthInput } from "@/components/ui/AuthInput";
import { AuthButton } from "@/components/ui/AuthButton";

import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/auth/login", {
        username: formData.username,
        password: formData.password,
      });

      if (response.data.access_token) {
        // Use login from context
        login(response.data.access_token, response.data.user);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 relative overflow-hidden">
      {/* Background Gradient & Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-indigo-950/20" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.15),transparent_50%)]" />

      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-[100px] animate-pulse delay-1000" />

      <AuthCard
        title="Welcome Back!"
        subtitle="Login to access your dashboard"
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
            label="Username or Email"
            placeholder="Enter your username"
            icon={User}
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            required
          />

          <AuthInput
            id="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            icon={Lock}
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />

          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center space-x-2 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-primary focus:ring-primary/50 focus:ring-offset-0 transition-all cursor-pointer"
                checked={formData.rememberMe}
                onChange={(e) =>
                  setFormData({ ...formData, rememberMe: e.target.checked })
                }
              />
              <span className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                Remember me
              </span>
            </label>
            {/* <Link
                            href="#"
                            className="text-sm text-accent hover:text-accent/80 transition-colors"
                        >
                            Forgot Password?
                        </Link> */}
          </div>

          <AuthButton type="submit" isLoading={isLoading}>
            Login
          </AuthButton>

          <div className="mt-6 text-center text-sm text-zinc-400">
            Don&apos;t have an account?{" "}
            {/*<Link
                            href="/register"
                            className="text-accent hover:text-accent/80 font-medium transition-colors hover:underline"
                        >
                            Register Here
                        </Link>*/}
          </div>
        </form>
      </AuthCard>
    </div>
  );
}
