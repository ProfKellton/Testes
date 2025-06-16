import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, LogOut, UserCircle, Tag as TagIcon, Filter } from 'lucide-react';
import Calendar from '@/components/Calendar';
import NotesList from '@/components/NotesList';
import NoteEditor from '@/components/NoteEditor';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import { useNotes } from '@/hooks/useNotes';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';


const AppContent = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    notes,
    saveNote,
    deleteNote,
    getNotesCount,
    loadNotesForUser,
    clearNotes,
    availableTags,
    setAvailableTags,
    getReminders 
  } = useNotes();

  const [currentUser, setCurrentUser] = useState(null);
  const [filterTag, setFilterTag] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
      setCurrentUser(user);
      loadNotesForUser(user.email);
    } else {
      navigate('/login');
    }
  }, [navigate, loadNotesForUser]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleNewNote = () => {
    setEditingNote(null);
    setIsEditorOpen(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  const handleSaveNote = (note) => {
    if (!currentUser) return;
    saveNote(note, currentUser.email);
    if (note.tags) {
        const newTags = note.tags.filter(tag => !availableTags.includes(tag.toLowerCase()));
        if (newTags.length > 0) {
            setAvailableTags([...availableTags, ...newTags.map(t => t.toLowerCase())].sort());
        }
    }
    toast({
      title: editingNote ? "Anotação atualizada!" : "Anotação criada!",
      description: editingNote 
        ? "Sua anotação foi atualizada com sucesso." 
        : "Sua nova anotação foi salva com sucesso.",
    });
  };

  const handleDeleteNote = (noteId) => {
    if (!currentUser) return;
    deleteNote(noteId, currentUser.email);
    toast({
      title: "Anotação excluída!",
      description: "A anotação foi removida com sucesso.",
      variant: "destructive",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    clearNotes();
    toast({
      title: "Logout realizado!",
      description: "Você foi desconectado com sucesso.",
    });
    navigate('/login');
  };

  const notesCount = getNotesCount(currentUser?.email);
  const reminders = getReminders(currentUser?.email);

  const filteredNotes = useCallback(() => {
    return notes.filter(note => {
      const titleMatch = note.title ? note.title.toLowerCase().includes(searchTerm.toLowerCase()) : false;
      const contentMatch = note.content ? note.content.toLowerCase().includes(searchTerm.toLowerCase()) : false;
      const matchesSearchTerm = titleMatch || contentMatch;
      const matchesTag = filterTag ? note.tags?.includes(filterTag) : true;
      return matchesSearchTerm && matchesTag;
    });
  }, [notes, searchTerm, filterTag]);


  if (!currentUser) {
    return null; 
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-foreground">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <BookOpen className="h-8 w-8 text-primary" />
              <Sparkles className="h-4 w-4 text-yellow-400 absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
                Diário Digital
              </h1>
              {currentUser?.username && (
                <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                  <UserCircle className="h-4 w-4 mr-1 text-primary" />
                  <span>{currentUser.username}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
             <Input 
                type="search"
                placeholder="Pesquisar anotações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="hidden sm:flex w-40 sm:w-64 h-9 glass-effect border-primary/30 focus:border-primary"
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-primary/20">
                  <Filter className="h-5 w-5 text-primary" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60 glass-effect border-primary/20 p-4 space-y-2">
                <h4 className="font-medium leading-none gradient-text">Filtrar por Etiqueta</h4>
                {availableTags && availableTags.length > 0 ? (
                  <div className="flex flex-col space-y-1">
                    <Button 
                      variant={!filterTag ? "secondary" : "ghost"}
                      onClick={() => setFilterTag('')}
                      className="text-xs justify-start h-8"
                    >
                      Todas as Etiquetas
                    </Button>
                    {availableTags.map(tag => (
                      <Button 
                        key={tag} 
                        variant={filterTag === tag ? "secondary" : "ghost"}
                        onClick={() => setFilterTag(tag)}
                        className="text-xs justify-start h-8"
                      >
                        {tag}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Nenhuma etiqueta disponível.</p>
                )}
              </PopoverContent>
            </Popover>
            <Button onClick={handleLogout} variant="outline" size="sm" className="h-9 border-primary/30 hover:bg-primary/10">
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
         <div className="sm:hidden container mx-auto px-4 pb-2">
             <Input 
                type="search"
                placeholder="Pesquisar anotações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-9 glass-effect border-primary/30 focus:border-primary"
            />
        </div>
      </motion.header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              notesCount={notesCount}
              reminders={reminders}
            />
          </div>
          <div className="lg:col-span-2">
            <NotesList
              notes={filteredNotes()}
              selectedDate={selectedDate}
              onEditNote={handleEditNote}
              onDeleteNote={handleDeleteNote}
              onNewNote={handleNewNote}
              filterTag={filterTag}
              setFilterTag={setFilterTag}
              availableTags={availableTags}
            />
          </div>
        </div>
      </main>

      <NoteEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveNote}
        note={editingNote}
        selectedDate={selectedDate}
        availableTags={availableTags}
        setAvailableTags={setAvailableTags}
      />
      
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-3/4 left-1/2 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>
    </div>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('currentUser'));

  const handleLogin = (user) => {
    setIsAuthenticated(true);
  };
  
  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AppContent />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;