import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import AuthLayout from './layouts/AuthLayout'
import LoginPage from './pages/auth/LoginPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import DashboardLayout from './layouts/DashboardLayout'
import DashboardPage from './pages/admin/DashboardPage'
import EmployeesPage from './pages/admin/EmployeesPage'
import DepartmentsPage from './pages/admin/DepartmentsPage'
import AdminsPage from './pages/admin/AdminsPage'
import ArchivedItemsPage from './pages/admin/ArchivedItemsPage'
import Room911Page from './pages/Room911Page'
import { ProtectedRoute } from './components/auth/ProtectedRoute'

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirigir la raíz al Login */}
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        
        {/* Rutas de Autenticación */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<Navigate to="/auth/login" replace />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* Rutas Administrativas (Dashboard) Protegidas */}
        <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="employees" element={<EmployeesPage />} />
          <Route path="departments" element={<DepartmentsPage />} />
          <Route path="admins" element={<AdminsPage />} />
          <Route path="archived-items" element={<ArchivedItemsPage />} />
        </Route>

        {/* Ruta de Acceso al Room Protegida */}
        <Route path="/room-911" element={<ProtectedRoute><Room911Page /></ProtectedRoute>} />

        {/* Redirección para cualquier otra ruta no encontrada */}
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
