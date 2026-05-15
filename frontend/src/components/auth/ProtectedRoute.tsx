import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  
  // 1. Protección de Rutas Administrativas
  if (requireAdmin) {
    if (!token) {
      // Si no hay token, redirigir al login pero guardando a dónde quería ir
      return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }
  }

  // 2. Protección del ROOM_911 (basado en el estado del empleado)
  if (location.pathname === '/room-911') {
    const employee = location.state?.employee;
    if (!employee) {
      // Si intentan entrar al room sin haber pasado la validación del modal
      return <Navigate to="/auth/login" replace />;
    }
  }

  return children;
};
