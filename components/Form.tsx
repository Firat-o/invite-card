import { EnvelopeIcon, CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { FormEvent, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

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

  return (
    <div className="w-full max-w-md mx-auto mt-12 font-serif">
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-6">
        
        {/* === Vereinfachtes und elegantes Input-Feld für den Namen === */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Dein Name
          </label>
          <input
            id="name"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            type="text"
            pattern="[A-Za-z\u00C0-\u024F\s]*"
            placeholder="Bitte gib deinen vollen Namen ein"
            required
            className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-[#7eaa79] focus:border-transparent
                       transition-all duration-300 placeholder:text-gray-400"
          />
        </div>

        {/* === Vereinfachtes und elegantes Input-Feld für die Begleitperson === */}
        <div>
          <label htmlFor="guest" className="block text-sm font-medium text-gray-700 mb-1">
            Deine Begleitung (optional)
          </label>
          <input
            id="guest"
            value={guestInput}
            onChange={(e) => setGuestInput(e.target.value)}
            type="text"
            placeholder="Name der Begleitperson"
            className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-[#7eaa79] focus:border-transparent
                       transition-all duration-300 placeholder:text-gray-400"
          />
        </div>

        {/* === Der neue, saubere Button === */}
        <button
          disabled={isButtonDisabled}
          type="submit"
          // Wir wenden die Klasse .elegant-button aus globals.css an
          // und nutzen Tailwinds `disabled:`-Modifikator für den Zustand.
          className="elegant-button w-full flex items-center justify-center gap-x-3
                     disabled:bg-gray-400 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="loader"></span>
          ) : success ? (
            <>
              <CheckCircleIcon className="w-6 h-6"/>
              <span>Gesendet!</span>
            </>
          ) : (
            <>
              <EnvelopeIcon className="w-6 h-6" />
              <span>Bestätigen</span>
            </>
          )}
        </button>
      </form>

      {/* === Verbesserte Feedback-Nachrichten === */}
      {error && (
        <div className="flex items-center gap-x-3 mt-4 p-3 rounded-lg bg-red-100 text-red-800">
          <ExclamationCircleIcon className="w-6 h-6"/>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

export default Form;
