import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartPie,
  faUsers,
  faBuilding,
  faHistory,
  faFileUpload,
  faChartLine,
  faUserShield,
  faGear,
  faSignOutAlt,
  faTrash,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import api from '../../services/api';

interface AdminProfile {
  id: number;
  username: string;
  email: string;
}

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(true);

  useEffect(() => {
    fetchCurrentAdmin();
  }, []);

  const fetchCurrentAdmin = async () => {
    try {
      setIsLoadingAdmin(true);
      const response = await api.get<AdminProfile>('/auth/admin/me');
      setAdmin(response);
    } catch (error) {
      console.error('Error fetching admin profile:', error);
    } finally {
      setIsLoadingAdmin(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth/login');
  };

  const menuItems = [
    { name: 'Panel', icon: faChartPie, path: '/admin/dashboard' },
    { name: 'Empleados', icon: faUsers, path: '/admin/employees' },
    { name: 'Departamentos', icon: faBuilding, path: '/admin/departments' },
    { name: 'Registros de Acceso', icon: faHistory, path: '/admin/access-logs' },
    { name: 'Informes', icon: faChartLine, path: '/admin/reports' },
    { name: 'Administradores', icon: faUserShield, path: '/admin/admins' },
    { name: 'Elementos Archivados', icon: faTrash, path: '/admin/archived-items' },
  ];

  return (
    <nav className="hidden md:flex bg-[#152031] h-screen w-64 flex-col border-r border-white/5 fixed left-0 top-0 z-40">
      {/* Brand Header */}
      <div className="flex items-center px-6 h-24 border-b border-white/5">
        <img src="/logo.png" alt="ROOM 911" className="w-12 h-12 mr-3 object-contain" />
        <div>
          <h1 className="text-xl font-bold text-room-primary tracking-tight">ROOM_911</h1>
          <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1">Acceso Seguro</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-room-primary/10 text-room-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]' 
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <FontAwesomeIcon 
                icon={item.icon} 
                className={`mr-3 text-lg transition-colors ${isActive ? 'text-room-primary' : 'text-white/20 group-hover:text-white/40'}`} 
              />
              <span className="text-sm font-medium tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Admin Profile Footer */}
      <div className="p-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center min-w-0">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-white/10 mr-3 shrink-0 bg-room-primary/20 flex items-center justify-center">
            {isLoadingAdmin ? (
              <div className="animate-spin">
                <FontAwesomeIcon icon={faUser} className="text-room-primary text-xs" />
              </div>
            ) : (
              <span className="text-xs font-bold text-room-primary uppercase">
                {admin?.username?.charAt(0) || 'A'}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">
              {isLoadingAdmin ? 'Cargando...' : admin?.username || 'Admin'}
            </p>
            <p className="text-[9px] text-white/30 truncate">
              {isLoadingAdmin ? '---' : admin?.email || 'email@room911.com'}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-white/30 hover:text-room-error transition-colors p-2 ml-2"
          title="Cerrar Sesión"
        >
          <FontAwesomeIcon icon={faSignOutAlt} />
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
