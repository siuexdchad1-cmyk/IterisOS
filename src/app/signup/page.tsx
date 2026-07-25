"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Cpu, Lock, Mail, User, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || loading) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else if (data.session) {
      router.push("/");
      router.refresh();
    } else {
      setSuccess("Account created successfully! Redirecting...");
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1500);
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0D14] text-gray-100 flex items-center justify-center px-4 py-12 selection:bg-[#5EE0FF]/30 selection:text-[#5EE0FF]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md space-y-6"
      >
        {/* Header Logo & Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#5EE0FF]/10 border border-[#5EE0FF]/30 text-[#5EE0FF] mb-2 shadow-[0_0_20px_rgba(94,224,255,0.15)]">
            <Cpu className="w-6 h-6" />
          </div>
          <h1 className="font-display font-extrabold text-2xl md:text-3xl text-white tracking-tight">
            Create Your <span className="text-[#5EE0FF]">Account</span>
          </h1>
          <p className="text-xs text-gray-400 font-mono">
            Get started with autonomous goal & meeting intelligence
          </p>
        </div>

        {/* Signup Form Card */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-5">
          {error && (
            <div className="flex items-start space-x-2 p-3 rounded-xl bg-[#FF5C5C]/10 border border-[#FF5C5C]/30 text-[#FF5C5C] text-xs font-mono">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-start space-x-2 p-3 rounded-xl bg-[#3DDC84]/10 border border-[#3DDC84]/30 text-[#3DDC84] text-xs font-mono">
              <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-gray-300 block">Full Name</label>
              <div className="relative flex items-center rounded-xl bg-black/60 border border-white/15 focus-within:border-[#5EE0FF] transition-colors p-2.5">
                <User className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-gray-300 block">Email address</label>
              <div className="relative flex items-center rounded-xl bg-black/60 border border-white/15 focus-within:border-[#5EE0FF] transition-colors p-2.5">
                <Mail className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-gray-300 block">Password</label>
              <div className="relative flex items-center rounded-xl bg-black/60 border border-white/15 focus-within:border-[#5EE0FF] transition-colors p-2.5">
                <Lock className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-[#5EE0FF] hover:bg-[#5EE0FF]/90 text-black font-mono text-xs font-bold transition-all shadow-[0_0_20px_rgba(94,224,255,0.25)] flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account…</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

          <div className="pt-3 border-t border-white/10 text-center text-xs font-mono text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-[#5EE0FF] hover:underline font-semibold">
              Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
