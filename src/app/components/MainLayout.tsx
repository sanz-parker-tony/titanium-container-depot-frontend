import { ReactNode, useState } from 'react';
import { 
  LayoutDashboard,
  FileText, 
  Truck, 
  Building2, 
  Users, 
  Lock, 
  Clock, 
  Menu,
  X,
  ChevronRight,
  LogOut,
  User,
  Activity,
  Calendar,
  Map,
  Bell,
  DollarSign,
  Settings,
  Wrench,
  TrendingUp,
  CreditCard,
  BarChart3,
  Target,
  Gift,
  Shield,
  CalendarClock,
  PieChart,
  Rocket,
  Wallet,
  FileSpreadsheet,
  Leaf
} from 'lucide-react';
import { Button } from './ui/button';
import { UserRole } from './LoginScreen';
import { NotificationBell } from './NotificationBell';

interface MainLayoutProps {
  children: ReactNode;
  onLogout: () => void;
  currentPage?: string;
  username?: string;
  onNavigate?: (page: string) => void;
  userRole?: UserRole;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
}

export function MainLayout({ children, onLogout, currentPage = 'dashboard', username = 'Usuario', onNavigate, userRole = 'cliente' }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Menú Cliente
  const clienteMenuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: 'reservas', label: 'Reservas', icon: <FileText className="h-5 w-5" /> },
    { id: 'transportistas', label: 'Transportistas', icon: <Users className="h-5 w-5" /> },
    { id: 'empresa', label: 'Empresa', icon: <Building2 className="h-5 w-5" /> },
    { id: 'gestion-turno', label: 'Gestión de Turnos', icon: <Clock className="h-5 w-5" /> },
  ];

  // Menú Administrador Operativo
  const adminOperativoMenuItems: MenuItem[] = [
    { id: 'operaciones-tiempo-real', label: 'Panel de Operaciones', icon: <Activity className="h-5 w-5" /> },
    { id: 'agenda-reservas', label: 'Agenda de Reservas', icon: <Calendar className="h-5 w-5" /> },
    { id: 'control-patio', label: 'Control de Patio', icon: <Map className="h-5 w-5" /> },
    { id: 'gestion-clientes', label: 'Gestión de Clientes', icon: <Users className="h-5 w-5" /> },
    { id: 'alertas-notificaciones', label: 'Alertas y Notificaciones', icon: <Bell className="h-5 w-5" /> },
    { id: 'facturacion-cobros', label: 'Facturación y Cobros', icon: <DollarSign className="h-5 w-5" /> },
    { id: 'configuracion-tarifas', label: 'Configuración de Tarifas', icon: <Settings className="h-5 w-5" /> },
    { id: 'gestion-equipos', label: 'Gestión de Equipos', icon: <Wrench className="h-5 w-5" /> },
  ];

  // Menú Gerente Propietario
  const gerenteMenuItems: MenuItem[] = [
    { id: 'dashboard-ejecutivo', label: 'Dashboard Ejecutivo', icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: 'panel-financiero', label: 'Panel Financiero Avanzado', icon: <TrendingUp className="h-5 w-5" /> },
    { id: 'estado-cuentas', label: 'Estado de Cuentas', icon: <CreditCard className="h-5 w-5" /> },
    { id: 'tendencias-demanda', label: 'Tendencias y Demanda', icon: <BarChart3 className="h-5 w-5" /> },
    { id: 'analisis-comercial', label: 'Análisis Comercial', icon: <Target className="h-5 w-5" /> },
    { id: 'promociones', label: 'Promociones e Incentivos', icon: <Gift className="h-5 w-5" /> },
    { id: 'auditoria', label: 'Auditoría y Seguridad', icon: <Shield className="h-5 w-5" /> },
    { id: 'planeacion-operativa', label: 'Planeación Operativa', icon: <CalendarClock className="h-5 w-5" /> },
  ];

  // Menú Accionista / Inversor
  const accionistaMenuItems: MenuItem[] = [
    { id: 'rentabilidad', label: 'Panel de Rentabilidad', icon: <PieChart className="h-5 w-5" /> },
    { id: 'crecimiento', label: 'Panel de Crecimiento', icon: <Rocket className="h-5 w-5" /> },
    { id: 'expansion-capacidad', label: 'Expansión / Capacidad', icon: <Building2 className="h-5 w-5" /> },
    { id: 'cartera-global', label: 'Cartera Global', icon: <Wallet className="h-5 w-5" /> },
    { id: 'reporte-consolidado', label: 'Reporte Consolidado', icon: <FileSpreadsheet className="h-5 w-5" /> },
    { id: 'sostenibilidad', label: 'Sostenibilidad', icon: <Leaf className="h-5 w-5" /> },
  ];

  // Seleccionar menú según el rol
  const getMenuItems = () => {
    switch (userRole) {
      case 'admin-operativo':
        return adminOperativoMenuItems;
      case 'gerente':
        return gerenteMenuItems;
      case 'accionista':
        return accionistaMenuItems;
      default:
        return clienteMenuItems;
    }
  };

  const menuItems = getMenuItems();

  const handleMenuClick = (id: string) => {
    const implementedPages = [
      'dashboard', 
      'reservas', 
      'dashboard-ejecutivo', 
      'operaciones-tiempo-real',
      'transportistas',
      'empresa',
      'gestion-turno',
      'agenda-reservas',
      'control-patio',
      'gestion-clientes',
      'alertas-notificaciones',
      'facturacion-cobros',
      'configuracion-tarifas',
      'gestion-equipos',
      'estado-cuentas',
      'tendencias-demanda',
      'analisis-comercial',
      'promociones',
      'auditoria',
      'planeacion-operativa',
      'panel-financiero'
    ];
    
    if (onNavigate) {
      onNavigate(id);
    } else if (!implementedPages.includes(id)) {
      alert(`Navegando a: ${menuItems.find(m => m.id === id)?.label}\n(Funcionalidad en desarrollo)`);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`
          ${sidebarOpen ? 'w-64' : 'w-20'}
          bg-white shadow-lg transition-all duration-300 ease-in-out flex flex-col shrink-0
        `}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
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
              <div>
                <h2 className="text-sm">Patio Contenedores</h2>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-2 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleMenuClick(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                    ${
                      currentPage === item.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'hover:bg-gray-100 text-gray-700'
                    }
                  `}
                >
                  {item.icon}
                  {sidebarOpen && (
                    <>
                      <span className="flex-1 text-left text-sm">{item.label}</span>
                      {currentPage === item.id && (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto flex flex-col">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-lg">Patio de Contenedores</h2>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell userRole={userRole} />
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
              <User className="h-4 w-4 text-gray-600" />
              <div className="flex flex-col">
                <span className="text-sm">{username}</span>
                <span className="text-xs text-gray-500">
                  {userRole === 'cliente' && 'Cliente'}
                  {userRole === 'admin-operativo' && 'Admin Operativo'}
                  {userRole === 'gerente' && 'Gerente'}
                  {userRole === 'accionista' && 'Accionista'}
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </Button>
          </div>
        </div>
        
        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
