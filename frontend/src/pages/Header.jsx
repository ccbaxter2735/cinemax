// src/components/Header.jsx
import React from "react";

const Header = ({ username }) => {
  return (
    <header className="w-full h-20 bg-green-700 flex items-center justify-between px-6 shadow-md">
      {/* Logo / Nom du site */}
      <h1 className="text-white text-2xl font-roboto tracking-wide">
        CINEMAX
      </h1>

      {/* Nom de l'utilisateur connecté */}
      <span className="text-white text-lg font-roboto">
        {username}
      </span>
    </header>
  );
};

export default Header;
