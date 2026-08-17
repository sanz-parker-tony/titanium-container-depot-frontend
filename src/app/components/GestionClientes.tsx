import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  Building2, 
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  FileText,
  DollarSign,
  Package,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';

interface Cliente {
  id: string;
  ruc: string;
  nombre: string;
  tipoCliente: 'Naviera' | 'Transportista' | 'Exportador' | 'Importador' | 'Agente';
  contacto: string;
  email: string;
  telefono: string;
  movimientosMes: number;
  reservasActivas: number;
  reservasPendientes: number;
  morosidad: boolean;
  volumenAnual: number;
  ultimaReserva: string;
  valorCliente: 'Alto' | 'Medio' | 'Bajo';
}

const mockClientes: Cliente[] = [
  {
    id: '1',
    ruc: '0912345678001',
    nombre: 'Empresa ABC S.A.',
    tipoCliente: 'Importador',
    contacto: 'Juan Pérez',
    email: 'contacto@empresaabc.com',
    telefono: '+593 99 123 4567',
    movimientosMes: 45,
    reservasActivas: 3,
    reservasPendientes: 1,
    morosidad: false,
    volumenAnual: 520,
    ultimaReserva: '2025-10-15',
    valorCliente: 'Alto'
  },
  {
    id: '2',
    ruc: '0987654321001',
    nombre: 'Comercial XYZ Ltda.',
    tipoCliente: 'Exportador',
    contacto: 'María García',
    email: 'maria@comercialxyz.com',
    telefono: '+593 98 765 4321',
    movimientosMes: 28,
    reservasActivas: 2,
    reservasPendientes: 3,
    morosidad: true,
    volumenAnual: 310,
    ultimaReserva: '2025-10-14',
    valorCliente: 'Medio'
  },
  {
    id: '3',
    ruc: '0923456789001',
    nombre: 'Logística 123 S.A.',
    tipoCliente: 'Transportista',
    contacto: 'Pedro Ramírez',
    email: 'pedro@logistica123.com',
    telefono: '+593 97 234 5678',
    movimientosMes: 62,
    reservasActivas: 5,
    reservasPendientes: 0,
    morosidad: false,
    volumenAnual: 740,
    ultimaReserva: '2025-10-16',
    valorCliente: 'Alto'
  },
  {
    id: '4',
    ruc: '0956789012001',
    nombre: 'TransOcean Inc.',
    tipoCliente: 'Naviera',
    contacto: 'Carlos López',
    email: 'carlos@transocean.com',
    telefono: '+593 96 567 8901',
    movimientosMes: 15,
    reservasActivas: 1,
    reservasPendientes: 2,
    morosidad: true,
    volumenAnual: 180,
    ultimaReserva: '2025-10-12',
    valorCliente: 'Bajo'
  },
  {
    id: '5',
    ruc: '0945678901001',
    nombre: 'Global Shipping S.A.',
    tipoCliente: 'Agente',
    contacto: 'Ana Martínez',
    email: 'ana@globalshipping.com',
    telefono: '+593 95 456 7890',
    movimientosMes: 38,
    reservasActivas: 4,
    reservasPendientes: 1,
    morosidad: false,
    volumenAnual: 450,
    ultimaReserva: '2025-10-15',
    valorCliente: 'Alto'
  }
];

