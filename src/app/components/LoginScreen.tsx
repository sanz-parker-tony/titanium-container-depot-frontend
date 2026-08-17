import { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from "sonner";
import { Toaster } from './ui/sonner';
import { Check, X, Eye, EyeOff } from 'lucide-react';
import { Progress } from './ui/progress';

export type UserRole = 'cliente' | 'admin-operativo' | 'gerente' | 'accionista';

interface LoginScreenProps {
  onLogin: (username: string, role: UserRole) => void;
}

interface PasswordStrength {
  score: number; // 0-100
  level: 'weak' | 'medium' | 'strong';
  label: string;
  color: string;
  checks: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('cliente');
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Extract username from email (part before @)
    const username = email.split('@')[0] || email;
    onLogin(username, role);
  };

  // Calculate password strength
  const passwordStrength = useMemo((): PasswordStrength => {
    if (!newPassword) {
      return {
        score: 0,
        level: 'weak',
        label: 'Muy débil',
        color: '#ef4444',
        checks: {
          length: false,
          uppercase: false,
          lowercase: false,
          number: false,
          special: false,
        },
      };
    }

    const checks = {
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      lowercase: /[a-z]/.test(newPassword),
      number: /[0-9]/.test(newPassword),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    };

    const checkedCount = Object.values(checks).filter(Boolean).length;
    let score = 0;
    let level: 'weak' | 'medium' | 'strong' = 'weak';
    let label = 'Muy débil';
    let color = '#ef4444';

    if (checks.length) score += 20;
    if (checks.uppercase) score += 20;
    if (checks.lowercase) score += 20;
    if (checks.number) score += 20;
    if (checks.special) score += 20;

    if (score >= 80) {
      level = 'strong';
      label = 'Fuerte';
      color = '#22c55e';
    } else if (score >= 60) {
      level = 'medium';
      label = 'Media';
      color = '#eab308';
    } else if (score >= 40) {
      level = 'weak';
      label = 'Débil';
      color = '#f97316';
    }

    return { score, level, label, color, checks };
  }, [newPassword]);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword) {
      toast.error('Ingrese su contraseña actual');
      return;
    }

    if (!passwordStrength.checks.length) {
      toast.error('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (!passwordStrength.checks.uppercase) {
      toast.error('La contraseña debe contener al menos una mayúscula');
      return;
    }

    if (!passwordStrength.checks.lowercase) {
      toast.error('La contraseña debe contener al menos una minúscula');
      return;
    }

    if (!passwordStrength.checks.number) {
      toast.error('La contraseña debe contener al menos un número');
      return;
    }

    if (!passwordStrength.checks.special) {
      toast.error('La contraseña debe contener al menos un carácter especial');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (passwordStrength.level === 'weak') {
      toast.error('La contraseña es demasiado débil. Por favor use una contraseña más segura.');
      return;
    }

    // Simulate password change
    toast.success('Contraseña cambiada exitosamente');
    setShowPasswordDialog(false);
    setResetEmail('');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <CardTitle>Sistema de Gestión de Contenedores</CardTitle>
          <CardDescription>Ingresa tus credenciales para continuar</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Usuario / Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="usuario@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Tipo de Usuario</Label>
              <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cliente">Cliente</SelectItem>
                  <SelectItem value="admin-operativo">Administrador Operativo</SelectItem>
                  <SelectItem value="gerente">Gerente Propietario</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              Iniciar sesión
            </Button>
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowPasswordDialog(true)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Dialog para cambiar contraseña */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Cambiar Contraseña</DialogTitle>
            <DialogDescription>
              Ingresa tu información para cambiar tu contraseña de forma segura
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePasswordChange}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email / Usuario</Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="usuario@ejemplo.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="current-password">Contraseña Actual</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">Nueva Contraseña</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Barra de seguridad */}
                {newPassword && (
                  <div className="space-y-2 mt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Seguridad de la contraseña:
                      </span>
                      <span 
                        className="text-sm font-medium"
                        style={{ color: passwordStrength.color }}
                      >
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-300 rounded-full"
                        style={{
                          width: `${passwordStrength.score}%`,
                          backgroundColor: passwordStrength.color,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Requisitos de la contraseña */}
                <div className="space-y-2 mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-700 mb-2">
                    La contraseña debe contener:
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {passwordStrength.checks.length ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-gray-400" />
                      )}
                      <span className={`text-xs ${passwordStrength.checks.length ? 'text-green-600' : 'text-gray-500'}`}>
                        Mínimo 8 caracteres
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {passwordStrength.checks.uppercase ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-gray-400" />
                      )}
                      <span className={`text-xs ${passwordStrength.checks.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                        Al menos una letra mayúscula (A-Z)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {passwordStrength.checks.lowercase ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-gray-400" />
                      )}
                      <span className={`text-xs ${passwordStrength.checks.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                        Al menos una letra minúscula (a-z)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {passwordStrength.checks.number ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-gray-400" />
                      )}
                      <span className={`text-xs ${passwordStrength.checks.number ? 'text-green-600' : 'text-gray-500'}`}>
                        Al menos un número (0-9)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {passwordStrength.checks.special ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-gray-400" />
                      )}
                      <span className={`text-xs ${passwordStrength.checks.special ? 'text-green-600' : 'text-gray-500'}`}>
                        Al menos un carácter especial (!@#$%^&*...)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Nueva Contraseña</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <X className="h-3 w-3" />
                    Las contraseñas no coinciden
                  </p>
                )}
                {confirmPassword && newPassword === confirmPassword && (
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    Las contraseñas coinciden
                  </p>
                )}
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowPasswordDialog(false);
                  setResetEmail('');
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setShowCurrentPassword(false);
                  setShowNewPassword(false);
                  setShowConfirmPassword(false);
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">
                Cambiar Contraseña
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Toaster position="top-right" />
    </div>
  );
}
