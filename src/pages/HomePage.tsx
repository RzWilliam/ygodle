import React from "react";
import { Link } from "react-router-dom";
import {NextCardTimer} from "../components/NextCardTimer";

const HomePage: React.FC = () => {
  const modes = [
    {
      id: 'monsters',
      title: 'Monsters',
      description: 'Discover today\'s Yu-Gi-Oh! monster',
      icon: '🐉',
      path: '/monsters',
      bgColor: 'bg-orange-600'
    },
    {
      id: 'spells',
      title: 'Spells',
      description: 'Guess today\'s spell card',
      icon: '✨',
      path: '/spells',
      bgColor: 'bg-green-600'
    },
    {
      id: 'traps',
      title: 'Traps',
      description: 'Uncover today\'s trap card',
      icon: '🃏',
      path: '/traps',
      bgColor: 'bg-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold mb-4 tracking-wider">
          <span className="text-yellow-400">YG</span>
          <span className="text-blue-400">O</span>
          <span className="text-red-400">dle</span>
        </h1>
        <p className="text-xl text-gray-300 mb-2">A DAILY YU-GI-OH! WORDLE</p>
      </div>

      {/* Choose a gamemode */}
      <p className="text-xl text-white mb-6">Choose a gamemode</p>

      {/* Game Mode Selection */}
      <div className="w-full max-w-md space-y-4">
        {modes.map((mode) => (
          <Link
            key={mode.id}
            to={mode.path}
            className="block transform hover:scale-105 transition-all duration-200"
          >
            <div className={`${mode.bgColor} bg-opacity-90 hover:bg-opacity-100 rounded-lg p-6 border border-gray-600 hover:border-gray-400 transition-all duration-200`}>
              <div className="flex items-center space-x-4">
                <div className="text-3xl">
                  {mode.icon}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white">{mode.title}</h2>
                  <p className="text-gray-200 text-sm mt-1">
                    {mode.description}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
        <NextCardTimer />
      </div>

      {/* Footer */}
      <div className="mt-12 text-center">
        <p className="text-gray-400 text-sm">
          Track your progress and start collecting! You can also filter what you've already uncovered!
        </p>
      </div>
    </div>
  );
};

export default HomePage;
