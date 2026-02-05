"use client";

import { FormEvent, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircleIcon, UserIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { SparklesIcon } from "@heroicons/react/24/solid";

export default function Form() {
  const [nameInput, setNameInput] = useState("");
  const [guestNames, setGuestNames] = useState(""); // Namen aller Begleitungen
  const [status, setStatus] = useState<"accepted" | "declined">("accepted");
  
  // NEU: Zähler statt Typ-Auswahl
  const [adultCount, setAdultCount] = useState(0);
  const [childCount, setChildCount] = useState(0);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const totalGuests = adultCount + childCount;

  // Validation: Button disabled wenn Name fehlt ODER (Gäste > 0 aber keine Namen eingetragen)
  const isButtonDisabled = !nameInput || (totalGuests > 0 && !guestNames) || loading || success;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isButtonDisabled) return;

    setLoading(true);
    setError("");

    try {
      await addDoc(collection(db, "users"), {
        name: nameInput.trim(),
        // Wir speichern die Anzahl UND die Namen
        guests: {
            adults: status === "declined" ? 0 : adultCount,
            children: status === "declined" ? 0 : childCount,
            names: status === "declined" ? "" : guestNames.trim()
        },
        status: status,
        timestamp: new Date(),
      });

      setSuccess(true);
      // Reset Form
      setNameInput("");
      setGuestNames("");
      setAdultCount(0);
      setChildCount(0);

      setTimeout(() => {
        setSuccess(false);
        setStatus("accepted");
      }, 5000);

    } catch (e) {
      console.error("Error:", e);
      setError("Fehler beim Senden.");
    } finally {
      setLoading(false);
    }
  };

  // Helper für Counter-Buttons
  const Counter = ({ count, setCount, icon: Icon, label }: any) => (
    <div className="flex flex-col items-center gap-2">
      <span className="text-[10px] uppercase tracking-widest text-[#5c7c59]/60">{label}</span>
      <div className="flex items-center gap-3 bg-white border border-[#5c7c59]/20 rounded-full px-2 py-1 shadow-sm">
        <button 
          type="button"
          onClick={() => setCount(Math.max(0, count - 1))}
          className="w-6 h-6 flex items-center justify-center text-[#5c7c59] hover:bg-[#5c7c59]/10 rounded-full transition-colors"
          disabled={count === 0}
        >
          <MinusIcon className="w-3 h-3" />
        </button>
        <span className="w-4 text-center font-serif text-lg text-[#1a1a1a] leading-none">{count}</span>
        <button 
          type="button"
          onClick={() => setCount(count + 1)}
          className="w-6 h-6 flex items-center justify-center text-[#5c7c59] hover:bg-[#5c7c59]/10 rounded-full transition-colors"
        >
          <PlusIcon className="w-3 h-3" />
        </button>
      </div>
      <Icon className={`w-4 h-4 text-[#5c7c59]/40 ${count > 0 ? "text-[#5c7c59]" : ""}`} />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-10 mt-8 font-sans">
      
      {/* STATUS TOGGLE */}
      <div className="flex gap-4 justify-center">
        <button
          type="button"
          onClick={() => setStatus("accepted")}
          className={`px-6 py-2 text-xs uppercase tracking-widest border transition-all duration-300 ${
            status === "accepted" ? "bg-[#5c7c59] text-white border-[#5c7c59]" : "text-[#5c7c59]/60 border-[#5c7c59]/20 hover:border-[#5c7c59]"
          }`}
        >
          Zusage
        </button>
        <button
          type="button"
          onClick={() => setStatus("declined")}
          className={`px-6 py-2 text-xs uppercase tracking-widest border transition-all duration-300 ${
            status === "declined" ? "bg-[#8b4513] text-white border-[#8b4513]" : "text-[#5c7c59]/60 border-[#5c7c59]/20 hover:border-[#8b4513]/50 hover:text-[#8b4513]"
          }`}
        >
          Absage
        </button>
      </div>

      {/* INPUT: HAUPTNAME */}
      <div className="relative group z-0 w-full">
        <input
          type="text"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          required
          placeholder=" "
          className="block py-3 px-0 w-full text-base text-center text-[#2d3748] bg-transparent border-0 border-b border-[#5c7c59]/30 focus:border-[#5c7c59] focus:outline-none peer transition-colors"
        />
        <label className="absolute text-xs tracking-[0.2em] uppercase text-[#5c7c59]/50 duration-300 transform top-3 -z-10 origin-center left-0 right-0 text-center peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-8 peer-focus:text-[#5c7c59] peer-[:not(:placeholder-shown)]:-translate-y-8">
          Dein vollständiger Name
        </label>
      </div>

      {/* COUNTER SECTION (Nur bei Zusage) */}
      <AnimatePresence>
        {status === "accepted" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-8 overflow-hidden"
          >
            {/* COUNTERS */}
            <div className="flex justify-center gap-12 pt-4">
              <Counter count={adultCount} setCount={setAdultCount} icon={UserIcon} label="Begleitung" />
              <Counter count={childCount} setCount={setChildCount} icon={SparklesIcon} label="Kinder" />
            </div>

            {/* NAMEN INPUT (Nur wenn Zähler > 0) */}
            {totalGuests > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative group z-0 w-full"
              >
                <input
                  type="text"
                  value={guestNames}
                  onChange={(e) => setGuestNames(e.target.value)}
                  placeholder=" "
                  className="block py-3 px-0 w-full text-base text-center text-[#2d3748] bg-transparent border-0 border-b border-[#5c7c59]/30 focus:border-[#5c7c59] focus:outline-none peer transition-colors"
                />
                <label className="absolute text-xs tracking-[0.2em] uppercase text-[#5c7c59]/50 duration-300 transform top-3 -z-10 origin-center left-0 right-0 text-center peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-8 peer-focus:text-[#5c7c59] peer-[:not(:placeholder-shown)]:-translate-y-8">
                  Namen der Begleitungen
                </label>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-2">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isButtonDisabled}
          className={`w-full py-4 uppercase tracking-[0.25em] text-xs font-bold transition-all duration-500 shadow-xl 
            ${status === "accepted" ? "bg-[#5c7c59] text-white shadow-[#5c7c59]/10" : "bg-[#8b4513] text-white shadow-[#8b4513]/10"}
            disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
          `}
        >
          {loading ? "..." : success ? (
            <span className="flex items-center justify-center gap-2"><CheckCircleIcon className="w-4 h-4" /> Gesendet</span>
          ) : (
            status === "accepted" ? "Zusage bestätigen" : "Absage senden"
          )}
        </motion.button>
      </div>

    </form>
  );
}
