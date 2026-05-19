import { Outlet, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCheck, faTerminal } from '@fortawesome/free-solid-svg-icons';

const AuthLayout = () => {
  const location = useLocation();
  const isRecovery = location.pathname.includes('forgot-password');

  const content = {
    title: isRecovery ? "Protocolo de Recuperación de Acceso" : "Protocolo de Terminal Seguro",
    description: isRecovery
      ? "Interfaz de restauración de credenciales para el restablecimiento seguro de privilegios de acceso al sistema."
      : "Capa de autenticación unificada para operaciones de red de alto nivel y gestión de activos administrativos."
  };

  return (
    <div className="min-h-screen bg-[#081425] text-white flex flex-col lg:flex-row relative overflow-hidden font-sans scanline">
      {/* Sidebar - Visible on Desktop */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-[#040e1f] border-r border-white/5 relative z-10">
        <div className='flex flex-col max-w-md mx-auto my-auto'>
          <div className="flex items-center gap-4 mb-16">
            <img src="/logo.png" alt="ROOM 911" className="w-12 h-12 object-contain" />
            <span className="text-2xl font-bold tracking-tight uppercase">ROOM_911</span>
          </div>
          
          <h2 className="text-5xl font-bold max-w-md leading-tight mb-6">
            {content.title}
          </h2>
          <p className="text-lg text-white/50 max-w-sm">
            {content.description}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 text-sm text-white/40">
            <FontAwesomeIcon icon={faUserCheck} className="text-room-success" />
            <span>Apretón de manos con cifrado de extremo a extremo</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-white/40">
            <FontAwesomeIcon icon={faTerminal} className="text-room-primary" />
            <span>Kernel del Sistema v4.2.0-STABLE</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
        {/* Background Pattern */}
        <div className="absolute inset-0 molecule-bg opacity-10 pointer-events-none"></div>
        
        <div className="w-full max-w-md relative z-10">
          <Outlet />
        </div>
      </main>

      {/* Background radial gradient decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-login-pattern pointer-events-none z-0"></div>
    </div>
  );
};

export default AuthLayout;
