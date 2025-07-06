import React, { useState, useRef, useEffect } from 'react';
import { Send, Image, Smile, X } from 'lucide-react';
import Button from '../ui/Button';
import EmojiPicker from 'emoji-picker-react';
import { Theme, EmojiClickData } from 'emoji-picker-react';

interface EmojiCommentInputProps {
  onSubmit: (content: string) => void;
  placeholder?: string;
  initialValue?: string;
  allowImages?: boolean;
  maxLength?: number;
}

const EmojiCommentInput: React.FC<EmojiCommentInputProps> = ({
  onSubmit,
  placeholder = 'Ajouter un commentaire...',
  initialValue = '',
  allowImages = false,
  maxLength = 1000
}) => {
  const [content, setContent] = useState(initialValue);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Fermer le picker quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current && 
        !emojiPickerRef.current.contains(event.target as Node) &&
        event.target instanceof Element &&
        !event.target.closest('button')?.classList.contains('emoji-button')
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const newContent = 
      content.substring(0, start) + 
      emojiData.emoji + 
      content.substring(end);
    
    setContent(newContent);
    
    // Focus back to textarea and set cursor position after emoji
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + emojiData.emoji.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 10);
  };

  const handleSubmit = async () => {
    if (!content.trim() || content.length > maxLength) return;

    setIsSubmitting(true);
    try {
      await onSubmit(content);
      setContent('');
      setShowEmojiPicker(false);
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Ajuster automatiquement la hauteur du textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [content]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-start space-x-3">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            rows={1}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
          />
          
          <div className="absolute bottom-3 left-3 flex items-center space-x-2">
            {allowImages && (
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Ajouter une image"
              >
                <Image className="h-5 w-5" />
              </button>
            )}
            <button
              type="button"
              className={`emoji-button text-gray-400 hover:text-gray-600 transition-colors ${
                showEmojiPicker ? 'text-orange-500' : ''
              }`}
              title="Ajouter un emoji"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile className="h-5 w-5" />
            </button>
          </div>
          
          <div className="absolute bottom-3 right-3 text-xs text-gray-400">
            {content.length}/{maxLength}
          </div>
        </div>
        
        <Button
          onClick={handleSubmit}
          disabled={!content.trim() || content.length > maxLength || isSubmitting}
          isLoading={isSubmitting}
          icon={<Send className="h-4 w-4" />}
          className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 mt-1"
        >
          Envoyer
        </Button>
      </div>
      
      {showEmojiPicker && (
        <div 
          ref={emojiPickerRef}
          className="relative mt-2"
        >
          <div className="absolute z-10 left-0 top-0">
            <div className="relative">
              <button 
                className="absolute -top-2 -right-2 bg-gray-200 hover:bg-gray-300 rounded-full p-1"
                onClick={() => setShowEmojiPicker(false)}
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
        </div>
      )}
    </div>
  );
};

export default EmojiCommentInput;