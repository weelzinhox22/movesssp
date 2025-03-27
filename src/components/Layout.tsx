
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Menu, X, Instagram, Calendar, HelpCircle, Home, User, IdCard } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showNav = true }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {showNav && user && (
        <>
          {/* Desktop navigation */}
          <header className="hidden md:flex bg-gradient-to-r from-emerald-700 to-emerald-600 px-6 py-4 justify-between items-center">
            <div className="flex items-center">
              <h1 
                className="text-2xl font-bold text-white cursor-pointer"
                onClick={() => navigate('/dashboard')}
              >
                MOVES <span className="text-amber-300">SSP</span>
              </h1>
            </div>
            <nav className="flex items-center space-x-6">
              <a 
                href="/dashboard" 
                className="text-white/80 hover:text-white transition-colors flex items-center gap-1"
              >
                <Home size={16} />
                <span>Início</span>
              </a>
              <a 
                href="/registration" 
                className="text-white/80 hover:text-white transition-colors flex items-center gap-1"
              >
                <User size={16} />
                <span>Perfil</span>
              </a>
              <a 
                href="/id-card" 
                className="text-white/80 hover:text-white transition-colors flex items-center gap-1"
              >
                <IdCard size={16} />
                <span>Carteirinha</span>
              </a>
              <a 
                href="https://instagram.com/welziinho" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors flex items-center gap-1"
              >
                <Instagram size={16} />
                <span>Contato</span>
              </a>
              <Button
                variant="ghost"
                className="flex items-center gap-1 text-white hover:text-white hover:bg-white/20"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span>Sair</span>
              </Button>
            </nav>
          </header>

          {/* Mobile navigation */}
          <header className="md:hidden flex bg-gradient-to-r from-emerald-700 to-emerald-600 px-4 py-3 justify-between items-center">
            <h1 
              className="text-xl font-bold text-white cursor-pointer"
              onClick={() => navigate('/dashboard')}
            >
              MOVES <span className="text-amber-300">SSP</span>
            </h1>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[260px] p-0 border-emerald-100">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b bg-emerald-50">
                    <div className="flex items-center justify-between">
                      <h2 className="font-semibold text-lg text-emerald-800">Menu</h2>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setOpen(false)}
                        className="text-emerald-800"
                      >
                        <X size={18} />
                      </Button>
                    </div>
                  </div>
                  <div className="flex-1 py-4">
                    <nav className="flex flex-col">
                      <a 
                        href="/dashboard" 
                        className="px-4 py-3 hover:bg-emerald-50 transition-colors flex items-center gap-2"
                        onClick={() => setOpen(false)}
                      >
                        <Home size={16} className="text-emerald-600" />
                        <span>Início</span>
                      </a>
                      <a 
                        href="/registration" 
                        className="px-4 py-3 hover:bg-emerald-50 transition-colors flex items-center gap-2"
                        onClick={() => setOpen(false)}
                      >
                        <User size={16} className="text-emerald-600" />
                        <span>Perfil</span>
                      </a>
                      <a 
                        href="/id-card" 
                        className="px-4 py-3 hover:bg-emerald-50 transition-colors flex items-center gap-2"
                        onClick={() => setOpen(false)}
                      >
                        <IdCard size={16} className="text-emerald-600" />
                        <span>Carteirinha</span>
                      </a>
                      <a 
                        href="#" 
                        className="px-4 py-3 hover:bg-emerald-50 transition-colors flex items-center gap-2"
                        onClick={() => setOpen(false)}
                      >
                        <Calendar size={16} className="text-emerald-600" />
                        <span>Calendário</span>
                      </a>
                      <a 
                        href="#" 
                        className="px-4 py-3 hover:bg-emerald-50 transition-colors flex items-center gap-2"
                        onClick={() => setOpen(false)}
                      >
                        <HelpCircle size={16} className="text-emerald-600" />
                        <span>Ajuda</span>
                      </a>
                      <a 
                        href="https://instagram.com/welziinho" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-3 hover:bg-emerald-50 transition-colors flex items-center gap-2"
                        onClick={() => setOpen(false)}
                      >
                        <Instagram size={16} className="text-emerald-600" />
                        <span>Instagram</span>
                      </a>
                    </nav>
                  </div>
                  <div className="p-4 border-t">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} className="mr-2" />
                      <span>Sair</span>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </header>
        </>
      )}
      <main className="flex-1 bg-gray-50">
        {children}
      </main>
      <footer className="bg-white border-t py-4 text-center text-sm text-gray-500">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <div>
              &copy; {new Date().getFullYear()} - MOVES SSP - Todos os direitos reservados
            </div>
            <div className="flex items-center gap-2">
              <span>Desenvolvido por:</span>
              <a 
                href="https://instagram.com/welziinho" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:underline flex items-center gap-1"
              >
                <Instagram size={14} />
                @welziinho
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
