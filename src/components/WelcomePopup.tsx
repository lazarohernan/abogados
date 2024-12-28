// Component: WelcomePopup
// Description: Popup that shows up on the user's first login.

import { useEffect, useState } from "react";
import { storage } from "@/lib/storage";

export default function WelcomePopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = storage.get("hasSeenWelcome");

    if (!hasSeenWelcome) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    storage.set("hasSeenWelcome", true);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">¡Bienvenido a LegalIA Honduras!</h2>
        <p className="text-gray-600 mb-4">
          Estamos encantados de que te unas a nosotros. Explora nuestra plataforma para acceder a recursos legales.
        </p>
        <button
          onClick={handleClose}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          ¡Entendido!
        </button>
      </div>
    </div>
  );
}
