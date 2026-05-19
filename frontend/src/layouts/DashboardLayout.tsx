import { Outlet } from 'react-router-dom';
import Sidebar from '../components/globalcomponent/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBell } from '@fortawesome/free-solid-svg-icons';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-room-dark text-white flex font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-64 w-full h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-room-dark border-b border-white/5 flex items-center justify-between px-6 shrink-0 z-30">
          {/* Mobile Brand */}
          <div className="flex items-center md:hidden">
            <img src="/logo.png" alt="ROOM 911" className="w-10 h-10 mr-3 object-contain" />
            <h1 className="text-lg font-bold tracking-tight uppercase">ROOM_911</h1>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-xl relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/20 group-focus-within:text-room-primary transition-colors">
              <FontAwesomeIcon icon={faSearch} className="text-sm" />
            </div>
            <input 
              type="text" 
              placeholder="Buscar empleados, departamentos o registros..." 
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm placeholder:text-white/20 focus:outline-none focus:border-room-primary/50 focus:ring-1 focus:ring-room-primary/50 transition-all"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-white/40 hover:text-white transition-colors relative">
              <FontAwesomeIcon icon={faBell} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-room-error rounded-full border border-room-dark"></span>
            </button>
            <div className="h-8 w-px bg-white/5 mx-1 hidden md:block"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">Terminal Activa</p>
                <p className="text-[9px] text-room-success font-mono font-bold">ALPHA_SECURE_ON</p>
              </div>
              <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrLqUk9GQzSookki_6QS603yxiuVHOryIP80KYQwCR6ucNVyt4X_4jBRm_kPsE4VHVTocboLoBTOE-Dek126k48CwnYvh6ebPwh4dTgRkBeUJ51G6109M-TIwmJBRfSDnl34-xd-emoYhdHGH24BSzNfRIUtDZXQfSkg2RrjZLMRlE5xGOnKmj1by6lHhMjnMoEowXn-BBsdh9HObp5hPtnAJLAC9aLq2Lqew4Q-rpWekYYKwZWODsIOUaBUXgzNFI_qGqsOLjOB4" 
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Canvas */}
        <main className="flex-1 overflow-y-auto p-6 bg-room-dark relative">
          {/* Background decoration */}
          <div className="absolute inset-0 molecule-bg opacity-[0.03] pointer-events-none"></div>
          
          <div className="max-w-[1440px] mx-auto relative z-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
