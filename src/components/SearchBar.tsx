import React, { useState, useEffect, useRef } from "react";
import { searchCards } from "../services/cardService";
import type { YugiohCard, GameMode } from "../types/game";

interface SearchBarProps {
  onCardSelect: (card: YugiohCard) => void;
  disabled?: boolean;
  gameMode: GameMode;
  excludeCardIds?: number[];
}

const SearchBar: React.FC<SearchBarProps> = ({ onCardSelect, disabled = false, gameMode, excludeCardIds = [] }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<YugiohCard[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoading(true);
      const results = await searchCards(query, gameMode, excludeCardIds);
      setSuggestions(results);
      setShowSuggestions(true);
      setIsLoading(false);
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [query, gameMode, excludeCardIds]);

  const handleCardSelect = (card: YugiohCard) => {
    onCardSelect(card);
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="w-full mx-auto mt-6 relative">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={`Search for a ${gameMode.slice(0, -1)}...`}
        disabled={disabled}
        className="w-full px-4 py-3 rounded-lg border-2 border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed text-lg placeholder-gray-400"
      />
      
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-400"></div>
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-gray-800 border-2 border-gray-600 rounded-lg shadow-xl max-h-80 overflow-y-auto">
          {suggestions.map((card) => (
            <button
              key={card.id}
              onClick={() => handleCardSelect(card)}
              className="w-full px-4 py-3 text-left text-white hover:bg-gray-700 border-b border-gray-600 last:border-b-0 focus:outline-none focus:bg-gray-700 transition-colors flex items-center space-x-3"
            >
              {/* Card Image */}
              {card.card_images && card.card_images.length > 0 && (
                <img
                  src={card.card_images[0].image_url_small}
                  alt={card.name_en}
                  className="w-12 h-16 object-cover rounded border shadow-sm flex-shrink-0"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
              
              {/* Card Info */}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white truncate">{card.name_en}</div>
                <div className="text-sm text-gray-400">
                  {card.humanreadablecardtype} • {card.race}
                    {` • ATK: ${card.atk ?? 0}`}
                    {` • DEF: ${card.def ?? 0}`}
                    {` • LV: ${card.level ?? 0}`}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {showSuggestions && suggestions.length === 0 && query.length >= 2 && !isLoading && (
        <div className="absolute z-50 w-full mt-1 bg-gray-800 border-2 border-gray-600 rounded-lg shadow-xl p-4 text-center text-gray-400">
          No cards found for "{query}"
        </div>
      )}
    </div>
  );
};

export default SearchBar;
