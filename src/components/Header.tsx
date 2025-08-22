import React from "react";

const Header: React.FC = () => (
  <header className="bg-yugiohBlue text-yugiohGold py-6 shadow-lg text-center">
    <h1 className="text-4xl font-bold tracking-widest drop-shadow-lg mb-2">YGOdle</h1>
    <p className="text-sm opacity-80">Guess the Yu-Gi-Oh! card in 6 tries</p>
  </header>
);

export default Header;
