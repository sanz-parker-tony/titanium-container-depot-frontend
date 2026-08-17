import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  Settings, 
  DollarSign, 
  Edit,
  Save,
  X,
  Plus,
  Clock,
  Calendar,
  TrendingUp,
  History,
  Tag,
  CheckCircle2
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';

interface Tarifa {
  id: string;
  tipo: string;
  descripcion: string;
  montoBase: number;
  horarioPico: number;
  horarioValle: number;
  finSemana: number;
  activa: boolean;
  fechaVigencia: string;
}

interface Promocion {
  id: string;
  nombre: string;
  descuento: number;
  tipo: 'porcentaje' | 'monto';
  condicion: string;
  fechaInicio: string;
  fechaFin: string;
  activa: boolean;
}

const mockTarifas: Tarifa[] = [
  {
    id: '1',
    tipo: 'Contenedor 20DC',
    descripcion: 'Contenedor seco de 20 pies',
    montoBase: 50.00,
    horarioPico: 60.00,
    horarioValle: 40.00,
    finSemana: 45.00,
    activa: true,
    fechaVigencia: '2025-01-01'
  },
  {
    id: '2',
    tipo: 'Contenedor 40DC',
    descripcion: 'Contenedor seco de 40 pies',
    montoBase: 75.00,
    horarioPico: 90.00,
    horarioValle: 60.00,
    finSemana: 70.00,
    activa: true,
    fechaVigencia: '2025-01-01'
  },
  {
    id: '3',
    tipo: 'Contenedor 40HC',
    descripcion: 'Contenedor High Cube de 40 pies',
    montoBase: 85.00,
    horarioPico: 100.00,
    horarioValle: 70.00,
    finSemana: 80.00,
    activa: true,
    fechaVigencia: '2025-01-01'
  },
  {
    id: '4',
    tipo: 'Contenedor Refrigerado',
    descripcion: 'Contenedor refrigerado (Reefer)',
    montoBase: 120.00,
    horarioPico: 140.00,
    horarioValle: 100.00,
    finSemana: 110.00,
    activa: true,
    fechaVigencia: '2025-01-01'
  }
];

const mockPromociones: Promocion[] = [
  {
    id: '1',
    nombre: 'Horario Valle',
    descuento: 20,
    tipo: 'porcentaje',
    condicion: 'Reservas en horario 20:00-23:45',
    fechaInicio: '2025-10-01',
    fechaFin: '2025-12-31',
    activa: true
  },
  {
    id: '2',
    nombre: 'Fin de Semana',
    descuento: 10,
    tipo: 'porcentaje',
    condicion: 'Reservas sábado y domingo',
    fechaInicio: '2025-10-01',
    fechaFin: '2025-12-31',
    activa: true
  },
  {
    id: '3',
    nombre: 'Cliente Frecuente',
    descuento: 15,
    tipo: 'porcentaje',
    condicion: 'Más de 50 movimientos mensuales',
    fechaInicio: '2025-09-01',
    fechaFin: '2025-12-31',
    activa: false
  }
];

