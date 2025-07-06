import React, { useState, useRef } from 'react';
import { Send, Image, Smile, X } from 'lucide-react';
import Button from '../ui/Button';
import EmojiPicker, { Theme, EmojiClickData } from 'emoji-picker-react';

interface CommentFormProps {
  onSubmit: (content: string) => void;
  onCancel?: () => void;
  placeholder: string;
  submitText: string;
  initialValue?: string;
  allowImages?: boolean;
}

const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  onCancel,
  placeholder,
  submitText,
  initialValue = '',
  allowImages = false
}) => {
  const [content, setContent] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

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

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          rows={3}
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
            className={`text-gray-400 hover:text-gray-600 transition-colors ${showEmojiPicker ? 'text-orange-500' : ''}`}
            title="Ajouter un emoji"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <Smile className="h-5 w-5" />
          </button>
        </div>
      </div>

      {showEmojiPicker && (
        <div className="relative">
          <div className="absolute z-10 bottom-full mb-2">
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

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {content.length}/1000 caractères
        </div>
        
        <div className="flex items-center space-x-3">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
          )}
          <Button
            type="submit"
            disabled={!content.trim() || content.length > 1000 || isSubmitting}
            isLoading={isSubmitting}
            icon={<Send className="h-4 w-4" />}
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
          >
            {submitText}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;