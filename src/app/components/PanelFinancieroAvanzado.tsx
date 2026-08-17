import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Calendar,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  CreditCard,
  Receipt,
  Target
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart as RechartsPie,
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

// Datos de ejemplo para flujo de caja mensual
const cashFlowData = [
  { mes: 'Ene', ingresos: 145000, egresos: 98000, flujo: 47000 },
  { mes: 'Feb', ingresos: 152000, egresos: 102000, flujo: 50000 },
  { mes: 'Mar', ingresos: 168000, egresos: 95000, flujo: 73000 },
  { mes: 'Abr', ingresos: 175000, egresos: 108000, flujo: 67000 },
  { mes: 'May', ingresos: 189000, egresos: 112000, flujo: 77000 },
  { mes: 'Jun', ingresos: 198000, egresos: 105000, flujo: 93000 },
  { mes: 'Jul', ingresos: 205000, egresos: 118000, flujo: 87000 },
  { mes: 'Ago', ingresos: 212000, egresos: 125000, flujo: 87000 },
  { mes: 'Sep', ingresos: 225000, egresos: 115000, flujo: 110000 },
  { mes: 'Oct', ingresos: 238000, egresos: 128000, flujo: 110000 },
];

// Datos de rentabilidad por línea naviera
const rentabilidadLineas = [
  { linea: 'Maersk', facturado: 485000, cobrado: 425000, pendiente: 60000 },
  { linea: 'MSC', facturado: 398000, cobrado: 365000, pendiente: 33000 },
  { linea: 'Hapag-Lloyd', facturado: 352000, cobrado: 340000, pendiente: 12000 },
  { linea: 'CMA CGM', facturado: 298000, cobrado: 275000, pendiente: 23000 },
  { linea: 'COSCO', facturado: 245000, cobrado: 230000, pendiente: 15000 },
  { linea: 'Evergreen', facturado: 212000, cobrado: 205000, pendiente: 7000 },
];

// Datos de estructura de costos
const estructuraCostos = [
  { categoria: 'Personal', valor: 285000, porcentaje: 35 },
  { categoria: 'Mantenimiento', valor: 195000, porcentaje: 24 },
  { categoria: 'Servicios', valor: 146000, porcentaje: 18 },
  { categoria: 'Equipamiento', valor: 114000, porcentaje: 14 },
  { categoria: 'Otros', valor: 73000, porcentaje: 9 },
];

// Datos de márgenes mensuales
const margenesData = [
  { mes: 'Ene', bruto: 45.2, operativo: 32.4, neto: 24.8 },
  { mes: 'Feb', bruto: 46.8, operativo: 33.1, neto: 25.5 },
  { mes: 'Mar', bruto: 48.5, operativo: 35.2, neto: 27.1 },
  { mes: 'Abr', bruto: 47.2, operativo: 34.8, neto: 26.4 },
  { mes: 'May', bruto: 49.1, operativo: 36.5, neto: 28.2 },
  { mes: 'Jun', bruto: 50.3, operativo: 37.8, neto: 29.5 },
  { mes: 'Jul', bruto: 49.8, operativo: 37.2, neto: 28.9 },
  { mes: 'Ago', bruto: 51.2, operativo: 38.5, neto: 30.1 },
  { mes: 'Sep', bruto: 52.5, operativo: 39.8, neto: 31.4 },
  { mes: 'Oct', bruto: 53.1, operativo: 40.2, neto: 31.8 },
];

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

