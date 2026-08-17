import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Search, Plus, Edit, Trash2, Eye, Upload, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Transportista {
  id: string;
  nombreConductor: string;
  cedula: string;
  telefono: string;
  empresaTransporte: string;
  placaVehiculo: string;
  tipoVehiculo: string;
  autorizado: boolean;
  estado: 'Activo' | 'Inactivo';
  ultimaActualizacion: string;
  email?: string;
  fotoConductor?: string;
  marca?: string;
  modelo?: string;
  año?: string;
  color?: string;
  fotoVehiculo?: string;
  licenciaExpira?: string;
  matriculaExpira?: string;
  observaciones?: string;
}

const mockTransportistas: Transportista[] = [
  {
    id: '1',
    nombreConductor: 'Juan Pérez García',
    cedula: '0912345678',
    telefono: '+593 99 123 4567',
    empresaTransporte: 'TransLog S.A.',
    placaVehiculo: 'GYE-1234',
    tipoVehiculo: 'Tráiler',
    autorizado: true,
    estado: 'Activo',
    ultimaActualizacion: '15/10/2025',
    email: 'juan.perez@translog.com',
    marca: 'Freightliner',
    modelo: 'Cascadia',
    año: '2020',
    color: 'Blanco',
    licenciaExpira: '2026-03-15',
    matriculaExpira: '2026-01-20',
  },
  {
    id: '2',
    nombreConductor: 'María González López',
    cedula: '0923456789',
    telefono: '+593 98 234 5678',
    empresaTransporte: 'Cargo Express Ltda.',
    placaVehiculo: 'GYE-5678',
    tipoVehiculo: 'Camión Simple',
    autorizado: true,
    estado: 'Activo',
    ultimaActualizacion: '12/10/2025',
    email: 'mgonzalez@cargoexpress.com',
    marca: 'Kenworth',
    modelo: 'T680',
    año: '2019',
    color: 'Rojo',
    licenciaExpira: '2025-12-30',
    matriculaExpira: '2026-02-15',
  },
  {
    id: '3',
    nombreConductor: 'Carlos Ramírez Torres',
    cedula: '0934567890',
    telefono: '+593 97 345 6789',
    empresaTransporte: 'Logística Nacional',
    placaVehiculo: 'GYE-9012',
    tipoVehiculo: 'Cabezal',
    autorizado: false,
    estado: 'Inactivo',
    ultimaActualizacion: '08/10/2025',
    licenciaExpira: '2025-11-10',
  },
];

