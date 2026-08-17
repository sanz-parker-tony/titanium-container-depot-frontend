import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  DollarSign, 
  AlertCircle, 
  Package,
  Bell,
  Filter,
  Download,
  ChevronRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ScrollArea } from './ui/scroll-area';

// Mock data para el dashboard
const ticketsHoyData = {
  total: 84,
  variacion: 12,
  tendencia: 'up' as const
};

const ticketsAgendadosData = {
  porcentaje: 72,
  total: 60,
  deTotal: 84
};

const ingresosHoyData = {
  total: 3240,
  variacion: 8.5,
  tendencia: 'up' as const
};

const ticketsSinAgendarData = {
  total: 18,
  mayoresDe3Dias: true
};

const ocupacionPatioData = {
  porcentaje: 68,
  espaciosUsados: 340,
  espaciosTotales: 500
};

// Gráfico de calor de horas demandadas (heatmap simulado)
const horasDemandaData = [
  { dia: 'Lun', h8: 12, h9: 18, h10: 25, h11: 22, h12: 15, h13: 10, h14: 20, h15: 28, h16: 24, h17: 16, h18: 8, h19: 6, h20: 4, h21: 2, h22: 1, h23: 0 },
  { dia: 'Mar', h8: 15, h9: 20, h10: 28, h11: 24, h12: 18, h13: 12, h14: 22, h15: 30, h16: 26, h17: 18, h18: 10, h19: 7, h20: 5, h21: 3, h22: 2, h23: 1 },
  { dia: 'Mié', h8: 14, h9: 19, h10: 26, h11: 23, h12: 17, h13: 11, h14: 21, h15: 29, h16: 25, h17: 17, h18: 9, h19: 6, h20: 4, h21: 2, h22: 1, h23: 0 },
  { dia: 'Jue', h8: 16, h9: 21, h10: 29, h11: 25, h12: 19, h13: 13, h14: 23, h15: 31, h16: 27, h17: 19, h18: 11, h19: 8, h20: 6, h21: 4, h22: 2, h23: 1 },
  { dia: 'Vie', h8: 18, h9: 23, h10: 31, h11: 27, h12: 21, h13: 15, h14: 25, h15: 33, h16: 29, h17: 21, h18: 13, h19: 10, h20: 8, h21: 6, h22: 4, h23: 2 },
  { dia: 'Sáb', h8: 8, h9: 10, h10: 15, h11: 12, h12: 9, h13: 6, h14: 11, h15: 14, h16: 12, h17: 8, h18: 5, h19: 3, h20: 2, h21: 1, h22: 0, h23: 0 },
  { dia: 'Dom', h8: 5, h9: 6, h10: 9, h11: 7, h12: 5, h13: 3, h14: 6, h15: 8, h16: 7, h17: 5, h18: 3, h19: 2, h20: 1, h21: 0, h22: 0, h23: 0 },
];

// Tipo de contenedor
const tipoContenedorData = [
  { name: 'Dry', value: 45, color: '#3b82f6' },
  { name: 'Reefer', value: 30, color: '#10b981' },
  { name: 'Tank', value: 15, color: '#f59e0b' },
  { name: 'Open Top', value: 10, color: '#8b5cf6' },
];

// Tipo de cliente
const tipoClienteData = [
  { tipo: 'Freight Forwarders', cantidad: 145 },
  { tipo: 'Exportadores Directos', cantidad: 98 },
  { tipo: 'Transportistas', cantidad: 76 },
  { tipo: 'Navieras', cantidad: 54 },
];

// Tickets generados vs pagados (últimos 30 días)
const ticketsGeneradosPagadosData = [
  { dia: '1', generados: 45, pagados: 38 },
  { dia: '5', generados: 52, pagados: 45 },
  { dia: '10', generados: 61, pagados: 54 },
  { dia: '15', generados: 58, pagados: 51 },
  { dia: '20', generados: 70, pagados: 63 },
  { dia: '25', generados: 68, pagados: 60 },
  { dia: '30', generados: 84, pagados: 72 },
];

// Cartera por vencimiento
const carteraVencimientoData = [
  { rango: '0-30 días', monto: 15420 },
  { rango: '31-60 días', monto: 8760 },
  { rango: '61-90 días', monto: 4320 },
  { rango: '+90 días', monto: 2180 },
];

