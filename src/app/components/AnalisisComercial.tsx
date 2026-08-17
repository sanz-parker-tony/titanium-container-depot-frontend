import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Users, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Package,
  Download,
  Target,
  Award,
  AlertCircle
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface Cliente {
  nombre: string;
  facturacion: number;
  movimientos: number;
  participacion: number;
  crecimiento: string;
  valor: 'Alto' | 'Medio' | 'Bajo';
  ultimoMov: string;
}

const mockClientes: Cliente[] = [
  { nombre: 'Logística 123 S.A.', facturacion: 28500, movimientos: 620, participacion: 22.3, crecimiento: '+18%', valor: 'Alto', ultimoMov: '2025-10-16' },
  { nombre: 'Empresa ABC S.A.', facturacion: 24800, movimientos: 540, participacion: 19.4, crecimiento: '+12%', valor: 'Alto', ultimoMov: '2025-10-16' },
  { nombre: 'Global Shipping S.A.', facturacion: 19200, movimientos: 450, participacion: 15.0, crecimiento: '+8%', valor: 'Alto', ultimoMov: '2025-10-15' },
  { nombre: 'Comercial XYZ Ltda.', facturacion: 15600, movimientos: 310, participacion: 12.2, crecimiento: '+5%', valor: 'Medio', ultimoMov: '2025-10-14' },
  { nombre: 'Maritime Express Co.', facturacion: 12400, movimientos: 280, participacion: 9.7, crecimiento: '-3%', valor: 'Medio', ultimoMov: '2025-10-13' },
  { nombre: 'TransOcean Inc.', facturacion: 8900, movimientos: 180, participacion: 7.0, crecimiento: '-8%', valor: 'Bajo', ultimoMov: '2025-10-10' }
];

const tiposCliente = [
  { tipo: 'Importador', cantidad: 45, facturacion: 52300, porcentaje: 41 },
  { tipo: 'Exportador', cantidad: 38, facturacion: 38200, porcentaje: 30 },
  { tipo: 'Transportista', cantidad: 28, facturacion: 24100, porcentaje: 19 },
  { tipo: 'Agente', cantidad: 15, facturacion: 12800, porcentaje: 10 }
];

