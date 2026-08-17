import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Map, 
  Search, 
  Filter, 
  Package, 
  AlertTriangle,
  Info,
  MapPin,
  Calendar,
  Maximize2,
  RefreshCw
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner';

interface Espacio {
  id: string;
  zona: string;
  posicion: number;
  contenedor: string | null;
  tipoContenedor: string | null;
  cliente: string | null;
  fechaIngreso: string | null;
  diasEstadia: number;
  estado: 'libre' | 'reservado' | 'ocupado';
  operacion: 'Importación' | 'Exportación' | null;
}

const generarPatioMock = (): Espacio[] => {
  const espacios: Espacio[] = [];
  const zonas = ['A', 'B', 'C', 'D', 'E', 'F'];
  const contenedores = ['TCLU1234567', 'MSCU9876543', 'HLCU5555555', 'MAEU7777777', null, null];
  const clientes = ['Empresa ABC', 'Comercial XYZ', 'Logística 123', 'TransOcean', null, null];
  
  zonas.forEach((zona) => {
    for (let i = 1; i <= 20; i++) {
      const ocupado = Math.random() > 0.5;
      const reservado = !ocupado && Math.random() > 0.7;
      const diasEstadia = ocupado ? Math.floor(Math.random() * 30) : 0;
      
      espacios.push({
        id: `${zona}-${i}`,
        zona,
        posicion: i,
        contenedor: ocupado ? contenedores[Math.floor(Math.random() * 4)] : null,
        tipoContenedor: ocupado ? ['20DC', '40DC', '40HC'][Math.floor(Math.random() * 3)] : null,
        cliente: ocupado ? clientes[Math.floor(Math.random() * 4)] : null,
        fechaIngreso: ocupado ? `2025-${10 - Math.floor(diasEstadia / 30)}-${Math.max(1, 16 - diasEstadia)}` : null,
        diasEstadia,
        estado: ocupado ? 'ocupado' : reservado ? 'reservado' : 'libre',
        operacion: ocupado ? (['Importación', 'Exportación'][Math.floor(Math.random() * 2)] as 'Importación' | 'Exportación') : null
      });
    }
  });
  
  return espacios;
};

