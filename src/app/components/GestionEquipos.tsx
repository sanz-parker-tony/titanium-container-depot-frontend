import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  Wrench, 
  Search, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  Calendar,
  Settings,
  TrendingUp,
  Activity,
  Edit,
  Plus
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';

interface Equipo {
  id: string;
  nombre: string;
  tipo: 'Grúa' | 'Montacargas' | 'Reach Stacker' | 'Camión Interno' | 'Equipo Auxiliar';
  codigo: string;
  estado: 'operativo' | 'mantenimiento' | 'fuera-servicio';
  zonaAsignada: string;
  horasTrabajadas: number;
  horasMantenimiento: number;
  proximoMantenimiento: string;
  diasProximoMantenimiento: number;
  utilizacion: number;
  ultimaRevision: string;
  operador?: string;
}

interface Mantenimiento {
  id: string;
  equipoId: string;
  equipoNombre: string;
  tipo: 'Preventivo' | 'Correctivo';
  descripcion: string;
  fecha: string;
  tecnico: string;
  costo: number;
  estado: 'completado' | 'en-proceso' | 'programado';
}

const mockEquipos: Equipo[] = [
  {
    id: '1',
    nombre: 'Grúa Pórtico 1',
    tipo: 'Grúa',
    codigo: 'GRU-001',
    estado: 'operativo',
    zonaAsignada: 'Zona A',
    horasTrabajadas: 1850,
    horasMantenimiento: 2000,
    proximoMantenimiento: '2025-10-20',
    diasProximoMantenimiento: 4,
    utilizacion: 85,
    ultimaRevision: '2025-09-20',
    operador: 'Carlos López'
  },
  {
    id: '2',
    nombre: 'Montacargas Heavy Duty',
    tipo: 'Montacargas',
    codigo: 'MTG-005',
    estado: 'operativo',
    zonaAsignada: 'Zona B',
    horasTrabajadas: 890,
    horasMantenimiento: 1000,
    proximoMantenimiento: '2025-11-05',
    diasProximoMantenimiento: 20,
    utilizacion: 72,
    ultimaRevision: '2025-10-05',
    operador: 'Pedro Ramírez'
  },
  {
    id: '3',
    nombre: 'Reach Stacker Principal',
    tipo: 'Reach Stacker',
    codigo: 'RST-002',
    estado: 'mantenimiento',
    zonaAsignada: 'Zona C',
    horasTrabajadas: 1995,
    horasMantenimiento: 2000,
    proximoMantenimiento: '2025-10-17',
    diasProximoMantenimiento: 1,
    utilizacion: 0,
    ultimaRevision: '2025-08-15',
    operador: '-'
  },
  {
    id: '4',
    nombre: 'Camión Interno 3',
    tipo: 'Camión Interno',
    codigo: 'CAM-003',
    estado: 'operativo',
    zonaAsignada: 'Múltiple',
    horasTrabajadas: 1200,
    horasMantenimiento: 1500,
    proximoMantenimiento: '2025-11-10',
    diasProximoMantenimiento: 25,
    utilizacion: 65,
    ultimaRevision: '2025-09-10',
    operador: 'Juan Méndez'
  },
  {
    id: '5',
    nombre: 'Montacargas Estándar 2',
    tipo: 'Montacargas',
    codigo: 'MTG-002',
    estado: 'fuera-servicio',
    zonaAsignada: 'Taller',
    horasTrabajadas: 2100,
    horasMantenimiento: 2000,
    proximoMantenimiento: '2025-10-18',
    diasProximoMantenimiento: 2,
    utilizacion: 0,
    ultimaRevision: '2025-07-15',
    operador: '-'
  },
  {
    id: '6',
    nombre: 'Grúa Móvil 2',
    tipo: 'Grúa',
    codigo: 'GRU-002',
    estado: 'operativo',
    zonaAsignada: 'Zona D',
    horasTrabajadas: 650,
    horasMantenimiento: 1000,
    proximoMantenimiento: '2025-12-01',
    diasProximoMantenimiento: 46,
    utilizacion: 58,
    ultimaRevision: '2025-10-01',
    operador: 'Roberto Silva'
  }
];

