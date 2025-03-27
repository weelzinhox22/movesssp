
import { useRef, useState } from 'react';
import { useStudent } from '../context/StudentContext';
import { useNavigate } from 'react-router-dom';
import { useTheme, CARD_COLOR_MAP } from '@/context/ThemeContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Download, Share2, CheckCircle2, Instagram, Palette } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const IdCard = () => {
  const { student } = useStudent();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [downloading, setDownloading] = useState(false);
  const { cardColor, setCardColor, getCardColorClasses } = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  const { gradientClasses, textColorClass } = getCardColorClasses();

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    setDownloading(true);
    
    try {
      // Clone the card to manipulate it without affecting the UI
      const cardClone = cardRef.current.cloneNode(true) as HTMLElement;
      const profileImg = cardClone.querySelector('.profile-img') as HTMLImageElement;
      
      // If there's a profile image element with a background image, convert it to an actual img element
      if (profileImg && student?.profilePicture) {
        // Apply the original image source to ensure it's in the downloaded file
        const img = document.createElement('img');
        img.src = student.profilePicture;
        img.className = 'h-full w-full object-cover';
        
        // Clear the div and add the image inside
        profileImg.innerHTML = '';
        profileImg.appendChild(img);
      }
      
      // Append the clone to the body temporarily for html2canvas to capture it
      document.body.appendChild(cardClone);
      cardClone.style.position = 'absolute';
      cardClone.style.left = '-9999px';
      
      const canvas = await html2canvas(cardClone, {
        scale: 2,
        backgroundColor: null,
        logging: false,
        allowTaint: true,
        useCORS: true
      });
      
      // Remove the clone
      document.body.removeChild(cardClone);
      
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
      // Clone the card to manipulate it without affecting the UI
      const cardClone = cardRef.current.cloneNode(true) as HTMLElement;
      const profileImg = cardClone.querySelector('.profile-img') as HTMLImageElement;
      
      // If there's a profile image element with a background image, convert it to an actual img element
      if (profileImg && student?.profilePicture) {
        // Apply the original image source to ensure it's in the downloaded file
        const img = document.createElement('img');
        img.src = student.profilePicture;
        img.className = 'h-full w-full object-cover';
        
        // Clear the div and add the image inside
        profileImg.innerHTML = '';
        profileImg.appendChild(img);
      }
      
      // Append the clone to the body temporarily for html2canvas to capture it
      document.body.appendChild(cardClone);
      cardClone.style.position = 'absolute';
      cardClone.style.left = '-9999px';
      
      const canvas = await html2canvas(cardClone, {
        scale: 2,
        backgroundColor: null,
        logging: false,
        allowTaint: true,
        useCORS: true
      });
      
      // Remove the clone
      document.body.removeChild(cardClone);
      
      const image = canvas.toDataURL('image/jpeg', 1.0);
      
      // Convert base64 to blob
      const imageBlob = await (await fetch(image)).blob();
      
      if (navigator.share) {
        await navigator.share({
          files: [new File([imageBlob], 'carteirinha.jpg', { type: 'image/jpeg' })],
          title: 'Minha Carteirinha MOVES SSP',
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

  // Data de início do semestre de transporte - 01/02/2025
  const semesterStartDate = new Date(2025, 1, 1); // Mês é base 0 (janeiro = 0, fevereiro = 1)

  if (!student) {
    return (
      <Layout>
        <div className="container max-w-3xl mx-auto px-4 py-12">
          <Alert variant="destructive">
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
        <Alert className="mb-6 bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950 dark:border-amber-900 dark:text-amber-200">
          <AlertDescription className="flex items-center gap-2">
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

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Carteirinha Digital</h1>
          <p className="text-muted-foreground">
            Apresente esta carteirinha para utilizar o transporte universitário
          </p>
        </div>
        
        <div className="flex flex-col items-center">
          <div 
            ref={cardRef}
            className={`w-full max-w-md ${gradientClasses} rounded-xl overflow-hidden shadow-lg mb-8`}
          >
            <div className="bg-white/20 backdrop-blur-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className={`${textColorClass} font-bold text-xl`}>MOVES SSP</h2>
                  <p className={`${textColorClass}/80 text-sm`}>Transporte Universitário</p>
                </div>
                <div className="bg-white rounded-lg p-1">
                  <CheckCircle2 className={`text-${cardColor}-600 h-6 w-6`} />
                </div>
              </div>
              
              <div className="mt-6 flex items-center gap-4">
                <div className="profile-img bg-white rounded-full h-20 w-20 flex items-center justify-center overflow-hidden border-2 border-white/50">
                  {student.profilePicture ? (
                    <Avatar className="h-full w-full">
                      <AvatarImage src={student.profilePicture} alt={student.name} className="h-full w-full object-cover" />
                      <AvatarFallback><User size={40} /></AvatarFallback>
                    </Avatar>
                  ) : (
                    <User size={40} className={`text-${cardColor}-600`} />
                  )}
                </div>
                
                <div className={textColorClass}>
                  <h3 className="font-bold text-lg">{student.name}</h3>
                  <p className={`${textColorClass}/80 text-sm capitalize`}>
                    {student.course} • {student.graduationYear}
                  </p>
                  <p className={`${textColorClass}/80 text-sm capitalize`}>
                    Campus: {student.campus}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 bg-white/10 rounded-lg p-4 flex justify-between items-center">
                <div>
                  <p className={`${textColorClass}/80 text-xs`}>Matrícula</p>
                  <p className={textColorClass + " font-semibold"}>{student.registrationNumber}</p>
                </div>
                <div>
                  <p className={`${textColorClass}/80 text-xs`}>Código</p>
                  <p className={textColorClass + " font-semibold"}>{student.uniqueCode}</p>
                </div>
                <div>
                  <p className={`${textColorClass}/80 text-xs`}>Validade</p>
                  <p className={textColorClass + " font-semibold"}>
                    {formatDate(new Date(new Date().setMonth(new Date().getMonth() + 6)))}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex flex-col items-center">
                <div className="bg-white p-2 rounded-lg">
                  <QRCodeSVG 
                    value={`MOVES-SSP:${student.registrationNumber}:${student.uniqueCode}`}
                    size={120}
                    level="H"
                    includeMargin={false}
                  />
                </div>
                
                <div className="mt-2 text-center">
                  <p className={`${textColorClass}/80 text-xs`}>
                    Início do semestre: {formatDate(semesterStartDate)}
                  </p>
                </div>
              </div>
              
              <div className="mt-2 text-center">
                <p className={`${textColorClass}/80 text-xs`}>
                  Escaneie o QR Code para verificar a autenticidade
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mb-6">
            <Button 
              className={`flex-1 gap-2 ${gradientClasses}`}
              onClick={handleDownload}
              disabled={downloading}
            >
              <Download size={18} />
              {downloading ? 'Salvando...' : 'Salvar como JPG'}
            </Button>
            
            <Button 
              variant="outline"
              className={`flex-1 gap-2 border-${cardColor}-400 text-${cardColor}-600 hover:bg-${cardColor}-50 dark:border-${cardColor}-700 dark:text-${cardColor}-400 dark:hover:bg-${cardColor}-950`}
              onClick={handleShare}
            >
              <Share2 size={18} />
              Compartilhar
            </Button>
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="mb-6 gap-2">
                <Palette size={18} />
                Escolher cor da carteirinha
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Escolha a cor da sua carteirinha</h4>
                <RadioGroup 
                  value={cardColor} 
                  onValueChange={(value) => setCardColor(value as any)} 
                  className="grid grid-cols-2 gap-4"
                >
                  {Object.entries(CARD_COLOR_MAP).map(([colorKey, colorData]) => (
                    <div key={colorKey} className="flex items-center space-x-2">
                      <RadioGroupItem value={colorKey} id={colorKey} />
                      <Label 
                        htmlFor={colorKey} 
                        className="flex items-center cursor-pointer"
                      >
                        <div className={`w-4 h-4 rounded-full bg-${colorKey}-500 mr-2`}></div>
                        {colorData.name}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </PopoverContent>
          </Popover>
          
          <Card className="w-full max-w-md mb-8 border-primary/10 dark:border-primary/20">
            <CardHeader className="bg-primary/5 dark:bg-primary/10 rounded-t-lg">
              <CardTitle>Instruções</CardTitle>
              <CardDescription>
                Como usar sua carteirinha digital
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
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
          
          <Card className="w-full max-w-md mt-8 border-primary/10 dark:border-primary/20">
            <CardHeader className="bg-primary/5 dark:bg-primary/10 rounded-t-lg">
              <CardTitle>Calendário de Transporte</CardTitle>
              <CardDescription>
                Informações importantes sobre o semestre atual
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <h3 className="font-semibold">Início do semestre</h3>
                <p className="text-sm">
                  <span className="font-medium">01/02/2025</span> - Início das operações de transporte
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">Renovação da carteirinha</h3>
                <p className="text-sm text-muted-foreground">
                  Renove sua carteirinha até 15/01/2025 para garantir acesso desde o primeiro dia de aula.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">Feriados e recesso</h3>
                <p className="text-sm text-muted-foreground">
                  Consulte o calendário completo na seção "Calendário" do aplicativo.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default IdCard;
