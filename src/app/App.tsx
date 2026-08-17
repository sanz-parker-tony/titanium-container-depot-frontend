import { useState } from "react";
import { LoginScreen, UserRole } from "./components/LoginScreen";
import { BookingList, Booking } from "./components/BookingList";
import { TicketForm } from "./components/TicketForm";
import { PaymentModal } from "./components/PaymentModal";
import { ViewTicketModal } from "./components/ViewTicketModal";
import { PaymentRegistrationModal } from "./components/PaymentRegistrationModal";
import { MainLayout } from "./components/MainLayout";
import { Dashboard } from "./components/Dashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { OperationalDashboard } from "./components/OperationalDashboard";
import { TransportistasManagement } from "./components/TransportistasManagement";
import { EmpresaManagement } from "./components/EmpresaManagement";
import { GestionTurno } from "./components/GestionTurno";
import { AgendaReservas } from "./components/AgendaReservas";
import { PanelFinancieroAvanzado } from "./components/PanelFinancieroAvanzado";
import { ControlPatio } from "./components/ControlPatio";
import { GestionClientes } from "./components/GestionClientes";
import { AlertasNotificaciones } from "./components/AlertasNotificaciones";
import { FacturacionCobros } from "./components/FacturacionCobros";
import { ConfiguracionTarifas } from "./components/ConfiguracionTarifas";
import { GestionEquipos } from "./components/GestionEquipos";
import { EstadoCuentas } from "./components/EstadoCuentas";
import { TendenciasDemanda } from "./components/TendenciasDemanda";
import { AnalisisComercial } from "./components/AnalisisComercial";
import { PromocionesIncentivos } from "./components/PromocionesIncentivos";
import { AuditoriaSeguridad } from "./components/AuditoriaSeguridad";
import { PlaneacionOperativa } from "./components/PlaneacionOperativa";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import JsBarcode from "jsbarcode";
import QRCode from "qrcode";
import { format } from "date-fns";
import { es } from "date-fns/locale";

type Screen = "login" | "dashboard" | "dashboard-ejecutivo" | "operaciones-tiempo-real" | "list" | "form" | "transportistas" | "empresa" | "gestion-turno" | "agenda-reservas" | "control-patio" | "gestion-clientes" | "alertas-notificaciones" | "facturacion-cobros" | "configuracion-tarifas" | "gestion-equipos" | "estado-cuentas" | "tendencias-demanda" | "analisis-comercial" | "promociones" | "auditoria" | "planeacion-operativa" | "panel-financiero";

// Generate unique 15-digit booking code
const generateBookingCode = () => {
  return Math.floor(
    100000000000000 + Math.random() * 900000000000000,
  ).toString();
};

