
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStudent } from '../context/StudentContext';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Clock, FileText, User, School, CalendarDays, Bus, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { ImportantDate } from '@/models/types';

const Dashboard = () => {
  const { user } = useAuth();
  const { student, documents } = useStudent();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [importantDates, setImportantDates] = useState<ImportantDate[]>([]);

  useEffect(() => {
    // Mock data for important dates
    const dates: ImportantDate[] = [
      {
        id: '1',
        title: 'Início do semestre de transporte',
        description: 'Primeiro dia de funcionamento dos ônibus no semestre',
        date: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
      },
      {
        id: '2',
        title: 'Renovação de cadastro',
        description: 'Período para renovação do cadastro para o próximo semestre',
        date: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      },
      {
        id: '3',
        title: 'Manutenção programada',
        description: 'Dia de manutenção dos ônibus, serviço reduzido',
        date: new Date(new Date().getTime() + 15 * 24 * 60 * 60 * 1000) // 15 days from now
      }
    ];
    
    setImportantDates(dates);
    
    // Show welcome toast
    if (user && !student) {
      toast({
        title: "Bem-vindo ao CampusPass!",
        description: "Complete seu cadastro para ter acesso ao transporte universitário.",
      });
    }
  }, [user, student, toast]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500"><CheckCircle2 size={14} className="mr-1" /> Aprovado</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><AlertCircle size={14} className="mr-1" /> Rejeitado</Badge>;
      default:
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300"><Clock size={14} className="mr-1" /> Pendente</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const getProgressStatus = () => {
    if (!student) return 0;
    
    let total = 1; // Student info
    let completed = 1; // Student info is completed
    
    // Documents (3 types)
    total += 3;
    completed += documents.length;
    
    return Math.round((completed / total) * 100);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Bem-vindo, {user?.name || 'Estudante'}
            </p>
          </div>
          
          {!student && (
            <Button 
              onClick={() => navigate('/registration')}
              className="mt-4 md:mt-0"
            >
              Completar Cadastro
            </Button>
          )}
          
          {student && (
            <Button 
              onClick={() => navigate('/id-card')}
              className="mt-4 md:mt-0"
            >
              Ver Carteirinha
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {!student ? (
              <Card>
                <CardHeader>
                  <CardTitle>Complete seu cadastro</CardTitle>
                  <CardDescription>
                    Preencha suas informações para acessar todos os serviços
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Alert className="mb-4">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Atenção</AlertTitle>
                    <AlertDescription>
                      Para utilizar o serviço de transporte, você precisa completar seu cadastro e enviar os documentos necessários.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="flex justify-center py-8">
                    <Button 
                      size="lg" 
                      onClick={() => navigate('/registration')}
                    >
                      Iniciar Cadastro
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User size={20} />
                      Informações Pessoais
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-sm text-muted-foreground mb-1">Nome</h3>
                        <p>{student.name}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-muted-foreground mb-1">Matrícula</h3>
                        <p>{student.registrationNumber}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-muted-foreground mb-1">E-mail</h3>
                        <p>{student.email}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-muted-foreground mb-1">Curso</h3>
                        <p className="capitalize">{student.course}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-muted-foreground mb-1">Ano de Formatura</h3>
                        <p>{student.graduationYear}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-muted-foreground mb-1">Campus</h3>
                        <p className="capitalize">{student.campus === 'central' ? 'Campus Central' : `Campus ${student.campus}`}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-6 flex justify-between">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Código: {student.uniqueCode}</Badge>
                            <Info size={16} className="text-muted-foreground" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-60 text-sm">
                            Este é seu código único de identificação para o transporte universitário. Ele é exibido na sua carteirinha digital.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/registration')}
                    >
                      Editar Informações
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText size={20} />
                        Documentos
                      </CardTitle>
                      <CardDescription>
                        Status dos documentos enviados
                      </CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/registration')}
                    >
                      Gerenciar
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { type: 'residenceProof', label: 'Comprovante de Residência' },
                        { type: 'incomeProof', label: 'Comprovante de Renda' },
                        { type: 'enrollmentProof', label: 'Comprovante de Matrícula' }
                      ].map((doc) => {
                        const foundDoc = documents.find(d => d.type === doc.type);
                        return (
                          <div key={doc.type} className="flex justify-between items-center p-3 border rounded-md">
                            <div>
                              <p className="font-medium">{doc.label}</p>
                              {foundDoc ? (
                                <p className="text-xs text-muted-foreground">
                                  Enviado em {formatDate(new Date(foundDoc.createdAt))}
                                </p>
                              ) : (
                                <p className="text-xs text-muted-foreground">
                                  Não enviado
                                </p>
                              )}
                            </div>
                            <div>
                              {foundDoc ? (
                                getStatusBadge(foundDoc.status)
                              ) : (
                                <Badge variant="outline" className="bg-gray-100">
                                  Pendente
                                </Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bus size={20} />
                  Status da Carteirinha
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 rounded-full border-8 border-primary/20 relative mb-4">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        className="text-primary/20"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="46"
                        cx="50"
                        cy="50"
                      />
                      <circle
                        className="text-primary"
                        strokeWidth="8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="46"
                        cx="50"
                        cy="50"
                        strokeDasharray={`${getProgressStatus() * 2.89}, 289`}
                        strokeDashoffset="0"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold">{getProgressStatus()}%</span>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold mb-1">
                    {student ? 'Cadastro em Análise' : 'Cadastro Incompleto'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {student 
                      ? 'Seus documentos estão em análise. Assim que aprovados, sua carteirinha estará disponível.' 
                      : 'Complete seu cadastro para gerar sua carteirinha digital.'}
                  </p>
                  
                  {student && (
                    <Button 
                      className="mt-4 w-full"
                      onClick={() => navigate('/id-card')}
                    >
                      Ver Carteirinha
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays size={20} />
                  Datas Importantes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {importantDates.map((date) => (
                    <div key={date.id} className="border rounded-md p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{date.title}</h3>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {formatDate(date.date)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {date.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Ver Todas as Datas
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <School size={20} />
                  Dicas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div className="flex gap-3">
                    <div className="bg-primary/10 text-primary rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                      1
                    </div>
                    <p>
                      Mantenha seus documentos sempre atualizados para evitar problemas com sua carteirinha.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="bg-primary/10 text-primary rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                      2
                    </div>
                    <p>
                      Chegue ao ponto de ônibus com pelo menos 5 minutos de antecedência.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="bg-primary/10 text-primary rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                      3
                    </div>
                    <p>
                      Em caso de perda da carteirinha física, você pode usar a versão digital no aplicativo.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
