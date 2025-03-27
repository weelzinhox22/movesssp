
import { useRef, useState } from 'react';
import { useStudent } from '../context/StudentContext';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Download, Share2, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';

const IdCard = () => {
  const { student } = useStudent();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    setDownloading(true);
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        logging: false
      });
      
      const image = canvas.toDataURL('image/jpeg', 1.0);
      
      // Create a download link
      const downloadLink = document.createElement('a');
      downloadLink.href = image;
      downloadLink.download = `carteirinha-${student?.registrationNumber || 'estudante'}.jpg`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      toast({
        title: "Carteirinha salva",
        description: "Sua carteirinha foi salva com sucesso.",
      });
    } catch (error) {
      console.error('Error generating image', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar sua carteirinha.",
        variant: "destructive",
      });
    }
    
    setDownloading(false);
  };

  const handleShare = async () => {
    if (!cardRef.current) return;
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        logging: false
      });
      
      const image = canvas.toDataURL('image/jpeg', 1.0);
      
      // Convert base64 to blob
      const imageBlob = await (await fetch(image)).blob();
      
      if (navigator.share) {
        await navigator.share({
          files: [new File([imageBlob], 'carteirinha.jpg', { type: 'image/jpeg' })],
          title: 'Minha Carteirinha CampusPass',
        });
        
        toast({
          title: "Compartilhamento iniciado",
          description: "Escolha onde deseja compartilhar sua carteirinha.",
        });
      } else {
        toast({
          title: "Compartilhamento não suportado",
          description: "Seu navegador não suporta a função de compartilhamento.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sharing', error);
      toast({
        title: "Erro ao compartilhar",
        description: "Ocorreu um erro ao compartilhar sua carteirinha.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  if (!student) {
    return (
      <Layout>
        <div className="container max-w-3xl mx-auto px-4 py-12">
          <Alert>
            <AlertTitle>Cadastro incompleto</AlertTitle>
            <AlertDescription>
              Você precisa completar seu cadastro para acessar sua carteirinha.
            </AlertDescription>
          </Alert>
          
          <div className="flex justify-center mt-8">
            <Button onClick={() => navigate('/registration')}>
              Completar Cadastro
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Carteirinha Digital</h1>
          <p className="text-muted-foreground">
            Apresente esta carteirinha para utilizar o transporte universitário
          </p>
        </div>
        
        <div className="flex flex-col items-center">
          <div 
            ref={cardRef}
            className="w-full max-w-md bg-gradient-to-r from-primary to-primary-light rounded-xl overflow-hidden shadow-lg mb-8"
          >
            <div className="bg-white/20 backdrop-blur-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-white font-bold text-xl">CampusPass</h2>
                  <p className="text-white/80 text-sm">Transporte Universitário</p>
                </div>
                <div className="bg-white rounded-lg p-1">
                  <CheckCircle2 className="text-primary h-6 w-6" />
                </div>
              </div>
              
              <div className="mt-6 flex items-center gap-4">
                <div className="bg-white rounded-full h-20 w-20 flex items-center justify-center overflow-hidden border-2 border-white/50">
                  {student.profilePicture ? (
                    <img 
                      src={student.profilePicture} 
                      alt={student.name} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User size={40} className="text-primary" />
                  )}
                </div>
                
                <div className="text-white">
                  <h3 className="font-bold text-lg">{student.name}</h3>
                  <p className="text-white/80 text-sm capitalize">
                    {student.course} • {student.graduationYear}
                  </p>
                  <p className="text-white/80 text-sm capitalize">
                    Campus: {student.campus === 'central' ? 'Central' : student.campus}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 bg-white/10 rounded-lg p-4 flex justify-between items-center">
                <div>
                  <p className="text-white/80 text-xs">Matrícula</p>
                  <p className="text-white font-semibold">{student.registrationNumber}</p>
                </div>
                <div>
                  <p className="text-white/80 text-xs">Código</p>
                  <p className="text-white font-semibold">{student.uniqueCode}</p>
                </div>
                <div>
                  <p className="text-white/80 text-xs">Validade</p>
                  <p className="text-white font-semibold">
                    {formatDate(new Date(new Date().setMonth(new Date().getMonth() + 6)))}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-center">
                <div className="bg-white p-2 rounded-lg">
                  <QRCodeSVG 
                    value={`CAMPUSPASS:${student.registrationNumber}:${student.uniqueCode}`}
                    size={120}
                    level="H"
                    includeMargin={false}
                  />
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-white/80 text-xs">
                  Escaneie o QR Code para verificar a autenticidade
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <Button 
              className="flex-1 gap-2"
              onClick={handleDownload}
              disabled={downloading}
            >
              <Download size={18} />
              {downloading ? 'Salvando...' : 'Salvar como JPG'}
            </Button>
            
            <Button 
              variant="outline"
              className="flex-1 gap-2"
              onClick={handleShare}
            >
              <Share2 size={18} />
              Compartilhar
            </Button>
          </div>
          
          <Card className="w-full max-w-md mt-8">
            <CardHeader>
              <CardTitle>Instruções</CardTitle>
              <CardDescription>
                Como usar sua carteirinha digital
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">1. Apresente ao motorista</h3>
                <p className="text-sm text-muted-foreground">
                  Ao entrar no ônibus, mostre sua carteirinha digital ou impressa ao motorista.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">2. Permita a verificação do QR Code</h3>
                <p className="text-sm text-muted-foreground">
                  O motorista ou fiscal poderá escanear o QR Code para verificar a autenticidade da carteirinha.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">3. Mantenha seus dados atualizados</h3>
                <p className="text-sm text-muted-foreground">
                  A carteirinha é renovada semestralmente. Mantenha seus documentos em dia para evitar problemas.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4">
              <p className="text-sm text-muted-foreground">
                Em caso de problemas, entre em contato com a administração do transporte universitário.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default IdCard;
