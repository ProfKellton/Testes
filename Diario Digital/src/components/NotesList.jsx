
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Trash2, Calendar, Clock, Plus, Tag, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const NotesList = ({ notes, selectedDate, onEditNote, onDeleteNote, onNewNote, filterTag, setFilterTag, availableTags }) => {
  const formatDateDisplay = (date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit' 
    });
  };
  
  const formatReminderDateTime = (isoString) => {
    if (!isoString) return null;
    return format(new Date(isoString), "dd/MM/yy 'às' HH:mm", { locale: ptBR });
  };

  const selectedDateKey = selectedDate.toISOString().split('T')[0];
  const dayNotes = notes.filter(note => {
    const matchesDate = note.date === selectedDateKey;
    const matchesTag = filterTag ? note.tags?.includes(filterTag) : true;
    return matchesDate && matchesTag;
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="glass-effect rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
          <div className="flex items-center space-x-3">
            <Calendar className="h-6 w-6 text-primary flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold gradient-text">
                Anotações {filterTag ? `com a etiqueta "${filterTag}"` : "do Dia"}
              </h2>
              {!filterTag && (
                <p className="text-sm text-muted-foreground">
                  {formatDateDisplay(selectedDate)}
                </p>
              )}
            </div>
          </div>
          <Button
            onClick={onNewNote}
            className="bg-primary hover:bg-primary/90 pulse-glow w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Anotação
          </Button>
        </div>

        {dayNotes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              {filterTag ? `Nenhuma anotação encontrada com a etiqueta "${filterTag}" para este dia.` : "Nenhuma anotação para este dia"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {filterTag ? "Tente remover o filtro ou crie uma nova anotação." : "Comece criando sua primeira anotação do dia!"}
            </p>
            <Button
              onClick={onNewNote}
              variant="outline"
              className="border-primary/30 hover:bg-primary/10"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Anotação
            </Button>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {dayNotes.map((note, index) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
            className="note-card rounded-2xl p-6"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {note.title}
                </h3>
                <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mb-2">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>Criado: {formatTime(note.createdAt)}</span>
                  </div>
                  {note.updatedAt !== note.createdAt && (
                    <div className="flex items-center space-x-1">
                      <Edit className="h-3 w-3" />
                      <span>Editado: {formatTime(note.updatedAt)}</span>
                    </div>
                  )}
                   {note.reminderDateTime && (
                    <div className="flex items-center space-x-1 text-yellow-400/90">
                      <Bell className="h-3 w-3" />
                      <span>Lembrete: {formatReminderDateTime(note.reminderDateTime)}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex space-x-1 sm:space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEditNote(note)}
                  className="h-8 w-8 hover:bg-primary/20 hover:text-primary"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteNote(note.id)}
                  className="h-8 w-8 hover:bg-destructive/20 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {note.tags && note.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {note.tags.map(tag => (
                  <button 
                    key={tag} 
                    onClick={() => setFilterTag(tag === filterTag ? '' : tag)}
                    className={`px-2 py-0.5 rounded-md text-xs ${tag === filterTag ? 'bg-primary text-primary-foreground' : 'bg-primary/20 text-primary-foreground/80 hover:bg-primary/30'}`}
                  >
                    <Tag className="h-3 w-3 inline mr-1" />{tag}
                  </button>
                ))}
              </div>
            )}

            <div className="prose prose-sm prose-invert max-w-none">
              <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {note.content || (note.title && !note.content && <span className="italic text-muted-foreground">Sem conteúdo adicional.</span>)}
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default NotesList;