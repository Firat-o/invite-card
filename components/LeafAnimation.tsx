import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LeafAnimation = () => {
  useEffect(() => {
    // Stellt sicher, dass der Code nur im Browser ausgeführt wird
    if (typeof window !== "undefined") {

      // Wähle alle Elemente mit der Klasse .leaf aus
      const leaves = gsap.utils.toArray(".leaf");

      // Gehe durch jedes Blatt und gib ihm eine EIGENE, ZUFÄLLIGE Animation
      leaves.forEach((leaf) => {
        gsap.to(leaf as Element, { // Hier wird jedes "leaf" einzeln animiert
          scrollTrigger: {
            trigger: "body", // Wir nutzen den body als stabilen Trigger für die ganze Seite
            start: "top top", // Animation beginnt, wenn der Seitenanfang oben ist
            end: "bottom bottom", // und endet, wenn das Seitenende unten ist
            scrub: 1.5, // Die Animation folgt dem Scrollen mit einer leichten Verzögerung -> "smoother"
          },
          // Zufällige Werte für eine natürliche Bewegung
          x: gsap.utils.random(-200, 200), // Bewegt sich zufällig nach links oder rechts
          y: gsap.utils.random(-50, 250),  // Bewegt sich auch zufällig nach oben oder unten
          rotation: gsap.utils.random(-180, 180), // Rotiert in eine zufällige Richtung
          scale: gsap.utils.random(0.8, 1.2),     // Ändert leicht die Größe
          ease: "power1.inOut", // Sorgt für sanfte Beschleunigung und Abbremsung
        });
      });
    }
  }, []);

  return (
    // Der Container bleibt unsichtbar für Mausklicks
    <div className="fixed inset-0 pointer-events-none z-20"> {/* z-20, um über dem Text-BG zu sein */}
      
      {/* Oberes Blatt: Einzigartige Startposition und Skalierung */}
      <div className="leaf absolute top-[5%] left-[10%] w-24 h-24 md:w-32 md:h-32">
        <img src="/leaf.svg" alt="Fallendes Blatt" className="transform -scale-x-100" />
      </div>

      {/* Unteres Blatt: Andere Position und Startrotation */}
      <div className="leaf absolute bottom-[10%] right-[5%] w-20 h-20 md:w-28 md:h-28">
        <img src="/leaf.svg" alt="Fallendes Blatt" className="transform rotate-45" />
      </div>

      {/* Zusätzliches drittes Blatt für mehr Dynamik */}
      <div className="leaf hidden lg:block absolute top-[40%] right-[15%] w-16 h-16 opacity-70">
        <img src="/leaf.svg" alt="Fallendes Blatt" className="transform rotate-12" />
      </div>

    </div>
  );
};

export default LeafAnimation;
