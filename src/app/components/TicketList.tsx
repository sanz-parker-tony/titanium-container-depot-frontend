import { Edit2, Trash2, Plus, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { useState } from 'react';

export interface Ticket {
  id: string;
  fecha: string;
  estado: 'Pendiente' | 'En Progreso' | 'Completado' | 'Cancelado';
  servicio: string;
  ultimaActualizacion: string;
}

interface TicketListProps {
  tickets: Ticket[];
  onCreateTicket: () => void;
  onEditTicket: (ticket: Ticket) => void;
  onDeleteTicket: (id: string) => void;
  onLogout: () => void;
}

export function TicketList({
  tickets,
  onCreateTicket,
  onEditTicket,
  onDeleteTicket,
  onLogout,
}: TicketListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const getStatusColor = (estado: Ticket['estado']) => {
    switch (estado) {
      case 'Completado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'En Progreso':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Cancelado':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-4 md:p-8 max-w-7xl">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="mb-2">Gestión de Tickets - Patio de Contenedores</h1>
            <p className="text-muted-foreground">
              Administra reservas de importación y exportación
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={onCreateTicket} className="gap-2">
              <Plus className="h-4 w-4" />
              Crear nuevo ticket
            </Button>
            <Button onClick={onLogout} variant="outline" className="gap-2">
              <LogOut className="h-4 w-4" />
              Salir
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>ID</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Tipo de Operación</TableHead>
                  <TableHead>Última actualización</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      No hay tickets disponibles. Crea tu primer ticket.
                    </TableCell>
                  </TableRow>
                ) : (
                  tickets.map((ticket) => (
                    <TableRow key={ticket.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium">#{ticket.id}</TableCell>
                      <TableCell>{ticket.fecha}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(ticket.estado)}>
                          {ticket.estado}
                        </Badge>
                      </TableCell>
                      <TableCell>{ticket.servicio}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {ticket.ultimaActualizacion}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditTicket(ticket)}
                            className="hover:bg-blue-50"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteId(ticket.id)}
                            className="hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El ticket será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  onDeleteTicket(deleteId);
                  setDeleteId(null);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
