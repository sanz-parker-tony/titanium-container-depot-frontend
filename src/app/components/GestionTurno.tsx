import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Search, Calendar, DollarSign, Clock, Bell, Eye, CreditCard, AlertCircle } from 'lucide-react';
import { Booking } from './BookingList';

interface GestionTurnoProps {
  bookings: Booking[];
  onAgendarClick?: (booking: Booking) => void;
  onPagarClick?: (booking: Booking) => void;
  onViewClick?: (booking: Booking) => void;
}

export function GestionTurno({ bookings, onAgendarClick, onPagarClick, onViewClick }: GestionTurnoProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'todos' | 'pendientes-agendar' | 'pendientes-pago' | 'proximos'>('todos');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Calcular días restantes
  const getDaysRemaining = (fechaTicket?: string): number => {
    if (!fechaTicket) return 0;
    const today = new Date();
    const ticketDate = new Date(fechaTicket);
    const diffTime = ticketDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Filtrar bookings según filtro activo
  const getFilteredBookings = () => {
    let filtered = bookings;

    switch (filter) {
      case 'pendientes-agendar':
        filtered = bookings.filter(b => b.estado === 'Reservado' && !b.ticketCode);
        break;
      case 'pendientes-pago':
        filtered = bookings.filter(b => b.ticketCode && !b.pagado && b.estado !== 'Finalizado');
        break;
      case 'proximos':
        filtered = bookings.filter(b => {
          const days = getDaysRemaining(b.fechaTicket);
          return b.estado === 'Agendado' && days >= 0 && days <= 2;
        });
        break;
      default:
        filtered = bookings;
    }

    if (searchTerm) {
      filtered = filtered.filter(b =>
        b.bookingCode.includes(searchTerm) ||
        b.ticketCode?.includes(searchTerm) ||
        b.ticketData?.contenedor?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredBookings = getFilteredBookings();

  // Contar por categoría
  const pendientesAgendar = bookings.filter(b => b.estado === 'Reservado' && !b.ticketCode).length;
  const pendientesPago = bookings.filter(b => b.ticketCode && !b.pagado && b.estado !== 'Finalizado').length;
  const proximosTurnos = bookings.filter(b => {
    const days = getDaysRemaining(b.fechaTicket);
    return b.estado === 'Agendado' && days >= 0 && days <= 2;
  }).length;

  // Monto pendiente estimado
  const montoPendiente = bookings
    .filter(b => b.ticketCode && !b.pagado)
    .reduce((sum, b) => {
      const [time] = (b.horario || '08:00-1').split('-');
      const [hour] = time.split(':').map(Number);
      const isOfficeHours = hour >= 8 && hour < 18;
      return sum + (isOfficeHours ? 50 : 75);
    }, 0);

  const getEstadoBadge = (booking: Booking) => {
    if (booking.estado === 'Finalizado') {
      return <Badge className="bg-gray-400 text-white border-0">Finalizado</Badge>;
    }
    if (booking.estado === 'Reservado' && !booking.ticketCode) {
      return <Badge className="bg-yellow-500 text-white border-0">Pendiente de agendar</Badge>;
    }
    if (booking.ticketCode && !booking.pagado) {
      return <Badge className="bg-red-500 text-white border-0">Pendiente de pago</Badge>;
    }
    if (booking.estado === 'Agendado' && booking.pagado) {
      return <Badge className="bg-blue-500 text-white border-0">Confirmado</Badge>;
    }
    return <Badge variant="outline">{booking.estado}</Badge>;
  };

  const getRowColor = (booking: Booking) => {
    if (booking.estado === 'Finalizado') return '';
    if (booking.ticketCode && !booking.pagado) return 'bg-red-50 hover:bg-red-100';
    if (!booking.ticketCode) return 'bg-yellow-50 hover:bg-yellow-100';
    
    const days = getDaysRemaining(booking.fechaTicket);
    if (days >= 0 && days <= 1) return 'bg-blue-50 hover:bg-blue-100';
    
    if (booking.estado === 'Agendado' && booking.pagado) return 'bg-green-50 hover:bg-green-100';
    return '';
  };

  const getAlertMessage = (booking: Booking) => {
    const days = getDaysRemaining(booking.fechaTicket);
    
    if (!booking.ticketCode) {
      return { icon: '🟡', message: 'Sin agendar', color: 'text-yellow-600' };
    }
    if (booking.ticketCode && !booking.pagado) {
      return { icon: '🔴', message: 'Pago pendiente', color: 'text-red-600' };
    }
    if (days >= 0 && days <= 1) {
      return { icon: '🔵', message: `Turno en ${days === 0 ? 'hoy' : days + 'd'}`, color: 'text-blue-600' };
    }
    if (booking.estado === 'Agendado' && booking.pagado) {
      return { icon: '🟢', message: 'Confirmado', color: 'text-green-600' };
    }
    
    return null;
  };

  const handleViewDetail = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl mb-2">Gestión de Turno</h1>
        <p className="text-sm text-gray-600">
          Monitoree y gestione el estado de sus reservas, pagos y turnos próximos. Reciba alertas automáticas para evitar retrasos o vencimientos.
        </p>
      </div>

      {/* Widgets superiores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card 
          className={`cursor-pointer transition-all hover:shadow-md ${filter === 'pendientes-agendar' ? 'ring-2 ring-yellow-500' : ''}`}
          onClick={() => setFilter('pendientes-agendar')}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-3xl">{pendientesAgendar}</div>
                <div className="text-sm text-gray-600">Reservas pendientes de agendar</div>
                <div className="text-xs text-gray-500 mt-1">Esperando selección de fecha/hora</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all hover:shadow-md ${filter === 'pendientes-pago' ? 'ring-2 ring-red-500' : ''}`}
          onClick={() => setFilter('pendientes-pago')}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-full">
                <CreditCard className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <div className="text-3xl">{pendientesPago}</div>
                <div className="text-sm text-gray-600">Tickets pendientes de pago</div>
                <div className="text-xs text-gray-500 mt-1">Monto estimado: ${montoPendiente.toFixed(2)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all hover:shadow-md ${filter === 'proximos' ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => setFilter('proximos')}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-3xl">{proximosTurnos}</div>
                <div className="text-sm text-gray-600">Turnos próximos</div>
                <div className="text-xs text-gray-500 mt-1">Dentro de las próximas 48h</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barra de filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por ticket, booking o contenedor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filter === 'todos' ? 'default' : 'outline'}
                onClick={() => setFilter('todos')}
                size="sm"
              >
                Todos
              </Button>
              <Button
                variant={filter === 'pendientes-agendar' ? 'default' : 'outline'}
                onClick={() => setFilter('pendientes-agendar')}
                size="sm"
                className={filter === 'pendientes-agendar' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
              >
                🕒 Pendientes de agendar
              </Button>
              <Button
                variant={filter === 'pendientes-pago' ? 'default' : 'outline'}
                onClick={() => setFilter('pendientes-pago')}
                size="sm"
                className={filter === 'pendientes-pago' ? 'bg-red-500 hover:bg-red-600' : ''}
              >
                💳 Pendientes de pago
              </Button>
              <Button
                variant={filter === 'proximos' ? 'default' : 'outline'}
                onClick={() => setFilter('proximos')}
                size="sm"
                className={filter === 'proximos' ? 'bg-blue-500 hover:bg-blue-600' : ''}
              >
                📅 Próximos a cumplir
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de gestión */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº Ticket / Reserva</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Contenedor</TableHead>
                  <TableHead>Estado Actual</TableHead>
                  <TableHead>Fecha Agendada</TableHead>
                  <TableHead>Días Restantes</TableHead>
                  <TableHead>Monto / Pago</TableHead>
                  <TableHead>Alerta</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => {
                  const days = getDaysRemaining(booking.fechaTicket);
                  const alert = getAlertMessage(booking);
                  const [time] = (booking.horario || '08:00-1').split('-');
                  const [hour] = time.split(':').map(Number);
                  const isOfficeHours = hour >= 8 && hour < 18;
                  const monto = isOfficeHours ? 50 : 75;

                  return (
                    <TableRow key={booking.id} className={getRowColor(booking)}>
                      <TableCell>
                        <div>
                          <div className="cursor-pointer hover:underline" onClick={() => handleViewDetail(booking)}>
                            {booking.ticketCode || booking.bookingCode}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{booking.operacion}</TableCell>
                      <TableCell>{booking.ticketData?.contenedor || '-'}</TableCell>
                      <TableCell>{getEstadoBadge(booking)}</TableCell>
                      <TableCell>
                        {booking.fechaTicket ? (
                          <div>
                            <div>{new Date(booking.fechaTicket).toLocaleDateString('es-EC')}</div>
                            <div className="text-xs text-gray-500">{booking.horario?.split('-')[0]}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">Sin agendar</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {booking.fechaTicket ? (
                          <span className={days < 0 ? 'text-red-600' : days <= 1 ? 'text-blue-600' : ''}>
                            {days < 0 ? `Vencido hace ${Math.abs(days)}d` : days === 0 ? 'Hoy' : `Faltan ${days}d`}
                          </span>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        {booking.ticketCode ? (
                          <div>
                            <div>${monto.toFixed(2)}</div>
                            <Badge variant={booking.pagado ? 'default' : 'destructive'} className="text-xs mt-1">
                              {booking.pagado ? 'Pagado' : 'Pendiente'}
                            </Badge>
                          </div>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        {alert && (
                          <div className={`flex items-center gap-1 text-sm ${alert.color}`}>
                            <span>{alert.icon}</span>
                            <span>{alert.message}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          {!booking.ticketCode && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onAgendarClick && onAgendarClick(booking)}
                              className="gap-1"
                            >
                              <Calendar className="h-3 w-3" />
                              Agendar
                            </Button>
                          )}
                          {booking.ticketCode && !booking.pagado && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onPagarClick && onPagarClick(booking)}
                              className="gap-1"
                            >
                              <CreditCard className="h-3 w-3" />
                              Pagar
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetail(booking)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredBookings.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      No se encontraron registros
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de detalle */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalle de Operación</DialogTitle>
            <DialogDescription>
              {selectedBooking?.ticketCode || selectedBooking?.bookingCode}
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              {/* Datos del contenedor */}
              <div>
                <h3 className="mb-3">Datos del Contenedor</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <Label className="text-gray-600">Nº de Contenedor</Label>
                    <p className="mt-1">{selectedBooking.ticketData?.contenedor || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Tipo</Label>
                    <p className="mt-1">{selectedBooking.ticketData?.tipoContenedor || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Naviera</Label>
                    <p className="mt-1">{selectedBooking.ticketData?.linea || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Operación</Label>
                    <p className="mt-1">{selectedBooking.operacion}</p>
                  </div>
                </div>
              </div>

              {/* Información del turno */}
              <div>
                <h3 className="mb-3">Información del Turno</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <Label className="text-gray-600">Fecha y Hora Agendada</Label>
                    <p className="mt-1">
                      {selectedBooking.fechaTicket 
                        ? `${new Date(selectedBooking.fechaTicket).toLocaleDateString('es-EC')} ${selectedBooking.horario?.split('-')[0]}`
                        : 'Sin agendar'
                      }
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Estado Actual</Label>
                    <div className="mt-1">{getEstadoBadge(selectedBooking)}</div>
                  </div>
                  <div>
                    <Label className="text-gray-600">Ubicación</Label>
                    <p className="mt-1">{selectedBooking.ticketData?.deposito || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Última Actualización</Label>
                    <p className="mt-1">{selectedBooking.ultimaActualizacion}</p>
                  </div>
                </div>
              </div>

              {/* Datos financieros */}
              <div>
                <h3 className="mb-3">Datos Financieros</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <Label className="text-gray-600">Valor del Ticket</Label>
                    <p className="mt-1">
                      {selectedBooking.ticketCode ? (
                        (() => {
                          const [time] = (selectedBooking.horario || '08:00-1').split('-');
                          const [hour] = time.split(':').map(Number);
                          const isOfficeHours = hour >= 8 && hour < 18;
                          const monto = isOfficeHours ? 50 : 75;
                          return `$${monto.toFixed(2)}`;
                        })()
                      ) : '-'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Estado del Pago</Label>
                    <div className="mt-1">
                      {selectedBooking.ticketCode && (
                        <Badge variant={selectedBooking.pagado ? 'default' : 'destructive'}>
                          {selectedBooking.pagado ? 'Pagado' : 'Pendiente'}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