export function ConfiguracionTarifas() {
  const [tarifas, setTarifas] = useState<Tarifa[]>(mockTarifas);
  const [promociones, setPromociones] = useState<Promocion[]>(mockPromociones);
  const [tarifaEditando, setTarifaEditando] = useState<Tarifa | null>(null);
  const [mostrarDialogoEdicion, setMostrarDialogoEdicion] = useState(false);
  const [promocionEditando, setPromocionEditando] = useState<Promocion | null>(null);
  const [mostrarDialogoPromocion, setMostrarDialogoPromocion] = useState(false);

  const handleEditarTarifa = (tarifa: Tarifa) => {
    setTarifaEditando({ ...tarifa });
    setMostrarDialogoEdicion(true);
  };

  const handleGuardarTarifa = () => {
    if (!tarifaEditando) return;
    
    setTarifas(tarifas.map(t => 
      t.id === tarifaEditando.id ? tarifaEditando : t
    ));
    
    toast.success('Tarifa actualizada correctamente');
    setMostrarDialogoEdicion(false);
    setTarifaEditando(null);
  };

  const handleToggleTarifa = (id: string) => {
    setTarifas(tarifas.map(t => 
      t.id === id ? { ...t, activa: !t.activa } : t
    ));
    const tarifa = tarifas.find(t => t.id === id);
    toast.success(`Tarifa ${tarifa?.activa ? 'desactivada' : 'activada'}`);
  };

  const handleEditarPromocion = (promocion: Promocion) => {
    setPromocionEditando({ ...promocion });
    setMostrarDialogoPromocion(true);
  };

  const handleGuardarPromocion = () => {
    if (!promocionEditando) return;
    
    if (promocionEditando.id === 'nueva') {
      setPromociones([...promociones, { ...promocionEditando, id: Date.now().toString() }]);
      toast.success('Promoción creada correctamente');
    } else {
      setPromociones(promociones.map(p => 
        p.id === promocionEditando.id ? promocionEditando : p
      ));
      toast.success('Promoción actualizada correctamente');
    }
    
    setMostrarDialogoPromocion(false);
    setPromocionEditando(null);
  };

  const handleNuevaPromocion = () => {
    setPromocionEditando({
      id: 'nueva',
      nombre: '',
      descuento: 0,
      tipo: 'porcentaje',
      condicion: '',
      fechaInicio: new Date().toISOString().split('T')[0],
      fechaFin: new Date().toISOString().split('T')[0],
      activa: true
    });
    setMostrarDialogoPromocion(true);
  };

  const handleTogglePromocion = (id: string) => {
    setPromociones(promociones.map(p => 
      p.id === id ? { ...p, activa: !p.activa } : p
    ));
    const promocion = promociones.find(p => p.id === id);
    toast.success(`Promoción ${promocion?.activa ? 'desactivada' : 'activada'}`);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl mb-2">⚙️ Configuración de Tarifas</h1>
        <p className="text-gray-600">Gestión de tarifas base, horarios y promociones del servicio</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tarifas Activas</p>
                <p className="text-2xl">{tarifas.filter(t => t.activa).length}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Promociones Activas</p>
                <p className="text-2xl">{promociones.filter(p => p.activa).length}</p>
              </div>
              <Tag className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tarifa Promedio</p>
                <p className="text-2xl">
                  ${(tarifas.reduce((sum, t) => sum + t.montoBase, 0) / tarifas.length).toFixed(2)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Última Actualización</p>
                <p className="text-sm">16 Oct 2025</p>
              </div>
              <History className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tarifas" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tarifas">Tarifas Base</TabsTrigger>
          <TabsTrigger value="promociones">Promociones</TabsTrigger>
          <TabsTrigger value="historial">Historial de Cambios</TabsTrigger>
        </TabsList>

        <TabsContent value="tarifas">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Tarifas por Tipo de Contenedor</CardTitle>
                <Badge variant="outline" className="text-sm">
                  Vigencia desde {new Date(tarifas[0].fechaVigencia).toLocaleDateString('es-ES')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tarifas.map((tarifa) => (
                  <div key={tarifa.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg">{tarifa.tipo}</h3>
                          <Badge className={tarifa.activa ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {tarifa.activa ? 'Activa' : 'Inactiva'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{tarifa.descripcion}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-blue-50 border border-blue-200 rounded p-3">
                            <p className="text-xs text-gray-600 mb-1">Tarifa Base</p>
                            <p className="text-xl text-blue-700">${tarifa.montoBase.toFixed(2)}</p>
                          </div>
                          <div className="bg-red-50 border border-red-200 rounded p-3">
                            <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Horario Pico
                            </p>
                            <p className="text-xl text-red-700">${tarifa.horarioPico.toFixed(2)}</p>
                          </div>
                          <div className="bg-green-50 border border-green-200 rounded p-3">
                            <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Horario Valle
                            </p>
                            <p className="text-xl text-green-700">${tarifa.horarioValle.toFixed(2)}</p>
                          </div>
                          <div className="bg-purple-50 border border-purple-200 rounded p-3">
                            <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Fin de Semana
                            </p>
                            <p className="text-xl text-purple-700">${tarifa.finSemana.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={tarifa.activa} 
                          onCheckedChange={() => handleToggleTarifa(tarifa.id)}
                        />
                        <span className="text-sm text-gray-600">
                          {tarifa.activa ? 'Desactivar' : 'Activar'} tarifa
                        </span>
                      </div>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditarTarifa(tarifa)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="promociones">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Promociones e Incentivos</CardTitle>
                <Button onClick={handleNuevaPromocion}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Promoción
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {promociones.map((promocion) => (
                  <div key={promocion.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Tag className="h-5 w-5 text-orange-500" />
                          <h3 className="text-lg">{promocion.nombre}</h3>
                          <Badge className={promocion.activa ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {promocion.activa ? 'Activa' : 'Inactiva'}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{promocion.condicion}</p>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Descuento</p>
                            <p className="text-lg">
                              {promocion.tipo === 'porcentaje' 
                                ? `${promocion.descuento}%` 
                                : `$${promocion.descuento.toFixed(2)}`}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Fecha Inicio</p>
                            <p>{new Date(promocion.fechaInicio).toLocaleDateString('es-ES')}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Fecha Fin</p>
                            <p>{new Date(promocion.fechaFin).toLocaleDateString('es-ES')}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={promocion.activa} 
                          onCheckedChange={() => handleTogglePromocion(promocion.id)}
                        />
                        <span className="text-sm text-gray-600">
                          {promocion.activa ? 'Desactivar' : 'Activar'} promoción
                        </span>
                      </div>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditarPromocion(promocion)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historial">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Cambios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-3 py-2">
                  <p className="text-sm">Actualización de tarifas contenedor 40HC</p>
                  <p className="text-xs text-gray-500">15 de octubre, 2025 - Admin: Juan Pérez</p>
                  <p className="text-xs text-gray-600 mt-1">Tarifa base: $80.00 → $85.00</p>
                </div>
                <div className="border-l-4 border-green-500 pl-3 py-2">
                  <p className="text-sm">Nueva promoción "Horario Valle" creada</p>
                  <p className="text-xs text-gray-500">1 de octubre, 2025 - Admin: María García</p>
                  <p className="text-xs text-gray-600 mt-1">Descuento: 20% en horario 20:00-23:45</p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-3 py-2">
                  <p className="text-sm">Modificación tarifa contenedor refrigerado</p>
                  <p className="text-xs text-gray-500">15 de septiembre, 2025 - Admin: Juan Pérez</p>
                  <p className="text-xs text-gray-600 mt-1">Tarifa base: $110.00 → $120.00</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo de edición de tarifa */}
      <Dialog open={mostrarDialogoEdicion} onOpenChange={setMostrarDialogoEdicion}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Tarifa</DialogTitle>
            <DialogDescription>
              Modifica los valores de la tarifa seleccionada
            </DialogDescription>
          </DialogHeader>
          {tarifaEditando && (
            <div className="space-y-4">
              <div>
                <Label>Tipo de Contenedor</Label>
                <Input value={tarifaEditando.tipo} disabled />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="montoBase">Tarifa Base ($)</Label>
                  <Input
                    id="montoBase"
                    type="number"
                    step="0.01"
                    value={tarifaEditando.montoBase}
                    onChange={(e) => setTarifaEditando({
                      ...tarifaEditando,
                      montoBase: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="horarioPico">Horario Pico ($)</Label>
                  <Input
                    id="horarioPico"
                    type="number"
                    step="0.01"
                    value={tarifaEditando.horarioPico}
                    onChange={(e) => setTarifaEditando({
                      ...tarifaEditando,
                      horarioPico: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="horarioValle">Horario Valle ($)</Label>
                  <Input
                    id="horarioValle"
                    type="number"
                    step="0.01"
                    value={tarifaEditando.horarioValle}
                    onChange={(e) => setTarifaEditando({
                      ...tarifaEditando,
                      horarioValle: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="finSemana">Fin de Semana ($)</Label>
                  <Input
                    id="finSemana"
                    type="number"
                    step="0.01"
                    value={tarifaEditando.finSemana}
                    onChange={(e) => setTarifaEditando({
                      ...tarifaEditando,
                      finSemana: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setMostrarDialogoEdicion(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleGuardarTarifa}>
              <Save className="h-4 w-4 mr-2" />
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de edición/creación de promoción */}
      <Dialog open={mostrarDialogoPromocion} onOpenChange={setMostrarDialogoPromocion}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {promocionEditando?.id === 'nueva' ? 'Nueva Promoción' : 'Editar Promoción'}
            </DialogTitle>
          </DialogHeader>
          {promocionEditando && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="nombre">Nombre de la Promoción *</Label>
                <Input
                  id="nombre"
                  value={promocionEditando.nombre}
                  onChange={(e) => setPromocionEditando({
                    ...promocionEditando,
                    nombre: e.target.value
                  })}
                  placeholder="Ej: Descuento Horario Valle"
                />
              </div>

              <div>
                <Label htmlFor="condicion">Condición *</Label>
                <Input
                  id="condicion"
                  value={promocionEditando.condicion}
                  onChange={(e) => setPromocionEditando({
                    ...promocionEditando,
                    condicion: e.target.value
                  })}
                  placeholder="Ej: Reservas en horario 20:00-23:45"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="descuento">Descuento *</Label>
                  <Input
                    id="descuento"
                    type="number"
                    value={promocionEditando.descuento}
                    onChange={(e) => setPromocionEditando({
                      ...promocionEditando,
                      descuento: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select 
                    value={promocionEditando.tipo} 
                    onValueChange={(value: 'porcentaje' | 'monto') => setPromocionEditando({
                      ...promocionEditando,
                      tipo: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="porcentaje">Porcentaje (%)</SelectItem>
                      <SelectItem value="monto">Monto ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fechaInicio">Fecha Inicio *</Label>
                  <Input
                    id="fechaInicio"
                    type="date"
                    value={promocionEditando.fechaInicio}
                    onChange={(e) => setPromocionEditando({
                      ...promocionEditando,
                      fechaInicio: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="fechaFin">Fecha Fin *</Label>
                  <Input
                    id="fechaFin"
                    type="date"
                    value={promocionEditando.fechaFin}
                    onChange={(e) => setPromocionEditando({
                      ...promocionEditando,
                      fechaFin: e.target.value
                    })}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setMostrarDialogoPromocion(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleGuardarPromocion}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {promocionEditando?.id === 'nueva' ? 'Crear' : 'Guardar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
