import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LeafAnimation = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Wähle alle Elemente mit der Klasse .orb aus (umbenannt von .leaf)
      const orbs = gsap.utils.toArray(".orb");

      orbs.forEach((orb) => {
        gsap.to(orb as Element, {
          scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 2, // Etwas langsamerer Scrub für weichere Bewegung
          },
          // Wir bewegen die Orbs weiter, da sie größer und subtiler sind
          x: gsap.utils.random(-300, 300),
          y: gsap.utils.random(-100, 400),
          scale: gsap.utils.random(0.5, 1.5), // Stärkere Skalierungseffekte
          // Rotation ist bei Kreisen nicht nötig, kann aber für minimale Varianz drin bleiben
          rotation: gsap.utils.random(-180, 180), 
          ease: "power1.inOut",
        });
      });
    }
  }, []);

  return (
    // Der Container bleibt unsichtbar für Mausklicks, aber liegt HINTER dem Inhalt (z-0)
    // Damit die Lichter den Text nicht überlagern, sondern im Hintergrund glühen.
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      
      {/* NEU: Statt Bildern nutzen wir "Orbs".
         Das sind div-Container mit extremem Weichzeichner (blur) und geringer Deckkraft.
      */}

      {/* Orb 1: Oben Links - Groß und sehr weich */}
      <div className="orb absolute -top-[10%] -left-[10%] w-64 h-64 md:w-96 md:h-96">
        <div className="w-full h-full rounded-full bg-[#5c7c59] opacity-20 blur-[60px] mix-blend-multiply"></div>
      </div>

      {/* Orb 2: Unten Rechts - Etwas kleiner, anderer Fokus */}
      <div className="orb absolute bottom-[5%] right-[0%] w-48 h-48 md:w-72 md:h-72">
        <div className="w-full h-full rounded-full bg-[#5c7c59] opacity-25 blur-[50px] mix-blend-multiply"></div>
      </div>

      {/* Orb 3: Mitte Rechts - Subtiler Akzent (auch auf Mobile sichtbar) */}
      <div className="orb absolute top-[40%] -right-[5%] w-32 h-32 md:w-56 md:h-56 opacity-60">
        <div className="w-full h-full rounded-full bg-[#5c7c59] opacity-15 blur-[40px] mix-blend-multiply"></div>
      </div>
       
       {/* Orb 4: Zusatz für Desktop unten links */}
      <div className="orb hidden lg:block absolute bottom-[20%] left-[10%] w-40 h-40 opacity-50">
         <div className="w-full h-full rounded-full bg-[#5c7c59] opacity-10 blur-[40px] mix-blend-multiply"></div>
      </div>

    </div>
  );
};

export default LeafAnimation;
