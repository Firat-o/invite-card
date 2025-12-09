"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LeafAnimation from "../components/LeafAnimation";
import Form from "@/components/Form";

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
    <div className="relative min-h-screen overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src="/InviteCard.svg"
          className="object-cover w-full h-full opacity-40 mix-blend-multiply"
          alt="Background"
        />
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6 sm:p-10 gap-8">
        <LeafAnimation />
        
        <div className="glass-card px-8 py-12 sm:px-12 text-center max-w-lg w-full fade-in-up">
          <h2 className="text-2xl sm:text-3xl text-[#5c7c59] mb-4">
            Wir laden dich herzlich ein zur
          </h2>
          
          <h1 className="text-5xl sm:text-6xl text-[#2d3748] mb-10 leading-tight">
            Hochzeitsfeier
          </h1>
          
          <div className="space-y-3 text-xl tracking-wide border-t border-[#8fab8c]/30 pt-8">
            <p>
              <span className="font-semibold text-[#5c7c59]">Datum:</span> 11. Oktober 2024
            </p>
            <p>
              <span className="font-semibold text-[#5c7c59]">Ort:</span> Iserlohn, 58636
            </p>
          </div>
        </div>
        
        <div className="w-full max-w-lg fade-in-up" style={{ animationDelay: '0.2s' }}>
          <Form />
        </div>
      </main>
    </div>
  );
}
