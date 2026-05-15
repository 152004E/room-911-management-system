import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShieldVirus, 
  faUserSecret, 
  faClock, 
  faLocationDot, 
  faPowerOff,
  faMicrochip,
  faSatelliteDish,
  faWaveSquare
} from '@fortawesome/free-solid-svg-icons';

const Room911Page = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const employee = location.state?.employee;

  // Si alguien intenta entrar sin pasar por el modal, lo regresamos
  if (!employee) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
        <div className="space-y-4">
          <p className="text-room-error font-mono uppercase tracking-[0.3em]">ERROR_DE_PROTOCOLO: ACCESO_NO_AUTORIZADO</p>
          <button onClick={() => navigate('/auth/login')} className="text-white/40 hover:text-white transition-colors uppercase text-[10px] tracking-widest border border-white/10 px-4 py-2 rounded">
            Regresar a la Terminal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#040e1f] text-white flex flex-col font-mono overflow-hidden relative">
      {/* Background Grid Decoration */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#10d398 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
      
      {/* Top Header */}
      <header className="h-16 border-b border-room-success/20 flex items-center justify-between px-8 bg-black/40 backdrop-blur-xl relative z-10">
        <div className="flex items-center gap-4">
          <FontAwesomeIcon icon={faShieldVirus} className="text-room-success text-2xl animate-pulse" />
          <h1 className="text-xl font-black tracking-[0.4em] text-room-success">ROOM_911</h1>
          <span className="text-[10px] bg-room-success/10 text-room-success px-2 py-0.5 rounded border border-room-success/20">ESTADO: SEGURO</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] text-white/30 uppercase">Terminal_ID</p>
            <p className="text-xs font-bold text-room-primary">NODE_911_ALPHA</p>
          </div>
          <button 
            onClick={() => navigate('/auth/login')}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-room-error/20 hover:border-room-error/40 hover:text-room-error transition-all"
            title="Cerrar Sesión Segura"
          >
            <FontAwesomeIcon icon={faPowerOff} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
        
        {/* Central Pulse Decoration */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[500px] h-[500px] bg-room-success/5 rounded-full animate-ping opacity-20"></div>
          <div className="w-[300px] h-[300px] bg-room-success/10 rounded-full animate-pulse opacity-20"></div>
        </div>

        <div className="max-w-2xl w-full space-y-12 text-center">
          {/* Welcome Message */}
          <div className="space-y-4 animate-fade-in">
            <div className="inline-block px-4 py-1 bg-room-success/10 border border-room-success/30 rounded text-[10px] font-bold text-room-success uppercase tracking-[0.5em] mb-4">
              Sesión de Acceso Activa
            </div>
            <h2 className="text-5xl font-black uppercase tracking-tighter">
              Bienvenido, <span className="text-room-success">{employee.firstName}</span>
            </h2>
            <p className="text-white/40 text-sm tracking-widest uppercase">Has ingresado al área de seguridad restringida</p>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black/60 border border-white/5 p-6 rounded-2xl backdrop-blur-xl group hover:border-room-success/40 transition-all">
              <FontAwesomeIcon icon={faUserSecret} className="text-room-success mb-4 text-xl" />
              <p className="text-[10px] text-white/20 uppercase tracking-widest mb-1">Identidad</p>
              <p className="text-xs font-bold uppercase">{employee.firstName} {employee.lastName}</p>
            </div>
            <div className="bg-black/60 border border-white/5 p-6 rounded-2xl backdrop-blur-xl group hover:border-room-success/40 transition-all">
              <FontAwesomeIcon icon={faLocationDot} className="text-room-success mb-4 text-xl" />
              <p className="text-[10px] text-white/20 uppercase tracking-widest mb-1">Departamento</p>
              <p className="text-xs font-bold uppercase">{employee.departmentName}</p>
            </div>
            <div className="bg-black/60 border border-white/5 p-6 rounded-2xl backdrop-blur-xl group hover:border-room-success/40 transition-all">
              <FontAwesomeIcon icon={faClock} className="text-room-success mb-4 text-xl" />
              <p className="text-[10px] text-white/20 uppercase tracking-widest mb-1">Hora Ingreso</p>
              <p className="text-xs font-bold uppercase">{new Date().toLocaleTimeString()}</p>
            </div>
          </div>

          {/* System Telemetry */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <FontAwesomeIcon icon={faMicrochip} className="text-white/10 mb-2" />
              <div className="h-1 bg-white/5 w-full rounded-full overflow-hidden">
                <div className="h-full bg-room-success w-[70%]"></div>
              </div>
              <p className="text-[8px] mt-2 text-white/20 uppercase tracking-[0.2em]">Proc_Sync</p>
            </div>
            <div className="text-center">
              <FontAwesomeIcon icon={faSatelliteDish} className="text-white/10 mb-2" />
              <div className="h-1 bg-white/5 w-full rounded-full overflow-hidden">
                <div className="h-full bg-room-primary w-[45%]"></div>
              </div>
              <p className="text-[8px] mt-2 text-white/20 uppercase tracking-[0.2em]">Comm_Link</p>
            </div>
            <div className="text-center">
              <FontAwesomeIcon icon={faWaveSquare} className="text-white/10 mb-2" />
              <div className="h-1 bg-white/5 w-full rounded-full overflow-hidden">
                <div className="h-full bg-room-success w-[90%]"></div>
              </div>
              <p className="text-[8px] mt-2 text-white/20 uppercase tracking-[0.2em]">Secure_Bit</p>
            </div>
            <div className="text-center">
              <FontAwesomeIcon icon={faShieldVirus} className="text-white/10 mb-2" />
              <div className="h-1 bg-white/5 w-full rounded-full overflow-hidden">
                <div className="h-full bg-room-success w-[100%]"></div>
              </div>
              <p className="text-[8px] mt-2 text-white/20 uppercase tracking-[0.2em]">Bio_Verify</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Footer */}
      <footer className="h-12 border-t border-white/5 flex items-center justify-center bg-black/20 relative z-10">
        <p className="text-[9px] text-white/20 uppercase tracking-[0.5em] animate-pulse">
          SISTEMA DE MONITOREO ROOM_911 — ACTIVADO
        </p>
      </footer>
    </div>
  );
};

export default Room911Page;
