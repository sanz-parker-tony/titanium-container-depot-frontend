import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  DollarSign, 
  Search, 
  Download,
  Send,
  CheckCircle2,
  AlertCircle,
  FileText,
  CreditCard,
  Calendar,
  TrendingUp,
  TrendingDown,
  Filter
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';

interface Ticket {
  id: string;
  ticketCode: string;
  bookingCode: string;
  cliente: string;
  fecha: string;
  monto: number;
  estado: 'pendiente' | 'pagado' | 'vencido';
  diasVencido: number;
  metodoPago?: string;
  referencia?: string;
  condicionesPago: string;
}

const mockTickets: Ticket[] = [
  {
    id: '1',
    ticketCode: 'TCK-001',
    bookingCode: '123456789012345',
    cliente: 'Empresa ABC S.A.',
    fecha: '2025-10-15',
    monto: 50.00,
    estado: 'pagado',
    diasVencido: 0,
    metodoPago: 'Transferencia',
    referencia: 'TRF-20251015-001',
    condicionesPago: 'Contado'
  },
  {
    id: '2',
    ticketCode: 'TCK-002',
    bookingCode: '234567890123456',
    cliente: 'Comercial XYZ Ltda.',
    fecha: '2025-10-14',
    monto: 75.00,
    estado: 'pagado',
    diasVencido: 0,
    metodoPago: 'Tarjeta',
    referencia: 'CC-20251014-002',
    condicionesPago: 'Contado'
  },
  {
    id: '3',
    ticketCode: 'TCK-003',
    bookingCode: '345678901234567',
    cliente: 'Logística 123 S.A.',
    fecha: '2025-10-11',
    monto: 50.00,
    estado: 'vencido',
    diasVencido: 5,
    condicionesPago: '30 días'
  },
  {
    id: '4',
    ticketCode: 'TCK-004',
    bookingCode: '456789012345678',
    cliente: 'TransOcean Inc.',
    fecha: '2025-09-20',
    monto: 75.00,
    estado: 'vencido',
    diasVencido: 26,
    condicionesPago: '60 días'
  },
  {
    id: '5',
    ticketCode: 'TCK-005',
    bookingCode: '567890123456789',
    cliente: 'Global Shipping S.A.',
    fecha: '2025-10-16',
    monto: 50.00,
    estado: 'pendiente',
    diasVencido: 0,
    condicionesPago: 'Contado'
  },
  {
    id: '6',
    ticketCode: 'TCK-006',
    bookingCode: '678901234567890',
    cliente: 'Maritime Express Co.',
    fecha: '2025-10-10',
    monto: 75.00,
    estado: 'pendiente',
    diasVencido: 0,
    condicionesPago: '30 días'
  }
];

