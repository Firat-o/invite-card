"use client"; // Marking Home component as a Client Component

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LeafAnimation from "../components/LeafAnimation"; // Import the LeafAnimation component
import Form from "@/components/Form";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.to(".leaf", {
        scrollTrigger: {
          trigger: ".leaf",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
        x: 100,
        rotation: 360,
        duration: 3,
      });
    }
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* SVG Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src="/InviteCard.svg"
          className="object-cover w-full h-full"
          alt="SVG Background"
        />
      </div>

      <main className="flex flex-col items-center justify-center p-10 min-h-screen">
        <LeafAnimation /> {/* Use the LeafAnimation component */}
        <div
          className="text-center space-y-4 z-10 text-[#181717] 
       bg-gradient-to-r from-[#7eaa79]/50 to-[#d5e0cd]/50
          p-4 rounded-lg shadow-md"
        >
          <h2
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 
           font-antic-didone animate-title duration-700 cursor-default animate-title whitespace-nowrap font-serif"
          >
            Wir laden dich herzlich zu unserer
          </h2>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl  font-serif animate-title">
            islamischen Hochzeitsfeier ein
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-serif mt-4">
            Datum der Feier: 11.10.2024 <br />
            Ort: Iserlohn 58636
          </p>
        </div>
        <Form />
      </main>
    </div>
  );
}
