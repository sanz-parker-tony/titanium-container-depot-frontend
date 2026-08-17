import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  Download,
  Filter,
  Calendar,
  Users,
  CreditCard,
  Wallet,
  PieChart,
  BarChart3
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';

interface Cliente {
  nombre: string;
  saldoCorriente: number;
  saldoVencido: number;
  diasPromedio: number;
  movimientosMes: number;
}

const mockClientes: Cliente[] = [
  { nombre: 'Empresa ABC S.A.', saldoCorriente: 2500.00, saldoVencido: 0, diasPromedio: 15, movimientosMes: 45 },
  { nombre: 'Comercial XYZ Ltda.', saldoCorriente: 1200.00, saldoVencido: 850.00, diasPromedio: 45, movimientosMes: 28 },
  { nombre: 'Logística 123 S.A.', saldoCorriente: 3800.00, saldoVencido: 0, diasPromedio: 10, movimientosMes: 62 },
  { nombre: 'TransOcean Inc.', saldoCorriente: 600.00, saldoVencido: 1200.00, diasPromedio: 78, movimientosMes: 15 },
  { nombre: 'Global Shipping S.A.', saldoCorriente: 2800.00, saldoVencido: 0, diasPromedio: 20, movimientosMes: 38 }
];

export function EstadoCuentas() {
  const [periodo, setPeriodo] = useState('mes-actual');
  const [clientes] = useState<Cliente[]>(mockClientes);

  // Datos financieros
  const ingresosTotales = 127450.00;
  const gastosTotales = 45320.00;
  const margenOperativo = ingresosTotales - gastosTotales;
  const ebitda = 75840.00;
  const carteraCorriente = clientes.reduce((sum, c) => sum + c.saldoCorriente, 0);
  const carteraVencida = clientes.reduce((sum, c) => sum + c.saldoVencido, 0);
  const totalCartera = carteraCorriente + carteraVencida;

  // Desglose de ingresos
  const ingresosPorTipo = {
    turnos: 85600.00,
    almacenaje: 28450.00,
    serviciosAdicionales: 13400.00
  };

  // Desglose de gastos
  const gastosPorCategoria = {
    mantenimiento: 12800.00,
    personal: 24500.00,
    servicios: 5600.00,
    combustible: 2420.00
  };

  const margenPorcentaje = ((margenOperativo / ingresosTotales) * 100).toFixed(1);
  const morosidadPorcentaje = ((carteraVencida / totalCartera) * 100).toFixed(1);

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl mb-2">📊 Estado de Cuentas</h1>
        <p className="text-gray-600">Monitoreo de salud financiera: ingresos, gastos, cartera y flujo de caja</p>
      </div>

      {/* Controles de período */}
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
                  <SelectItem value="hoy">Hoy</SelectItem>
                  <SelectItem value="semana-actual">Semana Actual</SelectItem>
                  <SelectItem value="mes-actual">Mes Actual</SelectItem>
                  <SelectItem value="trimestre">Trimestre</SelectItem>
                  <SelectItem value="año">Año</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtros Avanzados
              </Button>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Exportar Reporte
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumen Financiero Principal */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-2 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Ingresos Totales</p>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl text-green-600 mb-1">${ingresosTotales.toLocaleString()}</p>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span>+12.5% vs período anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Gastos Totales</p>
              <TrendingDown className="h-5 w-5 text-red-500" />
            </div>
            <p className="text-2xl text-red-600 mb-1">${gastosTotales.toLocaleString()}</p>
            <div className="flex items-center gap-1 text-xs text-red-600">
              <TrendingUp className="h-3 w-3" />
              <span>+5.2% vs período anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Margen Operativo</p>
              <DollarSign className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-2xl text-blue-600 mb-1">${margenOperativo.toLocaleString()}</p>
            <div className="flex items-center gap-1 text-xs text-blue-600">
              <span>{margenPorcentaje}% de margen</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">EBITDA</p>
              <BarChart3 className="h-5 w-5 text-purple-500" />
            </div>
            <p className="text-2xl text-purple-600 mb-1">${ebitda.toLocaleString()}</p>
            <div className="flex items-center gap-1 text-xs text-purple-600">
              <TrendingUp className="h-3 w-3" />
              <span>+18.3% vs período anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="resumen" className="space-y-6">
        <TabsList>
          <TabsTrigger value="resumen">Resumen Ejecutivo</TabsTrigger>
          <TabsTrigger value="cartera">Cartera de Clientes</TabsTrigger>
          <TabsTrigger value="ingresos">Ingresos Detallados</TabsTrigger>
          <TabsTrigger value="gastos">Gastos Operativos</TabsTrigger>
        </TabsList>

        <TabsContent value="resumen">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Distribución de Ingresos */}
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Ingresos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Turnos Programados</span>
                      <span className="text-sm">${ingresosPorTipo.turnos.toLocaleString()}</span>
                    </div>
                    <Progress value={(ingresosPorTipo.turnos / ingresosTotales) * 100} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">
                      {((ingresosPorTipo.turnos / ingresosTotales) * 100).toFixed(1)}% del total
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Almacenaje</span>
                      <span className="text-sm">${ingresosPorTipo.almacenaje.toLocaleString()}</span>
                    </div>
                    <Progress value={(ingresosPorTipo.almacenaje / ingresosTotales) * 100} className="h-2 [&>div]:bg-blue-500" />
                    <p className="text-xs text-gray-500 mt-1">
                      {((ingresosPorTipo.almacenaje / ingresosTotales) * 100).toFixed(1)}% del total
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Servicios Adicionales</span>
                      <span className="text-sm">${ingresosPorTipo.serviciosAdicionales.toLocaleString()}</span>
                    </div>
                    <Progress value={(ingresosPorTipo.serviciosAdicionales / ingresosTotales) * 100} className="h-2 [&>div]:bg-purple-500" />
                    <p className="text-xs text-gray-500 mt-1">
                      {((ingresosPorTipo.serviciosAdicionales / ingresosTotales) * 100).toFixed(1)}% del total
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Distribución de Gastos */}
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Gastos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Personal</span>
                      <span className="text-sm">${gastosPorCategoria.personal.toLocaleString()}</span>
                    </div>
                    <Progress value={(gastosPorCategoria.personal / gastosTotales) * 100} className="h-2 [&>div]:bg-red-500" />
                    <p className="text-xs text-gray-500 mt-1">
                      {((gastosPorCategoria.personal / gastosTotales) * 100).toFixed(1)}% del total
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Mantenimiento</span>
                      <span className="text-sm">${gastosPorCategoria.mantenimiento.toLocaleString()}</span>
                    </div>
                    <Progress value={(gastosPorCategoria.mantenimiento / gastosTotales) * 100} className="h-2 [&>div]:bg-orange-500" />
                    <p className="text-xs text-gray-500 mt-1">
                      {((gastosPorCategoria.mantenimiento / gastosTotales) * 100).toFixed(1)}% del total
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Servicios</span>
                      <span className="text-sm">${gastosPorCategoria.servicios.toLocaleString()}</span>
                    </div>
                    <Progress value={(gastosPorCategoria.servicios / gastosTotales) * 100} className="h-2 [&>div]:bg-yellow-500" />
                    <p className="text-xs text-gray-500 mt-1">
                      {((gastosPorCategoria.servicios / gastosTotales) * 100).toFixed(1)}% del total
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Combustible</span>
                      <span className="text-sm">${gastosPorCategoria.combustible.toLocaleString()}</span>
                    </div>
                    <Progress value={(gastosPorCategoria.combustible / gastosTotales) * 100} className="h-2 [&>div]:bg-gray-500" />
                    <p className="text-xs text-gray-500 mt-1">
                      {((gastosPorCategoria.combustible / gastosTotales) * 100).toFixed(1)}% del total
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Flujo de Caja */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Flujo de Caja Mensual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-around gap-2">
                {[
                  { mes: 'Ene', ingreso: 95000, egreso: 42000 },
                  { mes: 'Feb', ingreso: 102000, egreso: 38000 },
                  { mes: 'Mar', ingreso: 118000, egreso: 45000 },
                  { mes: 'Abr', ingreso: 112000, egreso: 41000 },
                  { mes: 'May', ingreso: 125000, egreso: 44000 },
                  { mes: 'Jun', ingreso: 127450, egreso: 45320 }
                ].map((data, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex gap-1 items-end" style={{ height: '200px' }}>
                      <div 
                        className="flex-1 bg-green-500 rounded-t"
                        style={{ height: `${(data.ingreso / 130000) * 100}%` }}
                        title={`Ingresos: $${data.ingreso.toLocaleString()}`}
                      />
                      <div 
                        className="flex-1 bg-red-500 rounded-t"
                        style={{ height: `${(data.egreso / 130000) * 100}%` }}
                        title={`Egresos: $${data.egreso.toLocaleString()}`}
                      />
                    </div>
                    <span className="text-xs text-gray-600">{data.mes}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm">Ingresos</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm">Egresos</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cartera">
          <div className="space-y-6">
            {/* Resumen de Cartera */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600">Cartera Total</p>
                    <Wallet className="h-5 w-5 text-blue-500" />
                  </div>
                  <p className="text-2xl mb-1">${totalCartera.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{clientes.length} clientes activos</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600">Cartera Corriente</p>
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="text-2xl text-green-600 mb-1">${carteraCorriente.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">
                    {((carteraCorriente / totalCartera) * 100).toFixed(1)}% del total
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-red-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600">Cartera Vencida</p>
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                  <p className="text-2xl text-red-600 mb-1">${carteraVencida.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">
                    {morosidadPorcentaje}% morosidad
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Detalle por Cliente */}
            <Card>
              <CardHeader>
                <CardTitle>Ranking de Clientes por Cartera</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {clientes
                    .sort((a, b) => (b.saldoCorriente + b.saldoVencido) - (a.saldoCorriente + a.saldoVencido))
                    .map((cliente, idx) => {
                      const saldoTotal = cliente.saldoCorriente + cliente.saldoVencido;
                      const tieneMorosidad = cliente.saldoVencido > 0;
                      
                      return (
                        <div key={idx} className="border rounded-lg p-4 bg-white">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">#{idx + 1}</span>
                              <h4 className="">{cliente.nombre}</h4>
                              {tieneMorosidad && (
                                <Badge className="bg-red-100 text-red-800 border border-red-300">
                                  Morosidad
                                </Badge>
                              )}
                            </div>
                            <p className="text-xl">${saldoTotal.toLocaleString()}</p>
                          </div>
                          
                          <div className="grid grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                              <p className="text-xs text-gray-500">Corriente</p>
                              <p className="text-green-600">${cliente.saldoCorriente.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Vencido</p>
                              <p className={cliente.saldoVencido > 0 ? 'text-red-600' : ''}>
                                ${cliente.saldoVencido.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Días Promedio</p>
                              <p className={cliente.diasPromedio > 45 ? 'text-red-600' : ''}>
                                {cliente.diasPromedio} días
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Movimientos/Mes</p>
                              <p>{cliente.movimientosMes}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ingresos">
          <Card>
            <CardHeader>
              <CardTitle>Análisis Detallado de Ingresos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-center py-8">
                Módulo de análisis detallado de ingresos por tipo de servicio, cliente y período
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gastos">
          <Card>
            <CardHeader>
              <CardTitle>Análisis Detallado de Gastos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-center py-8">
                Módulo de análisis detallado de gastos operativos por categoría y centro de costo
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