export function TransportistasManagement() {
  const [transportistas, setTransportistas] = useState<Transportista[]>(mockTransportistas);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTransportista, setSelectedTransportista] = useState<Transportista | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<Partial<Transportista>>({
    estado: 'Activo',
    autorizado: true,
  });

  const filteredTransportistas = transportistas.filter(t => 
    t.nombreConductor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.cedula.includes(searchTerm) ||
    t.placaVehiculo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNew = () => {
    setIsEditing(false);
    setFormData({ estado: 'Activo', autorizado: true });
    setIsDialogOpen(true);
  };

  const handleEdit = (transportista: Transportista) => {
    setIsEditing(true);
    setFormData(transportista);
    setIsDialogOpen(true);
  };

  const handleView = (transportista: Transportista) => {
    setSelectedTransportista(transportista);
    setViewDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const transportista = transportistas.find(t => t.id === id);
    if (confirm(`¿Está seguro de eliminar al transportista ${transportista?.nombreConductor}?`)) {
      setTransportistas(transportistas.filter(t => t.id !== id));
      toast.success('Transportista eliminado correctamente');
    }
  };

  const handleSave = () => {
    if (!formData.nombreConductor || !formData.cedula || !formData.placaVehiculo) {
      toast.error('Por favor complete los campos obligatorios');
      return;
    }

    if (isEditing && formData.id) {
      setTransportistas(transportistas.map(t => 
        t.id === formData.id ? { ...formData, ultimaActualizacion: new Date().toLocaleDateString('es-EC') } as Transportista : t
      ));
      toast.success('Transportista actualizado correctamente');
    } else {
      const newTransportista: Transportista = {
        ...formData,
        id: Date.now().toString(),
        ultimaActualizacion: new Date().toLocaleDateString('es-EC'),
      } as Transportista;
      setTransportistas([...transportistas, newTransportista]);
      toast.success('Transportista registrado correctamente');
    }
    
    setIsDialogOpen(false);
    setFormData({ estado: 'Activo', autorizado: true });
  };

  const isDocumentExpiring = (fecha?: string) => {
    if (!fecha) return false;
    const expDate = new Date(fecha);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const isDocumentExpired = (fecha?: string) => {
    if (!fecha) return false;
    const expDate = new Date(fecha);
    const today = new Date();
    return expDate < today;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl mb-2">Mantenimiento de Transportistas</h1>
        <p className="text-sm text-gray-600">
          Administre los transportistas autorizados para sus operaciones. La información aquí registrada estará disponible al momento de agendar sus reservas.
        </p>
      </div>

      {/* Barra de acciones */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre, cédula o placa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={handleNew} className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Transportista
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de transportistas */}
      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre del Conductor</TableHead>
                  <TableHead>Cédula</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Placa</TableHead>
                  <TableHead>Tipo Vehículo</TableHead>
                  <TableHead className="text-center">Autorizado</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                  <TableHead>Última Actualización</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransportistas.map((transportista) => (
                  <TableRow key={transportista.id}>
                    <TableCell>{transportista.nombreConductor}</TableCell>
                    <TableCell>{transportista.cedula}</TableCell>
                    <TableCell>{transportista.telefono}</TableCell>
                    <TableCell>{transportista.empresaTransporte}</TableCell>
                    <TableCell className="uppercase">{transportista.placaVehiculo}</TableCell>
                    <TableCell>{transportista.tipoVehiculo}</TableCell>
                    <TableCell className="text-center">
                      {transportista.autorizado ? (
                        <Badge className="bg-green-100 text-green-700 border-0">Sí</Badge>
                      ) : (
                        <Badge variant="outline">No</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={transportista.estado === 'Activo' ? 'default' : 'secondary'}>
                        {transportista.estado}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        {transportista.ultimaActualizacion}
                        {(isDocumentExpired(transportista.licenciaExpira) || isDocumentExpired(transportista.matriculaExpira)) && (
                          <div className="flex items-center gap-1 text-xs text-red-600 mt-1">
                            <AlertCircle className="h-3 w-3" />
                            Doc. vencido
                          </div>
                        )}
                        {(isDocumentExpiring(transportista.licenciaExpira) || isDocumentExpiring(transportista.matriculaExpira)) && (
                          <div className="flex items-center gap-1 text-xs text-yellow-600 mt-1">
                            <AlertCircle className="h-3 w-3" />
                            Doc. por vencer
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(transportista)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(transportista)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(transportista.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredTransportistas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                      No se encontraron transportistas
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Dialog para nuevo/editar */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Transportista' : 'Nuevo Transportista'}</DialogTitle>
            <DialogDescription>
              Complete la información del transportista y su vehículo
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="conductor" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="conductor">Datos del Conductor</TabsTrigger>
              <TabsTrigger value="vehiculo">Vehículo</TabsTrigger>
              <TabsTrigger value="documentos">Documentos</TabsTrigger>
            </TabsList>

            <TabsContent value="conductor" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label>Nombre Completo *</Label>
                  <Input
                    value={formData.nombreConductor || ''}
                    onChange={(e) => setFormData({ ...formData, nombreConductor: e.target.value })}
                    placeholder="Ej: Juan Pérez García"
                  />
                </div>
                <div>
                  <Label>Cédula / Pasaporte *</Label>
                  <Input
                    value={formData.cedula || ''}
                    onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                    placeholder="0912345678"
                  />
                </div>
                <div>
                  <Label>Teléfono / WhatsApp *</Label>
                  <Input
                    value={formData.telefono || ''}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    placeholder="+593 99 123 4567"
                  />
                </div>
                <div className="col-span-2">
                  <Label>Email (Opcional)</Label>
                  <Input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="conductor@empresa.com"
                  />
                </div>
                <div className="col-span-2">
                  <Label>Empresa de Transporte *</Label>
                  <Input
                    value={formData.empresaTransporte || ''}
                    onChange={(e) => setFormData({ ...formData, empresaTransporte: e.target.value })}
                    placeholder="Ej: TransLog S.A."
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="vehiculo" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Placa *</Label>
                  <Input
                    value={formData.placaVehiculo || ''}
                    onChange={(e) => setFormData({ ...formData, placaVehiculo: e.target.value.toUpperCase() })}
                    placeholder="GYE-1234"
                    className="uppercase"
                  />
                </div>
                <div>
                  <Label>Tipo de Vehículo *</Label>
                  <Select
                    value={formData.tipoVehiculo || ''}
                    onValueChange={(value) => setFormData({ ...formData, tipoVehiculo: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Camión Simple">Camión Simple</SelectItem>
                      <SelectItem value="Tráiler">Tráiler</SelectItem>
                      <SelectItem value="Cabezal">Cabezal</SelectItem>
                      <SelectItem value="Plataforma">Plataforma</SelectItem>
                      <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Marca (Opcional)</Label>
                  <Input
                    value={formData.marca || ''}
                    onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                    placeholder="Ej: Freightliner"
                  />
                </div>
                <div>
                  <Label>Modelo (Opcional)</Label>
                  <Input
                    value={formData.modelo || ''}
                    onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                    placeholder="Ej: Cascadia"
                  />
                </div>
                <div>
                  <Label>Año (Opcional)</Label>
                  <Input
                    value={formData.año || ''}
                    onChange={(e) => setFormData({ ...formData, año: e.target.value })}
                    placeholder="2020"
                  />
                </div>
                <div>
                  <Label>Color (Opcional)</Label>
                  <Input
                    value={formData.color || ''}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="Blanco"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="documentos" className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Licencia de Conducir - Fecha de Expiración</Label>
                    <Input
                      type="date"
                      value={formData.licenciaExpira || ''}
                      onChange={(e) => setFormData({ ...formData, licenciaExpira: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Matrícula del Vehículo - Fecha de Expiración</Label>
                    <Input
                      type="date"
                      value={formData.matriculaExpira || ''}
                      onChange={(e) => setFormData({ ...formData, matriculaExpira: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="autorizado"
                    checked={formData.autorizado || false}
                    onChange={(e) => setFormData({ ...formData, autorizado: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="autorizado" className="cursor-pointer">
                    Autorizado para realizar movimientos en el depósito
                  </Label>
                </div>

                <div>
                  <Label>Observaciones</Label>
                  <Textarea
                    value={formData.observaciones || ''}
                    onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                    placeholder="Notas internas del cliente..."
                    rows={4}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Guardar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para ver detalle */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalle del Transportista</DialogTitle>
          </DialogHeader>
          {selectedTransportista && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600">Nombre Completo</Label>
                  <p className="mt-1">{selectedTransportista.nombreConductor}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Cédula</Label>
                  <p className="mt-1">{selectedTransportista.cedula}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Teléfono</Label>
                  <p className="mt-1">{selectedTransportista.telefono}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Email</Label>
                  <p className="mt-1">{selectedTransportista.email || 'No registrado'}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Empresa de Transporte</Label>
                  <p className="mt-1">{selectedTransportista.empresaTransporte}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Placa del Vehículo</Label>
                  <p className="mt-1 uppercase">{selectedTransportista.placaVehiculo}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Tipo de Vehículo</Label>
                  <p className="mt-1">{selectedTransportista.tipoVehiculo}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Marca/Modelo</Label>
                  <p className="mt-1">{selectedTransportista.marca} {selectedTransportista.modelo || ''}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Estado</Label>
                  <div className="mt-1">
                    <Badge variant={selectedTransportista.estado === 'Activo' ? 'default' : 'secondary'}>
                      {selectedTransportista.estado}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-600">Autorizado</Label>
                  <div className="mt-1">
                    {selectedTransportista.autorizado ? (
                      <Badge className="bg-green-100 text-green-700 border-0">Sí</Badge>
                    ) : (
                      <Badge variant="outline">No</Badge>
                    )}
                  </div>
                </div>
              </div>
              {selectedTransportista.observaciones && (
                <div>
                  <Label className="text-gray-600">Observaciones</Label>
                  <p className="mt-1 text-sm bg-gray-50 p-3 rounded">{selectedTransportista.observaciones}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
