import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Bell, 
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Clock,
  DollarSign,
  Package,
  TrendingUp,
  Send,
  X,
  Filter,
  Calendar
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner';

interface Alerta {
  id: string;
  tipo: 'operativa' | 'financiera' | 'logistica' | 'comercial';
  prioridad: 'alta' | 'media' | 'baja';
  titulo: string;
  descripcion: string;
  fecha: string;
  leida: boolean;
  accionable: boolean;
  cliente?: string;
  referencia?: string;
}

const mockAlertas: Alerta[] = [
  {
    id: '1',
    tipo: 'operativa',
    prioridad: 'alta',
    titulo: 'Reserva no agendada próxima a vencer',
    descripcion: 'Booking 234567890123456 sin turno asignado, vence en 24 horas',
    fecha: '2025-10-16T14:30:00',
    leida: false,
    accionable: true,
    cliente: 'Comercial XYZ Ltda.',
    referencia: '234567890123456'
  },
  {
    id: '2',
    tipo: 'financiera',
    prioridad: 'alta',
    titulo: 'Ticket pendiente de pago',
    descripcion: 'TCK-003 con pago pendiente desde hace 5 días',
    fecha: '2025-10-16T10:15:00',
    leida: false,
    accionable: true,
    cliente: 'Logística 123 S.A.',
    referencia: 'TCK-003'
  },
  {
    id: '3',
    tipo: 'logistica',
    prioridad: 'alta',
    titulo: 'Exceso de ocupación en Zona C',
    descripcion: 'Zona C al 95% de capacidad, considerar redistribución',
    fecha: '2025-10-16T09:00:00',
    leida: false,
    accionable: true
  },
  {
    id: '4',
    tipo: 'operativa',
    prioridad: 'media',
    titulo: 'Turno próximo a cumplimiento',
    descripcion: 'TCK-001 programado para hoy a las 08:00',
    fecha: '2025-10-16T07:30:00',
    leida: true,
    accionable: false,
    cliente: 'Empresa ABC S.A.',
    referencia: 'TCK-001'
  },
  {
    id: '5',
    tipo: 'financiera',
    prioridad: 'media',
    titulo: 'Cartera vencida',
    descripcion: 'Cliente TransOcean Inc. con saldo vencido $450.00',
    fecha: '2025-10-15T16:20:00',
    leida: false,
    accionable: true,
    cliente: 'TransOcean Inc.'
  },
  {
    id: '6',
    tipo: 'logistica',
    prioridad: 'alta',
    titulo: 'Contenedor excede tiempo de estadía',
    descripcion: 'HLCU5555555 en patio desde hace 25 días (límite: 20 días)',
    fecha: '2025-10-15T12:00:00',
    leida: false,
    accionable: true,
    cliente: 'Logística 123 S.A.',
    referencia: 'HLCU5555555'
  },
  {
    id: '7',
    tipo: 'comercial',
    prioridad: 'baja',
    titulo: 'Promoción horario valle disponible',
    descripcion: 'Descuento 15% en horarios 20:00-23:45 para próxima semana',
    fecha: '2025-10-15T10:00:00',
    leida: true,
    accionable: true
  },
  {
    id: '8',
    tipo: 'operativa',
    prioridad: 'media',
    titulo: 'Múltiples reservas mismo horario',
    descripcion: '3 reservas agendadas para 14:00-2 el 2025-10-18',
    fecha: '2025-10-15T08:45:00',
    leida: false,
    accionable: true,
    referencia: '2025-10-18 14:00'
  }
];