export function ControlPatio() {
  const [espacios] = useState<Espacio[]>(generarPatioMock());
  const [zonaSeleccionada, setZonaSeleccionada] = useState<string>('todas');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [busqueda, setBusqueda] = useState('');
  const [espacioSeleccionado, setEspacioSeleccionado] = useState<Espacio | null>(null);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);

  const zonas = ['A', 'B', 'C', 'D', 'E', 'F'];

  const espaciosFiltrados = espacios.filter(espacio => {
    const matchZona = zonaSeleccionada === 'todas' || espacio.zona === zonaSeleccionada;
    const matchEstado = filtroEstado === 'todos' || espacio.estado === filtroEstado;
    const matchBusqueda = busqueda === '' || 
      espacio.contenedor?.toLowerCase().includes(busqueda.toLowerCase()) ||
      espacio.cliente?.toLowerCase().includes(busqueda.toLowerCase());
    
    return matchZona && matchEstado && matchBusqueda;
  });

  const getColorEstado = (estado: Espacio['estado'], diasEstadia: number) => {
    if (estado === 'libre') return 'bg-green-100 border-green-300 hover:bg-green-200';
    if (estado === 'reservado') return 'bg-yellow-100 border-yellow-300 hover:bg-yellow-200';
    if (diasEstadia > 20) return 'bg-red-100 border-red-300 hover:bg-red-200';
    return 'bg-blue-100 border-blue-300 hover:bg-blue-200';
  };

  const handleClickEspacio = (espacio: Espacio) => {
    setEspacioSeleccionado(espacio);
    setMostrarDetalle(true);
  };

  const handleLiberarEspacio = () => {
    toast.success(`Espacio ${espacioSeleccionado?.id} liberado correctamente`);
    setMostrarDetalle(false);
  };

  const estadisticas = {
    total: espacios.length,
    libres: espacios.filter(e => e.estado === 'libre').length,
    reservados: espacios.filter(e => e.estado === 'reservado').length,
    ocupados: espacios.filter(e => e.estado === 'ocupado').length,
    excedidos: espacios.filter(e => e.diasEstadia > 20).length
  };

  const ocupacionPorcentaje = ((estadisticas.ocupados / estadisticas.total) * 100).toFixed(1);

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl mb-2">🗺️ Control de Patio</h1>
        <p className="text-gray-600">Mapa interactivo del patio con distribución y ocupación en tiempo real</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Espacios Totales</p>
              <p className="text-2xl">{estadisticas.total}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Libres</p>
              <p className="text-2xl text-green-600">{estadisticas.libres}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-yellow-200">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Reservados</p>
              <p className="text-2xl text-yellow-600">{estadisticas.reservados}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Ocupados</p>
              <p className="text-2xl text-blue-600">{estadisticas.ocupados}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-200">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Excedidos (+20 días)</p>
              <p className="text-2xl text-red-600">{estadisticas.excedidos}</p>
              <p className="text-xs text-gray-500">Ocupación: {ocupacionPorcentaje}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="busqueda">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="busqueda"
                  placeholder="Contenedor o cliente..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="zona">Zona</Label>
              <Select value={zonaSeleccionada} onValueChange={setZonaSeleccionada}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las Zonas</SelectItem>
                  {zonas.map(zona => (
                    <SelectItem key={zona} value={zona}>Zona {zona}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="estado">Estado</Label>
              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="libre">Libres</SelectItem>
                  <SelectItem value="reservado">Reservados</SelectItem>
                  <SelectItem value="ocupado">Ocupados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => toast.success('Vista actualizada')}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leyenda */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <span className="text-sm">Leyenda:</span>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-100 border-2 border-green-300 rounded"></div>
              <span className="text-sm">Libre</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-yellow-100 border-2 border-yellow-300 rounded"></div>
              <span className="text-sm">Reservado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-100 border-2 border-blue-300 rounded"></div>
              <span className="text-sm">Ocupado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-100 border-2 border-red-300 rounded"></div>
              <span className="text-sm">Excede tiempo</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mapa del Patio */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Plano del Patio - Vista General</CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline">
                <Map className="h-4 w-4 mr-1" />
                {zonaSeleccionada === 'todas' ? 'Todas las Zonas' : `Zona ${zonaSeleccionada}`}
              </Badge>
              <Badge variant="outline">
                {espaciosFiltrados.length} espacios
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {zonas.map(zona => {
              const espaciosZona = espaciosFiltrados.filter(e => e.zona === zona);
              if (zonaSeleccionada !== 'todas' && zona !== zonaSeleccionada) return null;
              if (espaciosZona.length === 0 && zonaSeleccionada === 'todas') return null;
              
              return (
                <div key={zona} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="mb-3">Zona {zona}</h3>
                  <div className="grid grid-cols-10 gap-2">
                    {espaciosZona.map(espacio => (
                      <button
                        key={espacio.id}
                        onClick={() => handleClickEspacio(espacio)}
                        className={`
                          relative aspect-square border-2 rounded transition-all
                          ${getColorEstado(espacio.estado, espacio.diasEstadia)}
                          flex items-center justify-center text-xs
                        `}
                        title={espacio.contenedor || `Espacio ${espacio.id}`}
                      >
                        {espacio.estado === 'ocupado' && (
                          <Package className="h-4 w-4" />
                        )}
                        {espacio.estado === 'libre' && (
                          <span className="text-gray-400">{espacio.posicion}</span>
                        )}
                        {espacio.estado === 'reservado' && (
                          <MapPin className="h-4 w-4" />
                        )}
                        {espacio.diasEstadia > 20 && (
                          <AlertTriangle className="absolute top-0 right-0 h-3 w-3 text-red-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Diálogo de detalle */}
      <Dialog open={mostrarDetalle} onOpenChange={setMostrarDetalle}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalle del Espacio {espacioSeleccionado?.id}</DialogTitle>
            <DialogDescription>
              Información completa del espacio seleccionado
            </DialogDescription>
          </DialogHeader>
          {espacioSeleccionado && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Zona</Label>
                  <p className="text-sm">{espacioSeleccionado.zona}</p>
                </div>
                <div>
                  <Label>Posición</Label>
                  <p className="text-sm">{espacioSeleccionado.posicion}</p>
                </div>
              </div>

              <div>
                <Label>Estado</Label>
                <Badge className={
                  espacioSeleccionado.estado === 'libre' ? 'bg-green-100 text-green-800' :
                  espacioSeleccionado.estado === 'reservado' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }>
                  {espacioSeleccionado.estado.charAt(0).toUpperCase() + espacioSeleccionado.estado.slice(1)}
                </Badge>
              </div>

              {espacioSeleccionado.estado === 'ocupado' && (
                <>
                  <div>
                    <Label>Contenedor</Label>
                    <p className="text-sm">{espacioSeleccionado.contenedor} ({espacioSeleccionado.tipoContenedor})</p>
                  </div>

                  <div>
                    <Label>Cliente</Label>
                    <p className="text-sm">{espacioSeleccionado.cliente}</p>
                  </div>

                  <div>
                    <Label>Operación</Label>
                    <Badge variant="outline">{espacioSeleccionado.operacion}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Fecha Ingreso</Label>
                      <p className="text-sm">{new Date(espacioSeleccionado.fechaIngreso!).toLocaleDateString('es-ES')}</p>
                    </div>
                    <div>
                      <Label>Días de Estadía</Label>
                      <p className={`text-sm ${espacioSeleccionado.diasEstadia > 20 ? 'text-red-600' : ''}`}>
                        {espacioSeleccionado.diasEstadia} días
                      </p>
                    </div>
                  </div>

                  {espacioSeleccionado.diasEstadia > 20 && (
                    <div className="bg-red-50 border border-red-200 rounded p-3 flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-red-800">
                          Este contenedor ha excedido el tiempo máximo de estadía (20 días)
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => toast.info('Función de reasignación en desarrollo')}
                    >
                      <Maximize2 className="h-4 w-4 mr-2" />
                      Reasignar
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="flex-1"
                      onClick={handleLiberarEspacio}
                    >
                      Liberar Espacio
                    </Button>
                  </div>
                </>
              )}

              {espacioSeleccionado.estado === 'libre' && (
                <div className="bg-green-50 border border-green-200 rounded p-3 flex items-start gap-2">
                  <Info className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-green-800">
                      Este espacio está disponible para nuevas asignaciones
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
