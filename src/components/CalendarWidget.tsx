
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Datas importantes para o transporte
const importantDates = [
  { date: new Date(2025, 1, 1), title: "Início do semestre", type: "success" },
  { date: new Date(2025, 1, 15), title: "Manutenção da frota", type: "warning" },
  { date: new Date(2025, 2, 10), title: "Feriado - Sem transporte", type: "danger" },
  { date: new Date(2025, 3, 5), title: "Renovação de carteirinhas", type: "info" },
  { date: new Date(2025, 4, 1), title: "Alteração de rotas", type: "warning" },
  { date: new Date(2025, 5, 30), title: "Fim do semestre", type: "danger" },
];

// Função para verificar se uma data tem evento
function hasEventOnDate(date: Date) {
  return importantDates.find(
    (eventDate) => 
      eventDate.date.getDate() === date.getDate() && 
      eventDate.date.getMonth() === date.getMonth() && 
      eventDate.date.getFullYear() === date.getFullYear()
  );
}

// Função para retornar eventos em uma data específica
function getEventsOnDate(date: Date) {
  return importantDates.filter(
    (eventDate) => 
      eventDate.date.getDate() === date.getDate() && 
      eventDate.date.getMonth() === date.getMonth() && 
      eventDate.date.getFullYear() === date.getFullYear()
  );
}

const CalendarWidget = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDayEvents, setSelectedDayEvents] = useState<typeof importantDates>([]);
  
  // Atualiza os eventos quando uma data é selecionada
  const handleSelect = (day: Date | undefined) => {
    setDate(day);
    if (day) {
      setSelectedDayEvents(getEventsOnDate(day));
    } else {
      setSelectedDayEvents([]);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-emerald-50 rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon size={18} className="text-emerald-600" />
          Calendário de Transporte
        </CardTitle>
        <CardDescription>
          Datas importantes para o transporte universitário
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <TooltipProvider>
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            className="mx-auto"
            modifiers={{
              event: (date) => Boolean(hasEventOnDate(date)),
            }}
            modifiersClassNames={{
              event: "border-solid border-2 border-emerald-500",
            }}
            components={{
              DayContent: (props) => {
                const event = hasEventOnDate(props.date);
                if (event) {
                  return (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className={`relative h-full w-full p-2 flex items-center justify-center font-medium ${
                          event.type === 'success' ? 'bg-emerald-100' :
                          event.type === 'warning' ? 'bg-amber-100' :
                          event.type === 'danger' ? 'bg-red-100' : 'bg-blue-100'
                        }`}>
                          {props.date.getDate()}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {event.title}
                      </TooltipContent>
                    </Tooltip>
                  );
                }
                return <div className="p-2">{props.date.getDate()}</div>;
              },
            }}
          />
        </TooltipProvider>
        
        {selectedDayEvents.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
              <Info size={14} className="text-emerald-600" />
              Eventos do dia:
            </h3>
            <div className="space-y-2">
              {selectedDayEvents.map((event, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Badge 
                    className={
                      event.type === 'success' ? 'bg-emerald-500' :
                      event.type === 'warning' ? 'bg-amber-500' :
                      event.type === 'danger' ? 'bg-red-500' : 'bg-blue-500'
                    }
                  >
                    {event.type === 'success' ? 'Evento' :
                     event.type === 'warning' ? 'Atenção' :
                     event.type === 'danger' ? 'Crítico' : 'Informação'}
                  </Badge>
                  <span className="text-sm">{event.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CalendarWidget;
