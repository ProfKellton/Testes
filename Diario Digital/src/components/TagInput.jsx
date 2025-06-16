import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const TagInput = ({ tags, setTags, availableTags, setAvailableTags }) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setShowSuggestions(true);
  };

  const addTag = (tag) => {
    const newTag = tag.trim().toLowerCase();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      if (!availableTags.includes(newTag)) {
        setAvailableTags([...availableTags, newTag].sort());
      }
    }
    setInputValue('');
    setShowSuggestions(false);
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue) {
      e.preventDefault();
      addTag(inputValue);
    }
    if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const filteredSuggestions = availableTags.filter(
    (tag) => tag.toLowerCase().includes(inputValue.toLowerCase()) && !tags.includes(tag)
  );

  return (
    <div className="relative">
      <label className="text-sm font-medium text-foreground mb-2 block flex items-center">
        <Tag className="h-4 w-4 mr-2 text-primary" />
        Etiquetas
      </label>
      <div className="flex flex-wrap items-center gap-2 p-2 rounded-md border border-input bg-background glass-effect border-primary/30 focus-within:border-primary">
        <AnimatePresence>
          {tags.map(tag => (
            <motion.div
              key={tag}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="flex items-center gap-1 bg-primary/20 text-primary-foreground py-1 px-2 rounded-md text-sm"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-primary-foreground hover:text-white"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
          placeholder="Adicionar etiqueta..."
          className="flex-grow bg-transparent border-none focus:ring-0 text-sm p-0 h-auto"
        />
      </div>
      {showSuggestions && inputValue && filteredSuggestions.length > 0 && (
        <motion.ul
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-10 w-full mt-1 bg-background border border-primary/30 rounded-md shadow-lg max-h-40 overflow-y-auto"
        >
          {filteredSuggestions.map(suggestion => (
            <li
              key={suggestion}
              onClick={() => addTag(suggestion)}
              className="px-3 py-2 hover:bg-primary/10 cursor-pointer text-sm"
            >
              {suggestion}
            </li>
          ))}
        </motion.ul>
      )}
      {showSuggestions && inputValue && !availableTags.some(t => t.toLowerCase() === inputValue.toLowerCase()) && (
         <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-10 w-full mt-1 bg-background border border-primary/30 rounded-md shadow-lg"
         >
            <button
              type="button"
              onClick={() => addTag(inputValue)}
              className="w-full text-left px-3 py-2 hover:bg-primary/10 cursor-pointer text-sm flex items-center"
            >
              <Plus size={14} className="mr-2"/> Criar nova etiqueta: "{inputValue}"
            </button>
         </motion.div>
      )}
    </div>
  );
};

export default TagInput;