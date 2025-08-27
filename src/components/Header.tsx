import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="py-12 text-center">
      <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
        <h1 className="text-6xl font-bold tracking-wider">
          <span className="text-yellow-400">YG</span>
          <span className="text-blue-400">O</span>
          <span className="text-red-400">dle</span>
        </h1>
      </Link>
      <div className="text-center mt-4">
        <p className="text-xl text-gray-300 mb-2">A DAILY YU-GI-OH! WORDLE</p>
      </div>
    </header>
  );
};

export default Header;
