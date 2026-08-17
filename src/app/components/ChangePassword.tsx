import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

interface ChangePasswordProps {
  onLogout: () => void;
}

export function ChangePassword({ onLogout }: ChangePasswordProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Calcular la fuerza de la contraseña
  const calculatePasswordStrength = (password: string): { level: number; label: string; color: string } => {
    if (password.length === 0) return { level: 0, label: '', color: '' };
    
    let strength = 0;
    
    // Criterios de fuerza
    if (password.length >= 8) strength += 25;
    if (password.length >= 10) strength += 10;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 20;
    
    if (strength <= 35) {
      return { level: strength, label: 'Débil', color: 'bg-red-500' };
    } else if (strength <= 70) {
      return { level: strength, label: 'Media', color: 'bg-yellow-500' };
    } else {
      return { level: strength, label: 'Fuerte', color: 'bg-green-500' };
    }
  };

  const passwordStrength = calculatePasswordStrength(newPassword);

  // Validaciones
  const validateForm = (): { isValid: boolean; message?: string } => {
    if (!currentPassword) {
      return { isValid: false, message: 'Debe ingresar su contraseña actual' };
    }

    // Simular validación de contraseña actual (en producción se valida contra el backend)
    // Para este ejemplo, aceptamos cualquier valor
    
    if (!newPassword) {
      return { isValid: false, message: 'Debe ingresar una nueva contraseña' };
    }

    if (newPassword.length < 8) {
      return { isValid: false, message: 'La nueva contraseña debe tener al menos 8 caracteres' };
    }

    if (!/[A-Z]/.test(newPassword)) {
      return { isValid: false, message: 'La contraseña debe contener al menos una letra mayúscula' };
    }

    if (!/[0-9]/.test(newPassword)) {
      return { isValid: false, message: 'La contraseña debe contener al menos un número' };
    }

    if (!/[^a-zA-Z0-9]/.test(newPassword)) {
      return { isValid: false, message: 'La contraseña debe contener al menos un símbolo especial' };
    }

    if (currentPassword === newPassword) {
      return { isValid: false, message: 'La nueva contraseña no puede ser igual a la actual' };
    }

    if (!confirmPassword) {
      return { isValid: false, message: 'Debe confirmar la nueva contraseña' };
    }

    if (newPassword !== confirmPassword) {
      return { isValid: false, message: 'Las contraseñas no coinciden' };
    }

    return { isValid: true };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateForm();
    
    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }

    // Simular cambio de contraseña exitoso
    toast.success('Contraseña actualizada correctamente. Será redirigido al inicio de sesión.');
    
    // Cerrar sesión después de 2 segundos
    setTimeout(() => {
      onLogout();
    }, 2000);
  };

  const handleCancel = () => {
    // Redirigir al login
    onLogout();
  };

  const isFormValid = validateForm().isValid;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="p-8">
          {/* Icono y título */}
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl mb-2">Cambiar Contraseña</h2>
            <p className="text-sm text-gray-600">
              Por favor, actualice su contraseña para mantener la seguridad de su cuenta.
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Contraseña actual */}
            <div>
              <Label htmlFor="currentPassword">Contraseña Actual *</Label>
              <div className="relative mt-1">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Lock className="h-4 w-4" />
                </div>
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Ingrese su contraseña actual"
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Nueva contraseña */}
            <div>
              <Label htmlFor="newPassword">Nueva Contraseña *</Label>
              <div className="relative mt-1">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Lock className="h-4 w-4" />
                </div>
                <Input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Ingrese su nueva contraseña"
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Indicador de fuerza de contraseña */}
              {newPassword && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Seguridad de la contraseña:</span>
                    <span className={`
                      ${passwordStrength.level <= 35 ? 'text-red-600' : ''}
                      ${passwordStrength.level > 35 && passwordStrength.level <= 70 ? 'text-yellow-600' : ''}
                      ${passwordStrength.level > 70 ? 'text-green-600' : ''}
                    `}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <Progress value={passwordStrength.level} className="h-2" />
                  <p className="text-xs text-gray-500 mt-2">
                    Use al menos una letra mayúscula, un número y un símbolo para mayor seguridad.
                  </p>
                </div>
              )}
            </div>

            {/* Confirmar nueva contraseña */}
            <div>
              <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña *</Label>
              <div className="relative mt-1">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Lock className="h-4 w-4" />
                </div>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirme su nueva contraseña"
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-red-600 mt-1">Las contraseñas no coinciden</p>
              )}
              {confirmPassword && newPassword === confirmPassword && (
                <p className="text-xs text-green-600 mt-1">✓ Las contraseñas coinciden</p>
              )}
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                disabled={!isFormValid}
              >
                Guardar nueva contraseña
              </Button>
            </div>
          </form>

          {/* Nota de seguridad */}
          <div className="mt-6 pt-6 border-t text-center text-xs text-gray-500">
            Por seguridad, será necesario iniciar sesión nuevamente después de cambiar su contraseña.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
