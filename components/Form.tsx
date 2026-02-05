"use client";

import { FormEvent, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";

function Form() {
  const [nameInput, setNameInput] = useState("");
  const [guestInput, setGuestInput] = useState("");
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
        guest: guestInput.trim(),
        timestamp: new Date(),
      });

      setSuccess(true);
      setNameInput("");
      setGuestInput("");

      setTimeout(() => {
        setSuccess(false);
      }, 5000);

    } catch (e) {
      console.error("Error adding document:", e);
      setError("Fehler beim Senden. Bitte versuchen Sie es erneut.");
    } finally {
      setLoading(false);
    }
  };
  // ------------------------------------------

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-10 mt-8 font-sans">
      
      <div className="relative group z-0">
        <input
          type="text"
          id="name"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          pattern="[A-Za-z\u00C0-\u024F\s]*"
          required
          placeholder=" "
          className="block py-2.5 px-0 w-full text-sm text-[#2d3748] bg-transparent border-0 border-b border-[#5c7c59]/40 appearance-none focus:outline-none focus:ring-0 focus:border-[#5c7c59] peer transition-colors"
        />
        <label
          htmlFor="name"
          className="peer-focus:font-medium absolute text-sm text-[#5c7c59]/60 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-[#5c7c59] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 tracking-wide uppercase"
        >
          Dein Vollständiger Name
        </label>
      </div>

      <div className="relative group z-0">
        <input
          type="text"
          id="guest"
          value={guestInput}
          onChange={(e) => setGuestInput(e.target.value)}
          placeholder=" "
          className="block py-2.5 px-0 w-full text-sm text-[#2d3748] bg-transparent border-0 border-b border-[#5c7c59]/40 appearance-none focus:outline-none focus:ring-0 focus:border-[#5c7c59] peer transition-colors"
        />
        <label
          htmlFor="guest"
          className="peer-focus:font-medium absolute text-sm text-[#5c7c59]/60 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-[#5c7c59] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 tracking-wide uppercase"
        >
          Begleitung (Optional)
        </label>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 text-red-600/80 text-xs font-medium"
          >
            <ExclamationCircleIcon className="w-4 h-4" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isButtonDisabled}
          className={`w-full py-4 uppercase tracking-[0.25em] text-xs font-bold transition-all duration-500 border
            ${success 
              ? "bg-[#5c7c59] text-white border-[#5c7c59]" 
              : "bg-transparent text-[#5c7c59] border-[#5c7c59] hover:bg-[#5c7c59] hover:text-white"
            }
            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#5c7c59]
          `}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
              <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
            </span>
          ) : success ? (
            <span className="flex items-center justify-center gap-2">
              <CheckCircleIcon className="w-4 h-4" />
              WIR FREUEN UNS
            </span>
          ) : (
            "Zusage bestätigen"
          )}
        </motion.button>
      </div>

    </form>
  );
}

export default Form;