// Mock data for initial bookings
const initialBookings: Booking[] = [
  {
    id: "001",
    bookingCode: "123456789012345",
    ticketCode: "TCK-001",
    fechaReserva: "2025-10-10",
    fechaTicket: "2025-10-15",
    horario: "08:00-1",
    estado: "Agendado",
    operacion: "Importación",
    ultimaActualizacion: "Hace 2 horas",
    pagado: true,
    condicionesPago: "30 días",
    ticketData: {
      contenedor: "TCLU1234567",
      tipoContenedor: "40HC",
      deposito: "Patio Central",
      linea: "Maersk",
      tipoDeposito: "Patio Seco",
      clienteId: "0912345678001",
      clienteNombre: "Empresa ABC S.A.",
      choferNombre: "Juan Pérez",
      choferCedula: "0912345678",
      vehiculoPlaca: "ABC-1234",
    },
  },
  {
    id: "002",
    bookingCode: "234567890123456",
    ticketCode: "",
    fechaReserva: "2025-10-12",
    estado: "Reservado",
    operacion: "Exportación",
    ultimaActualizacion: "Hace 1 día",
    pagado: false,
  },
  {
    id: "003",
    bookingCode: "345678901234567",
    ticketCode: "TCK-002",
    fechaReserva: "2025-10-11",
    fechaTicket: "2025-10-14",
    horario: "14:00-2",
    estado: "Finalizado",
    operacion: "Exportación",
    ultimaActualizacion: "Hace 3 días",
    pagado: true,
    ticketData: {
      contenedor: "MSCU9876543",
      tipoContenedor: "20DC",
      deposito: "Patio Norte",
      linea: "MSC",
      tipoDeposito: "Refrigerado",
      clienteId: "0987654321001",
      clienteNombre: "Comercial XYZ Ltda.",
      choferNombre: "María García",
      choferCedula: "0987654321",
      vehiculoPlaca: "XYZ-5678",
    },
  },
  {
    id: "004",
    bookingCode: "456789012345678",
    ticketCode: "TCK-003",
    fechaReserva: "2025-10-13",
    fechaTicket: "2025-10-17",
    horario: "10:30-3",
    estado: "Agendado",
    operacion: "Importación",
    ultimaActualizacion: "Hace 5 horas",
    pagado: false,
    condicionesPago: "60 días",
    ticketData: {
      contenedor: "HLCU5555555",
      tipoContenedor: "40DC",
      deposito: "Patio Sur",
      linea: "Hapag-Lloyd",
      tipoDeposito: "Patio Seco",
      clienteId: "0923456789001",
      clienteNombre: "Logística 123 S.A.",
      choferNombre: "Pedro Ramírez",
      choferCedula: "0923456789",
      vehiculoPlaca: "GHI-9012",
    },
  },
  {
    id: "005",
    bookingCode: "567890123456789",
    ticketCode: "",
    fechaReserva: "2025-10-14",
    estado: "Reservado",
    operacion: "Importación",
    ultimaActualizacion: "Hace 1 hora",
    pagado: false,
  },
];