export function GestionClientes() {
  const [clientes] = useState<Cliente[]>(mockClientes);
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroValor, setFiltroValor] = useState<string>('todos');
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);

  const clientesFiltrados = clientes.filter(cliente => {
    const matchBusqueda = busqueda === '' || 
      cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      cliente.ruc.includes(busqueda) ||
      cliente.contacto.toLowerCase().includes(busqueda.toLowerCase());
    const matchTipo = filtroTipo === 'todos' || cliente.tipoCliente === filtroTipo;
    const matchValor = filtroValor === 'todos' || cliente.valorCliente === filtroValor;
    
    return matchBusqueda && matchTipo && matchValor;
  });

  const handleVerDetalle = (cliente: Cliente) => {
    setClienteSeleccionado(cliente);
    setMostrarDetalle(true);
  };

  const handleEnviarMensaje = (cliente: Cliente) => {
    toast.success(`Mensaje enviado a ${cliente.nombre}`);
  };

  const estadisticas = {
    total: clientes.length,
    conMorosidad: clientes.filter(c => c.morosidad).length,
    alto: clientes.filter(c => c.valorCliente === 'Alto').length,
    medio: clientes.filter(c => c.valorCliente === 'Medio').length,
    bajo: clientes.filter(c => c.valorCliente === 'Bajo').length
  };

  const getValorBadge = (valor: Cliente['valorCliente']) => {
    const config = {
      'Alto': 'bg-green-100 text-green-800 border-green-300',
      'Medio': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Bajo': 'bg-gray-100 text-gray-800 border-gray-300'
    };
    return config[valor];
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl mb-2">👥 Gestión de Clientes</h1>
        <p className="text-gray-600">Administración comercial, operativa y financiera de clientes</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Clientes</p>
                <p className="text-2xl">{estadisticas.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Con Morosidad</p>
                <p className="text-2xl text-red-600">{estadisticas.conMorosidad}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Valor Alto</p>
              <p className="text-2xl text-green-600">{estadisticas.alto}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-yellow-200">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Valor Medio</p>
              <p className="text-2xl text-yellow-600">{estadisticas.medio}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Valor Bajo</p>
              <p className="text-2xl text-gray-600">{estadisticas.bajo}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="busqueda">Buscar Cliente</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="busqueda"
                  placeholder="Nombre, RUC o contacto..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="filtroTipo">Tipo de Cliente</Label>
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Naviera">Naviera</SelectItem>
                  <SelectItem value="Transportista">Transportista</SelectItem>
                  <SelectItem value="Exportador">Exportador</SelectItem>
                  <SelectItem value="Importador">Importador</SelectItem>
                  <SelectItem value="Agente">Agente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="filtroValor">Valor del Cliente</Label>
              <Select value={filtroValor} onValueChange={setFiltroValor}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Alto">Alto</SelectItem>
                  <SelectItem value="Medio">Medio</SelectItem>
                  <SelectItem value="Bajo">Bajo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de clientes */}
      <Card>
        <CardHeader>
          <CardTitle>Directorio de Clientes ({clientesFiltrados.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clientesFiltrados.map((cliente) => (
              <div key={cliente.id} className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg">{cliente.nombre}</h3>
                      <Badge variant="outline">{cliente.tipoCliente}</Badge>
                      <Badge className={getValorBadge(cliente.valorCliente) + ' border'}>
                        {cliente.valorCliente} Valor
                      </Badge>
                      {cliente.morosidad && (
                        <Badge className="bg-red-100 text-red-800 border border-red-300">
                          Morosidad
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">RUC:</span> {cliente.ruc}
                      </div>
                      <div>
                        <span className="font-medium">Contacto:</span> {cliente.contacto}
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {cliente.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {cliente.telefono}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Métricas */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-3 bg-gray-50 rounded mb-3">
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Mov. Mes</p>
                    <p className="text-sm">{cliente.movimientosMes}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Vol. Anual</p>
                    <p className="text-sm">{cliente.volumenAnual}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Activas</p>
                    <p className="text-sm text-blue-600">{cliente.reservasActivas}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Pendientes</p>
                    <p className={`text-sm ${cliente.reservasPendientes > 0 ? 'text-yellow-600' : ''}`}>
                      {cliente.reservasPendientes}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Última Reserva</p>
                    <p className="text-sm">{new Date(cliente.ultimaReserva).toLocaleDateString('es-ES')}</p>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleVerDetalle(cliente)}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Ver Detalle
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEnviarMensaje(cliente)}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Enviar Mensaje
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </Button>
                  {cliente.morosidad && (
                    <Button 
                      size="sm" 
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <DollarSign className="h-4 w-4 mr-1" />
                      Gestionar Cobranza
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Diálogo de detalle del cliente */}
      <Dialog open={mostrarDetalle} onOpenChange={setMostrarDetalle}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalle del Cliente</DialogTitle>
            <DialogDescription>
              Información completa del cliente y su historial
            </DialogDescription>
          </DialogHeader>
          {clienteSeleccionado && (
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="operaciones">Operaciones</TabsTrigger>
                <TabsTrigger value="financiero">Financiero</TabsTrigger>
                <TabsTrigger value="historial">Historial</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nombre Comercial</Label>
                    <p className="text-sm">{clienteSeleccionado.nombre}</p>
                  </div>
                  <div>
                    <Label>RUC</Label>
                    <p className="text-sm">{clienteSeleccionado.ruc}</p>
                  </div>
                  <div>
                    <Label>Tipo de Cliente</Label>
                    <Badge variant="outline">{clienteSeleccionado.tipoCliente}</Badge>
                  </div>
                  <div>
                    <Label>Valor del Cliente</Label>
                    <Badge className={getValorBadge(clienteSeleccionado.valorCliente)}>
                      {clienteSeleccionado.valorCliente}
                    </Badge>
                  </div>
                  <div>
                    <Label>Contacto Principal</Label>
                    <p className="text-sm">{clienteSeleccionado.contacto}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="text-sm">{clienteSeleccionado.email}</p>
                  </div>
                  <div>
                    <Label>Teléfono</Label>
                    <p className="text-sm">{clienteSeleccionado.telefono}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="operaciones" className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Package className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                      <p className="text-sm text-gray-600">Movimientos/Mes</p>
                      <p className="text-2xl">{clienteSeleccionado.movimientosMes}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      <p className="text-sm text-gray-600">Volumen Anual</p>
                      <p className="text-2xl">{clienteSeleccionado.volumenAnual}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Calendar className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                      <p className="text-sm text-gray-600">Última Reserva</p>
                      <p className="text-sm">{new Date(clienteSeleccionado.ultimaReserva).toLocaleDateString('es-ES')}</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Reservas Activas</Label>
                    <p className="text-2xl text-blue-600">{clienteSeleccionado.reservasActivas}</p>
                  </div>
                  <div>
                    <Label>Reservas Pendientes</Label>
                    <p className="text-2xl text-yellow-600">{clienteSeleccionado.reservasPendientes}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="financiero" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label>Estado de Cuenta</Label>
                    {clienteSeleccionado.morosidad ? (
                      <div className="bg-red-50 border border-red-200 rounded p-3 flex items-center gap-2 mt-2">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        <span className="text-sm text-red-800">Cliente con cartera vencida</span>
                      </div>
                    ) : (
                      <div className="bg-green-50 border border-green-200 rounded p-3 flex items-center gap-2 mt-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <span className="text-sm text-green-800">Cuenta al día</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Total Facturado (Año)</Label>
                      <p className="text-2xl">$45,250.00</p>
                    </div>
                    <div>
                      <Label>Promedio Mensual</Label>
                      <p className="text-2xl">$3,770.83</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="historial" className="space-y-4">
                <div className="space-y-3">
                  <div className="border-l-4 border-blue-500 pl-3">
                    <p className="text-sm">Reserva TCK-005 completada</p>
                    <p className="text-xs text-gray-500">15 de octubre, 2025</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-3">
                    <p className="text-sm">Pago registrado - $150.00</p>
                    <p className="text-xs text-gray-500">14 de octubre, 2025</p>
                  </div>
                  <div className="border-l-4 border-yellow-500 pl-3">
                    <p className="text-sm">Nueva reserva creada</p>
                    <p className="text-xs text-gray-500">12 de octubre, 2025</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setMostrarDetalle(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
