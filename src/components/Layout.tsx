import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';

const Layout = ({ 
  children, 
  showNav = true,
  className 
}: { 
  children: React.ReactNode;
  showNav?: boolean;
  className?: string;
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={cn("min-h-screen flex flex-col bg-background", className)}>
      {showNav && (
        <header className="bg-background border-b border-border sticky top-0 z-10">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <h1 
                className="text-xl font-bold gradient-text cursor-pointer"
                onClick={() => navigate('/dashboard')}
              >
                MOVES SSP
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              
              {user && (
                <div className="flex items-center gap-2">
                  <span className="text-sm hidden md:inline-block text-muted-foreground">
                    Olá, {user.name}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {showNav && (
            <nav className="container mx-auto px-4 py-2 flex overflow-x-auto scrollbar-hide">
              <ul className="flex space-x-6">
                <li>
                  <a 
                    onClick={() => navigate('/dashboard')}
                    className="text-sm cursor-pointer hover:text-primary transition-colors whitespace-nowrap"
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a 
                    onClick={() => navigate('/registration')}
                    className="text-sm cursor-pointer hover:text-primary transition-colors whitespace-nowrap"
                  >
                    Cadastro de Estudante
                  </a>
                </li>
                <li>
                  <a 
                    onClick={() => navigate('/id-card')}
                    className="text-sm cursor-pointer hover:text-primary transition-colors whitespace-nowrap"
                  >
                    Carteirinha
                  </a>
                </li>
              </ul>
            </nav>
          )}
        </header>
      )}
      
      <main className="flex-1">
        {children}
      </main>
      
      {showNav && (
        <footer className="py-4 border-t border-border">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} MOVES SSP - Todos os direitos reservados</p>
            <p className="mt-1">
              <a 
                href="https://instagram.com/welziinho" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                Desenvolvido por @welziinho
              </a>
            </p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
