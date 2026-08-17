import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Clock,
  Package,
  BarChart3,
  Download,
  Filter,
  Sun,
  Moon
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function TendenciasDemanda() {
  const [periodo, setPeriodo] = useState('mes-actual');
  const [tipoAnalisis, setTipoAnalisis] = useState('horario');

  // Datos de movimientos por hora (promedio)
  const movimientosPorHora = [
    { hora: '08:00', movimientos: 8, color: 'bg-yellow-400' },
    { hora: '09:00', movimientos: 12, color: 'bg-orange-400' },
    { hora: '10:00', movimientos: 15, color: 'bg-red-400' },
    { hora: '11:00', movimientos: 14, color: 'bg-orange-400' },
    { hora: '12:00', movimientos: 10, color: 'bg-yellow-400' },
    { hora: '13:00', movimientos: 8, color: 'bg-yellow-400' },
    { hora: '14:00', movimientos: 13, color: 'bg-orange-400' },
    { hora: '15:00', movimientos: 16, color: 'bg-red-400' },
    { hora: '16:00', movimientos: 14, color: 'bg-orange-400' },
    { hora: '17:00', movimientos: 11, color: 'bg-yellow-400' },
    { hora: '18:00', movimientos: 7, color: 'bg-green-400' },
    { hora: '19:00', movimientos: 5, color: 'bg-green-400' },
    { hora: '20:00', movimientos: 3, color: 'bg-blue-400' },
    { hora: '21:00', movimientos: 2, color: 'bg-blue-400' },
    { hora: '22:00', movimientos: 2, color: 'bg-blue-400' },
    { hora: '23:00', movimientos: 1, color: 'bg-blue-400' }
  ];

  // Datos por día de la semana
  const movimientosPorDia = [
    { dia: 'Lunes', movimientos: 145, ocupacion: 88 },
    { dia: 'Martes', movimientos: 152, ocupacion: 92 },
    { dia: 'Miércoles', movimientos: 138, ocupacion: 84 },
    { dia: 'Jueves', movimientos: 148, ocupacion: 90 },
    { dia: 'Viernes', movimientos: 142, ocupacion: 86 },
    { dia: 'Sábado', movimientos: 78, ocupacion: 47 },
    { dia: 'Domingo', movimientos: 45, ocupacion: 27 }
  ];

  // Tipos de contenedor más demandados
  const contenedoresDemanda = [
    { tipo: '20DC', cantidad: 3250, porcentaje: 35, tendencia: '+12%' },
    { tipo: '40DC', cantidad: 2840, porcentaje: 31, tendencia: '+8%' },
    { tipo: '40HC', cantidad: 2180, porcentaje: 24, tendencia: '+15%' },
    { tipo: 'Refrigerado', cantidad: 920, porcentaje: 10, tendencia: '+22%' }
  ];

  const maxMovimientos = Math.max(...movimientosPorHora.map(m => m.movimientos));
  const maxMovimientosDia = Math.max(...movimientosPorDia.map(m => m.movimientos));

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl mb-2">📈 Tendencias y Demanda</h1>
        <p className="text-gray-600">Análisis histórico y proyectado de movimientos, horarios y ocupación del patio</p>
      </div>

      {/* Controles */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="periodo">Período de Análisis</Label>
              <Select value={periodo} onValueChange={setPeriodo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semana-actual">Semana Actual</SelectItem>
                  <SelectItem value="mes-actual">Mes Actual</SelectItem>
                  <SelectItem value="trimestre">Trimestre</SelectItem>
                  <SelectItem value="año">Año</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label htmlFor="tipoAnalisis">Tipo de Análisis</Label>
              <Select value={tipoAnalisis} onValueChange={setTipoAnalisis}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="horario">Por Horario</SelectItem>
                  <SelectItem value="dia">Por Día</SelectItem>
                  <SelectItem value="contenedor">Por Contenedor</SelectItem>
                  <SelectItem value="cliente">Por Cliente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Indicadores Clave */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Mov. Promedio/Día</p>
              <BarChart3 className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-2xl mb-1">121</p>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span>+8.5% vs mes anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Ocupación Promedio</p>
              <Package className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl mb-1">73%</p>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span>+4.2% vs mes anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Horario Pico</p>
              <Sun className="h-5 w-5 text-orange-500" />
            </div>
            <p className="text-2xl mb-1">15:00</p>
            <p className="text-xs text-gray-500">16 movimientos promedio</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Horario Valle</p>
              <Moon className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-2xl mb-1">21:00</p>
            <p className="text-xs text-gray-500">2 movimientos promedio</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="horario" className="space-y-6">
        <TabsList>
          <TabsTrigger value="horario">Análisis por Horario</TabsTrigger>
          <TabsTrigger value="semanal">Análisis Semanal</TabsTrigger>
          <TabsTrigger value="contenedores">Tipos de Contenedor</TabsTrigger>
          <TabsTrigger value="prediccion">Predicción</TabsTrigger>
        </TabsList>

        <TabsContent value="horario">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Mapa de Calor - Movimientos por Hora</CardTitle>
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-400 rounded"></div>
                    <span>Valle</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                    <span>Normal</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-orange-400 rounded"></div>
                    <span>Alto</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-400 rounded"></div>
                    <span>Pico</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Gráfico de barras por hora */}
              <div className="space-y-3">
                {movimientosPorHora.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-16 text-sm text-gray-600 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.hora}
                    </div>
                    <div className="flex-1 bg-gray-100 rounded-full h-8 relative">
                      <div 
                        className={`${item.color} h-8 rounded-full flex items-center justify-end px-3 transition-all`}
                        style={{ width: `${(item.movimientos / maxMovimientos) * 100}%` }}
                      >
                        <span className="text-sm text-white">{item.movimientos}</span>
                      </div>
                    </div>
                    <div className="w-24 text-sm text-gray-600">
                      {item.movimientos >= 13 ? 'Horario Pico' : item.movimientos <= 5 ? 'Horario Valle' : 'Normal'}
                    </div>
                  </div>
                ))}
              </div>

              {/* Recomendaciones */}
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="mb-2 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Oportunidades Detectadas
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Horarios 20:00-23:45 con baja ocupación (promedio 2 movimientos/hora) - Oportunidad para promociones con descuento del 20-25%</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Horarios pico 15:00-16:00 con alta demanda - Considerar ajuste de tarifas (+15-20%)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Redistribuir demanda de 10:00 hacia horarios de menor ocupación mediante incentivos selectivos</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="semanal">
          <Card>
            <CardHeader>
              <CardTitle>Análisis Semanal - Movimientos y Ocupación</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {movimientosPorDia.map((dia, idx) => (
                  <div key={idx} className="border rounded-lg p-4 bg-white">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-500" />
                        <h4 className="">{dia.dia}</h4>
                        {dia.ocupacion >= 85 && (
                          <Badge className="bg-red-100 text-red-800 border border-red-300">
                            Alta Ocupación
                          </Badge>
                        )}
                        {dia.ocupacion < 50 && (
                          <Badge className="bg-green-100 text-green-800 border border-green-300">
                            Baja Ocupación
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl">{dia.movimientos}</p>
                        <p className="text-xs text-gray-500">movimientos</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Movimientos</p>
                        <div className="bg-gray-100 rounded-full h-6 relative overflow-hidden">
                          <div 
                            className="bg-blue-500 h-6 rounded-full"
                            style={{ width: `${(dia.movimientos / maxMovimientosDia) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Ocupación: {dia.ocupacion}%</p>
                        <div className="bg-gray-100 rounded-full h-6 relative overflow-hidden">
                          <div 
                            className={`h-6 rounded-full ${
                              dia.ocupacion >= 85 ? 'bg-red-500' : 
                              dia.ocupacion >= 70 ? 'bg-yellow-500' : 
                              'bg-green-500'
                            }`}
                            style={{ width: `${dia.ocupacion}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Insights */}
              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="mb-2 flex items-center gap-2">
                  <Sun className="h-5 w-5 text-yellow-600" />
                  Análisis Semanal
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">•</span>
                    <span>Fin de semana con ocupación 40% menor - Oportunidad para promociones dirigidas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">•</span>
                    <span>Martes día de mayor actividad (152 movimientos) - Asegurar disponibilidad de equipos y personal</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contenedores">
          <Card>
            <CardHeader>
              <CardTitle>Demanda por Tipo de Contenedor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contenedoresDemanda.map((cont, idx) => (
                  <div key={idx} className="border rounded-lg p-4 bg-white">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Package className="h-8 w-8 text-blue-500" />
                        <div>
                          <h4 className="text-lg">Contenedor {cont.tipo}</h4>
                          <p className="text-sm text-gray-600">{cont.cantidad.toLocaleString()} movimientos/mes</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl">{cont.porcentaje}%</p>
                        <div className="flex items-center gap-1 text-sm text-green-600">
                          <TrendingUp className="h-4 w-4" />
                          {cont.tendencia}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-100 rounded-full h-4 relative overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-4 rounded-full"
                        style={{ width: `${cont.porcentaje}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Análisis */}
              <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="mb-2">Insights de Rentabilidad</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600">•</span>
                    <span>Contenedores refrigerados: Mayor crecimiento (+22%) y tarifa premium - Expandir capacidad</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600">•</span>
                    <span>40HC en tendencia alcista - Considerar optimización de espacios para este tipo</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prediccion">
          <Card>
            <CardHeader>
              <CardTitle>Predicción de Demanda - Próximos 30 Días</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-around gap-1">
                {Array.from({ length: 30 }, (_, i) => {
                  const base = 120;
                  const variation = Math.sin(i / 5) * 20 + Math.random() * 10;
                  const value = base + variation;
                  return (
                    <div 
                      key={i}
                      className="flex-1 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t hover:from-blue-600 hover:to-blue-400 transition-colors cursor-pointer"
                      style={{ height: `${(value / 150) * 100}%` }}
                      title={`Día ${i + 1}: ${Math.round(value)} movimientos estimados`}
                    />
                  );
                })}
              </div>
              <div className="text-center mt-4 text-sm text-gray-600">
                Próximos 30 días (basado en histórico y estacionalidad)
              </div>

              <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <h4 className="mb-2">Proyección Estimada</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Promedio Diario</p>
                    <p className="text-xl">125 mov.</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Mes</p>
                    <p className="text-xl">3,750 mov.</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Ingresos Est.</p>
                    <p className="text-xl">$135,000</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
