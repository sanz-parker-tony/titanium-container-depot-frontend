import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Download, CheckCircle2, Copy } from 'lucide-react';
import { Separator } from './ui/separator';
import { toast } from 'sonner';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  ticketData: {
    id: string;
    bookingCode?: string;
    ticketCode?: string;
    contenedor?: string;
    tipoContenedor?: string;
    operacion?: string;
    fecha: string;
    horario?: string;
    monto: number;
  };
  onDownloadPDF: () => void;
}

export function PaymentModal({ open, onClose, ticketData, onDownloadPDF }: PaymentModalProps) {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado al portapapeles`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle className="text-center">¡Reserva Confirmada!</DialogTitle>
          <DialogDescription className="text-center">
            Completa el pago para asegurar tu espacio
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            {ticketData.bookingCode && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Booking:</span>
                <span className="font-mono text-sm">{ticketData.bookingCode}</span>
              </div>
            )}
            {ticketData.ticketCode && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Ticket:</span>
                <span className="font-mono text-sm text-blue-600">{ticketData.ticketCode}</span>
              </div>
            )}
            {ticketData.contenedor && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Contenedor:</span>
                <span>{ticketData.contenedor}</span>
              </div>
            )}
            {ticketData.tipoContenedor && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Tipo:</span>
                <span>{ticketData.tipoContenedor}</span>
              </div>
            )}
            {ticketData.operacion && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Operación:</span>
                <span>{ticketData.operacion}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Fecha:</span>
              <span>{ticketData.fecha}</span>
            </div>
            {ticketData.horario && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Horario:</span>
                <span>{ticketData.horario.split('-')[0]} - Cupo {ticketData.horario.split('-')[1]}</span>
              </div>
            )}
          </div>

          <Separator />

          <div>
            <h4 className="mb-3">Detalles de Pago</h4>
            <div className="space-y-3 bg-blue-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Monto a transferir:</span>
                <span className="text-xl text-blue-600">${ticketData.monto.toFixed(2)}</span>
              </div>
              
              <Separator className="bg-blue-200" />
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Número de cuenta:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">1234567890</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => copyToClipboard('1234567890', 'Número de cuenta')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Banco:</span>
                  <span className="text-sm">Banco Nacional</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Titular:</span>
                  <span className="text-sm">Patio de Contenedores S.A.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs text-amber-800">
              <strong>Importante:</strong> Una vez confirmado el pago, recibirás la confirmación final de tu reserva. 
              Los espacios quedarán bloqueados por 24 horas.
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={onDownloadPDF} className="flex-1 gap-2">
              <Download className="h-4 w-4" />
              Descargar PDF
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cerrar
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            El PDF contiene todos los detalles de tu reserva y orden de pago
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
