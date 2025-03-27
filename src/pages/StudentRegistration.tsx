
import { useState } from 'react';
import { useStudent } from '../context/StudentContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/Layout';
import { AlertCircle, Upload, Camera, FileText, User, School, Calendar, MapPin } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const StudentRegistration = () => {
  // Personal info state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [course, setCourse] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [campus, setCampus] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  
  // Document state
  const [residenceProof, setResidenceProof] = useState<File | null>(null);
  const [incomeProof, setIncomeProof] = useState<File | null>(null);
  const [enrollmentProof, setEnrollmentProof] = useState<File | null>(null);
  
  const [currentTab, setCurrentTab] = useState('personal');
  const [error, setError] = useState('');
  
  const { submitStudentInfo, uploadDocument, uploadProfilePicture, loading } = useStudent();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name || !email || !registrationNumber || !course || !graduationYear || !campus) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    try {
      await submitStudentInfo({
        name,
        email,
        registrationNumber,
        course,
        graduationYear,
        campus
      });
      
      // Upload profile picture if selected
      if (profilePicture) {
        await uploadProfilePicture(profilePicture);
      }
      
      // Move to document tab
      setCurrentTab('documents');
      
      toast({
        title: "Informações pessoais salvas",
        description: "Agora envie os documentos necessários.",
      });
    } catch (err) {
      setError('Ocorreu um erro ao salvar seus dados. Tente novamente.');
    }
  };

  const handleDocumentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const uploads = [];
      
      if (residenceProof) {
        uploads.push(uploadDocument('residenceProof', residenceProof));
      }
      
      if (incomeProof) {
        uploads.push(uploadDocument('incomeProof', incomeProof));
      }
      
      if (enrollmentProof) {
        uploads.push(uploadDocument('enrollmentProof', enrollmentProof));
      }
      
      if (uploads.length === 0) {
        setError('Por favor, envie pelo menos um documento.');
        return;
      }
      
      await Promise.all(uploads);
      
      toast({
        title: "Documentos enviados",
        description: "Cadastro concluído com sucesso! Você será redirecionado para o dashboard.",
      });
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError('Ocorreu um erro ao enviar os documentos. Tente novamente.');
    }
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  return (
    <Layout>
      <div className="container max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Cadastro de Estudante</h1>
          <p className="text-muted-foreground">
            Preencha suas informações para obter a carteirinha de transporte
          </p>
        </div>
        
        <Card className="animate-fadeIn">
          <CardHeader>
            <CardTitle>Formulário de Cadastro</CardTitle>
            <CardDescription>
              Preencha todos os campos obrigatórios e envie os documentos necessários
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={currentTab} onValueChange={setCurrentTab}>
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="personal">Informações Pessoais</TabsTrigger>
                <TabsTrigger value="documents">Documentos</TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal" className="animate-slideUp">
                <form onSubmit={handlePersonalInfoSubmit} className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Erro</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center gap-2">
                          <User size={16} />
                          Nome completo
                        </Label>
                        <Input 
                          id="name"
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                          placeholder="Seu nome completo"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <FileText size={16} />
                          E-mail
                        </Label>
                        <Input 
                          id="email"
                          type="email" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          placeholder="seu@email.com"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="registrationNumber" className="flex items-center gap-2">
                        <FileText size={16} />
                        Número de Matrícula
                      </Label>
                      <Input 
                        id="registrationNumber"
                        value={registrationNumber} 
                        onChange={(e) => setRegistrationNumber(e.target.value)} 
                        placeholder="Ex: 123456789"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="course" className="flex items-center gap-2">
                          <School size={16} />
                          Curso
                        </Label>
                        <Select value={course} onValueChange={setCourse}>
                          <SelectTrigger id="course">
                            <SelectValue placeholder="Selecione seu curso" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="engenharia">Engenharia</SelectItem>
                            <SelectItem value="medicina">Medicina</SelectItem>
                            <SelectItem value="direito">Direito</SelectItem>
                            <SelectItem value="computacao">Ciência da Computação</SelectItem>
                            <SelectItem value="administracao">Administração</SelectItem>
                            <SelectItem value="psicologia">Psicologia</SelectItem>
                            <SelectItem value="outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="graduationYear" className="flex items-center gap-2">
                          <Calendar size={16} />
                          Ano de Formatura
                        </Label>
                        <Select value={graduationYear} onValueChange={setGraduationYear}>
                          <SelectTrigger id="graduationYear">
                            <SelectValue placeholder="Ano previsto" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2024">2024</SelectItem>
                            <SelectItem value="2025">2025</SelectItem>
                            <SelectItem value="2026">2026</SelectItem>
                            <SelectItem value="2027">2027</SelectItem>
                            <SelectItem value="2028">2028</SelectItem>
                            <SelectItem value="2029">2029</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="campus" className="flex items-center gap-2">
                          <MapPin size={16} />
                          Campus
                        </Label>
                        <Select value={campus} onValueChange={setCampus}>
                          <SelectTrigger id="campus">
                            <SelectValue placeholder="Selecione o campus" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="central">Campus Central</SelectItem>
                            <SelectItem value="norte">Campus Norte</SelectItem>
                            <SelectItem value="sul">Campus Sul</SelectItem>
                            <SelectItem value="leste">Campus Leste</SelectItem>
                            <SelectItem value="oeste">Campus Oeste</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="profilePicture" className="flex items-center gap-2">
                        <Camera size={16} />
                        Foto de Perfil (opcional)
                      </Label>
                      <div className="flex items-center gap-4">
                        {profilePicture && (
                          <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                            <img 
                              src={URL.createObjectURL(profilePicture)} 
                              alt="Preview" 
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <Input 
                          id="profilePicture"
                          type="file" 
                          accept="image/*"
                          onChange={handleProfilePictureChange} 
                          className="max-w-sm"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Essa foto será usada na sua carteirinha de identificação
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={loading}
                    >
                      {loading ? 'Salvando...' : 'Continuar para Documentos'}
                    </Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="documents" className="animate-slideUp">
                <form onSubmit={handleDocumentSubmit} className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Erro</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                    <AlertTitle className="font-medium">Informações importantes</AlertTitle>
                    <AlertDescription>
                      Envie documentos nos formatos PDF, JPG ou PNG. Cada arquivo deve ter no máximo 5MB.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="residenceProof" className="flex items-center gap-2">
                        <Upload size={16} />
                        Comprovante de Residência
                      </Label>
                      <Input 
                        id="residenceProof"
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => e.target.files && setResidenceProof(e.target.files[0])} 
                      />
                      <p className="text-xs text-muted-foreground">
                        Conta de luz, água, gás ou telefone em seu nome ou de seu responsável
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="incomeProof" className="flex items-center gap-2">
                        <Upload size={16} />
                        Comprovante de Renda
                      </Label>
                      <Input 
                        id="incomeProof"
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => e.target.files && setIncomeProof(e.target.files[0])} 
                      />
                      <p className="text-xs text-muted-foreground">
                        Contracheque, declaração de imposto de renda ou outro documento que comprove renda
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="enrollmentProof" className="flex items-center gap-2">
                        <Upload size={16} />
                        Comprovante de Matrícula
                      </Label>
                      <Input 
                        id="enrollmentProof"
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => e.target.files && setEnrollmentProof(e.target.files[0])} 
                      />
                      <p className="text-xs text-muted-foreground">
                        Documento emitido pela instituição de ensino que comprove sua matrícula atual
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-4">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setCurrentTab('personal')}
                    >
                      Voltar para Informações Pessoais
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={loading}
                    >
                      {loading ? 'Enviando...' : 'Finalizar Cadastro'}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default StudentRegistration;