// Ingresos por tipo de servicio
const ingresosPorServicioData = [
  { name: 'Ingreso Contenedor', value: 45, color: '#3b82f6' },
  { name: 'Retiro', value: 35, color: '#10b981' },
  { name: 'Almacenaje', value: 20, color: '#f59e0b' },
];

// Ranking de clientes
const rankingClientesData = [
  { 
    cliente: 'Naviera XYZ',
    reservasTotales: 214,
    noAgendadas: 8,
    ultimaVisita: '12/oct',
    ingresos: 8540,
    estado: 'ocasional',
    estadoColor: 'bg-yellow-100 text-yellow-700'
  },
  { 
    cliente: 'TransMar',
    reservasTotales: 142,
    noAgendadas: 0,
    ultimaVisita: '14/oct',
    ingresos: 7220,
    estado: 'frecuente',
    estadoColor: 'bg-green-100 text-green-700'
  },
  { 
    cliente: 'LogiPac',
    reservasTotales: 89,
    noAgendadas: 12,
    ultimaVisita: '08/oct',
    ingresos: 3910,
    estado: 'inactivo',
    estadoColor: 'bg-red-100 text-red-700'
  },
  { 
    cliente: 'Cargo Express',
    reservasTotales: 156,
    noAgendadas: 3,
    ultimaVisita: '15/oct',
    ingresos: 6830,
    estado: 'frecuente',
    estadoColor: 'bg-green-100 text-green-700'
  },
  { 
    cliente: 'Global Shipping',
    reservasTotales: 98,
    noAgendadas: 15,
    ultimaVisita: '05/oct',
    ingresos: 4250,
    estado: 'ocasional',
    estadoColor: 'bg-yellow-100 text-yellow-700'
  },
];

// Alertas
const alertasData = [
  { 
    tipo: 'warning',
    mensaje: 'Cliente LogiPac no agenda desde hace 7 días.',
    timestamp: 'Hace 2 horas'
  },
  { 
    tipo: 'alert',
    mensaje: 'Ticket 004239 lleva 4 días sin confirmar turno.',
    timestamp: 'Hace 5 horas'
  },
  { 
    tipo: 'success',
    mensaje: 'Promoción nocturna: +5 reservas confirmadas ayer.',
    timestamp: 'Hace 1 día'
  },
  { 
    tipo: 'warning',
    mensaje: 'Ocupación del patio alcanzó 68%, considerar expansión.',
    timestamp: 'Hace 3 horas'
  },
];

// Zonificación (mapa de calor por zona)
const zonificacionData = [
  { zona: 'Zona A', ocupacion: 85, espacios: '34/40' },
  { zona: 'Zona B', ocupacion: 72, espacios: '36/50' },
  { zona: 'Zona C', ocupacion: 45, espacios: '27/60' },
  { zona: 'Zona D', ocupacion: 90, espacios: '45/50' },
];

const getIntensidadColor = (valor: number) => {
  if (valor === 0) return '#f1f5f9';
  if (valor <= 5) return '#dbeafe';
  if (valor <= 10) return '#bfdbfe';
  if (valor <= 15) return '#93c5fd';
  if (valor <= 20) return '#60a5fa';
  if (valor <= 25) return '#3b82f6';
  if (valor <= 30) return '#2563eb';
  return '#1d4ed8';
};