export function AnalisisComercial() {
  const [periodo, setPeriodo] = useState('mes-actual');

  const totalFacturacion = mockClientes.reduce((sum, c) => sum + c.facturacion, 0);
  const clientesActivos = mockClientes.length;
  const facturacionPromedio = totalFacturacion / clientesActivos;
  
  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl mb-2">💹 Análisis Comercial</h1>
        <p className="text-gray-600">Evaluación de rendimiento comercial y comportamiento de clientes</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-2 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Facturación Total</p>
              <DollarSign className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-2xl text-blue-600">${totalFacturacion.toLocaleString()}</p>
            <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>+11.2% vs período anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Clientes Activos</p>
              <Users className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl">{clientesActivos}</p>
            <p className="text-xs text-gray-500 mt-1">últimos 30 días</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Ticket Promedio</p>
              <Target className="h-5 w-5 text-purple-500" />
            </div>
            <p className="text-2xl">${facturacionPromedio.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            <p className="text-xs text-gray-500 mt-1">por cliente/mes</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Clientes Top 3</p>
              <Award className="h-5 w-5 text-yellow-500" />
            </div>
            <p className="text-2xl text-green-600">56.7%</p>
            <p className="text-xs text-gray-500 mt-1">de la facturación</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="ranking" className="space-y-6">
        <TabsList>
          <TabsTrigger value="ranking">Ranking de Clientes</TabsTrigger>
          <TabsTrigger value="pareto">Análisis Pareto</TabsTrigger>
          <TabsTrigger value="segmentacion">Segmentación</TabsTrigger>
          <TabsTrigger value="inactivos">Clientes Inactivos</TabsTrigger>
        </TabsList>

        <TabsContent value="ranking">
          <Card>
            <CardHeader>
              <CardTitle>Top Clientes por Facturación</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockClientes.map((cliente, idx) => (
                  <div key={idx} className="border rounded-lg p-4 bg-white">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center text-white
                          ${idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-orange-400' : 'bg-gray-300'}
                        `}>
                          {idx + 1}
                        </div>
                        <div>
                          <h4 className="">{cliente.nombre}</h4>
                          <p className="text-sm text-gray-600">{cliente.movimientos} movimientos</p>
                        </div>
                        <Badge className={
                          cliente.valor === 'Alto' ? 'bg-green-100 text-green-800' :
                          cliente.valor === 'Medio' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {cliente.valor} Valor
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl">${cliente.facturacion.toLocaleString()}</p>
                        <div className={`text-sm flex items-center gap-1 justify-end ${cliente.crecimiento.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {cliente.crecimiento.startsWith('+') ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                          {cliente.crecimiento}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Participación</p>
                        <p className="">{cliente.participacion}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Último Movimiento</p>
                        <p>{new Date(cliente.ultimoMov).toLocaleDateString('es-ES')}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Ticket Promedio</p>
                        <p>${(cliente.facturacion / cliente.movimientos).toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <Progress value={cliente.participacion} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pareto">
          <Card>
            <CardHeader>
              <CardTitle>Análisis Pareto 80/20</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Target className="h-8 w-8 text-blue-600 mt-1" />
                    <div>
                      <h4 className="mb-2">Concentración de Ingresos</h4>
                      <p className="text-sm text-gray-700 mb-3">
                        Los <strong>3 principales clientes</strong> (50% del total) generan el <strong>56.7%</strong> de la facturación total.
                      </p>
                      <p className="text-sm text-gray-700">
                        El <strong>20%</strong> de clientes más valiosos (primeros 6) concentran el <strong>85.6%</strong> de los ingresos.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {mockClientes.map((cliente, idx) => {
                  const acumulado = mockClientes.slice(0, idx + 1).reduce((sum, c) => sum + c.participacion, 0);
                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-32 text-sm">{cliente.nombre.split(' ')[0]}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                            <div 
                              className={`h-6 rounded-full ${idx < 3 ? 'bg-green-500' : idx < 6 ? 'bg-yellow-500' : 'bg-gray-400'}`}
                              style={{ width: `${cliente.participacion}%` }}
                            />
                          </div>
                          <span className="text-sm w-16">{cliente.participacion}%</span>
                        </div>
                      </div>
                      <div className="w-32 text-right text-sm text-gray-600">
                        Acum: {acumulado.toFixed(1)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segmentacion">
          <Card>
            <CardHeader>
              <CardTitle>Distribución por Tipo de Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tiposCliente.map((tipo, idx) => (
                  <div key={idx} className="border rounded-lg p-4 bg-white">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Package className="h-8 w-8 text-blue-500" />
                        <div>
                          <h4 className="text-lg">{tipo.tipo}</h4>
                          <p className="text-sm text-gray-600">{tipo.cantidad} clientes</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl">${tipo.facturacion.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">{tipo.porcentaje}%</p>
                      </div>
                    </div>
                    <Progress value={tipo.porcentaje} className="h-3" />
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="mb-2">Insights Estratégicos</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600">•</span>
                    <span>Importadores lideran con 41% de facturación - Mantener foco en este segmento</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600">•</span>
                    <span>Agentes representan solo 10% - Oportunidad de crecimiento mediante alianzas</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inactivos">
          <Card>
            <CardHeader>
              <CardTitle>Clientes Inactivos - Últimos 30+ Días</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { nombre: 'Pacific Cargo Ltd.', ultimoMov: '2025-08-15', diasInactivo: 62, facturacionHistorica: 8400 },
                  { nombre: 'Naviera del Sur S.A.', ultimoMov: '2025-09-01', diasInactivo: 45, facturacionHistorica: 12300 },
                  { nombre: 'Container Express Inc.', ultimoMov: '2025-09-10', diasInactivo: 36, facturacionHistorica: 6800 }
                ].map((cliente, idx) => (
                  <div key={idx} className="border rounded-lg p-4 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="h-6 w-6 text-orange-500" />
                        <div>
                          <h4 className="">{cliente.nombre}</h4>
                          <p className="text-sm text-gray-600">Inactivo {cliente.diasInactivo} días</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Facturación histórica</p>
                        <p className="text-lg">${cliente.facturacionHistorica.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="outline">Enviar Campaña</Button>
                      <Button size="sm" variant="outline">Ver Historial</Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="mb-2">Plan de Recuperación</h4>
                <p className="text-sm text-gray-700">
                  3 clientes inactivos con potencial de $27,500 mensuales. 
                  Recomendación: campaña de reactivación con descuento 15% en primera reserva.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
