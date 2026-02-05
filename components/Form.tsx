"use client";

import { FormEvent, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircleIcon, ExclamationCircleIcon, UserIcon, UserMinusIcon } from "@heroicons/react/24/outline";
import { SparklesIcon } from "@heroicons/react/24/solid"; // Für Kind

type GuestType = "none" | "adult" | "child";

export default function Form() {
  const [nameInput, setNameInput] = useState("");
  const [guestName, setGuestName] = useState("");
  const [status, setStatus] = useState<"accepted" | "declined">("accepted");
  const [guestType, setGuestType] = useState<GuestType>("none"); // NEU: Typ der Begleitung
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Button ist disabled, wenn Name fehlt ODER (Begleitung gewählt aber kein Name eingetragen)
  const isButtonDisabled = !nameInput || (guestType !== "none" && !guestName) || loading || success;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isButtonDisabled) return;

    setLoading(true);
    setError("");

    try {
      await addDoc(collection(db, "users"), {
        name: nameInput.trim(),
        // Wir speichern Name nur, wenn auch ein Typ gewählt wurde
        guest: guestType === "none" ? "" : guestName.trim(),
        guestType: status === "declined" ? "none" : guestType, // Bei Absage keine Begleitung
        status: status,
        timestamp: new Date(),
      });

      setSuccess(true);
      setNameInput("");
      setGuestName("");
      setGuestType("none");

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

      {/* BEGLEITUNG LOGIK (Nur bei Zusage) */}
      <AnimatePresence>
        {status === "accepted" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6 overflow-hidden"
          >
            {/* 1. TYP AUSWAHL (Segmented Control) */}
            <div className="flex flex-col items-center gap-3">
              <span className="text-[10px] uppercase tracking-widest text-[#5c7c59]/40">Begleitung?</span>
              <div className="flex bg-[#5c7c59]/5 p-1 rounded-full border border-[#5c7c59]/10">
                
                <button
                  type="button"
                  onClick={() => setGuestType("none")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase font-bold tracking-wider transition-all ${
                    guestType === "none" ? "bg-white text-[#5c7c59] shadow-sm" : "text-[#5c7c59]/50 hover:text-[#5c7c59]"
                  }`}
                >
                  <UserMinusIcon className="w-3 h-3" /> Solo
                </button>

                <button
                  type="button"
                  onClick={() => setGuestType("adult")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase font-bold tracking-wider transition-all ${
                    guestType === "adult" ? "bg-white text-[#5c7c59] shadow-sm" : "text-[#5c7c59]/50 hover:text-[#5c7c59]"
                  }`}
                >
                  <UserIcon className="w-3 h-3" /> +1 Person
                </button>

                <button
                  type="button"
                  onClick={() => setGuestType("child")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase font-bold tracking-wider transition-all ${
                    guestType === "child" ? "bg-white text-[#5c7c59] shadow-sm" : "text-[#5c7c59]/50 hover:text-[#5c7c59]"
                  }`}
                >
                  <SparklesIcon className="w-3 h-3" /> Kind
                </button>
              </div>
            </div>

            {/* 2. NAME INPUT (Nur wenn Typ gewählt) */}
            {guestType !== "none" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative group z-0 w-full"
              >
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder=" "
                  className="block py-3 px-0 w-full text-base text-center text-[#2d3748] bg-transparent border-0 border-b border-[#5c7c59]/30 focus:border-[#5c7c59] focus:outline-none peer transition-colors"
                />
                <label className="absolute text-xs tracking-[0.2em] uppercase text-[#5c7c59]/50 duration-300 transform top-3 -z-10 origin-center left-0 right-0 text-center peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-8 peer-focus:text-[#5c7c59] peer-[:not(:placeholder-shown)]:-translate-y-8">
                  {guestType === "child" ? "Name des Kindes" : "Name der Begleitung"}
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
