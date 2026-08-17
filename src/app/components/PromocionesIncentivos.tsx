import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tag, Plus, Edit, BarChart3, Send, CheckCircle2, TrendingUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Switch } from './ui/switch';
import { toast } from 'sonner';

interface Campana {
  id: string;
  nombre: string;
  tipo: 'horario' | 'cliente' | 'contenedor';
  descuento: number;
  condicion: string;
  fechaInicio: string;
  fechaFin: string;
  activa: boolean;
  resultados: {
    reservasGeneradas: number;
    ingresoAdicional: number;
    tasaConversion: number;
  };
}

const mockCampanas: Campana[] = [
  {
    id: '1',
    nombre: 'Horario Valle Nocturno',
    tipo: 'horario',
    descuento: 20,
    condicion: 'Turnos 20:00-23:45',
    fechaInicio: '2025-10-01',
    fechaFin: '2025-12-31',
    activa: true,
    resultados: { reservasGeneradas: 45, ingresoAdicional: 2250, tasaConversion: 18.5 }
  },
  {
    id: '2',
    nombre: 'Fin de Semana Plus',
    tipo: 'horario',
    descuento: 15,
    condicion: 'Sábados y Domingos',
    fechaInicio: '2025-10-01',
    fechaFin: '2025-12-31',
    activa: true,
    resultados: { reservasGeneradas: 32, ingresoAdicional: 1920, tasaConversion: 24.1 }
  },
  {
    id: '3',
    nombre: 'Cliente VIP',
    tipo: 'cliente',
    descuento: 10,
    condicion: 'Más de 50 movimientos/mes',
    fechaInicio: '2025-09-01',
    fechaFin: '2025-12-31',
    activa: false,
    resultados: { reservasGeneradas: 128, ingresoAdicional: 8960, tasaConversion: 45.2 }
  }
];

export function PromocionesIncentivos() {
  const [campanas] = useState<Campana[]>(mockCampanas);
  const [mostrarDialogo, setMostrarDialogo] = useState(false);

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl mb-2">🎁 Promociones e Incentivos</h1>
        <p className="text-gray-600">Diseño y evaluación de estrategias promocionales</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="p-4"><div className="flex items-center justify-between mb-2"><p className="text-sm text-gray-600">Campañas Activas</p><Tag className="h-5 w-5 text-green-500" /></div><p className="text-2xl">{campanas.filter(c => c.activa).length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center justify-between mb-2"><p className="text-sm text-gray-600">Reservas Generadas</p><CheckCircle2 className="h-5 w-5 text-blue-500" /></div><p className="text-2xl">{campanas.reduce((sum, c) => sum + c.resultados.reservasGeneradas, 0)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center justify-between mb-2"><p className="text-sm text-gray-600">Ingreso Adicional</p><TrendingUp className="h-5 w-5 text-green-500" /></div><p className="text-2xl">${campanas.reduce((sum, c) => sum + c.resultados.ingresoAdicional, 0).toLocaleString()}</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center justify-between mb-2"><p className="text-sm text-gray-600">Conversión Prom.</p><BarChart3 className="h-5 w-5 text-purple-500" /></div><p className="text-2xl">{(campanas.reduce((sum, c) => sum + c.resultados.tasaConversion, 0) / campanas.length).toFixed(1)}%</p></CardContent></Card>
      </div>

      <Card className="mb-6">
        <CardHeader><div className="flex items-center justify-between"><CardTitle>Campañas Promocionales</CardTitle><Button onClick={() => setMostrarDialogo(true)}><Plus className="h-4 w-4 mr-2" />Nueva Campaña</Button></div></CardHeader>
        <CardContent><div className="space-y-4">{campanas.map((campana) => (<div key={campana.id} className="border rounded-lg p-4 bg-white"><div className="flex items-start justify-between mb-3"><div className="flex-1"><div className="flex items-center gap-2 mb-2"><Tag className="h-5 w-5 text-orange-500" /><h3 className="text-lg">{campana.nombre}</h3><Badge className={campana.activa ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>{campana.activa ? 'Activa' : 'Inactiva'}</Badge></div><p className="text-sm text-gray-600 mb-2">{campana.condicion}</p><div className="grid grid-cols-3 gap-4 text-sm"><div><p className="text-gray-600">Descuento</p><p className="text-lg">{campana.descuento}%</p></div><div><p className="text-gray-600">Período</p><p className="text-sm">{new Date(campana.fechaInicio).toLocaleDateString('es-ES')} - {new Date(campana.fechaFin).toLocaleDateString('es-ES')}</p></div><div><p className="text-gray-600">Tipo</p><p className="capitalize">{campana.tipo}</p></div></div></div></div><div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded mt-3"><div className="text-center"><p className="text-xs text-gray-600">Reservas</p><p className="text-xl text-blue-600">{campana.resultados.reservasGeneradas}</p></div><div className="text-center"><p className="text-xs text-gray-600">Ingreso</p><p className="text-xl text-green-600">${campana.resultados.ingresoAdicional.toLocaleString()}</p></div><div className="text-center"><p className="text-xs text-gray-600">Conversión</p><p className="text-xl text-purple-600">{campana.resultados.tasaConversion}%</p></div></div><div className="flex items-center justify-between pt-3 border-t mt-3"><div className="flex items-center gap-2"><Switch checked={campana.activa} /><span className="text-sm text-gray-600">{campana.activa ? 'Desactivar' : 'Activar'} campaña</span></div><div className="flex gap-2"><Button size="sm" variant="outline"><Edit className="h-4 w-4 mr-1" />Editar</Button><Button size="sm" variant="outline"><Send className="h-4 w-4 mr-1" />Notificar</Button></div></div></div>))}</div></CardContent>
      </Card>

      <Dialog open={mostrarDialogo} onOpenChange={setMostrarDialogo}><DialogContent><DialogHeader><DialogTitle>Nueva Campaña Promocional</DialogTitle></DialogHeader><div className="space-y-4"><div><Label>Nombre de la Campaña *</Label><Input placeholder="Ej: Descuento Horario Valle" /></div><div><Label>Tipo de Promoción</Label><Select><SelectTrigger><SelectValue placeholder="Seleccione tipo" /></SelectTrigger><SelectContent><SelectItem value="horario">Por Horario</SelectItem><SelectItem value="cliente">Por Cliente</SelectItem><SelectItem value="contenedor">Por Contenedor</SelectItem></SelectContent></Select></div><div className="grid grid-cols-2 gap-4"><div><Label>Descuento (%)</Label><Input type="number" placeholder="20" /></div><div><Label>Fecha Inicio</Label><Input type="date" /></div></div></div><DialogFooter><Button variant="outline" onClick={() => setMostrarDialogo(false)}>Cancelar</Button><Button onClick={() => { toast.success('Campaña creada'); setMostrarDialogo(false); }}>Crear Campaña</Button></DialogFooter></DialogContent></Dialog>
    </div>
  );
}
