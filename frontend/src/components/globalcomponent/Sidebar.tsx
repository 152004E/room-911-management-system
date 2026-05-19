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
  faTrash
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth/login');
  };

  const menuItems = [
    { name: 'Panel', icon: faChartPie, path: '/admin/dashboard' },
    { name: 'Empleados', icon: faUsers, path: '/admin/employees' },
    { name: 'Departamentos', icon: faBuilding, path: '/admin/departments' },
    { name: 'Registros de Acceso', icon: faHistory, path: '/admin/access-logs' },
    { name: 'Cargar CSV', icon: faFileUpload, path: '/admin/upload' },
    { name: 'Informes', icon: faChartLine, path: '/admin/reports' },
    { name: 'Administradores', icon: faUserShield, path: '/admin/admins' },
    { name: 'Elementos Archivados', icon: faTrash, path: '/admin/archived-items' },
    { name: 'Ajustes', icon: faGear, path: '/admin/settings' },
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
          <div className="w-9 h-9 rounded-full overflow-hidden border border-white/10 mr-3 shrink-0">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYz5T3XlXOPL1c5NygZ0lpXT5QLQp-rrPCGdGdFK1x3WtK8CM0ndcipiGWVkAGm-x0dggw4U-Vzdn1vzR5keYEkQnVuRhGqdOXDtqzceex_TUduOrL0SF9r9CXhaXXAhlnOAk1m7uT4nPH2ByrLkvvNr9RRdpZidrZJUgC7hICznZ_GOi-LcY7iy6x7JQIeYzSpl9bvZOw_zcID9oPuKQbihr1ypeGpoqlfH-amowlHh_MmvPCD2zlPPDHcbJsMht8O4c1yKdOPsY" 
              alt="Admin Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">Admin. Principal</p>
            <p className="text-[9px] text-white/30 truncate">admin@room911.com</p>
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
