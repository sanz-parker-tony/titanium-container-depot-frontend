import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar, Users, Wrench, Package, TrendingUp, Download, Play } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';

export function PlaneacionOperativa() {
  const [periodo, setPeriodo] = useState('semana');

  const escenarios = [
    { dia: 'Lunes', reservasEsperadas: 145, ocupacionProyectada: 88, personalRequerido: 12, equiposNecesarios: 6 },
    { dia: 'Martes', reservasEsperadas: 152, ocupacionProyectada: 92, personalRequerido: 13, equiposNecesarios: 7 },
    { dia: 'Miércoles', reservasEsperadas: 138, ocupacionProyectada: 84, personalRequerido: 11, equiposNecesarios: 6 },
    { dia: 'Jueves', reservasEsperadas: 148, ocupacionProyectada: 90, personalRequerido: 12, equiposNecesarios: 6 },
    { dia: 'Viernes', reservasEsperadas: 142, ocupacionProyectada: 86, personalRequerido: 12, equiposNecesarios: 6 },
    { dia: 'Sábado', reservasEsperadas: 78, ocupacionProyectada: 47, personalRequerido: 8, equiposNecesarios: 4 },
    { dia: 'Domingo', reservasEsperadas: 45, ocupacionProyectada: 27, personalRequerido: 6, equiposNecesarios: 3 }
  ];

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="mb-6"><h1 className="text-3xl mb-2">🗓️ Planeación Operativa</h1><p className="text-gray-600">Planificación integral del uso del patio y recursos</p></div>

      <Card className="mb-6"><CardContent className="p-4"><div className="flex items-center gap-4"><div className="flex-1"><Select value={periodo} onValueChange={setPeriodo}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="semana">Próxima Semana</SelectItem><SelectItem value="mes">Próximo Mes</SelectItem></SelectContent></Select></div><Button variant="outline"><Play className="h-4 w-4 mr-2" />Simular Escenario</Button><Button><Download className="h-4 w-4 mr-2" />Exportar Plan</Button></div></CardContent></Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="p-4"><div className="flex items-center justify-between mb-2"><p className="text-sm text-gray-600">Capacidad Total</p><Package className="h-5 w-5 text-blue-500" /></div><p className="text-2xl">165 espacios</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center justify-between mb-2"><p className="text-sm text-gray-600">Ocupación Prom.</p><TrendingUp className="h-5 w-5 text-green-500" /></div><p className="text-2xl">73%</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center justify-between mb-2"><p className="text-sm text-gray-600">Personal Disp.</p><Users className="h-5 w-5 text-purple-500" /></div><p className="text-2xl">15</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center justify-between mb-2"><p className="text-sm text-gray-600">Equipos Disp.</p><Wrench className="h-5 w-5 text-orange-500" /></div><p className="text-2xl">8</p></CardContent></Card>
      </div>

      <Card><CardHeader><CardTitle>Proyección Semanal - Recursos y Ocupación</CardTitle></CardHeader><CardContent><div className="space-y-4">{escenarios.map((dia, idx) => (<div key={idx} className="border rounded-lg p-4 bg-white"><div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2"><Calendar className="h-5 w-5 text-blue-500" /><h4 className="">{dia.dia}</h4>{dia.ocupacionProyectada >= 85 && <Badge className="bg-red-100 text-red-800">Alta Demanda</Badge>}</div><p className="text-xl">{dia.reservasEsperadas} movimientos</p></div><div className="grid grid-cols-4 gap-4"><div><p className="text-xs text-gray-600 mb-1">Ocupación Proyectada</p><Progress value={dia.ocupacionProyectada} className="h-3" /><p className="text-sm mt-1">{dia.ocupacionProyectada}%</p></div><div><p className="text-xs text-gray-600">Personal Requerido</p><p className="text-lg">{dia.personalRequerido} operadores</p></div><div><p className="text-xs text-gray-600">Equipos Necesarios</p><p className="text-lg">{dia.equiposNecesarios} unidades</p></div><div><p className="text-xs text-gray-600">Ingresos Estimados</p><p className="text-lg">${(dia.reservasEsperadas * 68).toLocaleString()}</p></div></div></div>))}</div><div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4"><h4 className="mb-2">Recomendaciones</h4><ul className="space-y-2 text-sm text-gray-700"><li>• Martes: día de mayor demanda - Asegurar disponibilidad completa de equipos y personal</li><li>• Fin de semana: baja ocupación - Implementar promociones y reducir personal</li></ul></div></CardContent></Card>
    </div>
  );
}
