
import Layout from '@/components/Layout';
import { useAuth } from '../context/AuthContext';
import { useStudent } from '../context/StudentContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Car, CheckCircle, IdCard, Instagram, User } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import CalendarWidget from '@/components/CalendarWidget';

const Dashboard = () => {
  const { user } = useAuth();
  const { student } = useStudent();
  const navigate = useNavigate();

  const getRegistrationStatus = () => {
    if (!student) return 'pending';
    return 'complete';
  };

  const registrationStatus = getRegistrationStatus();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <Alert className="mb-6 bg-amber-50 border-amber-200 text-amber-800">
          <AlertDescription className="flex items-center justify-between flex-wrap gap-2">
            <span>Este é apenas um protótipo sendo desenvolvido por um estudante.</span>
            <a 
              href="https://instagram.com/welziinho" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary hover:underline"
            >
              <Instagram size={16} className="mr-1" />
              @welziinho
            </a>
          </AlertDescription>
        </Alert>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Olá, {user?.name || 'Estudante'}!</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao sistema de transporte universitário MOVES SSP.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card de Status do Cadastro */}
          <Card className={`card-hover ${registrationStatus === 'complete' ? 'bg-emerald-50 border-emerald-200' : ''}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User size={18} className={registrationStatus === 'complete' ? 'text-emerald-600' : 'text-amber-500'} />
                Status do Cadastro
              </CardTitle>
              <CardDescription>
                {registrationStatus === 'complete' 
                  ? 'Seu cadastro está completo' 
                  : 'Você precisa completar seu cadastro'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center mb-4">
                {registrationStatus === 'complete' ? (
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-emerald-600" />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-amber-500" />
                  </div>
                )}
              </div>
              
              <p className="text-center text-sm mb-4">
                {registrationStatus === 'complete' 
                  ? 'Todas as informações foram preenchidas corretamente.' 
                  : 'Complete seu perfil para acessar todos os recursos.'}
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                variant={registrationStatus === 'complete' ? 'outline' : 'default'}
                className={registrationStatus === 'complete' 
                  ? 'w-full border-emerald-300 text-emerald-600 hover:bg-emerald-50'
                  : 'w-full'
                }
                onClick={() => navigate('/registration')}
              >
                {registrationStatus === 'complete' ? 'Editar Cadastro' : 'Completar Cadastro'}
              </Button>
            </CardFooter>
          </Card>

          {/* Card de Carteirinha */}
          <Card className="card-hover bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IdCard size={18} className="text-emerald-600" />
                Carteirinha Digital
              </CardTitle>
              <CardDescription>
                Acesse sua carteirinha digital
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-2 border-emerald-200">
                  <IdCard className="h-8 w-8 text-emerald-600" />
                </div>
              </div>
              
              <p className="text-center text-sm mb-4">
                {registrationStatus === 'complete' 
                  ? 'Sua carteirinha está disponível para download e compartilhamento.'
                  : 'Complete seu cadastro para gerar sua carteirinha.'}
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                onClick={() => navigate('/id-card')}
                disabled={registrationStatus !== 'complete'}
              >
                Ver Carteirinha
              </Button>
            </CardFooter>
          </Card>

          {/* Card de Itinerários */}
          <Card className="card-hover bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car size={18} className="text-blue-600" />
                Itinerários
              </CardTitle>
              <CardDescription>
                Confira rotas e horários
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-2 border-blue-200">
                  <Car className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="font-semibold text-sm mb-1">Próximas saídas:</h3>
                <ul className="text-sm space-y-1">
                  <li>Campus Central - 07:00</li>
                  <li>Terminal Rodoviário - 12:30</li>
                  <li>Shopping - 18:00</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline"
                className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                Ver Rotas Completas
              </Button>
            </CardFooter>
          </Card>

          {/* Calendário */}
          <div className="md:col-span-2 lg:col-span-3">
            <CalendarWidget />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader className="bg-blue-50 rounded-t-lg">
                <CardTitle>Avisos e Notícias</CardTitle>
                <CardDescription>
                  Fique por dentro das novidades do transporte universitário
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2 border-l-4 border-emerald-500 pl-3">
                  <h3 className="font-semibold">Início das operações 2025</h3>
                  <p className="text-sm text-muted-foreground">
                    As operações de transporte para o semestre 2025.1 iniciam no dia 01/02/2025. Prepare sua carteirinha com antecedência.
                  </p>
                  <p className="text-xs text-gray-400">02/01/2025</p>
                </div>
                
                <div className="space-y-2 border-l-4 border-amber-500 pl-3">
                  <h3 className="font-semibold">Manutenção preventiva da frota</h3>
                  <p className="text-sm text-muted-foreground">
                    Nos dias 15 e 16 de fevereiro, parte da frota estará em manutenção. Consulte as alterações temporárias nas rotas.
                  </p>
                  <p className="text-xs text-gray-400">10/01/2025</p>
                </div>
                
                <div className="space-y-2 border-l-4 border-blue-500 pl-3">
                  <h3 className="font-semibold">Novo aplicativo de rastreamento</h3>
                  <p className="text-sm text-muted-foreground">
                    Estamos desenvolvendo um aplicativo para acompanhar em tempo real a localização dos ônibus. Lançamento previsto para março.
                  </p>
                  <p className="text-xs text-gray-400">05/01/2025</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader className="bg-amber-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Calendar size={18} className="text-amber-600" />
                  Datas Importantes
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs">1</span>
                    <div>
                      <p className="font-medium text-sm">01/02/2025</p>
                      <p className="text-sm text-muted-foreground">Início do semestre de transporte</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs">2</span>
                    <div>
                      <p className="font-medium text-sm">15/01/2025</p>
                      <p className="text-sm text-muted-foreground">Prazo para renovação de carteirinha</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs">3</span>
                    <div>
                      <p className="font-medium text-sm">10/03/2025</p>
                      <p className="text-sm text-muted-foreground">Feriado - sem transporte</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs">4</span>
                    <div>
                      <p className="font-medium text-sm">30/06/2025</p>
                      <p className="text-sm text-muted-foreground">Fim do semestre de transporte</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
