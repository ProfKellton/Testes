import { useState, useEffect, useCallback } from 'react';

const getStorageKey = (userEmail) => `daily-notes-${userEmail}`;
const getAllUsersTagsKey = () => 'all-available-tags';

export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [availableTags, setAvailableTagsState] = useState([]);

  const loadAvailableTags = useCallback(() => {
    try {
      const savedTags = localStorage.getItem(getAllUsersTagsKey());
      if (savedTags) {
        setAvailableTagsState(JSON.parse(savedTags));
      } else {
        setAvailableTagsState([]);
      }
    } catch (error) {
      console.error('Erro ao carregar etiquetas disponíveis:', error);
      setAvailableTagsState([]);
    }
  }, []);

  const saveAvailableTags = useCallback((tagsToSave) => {
    try {
      localStorage.setItem(getAllUsersTagsKey(), JSON.stringify(tagsToSave));
    } catch (error) {
      console.error('Erro ao salvar etiquetas disponíveis:', error);
    }
  }, []);
  
  const setAvailableTags = useCallback((newTags) => {
    setAvailableTagsState(newTags);
    saveAvailableTags(newTags);
  }, [saveAvailableTags]);


  useEffect(() => {
    loadAvailableTags();
  }, [loadAvailableTags]);


  const loadNotesForUser = useCallback((email) => {
    setCurrentUserEmail(email);
    try {
      const savedNotes = localStorage.getItem(getStorageKey(email));
      if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes);
        setNotes(parsedNotes);
        
        const allNoteTags = parsedNotes.reduce((acc, note) => {
          if (note.tags) {
            note.tags.forEach(tag => acc.add(tag.toLowerCase()));
          }
          return acc;
        }, new Set());
        
        setAvailableTags(prevTags => {
            const updatedTags = new Set([...prevTags, ...allNoteTags]);
            return Array.from(updatedTags).sort();
        });

      } else {
        setNotes([]); 
      }
    } catch (error) {
      console.error('Erro ao carregar anotações:', error);
      setNotes([]);
    }
  }, [setAvailableTags]);

  const saveNotesToStorage = useCallback((notesToSave, email) => {
    if (!email) return;
    try {
      localStorage.setItem(getStorageKey(email), JSON.stringify(notesToSave));
    } catch (error) {
      console.error('Erro ao salvar anotações:', error);
    }
  }, []);

  const saveNote = useCallback((note, email) => {
    setNotes(prevNotes => {
      const existingIndex = prevNotes.findIndex(n => n.id === note.id);
      let updatedNotes;

      if (existingIndex >= 0) {
        updatedNotes = [...prevNotes];
        updatedNotes[existingIndex] = note;
      } else {
        updatedNotes = [...prevNotes, note];
      }
      
      saveNotesToStorage(updatedNotes, email || currentUserEmail);
      
      if (note.tags) {
        const newNoteTags = note.tags.map(t => t.toLowerCase());
        setAvailableTags(prevTags => {
            const updatedAvailTags = new Set([...prevTags, ...newNoteTags]);
            return Array.from(updatedAvailTags).sort();
        });
      }
      return updatedNotes;
    });
  }, [saveNotesToStorage, currentUserEmail, setAvailableTags]);

  const deleteNote = useCallback((noteId, email) => {
    setNotes(prevNotes => {
      const updatedNotes = prevNotes.filter(note => note.id !== noteId);
      saveNotesToStorage(updatedNotes, email || currentUserEmail);
      return updatedNotes;
    });
  }, [saveNotesToStorage, currentUserEmail]);

  const getNotesByDate = useCallback((date) => {
    const dateKey = date.toISOString().split('T')[0];
    return notes.filter(note => note.date === dateKey);
  }, [notes]);

  const getNotesCount = useCallback(() => {
    const count = {};
    notes.forEach(note => {
      count[note.date] = (count[note.date] || 0) + 1;
    });
    return count;
  }, [notes]);
  
  const getReminders = useCallback(() => {
    const reminders = {};
    notes.forEach(note => {
        if (note.reminderDateTime) {
            const reminderDateKey = new Date(note.reminderDateTime).toISOString().split('T')[0];
            reminders[reminderDateKey] = (reminders[reminderDateKey] || 0) + 1;
        }
    });
    return reminders;
  }, [notes]);

  const clearNotes = useCallback(() => {
    setNotes([]);
    setCurrentUserEmail(null);
  }, []);


  return {
    notes,
    saveNote,
    deleteNote,
    getNotesByDate,
    getNotesCount,
    loadNotesForUser,
    clearNotes,
    availableTags,
    setAvailableTags,
    getReminders
  };
};