export function FacturacionCobros() {
  const [tickets] = useState<Ticket[]>(mockTickets);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [ticketSeleccionado, setTicketSeleccionado] = useState<Ticket | null>(null);
  const [mostrarRegistroPago, setMostrarRegistroPago] = useState(false);
  const [metodoPago, setMetodoPago] = useState<string>('transferencia');
  const [referenciaPago, setReferenciaPago] = useState('');

  const ticketsFiltrados = tickets.filter(ticket => {
    const matchBusqueda = busqueda === '' || 
      ticket.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
      ticket.ticketCode.toLowerCase().includes(busqueda.toLowerCase()) ||
      ticket.bookingCode.includes(busqueda);
    const matchEstado = filtroEstado === 'todos' || ticket.estado === filtroEstado;
    
    return matchBusqueda && matchEstado;
  });

  const getEstadoBadge = (estado: Ticket['estado']) => {
    const config = {
      pendiente: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
      pagado: { label: 'Pagado', color: 'bg-green-100 text-green-800 border-green-300' },
      vencido: { label: 'Vencido', color: 'bg-red-100 text-red-800 border-red-300' }
    };
    return config[estado];
  };

  const getCategoriaCartera = (diasVencido: number) => {
    if (diasVencido === 0) return 'Corriente';
    if (diasVencido <= 30) return '1-30 días';
    if (diasVencido <= 60) return '31-60 días';
    return '90+ días';
  };

  const handleRegistrarPago = (ticket: Ticket) => {
    setTicketSeleccionado(ticket);
    setMostrarRegistroPago(true);
    setReferenciaPago('');
  };

  const confirmarPago = () => {
    if (!referenciaPago) {
      toast.error('Debe ingresar una referencia de pago');
      return;
    }
    toast.success(`Pago registrado para ${ticketSeleccionado?.ticketCode}`);
    setMostrarRegistroPago(false);
    setTicketSeleccionado(null);
  };

  const handleDescargarFactura = (ticket: Ticket) => {
    toast.success(`Factura ${ticket.ticketCode} descargada`);
  };

  const handleEnviarRecordatorio = (ticket: Ticket) => {
    toast.success(`Recordatorio enviado a ${ticket.cliente}`);
  };

  // Estadísticas
  const totalFacturado = tickets.filter(t => t.estado === 'pagado').reduce((sum, t) => sum + t.monto, 0);
  const totalPendiente = tickets.filter(t => t.estado === 'pendiente').reduce((sum, t) => sum + t.monto, 0);
  const totalVencido = tickets.filter(t => t.estado === 'vencido').reduce((sum, t) => sum + t.monto, 0);
  
  const carteraCorriente = tickets.filter(t => t.estado === 'pendiente' && t.diasVencido === 0).reduce((sum, t) => sum + t.monto, 0);
  const cartera30 = tickets.filter(t => t.diasVencido > 0 && t.diasVencido <= 30).reduce((sum, t) => sum + t.monto, 0);
  const cartera60 = tickets.filter(t => t.diasVencido > 30 && t.diasVencido <= 60).reduce((sum, t) => sum + t.monto, 0);
  const cartera90 = tickets.filter(t => t.diasVencido > 60).reduce((sum, t) => sum + t.monto, 0);

  const estadisticas = {
    totalTickets: tickets.length,
    pendientes: tickets.filter(t => t.estado === 'pendiente').length,
    pagados: tickets.filter(t => t.estado === 'pagado').length,
    vencidos: tickets.filter(t => t.estado === 'vencido').length
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl mb-2">💲 Facturación y Cobros</h1>
        <p className="text-gray-600">Panel financiero para visualizar, registrar y controlar pagos</p>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-2 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Facturado</p>
                <p className="text-2xl text-green-600">${totalFacturado.toFixed(2)}</p>
                <p className="text-xs text-gray-500">{estadisticas.pagados} tickets</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendiente de Cobro</p>
                <p className="text-2xl text-yellow-600">${totalPendiente.toFixed(2)}</p>
                <p className="text-xs text-gray-500">{estadisticas.pendientes} tickets</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cartera Vencida</p>
                <p className="text-2xl text-red-600">${totalVencido.toFixed(2)}</p>
                <p className="text-xs text-gray-500">{estadisticas.vencidos} tickets</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Tickets</p>
              <p className="text-2xl">{estadisticas.totalTickets}</p>
              <div className="flex justify-center gap-2 mt-2">
                <Badge className="bg-green-100 text-green-800 text-xs">{estadisticas.pagados}</Badge>
                <Badge className="bg-yellow-100 text-yellow-800 text-xs">{estadisticas.pendientes}</Badge>
                <Badge className="bg-red-100 text-red-800 text-xs">{estadisticas.vencidos}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Control de cartera */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Control de Cartera por Antigüedad</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Corriente</p>
              <p className="text-xl text-green-700">${carteraCorriente.toFixed(2)}</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">1-30 días</p>
              <p className="text-xl text-yellow-700">${cartera30.toFixed(2)}</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">31-60 días</p>
              <p className="text-xl text-orange-700">${cartera60.toFixed(2)}</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">90+ días</p>
              <p className="text-xl text-red-700">${cartera90.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="busqueda">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="busqueda"
                  placeholder="Ticket, booking o cliente..."
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
                  <SelectItem value="pendiente">Pendientes</SelectItem>
                  <SelectItem value="pagado">Pagados</SelectItem>
                  <SelectItem value="vencido">Vencidos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de tickets */}
      <Card>
        <CardHeader>
          <CardTitle>Tickets de Facturación ({ticketsFiltrados.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ticketsFiltrados.map((ticket) => {
              const estadoBadge = getEstadoBadge(ticket.estado);
              
              return (
                <div key={ticket.id} className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg">{ticket.cliente}</h3>
                        <Badge className={estadoBadge.color + ' border'}>
                          {estadoBadge.label}
                        </Badge>
                        {ticket.diasVencido > 0 && (
                          <Badge className="bg-red-100 text-red-800 border border-red-300">
                            {ticket.diasVencido} días vencido
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Ticket:</span> {ticket.ticketCode}
                        </div>
                        <div>
                          <span className="font-medium">Booking:</span> {ticket.bookingCode}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(ticket.fecha).toLocaleDateString('es-ES')}
                        </div>
                        <div>
                          <span className="font-medium">Condiciones:</span> {ticket.condicionesPago}
                        </div>
                        <div>
                          <span className="font-medium">Cartera:</span> {getCategoriaCartera(ticket.diasVencido)}
                        </div>
                      </div>

                      {ticket.metodoPago && (
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">Pago:</span> {ticket.metodoPago} - Ref: {ticket.referencia}
                        </div>
                      )}
                    </div>

                    <div className="text-right ml-4">
                      <p className="text-sm text-gray-600">Monto</p>
                      <p className="text-2xl">${ticket.monto.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-2 pt-3 border-t">
                    {ticket.estado !== 'pagado' && (
                      <Button 
                        size="sm"
                        onClick={() => handleRegistrarPago(ticket)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CreditCard className="h-4 w-4 mr-1" />
                        Registrar Pago
                      </Button>
                    )}
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => handleDescargarFactura(ticket)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Descargar Factura
                    </Button>
                    {ticket.estado !== 'pagado' && (
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => handleEnviarRecordatorio(ticket)}
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Enviar Recordatorio
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Diálogo de registro de pago */}
      <Dialog open={mostrarRegistroPago} onOpenChange={setMostrarRegistroPago}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Pago</DialogTitle>
            <DialogDescription>
              Registra el pago recibido del cliente
            </DialogDescription>
          </DialogHeader>
          {ticketSeleccionado && (
            <div className="space-y-4">
              <div>
                <Label>Ticket</Label>
                <Input value={ticketSeleccionado.ticketCode} disabled />
              </div>
              
              <div>
                <Label>Cliente</Label>
                <Input value={ticketSeleccionado.cliente} disabled />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Monto</Label>
                  <Input value={`$${ticketSeleccionado.monto.toFixed(2)}`} disabled />
                </div>
                <div>
                  <Label>Fecha</Label>
                  <Input value={new Date(ticketSeleccionado.fecha).toLocaleDateString('es-ES')} disabled />
                </div>
              </div>

              <div>
                <Label htmlFor="metodoPago">Método de Pago *</Label>
                <Select value={metodoPago} onValueChange={setMetodoPago}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transferencia">Transferencia Bancaria</SelectItem>
                    <SelectItem value="tarjeta">Tarjeta de Crédito/Débito</SelectItem>
                    <SelectItem value="efectivo">Efectivo</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="referencia">Número de Referencia *</Label>
                <Input
                  id="referencia"
                  placeholder="Ingrese número de transacción o referencia"
                  value={referenciaPago}
                  onChange={(e) => setReferenciaPago(e.target.value)}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setMostrarRegistroPago(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmarPago} className="bg-green-600 hover:bg-green-700">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Confirmar Pago
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
