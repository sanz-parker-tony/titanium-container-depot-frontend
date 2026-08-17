import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Shield, AlertTriangle, CheckCircle2, Download, User, Calendar, Monitor } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function AuditoriaSeguridad() {
  const [periodo, setPeriodo] = useState('mes-actual');

  const eventos = [
    { tipo: 'login', usuario: 'Juan Pérez', accion: 'Inicio de sesión', fecha: '2025-10-16 14:30', ip: '192.168.1.45', riesgo: 'bajo' },
    { tipo: 'edicion', usuario: 'María García', accion: 'Modificó tarifa 40HC', fecha: '2025-10-16 10:15', ip: '192.168.1.32', riesgo: 'medio' },
    { tipo: 'eliminacion', usuario: 'Admin Sistema', accion: 'Eliminó reserva TCK-025', fecha: '2025-10-15 16:20', ip: '192.168.1.10', riesgo: 'alto' },
    { tipo: 'login-fallido', usuario: 'Desconocido', accion: 'Intento fallido de acceso', fecha: '2025-10-15 03:42', ip: '203.45.67.89', riesgo: 'alto' }
  ];

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="mb-6"><h1 className="text-3xl mb-2">🛡️ Auditoría y Seguridad</h1><p className="text-gray-600">Supervisión de acciones y garantía de integridad del sistema</p></div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="p-4"><div className="flex items-center justify-between mb-2"><p className="text-sm text-gray-600">Eventos Totales</p><Shield className="h-5 w-5 text-blue-500" /></div><p className="text-2xl">1,245</p><p className="text-xs text-gray-500">últimos 30 días</p></CardContent></Card>
        <Card className="border-2 border-red-200"><CardContent className="p-4"><div className="flex items-center justify-between mb-2"><p className="text-sm text-gray-600">Alertas de Riesgo</p><AlertTriangle className="h-5 w-5 text-red-500" /></div><p className="text-2xl text-red-600">12</p><p className="text-xs text-gray-500">requieren atención</p></CardContent></Card>
        <Card className="border-2 border-green-200"><CardContent className="p-4"><div className="flex items-center justify-between mb-2"><p className="text-sm text-gray-600">Usuarios Activos</p><User className="h-5 w-5 text-green-500" /></div><p className="text-2xl text-green-600">24</p><p className="text-xs text-gray-500">con acceso vigente</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center justify-between mb-2"><p className="text-sm text-gray-600">Nivel de Seguridad</p><CheckCircle2 className="h-5 w-5 text-green-500" /></div><p className="text-2xl">Alto</p><p className="text-xs text-gray-500">sin vulnerabilidades</p></CardContent></Card>
      </div>

      <Tabs defaultValue="registro" className="space-y-6">
        <TabsList><TabsTrigger value="registro">Registro de Acciones</TabsTrigger><TabsTrigger value="accesos">Control de Accesos</TabsTrigger><TabsTrigger value="alertas">Alertas de Seguridad</TabsTrigger></TabsList>

        <TabsContent value="registro"><Card><CardHeader><div className="flex items-center justify-between"><CardTitle>Trazabilidad de Acciones</CardTitle><Button><Download className="h-4 w-4 mr-2" />Exportar Logs</Button></div></CardHeader><CardContent><div className="space-y-3">{eventos.map((evento, idx) => (<div key={idx} className={`border-l-4 ${evento.riesgo === 'alto' ? 'border-red-500' : evento.riesgo === 'medio' ? 'border-yellow-500' : 'border-green-500'} pl-3 py-2 bg-white rounded-r`}><div className="flex items-start justify-between"><div><p className="text-sm">{evento.accion}</p><p className="text-xs text-gray-500 mt-1">Usuario: {evento.usuario} | IP: {evento.ip}</p></div><Badge className={evento.riesgo === 'alto' ? 'bg-red-100 text-red-800' : evento.riesgo === 'medio' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}>{evento.riesgo}</Badge></div><p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Calendar className="h-3 w-3" />{evento.fecha}</p></div>))}</div></CardContent></Card></TabsContent>

        <TabsContent value="accesos"><Card><CardHeader><CardTitle>Historial de Accesos al Sistema</CardTitle></CardHeader><CardContent><p className="text-gray-500 text-center py-8">Módulo de control de accesos por usuario, fecha y dispositivo</p></CardContent></Card></TabsContent>

        <TabsContent value="alertas"><Card><CardHeader><CardTitle>Alertas y Eventos de Seguridad</CardTitle></CardHeader><CardContent><p className="text-gray-500 text-center py-8">Centro de alertas de seguridad y eventos sospechosos</p></CardContent></Card></TabsContent>
      </Tabs>
    </div>
  );
}