export default function App() {
  const [currentScreen, setCurrentScreen] =
    useState<Screen>("login");
  const [bookings, setBookings] =
    useState<Booking[]>(initialBookings);
  const [editingBooking, setEditingBooking] =
    useState<Booking | null>(null);
  const [viewingBooking, setViewingBooking] =
    useState<Booking | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] =
    useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [
    showPaymentRegistrationModal,
    setShowPaymentRegistrationModal,
  ] = useState(false);
  const [bookingForPayment, setBookingForPayment] =
    useState<Booking | null>(null);
  const [lastCreatedTicket, setLastCreatedTicket] =
    useState<any>(null);
  const [currentUser, setCurrentUser] = useState<string>("");
  const [userRole, setUserRole] = useState<UserRole>('cliente');

  const handleLogin = (username?: string, role: UserRole = 'cliente') => {
    setCurrentUser(username || "Usuario");
    setUserRole(role);
    
    // Redirigir según el rol
    if (role === 'gerente' || role === 'accionista') {
      setCurrentScreen('dashboard-ejecutivo');
    } else if (role === 'admin-operativo') {
      setCurrentScreen('operaciones-tiempo-real');
    } else {
      setCurrentScreen('dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser("");
    setUserRole('cliente');
    setCurrentScreen("login");
  };

  const handleNavigate = (page: string) => {
    if (page === 'dashboard') {
      setCurrentScreen('dashboard');
    } else if (page === 'dashboard-ejecutivo') {
      setCurrentScreen('dashboard-ejecutivo');
    } else if (page === 'operaciones-tiempo-real') {
      setCurrentScreen('operaciones-tiempo-real');
    } else if (page === 'reservas') {
      setCurrentScreen('list');
    } else if (page === 'transportistas') {
      setCurrentScreen('transportistas');
    } else if (page === 'empresa') {
      setCurrentScreen('empresa');
    } else if (page === 'gestion-turno') {
      setCurrentScreen('gestion-turno');
    } else if (page === 'panel-financiero') {
      setCurrentScreen('panel-financiero');
    } else if (page === 'agenda-reservas') {
      setCurrentScreen('agenda-reservas');
    } else if (page === 'control-patio') {
      setCurrentScreen('control-patio');
    } else if (page === 'gestion-clientes') {
      setCurrentScreen('gestion-clientes');
    } else if (page === 'alertas-notificaciones') {
      setCurrentScreen('alertas-notificaciones');
    } else if (page === 'facturacion-cobros') {
      setCurrentScreen('facturacion-cobros');
    } else if (page === 'configuracion-tarifas') {
      setCurrentScreen('configuracion-tarifas');
    } else if (page === 'gestion-equipos') {
      setCurrentScreen('gestion-equipos');
    } else if (page === 'estado-cuentas') {
      setCurrentScreen('estado-cuentas');
    } else if (page === 'tendencias-demanda') {
      setCurrentScreen('tendencias-demanda');
    } else if (page === 'analisis-comercial') {
      setCurrentScreen('analisis-comercial');
    } else if (page === 'promociones') {
      setCurrentScreen('promociones');
    } else if (page === 'auditoria') {
      setCurrentScreen('auditoria');
    } else if (page === 'planeacion-operativa') {
      setCurrentScreen('planeacion-operativa');
    } else {
      // Other pages - show alert for now
      alert(`Navegando a: ${page}\n(Funcionalidad en desarrollo)`);
    }
  };

  const handleCreateTicket = (booking: Booking) => {
    setEditingBooking(booking);
    setIsEditing(false);
    setCurrentScreen("form");
  };

  const handleEditTicket = (booking: Booking) => {
    setEditingBooking(booking);
    setIsEditing(true);
    setCurrentScreen("form");
  };

  const handleViewTicket = (booking: Booking) => {
    setViewingBooking(booking);
    setShowViewModal(true);
  };

  const handleDeleteTicket = (id: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              ticketCode: "",
              fechaTicket: undefined,
              horario: undefined,
              estado: "Reservado" as const,
              pagado: false,
              ticketData: undefined,
            }
          : b,
      ),
    );
    toast.success("Ticket eliminado correctamente");
  };

  const handleRegisterPayment = (id: string) => {
    const booking = bookings.find((b) => b.id === id);
    if (booking) {
      setBookingForPayment(booking);
      setShowPaymentRegistrationModal(true);
    }
  };

  const handlePaymentConfirm = (paymentData: {
    bookingId: string;
    method: "transfer" | "card";
    reference?: string;
    file?: File;
  }) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === paymentData.bookingId
          ? { ...b, pagado: true }
          : b,
      ),
    );
    setShowPaymentRegistrationModal(false);
    setBookingForPayment(null);
    toast.success(
      `Pago registrado exitosamente. Referencia: ${paymentData.reference}`,
    );
  };

  const handleDownloadPDF = (booking: Booking) => {
    if (booking.ticketData) {
      generateTicketPDF(booking, booking.ticketData);
      toast.success("PDF descargado correctamente");
    }
  };

  const handleSaveTicket = (ticketData: {
    contenedor: string;
    tipoContenedor: string;
    operacion: string;
    deposito: string;
    linea: string;
    tipoDeposito: string;
    clienteId: string;
    clienteNombre: string;
    choferNombre: string;
    choferCedula: string;
    vehiculoPlaca: string;
    vehiculoFoto?: File;
    fecha: Date;
    horario: string;
  }) => {
    if (!editingBooking) return;

    // Generate ticket code if creating new
    const ticketCode =
      editingBooking.ticketCode ||
      `TCK-${String(bookings.filter((b) => b.ticketCode).length + 1).padStart(3, "0")}`;

    const updatedBooking: Booking = {
      ...editingBooking,
      ticketCode,
      fechaTicket: format(ticketData.fecha, "yyyy-MM-dd"),
      horario: ticketData.horario,
      estado: "Agendado",
      operacion: ticketData.operacion as
        | "Importación"
        | "Exportación",
      ultimaActualizacion: "Hace unos segundos",
      pagado: isEditing ? editingBooking.pagado : false,
      ticketData: {
        contenedor: ticketData.contenedor,
        tipoContenedor: ticketData.tipoContenedor,
        deposito: ticketData.deposito,
        linea: ticketData.linea,
        tipoDeposito: ticketData.tipoDeposito,
        clienteId: ticketData.clienteId,
        clienteNombre: ticketData.clienteNombre,
        choferNombre: ticketData.choferNombre,
        choferCedula: ticketData.choferCedula,
        vehiculoPlaca: ticketData.vehiculoPlaca,
      },
    };

    setBookings((prev) =>
      prev.map((b) =>
        b.id === editingBooking.id ? updatedBooking : b,
      ),
    );

    // Calculate amount based on time slot
    const [time] = ticketData.horario.split("-");
    const [hour] = time.split(":").map(Number);
    const isOfficeHours = hour >= 8 && hour < 18;
    const monto = isOfficeHours ? 50 : 75;

    // Store ticket data for payment modal and PDF
    const ticketInfo = {
      id: updatedBooking.id,
      bookingCode: updatedBooking.bookingCode,
      ticketCode,
      contenedor: ticketData.contenedor,
      tipoContenedor: ticketData.tipoContenedor,
      operacion: ticketData.operacion,
      deposito: ticketData.deposito,
      linea: ticketData.linea,
      tipoDeposito: ticketData.tipoDeposito,
      clienteNombre: ticketData.clienteNombre,
      clienteId: ticketData.clienteId,
      choferNombre: ticketData.choferNombre,
      choferCedula: ticketData.choferCedula,
      vehiculoPlaca: ticketData.vehiculoPlaca,
      fecha: format(ticketData.fecha, "dd 'de' MMMM, yyyy", {
        locale: es,
      }),
      horario: ticketData.horario,
      monto,
    };

    setLastCreatedTicket(ticketInfo);

    // If editing and already paid, just generate PDF
    if (isEditing && editingBooking.pagado) {
      generateTicketPDF(updatedBooking, ticketData);
      setCurrentScreen("list");
      toast.success("Ticket actualizado correctamente");
    } else {
      setShowPaymentModal(true);
    }
  };

  const generateTicketPDF = async (
    booking: Booking,
    ticketData: any,
  ) => {
    const doc = new jsPDF();

    // Header
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 0, 210, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text("Sistema de Gestión de Contenedores", 105, 20, {
      align: "center",
    });

    doc.setFontSize(12);
    doc.text("Documento de Ingreso/Egreso", 105, 32, {
      align: "center",
    });

    // Reset color
    doc.setTextColor(0, 0, 0);

    // Generate Barcode for Ticket Code
    const barcodeCanvas = document.createElement("canvas");
    JsBarcode(barcodeCanvas, booking.ticketCode, {
      format: "CODE128",
      width: 2,
      height: 50,
      displayValue: true,
    });
    const barcodeImg = barcodeCanvas.toDataURL("image/png");
    doc.addImage(barcodeImg, "PNG", 55, 50, 100, 25);

    let yPos = 85;

    // Payment Status Badge
    const estadoPago = booking.pagado
      ? "PAGADO"
      : "PENDIENTE DE PAGO";
    const colorPago = booking.pagado
      ? [34, 197, 94]
      : [234, 179, 8];
    doc.setFillColor(...colorPago);
    doc.roundedRect(140, 48, 50, 8, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text(estadoPago, 165, 53, { align: "center" });
    doc.setTextColor(0, 0, 0);

    // Booking and Ticket Info
    doc.setFontSize(11);
    doc.text(`Booking: ${booking.bookingCode}`, 20, yPos);
    doc.text(`Ticket: ${booking.ticketCode}`, 120, yPos);
    yPos += 10;

    // Container Information
    doc.setFontSize(14);
    doc.text("Datos del Contenedor", 20, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.text(`Contenedor: ${ticketData.contenedor}`, 20, yPos);
    doc.text(`Tipo: ${ticketData.tipoContenedor}`, 120, yPos);
    yPos += 6;

    doc.text(`Operación: ${booking.operacion}`, 20, yPos);
    doc.text(`Depósito: ${ticketData.deposito}`, 120, yPos);
    yPos += 6;

    doc.text(`Línea: ${ticketData.linea}`, 20, yPos);
    doc.text(`Tipo: ${ticketData.tipoDeposito}`, 120, yPos);
    yPos += 10;

    // Client Information
    doc.setFontSize(14);
    doc.text("Datos del Cliente", 20, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.text(`Cliente: ${ticketData.clienteNombre}`, 20, yPos);
    yPos += 6;
    doc.text(`Cédula/RUC: ${ticketData.clienteId}`, 20, yPos);
    yPos += 10;

    // Driver and Vehicle Information
    doc.setFontSize(14);
    doc.text("Datos del Chofer y Vehículo", 20, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.text(`Chofer: ${ticketData.choferNombre}`, 20, yPos);
    doc.text(`Cédula: ${ticketData.choferCedula}`, 120, yPos);
    yPos += 6;
    doc.text(`Vehículo: ${ticketData.vehiculoPlaca}`, 20, yPos);
    yPos += 10;

    // Payment Information
    doc.setFontSize(14);
    doc.text("Información de Pago", 20, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.text(
      `Estado: ${booking.pagado ? "PAGADO" : "PENDIENTE DE PAGO"}`,
      20,
      yPos,
    );
    yPos += 6;
    doc.text(
      `Condiciones: ${booking.condicionesPago || "Contado"}`,
      20,
      yPos,
    );
    yPos += 6;

    // Calculate amount
    const [time] = booking.horario!.split("-");
    const [hour] = time.split(":").map(Number);
    const isOfficeHours = hour >= 8 && hour < 18;
    const monto = isOfficeHours ? 50 : 75;
    doc.text(`Monto: ${monto.toFixed(2)}`, 20, yPos);
    yPos += 10;

    // Schedule Information
    doc.setFontSize(14);
    doc.text("Turno Asignado", 20, yPos);
    yPos += 8;

    doc.setFontSize(10);
    if (booking.fechaTicket && booking.horario) {
      const [time, cupo] = booking.horario.split("-");
      doc.text(
        `Fecha: ${format(new Date(booking.fechaTicket), "dd 'de' MMMM, yyyy", { locale: es })}`,
        20,
        yPos,
      );
      yPos += 6;
      doc.text(`Horario: ${time}`, 20, yPos);
      doc.text(`Cupo: ${cupo}`, 120, yPos);
      yPos += 10;
    }

    // Generate QR Code
    const qrData = JSON.stringify({
      booking: booking.bookingCode,
      ticket: booking.ticketCode,
      contenedor: ticketData.contenedor,
      fecha: booking.fechaTicket,
      horario: booking.horario,
    });

    try {
      const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
        width: 150,
        margin: 1,
      });

      doc.setFontSize(14);
      doc.text("Código QR de Verificación", 20, yPos);
      yPos += 8;
      doc.addImage(qrCodeDataUrl, "PNG", 20, yPos, 40, 40);

      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(
        "Escanee este código al ingresar/egresar",
        20,
        yPos + 45,
      );
    } catch (error) {
      console.error("Error generating QR code:", error);
    }

    // Important notice
    yPos += 55;
    doc.setFontSize(10);
    doc.setTextColor(200, 0, 0);
    doc.text(
      "IMPORTANTE: Debe llegar 30 minutos antes de su turno programado",
      20,
      yPos,
    );
    yPos += 6;
    doc.text(
      "Este documento es obligatorio para el ingreso al patio",
      20,
      yPos,
    );

    // Footer
    yPos += 15;
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(
      "Documento generado electrónicamente.",
      105,
      yPos,
      { align: "center" },
    );
    yPos += 5;
    doc.text(
      `Fecha de emisión: ${format(new Date(), "dd/MM/yyyy 'a las' HH:mm", { locale: es })}`,
      105,
      yPos,
      { align: "center" },
    );

    // Save the PDF
    doc.save(`ticket-${booking.ticketCode}-ingreso.pdf`);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);

    if (lastCreatedTicket && editingBooking) {
      // Find the booking and generate the ticket PDF
      const booking = bookings.find(
        (b) => b.id === lastCreatedTicket.id,
      );
      if (booking && booking.ticketData) {
        generateTicketPDF(booking, booking.ticketData);
      }
    }

    setCurrentScreen("list");
  };

  return (
    <>
      {currentScreen === "login" && (
        <LoginScreen onLogin={handleLogin} />
      )}

      {currentScreen === "dashboard-ejecutivo" && (
        <MainLayout
          onLogout={handleLogout}
          currentPage="dashboard-ejecutivo"
          username={currentUser}
          onNavigate={handleNavigate}
          userRole={userRole}
        >
          <AdminDashboard />
        </MainLayout>
      )}

      {currentScreen === "operaciones-tiempo-real" && (
        <MainLayout
          onLogout={handleLogout}
          currentPage="operaciones-tiempo-real"
          username={currentUser}
          onNavigate={handleNavigate}
          userRole={userRole}
        >
          <OperationalDashboard 
            bookings={bookings}
            onBookingClick={(booking) => {
              setViewingBooking(booking);
              setShowViewModal(true);
            }}
          />
        </MainLayout>
      )}

      {currentScreen === "dashboard" && (
        <MainLayout
          onLogout={handleLogout}
          currentPage="dashboard"
          username={currentUser}
          onNavigate={handleNavigate}
          userRole={userRole}
        >
          <Dashboard 
            bookings={bookings}
            onBookingClick={(booking) => {
              setViewingBooking(booking);
              setShowViewModal(true);
            }}
          />
        </MainLayout>
      )}

      {currentScreen === "list" && (
        <MainLayout
          onLogout={handleLogout}
          currentPage="reservas"
          username={currentUser}
          onNavigate={handleNavigate}
          userRole={userRole}
        >
          <BookingList
            bookings={bookings}
            onCreateTicket={handleCreateTicket}
            onEditTicket={handleEditTicket}
            onViewTicket={handleViewTicket}
            onDeleteTicket={handleDeleteTicket}
            onRegisterPayment={handleRegisterPayment}
            onDownloadPDF={handleDownloadPDF}
          />
        </MainLayout>
      )}

      {currentScreen === "form" && editingBooking && (
        <MainLayout
          onLogout={handleLogout}
          currentPage="reservas"
          username={currentUser}
          onNavigate={handleNavigate}
          userRole={userRole}
        >
          <TicketForm
            booking={editingBooking}
            onSave={handleSaveTicket}
            onCancel={() => setCurrentScreen("list")}
            isEditing={isEditing}
          />
        </MainLayout>
      )}

      {currentScreen === "transportistas" && (
        <MainLayout
          onLogout={handleLogout}
          currentPage="transportistas"
          username={currentUser}
          onNavigate={handleNavigate}
          userRole={userRole}
        >
          <TransportistasManagement />
        </MainLayout>
      )}

      {currentScreen === "empresa" && (
        <MainLayout
          onLogout={handleLogout}
          currentPage="empresa"
          username={currentUser}
          onNavigate={handleNavigate}
          userRole={userRole}
        >
          <EmpresaManagement />
        </MainLayout>
      )}

      {currentScreen === "gestion-turno" && (
        <MainLayout
          onLogout={handleLogout}
          currentPage="gestion-turno"
          username={currentUser}
          onNavigate={handleNavigate}
          userRole={userRole}
        >
          <GestionTurno 
            bookings={bookings}
            onAgendarClick={handleCreateTicket}
            onPagarClick={handleRegisterPayment}
            onViewClick={handleViewTicket}
          />
        </MainLayout>
      )}

      {currentScreen === "panel-financiero" && (
        <MainLayout
          onLogout={handleLogout}
          currentPage="panel-financiero"
          username={currentUser}
          onNavigate={handleNavigate}
          userRole={userRole}
        >
          <PanelFinancieroAvanzado />
        </MainLayout>
      )}

      {currentScreen === "agenda-reservas" && (
        <MainLayout
          onLogout={handleLogout}
          currentPage="agenda-reservas"
          username={currentUser}
          onNavigate={handleNavigate}
          userRole={userRole}
        >
          <AgendaReservas />
        </MainLayout>
      )}

      {currentScreen === "control-patio" && (
        <MainLayout
          onLogout={handleLogout}
          currentPage="control-patio"
          username={currentUser}
          onNavigate={handleNavigate}
          userRole={userRole}
        >
          <ControlPatio />
        </MainLayout>
      )}

      {currentScreen === "gestion-clientes" && (
        <MainLayout
          onLogout={handleLogout}
          currentPage="gestion-clientes"
          username={currentUser}
          onNavigate={handleNavigate}
          userRole={userRole}
        >
          <GestionClientes />
        </MainLayout>
      )}

      {currentScreen === "alertas-notificaciones" && (
        <MainLayout
          onLogout={handleLogout}
          currentPage="alertas-notificaciones"
          username={currentUser}
          onNavigate={handleNavigate}
          userRole={userRole}
        >
          <AlertasNotificaciones />
        </MainLayout>
      )}

      {currentScreen === "facturacion-cobros" && (
        <MainLayout
          onLogout={handleLogout}
          currentPage="facturacion-cobros"
          username={currentUser}
          onNavigate={handleNavigate}
          userRole={userRole}
        >
          <FacturacionCobros />
        </MainLayout>
      )}

      {currentScreen === "configuracion-tarifas" && (
        <MainLayout
          onLogout={handleLogout}
          currentPage="configuracion-tarifas"
          username={currentUser}
          onNavigate={handleNavigate}
          userRole={userRole}
        >
          <ConfiguracionTarifas />
        </MainLayout>
      )}

      {currentScreen === "gestion-equipos" && (
        <MainLayout
          onLogout={handleLogout}
          currentPage="gestion-equipos"
          username={currentUser}
          onNavigate={handleNavigate}
          userRole={userRole}
        >
          <GestionEquipos />
        </MainLayout>
      )}

      {currentScreen === "estado-cuentas" && (
        <MainLayout
          onLogout={handleLogout}
          currentPage="estado-cuentas"
          username={currentUser}
          onNavigate={handleNavigate}
          userRole={userRole}
        >
          <EstadoCuentas />
        </MainLayout>
      )}

      {currentScreen === "tendencias-demanda" && (
        <MainLayout
          onLogout={handleLogout}
          currentPage="tendencias-demanda"
          username={currentUser}
          onNavigate={handleNavigate}
          userRole={userRole}
        >
          <TendenciasDemanda />
        </MainLayout>
      )}

      {currentScreen === "analisis-comercial" && (
        <MainLayout
          onLogout={handleLogout}
          currentPage="analisis-comercial"
          username={currentUser}
          onNavigate={handleNavigate}
          userRole={userRole}
        >
          <AnalisisComercial />
        </MainLayout>
      )}

      {currentScreen === "promociones" && (
        <MainLayout
          onLogout={handleLogout}
          currentPage="promociones"
          username={currentUser}
          onNavigate={handleNavigate}
          userRole={userRole}
        >
          <PromocionesIncentivos />
        </MainLayout>
      )}

      {currentScreen === "auditoria" && (
        <MainLayout
          onLogout={handleLogout}
          currentPage="auditoria"
          username={currentUser}
          onNavigate={handleNavigate}
          userRole={userRole}
        >
          <AuditoriaSeguridad />
        </MainLayout>
      )}

      {currentScreen === "planeacion-operativa" && (
        <MainLayout
          onLogout={handleLogout}
          currentPage="planeacion-operativa"
          username={currentUser}
          onNavigate={handleNavigate}
          userRole={userRole}
        >
          <PlaneacionOperativa />
        </MainLayout>
      )}

      {lastCreatedTicket && (
        <PaymentModal
          open={showPaymentModal}
          onClose={handleClosePaymentModal}
          ticketData={lastCreatedTicket}
          onDownloadPDF={() => {}}
        />
      )}

      <ViewTicketModal
        open={showViewModal}
        onClose={() => setShowViewModal(false)}
        booking={viewingBooking}
      />

      <PaymentRegistrationModal
        open={showPaymentRegistrationModal}
        onClose={() => {
          setShowPaymentRegistrationModal(false);
          setBookingForPayment(null);
        }}
        booking={bookingForPayment}
        onRegisterPayment={handlePaymentConfirm}
      />

      <Toaster position="top-right" />
    </>
  );
}
