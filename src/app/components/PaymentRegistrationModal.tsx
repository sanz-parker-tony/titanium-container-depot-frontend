import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Upload, CreditCard, X } from 'lucide-react';
import { useState } from 'react';
import { Booking } from './BookingList';

interface PaymentRegistrationModalProps {
  open: boolean;
  onClose: () => void;
  booking: Booking | null;
  onRegisterPayment: (paymentData: {
    bookingId: string;
    method: 'transfer' | 'card';
    reference?: string;
    file?: File;
  }) => void;
}

export function PaymentRegistrationModal({ 
  open, 
  onClose, 
  booking,
  onRegisterPayment 
}: PaymentRegistrationModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'card'>('transfer');
  const [reference, setReference] = useState('');
  const [file, setFile] = useState<File | undefined>();
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  if (!booking) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentMethod === 'transfer' && !reference) {
      alert('Por favor ingrese el número de referencia');
      return;
    }
    
    if (paymentMethod === 'card' && (!cardNumber || !cardExpiry || !cardCvv)) {
      alert('Por favor complete todos los datos de la tarjeta');
      return;
    }

    onRegisterPayment({
      bookingId: booking.id,
      method: paymentMethod,
      reference: paymentMethod === 'transfer' ? reference : cardNumber,
      file,
    });

    // Reset form
    setReference('');
    setFile(undefined);
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
  };

  const calculateAmount = () => {
    if (!booking.horario) return 0;
    const [time] = booking.horario.split('-');
    const [hour] = time.split(':').map(Number);
    const isOfficeHours = hour >= 8 && hour < 18;
    return isOfficeHours ? 50 : 75;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>Registrar Pago</DialogTitle>
            <button onClick={onClose} className="hover:bg-gray-100 rounded p-1">
              <X className="h-5 w-5" />
            </button>
          </div>
          <DialogDescription>
            Booking: <span className="font-mono">{booking.bookingCode}</span> | 
            Ticket: <span className="font-mono text-blue-600">{booking.ticketCode}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Amount to pay */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Monto a pagar:</p>
            <p className="text-3xl text-blue-600">${calculateAmount().toFixed(2)}</p>
          </div>

          {/* Payment Method Tabs */}
          <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="transfer">Transferencia</TabsTrigger>
              <TabsTrigger value="card">Tarjeta</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit}>
              <TabsContent value="transfer" className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <h4 className="text-sm">Datos de transferencia:</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Banco:</strong> Banco Nacional</p>
                    <p><strong>Titular:</strong> Patio de Contenedores S.A.</p>
                    <p><strong>Número de cuenta:</strong> 1234567890</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reference">Número de Referencia / Confirmación</Label>
                  <Input
                    id="reference"
                    placeholder="Ej: 123456789"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">Comprobante de Pago (Opcional)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="file"
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleFileChange}
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" size="sm">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  {file && (
                    <p className="text-xs text-muted-foreground">
                      Archivo: {file.name}
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="card" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                    <div className="relative">
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\s/g, '');
                          if (value.length <= 16 && /^\d*$/.test(value)) {
                            const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
                            setCardNumber(formatted);
                          }
                        }}
                        maxLength={19}
                        required={paymentMethod === 'card'}
                      />
                      <CreditCard className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Fecha de Expiración</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/AA"
                        value={cardExpiry}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 4) {
                            const formatted = value.length >= 2 
                              ? `${value.slice(0, 2)}/${value.slice(2)}` 
                              : value;
                            setCardExpiry(formatted);
                          }
                        }}
                        maxLength={5}
                        required={paymentMethod === 'card'}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        type="password"
                        value={cardCvv}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value.length <= 4 && /^\d*$/.test(value)) {
                            setCardCvv(value);
                          }
                        }}
                        maxLength={4}
                        required={paymentMethod === 'card'}
                      />
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded p-3">
                    <p className="text-xs text-amber-800">
                      <strong>Nota:</strong> Este es un entorno de prueba. No se procesarán pagos reales.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  Confirmar Pago
                </Button>
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </form>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