const mockMantenimientos: Mantenimiento[] = [
  {
    id: '1',
    equipoId: '3',
    equipoNombre: 'Reach Stacker Principal (RST-002)',
    tipo: 'Preventivo',
    descripcion: 'Mantenimiento preventivo de 2000 horas',
    fecha: '2025-10-16',
    tecnico: 'Taller Mecánico Central',
    costo: 1200.00,
    estado: 'en-proceso'
  },
  {
    id: '2',
    equipoId: '1',
    equipoNombre: 'Grúa Pórtico 1 (GRU-001)',
    tipo: 'Preventivo',
    descripcion: 'Revisión general programada',
    fecha: '2025-10-20',
    tecnico: 'Servicio Técnico Especializado',
    costo: 2500.00,
    estado: 'programado'
  },
  {
    id: '3',
    equipoId: '5',
    equipoNombre: 'Montacargas Estándar 2 (MTG-002)',
    tipo: 'Correctivo',
    descripcion: 'Reparación sistema hidráulico',
    fecha: '2025-10-15',
    tecnico: 'Taller Mecánico Central',
    costo: 850.00,
    estado: 'completado'
  }
];

export function GestionEquipos() {
  const [equipos] = useState<Equipo[]>(mockEquipos);
  const [mantenimientos] = useState<Mantenimiento[]>(mockMantenimientos);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [equipoSeleccionado, setEquipoSeleccionado] = useState<Equipo | null>(null);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);

  const equiposFiltrados = equipos.filter(equipo => {
    const matchBusqueda = busqueda === '' || 
      equipo.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      equipo.codigo.toLowerCase().includes(busqueda.toLowerCase());
    const matchEstado = filtroEstado === 'todos' || equipo.estado === filtroEstado;
    const matchTipo = filtroTipo === 'todos' || equipo.tipo === filtroTipo;
    
    return matchBusqueda && matchEstado && matchTipo;
  });

  const getEstadoBadge = (estado: Equipo['estado']) => {
    const config = {
      operativo: { label: 'Operativo', color: 'bg-green-100 text-green-800 border-green-300', icon: <CheckCircle2 className="h-3 w-3" /> },
      mantenimiento: { label: 'En Mantenimiento', color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: <Clock className="h-3 w-3" /> },
      'fuera-servicio': { label: 'Fuera de Servicio', color: 'bg-red-100 text-red-800 border-red-300', icon: <AlertTriangle className="h-3 w-3" /> }
    };
    return config[estado];
  };

  const handleVerDetalle = (equipo: Equipo) => {
    setEquipoSeleccionado(equipo);
    setMostrarDetalle(true);
  };

  const handleProgramarMantenimiento = (equipo: Equipo) => {
    toast.success(`Mantenimiento programado para ${equipo.nombre}`);
  };

  const estadisticas = {
    total: equipos.length,
    operativos: equipos.filter(e => e.estado === 'operativo').length,
    mantenimiento: equipos.filter(e => e.estado === 'mantenimiento').length,
    fueraServicio: equipos.filter(e => e.estado === 'fuera-servicio').length,
    alertas: equipos.filter(e => e.diasProximoMantenimiento <= 7).length,
    utilizacionPromedio: Math.round(equipos.reduce((sum, e) => sum + e.utilizacion, 0) / equipos.length)
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl mb-2">🛠️ Gestión de Equipos</h1>
        <p className="text-gray-600">Administración de inventario, disponibilidad y mantenimiento de equipos</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <Wrench className="h-6 w-6 mx-auto mb-1 text-blue-500" />
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl">{estadisticas.total}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200">
          <CardContent className="p-4">
            <div className="text-center">
              <CheckCircle2 className="h-6 w-6 mx-auto mb-1 text-green-500" />
              <p className="text-sm text-gray-600">Operativos</p>
              <p className="text-2xl text-green-600">{estadisticas.operativos}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-yellow-200">
          <CardContent className="p-4">
            <div className="text-center">
              <Clock className="h-6 w-6 mx-auto mb-1 text-yellow-500" />
              <p className="text-sm text-gray-600">Mantenimiento</p>
              <p className="text-2xl text-yellow-600">{estadisticas.mantenimiento}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-200">
          <CardContent className="p-4">
            <div className="text-center">
              <AlertTriangle className="h-6 w-6 mx-auto mb-1 text-red-500" />
              <p className="text-sm text-gray-600">Fuera Servicio</p>
              <p className="text-2xl text-red-600">{estadisticas.fueraServicio}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <Settings className="h-6 w-6 mx-auto mb-1 text-orange-500" />
              <p className="text-sm text-gray-600">Alertas Mant.</p>
              <p className="text-2xl text-orange-600">{estadisticas.alertas}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <Activity className="h-6 w-6 mx-auto mb-1 text-purple-500" />
              <p className="text-sm text-gray-600">Utilización</p>
              <p className="text-2xl text-purple-600">{estadisticas.utilizacionPromedio}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="busqueda">Buscar Equipo</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="busqueda"
                  placeholder="Nombre o código..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="filtroTipo">Tipo de Equipo</Label>
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Grúa">Grúa</SelectItem>
                  <SelectItem value="Montacargas">Montacargas</SelectItem>
                  <SelectItem value="Reach Stacker">Reach Stacker</SelectItem>
                  <SelectItem value="Camión Interno">Camión Interno</SelectItem>
                  <SelectItem value="Equipo Auxiliar">Equipo Auxiliar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="filtroEstado">Estado</Label>
              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="operativo">Operativo</SelectItem>
                  <SelectItem value="mantenimiento">En Mantenimiento</SelectItem>
                  <SelectItem value="fuera-servicio">Fuera de Servicio</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="equipos" className="space-y-6">
        <TabsList>
          <TabsTrigger value="equipos">Inventario de Equipos</TabsTrigger>
          <TabsTrigger value="mantenimientos">Mantenimientos</TabsTrigger>
        </TabsList>

        <TabsContent value="equipos">
          <Card>
            <CardHeader>
              <CardTitle>Equipos ({equiposFiltrados.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {equiposFiltrados.map((equipo) => {
                  const estadoBadge = getEstadoBadge(equipo.estado);
                  const porcentajeHoras = (equipo.horasTrabajadas / equipo.horasMantenimiento) * 100;
                  
                  return (
                    <div key={equipo.id} className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg">{equipo.nombre}</h3>
                            <Badge variant="outline">{equipo.tipo}</Badge>
                            <Badge className={estadoBadge.color + ' border flex items-center gap-1'}>
                              {estadoBadge.icon}
                              {estadoBadge.label}
                            </Badge>
                            {equipo.diasProximoMantenimiento <= 7 && (
                              <Badge className="bg-orange-100 text-orange-800 border border-orange-300">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Mantenimiento próximo
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600 mb-3">
                            <div>
                              <span className="font-medium">Código:</span> {equipo.codigo}
                            </div>
                            <div>
                              <span className="font-medium">Zona:</span> {equipo.zonaAsignada}
                            </div>
                            <div>
                              <span className="font-medium">Operador:</span> {equipo.operador}
                            </div>
                            <div>
                              <span className="font-medium">Utilización:</span> {equipo.utilizacion}%
                            </div>
                          </div>

                          {/* Barra de horas trabajadas */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs text-gray-600">
                              <span>Horas trabajadas: {equipo.horasTrabajadas}h / {equipo.horasMantenimiento}h</span>
                              <span className={porcentajeHoras >= 90 ? 'text-red-600' : ''}>
                                {porcentajeHoras.toFixed(0)}%
                              </span>
                            </div>
                            <Progress 
                              value={porcentajeHoras} 
                              className={`h-2 ${porcentajeHoras >= 90 ? '[&>div]:bg-red-500' : ''}`}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mt-2">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Próximo mantenimiento: {new Date(equipo.proximoMantenimiento).toLocaleDateString('es-ES')}
                              {equipo.diasProximoMantenimiento <= 7 && (
                                <span className="text-orange-600">({equipo.diasProximoMantenimiento} días)</span>
                              )}
                            </div>
                            <div>
                              Última revisión: {new Date(equipo.ultimaRevision).toLocaleDateString('es-ES')}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="flex gap-2 pt-3 border-t">
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => handleVerDetalle(equipo)}
                        >
                          <Settings className="h-4 w-4 mr-1" />
                          Ver Detalle
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => handleProgramarMantenimiento(equipo)}
                        >
                          <Calendar className="h-4 w-4 mr-1" />
                          Programar Mantenimiento
                        </Button>
                        {equipo.estado === 'operativo' && (
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-1" />
                            Asignar
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mantenimientos">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Registro de Mantenimientos</CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Mantenimiento
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mantenimientos.map((mantenimiento) => (
                  <div key={mantenimiento.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg">{mantenimiento.equipoNombre}</h3>
                          <Badge variant={mantenimiento.tipo === 'Preventivo' ? 'outline' : 'default'}>
                            {mantenimiento.tipo}
                          </Badge>
                          <Badge className={
                            mantenimiento.estado === 'completado' ? 'bg-green-100 text-green-800' :
                            mantenimiento.estado === 'en-proceso' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }>
                            {mantenimiento.estado === 'completado' ? 'Completado' :
                             mantenimiento.estado === 'en-proceso' ? 'En Proceso' :
                             'Programado'}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{mantenimiento.descripcion}</p>
                        
                        <div className="grid grid-cols-3 gap-2 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(mantenimiento.fecha).toLocaleDateString('es-ES')}
                          </div>
                          <div>
                            <span className="font-medium">Técnico:</span> {mantenimiento.tecnico}
                          </div>
                          <div>
                            <span className="font-medium">Costo:</span> ${mantenimiento.costo.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo de detalle del equipo */}
      <Dialog open={mostrarDetalle} onOpenChange={setMostrarDetalle}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalle del Equipo</DialogTitle>
          </DialogHeader>
          {equipoSeleccionado && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nombre</Label>
                  <p className="text-sm">{equipoSeleccionado.nombre}</p>
                </div>
                <div>
                  <Label>Código</Label>
                  <p className="text-sm">{equipoSeleccionado.codigo}</p>
                </div>
                <div>
                  <Label>Tipo</Label>
                  <p className="text-sm">{equipoSeleccionado.tipo}</p>
                </div>
                <div>
                  <Label>Estado</Label>
                  <Badge className={getEstadoBadge(equipoSeleccionado.estado).color}>
                    {getEstadoBadge(equipoSeleccionado.estado).label}
                  </Badge>
                </div>
                <div>
                  <Label>Zona Asignada</Label>
                  <p className="text-sm">{equipoSeleccionado.zonaAsignada}</p>
                </div>
                <div>
                  <Label>Operador</Label>
                  <p className="text-sm">{equipoSeleccionado.operador}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="mb-3">Información de Mantenimiento</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Horas Trabajadas</Label>
                    <p className="text-sm">{equipoSeleccionado.horasTrabajadas}h / {equipoSeleccionado.horasMantenimiento}h</p>
                    <Progress value={(equipoSeleccionado.horasTrabajadas / equipoSeleccionado.horasMantenimiento) * 100} className="mt-2" />
                  </div>
                  <div>
                    <Label>Utilización</Label>
                    <p className="text-sm">{equipoSeleccionado.utilizacion}%</p>
                    <Progress value={equipoSeleccionado.utilizacion} className="mt-2" />
                  </div>
                  <div>
                    <Label>Próximo Mantenimiento</Label>
                    <p className="text-sm">{new Date(equipoSeleccionado.proximoMantenimiento).toLocaleDateString('es-ES')}</p>
                    <p className="text-xs text-gray-500">En {equipoSeleccionado.diasProximoMantenimiento} días</p>
                  </div>
                  <div>
                    <Label>Última Revisión</Label>
                    <p className="text-sm">{new Date(equipoSeleccionado.ultimaRevision).toLocaleDateString('es-ES')}</p>
                  </div>
                </div>
              </div>
            </div>
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
