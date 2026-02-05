"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LeafAnimation from "../components/LeafAnimation"; 
import Form from "@/components/Form";
import { motion } from "framer-motion";
import Link from "next/link"; // NEU
import { LockClosedIcon } from "@heroicons/react/24/outline"; // NEU

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.to(".leaf", {
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 2,
        },
        y: "80vh",
        x: () => Math.random() * 250 - 125,
        rotation: () => Math.random() * 360,
        ease: "power1.inOut",
      });
    }
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#F5F5F0]">
      
      {/* 1. Grain Overlay (Texture) */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-multiply" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      {/* 2. Background Image */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src="/InviteCard.svg"
          className="object-cover w-full h-full opacity-30 mix-blend-multiply grayscale-[20%]"
          alt="Background"
        />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-[#F5F5F0]/80" />
      </div>

      {/* 3. Main Content - Unified Glass Card */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 sm:p-8">
        <LeafAnimation />
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[500px] bg-white/40 backdrop-blur-xl border border-white/40 shadow-2xl shadow-[#5c7c59]/10 p-8 sm:p-12 md:p-16 text-center relative overflow-hidden"
        >
          {/* Dekorative Linie oben */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-[#5c7c59]" />

          <div className="mb-12 space-y-6">
            <p className="font-sans text-xs sm:text-sm uppercase tracking-[0.3em] text-[#5c7c59]">
              Save The Date
            </p>
            
            <h1 className="font-serif text-5xl sm:text-7xl text-[#1a1a1a] italic leading-[0.9]">
              Hochzeit
            </h1>
            
            <p className="font-serif text-xl sm:text-2xl text-[#1a1a1a]/80 mt-2">
              von uns beiden
            </p>
          </div>

          <div className="font-sans text-sm tracking-wide text-[#2d3748] border-y border-[#5c7c59]/20 py-6 mb-10 flex flex-col gap-2">
   <p><span className="font-bold">11. OKTOBER 2024</span> — 14:00 UHR</p>
   <p>SCHLOSS ISERLOHN — 58636</p>
   {/* NEU: DEADLINE */}
   <p className="text-[10px] text-[#5c7c59] uppercase tracking-[0.2em] mt-2 font-bold opacity-80">
     U.A.w.g. bis 01. September
   </p>
</div>

          <Form />

          <div className="mt-12 text-[10px] uppercase tracking-widest opacity-40">
            Wir freuen uns auf euch
          </div>
        </motion.div>
      </main>

      {/* === NEU: ADMIN / DEMO BUTTON (Unten Rechts) === */}
      <Link 
        href="/admin/login" 
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 
                   bg-[#5c7c59] text-white rounded-full 
                   shadow-xl shadow-[#5c7c59]/30 
                   hover:scale-105 hover:bg-[#4a6347] active:scale-95
                   transition-all duration-300 group"
      >
        <div className="bg-white/20 p-1 rounded-full">
           <LockClosedIcon className="w-4 h-4" />
        </div>
        <div className="flex flex-col items-start leading-none">
          <span className="text-[8px] uppercase tracking-widest opacity-80">Portfolio</span>
          <span className="text-[10px] font-bold uppercase tracking-widest">Admin Demo</span>
        </div>
      </Link>

    </div>
  );
}
