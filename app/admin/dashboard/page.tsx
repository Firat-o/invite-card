"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/firebase/firebase";
import { collection, getDocs, query, orderBy, deleteDoc, doc, writeBatch } from "firebase/firestore";
import { TrashIcon, ArrowLeftStartOnRectangleIcon, ArrowLeftIcon, UserIcon, SparklesIcon, UsersIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import Link from "next/link"; 

// --- INTERFACE UPDATE ---
// Damit verstehen wir alte UND neue Daten
interface Guest {
  id: string;
  name: string;
  status?: "accepted" | "declined";
  timestamp: any;
  
  // Alte Datenstruktur (Fallback)
  guest?: string; 
  guestType?: string;
  
  // Neue Datenstruktur (Family Form)
  guests?: {
    adults: number;
    children: number;
    names: string;
  };
}

export default function Dashboard() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) { router.push("/admin/login"); } 
      else { setUserEmail(user.email); await fetchGuests(); }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchGuests = async () => {
    try {
      const q = query(collection(db, "users"), orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);
      const guestsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Guest[];
      setGuests(guestsData);
    } catch (e) { console.error(e); } 
    finally { setLoading(false); }
  };

  const handleLogout = async () => { await signOut(auth); router.push("/admin/login"); };

  const handleDeleteAll = async () => {
    if (!window.confirm("⚠️ ACHTUNG: Wirklich ALLES löschen?")) return;
    setLoading(true);
    try {
      const q = query(collection(db, "users"));
      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      snapshot.docs.forEach((d) => batch.delete(doc(db, "users", d.id)));
      await batch.commit();
      setGuests([]); 
    } catch(e) { alert("Fehler"); }
    finally { setLoading(false); }
  };

  // --- INTELLIGENTE BERECHNUNG ---
  const activeGuests = guests.filter(g => g.status !== "declined");
  
  // 1. Zähle die Haupt-Anmelder (immer 1 pro Zeile)
  const mainGuestsCount = activeGuests.length;

  // 2. Zähle zusätzliche Erwachsene (Unterscheide alt vs. neu)
  const extraAdultsCount = activeGuests.reduce((sum, g) => {
    // Neu: Explizite Anzahl
    if (g.guests?.adults !== undefined) return sum + g.guests.adults;
    // Alt: Wenn Text da ist und Typ nicht 'Kind' -> +1
    if (g.guest && g.guest.trim() !== "" && g.guestType !== 'child') return sum + 1;
    return sum;
  }, 0);

  // 3. Zähle Kinder
  const childrenCount = activeGuests.reduce((sum, g) => {
    // Neu
    if (g.guests?.children !== undefined) return sum + g.guests.children;
    // Alt
    if (g.guestType === 'child') return sum + 1;
    return sum;
  }, 0);

  const totalAdults = mainGuestsCount + extraAdultsCount;
  const totalAll = totalAdults + childrenCount;

  const isDemoUser = userEmail === "admin@firat-portfolio.de";

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#F5F5F0] text-[#5c7c59]">Lade Daten...</div>;

  return (
    <div className="min-h-screen bg-[#F5F5F0] p-4 sm:p-12 font-sans text-[#2d3748]">
      
      {/* HEADER NAV */}
      <div className="max-w-5xl mx-auto mb-6 flex justify-between items-center">
        <Link href="/" className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#5c7c59]/60 hover:text-[#5c7c59] transition-colors">
          <ArrowLeftIcon className="w-3 h-3" /> <span className="hidden sm:inline">Zurück zur Einladung</span><span className="sm:hidden">Zurück</span>
        </Link>
        <button onClick={handleLogout} className="text-[10px] sm:text-xs uppercase tracking-widest text-[#5c7c59]/60 hover:text-[#5c7c59] flex items-center gap-2">
          Logout <ArrowLeftStartOnRectangleIcon className="w-4 h-4"/>
        </button>
      </div>

      <div className="max-w-5xl mx-auto mb-8">
        
        {/* STATISTIK HEADER (Mobile Responsive: Flex-Col) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6 border-b border-[#5c7c59]/10 pb-6">
           <div className="w-full">
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1a1a1a] mb-4">Gästeliste</h1>
            
            {/* KPI KARTEN */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full md:w-auto">
              {/* Gesamt */}
              <div className="bg-[#5c7c59] text-white p-3 rounded-sm shadow-lg shadow-[#5c7c59]/20 flex flex-col items-center justify-center">
                <span className="text-xl sm:text-2xl font-serif font-bold leading-none">{totalAll}</span>
                <span className="text-[8px] sm:text-[10px] uppercase tracking-widest opacity-80 mt-1">Gesamt</span>
              </div>
              
              {/* Erwachsene */}
              <div className="bg-white border border-[#5c7c59]/20 text-[#5c7c59] p-3 rounded-sm flex flex-col items-center justify-center">
                <div className="flex items-center gap-1">
                  <span className="text-xl sm:text-2xl font-serif font-bold leading-none">{totalAdults}</span>
                  <UserIcon className="w-4 h-4 mb-1 opacity-50"/>
                </div>
                <span className="text-[8px] sm:text-[10px] uppercase tracking-widest opacity-60 mt-1">Erw.</span>
              </div>

              {/* Kinder */}
              <div className="bg-white border border-[#5c7c59]/20 text-[#5c7c59] p-3 rounded-sm flex flex-col items-center justify-center">
                <div className="flex items-center gap-1">
                  <span className="text-xl sm:text-2xl font-serif font-bold leading-none">{childrenCount}</span>
                  <SparklesIcon className="w-4 h-4 mb-1 opacity-50"/>
                </div>
                <span className="text-[8px] sm:text-[10px] uppercase tracking-widest opacity-60 mt-1">Kinder</span>
              </div>
            </div>
          </div>

          {/* RESET BUTTON (Nur Desktop oder wenn wichtig) */}
          {guests.length > 0 && !isDemoUser && (
            <button onClick={handleDeleteAll} className="w-full md:w-auto mt-2 md:mt-0 text-xs text-red-400 hover:text-red-600 border border-red-200 hover:bg-red-50 px-4 py-3 md:py-2 rounded-sm flex items-center justify-center gap-2 transition-all">
              <TrashIcon className="w-4 h-4"/> Reset Database
            </button>
          )}
        </div>

        {/* TABELLE (Scrollbar für Mobile) */}
        <div className="bg-white shadow-xl shadow-[#5c7c59]/5 border border-[#5c7c59]/10 rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#5c7c59]/5 uppercase tracking-wider text-xs text-[#5c7c59]">
                <tr>
                  <th className="px-4 py-4 w-12 text-center">Status</th>
                  <th className="px-4 py-4 font-semibold">Name</th>
                  <th className="px-4 py-4 font-semibold">Begleitung</th>
                  {/* Datum auf Mobile ausblenden wenn zu eng */}
                  <th className="px-4 py-4 font-semibold text-right hidden sm:table-cell">Angemeldet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5c7c59]/10">
                {guests.map((guest) => {
                  const isDeclined = guest.status === 'declined';
                  
                  // HELPER: Daten normalisieren (Alt vs Neu)
                  const extraAdults = guest.guests?.adults ?? (guest.guest && guest.guestType !== 'child' ? 1 : 0);
                  const extraKids = guest.guests?.children ?? (guest.guestType === 'child' ? 1 : 0);
                  const namesText = guest.guests?.names || guest.guest || "—";
                  
                  const hasBegleitung = extraAdults > 0 || extraKids > 0;

                  return (
                    <tr key={guest.id} className={`transition-all ${isDeclined ? 'bg-gray-50 opacity-40 grayscale' : 'hover:bg-[#5c7c59]/5'}`}>
                      
                      {/* STATUS */}
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-block w-2.5 h-2.5 rounded-full ${isDeclined ? 'bg-red-400' : 'bg-[#5c7c59]'}`}></span>
                      </td>

                      {/* NAME */}
                      <td className={`px-4 py-4 font-medium text-[#1a1a1a] ${isDeclined && 'line-through decoration-gray-400'}`}>
                        {guest.name}
                      </td>
                      
                      {/* BEGLEITUNG DETAIL */}
                      <td className="px-4 py-4 text-[#2d3748]/80">
                        {isDeclined ? (
                          <span className="text-gray-300 text-xs">—</span>
                        ) : !hasBegleitung ? (
                          <span className="text-[10px] uppercase tracking-wider text-gray-400 border border-gray-100 px-2 py-1 rounded-full">Solo</span>
                        ) : (
                          <div className="flex flex-col gap-1.5">
                              {/* BADGES */}
                              <div className="flex gap-2">
                                  {extraAdults > 0 && (
                                      <span className="flex items-center gap-1 text-[10px] font-bold bg-[#5c7c59]/10 text-[#5c7c59] px-2 py-0.5 rounded-full border border-[#5c7c59]/10">
                                          <UsersIcon className="w-3 h-3"/> +{extraAdults}
                                      </span>
                                  )}
                                  {extraKids > 0 && (
                                      <span className="flex items-center gap-1 text-[10px] font-bold bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full border border-amber-100">
                                          <SparklesIcon className="w-3 h-3"/> +{extraKids}
                                      </span>
                                  )}
                              </div>
                              {/* NAMEN */}
                              {namesText !== "—" && (
                                <span className="text-xs text-gray-500 truncate max-w-[150px] sm:max-w-[250px]" title={namesText}>
                                  {namesText}
                                </span>
                              )}
                          </div>
                        )}
                      </td>

                      {/* DATUM (Hidden on mobile) */}
                      <td className="px-4 py-4 text-right text-xs text-[#5c7c59]/60 font-mono hidden sm:table-cell">
                        {guest.timestamp?.seconds 
                          ? new Date(guest.timestamp.seconds * 1000).toLocaleDateString('de-DE', {day: '2-digit', month: '2-digit'}) 
                          : "Neu"}
                      </td>
                    </tr>
                  );
                })}

                {guests.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-[#5c7c59]/50 italic">
                      Warte auf die erste Anmeldung...
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
