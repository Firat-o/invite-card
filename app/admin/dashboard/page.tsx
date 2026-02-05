"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/firebase/firebase";
import { collection, getDocs, query, orderBy, deleteDoc, doc, writeBatch } from "firebase/firestore";
import { TrashIcon, ArrowLeftStartOnRectangleIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import Link from "next/link"; 

interface Guest {
  id: string;
  name: string;
  guest: string; 
  status?: "accepted" | "declined";
  timestamp: any;
}

export default function Dashboard() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/admin/login");
      } else {
        setUserEmail(user.email);
        await fetchGuests();
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchGuests = async () => {
    try {
      const q = query(collection(db, "users"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const guestsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Guest[];
      setGuests(guestsData);
    } catch (error) {
      console.error("Error loading guests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  const handleDeleteAll = async () => {
    const confirmDelete = window.confirm(
      "⚠️ ACHTUNG: Willst du wirklich ALLE Gäste unwiderruflich löschen?\n\nDies kann nicht rückgängig gemacht werden!"
    );
    if (!confirmDelete) return;
    setLoading(true);
    try {
      const q = query(collection(db, "users"));
      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      snapshot.docs.forEach((document) => batch.delete(doc(db, "users", document.id)));
      await batch.commit();
      setGuests([]); 
    } catch (error) {
      alert("Fehler beim Löschen.");
    } finally {
      setLoading(false);
    }
  };

  // --- SMARTE GÄSTE ZÄHLUNG ---
  // Filtert "niemand", "keine", "-" etc. heraus
  const countGuests = (g: Guest) => {
    if (g.status === "declined") return 0;
    const guestName = g.guest?.trim().toLowerCase() || "";
    // Liste von Wörtern, die NICHT als Gast zählen sollen
    const invalidGuests = ["", "-", "niemand", "keine", "no one", "none", "nein"];
    return 1 + (invalidGuests.includes(guestName) ? 0 : 1);
  };

  const totalCount = guests.reduce((acc, curr) => acc + countGuests(curr), 0);
  const isDemoUser = userEmail === "admin@firat-portfolio.de";

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#F5F5F0] text-[#5c7c59]">Lade Daten...</div>;

  return (
    <div className="min-h-screen bg-[#F5F5F0] p-6 sm:p-12 font-sans text-[#2d3748]">
      
      {/* HEADER NAVIGATION */}
      <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 hover:bg-white border border-[#5c7c59]/10 rounded-full text-xs font-bold uppercase tracking-widest text-[#5c7c59] transition-all shadow-sm hover:shadow-md group"
        >
          <ArrowLeftIcon className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          <span>Zurück zur Einladung</span>
        </Link>

        <button onClick={handleLogout} className="text-xs uppercase tracking-widest text-[#5c7c59]/60 hover:text-[#5c7c59] flex items-center gap-2 transition-colors">
          Logout <ArrowLeftStartOnRectangleIcon className="w-4 h-4"/>
        </button>
      </div>

      {/* DASHBOARD CARD */}
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
           <div>
            <h1 className="font-serif text-4xl text-[#1a1a1a] mb-2">Gästeliste</h1>
            <p className="text-sm uppercase tracking-widest text-[#5c7c59]">
              Aktuelle Zusagen: <span className="font-bold text-lg">{totalCount}</span> Personen
            </p>
          </div>

          {guests.length > 0 && !isDemoUser && (
            <button 
              onClick={handleDeleteAll} 
              className="text-xs uppercase tracking-widest text-red-400 hover:text-red-600 border border-red-200 hover:border-red-500 px-4 py-2 transition-colors flex items-center gap-2 rounded-sm"
            >
              <TrashIcon className="w-4 h-4"/>
              Liste leeren
            </button>
          )}
        </div>

        {/* TABELLE */}
        <div className="bg-white shadow-xl shadow-[#5c7c59]/5 border border-[#5c7c59]/10 overflow-hidden rounded-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#5c7c59]/5 uppercase tracking-wider text-xs text-[#5c7c59]">
                <tr>
                  {/* FIX: text-center hinzugefügt */}
                  <th className="px-6 py-4 font-semibold w-20 text-center">Status</th>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Begleitung</th>
                  <th className="px-6 py-4 font-semibold text-right">Angemeldet am</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5c7c59]/10">
                {guests.map((guest) => {
                  const isDeclined = guest.status === 'declined';
                  
                  return (
                    <tr 
                      key={guest.id} 
                      // FIX: Style "Editorial Declined" -> Opacity statt Rot
                      className={`transition-all duration-300 ${
                        isDeclined 
                          ? 'bg-gray-50 opacity-50 grayscale hover:opacity-75' 
                          : 'hover:bg-[#5c7c59]/5'
                      }`}
                    >
                      {/* STATUS ICON */}
                      <td className="px-6 py-4 text-center">
                        {isDeclined ? (
                          <div className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-red-200 text-red-400">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                              <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                            </svg>
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#5c7c59]/20 text-[#5c7c59]">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                              <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </td>

                      {/* NAME */}
                      <td className={`px-6 py-4 font-medium ${isDeclined ? 'line-through decoration-gray-300' : 'text-[#1a1a1a]'}`}>
                        {guest.name}
                      </td>

                      {/* BEGLEITUNG */}
                      <td className="px-6 py-4 text-[#2d3748]/80">
                         {isDeclined ? "—" : (guest.guest || "—")}
                      </td>

                      {/* DATUM */}
                      <td className="px-6 py-4 text-right text-xs text-[#5c7c59]/60 font-mono">
                        {guest.timestamp?.seconds 
                          ? new Date(guest.timestamp.seconds * 1000).toLocaleDateString('de-DE', {
                              day: '2-digit', month: '2-digit', year: 'numeric' // Format: 05.02.2026
                            }) 
                          : "Gerade eben"}
                      </td>
                    </tr>
                  );
                })}
                
                {guests.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-[#5c7c59]/50 italic">
                      Die Liste ist noch leer.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
