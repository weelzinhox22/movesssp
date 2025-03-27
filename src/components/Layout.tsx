
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

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
          <header className="hidden md:flex bg-white border-b px-6 py-4 justify-between items-center">
            <div className="flex items-center">
              <h1 
                className="text-2xl font-bold text-primary cursor-pointer"
                onClick={() => navigate('/dashboard')}
              >
                Campus<span className="text-accent">Pass</span>
              </h1>
            </div>
            <nav className="flex items-center space-x-6">
              <a 
                href="/dashboard" 
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Dashboard
              </a>
              <a 
                href="/registration" 
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Registro
              </a>
              <a 
                href="/id-card" 
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Carteirinha
              </a>
              <Button
                variant="ghost"
                className="flex items-center gap-1 text-gray-600 hover:text-destructive"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span>Sair</span>
              </Button>
            </nav>
          </header>

          {/* Mobile navigation */}
          <header className="md:hidden flex bg-white border-b px-4 py-3 justify-between items-center">
            <h1 
              className="text-xl font-bold text-primary cursor-pointer"
              onClick={() => navigate('/dashboard')}
            >
              Campus<span className="text-accent">Pass</span>
            </h1>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[240px] p-0">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <h2 className="font-semibold text-lg">Menu</h2>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setOpen(false)}
                      >
                        <X size={18} />
                      </Button>
                    </div>
                  </div>
                  <div className="flex-1 py-4">
                    <nav className="flex flex-col">
                      <a 
                        href="/dashboard" 
                        className="px-4 py-3 hover:bg-muted transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        Dashboard
                      </a>
                      <a 
                        href="/registration" 
                        className="px-4 py-3 hover:bg-muted transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        Registro
                      </a>
                      <a 
                        href="/id-card" 
                        className="px-4 py-3 hover:bg-muted transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        Carteirinha
                      </a>
                    </nav>
                  </div>
                  <div className="p-4 border-t">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-destructive"
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
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-white border-t py-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} - CampusPass - Todos os direitos reservados
      </footer>
    </div>
  );
};

export default Layout;
