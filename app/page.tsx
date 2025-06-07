"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LeafAnimation from "../components/LeafAnimation";
import Form from "@/components/Form"; // Angenommen, diese Komponente verwendet den neuen Button

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Verbesserte, natürlichere Blatt-Animation
      gsap.to(".leaf", {
        scrollTrigger: {
          trigger: "body", // Löst die Animation über die gesamte Seite aus
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5, // Etwas sanfteres "Scrubbing"
        },
        y: "80vh",   // Bewegt sich auch nach unten
        x: () => Math.random() * 200 - 100, // Zufällige seitliche Bewegung
        rotation: () => Math.random() * 360, // Zufällige Rotation
        ease: "power1.inOut", // Weiche Beschleunigung und Abbremsung
      });
    }
  }, []);

  return (
    // Der relative Container kann bleiben
    <div className="relative min-h-screen">
      {/* Das Hintergrund-SVG ist eine tolle Idee */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src="/InviteCard.svg"
          className="object-cover w-full h-full opacity-80" // Leicht transparent für einen weicheren Look
          alt="Hintergrund-Design"
        />
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center p-6 sm:p-10 min-h-screen">
        <LeafAnimation />
        
        {/* Verbesserter Text-Container für einen edleren Look */}
        <div
          className="text-center space-y-4 text-gray-800
            bg-white/70 backdrop-blur-sm
            p-6 sm:p-8 rounded-xl shadow-lg" // Größerer Radius und weicherer Schatten
        >
          {/* Die importierte Schriftart hier anwenden */}
          <h2
            style={{ fontFamily: "'Lucida Handwriting', cursive" }}
            className="text-3xl md:text-4xl lg:text-5xl"
          >
            Wir laden dich herzlich zu unserer
          </h2>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif mt-2">
            islamischen Hochzeitsfeier ein
          </h1>
          <p className="text-xl md:text-2xl font-serif !mt-8"> {/* !mt-8 überschreibt space-y-4 für mehr Abstand */}
            Datum: <strong>11. Oktober 2024</strong> <br />
            Ort: <strong>Iserlohn, 58636</strong>
          </p>
        </div>
        
        <Form /> {/* Stelle sicher, dass der Button in dieser Komponente die Klasse .elegant-button erhält */}
      </main>
    </div>
  );
}
