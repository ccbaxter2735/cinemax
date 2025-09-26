import React from "react";
import { useNavigate } from "react-router-dom";

const Header = ({ username }) => {
  const navigate = useNavigate();

  const handleHome = () => {
    navigate("/");
  };

  const handleLogout = async () => {
    try {
      // Supprime token localStorage
      localStorage.removeItem("token");
      navigate("/login"); // Redirige vers page login
    } catch (error) {
      console.error("Erreur déconnexion :", error);
    }
  };

  return (
    <header className="w-full h-20 bg-gradient-to-r from-green-600 to-green-400 flex items-center justify-between px-8 shadow-lg">
      {/* Logo */}
      <button className="text-white text-3xl font-bold tracking-wide" onClick={handleHome}>
        CINEMAX
      </button>

      {/* User info + logout */}
      <div className="flex items-center gap-4">
        <span className="text-white text-lg font-medium">
          Bonjour, <span className="font-bold">{username}</span>
        </span>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-white text-green-700 font-semibold rounded-lg shadow hover:bg-green-50 transition"
        >
          Déconnexion
        </button>
      </div>
    </header>
  );
};

export default Header;
