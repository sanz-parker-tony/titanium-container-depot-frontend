import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  Calendar as CalendarIcon, 
  Search, 
  Filter, 
  Clock, 
  Send, 
  Edit, 
  X,
  CheckCircle2,
  AlertCircle,
  Package,
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { toast } from 'sonner';

interface Reserva {
  id: string;
  bookingCode: string;
  ticketCode: string;
  cliente: string;
  fecha: string;
  horario: string;
  contenedor: string;
  tipoContenedor: string;
  operacion: 'Importación' | 'Exportación';
  estado: 'no-agendada' | 'agendada-no-pagada' | 'proxima-cumplimiento' | 'cumplida';
  pagado: boolean;
  chofer: string;
  placa: string;
}

const mockReservas: Reserva[] = [
  {
    id: '1',
    bookingCode: '123456789012345',
    ticketCode: 'TCK-001',
    cliente: 'Empresa ABC S.A.',
    fecha: '2025-10-17',
    horario: '08:00-1',
    contenedor: 'TCLU1234567',
    tipoContenedor: '40HC',
    operacion: 'Importación',
    estado: 'proxima-cumplimiento',
    pagado: true,
    chofer: 'Juan Pérez',
    placa: 'ABC-1234'
  },
  {
    id: '2',
    bookingCode: '234567890123456',
    ticketCode: '',
    cliente: 'Comercial XYZ Ltda.',
    fecha: '2025-10-18',
    horario: '',
    contenedor: 'MSCU9876543',
    tipoContenedor: '20DC',
    operacion: 'Exportación',
    estado: 'no-agendada',
    pagado: false,
    chofer: 'María García',
    placa: 'XYZ-5678'
  },
  {
    id: '3',
    bookingCode: '345678901234567',
    ticketCode: 'TCK-003',
    cliente: 'Logística 123 S.A.',
    fecha: '2025-10-17',
    horario: '14:30-2',
    contenedor: 'HLCU5555555',
    tipoContenedor: '40DC',
    operacion: 'Importación',
    estado: 'agendada-no-pagada',
    pagado: false,
    chofer: 'Pedro Ramírez',
    placa: 'GHI-9012'
  },
  {
    id: '4',
    bookingCode: '456789012345678',
    ticketCode: 'TCK-004',
    cliente: 'TransOcean Inc.',
    fecha: '2025-10-15',
    horario: '10:00-3',
    contenedor: 'MAEU7777777',
    tipoContenedor: '40HC',
    operacion: 'Exportación',
    estado: 'cumplida',
    pagado: true,
    chofer: 'Carlos López',
    placa: 'DEF-3456'
  },
  {
    id: '5',
    bookingCode: '567890123456789',
    ticketCode: 'TCK-005',
    cliente: 'Global Shipping S.A.',
    fecha: '2025-10-17',
    horario: '09:30-4',
    contenedor: 'CMAU8888888',
    tipoContenedor: '20DC',
    operacion: 'Importación',
    estado: 'proxima-cumplimiento',
    pagado: true,
    chofer: 'Ana Martínez',
    placa: 'JKL-7890'
  }
];

