
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, Sparkles, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username.trim()) {
       toast({
        title: "Erro de Registro",
        description: "Nome de usuário é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Erro de Registro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const existingUser = users.find(u => u.email === email);
    const existingUsername = users.find(u => u.username === username.trim());

    if (existingUser) {
      toast({
        title: "Erro de Registro",
        description: "Este email já está em uso.",
        variant: "destructive",
      });
      return;
    }
    
    if (existingUsername) {
      toast({
        title: "Erro de Registro",
        description: "Este nome de usuário já está em uso.",
        variant: "destructive",
      });
      return;
    }


    const newUser = { username: username.trim(), email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    toast({
      title: "Registro bem-sucedido!",
      description: "Sua conta foi criada. Faça login para continuar.",
    });
    navigate('/login');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center min-h-screen p-4"
    >
      <div className="w-full max-w-md glass-effect rounded-2xl p-8 shadow-2xl floating-animation">
        <div className="text-center mb-8">
          <div className="inline-block relative mb-4">
            <UserPlus className="h-16 w-16 text-primary" />
            <Sparkles className="h-6 w-6 text-yellow-400 absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2" />
          </div>
          <h1 className="text-4xl font-bold gradient-text">Crie sua Conta</h1>
          <p className="text-muted-foreground mt-2">Comece sua jornada de anotações diárias.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-foreground/80 flex items-center">
              <User className="h-4 w-4 mr-2 text-primary" />
              Nome de Usuário
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Seu nome de usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="glass-effect border-primary/30 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground/80 flex items-center">
              <Mail className="h-4 w-4 mr-2 text-primary" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="glass-effect border-primary/30 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground/80 flex items-center">
              <Lock className="h-4 w-4 mr-2 text-primary" />
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Crie uma senha forte"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="glass-effect border-primary/30 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-foreground/80 flex items-center">
              <Lock className="h-4 w-4 mr-2 text-primary" />
              Confirmar Senha
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="glass-effect border-primary/30 focus:border-primary"
            />
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 pulse-glow text-lg py-3">
            <UserPlus className="h-5 w-5 mr-2" />
            Registrar
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Já tem uma conta?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Faça login aqui
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default RegisterForm;
