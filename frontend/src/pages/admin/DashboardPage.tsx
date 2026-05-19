import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faTriangleExclamation, faUsers, faHistory, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../services/api';

interface AccessLog {
  id: number;
  attemptedInternalId: string;
  accessTimestamp: string;
  isSuccessful: boolean;
  reasonDenied?: string;
}

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
}

const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [weeklyData, setWeeklyData] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(true), 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async (isAutoRefresh = false) => {
    if (!isAutoRefresh) setIsLoading(true);
    if (isAutoRefresh) setIsRefreshing(true);

    try {
      const [logsRes, empRes] = await Promise.all([
        api.get('/access-logs').catch(() => []),
        api.get('/employees').catch(() => [])
      ]);

      const logsData = Array.isArray(logsRes) ? logsRes : [];
      const empData = Array.isArray(empRes) ? empRes : [];

      setAccessLogs(logsData);
      setEmployees(empData);

      // Process weekly data
      if (logsData.length > 0) {
        const dayMap = new Map<string, { approved: number; rejected: number }>();
        const dayOrder = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

        logsData.forEach((log: AccessLog) => {
          const date = new Date(log.accessTimestamp);
          const dayIndex = date.getDay();
          const dayName = dayOrder[dayIndex === 0 ? 6 : dayIndex - 1];

          if (!dayMap.has(dayName)) {
            dayMap.set(dayName, { approved: 0, rejected: 0 });
          }
          const dayData = dayMap.get(dayName)!;
          if (log.isSuccessful) {
            dayData.approved++;
          } else {
            dayData.rejected++;
          }
        });

        const chartData = dayOrder.map(day => ({
          day,
          approved: dayMap.get(day)?.approved || 0,
          rejected: dayMap.get(day)?.rejected || 0
        }));

        setWeeklyData(chartData);
      }

      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Calculate stats
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayLogs = accessLogs.filter(
    log => new Date(log.accessTimestamp) >= todayStart
  );

  const successToday = todayLogs.filter(l => l.isSuccessful).length;
  const deniedToday = todayLogs.filter(l => !l.isSuccessful).length;
  const suspiciousAttempts = accessLogs.filter(l => !l.isSuccessful && l.reasonDenied).length;
  const totalEmployees = employees.length;

  const stats = [
    {
      title: 'Accesos Exitosos Hoy',
      value: successToday.toString(),
      change: `${todayLogs.length > 0 ? Math.round((successToday / todayLogs.length) * 100) : 0}%`,
      icon: faCheckCircle,
      color: 'text-room-success'
    },
    {
      title: 'Accesos Denegados Hoy',
      value: deniedToday.toString(),
      change: `${todayLogs.length > 0 ? Math.round((deniedToday / todayLogs.length) * 100) : 0}%`,
      icon: faTimesCircle,
      color: 'text-room-error'
    },
    {
      title: 'Intentos Sospechosos',
      value: suspiciousAttempts.toString(),
      change: `${accessLogs.length > 0 ? Math.round((suspiciousAttempts / accessLogs.length) * 100) : 0}%`,
      icon: faTriangleExclamation,
      color: 'text-yellow-500'
    },
    {
      title: 'Total de Empleados',
      value: totalEmployees.toString(),
      change: 'Activos',
      icon: faUsers,
      color: 'text-room-primary'
    }
  ];

  // Get recent denied access for alerts
  const recentDeniedAccess = accessLogs
    .filter(l => !l.isSuccessful)
    .slice(-3)
    .reverse();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight uppercase">Panel de Control</h2>
          <p className="text-sm text-white/40 mt-1">Resumen general de accesos y seguridad del sistema.</p>
        </div>
        <button
          onClick={() => fetchData()}
          disabled={isRefreshing}
          className={`px-4 py-2 bg-room-primary text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-glow ${
            isRefreshing ? 'opacity-50' : ''
          }`}
        >
          <FontAwesomeIcon icon={faRotateRight} className={isRefreshing ? 'animate-spin mr-2' : 'mr-2'} />
          {isRefreshing ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin">
            <FontAwesomeIcon icon={faHistory} className="text-room-primary text-4xl" />
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.title} className="bg-[#152031] border border-white/5 rounded-xl p-6 relative overflow-hidden group hover:border-white/10 transition-all">
                <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity`}>
                  <FontAwesomeIcon icon={stat.icon} className={`text-6xl ${stat.color}`} />
                </div>
                <p className="text-[10px] font-bold text-white/30 mb-2 uppercase tracking-widest">{stat.title}</p>
                <div className="flex items-baseline gap-3">
                  <h3 className="text-4xl font-bold text-white">{stat.value}</h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center ${
                      stat.change.includes('+') || stat.change === 'Activos'
                        ? 'bg-room-success/10 text-room-success'
                        : stat.change === '0%'
                        ? 'bg-white/5 text-white/40'
                        : 'bg-room-error/10 text-room-error'
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Main Grid Layout Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Weekly Access Chart */}
            <div className="lg:col-span-2 bg-[#152031] border border-white/5 rounded-xl flex flex-col overflow-hidden">
              <div className="p-6 border-b border-white/5 bg-white/2">
                <h3 className="text-lg font-bold text-white uppercase tracking-widest">Accesos Semanales</h3>
                <p className="text-[10px] text-white/40 mt-1">Comparativa aprobados vs denegados</p>
              </div>
              {weeklyData.some(d => d.approved > 0 || d.rejected > 0) ? (
                <div className="flex-1 p-8">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" />
                      <YAxis stroke="rgba(255,255,255,0.5)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(8, 20, 37, 0.9)',
                          border: '1px solid rgba(37, 99, 235, 0.3)',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="approved" fill="#10FB72" name="Aprobados" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="rejected" fill="#FF3131" name="Denegados" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-white/20">Sin datos de acceso disponibles</p>
                </div>
              )}
            </div>

            {/* System Alerts */}
            <div className="bg-[#152031] border border-white/5 rounded-xl flex flex-col overflow-hidden">
              <div className="p-6 border-b border-white/5 bg-white/2">
                <h3 className="text-lg font-bold text-white uppercase tracking-widest">Alertas Recientes</h3>
                <p className="text-[10px] text-white/40 mt-1">Últimos accesos denegados</p>
              </div>
              <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-96">
                {recentDeniedAccess.length > 0 ? (
                  recentDeniedAccess.map((log, i) => (
                    <div key={log.id} className="p-3 bg-white/2 border border-room-error/20 rounded-lg flex gap-3">
                      <div className="w-1 h-full rounded-full bg-room-error shrink-0"></div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-white uppercase tracking-tight">
                          Acceso Denegado
                        </p>
                        <p className="text-[10px] text-white/40 mt-1 truncate">
                          PIN: {log.attemptedInternalId}
                        </p>
                        <p className="text-[9px] text-white/30 mt-1">
                          {new Date(log.accessTimestamp).toLocaleTimeString('es-MX')}
                        </p>
                        {log.reasonDenied && (
                          <p className="text-[9px] text-room-error mt-1 italic">{log.reasonDenied}</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-32 text-white/20">
                    <p className="text-sm">Sin alertas</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-4">
            <p className="text-xs text-white/30 uppercase tracking-widest">
              Última actualización: {lastUpdate.toLocaleTimeString('es-MX')} • Auto-actualización cada 30s
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
