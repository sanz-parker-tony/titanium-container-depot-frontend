import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Calendar } from './ui/calendar';
import { TimeSlotPicker } from './TimeSlotPicker';
import { ArrowLeft, Upload, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Booking } from './BookingList';
import { Checkbox } from './ui/checkbox';
import { Alert, AlertDescription } from './ui/alert';

interface TicketFormProps {
  booking: Booking;
  onSave: (ticketData: {
    contenedor: string;
    tipoContenedor: string;
    operacion: string;
    deposito: string;
    linea: string;
    tipoDeposito: string;
    clienteId: string;
    clienteNombre: string;
    choferNombre: string;
    choferCedula: string;
    vehiculoPlaca: string;
    vehiculoFoto?: File;
    fecha: Date;
    horario: string;
  }) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export function TicketForm({ booking, onSave, onCancel, isEditing = false }: TicketFormProps) {
  const [contenedor, setContenedor] = useState('');
  const [tipoContenedor, setTipoContenedor] = useState('');
  const [operacion, setOperacion] = useState<'Importación' | 'Exportación'>('Importación');
  const [deposito, setDeposito] = useState('');
  const [linea, setLinea] = useState('');
  const [tipoDeposito, setTipoDeposito] = useState('');
  const [clienteId, setClienteId] = useState('');
  const [clienteNombre, setClienteNombre] = useState('');
  const [choferNombre, setChoferNombre] = useState('');
  const [choferCedula, setChoferCedula] = useState('');
  const [vehiculoPlaca, setVehiculoPlaca] = useState('');
  const [vehiculoFoto, setVehiculoFoto] = useState<File | undefined>();
  const [fecha, setFecha] = useState<Date>();
  const [selectedSlot, setSelectedSlot] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  useEffect(() => {
    setOperacion(booking.operacion);
    
    // Load existing ticket data when editing
    if (isEditing && booking.ticketData) {
      setContenedor(booking.ticketData.contenedor);
      setTipoContenedor(booking.ticketData.tipoContenedor);
      setDeposito(booking.ticketData.deposito);
      setLinea(booking.ticketData.linea);
      setTipoDeposito(booking.ticketData.tipoDeposito);
      setClienteId(booking.ticketData.clienteId);
      setClienteNombre(booking.ticketData.clienteNombre);
      setChoferNombre(booking.ticketData.choferNombre);
      setChoferCedula(booking.ticketData.choferCedula);
      setVehiculoPlaca(booking.ticketData.vehiculoPlaca);
      
      // Load date and time slot
      if (booking.fechaTicket) {
        setFecha(new Date(booking.fechaTicket + 'T00:00:00'));
      }
      if (booking.horario) {
        setSelectedSlot(booking.horario);
      }
    }
  }, [booking, isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fecha) {
      alert('Por favor selecciona una fecha');
      return;
    }
    if (!selectedSlot) {
      alert('Por favor selecciona un horario');
      return;
    }
    if (!acceptTerms) {
      alert('Debes aceptar los términos y condiciones');
      return;
    }

    onSave({
      contenedor,
      tipoContenedor,
      operacion,
      deposito,
      linea,
      tipoDeposito,
      clienteId,
      clienteNombre,
      choferNombre,
      choferCedula,
      vehiculoPlaca,
      vehiculoFoto,
      fecha,
      horario: selectedSlot,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVehiculoFoto(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-4 md:p-8 max-w-7xl">
        <Button
          variant="ghost"
          onClick={onCancel}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a la lista
        </Button>

        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <div className="mb-6">
            <h1 className="mb-2">
              {isEditing ? 'Modificar Ticket' : 'Generar Ticket'}
            </h1>
            <p className="text-muted-foreground">
              Booking: <span className="font-mono text-foreground">{booking.bookingCode}</span>
              {booking.ticketCode && (
                <> | Ticket: <span className="font-mono text-blue-600">{booking.ticketCode}</span></>
              )}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Form Fields */}
              <div className="space-y-6">
                {/* Datos del Contenedor */}
                <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h3 className="mb-4">Datos del Contenedor</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="contenedor">Código de Contenedor</Label>
                      <Input
                        id="contenedor"
                        placeholder="Ej: TCLU1234567"
                        value={contenedor}
                        onChange={(e) => setContenedor(e.target.value.toUpperCase())}
                        disabled={isEditing && booking.pagado}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="tipoContenedor">Tipo Contenedor</Label>
                        <Select value={tipoContenedor} onValueChange={setTipoContenedor} required disabled={isEditing && booking.pagado}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="20DC">20DC</SelectItem>
                            <SelectItem value="40DC">40DC</SelectItem>
                            <SelectItem value="40HC">40HC</SelectItem>
                            <SelectItem value="REEFER">REEFER</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="operacion">Operación</Label>
                        <Select value={operacion} onValueChange={(v) => setOperacion(v as any)} required disabled={isEditing && booking.pagado}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Importación">Importación</SelectItem>
                            <SelectItem value="Exportación">Exportación</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deposito">Depósito</Label>
                      <Input
                        id="deposito"
                        placeholder="Nombre del patio o depósito"
                        value={deposito}
                        onChange={(e) => setDeposito(e.target.value)}
                        disabled={isEditing && booking.pagado}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="linea">Línea Naviera</Label>
                      <Input
                        id="linea"
                        placeholder="Ej: Maersk, MSC, Hapag-Lloyd"
                        value={linea}
                        onChange={(e) => setLinea(e.target.value)}
                        disabled={isEditing && booking.pagado}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tipoDeposito">Tipo de Depósito</Label>
                      <Select value={tipoDeposito} onValueChange={setTipoDeposito} required disabled={isEditing && booking.pagado}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Patio Seco">Patio Seco</SelectItem>
                          <SelectItem value="Refrigerado">Refrigerado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Datos del Cliente */}
                <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h3 className="mb-4">Datos del Cliente</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="clienteId">Cédula / RUC</Label>
                      <Input
                        id="clienteId"
                        placeholder="Ej: 0912345678001"
                        value={clienteId}
                        onChange={(e) => setClienteId(e.target.value)}
                        disabled={isEditing && booking.pagado}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="clienteNombre">Nombre / Razón Social</Label>
                      <Input
                        id="clienteNombre"
                        placeholder="Nombre completo o empresa"
                        value={clienteNombre}
                        onChange={(e) => setClienteNombre(e.target.value)}
                        disabled={isEditing && booking.pagado}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Datos del Chofer */}
                <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h3 className="mb-4">Datos del Chofer</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="choferNombre">Nombre del Chofer</Label>
                      <Input
                        id="choferNombre"
                        placeholder="Nombre completo"
                        value={choferNombre}
                        onChange={(e) => setChoferNombre(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="choferCedula">Cédula del Chofer</Label>
                      <Input
                        id="choferCedula"
                        placeholder="Ej: 0912345678"
                        value={choferCedula}
                        onChange={(e) => setChoferCedula(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Datos del Vehículo */}
                <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h3 className="mb-4">Datos del Vehículo</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="vehiculoPlaca">Placa del Vehículo</Label>
                      <Input
                        id="vehiculoPlaca"
                        placeholder="Ej: ABC-1234"
                        value={vehiculoPlaca}
                        onChange={(e) => setVehiculoPlaca(e.target.value.toUpperCase())}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vehiculoFoto">Foto del Vehículo</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="vehiculoFoto"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="flex-1"
                        />
                        <Button type="button" variant="outline" size="sm">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                      {vehiculoFoto && (
                        <p className="text-xs text-muted-foreground">
                          Archivo: {vehiculoFoto.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Date and Time Selection */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Fecha del Turno</Label>
                  <div className="text-sm text-muted-foreground mb-2">
                    {fecha ? format(fecha, "PPP", { locale: es }) : "Selecciona una fecha del calendario"}
                  </div>
                </div>

                <div className="border-2 border-gray-200 rounded-lg p-4 flex justify-center bg-white">
                  <Calendar
                    mode="single"
                    selected={fecha}
                    onSelect={setFecha}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    className="rounded-md"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Selección de Horario</Label>
                  {fecha ? (
                    <TimeSlotPicker
                      selectedSlot={selectedSlot}
                      onSlotSelect={setSelectedSlot}
                      initialSlot={isEditing && booking.horario ? booking.horario : undefined}
                    />
                  ) : (
                    <div className="h-[300px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                      <p className="text-muted-foreground text-center">
                        Selecciona una fecha primero<br />para ver horarios disponibles
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Advertencias y Términos */}
            <div className="space-y-4 border-t-2 pt-6">
              <Alert className="bg-blue-50 border-blue-200">
                <AlertTriangle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-sm text-blue-800">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Debe llegar <strong>30 minutos antes</strong> de su turno programado</li>
                    <li>La reserva tendrá una validez de 24 horas una vez confirmado el pago</li>
                    <li>No se permiten cambios de horario dentro de las 2 horas previas al turno</li>
                    <li>El vehículo debe cumplir con todas las normativas de seguridad</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm cursor-pointer"
                >
                  Acepto los términos y condiciones del servicio, y confirmo que toda la información proporcionada es correcta.
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                className="flex-1"
                disabled={!acceptTerms}
              >
                Grabar
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Salir
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
