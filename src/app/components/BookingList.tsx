import { Edit2, Trash2, Plus, DollarSign, Eye, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { useState } from 'react';

export interface Booking {
  id: string;
  bookingCode: string; // 15 digits
  ticketCode: string; // TCK-XXX or empty
  fechaReserva: string; // Fecha de la reserva
  fechaTicket?: string; // Fecha del ticket cuando está agendado
  horario?: string; // Horario y cupo (e.g., "08:00-1")
  estado: 'Reservado' | 'Agendado' | 'Finalizado';
  operacion: 'Importación' | 'Exportación';
  ultimaActualizacion: string;
  pagado?: boolean;
  condicionesPago?: string; // Condiciones de pago (e.g., "30 días", "60 días", "Contado")
  // Datos adicionales del ticket para edición
  ticketData?: {
    contenedor: string;
    tipoContenedor: string;
    deposito: string;
    linea: string;
    tipoDeposito: string;
    clienteId: string;
    clienteNombre: string;
    choferNombre: string;
    choferCedula: string;
    vehiculoPlaca: string;
  };
}

interface BookingListProps {
  bookings: Booking[];
  onCreateTicket: (booking: Booking) => void;
  onEditTicket: (booking: Booking) => void;
  onViewTicket: (booking: Booking) => void;
  onDeleteTicket: (id: string) => void;
  onRegisterPayment: (id: string) => void;
  onDownloadPDF: (booking: Booking) => void;
}

export function BookingList({
  bookings,
  onCreateTicket,
  onEditTicket,
  onViewTicket,
  onDeleteTicket,
  onRegisterPayment,
  onDownloadPDF,
}: BookingListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Tickets agendados siempre son editables (sin importar cuánto falta)
  const isEditableTicket = (booking: Booking): boolean => {
    return booking.estado === 'Agendado';
  };

  // Check if ticket date/time is still valid
  const isTicketValid = (booking: Booking): boolean => {
    if (!booking.fechaTicket || !booking.horario) return false;
    
    const [time] = booking.horario.split('-');
    const [hours, minutes] = time.split(':').map(Number);
    const ticketDateTime = new Date(booking.fechaTicket);
    ticketDateTime.setHours(hours, minutes, 0, 0);
    
    const now = new Date();
    return ticketDateTime > now;
  };

  const getStatusColor = (estado: Booking['estado']) => {
    switch (estado) {
      case 'Finalizado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Agendado':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Reservado':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-4 md:p-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="mb-2">Gestión de Reservas - Patio de Contenedores</h1>
          <p className="text-muted-foreground">
            Administra reservas de importación y exportación
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>ID</TableHead>
                  <TableHead>Booking</TableHead>
                  <TableHead>Ticket</TableHead>
                  <TableHead>Fecha Reserva</TableHead>
                  <TableHead>Fecha/Hora/Cupo Ticket</TableHead>
                  <TableHead>Tipo de Operación</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                      No hay reservas disponibles.
                    </TableCell>
                  </TableRow>
                ) : (
                  bookings.map((booking) => {
                    const canEdit = isEditableTicket(booking);
                    const isValid = isTicketValid(booking);
                    
                    return (
                      <TableRow key={booking.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="font-medium">#{booking.id}</TableCell>
                        <TableCell className="font-mono text-sm">{booking.bookingCode}</TableCell>
                        <TableCell>
                          {booking.ticketCode ? (
                            <span className="font-mono text-sm text-blue-600">{booking.ticketCode}</span>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell>{booking.fechaReserva}</TableCell>
                        <TableCell>
                          {booking.fechaTicket && booking.horario ? (
                            <div className="flex flex-col">
                              <span className="text-sm">{booking.fechaTicket}</span>
                              <span className="text-xs text-muted-foreground">
                                {booking.horario.split('-')[0]} - Cupo {booking.horario.split('-')[1]}
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell>{booking.operacion}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge variant="outline" className={getStatusColor(booking.estado)}>
                              {booking.estado}
                            </Badge>
                            {booking.ticketCode && (
                              <Badge variant="outline" className={
                                booking.pagado 
                                  ? 'bg-green-50 text-green-700 border-green-200 text-xs' 
                                  : 'bg-orange-50 text-orange-700 border-orange-200 text-xs'
                              }>
                                {booking.pagado ? 'Pagado' : 'Pendiente pago'}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            {/* Crear ticket - Solo cuando está Reservado */}
                            {booking.estado === 'Reservado' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onCreateTicket(booking)}
                                className="hover:bg-green-50 hover:text-green-600"
                                title="Crear ticket"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            )}
                            
                            {/* Editar - Solo si está Agendado (pagado o no) */}
                            {booking.estado === 'Agendado' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onEditTicket(booking)}
                                className="hover:bg-blue-50"
                                title="Editar ticket"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            )}
                            
                            {/* Ver - Solo cuando está Finalizado */}
                            {booking.estado === 'Finalizado' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onViewTicket(booking)}
                                className="hover:bg-purple-50 hover:text-purple-600"
                                title="Ver detalles"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                            
                            {/* PDF - Todas las reservas agendadas */}
                            {booking.estado === 'Agendado' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDownloadPDF(booking)}
                                className="hover:bg-red-50 hover:text-red-600"
                                title="Descargar PDF"
                              >
                                <FileText className="h-4 w-4 text-red-600" />
                              </Button>
                            )}
                            
                            {/* Eliminar - Solo si está Agendado Y pendiente de pago */}
                            {booking.estado === 'Agendado' && !booking.pagado && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeleteId(booking.id)}
                                className="hover:bg-red-50 hover:text-red-600"
                                title="Eliminar ticket"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                            
                            {/* Registrar Pago - Solo si está Agendado y pendiente de pago */}
                            {booking.estado === 'Agendado' && !booking.pagado && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onRegisterPayment(booking.id)}
                                className="hover:bg-green-50 hover:text-green-600"
                                title="Registrar pago"
                              >
                                <DollarSign className="h-4 w-4 text-green-600" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el ticket asignado. La reserva volverá al estado "Reservado".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  onDeleteTicket(deleteId);
                  setDeleteId(null);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
