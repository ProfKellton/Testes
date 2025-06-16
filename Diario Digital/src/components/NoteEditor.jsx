
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, X, Edit3, Clock, Calendar as CalendarIconLucide, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import TagInput from '@/components/TagInput';
import DateTimePicker from '@/components/DateTimePicker';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const NoteEditor = ({ isOpen, onClose, onSave, note = null, selectedDate, availableTags, setAvailableTags }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [reminderDateTime, setReminderDateTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags || []);
      setReminderDateTime(note.reminderDateTime || null);
    } else {
      setTitle('');
      setContent('');
      setTags([]);
      setReminderDateTime(null);
    }
    setCurrentTime(new Date()); 
  }, [note, isOpen, selectedDate]);

  useEffect(() => {
    let timer;
    if (isOpen) {
      timer = setInterval(() => setCurrentTime(new Date()), 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen]);


  const handleSave = () => {
    if (!title.trim()) return;

    const now = new Date();
    const noteData = {
      id: note?.id || Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      tags: tags,
      reminderDateTime: reminderDateTime,
      date: selectedDate.toISOString().split('T')[0],
      createdAt: note?.createdAt || now.toISOString(),
      updatedAt: now.toISOString(),
      time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    onSave(noteData);
    onClose();
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-effect border-primary/20 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 gradient-text">
            <Edit3 className="h-5 w-5" />
            <span>{note ? 'Editar Anotação' : 'Nova Anotação'}</span>
          </DialogTitle>
          <DialogDescription className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>{formatDate(selectedDate)}</span>
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="note-title" className="text-sm font-medium text-foreground mb-2 block">
              Título
            </Label>
            <Input
              id="note-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título da sua anotação..."
              className="glass-effect border-primary/30 focus:border-primary"
            />
          </div>

          <div>
            <Label htmlFor="note-content" className="text-sm font-medium text-foreground mb-2 block">
              Conteúdo
            </Label>
            <Textarea
              id="note-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escreva sua anotação aqui..."
              className="glass-effect border-primary/30 focus:border-primary min-h-[150px] resize-none"
            />
          </div>

          <TagInput tags={tags} setTags={setTags} availableTags={availableTags} setAvailableTags={setAvailableTags} />
          
          <DateTimePicker dateTime={reminderDateTime} setDateTime={setReminderDateTime} />


          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-muted-foreground/30 hover:bg-muted/20"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={!title.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              <Save className="h-4 w-4 mr-2" />
              {note ? 'Atualizar' : 'Salvar'}
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default NoteEditor;