export function PanelFinancieroAvanzado() {
  const [selectedPeriod, setSelectedPeriod] = useState('mensual');

  // Calcular totales
  const totalIngresos = cashFlowData.reduce((sum, item) => sum + item.ingresos, 0);
  const totalEgresos = cashFlowData.reduce((sum, item) => sum + item.egresos, 0);
  const totalFlujo = totalIngresos - totalEgresos;
  const margenPromedio = ((totalFlujo / totalIngresos) * 100).toFixed(1);

  const totalFacturado = rentabilidadLineas.reduce((sum, item) => sum + item.facturado, 0);
  const totalCobrado = rentabilidadLineas.reduce((sum, item) => sum + item.cobrado, 0);
  const totalPendiente = totalFacturado - totalCobrado;
  const tasaCobranza = ((totalCobrado / totalFacturado) * 100).toFixed(1);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">Panel Financiero Avanzado</h1>
          <p className="text-muted-foreground">
            Análisis detallado de flujo de caja, rentabilidad y estructura de costos
          </p>
        </div>
        <div className="flex gap-2">
          <select 
            className="px-4 py-2 border rounded-lg bg-white"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="mensual">Vista Mensual</option>
            <option value="trimestral">Vista Trimestral</option>
            <option value="anual">Vista Anual</option>
          </select>
        </div>
      </div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">${(totalIngresos / 1000).toFixed(0)}K</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>+12.5% vs período anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Egresos Totales</CardTitle>
            <Receipt className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">${(totalEgresos / 1000).toFixed(0)}K</div>
            <div className="flex items-center text-xs text-orange-600 mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>+8.2% vs período anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Flujo Neto</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">${(totalFlujo / 1000).toFixed(0)}K</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>+18.3% vs período anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Margen Promedio</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{margenPromedio}%</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>+2.1 pp vs período anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs para diferentes vistas */}
      <Tabs defaultValue="flujo-caja" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="flujo-caja">Flujo de Caja</TabsTrigger>
          <TabsTrigger value="rentabilidad">Rentabilidad</TabsTrigger>
          <TabsTrigger value="costos">Estructura de Costos</TabsTrigger>
          <TabsTrigger value="margenes">Márgenes</TabsTrigger>
        </TabsList>

        {/* Tab: Flujo de Caja */}
        <TabsContent value="flujo-caja" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Flujo de Caja Mensual</CardTitle>
              <CardDescription>
                Evolución de ingresos, egresos y flujo neto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="ingresos" 
                    stackId="1"
                    stroke="#10b981" 
                    fill="#10b981" 
                    fillOpacity={0.6}
                    name="Ingresos"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="egresos" 
                    stackId="2"
                    stroke="#ef4444" 
                    fill="#ef4444" 
                    fillOpacity={0.6}
                    name="Egresos"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Flujo Neto Acumulado</CardTitle>
              <CardDescription>
                Tendencia del flujo neto mes a mes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="flujo" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    name="Flujo Neto"
                    dot={{ fill: '#3b82f6', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Rentabilidad */}
        <TabsContent value="rentabilidad" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Total Facturado</CardTitle>
                <Wallet className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">${(totalFacturado / 1000).toFixed(0)}K</div>
                <p className="text-xs text-muted-foreground mt-1">Último período</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Total Cobrado</CardTitle>
                <CreditCard className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">${(totalCobrado / 1000).toFixed(0)}K</div>
                <p className="text-xs text-muted-foreground mt-1">Tasa: {tasaCobranza}%</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Pendiente de Cobro</CardTitle>
                <Receipt className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">${(totalPendiente / 1000).toFixed(0)}K</div>
                <p className="text-xs text-muted-foreground mt-1">{((totalPendiente / totalFacturado) * 100).toFixed(1)}% del total</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Rentabilidad por Línea Naviera</CardTitle>
              <CardDescription>
                Facturado, cobrado y pendiente por cada línea
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={rentabilidadLineas}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="linea" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="facturado" fill="#3b82f6" name="Facturado" />
                  <Bar dataKey="cobrado" fill="#10b981" name="Cobrado" />
                  <Bar dataKey="pendiente" fill="#f59e0b" name="Pendiente" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {rentabilidadLineas.map((linea) => {
              const tasaCobro = ((linea.cobrado / linea.facturado) * 100).toFixed(1);
              return (
                <Card key={linea.linea}>
                  <CardHeader>
                    <CardTitle className="text-base">{linea.linea}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Facturado:</span>
                      <span className="text-sm">${linea.facturado.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Cobrado:</span>
                      <span className="text-sm text-green-600">${linea.cobrado.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Pendiente:</span>
                      <span className="text-sm text-orange-600">${linea.pendiente.toLocaleString()}</span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between">
                        <span className="text-sm">Tasa de Cobranza:</span>
                        <span className={`text-sm ${parseFloat(tasaCobro) >= 90 ? 'text-green-600' : 'text-orange-600'}`}>
                          {tasaCobro}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className={`h-2 rounded-full ${parseFloat(tasaCobro) >= 90 ? 'bg-green-600' : 'bg-orange-600'}`}
                          style={{ width: `${tasaCobro}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Tab: Estructura de Costos */}
        <TabsContent value="costos" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Costos</CardTitle>
                <CardDescription>
                  Estructura porcentual de costos operativos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <RechartsPie>
                    <Pie
                      data={estructuraCostos}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ categoria, porcentaje }) => `${categoria} ${porcentaje}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="valor"
                    >
                      {estructuraCostos.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                  </RechartsPie>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detalle de Costos</CardTitle>
                <CardDescription>
                  Valores absolutos por categoría
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {estructuraCostos.map((item, index) => (
                    <div key={item.categoria} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="text-sm">{item.categoria}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm">${item.valor.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">{item.porcentaje}%</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full"
                          style={{ 
                            width: `${item.porcentaje}%`,
                            backgroundColor: COLORS[index % COLORS.length]
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t">
                    <div className="flex justify-between">
                      <span>Total Costos:</span>
                      <span className="font-semibold">
                        ${estructuraCostos.reduce((sum, item) => sum + item.valor, 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Costos por Categoría</CardTitle>
              <CardDescription>
                Comparativa de costos operativos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={estructuraCostos} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="categoria" type="category" width={120} />
                  <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                  <Bar dataKey="valor" fill="#3b82f6">
                    {estructuraCostos.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Márgenes */}
        <TabsContent value="margenes" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Margen Bruto</CardTitle>
                <BarChart3 className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">49.2%</div>
                <p className="text-xs text-green-600 mt-1">+1.8 pp vs período anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Margen Operativo</CardTitle>
                <PieChart className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">36.8%</div>
                <p className="text-xs text-green-600 mt-1">+2.1 pp vs período anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Margen Neto</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">28.5%</div>
                <p className="text-xs text-green-600 mt-1">+1.5 pp vs período anterior</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Evolución de Márgenes</CardTitle>
              <CardDescription>
                Tendencia mensual de márgenes bruto, operativo y neto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={margenesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `${value}%`} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="bruto" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Margen Bruto"
                    dot={{ fill: '#3b82f6' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="operativo" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Margen Operativo"
                    dot={{ fill: '#10b981' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="neto" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    name="Margen Neto"
                    dot={{ fill: '#8b5cf6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Análisis de Rentabilidad</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">ROI (Return on Investment)</span>
                    <span className="text-sm">34.2%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '34.2%' }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">ROE (Return on Equity)</span>
                    <span className="text-sm">28.7%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '28.7%' }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">EBITDA Margin</span>
                    <span className="text-sm">42.5%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '42.5%' }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Operating Cash Flow Ratio</span>
                    <span className="text-sm">1.85</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{ width: '92.5%' }} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Indicadores Clave</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Break-Even Point</p>
                    <p className="text-lg">$156K/mes</p>
                  </div>
                  <TrendingDown className="h-5 w-5 text-blue-600" />
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Días de Caja</p>
                    <p className="text-lg">45 días</p>
                  </div>
                  <Wallet className="h-5 w-5 text-green-600" />
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Ciclo de Conversión</p>
                    <p className="text-lg">32 días</p>
                  </div>
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>

                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Liquidez Corriente</p>
                    <p className="text-lg">2.4x</p>
                  </div>
                  <CreditCard className="h-5 w-5 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
