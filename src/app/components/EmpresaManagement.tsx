import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Save, AlertCircle, Plus, Edit, Trash2, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface Contacto {
  id: string;
  nombre: string;
  cargo: string;
  telefono: string;
  email: string;
  observaciones?: string;
}

interface EmpresaData {
  ruc: string;
  razonSocial: string;
  nombreComercial: string;
  tipoCliente: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  referencia: string;
  latitud?: string;
  longitud?: string;
  telefonoFijo: string;
  telefonoMovil: string;
  emailPrincipal: string;
  emailAlternativo: string;
  sitioWeb: string;
  horarioAtencion: string;
}

const mockContactos: Contacto[] = [
  {
    id: '1',
    nombre: 'Ana Martínez',
    cargo: 'Jefe de Operaciones',
    telefono: '+593 99 888 7777',
    email: 'amartinez@empresa.com',
  },
  {
    id: '2',
    nombre: 'Roberto Silva',
    cargo: 'Asistente Logístico',
    telefono: '+593 98 777 6666',
    email: 'rsilva@empresa.com',
    observaciones: 'Turno de noche',
  },
];

export function EmpresaManagement() {
  const [empresaData, setEmpresaData] = useState<EmpresaData>({
    ruc: '0992345678001',
    razonSocial: 'COMERCIALIZADORA INTERNACIONAL S.A.',
    nombreComercial: 'COMINTER',
    tipoCliente: 'Importador',
    direccion: 'Av. Francisco de Orellana, Km 2.5',
    ciudad: 'Guayaquil',
    provincia: 'Guayas',
    referencia: 'Frente al Puerto Marítimo',
    latitud: '-2.1894',
    longitud: '-79.8886',
    telefonoFijo: '+593 4 123 4567',
    telefonoMovil: '+593 99 123 4567',
    emailPrincipal: 'operaciones@cominter.com',
    emailAlternativo: 'admin@cominter.com',
    sitioWeb: 'www.cominter.com.ec',
    horarioAtencion: 'Lunes a Viernes 08:00 - 17:00',
  });

  const [contactos, setContactos] = useState<Contacto[]>(mockContactos);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [editingContacto, setEditingContacto] = useState<Contacto | null>(null);
  const [contactoFormData, setContactoFormData] = useState<Partial<Contacto>>({});
  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (field: keyof EmpresaData, value: string) => {
    setEmpresaData({ ...empresaData, [field]: value });
    setHasChanges(true);
  };

  const handleSave = () => {
    // Validaciones
    if (!empresaData.ruc || empresaData.ruc.length !== 13) {
      toast.error('El RUC debe tener 13 dígitos');
      return;
    }
    if (!empresaData.razonSocial) {
      toast.error('La razón social es obligatoria');
      return;
    }
    if (!empresaData.emailPrincipal || !empresaData.telefonoMovil) {
      toast.error('Debe ingresar al menos un correo y un teléfono');
      return;
    }

    // Simular guardado
    toast.success('Datos de la empresa actualizados correctamente');
    setHasChanges(false);
  };

  const handleNewContacto = () => {
    setEditingContacto(null);
    setContactoFormData({});
    setIsContactDialogOpen(true);
  };

  const handleEditContacto = (contacto: Contacto) => {
    setEditingContacto(contacto);
    setContactoFormData(contacto);
    setIsContactDialogOpen(true);
  };

  const handleDeleteContacto = (id: string) => {
    if (confirm('¿Está seguro de eliminar este contacto?')) {
      setContactos(contactos.filter(c => c.id !== id));
      toast.success('Contacto eliminado');
    }
  };

  const handleSaveContacto = () => {
    if (!contactoFormData.nombre || !contactoFormData.telefono || !contactoFormData.email) {
      toast.error('Complete los campos obligatorios');
      return;
    }

    if (editingContacto) {
      setContactos(contactos.map(c => c.id === editingContacto.id ? { ...contactoFormData, id: c.id } as Contacto : c));
      toast.success('Contacto actualizado');
    } else {
      const newContacto: Contacto = {
        ...contactoFormData,
        id: Date.now().toString(),
      } as Contacto;
      setContactos([...contactos, newContacto]);
      toast.success('Contacto agregado');
    }

    setIsContactDialogOpen(false);
    setContactoFormData({});
  };

  const isDataIncomplete = !empresaData.ruc || !empresaData.razonSocial || !empresaData.emailPrincipal || !empresaData.telefonoMovil;

  return (
    <div className="p-6 space-y-6">
      {/* Encabezado */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl mb-2">Datos de la Empresa</h1>
          <p className="text-sm text-gray-600">
            Mantenga actualizada la información de su empresa. Estos datos serán utilizados al momento de generar o agendar reservas.
          </p>
        </div>
        <Button onClick={handleSave} className="gap-2" disabled={!hasChanges}>
          <Save className="h-4 w-4" />
          Guardar cambios
        </Button>
      </div>

      {/* Alerta de datos incompletos */}
      {isDataIncomplete && (
        <Card className="border-yellow-300 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm">Faltan datos obligatorios para agendar reservas. Complete el RUC, razón social, correo y teléfono.</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formulario principal con tabs */}
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="generales" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="generales">Datos Generales</TabsTrigger>
              <TabsTrigger value="ubicacion">Ubicación</TabsTrigger>
              <TabsTrigger value="contacto">Contacto</TabsTrigger>
              <TabsTrigger value="referencias">Contactos de Referencia</TabsTrigger>
            </TabsList>

            {/* Tab: Datos Generales */}
            <TabsContent value="generales" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>RUC *</Label>
                  <Input
                    value={empresaData.ruc}
                    onChange={(e) => handleInputChange('ruc', e.target.value)}
                    placeholder="0992345678001"
                    maxLength={13}
                  />
                  <p className="text-xs text-gray-500 mt-1">13 dígitos</p>
                </div>
                <div>
                  <Label>Tipo de Cliente *</Label>
                  <Select
                    value={empresaData.tipoCliente}
                    onValueChange={(value) => handleInputChange('tipoCliente', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Importador">Importador</SelectItem>
                      <SelectItem value="Exportador">Exportador</SelectItem>
                      <SelectItem value="Naviera">Naviera</SelectItem>
                      <SelectItem value="Línea de transporte">Línea de transporte</SelectItem>
                      <SelectItem value="Agencia">Agencia</SelectItem>
                      <SelectItem value="Almacenadora">Almacenadora</SelectItem>
                      <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label>Razón Social *</Label>
                  <Input
                    value={empresaData.razonSocial}
                    onChange={(e) => handleInputChange('razonSocial', e.target.value)}
                    placeholder="Nombre legal según SRI"
                  />
                </div>
                <div className="col-span-2">
                  <Label>Nombre Comercial</Label>
                  <Input
                    value={empresaData.nombreComercial}
                    onChange={(e) => handleInputChange('nombreComercial', e.target.value)}
                    placeholder="Nombre comercial (si difiere de la razón social)"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Tab: Ubicación */}
            <TabsContent value="ubicacion" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label>Dirección Física *</Label>
                  <Input
                    value={empresaData.direccion}
                    onChange={(e) => handleInputChange('direccion', e.target.value)}
                    placeholder="Calle, número, intersección"
                  />
                </div>
                <div>
                  <Label>Provincia *</Label>
                  <Select
                    value={empresaData.provincia}
                    onValueChange={(value) => handleInputChange('provincia', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Guayas">Guayas</SelectItem>
                      <SelectItem value="Pichincha">Pichincha</SelectItem>
                      <SelectItem value="Azuay">Azuay</SelectItem>
                      <SelectItem value="Manabí">Manabí</SelectItem>
                      <SelectItem value="El Oro">El Oro</SelectItem>
                      <SelectItem value="Los Ríos">Los Ríos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Ciudad / Cantón *</Label>
                  <Input
                    value={empresaData.ciudad}
                    onChange={(e) => handleInputChange('ciudad', e.target.value)}
                    placeholder="Ej: Guayaquil"
                  />
                </div>
                <div className="col-span-2">
                  <Label>Referencia de Ubicación</Label>
                  <Input
                    value={empresaData.referencia}
                    onChange={(e) => handleInputChange('referencia', e.target.value)}
                    placeholder="Punto de referencia cercano"
                  />
                </div>
                <div>
                  <Label>Latitud</Label>
                  <Input
                    value={empresaData.latitud || ''}
                    onChange={(e) => handleInputChange('latitud', e.target.value)}
                    placeholder="-2.1894"
                  />
                </div>
                <div>
                  <Label>Longitud</Label>
                  <Input
                    value={empresaData.longitud || ''}
                    onChange={(e) => handleInputChange('longitud', e.target.value)}
                    placeholder="-79.8886"
                  />
                </div>
              </div>

              {/* Mapa placeholder */}
              <Card className="bg-gray-50 border-dashed">
                <CardContent className="p-6 text-center">
                  <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-2">Mapa Interactivo</p>
                  <p className="text-xs text-gray-500">
                    {empresaData.latitud && empresaData.longitud 
                      ? `Ubicación: ${empresaData.latitud}, ${empresaData.longitud}`
                      : 'Haga clic para marcar su ubicación en el mapa'}
                  </p>
                  <Button variant="outline" size="sm" className="mt-3">
                    Marcar Ubicación
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Contacto */}
            <TabsContent value="contacto" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Teléfono Fijo</Label>
                  <Input
                    value={empresaData.telefonoFijo}
                    onChange={(e) => handleInputChange('telefonoFijo', e.target.value)}
                    placeholder="+593 4 123 4567"
                  />
                </div>
                <div>
                  <Label>Teléfono Móvil / WhatsApp *</Label>
                  <Input
                    value={empresaData.telefonoMovil}
                    onChange={(e) => handleInputChange('telefonoMovil', e.target.value)}
                    placeholder="+593 99 123 4567"
                  />
                </div>
                <div>
                  <Label>Correo Principal *</Label>
                  <Input
                    type="email"
                    value={empresaData.emailPrincipal}
                    onChange={(e) => handleInputChange('emailPrincipal', e.target.value)}
                    placeholder="operaciones@empresa.com"
                  />
                </div>
                <div>
                  <Label>Correo Alternativo / Administrativo</Label>
                  <Input
                    type="email"
                    value={empresaData.emailAlternativo}
                    onChange={(e) => handleInputChange('emailAlternativo', e.target.value)}
                    placeholder="admin@empresa.com"
                  />
                </div>
                <div>
                  <Label>Sitio Web</Label>
                  <Input
                    value={empresaData.sitioWeb}
                    onChange={(e) => handleInputChange('sitioWeb', e.target.value)}
                    placeholder="www.empresa.com"
                  />
                </div>
                <div>
                  <Label>Horario de Atención</Label>
                  <Input
                    value={empresaData.horarioAtencion}
                    onChange={(e) => handleInputChange('horarioAtencion', e.target.value)}
                    placeholder="Lunes a Viernes 08:00 - 17:00"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Tab: Contactos de Referencia */}
            <TabsContent value="referencias" className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">Registre los contactos clave de su empresa</p>
                <Button onClick={handleNewContacto} size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Agregar Contacto
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Cargo / Área</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Observaciones</TableHead>
                    <TableHead className="text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contactos.map((contacto) => (
                    <TableRow key={contacto.id}>
                      <TableCell>{contacto.nombre}</TableCell>
                      <TableCell>{contacto.cargo}</TableCell>
                      <TableCell>{contacto.telefono}</TableCell>
                      <TableCell>{contacto.email}</TableCell>
                      <TableCell>{contacto.observaciones || '-'}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditContacto(contacto)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteContacto(contacto.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {contactos.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No hay contactos registrados
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dialog para Contactos */}
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingContacto ? 'Editar Contacto' : 'Nuevo Contacto'}</DialogTitle>
            <DialogDescription>Complete la información del contacto de referencia</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nombre Completo *</Label>
              <Input
                value={contactoFormData.nombre || ''}
                onChange={(e) => setContactoFormData({ ...contactoFormData, nombre: e.target.value })}
                placeholder="Ej: Ana Martínez"
              />
            </div>
            <div>
              <Label>Cargo / Área *</Label>
              <Input
                value={contactoFormData.cargo || ''}
                onChange={(e) => setContactoFormData({ ...contactoFormData, cargo: e.target.value })}
                placeholder="Ej: Jefe de Operaciones"
              />
            </div>
            <div>
              <Label>Teléfono / Celular *</Label>
              <Input
                value={contactoFormData.telefono || ''}
                onChange={(e) => setContactoFormData({ ...contactoFormData, telefono: e.target.value })}
                placeholder="+593 99 888 7777"
              />
            </div>
            <div>
              <Label>Correo Electrónico *</Label>
              <Input
                type="email"
                value={contactoFormData.email || ''}
                onChange={(e) => setContactoFormData({ ...contactoFormData, email: e.target.value })}
                placeholder="contacto@empresa.com"
              />
            </div>
            <div>
              <Label>Observaciones</Label>
              <Textarea
                value={contactoFormData.observaciones || ''}
                onChange={(e) => setContactoFormData({ ...contactoFormData, observaciones: e.target.value })}
                placeholder="Turnos, idioma, disponibilidad, etc."
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setIsContactDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveContacto}>
              Guardar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