export function AdminDashboard() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl">Panel Administrativo</h1>
          <p className="text-sm text-gray-600">Patio Central de Contenedores - Octubre 2025</p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="30">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 días</SelectItem>
              <SelectItem value="30">Últimos 30 días</SelectItem>
              <SelectItem value="90">Últimos 90 días</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Cinta Superior - KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1 - Tickets Generados Hoy */}
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="h-5 w-5 opacity-80" />
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                {ticketsHoyData.tendencia === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                +{ticketsHoyData.variacion}%
              </Badge>
            </div>
            <div className="text-3xl mb-1">{ticketsHoyData.total}</div>
            <div className="text-sm opacity-90">Tickets generados hoy</div>
          </CardContent>
        </Card>

        {/* KPI 2 - Tickets Agendados */}
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Package className="h-5 w-5 opacity-80" />
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                {ticketsAgendadosData.total}/{ticketsAgendadosData.deTotal}
              </Badge>
            </div>
            <div className="text-3xl mb-1">{ticketsAgendadosData.porcentaje}%</div>
            <div className="text-sm opacity-90">Tickets agendados</div>
          </CardContent>
        </Card>

        {/* KPI 3 - Ingresos del día */}
        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-5 w-5 opacity-80" />
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                <TrendingUp className="h-3 w-3" />
                +{ingresosHoyData.variacion}%
              </Badge>
            </div>
            <div className="text-3xl mb-1">${ingresosHoyData.total.toLocaleString()}</div>
            <div className="text-sm opacity-90">Ingresos del día</div>
          </CardContent>
        </Card>

        {/* KPI 4 - Tickets sin agendar >3 días */}
        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="h-5 w-5 opacity-80" />
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                Alerta
              </Badge>
            </div>
            <div className="text-3xl mb-1">{ticketsSinAgendarData.total}</div>
            <div className="text-sm opacity-90">Sin agendar &gt;3 días</div>
          </CardContent>
        </Card>

        {/* KPI 5 - Ocupación del patio */}
        <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Package className="h-5 w-5 opacity-80" />
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                {ocupacionPatioData.espaciosUsados}/{ocupacionPatioData.espaciosTotales}
              </Badge>
            </div>
            <div className="text-3xl mb-1">{ocupacionPatioData.porcentaje}%</div>
            <div className="text-sm opacity-90">Ocupación del patio</div>
          </CardContent>
        </Card>
      </div>

      {/* Contenido Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel Operativo - 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gráfico de calor de horas más demandadas */}
          <Card>
            <CardHeader>
              <CardTitle>Mapa de Calor - Demanda por Horario</CardTitle>
              <CardDescription>Intensidad de tickets por día y hora de la semana</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="p-2 text-xs border text-left">Día</th>
                      {['8h', '9h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h', '21h', '22h', '23h'].map(h => (
                        <th key={h} className="p-2 text-xs border text-center">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {horasDemandaData.map((row) => (
                      <tr key={row.dia}>
                        <td className="p-2 text-xs border">{row.dia}</td>
                        <td className="p-2 border text-center text-xs" style={{ backgroundColor: getIntensidadColor(row.h8) }}>{row.h8}</td>
                        <td className="p-2 border text-center text-xs" style={{ backgroundColor: getIntensidadColor(row.h9) }}>{row.h9}</td>
                        <td className="p-2 border text-center text-xs" style={{ backgroundColor: getIntensidadColor(row.h10) }}>{row.h10}</td>
                        <td className="p-2 border text-center text-xs" style={{ backgroundColor: getIntensidadColor(row.h11) }}>{row.h11}</td>
                        <td className="p-2 border text-center text-xs" style={{ backgroundColor: getIntensidadColor(row.h12) }}>{row.h12}</td>
                        <td className="p-2 border text-center text-xs" style={{ backgroundColor: getIntensidadColor(row.h13) }}>{row.h13}</td>
                        <td className="p-2 border text-center text-xs" style={{ backgroundColor: getIntensidadColor(row.h14) }}>{row.h14}</td>
                        <td className="p-2 border text-center text-xs" style={{ backgroundColor: getIntensidadColor(row.h15) }}>{row.h15}</td>
                        <td className="p-2 border text-center text-xs" style={{ backgroundColor: getIntensidadColor(row.h16) }}>{row.h16}</td>
                        <td className="p-2 border text-center text-xs" style={{ backgroundColor: getIntensidadColor(row.h17) }}>{row.h17}</td>
                        <td className="p-2 border text-center text-xs" style={{ backgroundColor: getIntensidadColor(row.h18) }}>{row.h18}</td>
                        <td className="p-2 border text-center text-xs" style={{ backgroundColor: getIntensidadColor(row.h19) }}>{row.h19}</td>
                        <td className="p-2 border text-center text-xs" style={{ backgroundColor: getIntensidadColor(row.h20) }}>{row.h20}</td>
                        <td className="p-2 border text-center text-xs" style={{ backgroundColor: getIntensidadColor(row.h21) }}>{row.h21}</td>
                        <td className="p-2 border text-center text-xs" style={{ backgroundColor: getIntensidadColor(row.h22) }}>{row.h22}</td>
                        <td className="p-2 border text-center text-xs" style={{ backgroundColor: getIntensidadColor(row.h23) }}>{row.h23}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex items-center justify-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f1f5f9' }}></div>
                    <span className="text-xs">Baja</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3b82f6' }}></div>
                    <span className="text-xs">Media</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#1d4ed8' }}></div>
                    <span className="text-xs">Alta</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gráfico de anillo por tipo de contenedor y barras por tipo de cliente */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tipo de Contenedor</CardTitle>
                <CardDescription>Distribución por categoría</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={tipoContenedorData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {tipoContenedorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {tipoContenedorData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="text-sm">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Operaciones por Cliente</CardTitle>
                <CardDescription>Tickets por tipo de cliente</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={tipoClienteData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="tipo" type="category" width={130} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="cantidad" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Panel Financiero - 1/3 */}
        <div className="space-y-6">
          {/* Tickets generados vs pagados */}
          <Card>
            <CardHeader>
              <CardTitle>Generados vs Pagados</CardTitle>
              <CardDescription>Últimos 30 días</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={ticketsGeneradosPagadosData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dia" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line type="monotone" dataKey="generados" stroke="#3b82f6" strokeWidth={2} name="Generados" />
                  <Line type="monotone" dataKey="pagados" stroke="#10b981" strokeWidth={2} name="Pagados" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Cartera por vencimiento */}
          <Card>
            <CardHeader>
              <CardTitle>Cartera por Vencimiento</CardTitle>
              <CardDescription>Montos pendientes</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={carteraVencimientoData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="rango" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="monto" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Ingresos por servicio */}
          <Card>
            <CardHeader>
              <CardTitle>Ingresos por Servicio</CardTitle>
              <CardDescription>Contribución al total</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={ingresosPorServicioData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {ingresosPorServicioData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {ingresosPorServicioData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }}></div>
                      <span className="text-xs">{item.name}</span>
                    </div>
                    <span className="text-xs">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Panel Comercial - Completo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ranking de clientes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Ranking de Clientes</CardTitle>
            <CardDescription>Top clientes por volumen de operaciones</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead className="text-center">Reservas</TableHead>
                    <TableHead className="text-center">No Agendadas</TableHead>
                    <TableHead className="text-center">Última Visita</TableHead>
                    <TableHead className="text-right">Ingresos</TableHead>
                    <TableHead className="text-center">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rankingClientesData.map((cliente) => (
                    <TableRow key={cliente.cliente}>
                      <TableCell>{cliente.cliente}</TableCell>
                      <TableCell className="text-center">{cliente.reservasTotales}</TableCell>
                      <TableCell className="text-center">
                        {cliente.noAgendadas > 0 ? (
                          <Badge variant="outline" className="border-orange-300 text-orange-700">
                            {cliente.noAgendadas}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">0</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center text-sm">{cliente.ultimaVisita}</TableCell>
                      <TableCell className="text-right">${cliente.ingresos.toLocaleString()}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={cliente.estadoColor}>
                          {cliente.estado === 'frecuente' && '🟢 Frecuente'}
                          {cliente.estado === 'ocasional' && '🟡 Ocasional'}
                          {cliente.estado === 'inactivo' && '🔴 Inactivo'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Zonificación y Alertas */}
        <div className="space-y-6">
          {/* Zonificación */}
          <Card>
            <CardHeader>
              <CardTitle>Ocupación por Zona</CardTitle>
              <CardDescription>Distribución en el patio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {zonificacionData.map((zona) => (
                <div key={zona.zona} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{zona.zona}</span>
                    <span className="text-xs text-gray-600">{zona.espacios}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        zona.ocupacion >= 80 ? 'bg-red-500' : 
                        zona.ocupacion >= 60 ? 'bg-yellow-500' : 
                        'bg-green-500'
                      }`}
                      style={{ width: `${zona.ocupacion}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-right text-gray-600">{zona.ocupacion}%</div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Alertas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Alertas Recientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {alertasData.map((alerta, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-lg border-l-4 ${
                        alerta.tipo === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                        alerta.tipo === 'alert' ? 'bg-red-50 border-red-500' :
                        'bg-green-50 border-green-500'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {alerta.tipo === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />}
                        {alerta.tipo === 'alert' && <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />}
                        {alerta.tipo === 'success' && <Bell className="h-4 w-4 text-green-600 mt-0.5" />}
                        <div className="flex-1">
                          <p className="text-sm">{alerta.mensaje}</p>
                          <p className="text-xs text-gray-500 mt-1">{alerta.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
