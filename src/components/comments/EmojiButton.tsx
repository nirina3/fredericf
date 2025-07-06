import React, { useState, useRef, useEffect } from 'react';
import { Smile, X } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { Theme, EmojiClickData } from 'emoji-picker-react';

interface EmojiButtonProps {
  onEmojiSelect: (emoji: string) => void;
}

const EmojiButton: React.FC<EmojiButtonProps> = ({ onEmojiSelect }) => {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onEmojiSelect(emojiData.emoji);
    setShowPicker(false);
  };

  // Fermer le picker quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current && 
        !pickerRef.current.contains(event.target as Node) &&
        buttonRef.current && 
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        className={`text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full ${
          showPicker ? 'bg-orange-100 text-orange-500' : ''
        }`}
        title="Ajouter un emoji"
      >
        <Smile className="h-5 w-5" />
      </button>

      {showPicker && (
        <div 
          ref={pickerRef}
          className="absolute z-50 bottom-full mb-2 left-0"
        >
          <div className="relative">
            <button 
              className="absolute -top-2 -right-2 bg-gray-200 hover:bg-gray-300 rounded-full p-1 z-10"
              onClick={() => setShowPicker(false)}
            >
              <X className="h-4 w-4" />
            </button>
            <EmojiPicker 
              onEmojiClick={handleEmojiClick} 
              theme={Theme.LIGHT}
              width={320}
              height={400}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EmojiButton;