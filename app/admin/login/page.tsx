"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LockClosedIcon, UserIcon, KeyIcon, ClipboardDocumentIcon, CheckIcon } from "@heroicons/react/24/outline";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null); // Welches Feld wurde kopiert?
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin/dashboard");
    } catch (err) {
      setError("Zugriff verweigert. Daten prüfen.");
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    // Nach 2 Sekunden Reset
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-[350px] shadow-2xl shadow-[#5c7c59]/10 border border-[#5c7c59]/20 relative overflow-hidden rounded-sm"
      >
        {/* Deko-Linie */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-[#5c7c59]" />

        <div className="p-8 pb-6">
          <div className="flex justify-center mb-6 text-[#5c7c59]">
            <LockClosedIcon className="w-8 h-8 opacity-80" />
          </div>

          <h1 className="text-2xl font-serif text-[#1a1a1a] mb-1 text-center italic">Admin Access</h1>
          <p className="text-center text-[10px] text-[#5c7c59]/60 uppercase tracking-[0.2em] mb-8">
            Restricted Area
          </p>
          
          <form onSubmit={handleLogin} className="space-y-5 relative z-10">
            <div className="relative group">
              <UserIcon className="w-4 h-4 absolute left-0 top-3 text-[#5c7c59]/40 group-focus-within:text-[#5c7c59] transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full bg-transparent border-b border-[#5c7c59]/20 py-2 pl-7 focus:outline-none focus:border-[#5c7c59] transition-colors text-sm text-[#2d3748] placeholder:text-[#5c7c59]/30"
              />
            </div>
            <div className="relative group">
              <KeyIcon className="w-4 h-4 absolute left-0 top-3 text-[#5c7c59]/40 group-focus-within:text-[#5c7c59] transition-colors" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Passwort"
                className="w-full bg-transparent border-b border-[#5c7c59]/20 py-2 pl-7 focus:outline-none focus:border-[#5c7c59] transition-colors text-sm text-[#2d3748] placeholder:text-[#5c7c59]/30"
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-red-500 text-xs text-center bg-red-50 p-2 rounded"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              className="w-full bg-[#5c7c59] text-white py-3 uppercase tracking-[0.2em] text-xs font-bold hover:bg-[#4a6347] transition-all shadow-lg shadow-[#5c7c59]/20 hover:shadow-xl hover:scale-[1.01] mt-2"
            >
              Login
            </button>
          </form>
        </div>

        {/* === IMPROVED DEMO CREDENTIALS BOX === */}
        <div className="bg-[#5c7c59]/5 border-t border-[#5c7c59]/10 p-5">
          <p className="text-[9px] uppercase tracking-widest text-[#5c7c59]/60 mb-3 text-center font-bold">
            Click to Copy Credentials
          </p>
          
          <div className="space-y-2">
            {/* Email Copy Row */}
            <div 
              onClick={() => copyToClipboard("admin@firat-portfolio.de", "email")}
              className="flex items-center justify-between bg-white border border-[#5c7c59]/10 p-2 rounded cursor-pointer hover:border-[#5c7c59]/40 transition-all group active:scale-[0.98]"
            >
              <div className="flex flex-col overflow-hidden">
                <span className="text-[9px] text-[#5c7c59]/50 uppercase tracking-wider">User</span>
                <span className="text-xs font-mono text-[#5c7c59] truncate">admin@firat-portfolio.de</span>
              </div>
              <div className="text-[#5c7c59]/40 group-hover:text-[#5c7c59]">
                {copiedField === "email" ? <CheckIcon className="w-4 h-4 text-green-600" /> : <ClipboardDocumentIcon className="w-4 h-4" />}
              </div>
            </div>

            {/* Password Copy Row */}
            <div 
              onClick={() => copyToClipboard("demo123", "pass")}
              className="flex items-center justify-between bg-white border border-[#5c7c59]/10 p-2 rounded cursor-pointer hover:border-[#5c7c59]/40 transition-all group active:scale-[0.98]"
            >
              <div className="flex flex-col">
                <span className="text-[9px] text-[#5c7c59]/50 uppercase tracking-wider">Pass</span>
                <span className="text-xs font-mono text-[#5c7c59]">demo123</span>
              </div>
              <div className="text-[#5c7c59]/40 group-hover:text-[#5c7c59]">
                {copiedField === "pass" ? <CheckIcon className="w-4 h-4 text-green-600" /> : <ClipboardDocumentIcon className="w-4 h-4" />}
              </div>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
