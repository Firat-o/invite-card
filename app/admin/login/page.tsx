"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebase"; // Pfad anpassen falls nötig
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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
    <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 md:p-12 shadow-2xl shadow-[#5c7c59]/10 max-w-sm w-full border border-[#5c7c59]/20"
      >
        <h1 className="text-2xl font-serif text-[#1a1a1a] mb-8 text-center italic">Admin Access</h1>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full bg-transparent border-b border-[#5c7c59]/30 py-2 focus:outline-none focus:border-[#5c7c59] transition-colors text-center"
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Passwort"
              className="w-full bg-transparent border-b border-[#5c7c59]/30 py-2 focus:outline-none focus:border-[#5c7c59] transition-colors text-center"
            />
          </div>

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[#5c7c59] text-white py-3 uppercase tracking-[0.2em] text-xs font-bold hover:bg-[#4a6347] transition-colors mt-4"
          >
            Login
          </button>
        </form>
      </motion.div>
    </div>
  );
}
