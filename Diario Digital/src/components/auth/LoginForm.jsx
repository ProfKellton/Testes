import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      onLogin(user);
      toast({
        title: "Login bem-sucedido!",
        description: `Bem-vindo de volta, ${user.email}!`,
      });
      navigate('/');
    } else {
      toast({
        title: "Erro de Login",
        description: "Email ou senha inválidos. Tente novamente.",
        variant: "destructive",
      });
    }
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
            <LogIn className="h-16 w-16 text-primary" />
            <Sparkles className="h-6 w-6 text-yellow-400 absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2" />
          </div>
          <h1 className="text-4xl font-bold gradient-text">Bem-vindo de Volta!</h1>
          <p className="text-muted-foreground mt-2">Acesse suas anotações diárias.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="Sua senha secreta"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="glass-effect border-primary/30 focus:border-primary"
            />
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 pulse-glow text-lg py-3">
            <LogIn className="h-5 w-5 mr-2" />
            Entrar
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Não tem uma conta?{' '}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Registre-se aqui
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginForm;