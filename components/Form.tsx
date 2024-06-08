import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { FormEvent, useRef, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

function Form() {
  const [nameInput, setNameInput] = useState("");
  const [guestInput, setGuestInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isButtonDisabled = !nameInput || loading;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const name = nameInput.trim();
    const guest = guestInput.trim();

    if (!name) {
      setErrorMessage("Der Name ist erforderlich.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const docRef = await addDoc(collection(db, "users"), {
        name: name,
        guest: guest,
        timestamp: new Date(),
      });
      console.log("Document written with ID:", docRef.id);

      setNameInput("");
      setGuestInput("");

      // Show success message
      setSuccessMessage(true);

      // Hide success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage(false);
      }, 5000);

    } catch (e) {
      console.error("Error adding document:", e);
      setErrorMessage("Fehler beim Hinzufügen des Eintrags. Bitte versuchen Sie es erneut.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-8 md:w-[400px] relative font-customSerif">
      <form
        className="form-class mt-10 animate-fade-in-3"
        onSubmit={handleSubmit}
      >
        <div
          className="group flex items-center gap-x-4 py-1 pl-4 pr-1 rounded-[9px] bg-gradient-to-r from-[#7eaa79] to-[#a2c29b]
        hover:from-[#89b183] hover:to-[#b1c8b0] relative shadow hover:shadow-lg 
        focus-within:bg-gradient-to-r focus-within:from-[#8fb78b] focus-within:to-[#c3d2c1]
        transition-all duration-700"
        >
          <input
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            type="text"
            placeholder="Dein Name"
            required
            className="w-full text-gray-800 bg-gray-100 
            rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#b1c8b0]
            transition-all duration-700 placeholder-[#939393] group-focus-within:placeholder-[#240c0f] 
            placeholder:transition-colors placeholder:duration-500"
          />
        </div>
        <div
          className="group flex items-center gap-x-4 py-1 pl-4 pr-1 rounded-[9px] 
        bg-gradient-to-r from-[#7eaa79] to-[#a2c29b] hover:from-[#89b183] hover:to-[#b1c8b0] 
        relative shadow hover:shadow-lg focus-within:bg-gradient-to-r focus-within:from-[#8fb78b] focus-within:to-[#c3d2c1]
        transition-all duration-700 mt-6"
        >
          <input
            value={guestInput}
            onChange={(e) => setGuestInput(e.target.value)}
            type="text"
            placeholder="Begleitperson"
            className="w-full text-gray-800 bg-gray-100 rounded-md py-2 px-4 
            focus:outline-none focus:ring-2 focus:ring-[#b1c8b0] transition-all duration-700
            placeholder-[#939393] group-focus-within:placeholder-[#240c0f] placeholder:transition-colors placeholder:duration-500"
          />
        </div>
        <button
          ref={buttonRef}
          disabled={isButtonDisabled}
          type="submit"
          className={`plane-button relative overflow-hidden w-[200px] h-[50px] rounded-md shadow-lg text-white font-semibold text-lg uppercase tracking-wide border-none focus:outline-none transition-all duration-500 mt-6 ${
            isButtonDisabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-[#7eaa79] to-[#a2c29b] hover:from-[#89b183] hover:to-[#b1c8b0]"
          }`}
        >
          {loading ? (
            <span className="loader"></span>
          ) : (
            <>
              <span className="absolute top-0 left-0 w-full h-full bg-white opacity-10 transform scale-x-0 origin-left"></span>
              <span className="absolute top-0 left-0 w-full h-full bg-white opacity-10 transform scale-y-0 origin-top"></span>
              <span className="absolute top-0 left-0 w-full h-full bg-white opacity-10 transform scale-x-0 origin-right"></span>
              <span className="absolute top-0 left-0 w-full h-full bg-white opacity-10 transform scale-y-0 origin-bottom"></span>
              <span className="relative z-10 flex items-center justify-center gap-x-4">
                <EnvelopeIcon className="w-6 h-6 text-[#181818] group-focus-within:text-white group-hover:text-white transition-colors duration-700 " />
                Bestätigen
              </span>
            </>
          )}
        </button>
      </form>
      {successMessage && (
        <div className="text-center text-green-700 mt-4">
          Eintrag erfolgreich, Wir melden uns bei dir 😊!
        </div>
      )}
      {errorMessage && (
        <div className="text-center text-red-700 mt-4">
          {errorMessage}
        </div>
      )}
    </div>
  );
}

export default Form;
