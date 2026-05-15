import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faTriangleExclamation, faUsers } from '@fortawesome/free-solid-svg-icons';

const DashboardPage = () => {
  const stats = [
    { title: 'Accesos Exitosos Hoy', value: '2,451', change: '+12%', icon: faCheckCircle, color: 'text-room-success' },
    { title: 'Accesos Denegados', value: '42', change: '-3%', icon: faTimesCircle, color: 'text-room-error' },
    { title: 'Intentos Sospechosos', value: '8', change: '0%', icon: faTriangleExclamation, color: 'text-yellow-500' },
    { title: 'Total de Empleados', value: '892', change: 'Activos', icon: faUsers, color: 'text-room-primary' },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight uppercase">Panel de Control</h2>
          <p className="text-sm text-white/40 mt-1">Resumen general de accesos y seguridad del sistema.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-white/10 text-white/70 hover:text-white hover:bg-white/5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all">
            Filtros
          </button>
          <button className="px-4 py-2 bg-room-primary text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-glow">
            Exportar reporte
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-[#152031] border border-white/5 rounded-xl p-6 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity`}>
              <FontAwesomeIcon icon={stat.icon} className={`text-6xl ${stat.color}`} />
            </div>
            <p className="text-[10px] font-bold text-white/30 mb-2 uppercase tracking-widest">{stat.title}</p>
            <div className="flex items-baseline gap-3">
              <h3 className="text-4xl font-bold text-white">{stat.value}</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center ${
                stat.change.includes('+') ? 'bg-room-success/10 text-room-success' : 
                stat.change.includes('-') ? 'bg-room-error/10 text-room-error' : 'bg-white/5 text-white/40'
              }`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid Layout Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart Placeholder */}
        <div className="lg:col-span-2 bg-[#152031] border border-white/5 rounded-xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/2">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest">Accesos Semanales</h3>
            <div className="flex gap-2">
              <span className="w-2 h-2 rounded-full bg-room-primary"></span>
              <span className="w-2 h-2 rounded-full bg-white/10"></span>
            </div>
          </div>
          <div className="flex-1 p-8 flex items-center justify-center">
             <div className="text-center">
                <p className="text-white/10 uppercase tracking-[0.4em] font-black text-xl">Data Visualization</p>
                <p className="text-[10px] text-white/20 mt-2 tracking-widest font-bold">CARGANDO PROTOCOLO DE ANÁLISIS...</p>
             </div>
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-[#152031] border border-white/5 rounded-xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/5 bg-white/2">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest">Alertas del Sistema</h3>
          </div>
          <div className="p-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 bg-white/2 border border-white/5 rounded-lg flex gap-3">
                <div className={`w-1 h-full rounded-full ${i === 1 ? 'bg-room-error' : 'bg-yellow-500'}`}></div>
                <div>
                  <p className="text-[10px] font-bold text-white uppercase tracking-tight">Brecha de Seguridad Detectada</p>
                  <p className="text-[10px] text-white/30 mt-1">Acceso denegado en NODO_B</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
