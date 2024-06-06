import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LeafAnimation = () => {
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
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Top Leaf */}
      <div className="leaf w-36 h-36 absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 md:left-10 xl:left-0 scale-x-[-1]">
        <img src="/leaf.svg" alt="Leaf" />
      </div>

      {/* Bottom Leaf */}
      <div className="leaf w-36 h-36 absolute bottom-0 right-0 md:right-10 lg:right-20 transform translate-x-1/2 translate-y-1/2">
        <img src="/leaf.svg" alt="Leaf" />
      </div>
    </div>
  );
};

export default LeafAnimation;
