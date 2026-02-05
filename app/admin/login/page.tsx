"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebase"; 
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LockClosedIcon, UserIcon, KeyIcon } from "@heroicons/react/24/outline";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin/dashboard");
    } catch (err) {
      setError("Zugriff verweigert. Überprüfe deine Daten.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 md:p-12 shadow-2xl shadow-[#5c7c59]/10 max-w-sm w-full border border-[#5c7c59]/20 relative overflow-hidden"
      >
        {/* Deko-Element oben */}
        <div className="absolute top-0 left-0 w-full h-1 bg-[#5c7c59]" />

        <div className="flex justify-center mb-6 text-[#5c7c59]">
          <LockClosedIcon className="w-8 h-8 opacity-80" />
        </div>

        <h1 className="text-2xl font-serif text-[#1a1a1a] mb-2 text-center italic">Admin Access</h1>
        <p className="text-center text-xs text-[#5c7c59]/60 uppercase tracking-widest mb-8">
          Restricted Area
        </p>
        
        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div className="relative">
            <UserIcon className="w-4 h-4 absolute left-0 top-3 text-[#5c7c59]/40" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full bg-transparent border-b border-[#5c7c59]/30 py-2 pl-6 focus:outline-none focus:border-[#5c7c59] transition-colors text-sm text-[#2d3748]"
            />
          </div>
          <div className="relative">
            <KeyIcon className="w-4 h-4 absolute left-0 top-3 text-[#5c7c59]/40" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Passwort"
              className="w-full bg-transparent border-b border-[#5c7c59]/30 py-2 pl-6 focus:outline-none focus:border-[#5c7c59] transition-colors text-sm text-[#2d3748]"
            />
          </div>

          {error && <p className="text-red-500 text-xs text-center bg-red-50 p-2 rounded">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[#5c7c59] text-white py-3 uppercase tracking-[0.2em] text-xs font-bold hover:bg-[#4a6347] transition-all shadow-lg shadow-[#5c7c59]/20 hover:shadow-xl hover:scale-[1.02]"
          >
            Login
          </button>
        </form>

        {/* === HIER SIND DIE DEMO DATEN === */}
        <div className="mt-10 pt-6 border-t border-dashed border-[#5c7c59]/20 text-center">
          <p className="text-[10px] uppercase tracking-widest text-[#5c7c59]/50 mb-3">
            Portfolio Demo Credentials
          </p>
          <div className="bg-[#5c7c59]/5 p-4 rounded-sm border border-[#5c7c59]/10 text-xs font-mono text-[#5c7c59] space-y-1 select-all cursor-text">
            <p>User: <span className="font-bold">admin@firat-portfolio.de</span></p>
            <p>Pass: <span className="font-bold">demo123</span></p>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