export function AlertasNotificaciones() {
  const [alertas, setAlertas] = useState<Alerta[]>(mockAlertas);
  const [filtroTipo, setFiltroTipo] = useState<string>('todas');
  const [filtroPrioridad, setFiltroPrioridad] = useState<string>('todas');
  const [mostrarLeidas, setMostrarLeidas] = useState(false);

  const alertasFiltradas = alertas.filter(alerta => {
    const matchTipo = filtroTipo === 'todas' || alerta.tipo === filtroTipo;
    const matchPrioridad = filtroPrioridad === 'todas' || alerta.prioridad === filtroPrioridad;
    const matchLeidas = mostrarLeidas || !alerta.leida;
    
    return matchTipo && matchPrioridad && matchLeidas;
  });

  const getTipoConfig = (tipo: Alerta['tipo']) => {
    const config = {
      operativa: { 
        icon: <Clock className="h-5 w-5" />, 
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        label: 'Operativa'
      },
      financiera: { 
        icon: <DollarSign className="h-5 w-5" />, 
        color: 'text-green-600',
        bg: 'bg-green-50',
        border: 'border-green-200',
        label: 'Financiera'
      },
      logistica: { 
        icon: <Package className="h-5 w-5" />, 
        color: 'text-purple-600',
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        label: 'Logística'
      },
      comercial: { 
        icon: <TrendingUp className="h-5 w-5" />, 
        color: 'text-orange-600',
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        label: 'Comercial'
      }
    };
    return config[tipo];
  };

  const getPrioridadBadge = (prioridad: Alerta['prioridad']) => {
    const config = {
      alta: { label: 'Alta', color: 'bg-red-100 text-red-800 border-red-300', icon: <AlertTriangle className="h-3 w-3" /> },
      media: { label: 'Media', color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: <AlertCircle className="h-3 w-3" /> },
      baja: { label: 'Baja', color: 'bg-blue-100 text-blue-800 border-blue-300', icon: <Info className="h-3 w-3" /> }
    };
    return config[prioridad];
  };

  const marcarComoLeida = (id: string) => {
    setAlertas(alertas.map(a => a.id === id ? { ...a, leida: true } : a));
  };

  const handleAccion = (alerta: Alerta) => {
    marcarComoLeida(alerta.id);
    toast.success(`Acción ejecutada para: ${alerta.titulo}`);
  };

  const handleEnviarRecordatorio = (alerta: Alerta) => {
    if (alerta.cliente) {
      toast.success(`Recordatorio enviado a ${alerta.cliente}`);
      marcarComoLeida(alerta.id);
    }
  };

  const marcarTodasLeidas = () => {
    setAlertas(alertas.map(a => ({ ...a, leida: true })));
    toast.success('Todas las alertas marcadas como leídas');
  };

  const estadisticas = {
    total: alertas.length,
    noLeidas: alertas.filter(a => !a.leida).length,
    alta: alertas.filter(a => a.prioridad === 'alta' && !a.leida).length,
    media: alertas.filter(a => a.prioridad === 'media' && !a.leida).length,
    baja: alertas.filter(a => a.prioridad === 'baja' && !a.leida).length,
    accionables: alertas.filter(a => a.accionable && !a.leida).length
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl mb-2">🔔 Alertas y Notificaciones</h1>
        <p className="text-gray-600">Centro de control proactivo para eventos, pagos y operaciones</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <Bell className="h-6 w-6 mx-auto mb-1 text-blue-500" />
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl">{estadisticas.total}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">No Leídas</p>
              <p className="text-2xl text-blue-600">{estadisticas.noLeidas}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-200">
          <CardContent className="p-4">
            <div className="text-center">
              <AlertTriangle className="h-6 w-6 mx-auto mb-1 text-red-500" />
              <p className="text-sm text-gray-600">Alta</p>
              <p className="text-2xl text-red-600">{estadisticas.alta}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-yellow-200">
          <CardContent className="p-4">
            <div className="text-center">
              <AlertCircle className="h-6 w-6 mx-auto mb-1 text-yellow-500" />
              <p className="text-sm text-gray-600">Media</p>
              <p className="text-2xl text-yellow-600">{estadisticas.media}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <Info className="h-6 w-6 mx-auto mb-1 text-blue-500" />
              <p className="text-sm text-gray-600">Baja</p>
              <p className="text-2xl">{estadisticas.baja}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200">
          <CardContent className="p-4">
            <div className="text-center">
              <CheckCircle2 className="h-6 w-6 mx-auto mb-1 text-green-500" />
              <p className="text-sm text-gray-600">Accionables</p>
              <p className="text-2xl text-green-600">{estadisticas.accionables}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="filtroTipo">Tipo de Alerta</Label>
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="operativa">Operativas</SelectItem>
                  <SelectItem value="financiera">Financieras</SelectItem>
                  <SelectItem value="logistica">Logísticas</SelectItem>
                  <SelectItem value="comercial">Comerciales</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="filtroPrioridad">Prioridad</Label>
              <Select value={filtroPrioridad} onValueChange={setFiltroPrioridad}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="mostrarLeidas" 
                  checked={mostrarLeidas}
                  onCheckedChange={(checked) => setMostrarLeidas(checked as boolean)}
                />
                <Label htmlFor="mostrarLeidas" className="cursor-pointer">
                  Mostrar leídas
                </Label>
              </div>
            </div>

            <div className="flex items-end">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={marcarTodasLeidas}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Marcar todas como leídas
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de alertas */}
      <Card>
        <CardHeader>
          <CardTitle>Alertas ({alertasFiltradas.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alertasFiltradas.map((alerta) => {
              const tipoConfig = getTipoConfig(alerta.tipo);
              const prioridadBadge = getPrioridadBadge(alerta.prioridad);

              return (
                <div 
                  key={alerta.id} 
                  className={`
                    border-l-4 ${tipoConfig.border} p-4 rounded-r-lg
                    ${alerta.leida ? 'bg-gray-50' : 'bg-white shadow-sm'}
                    transition-all hover:shadow-md
                  `}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`${tipoConfig.color} mt-1`}>
                        {tipoConfig.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`${alerta.leida ? 'text-gray-600' : ''}`}>
                            {alerta.titulo}
                          </h3>
                          {!alerta.leida && (
                            <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{alerta.descripcion}</p>
                        
                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                          <Badge variant="outline" className={tipoConfig.bg + ' ' + tipoConfig.color}>
                            {tipoConfig.label}
                          </Badge>
                          <Badge className={prioridadBadge.color + ' border flex items-center gap-1'}>
                            {prioridadBadge.icon}
                            {prioridadBadge.label}
                          </Badge>
                          {alerta.cliente && (
                            <span className="flex items-center gap-1">
                              <strong>Cliente:</strong> {alerta.cliente}
                            </span>
                          )}
                          {alerta.referencia && (
                            <span className="flex items-center gap-1">
                              <strong>Ref:</strong> {alerta.referencia}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(alerta.fecha).toLocaleString('es-ES')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  {!alerta.leida && (
                    <div className="flex gap-2 mt-3 pt-3 border-t">
                      {alerta.accionable && (
                        <Button 
                          size="sm"
                          onClick={() => handleAccion(alerta)}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Ejecutar Acción
                        </Button>
                      )}
                      {alerta.cliente && (
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => handleEnviarRecordatorio(alerta)}
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Enviar Recordatorio
                        </Button>
                      )}
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => marcarComoLeida(alerta.id)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Marcar como leída
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}

            {alertasFiltradas.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>No hay alertas que mostrar</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
