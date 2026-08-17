import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { Booking } from './BookingList';

interface ViewTicketModalProps {
  open: boolean;
  onClose: () => void;
  booking: Booking | null;
}

export function ViewTicketModal({ open, onClose, booking }: ViewTicketModalProps) {
  if (!booking) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>Detalles del Ticket (Solo Lectura)</DialogTitle>
            <button onClick={onClose} className="hover:bg-gray-100 rounded p-1">
              <X className="h-5 w-5" />
            </button>
          </div>
          <DialogDescription>
            Información completa del ticket y reserva
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Información del Booking */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Booking</p>
              <p className="font-mono">{booking.bookingCode}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ticket</p>
              <p className="font-mono text-blue-600">{booking.ticketCode}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fecha Reserva</p>
              <p>{booking.fechaReserva}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estado</p>
              <p className="text-green-600">Finalizado</p>
            </div>
          </div>

          {/* Datos del Ticket */}
          {booking.ticketData && (
            <>
              <div className="border-t pt-4">
                <h3 className="mb-3">Datos del Contenedor</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Contenedor</p>
                    <p>{booking.ticketData.contenedor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tipo</p>
                    <p>{booking.ticketData.tipoContenedor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Depósito</p>
                    <p>{booking.ticketData.deposito}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Línea</p>
                    <p>{booking.ticketData.linea}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tipo Depósito</p>
                    <p>{booking.ticketData.tipoDeposito}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Operación</p>
                    <p>{booking.operacion}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="mb-3">Datos del Cliente</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Cédula/RUC</p>
                    <p>{booking.ticketData.clienteId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nombre</p>
                    <p>{booking.ticketData.clienteNombre}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="mb-3">Datos del Chofer</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Nombre</p>
                    <p>{booking.ticketData.choferNombre}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Cédula</p>
                    <p>{booking.ticketData.choferCedula}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="mb-3">Datos del Vehículo</h3>
                <div>
                  <p className="text-sm text-muted-foreground">Placa</p>
                  <p>{booking.ticketData.vehiculoPlaca}</p>
                </div>
              </div>
            </>
          )}

          {booking.fechaTicket && booking.horario && (
            <div className="border-t pt-4">
              <h3 className="mb-3">Turno Asignado</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Fecha</p>
                  <p>{booking.fechaTicket}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Horario y Cupo</p>
                  <p>{booking.horario.split('-')[0]} - Cupo {booking.horario.split('-')[1]}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button onClick={onClose} variant="outline">
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
