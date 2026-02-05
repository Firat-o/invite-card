"use client";

import { FormEvent, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircleIcon, ExclamationCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

export default function Form() {
  const [nameInput, setNameInput] = useState("");
  const [guestInput, setGuestInput] = useState("");
  const [status, setStatus] = useState<"accepted" | "declined">("accepted"); // NEU: Status
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const isButtonDisabled = !nameInput || loading || success;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isButtonDisabled) return;

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await addDoc(collection(db, "users"), {
        name: nameInput.trim(),
        guest: status === "accepted" ? guestInput.trim() : "", // Keine Begleitung bei Absage
        status: status, // Speichern wir in der DB
        timestamp: new Date(),
      });

      setSuccess(true);
      setNameInput("");
      setGuestInput("");
      // Status resetten wir nicht sofort, damit das UI ruhig bleibt

      setTimeout(() => {
        setSuccess(false);
        setStatus("accepted"); // Reset nach 5s
      }, 5000);

    } catch (e) {
      console.error("Error adding document:", e);
      setError("Fehler beim Senden. Bitte versuchen Sie es erneut.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-10 mt-8 font-sans">
      
      {/* === NEU: STATUS WAHL (ZUSAGE / ABSAGE) === */}
      <div className="flex gap-4 justify-center">
        <button
          type="button"
          onClick={() => setStatus("accepted")}
          className={`px-6 py-2 text-xs uppercase tracking-widest border transition-all duration-300 ${
            status === "accepted" 
              ? "bg-[#5c7c59] text-white border-[#5c7c59]" 
              : "text-[#5c7c59]/60 border-[#5c7c59]/20 hover:border-[#5c7c59]"
          }`}
        >
          Zusage
        </button>
        <button
          type="button"
          onClick={() => setStatus("declined")}
          className={`px-6 py-2 text-xs uppercase tracking-widest border transition-all duration-300 ${
            status === "declined" 
              ? "bg-[#8b4513] text-white border-[#8b4513]" // Rostrot für Absage (passend zum Grün)
              : "text-[#5c7c59]/60 border-[#5c7c59]/20 hover:border-[#8b4513]/50 hover:text-[#8b4513]"
          }`}
        >
          Absage
        </button>
      </div>

      {/* === INPUT: NAME === */}
      <div className="relative group z-0 w-full">
        <input
          type="text"
          id="name"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          pattern="[A-Za-z\u00C0-\u024F\s]*"
          required
          placeholder=" "
          className="block py-3 px-0 w-full text-base text-center text-[#2d3748] bg-transparent border-0 border-b border-[#5c7c59]/30 appearance-none focus:outline-none focus:ring-0 focus:border-[#5c7c59] peer transition-colors placeholder-transparent"
        />
        <label
          htmlFor="name"
          className="absolute text-xs tracking-[0.2em] uppercase text-[#5c7c59]/50 duration-300 transform top-3 -z-10 origin-center left-0 right-0 text-center whitespace-nowrap peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8 peer-focus:text-[#5c7c59] peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-8"
        >
          Dein vollständiger Name
        </label>
      </div>

      {/* === INPUT: BEGLEITUNG (Nur sichtbar bei Zusage) === */}
      <AnimatePresence>
        {status === "accepted" && (
          <motion.div 
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 40 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="relative group z-0 w-full overflow-hidden"
          >
            <input
              type="text"
              id="guest"
              value={guestInput}
              onChange={(e) => setGuestInput(e.target.value)}
              placeholder=" "
              className="block py-3 px-0 w-full text-base text-center text-[#2d3748] bg-transparent border-0 border-b border-[#5c7c59]/30 appearance-none focus:outline-none focus:ring-0 focus:border-[#5c7c59] peer transition-colors placeholder-transparent"
            />
            <label
              htmlFor="guest"
              className="absolute text-xs tracking-[0.2em] uppercase text-[#5c7c59]/50 duration-300 transform top-3 -z-10 origin-center left-0 right-0 text-center whitespace-nowrap peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8 peer-focus:text-[#5c7c59] peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-8"
            >
              Begleitung (Optional)
            </label>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex justify-center items-center gap-2 text-red-600/80 text-xs font-medium pt-2"
          >
            <ExclamationCircleIcon className="w-4 h-4" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === SUBMIT BUTTON === */}
      <div className="pt-2">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isButtonDisabled}
          className={`w-full py-4 uppercase tracking-[0.25em] text-xs font-bold transition-all duration-500 shadow-xl 
            ${status === "accepted" 
              ? "bg-[#5c7c59] text-[#F5F5F0] hover:bg-[#4a6347] shadow-[#5c7c59]/10" 
              : "bg-[#8b4513] text-[#F5F5F0] hover:bg-[#6d360f] shadow-[#8b4513]/10"
            }
            ${success ? "!bg-[#5c7c59]" : ""}
            disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
          `}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
            </span>
          ) : success ? (
            <span className="flex items-center justify-center gap-2">
              <CheckCircleIcon className="w-4 h-4" />
              {status === "accepted" ? "Zusage gesendet" : "Absage gesendet"}
            </span>
          ) : (
            status === "accepted" ? "Zusage bestätigen" : "Absage senden"
          )}
        </motion.button>
      </div>

    </form>
  );
}