export function AgendaReservas() {
  const [reservas] = useState<Reserva[]>(mockReservas);
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [filtroOperacion, setFiltroOperacion] = useState<string>('todos');
  const [busqueda, setBusqueda] = useState('');
  const [vistaCalendario, setVistaCalendario] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState<Reserva | null>(null);
  const [mostrarDialogo, setMostrarDialogo] = useState(false);

  const getEstadoBadge = (estado: Reserva['estado']) => {
    const config = {
      'no-agendada': { label: 'No Agendada', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
      'agendada-no-pagada': { label: 'Agendada No Pagada', color: 'bg-red-100 text-red-800 border-red-300' },
      'proxima-cumplimiento': { label: 'Próxima a Cumplimiento', color: 'bg-blue-100 text-blue-800 border-blue-300' },
      'cumplida': { label: 'Cumplida', color: 'bg-green-100 text-green-800 border-green-300' }
    };
    return config[estado];
  };

  const reservasFiltradas = reservas.filter(reserva => {
    const matchEstado = filtroEstado === 'todos' || reserva.estado === filtroEstado;
    const matchOperacion = filtroOperacion === 'todos' || reserva.operacion === filtroOperacion;
    const matchBusqueda = busqueda === '' || 
      reserva.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
      reserva.bookingCode.includes(busqueda) ||
      reserva.contenedor.toLowerCase().includes(busqueda.toLowerCase());
    
    return matchEstado && matchOperacion && matchBusqueda;
  });

  const handleAgendar = (reserva: Reserva) => {
    setReservaSeleccionada(reserva);
    setMostrarDialogo(true);
  };

  const confirmarAgendamiento = () => {
    toast.success(`Turno agendado para ${reservaSeleccionada?.cliente}`);
    setMostrarDialogo(false);
    setReservaSeleccionada(null);
  };

  const handleEnviarRecordatorio = (reserva: Reserva) => {
    toast.success(`Recordatorio enviado a ${reserva.cliente}`);
  };

  const handleConfirmarPago = (reserva: Reserva) => {
    toast.success(`Pago confirmado para ${reserva.cliente}`);
  };

  const estadisticas = {
    noAgendadas: reservas.filter(r => r.estado === 'no-agendada').length,
    noPagedas: reservas.filter(r => r.estado === 'agendada-no-pagada').length,
    proximas: reservas.filter(r => r.estado === 'proxima-cumplimiento').length,
    cumplidas: reservas.filter(r => r.estado === 'cumplida').length
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl mb-2">📅 Agenda de Reservas</h1>
        <p className="text-gray-600">Panel de control para visualizar y gestionar todas las reservas de turnos</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">No Agendadas</p>
                <p className="text-2xl">{estadisticas.noAgendadas}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Agendadas No Pagadas</p>
                <p className="text-2xl">{estadisticas.noPagedas}</p>
              </div>
              <X className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Próximas a Cumplir</p>
                <p className="text-2xl">{estadisticas.proximas}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cumplidas</p>
                <p className="text-2xl">{estadisticas.cumplidas}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y búsqueda */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="busqueda">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="busqueda"
                  placeholder="Cliente, booking, contenedor..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="filtroEstado">Estado</Label>
              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="no-agendada">No Agendada</SelectItem>
                  <SelectItem value="agendada-no-pagada">Agendada No Pagada</SelectItem>
                  <SelectItem value="proxima-cumplimiento">Próxima a Cumplimiento</SelectItem>
                  <SelectItem value="cumplida">Cumplida</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="filtroOperacion">Operación</Label>
              <Select value={filtroOperacion} onValueChange={setFiltroOperacion}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas</SelectItem>
                  <SelectItem value="Importación">Importación</SelectItem>
                  <SelectItem value="Exportación">Exportación</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                variant={vistaCalendario ? "default" : "outline"}
                onClick={() => setVistaCalendario(!vistaCalendario)}
                className="w-full"
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                {vistaCalendario ? 'Vista Lista' : 'Vista Calendario'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de reservas */}
      <Card>
        <CardHeader>
          <CardTitle>Reservas ({reservasFiltradas.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reservasFiltradas.map((reserva) => {
              const estadoBadge = getEstadoBadge(reserva.estado);
              return (
                <div key={reserva.id} className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg">{reserva.cliente}</h3>
                        <Badge className={estadoBadge.color + ' border'}>
                          {estadoBadge.label}
                        </Badge>
                        {reserva.pagado && (
                          <Badge className="bg-green-100 text-green-800 border border-green-300">
                            Pagado
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Booking:</span> {reserva.bookingCode}
                        </div>
                        {reserva.ticketCode && (
                          <div>
                            <span className="font-medium">Ticket:</span> {reserva.ticketCode}
                          </div>
                        )}
                        <div>
                          <span className="font-medium">Fecha:</span> {new Date(reserva.fecha).toLocaleDateString('es-ES')}
                        </div>
                        {reserva.horario && (
                          <div>
                            <span className="font-medium">Horario:</span> {reserva.horario}
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600 mt-2">
                        <div className="flex items-center gap-1">
                          <Package className="h-4 w-4" />
                          {reserva.contenedor} ({reserva.tipoContenedor})
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {reserva.chofer}
                        </div>
                        <div>
                          <span className="font-medium">Placa:</span> {reserva.placa}
                        </div>
                        <div>
                          <Badge variant="outline">{reserva.operacion}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-2 pt-3 border-t">
                    {reserva.estado === 'no-agendada' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleAgendar(reserva)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Clock className="h-4 w-4 mr-1" />
                        Agendar Turno
                      </Button>
                    )}
                    {reserva.estado === 'agendada-no-pagada' && (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleConfirmarPago(reserva)}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Confirmar Pago
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEnviarRecordatorio(reserva)}
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Enviar Recordatorio
                        </Button>
                      </>
                    )}
                    {reserva.ticketCode && (
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Reagendar
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEnviarRecordatorio(reserva)}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Enviar Mensaje
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Paginación */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-600">Mostrando {reservasFiltradas.length} reservas</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diálogo de agendamiento */}
      <Dialog open={mostrarDialogo} onOpenChange={setMostrarDialogo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agendar Turno</DialogTitle>
            <DialogDescription>
              Asigna un turno para la reserva seleccionada
            </DialogDescription>
          </DialogHeader>
          {reservaSeleccionada && (
            <div className="space-y-4">
              <div>
                <Label>Cliente</Label>
                <Input value={reservaSeleccionada.cliente} disabled />
              </div>
              <div>
                <Label>Contenedor</Label>
                <Input value={`${reservaSeleccionada.contenedor} (${reservaSeleccionada.tipoContenedor})`} disabled />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Fecha</Label>
                  <Input type="date" defaultValue={reservaSeleccionada.fecha} />
                </div>
                <div>
                  <Label>Horario</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione horario" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="08:00-1">08:00 - Cupo 1</SelectItem>
                      <SelectItem value="09:30-2">09:30 - Cupo 2</SelectItem>
                      <SelectItem value="11:00-3">11:00 - Cupo 3</SelectItem>
                      <SelectItem value="14:00-4">14:00 - Cupo 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setMostrarDialogo(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmarAgendamiento}>
              Confirmar Agendamiento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
