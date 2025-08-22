import React from "react";

interface ShareButtonProps {
  gameWon: boolean;
  attemptCount: number;
  gameMode: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ gameWon, attemptCount, gameMode }) => {
  const handleShare = () => {
    const result = gameWon ? `${attemptCount}/6` : 'X/6';
    const text = `YGOdle ${gameMode} ${result}\n\nGuess the Yu-Gi-Oh! card!\n${window.location.origin}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'YGOdle',
        text: text,
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('Results copied to clipboard!');
    }
  };

  return (
    <button 
      onClick={handleShare}
      className="px-6 py-2 bg-yugiohGold text-yugiohBlue font-bold rounded-lg shadow hover:bg-yellow-400 transition"
    >
      Share Results
    </button>
  );
};

export default ShareButton;
