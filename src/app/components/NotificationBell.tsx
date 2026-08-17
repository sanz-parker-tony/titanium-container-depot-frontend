import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { UserRole } from './LoginScreen';

interface Notification {
  id: string;
  tipo: 'warning' | 'alert' | 'success' | 'info';
  mensaje: string;
  timestamp: string;
}

interface NotificationBellProps {
  userRole: UserRole;
}

export function NotificationBell({ userRole }: NotificationBellProps) {
  const [open, setOpen] = useState(false);

  // Notificaciones según el perfil
  const getNotificationsByRole = (): Notification[] => {
    switch (userRole) {
      case 'cliente':
        return [
          {
            id: '1',
            tipo: 'warning',
            mensaje: 'Tienes 2 reservas pendientes de agendar turno.',
            timestamp: 'Hace 1 hora'
          },
          {
            id: '2',
            tipo: 'info',
            mensaje: 'Tu ticket TCK-001 está confirmado para mañana 08:00.',
            timestamp: 'Hace 3 horas'
          },
          {
            id: '3',
            tipo: 'alert',
            mensaje: 'Recuerda completar los datos del chofer para el ticket TCK-003.',
            timestamp: 'Hace 5 horas'
          },
          {
            id: '4',
            tipo: 'success',
            mensaje: 'Tu pago ha sido confirmado. Ticket TCK-002.',
            timestamp: 'Hace 1 día'
          }
        ];

      case 'admin-operativo':
        return [
          {
            id: '1',
            tipo: 'alert',
            mensaje: 'Gate 2 reporta demora de 45 minutos en ingreso.',
            timestamp: 'Hace 15 minutos'
          },
          {
            id: '2',
            tipo: 'warning',
            mensaje: '18 tickets sin agendar hace más de 3 días.',
            timestamp: 'Hace 30 minutos'
          },
          {
            id: '3',
            tipo: 'alert',
            mensaje: 'Cliente LogiPac no agenda desde hace 7 días.',
            timestamp: 'Hace 2 horas'
          },
          {
            id: '4',
            tipo: 'warning',
            mensaje: 'Zona D alcanzó 90% de ocupación.',
            timestamp: 'Hace 3 horas'
          },
          {
            id: '5',
            tipo: 'info',
            mensaje: 'Grúa #3 programada para mantenimiento mañana.',
            timestamp: 'Hace 5 horas'
          },
          {
            id: '6',
            tipo: 'success',
            mensaje: '45 contenedores procesados exitosamente hoy.',
            timestamp: 'Hace 6 horas'
          }
        ];

      case 'gerente':
        return [
          {
            id: '1',
            tipo: 'warning',
            mensaje: 'Cartera vencida >90 días: $12,450. Revisar cobranzas.',
            timestamp: 'Hace 1 hora'
          },
          {
            id: '2',
            tipo: 'alert',
            mensaje: 'Cliente Global Shipping sin actividad hace 15 días.',
            timestamp: 'Hace 2 horas'
          },
          {
            id: '3',
            tipo: 'success',
            mensaje: 'Meta mensual alcanzada: 120% sobre objetivo.',
            timestamp: 'Hace 4 horas'
          },
          {
            id: '4',
            tipo: 'info',
            mensaje: 'Promoción horario nocturno generó +15% reservas.',
            timestamp: 'Hace 8 horas'
          },
          {
            id: '5',
            tipo: 'warning',
            mensaje: 'Tasa de conversión bajo 5% esta semana.',
            timestamp: 'Hace 12 horas'
          },
          {
            id: '6',
            tipo: 'info',
            mensaje: 'Reunión semanal de operaciones programada para viernes.',
            timestamp: 'Hace 1 día'
          }
        ];

      case 'accionista':
        return [
          {
            id: '1',
            tipo: 'success',
            mensaje: 'ROI mensual alcanzó 18.5%, superando meta de 15%.',
            timestamp: 'Hace 2 horas'
          },
          {
            id: '2',
            tipo: 'info',
            mensaje: 'Reporte consolidado Q4 disponible para descarga.',
            timestamp: 'Hace 4 horas'
          },
          {
            id: '3',
            tipo: 'warning',
            mensaje: 'Ocupación promedio 68%, considerar expansión Zona E.',
            timestamp: 'Hace 8 horas'
          },
          {
            id: '4',
            tipo: 'success',
            mensaje: 'Reducción 12% en costos operativos vs trimestre anterior.',
            timestamp: 'Hace 1 día'
          },
          {
            id: '5',
            tipo: 'info',
            mensaje: 'Nuevas proyecciones de crecimiento 2026 disponibles.',
            timestamp: 'Hace 2 días'
          }
        ];

      default:
        return [];
    }
  };

  const notifications = getNotificationsByRole();
  const unreadCount = notifications.filter(n => n.tipo === 'alert' || n.tipo === 'warning').length;

  const getIconColor = (tipo: string) => {
    switch (tipo) {
      case 'warning':
        return 'text-yellow-600';
      case 'alert':
        return 'text-red-600';
      case 'success':
        return 'text-green-600';
      default:
        return 'text-blue-600';
    }
  };

  const getBgColor = (tipo: string) => {
    switch (tipo) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'alert':
        return 'bg-red-50 border-red-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="relative inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Notificaciones</h3>
            <Badge variant="secondary">{notifications.length}</Badge>
          </div>
        </div>
        <ScrollArea className="h-96">
          <div className="p-2 space-y-2">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No tienes notificaciones</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border ${getBgColor(notification.tipo)} hover:shadow-sm transition-shadow cursor-pointer`}
                >
                  <div className="flex gap-3">
                    <div className={`shrink-0 ${getIconColor(notification.tipo)}`}>
                      <Bell className="h-4 w-4 mt-0.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{notification.mensaje}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        {notifications.length > 0 && (
          <div className="border-t p-3">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs"
              onClick={() => setOpen(false)}
            >
              Marcar todas como leídas
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
