import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Badge } from './ui/badge';
import { Booking } from './BookingList';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

interface OperationalDashboardProps {
  bookings: Booking[];
  onBookingClick?: (booking: Booking) => void;
}

export function OperationalDashboard({ bookings, onBookingClick }: OperationalDashboardProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  // Generar horarios desde 08:00 hasta 23:45 cada 15 minutos
  const generateTimeSlots = () => {
    const slots: string[] = [];
    for (let hour = 8; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        if (hour === 23 && minute > 45) break;
        const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Generar los 7 días de la semana
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  // Función para obtener el color según el horario
  const getTimeSlotColor = (time: string) => {
    const [hour] = time.split(':').map(Number);
    if (hour >= 8 && hour < 17) {
      return 'bg-yellow-100';
    } else if (hour >= 17 && hour < 24) {
      return 'bg-blue-900 text-white';
    }
    return 'bg-gray-100';
  };

  // Función para obtener tickets de un día/hora/cupo específico
  const getTicketForSlot = (date: Date, time: string, cupo: number): Booking | null => {
    return bookings.find(booking => {
      if (!booking.fechaTicket || !booking.horario) return false;
      
      const bookingDate = new Date(booking.fechaTicket);
      const [bookingTime, bookingCupo] = booking.horario.split('-');
      
      return (
        isSameDay(bookingDate, date) &&
        bookingTime === time &&
        parseInt(bookingCupo) === cupo &&
        booking.estado !== 'Reservado'
      );
    }) || null;
  };

  // Función para obtener el color del badge según el estado del ticket
  const getTicketBadgeClass = (booking: Booking) => {
    if (booking.estado === 'Finalizado') {
      return 'bg-gray-400 text-white border-0 hover:bg-gray-500';
    }
    if (!booking.pagado) {
      return 'bg-red-500 text-white border-0 hover:bg-red-600';
    }
    return 'bg-green-500 text-white border-0 hover:bg-green-600';
  };

  // Función para navegar semanas
  const goToPreviousWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, -7));
  };

  const goToNextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7));
  };

  const goToToday = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  // Calcular estadísticas
  const totalReservas = bookings.filter(b => b.ticketCode).length;
  const agendadasSinPago = bookings.filter(b => b.estado === 'Agendado' && !b.pagado).length;
  const agendadasPagadas = bookings.filter(b => b.estado === 'Agendado' && b.pagado).length;
  const finalizadas = bookings.filter(b => b.estado === 'Finalizado').length;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl">Dashboard de Reservas</h1>
          <p className="text-sm text-gray-600">Vista semanal de turnos agendados en el patio de contenedores</p>
        </div>
      </div>

      {/* Leyenda */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-6 flex-wrap">
            <span className="text-sm">Leyenda:</span>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded"></div>
              <span className="text-sm">Reservado (No agendado)</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-red-500 text-white border-0">TCK</Badge>
              <span className="text-sm">Agendado sin pago</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500 text-white border-0">TCK</Badge>
              <span className="text-sm">Agendado pagado</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-gray-400 text-white border-0">TCK</Badge>
              <span className="text-sm">Finalizado</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navegación de semanas */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={goToPreviousWeek} className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Semana Anterior
            </Button>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={goToToday} className="gap-2">
                <Calendar className="h-4 w-4" />
                Hoy
              </Button>
              <div className="text-center">
                <div className="text-sm text-gray-600">
                  {format(currentWeekStart, "d 'de' MMMM", { locale: es })} - {format(addDays(currentWeekStart, 6), "d 'de' MMMM, yyyy", { locale: es })}
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={goToNextWeek} className="gap-2">
              Semana Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de turnos */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="sticky left-0 z-20 bg-blue-600 text-white p-3 border text-left min-w-[100px]">
                    Horario
                  </th>
                  {weekDays.map((day, index) => {
                    const dayName = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'][index];
                    const isWeekend = index >= 5;
                    return (
                      <th 
                        key={day.toISOString()} 
                        className={`p-3 border text-center min-w-[160px] ${
                          isWeekend ? 'bg-blue-500 text-white' : 'bg-yellow-500 text-gray-900'
                        }`}
                      >
                        <div className="text-xs">{dayName}</div>
                        <div className="text-lg">{format(day, 'd')}</div>
                        <div className="text-xs">{format(day, 'MMM', { locale: es })}</div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((time) => (
                  <tr key={time}>
                    <td className={`sticky left-0 z-10 p-2 border text-center ${getTimeSlotColor(time)}`}>
                      <div className="text-sm">{time}</div>
                    </td>
                    {weekDays.map((day) => (
                      <td key={`${day.toISOString()}-${time}`} className="p-1 border bg-white">
                        <div className="grid grid-cols-2 gap-1 min-h-[60px]">
                          {[1, 2, 3, 4].map((cupo) => {
                            const ticket = getTicketForSlot(day, time, cupo);
                            return (
                              <div 
                                key={cupo} 
                                className="flex items-center justify-center p-1 border border-gray-200 rounded min-h-[28px] bg-gray-50"
                              >
                                {ticket ? (
                                  <Badge 
                                    className={`text-xs cursor-pointer ${getTicketBadgeClass(ticket)}`}
                                    onClick={() => onBookingClick && onBookingClick(ticket)}
                                  >
                                    {ticket.ticketCode}-{cupo}
                                  </Badge>
                                ) : (
                                  <span className="text-xs text-gray-400">{cupo}</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Resumen de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl mb-2">{totalReservas}</div>
              <div className="text-sm text-gray-600">Total Reservas</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl text-red-700 mb-2">{agendadasSinPago}</div>
              <div className="text-sm text-red-800">Agendadas sin pago</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl text-green-700 mb-2">{agendadasPagadas}</div>
              <div className="text-sm text-green-800">Agendadas pagadas</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-100 border-gray-300">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl text-gray-700 mb-2">{finalizadas}</div>
              <div className="text-sm text-gray-800">Finalizadas</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
