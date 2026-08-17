import { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Booking } from './BookingList';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

interface DashboardProps {
  bookings: Booking[];
  onBookingClick?: (booking: Booking) => void;
}

export function Dashboard({ bookings, onBookingClick }: DashboardProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => 
    startOfWeek(new Date(), { weekStartsOn: 1 }) // Start on Monday
  );

  // Generate array of 7 days for the week
  const weekDays = Array.from({ length: 7 }, (_, i) => 
    addDays(currentWeekStart, i)
  );

  const handlePreviousWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, -7));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7));
  };

  const handleToday = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  // Get only time slots that have at least one booking in the current week
  const activeTimeSlots = useMemo(() => {
    const slots = new Set<string>();
    
    bookings.forEach(booking => {
      if (!booking.fechaTicket || !booking.horario) return;
      
      const bookingDate = new Date(booking.fechaTicket);
      const [bookingTime] = booking.horario.split('-');
      
      // Check if booking is in current week
      const isInWeek = weekDays.some(day => isSameDay(day, bookingDate));
      if (isInWeek) {
        slots.add(bookingTime);
      }
    });
    
    // Sort time slots
    return Array.from(slots).sort();
  }, [bookings, currentWeekStart]);

  // Get bookings for a specific date and time slot
  const getBookingsForSlot = (date: Date, timeSlot: string) => {
    return bookings.filter(booking => {
      if (!booking.fechaTicket || !booking.horario) return false;
      
      const bookingDate = new Date(booking.fechaTicket);
      const [bookingTime] = booking.horario.split('-');
      
      return isSameDay(bookingDate, date) && bookingTime === timeSlot;
    });
  };

  // Extract sequential number from ticket code (TCK-001 -> 1)
  const getTicketSequential = (ticketCode: string) => {
    const match = ticketCode.match(/TCK-(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  // Get color class based on booking status
  const getBookingColor = (booking: Booking) => {
    if (booking.estado === 'Finalizado') {
      return 'bg-gray-400 text-white border-gray-500';
    }
    if (booking.estado === 'Agendado' && booking.pagado) {
      return 'bg-green-500 text-white border-green-600';
    }
    if (booking.estado === 'Agendado' && !booking.pagado) {
      return 'bg-red-500 text-white border-red-600';
    }
    return 'bg-white text-gray-700 border-gray-300';
  };

  // Get status text
  const getStatusText = (booking: Booking) => {
    if (booking.estado === 'Finalizado') return 'Finalizado';
    if (booking.estado === 'Agendado' && booking.pagado) return 'Pagado';
    if (booking.estado === 'Agendado' && !booking.pagado) return 'No Pagado';
    return 'Reservado';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="mb-2">Dashboard de Reservas</h1>
          <p className="text-muted-foreground">
            Vista semanal de turnos agendados en el patio de contenedores
          </p>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <div className="flex flex-wrap gap-4 items-center">
            <span className="text-sm">Leyenda:</span>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white border-2 border-gray-300 rounded"></div>
              <span className="text-sm">Reservado (No agendado)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-500 border-2 border-red-600 rounded"></div>
              <span className="text-sm">Agendado sin pago</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-500 border-2 border-green-600 rounded"></div>
              <span className="text-sm">Agendado pagado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-400 border-2 border-gray-500 rounded"></div>
              <span className="text-sm">Finalizado</span>
            </div>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousWeek}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Semana Anterior
            </Button>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleToday}
                className="gap-2"
              >
                <Calendar className="h-4 w-4" />
                Hoy
              </Button>
              <span className="font-medium">
                {format(weekDays[0], 'dd MMM', { locale: es })} - {format(weekDays[6], 'dd MMM yyyy', { locale: es })}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNextWeek}
              className="gap-2"
            >
              Semana Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[1200px]">
              {/* Header Row - Days */}
              <div className="grid grid-cols-8 border-b-2 border-gray-300 bg-gradient-to-r from-blue-500 to-indigo-600">
                <div className="p-3 border-r border-blue-400">
                  <span className="text-sm text-white">Horario</span>
                </div>
                {weekDays.map((day, index) => (
                  <div
                    key={index}
                    className={`p-3 text-center border-r border-blue-400 last:border-r-0 ${
                      isSameDay(day, new Date()) ? 'bg-yellow-400' : ''
                    }`}
                  >
                    <div className={`${isSameDay(day, new Date()) ? 'text-gray-900' : 'text-white'}`}>
                      <div className="text-xs uppercase">
                        {format(day, 'EEE', { locale: es })}
                      </div>
                      <div className="text-lg font-medium">
                        {format(day, 'dd')}
                      </div>
                      <div className="text-xs">
                        {format(day, 'MMM', { locale: es })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Time Slots Rows - Only show rows with bookings */}
              {activeTimeSlots.length === 0 ? (
                <div className="col-span-8 p-8 text-center text-muted-foreground">
                  <p>No hay tickets agendados para esta semana</p>
                </div>
              ) : (
                activeTimeSlots.map((timeSlot) => {
                  const hour = parseInt(timeSlot.split(':')[0]);
                  const isOfficeHours = hour >= 8 && hour < 18;
                  
                  return (
                    <div
                      key={timeSlot}
                      className={`grid grid-cols-8 border-b border-gray-200 ${
                        isOfficeHours ? 'bg-yellow-50' : 'bg-blue-50'
                      }`}
                    >
                      {/* Time Label */}
                      <div className="p-3 border-r border-gray-300 flex items-center">
                        <span className="text-sm font-medium">{timeSlot}</span>
                      </div>

                      {/* Day Columns */}
                      {weekDays.map((day, dayIndex) => {
                        const slotBookings = getBookingsForSlot(day, timeSlot);
                        
                        return (
                          <div
                            key={dayIndex}
                            className="border-r border-gray-200 last:border-r-0 p-2 min-h-[50px]"
                          >
                            {slotBookings.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {slotBookings.map(booking => {
                                  const [, cupo] = booking.horario!.split('-');
                                  const sequential = getTicketSequential(booking.ticketCode);
                                  const displayCode = `TCK-${sequential}-${cupo}`;
                                  
                                  return (
                                    <TooltipProvider key={booking.id}>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <div
                                            className={`
                                              rounded px-2 py-1 text-xs cursor-pointer
                                              transition-all hover:scale-105 border-2
                                              ${getBookingColor(booking)}
                                            `}
                                            onClick={() => onBookingClick?.(booking)}
                                          >
                                            <span className="font-medium whitespace-nowrap">{displayCode}</span>
                                          </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <div className="space-y-1">
                                            <p className="font-medium">{booking.ticketCode}</p>
                                            <p className="text-xs">Booking: {booking.bookingCode}</p>
                                            <p className="text-xs">Operación: {booking.operacion}</p>
                                            {booking.ticketData && (
                                              <>
                                                <p className="text-xs">Contenedor: {booking.ticketData.contenedor}</p>
                                                <p className="text-xs">Cliente: {booking.ticketData.clienteNombre}</p>
                                                <p className="text-xs">Chofer: {booking.ticketData.choferNombre}</p>
                                                <p className="text-xs">Vehículo: {booking.ticketData.vehiculoPlaca}</p>
                                              </>
                                            )}
                                            <p className="text-xs font-medium mt-1">
                                              Estado: {getStatusText(booking)}
                                            </p>
                                          </div>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="h-full flex items-center justify-center">
                                <span className="text-gray-300 text-xs">-</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-muted-foreground mb-1">Total Reservas</div>
            <div className="text-2xl">{bookings.length}</div>
          </div>
          <div className="bg-red-50 rounded-lg shadow p-4 border-2 border-red-200">
            <div className="text-sm text-red-700 mb-1">Agendadas sin pago</div>
            <div className="text-2xl text-red-600">
              {bookings.filter(b => b.estado === 'Agendado' && !b.pagado).length}
            </div>
          </div>
          <div className="bg-green-50 rounded-lg shadow p-4 border-2 border-green-200">
            <div className="text-sm text-green-700 mb-1">Agendadas pagadas</div>
            <div className="text-2xl text-green-600">
              {bookings.filter(b => b.estado === 'Agendado' && b.pagado).length}
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg shadow p-4 border-2 border-gray-300">
            <div className="text-sm text-gray-700 mb-1">Finalizadas</div>
            <div className="text-2xl text-gray-600">
              {bookings.filter(b => b.estado === 'Finalizado').length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
