
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/Layout';
import { AlertCircle, Facebook } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loginWithGoogle, loginWithFacebook, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      await login(email, password);
      toast({
        title: "Login bem-sucedido",
        description: "Bem-vindo de volta!",
      });
      navigate('/dashboard');
    } catch (err) {
      setError('Falha no login. Verifique suas credenciais.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      toast({
        title: "Login com Google bem-sucedido",
        description: "Bem-vindo ao MOVES SSP!",
      });
      navigate('/dashboard');
    } catch (err) {
      setError('Falha no login com Google. Tente novamente.');
    }
  };
  
  const handleFacebookLogin = async () => {
    try {
      await loginWithFacebook();
      toast({
        title: "Login com Facebook bem-sucedido",
        description: "Bem-vindo ao MOVES SSP!",
      });
      navigate('/dashboard');
    } catch (err) {
      setError('Falha no login com Facebook. Tente novamente.');
    }
  };

  return (
    <Layout showNav={false}>
      <div className="container max-w-md mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">
            MOVES SSP
          </h1>
          <p className="text-muted-foreground">
            Acesse sua conta para gerenciar seu transporte universitário
          </p>
        </div>
        
        <Alert className="mb-6 border border-accent/20 bg-accent/5">
          <AlertDescription>
            Este é apenas um protótipo sendo desenvolvido por um estudante.
            <a 
              href="https://instagram.com/welziinho" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block mt-1 text-primary hover:underline"
            >
              Instagram: @welziinho
            </a>
          </AlertDescription>
        </Alert>
        
        <Card className="animate-fadeIn">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Entre com suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3 mb-6">
              <Button 
                type="button" 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                </svg>
                Entrar com Google
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2"
                onClick={handleFacebookLogin}
                disabled={loading}
              >
                <Facebook size={18} />
                Entrar com Facebook
              </Button>
            </div>
            
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Ou continue com
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-md p-3 flex items-center text-sm">
                  <AlertCircle size={16} className="mr-2" />
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input 
                  id="email"
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="seu@email.com"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Link 
                    to="/forgot-password" 
                    className="text-xs text-primary hover:underline"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
                <Input 
                  id="password"
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="********"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Não tem uma conta?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Registre-se
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;
