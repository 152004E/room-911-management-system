import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faBuilding, faUsers, faUserShield, faHistory, faClock, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import api from '../../services/api';

interface Department {
  id: number;
  name: string;
}

interface Employee {
  id: number;
  departmentId: number;
  departmentName: string;
  firstName: string;
  lastName: string;
}

interface AdminUser {
  id: number;
  username: string;
}

const ReportsPage = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Chart data states
  const [employeesByDeptData, setEmployeesByDeptData] = useState<any[]>([]);
  const [accessData, setAccessData] = useState<any[]>([]);

  const COLORS = ['#2563EB', '#10FB72', '#FF3131', '#F59E0B', '#8B5CF6', '#EC4899'];

  useEffect(() => {
    fetchData();
    // Auto-refresh cada 30 segundos
    const interval = setInterval(() => {
      fetchData(true);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async (isAutoRefresh = false) => {
    if (!isAutoRefresh) setIsLoading(true);
    if (isAutoRefresh) setIsRefreshing(true);

    try {
      const [deptRes, empRes, adminRes, logsRes] = await Promise.all([
        api.get('/departments').catch(() => []),
        api.get('/employees').catch(() => []),
        api.get('/admins').catch(() => []),
        api.get('/access-logs').catch(() => [])
      ]);

      setDepartments(Array.isArray(deptRes) ? deptRes : []);
      setEmployees(Array.isArray(empRes) ? empRes : []);
      setAdmins(Array.isArray(adminRes) ? adminRes : []);

      // Process employees by department
      if (Array.isArray(empRes)) {
        const deptMap = new Map();
        empRes.forEach((emp: Employee) => {
          const key = emp.departmentName || `Dept ${emp.departmentId}`;
          deptMap.set(key, (deptMap.get(key) || 0) + 1);
        });
        const chartData = Array.from(deptMap.entries()).map(([name, count]) => ({
          name,
          employees: count
        }));
        setEmployeesByDeptData(chartData);
      }

      // Process access logs data
      if (Array.isArray(logsRes) && logsRes.length > 0) {
        const dayMap = new Map<string, { approved: number; rejected: number }>();
        const dayOrder = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

        logsRes.forEach((log: any) => {
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

        const chartData = dayOrder
          .map(day => ({
            day,
            approved: dayMap.get(day)?.approved || 0,
            rejected: dayMap.get(day)?.rejected || 0,
            total: (dayMap.get(day)?.approved || 0) + (dayMap.get(day)?.rejected || 0)
          }));

        setAccessData(chartData);
      } else {
        setAccessData([
          { day: 'Lun', approved: 0, rejected: 0, total: 0 },
          { day: 'Mar', approved: 0, rejected: 0, total: 0 },
          { day: 'Mié', approved: 0, rejected: 0, total: 0 },
          { day: 'Jue', approved: 0, rejected: 0, total: 0 },
          { day: 'Vie', approved: 0, rejected: 0, total: 0 },
          { day: 'Sáb', approved: 0, rejected: 0, total: 0 },
          { day: 'Dom', approved: 0, rejected: 0, total: 0 }
        ]);
      }

      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const totalEmployees = employees.length;
  const totalDepartments = departments.length;
  const totalAdmins = admins.length;
  const approvedAccess = accessData.reduce((sum, d) => sum + d.approved, 0);
  const rejectedAccess = accessData.reduce((sum, d) => sum + d.rejected, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin">
          <FontAwesomeIcon icon={faChartLine} className="text-room-primary text-4xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-room-primary/20 rounded-lg flex items-center justify-center border border-room-primary/30">
            <FontAwesomeIcon icon={faChartLine} className="text-room-primary text-xl" />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-white">Informes del Sistema</h1>
            <p className="text-sm text-white/40 mt-1">Análisis y estadísticas de ROOM 911</p>
          </div>
        </div>
        <button
          onClick={() => fetchData()}
          disabled={isRefreshing}
          className={`px-4 py-2 bg-room-primary/20 border border-room-primary/30 rounded-lg text-room-primary font-bold flex items-center gap-2 transition-all ${
            isRefreshing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-room-primary/30'
          }`}
        >
          <FontAwesomeIcon icon={faRotateRight} className={isRefreshing ? 'animate-spin' : ''} />
          {isRefreshing ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Departments */}
        <div className="glass p-6 rounded-room hover:border-room-primary/50 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2">Departamentos</p>
              <p className="text-4xl font-black text-room-primary">{totalDepartments}</p>
            </div>
            <div className="w-14 h-14 bg-room-primary/10 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faBuilding} className="text-room-primary text-2xl" />
            </div>
          </div>
          <p className="text-[10px] text-white/40 mt-4 border-t border-white/5 pt-4">
            Áreas activas en el sistema
          </p>
        </div>

        {/* Total Employees */}
        <div className="glass p-6 rounded-room hover:border-room-primary/50 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2">Empleados</p>
              <p className="text-4xl font-black text-room-success">{totalEmployees}</p>
            </div>
            <div className="w-14 h-14 bg-room-success/10 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faUsers} className="text-room-success text-2xl" />
            </div>
          </div>
          <p className="text-[10px] text-white/40 mt-4 border-t border-white/5 pt-4">
            Usuarios registrados activos
          </p>
        </div>

        {/* Total Admins */}
        <div className="glass p-6 rounded-room hover:border-room-primary/50 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2">Administradores</p>
              <p className="text-4xl font-black text-blue-400">{totalAdmins}</p>
            </div>
            <div className="w-14 h-14 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faUserShield} className="text-blue-400 text-2xl" />
            </div>
          </div>
          <p className="text-[10px] text-white/40 mt-4 border-t border-white/5 pt-4">
            Cuentas administrativas
          </p>
        </div>

        {/* Accesos Aprobados */}
        <div className="glass p-6 rounded-room hover:border-room-primary/50 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2">Accesos Aprobados</p>
              <p className="text-4xl font-black text-room-success">{approvedAccess}</p>
            </div>
            <div className="w-14 h-14 bg-room-success/10 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faClock} className="text-room-success text-2xl" />
            </div>
          </div>
          <p className="text-[10px] text-white/40 mt-4 border-t border-white/5 pt-4">
            Esta semana
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employees by Department - Bar Chart */}
        <div className="glass p-6 rounded-room">
          <div className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-tight text-white flex items-center gap-2">
              <FontAwesomeIcon icon={faBuilding} className="text-room-primary" />
              Empleados por Departamento
            </h2>
            <p className="text-xs text-white/40 mt-2">Distribución de personal por área</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={employeesByDeptData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(8, 20, 37, 0.9)',
                  border: '1px solid rgba(37, 99, 235, 0.3)',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="employees" fill="#2563EB" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribution Pie Chart */}
        <div className="glass p-6 rounded-room">
          <div className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-tight text-white flex items-center gap-2">
              <FontAwesomeIcon icon={faUsers} className="text-room-success" />
              Proporción de Usuarios
            </h2>
            <p className="text-xs text-white/40 mt-2">Distribución: Empleados vs Administradores</p>
          </div>
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Empleados', value: totalEmployees },
                    { name: 'Administradores', value: totalAdmins }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="#2563EB" />
                  <Cell fill="#10FB72" />
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(8, 20, 37, 0.9)',
                    border: '1px solid rgba(37, 99, 235, 0.3)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Access Logs Section */}
      <div className="glass p-6 rounded-room">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold uppercase tracking-tight text-white flex items-center gap-2">
                <FontAwesomeIcon icon={faHistory} className="text-room-primary" />
                Registros de Acceso
              </h2>
              <p className="text-xs text-white/40 mt-2">Análisis de intentos de acceso por día (datos en tiempo real)</p>
            </div>
          </div>
        </div>

        {accessData.every(d => d.total === 0) ? (
          <div className="flex flex-col items-center justify-center h-80 gap-4">
            <FontAwesomeIcon icon={faHistory} className="text-white/20 text-4xl" />
            <p className="text-white/40 uppercase text-sm font-bold">Sin registros de acceso aún</p>
          </div>
        ) : (
          <>
            {/* Access Chart */}
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={accessData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(8, 20, 37, 0.9)',
                    border: '1px solid rgba(37, 99, 235, 0.3)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: '20px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="approved"
                  stroke="#10FB72"
                  strokeWidth={2}
                  dot={{ fill: '#10FB72', r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Aprobados"
                />
                <Line
                  type="monotone"
                  dataKey="rejected"
                  stroke="#FF3131"
                  strokeWidth={2}
                  dot={{ fill: '#FF3131', r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Rechazados"
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#2563EB"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#2563EB', r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Total"
                />
              </LineChart>
            </ResponsiveContainer>

            {/* Access Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/5">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2">Total Accesos</p>
                <p className="text-3xl font-black text-room-primary">{approvedAccess + rejectedAccess}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2">Aprobados</p>
                <p className="text-3xl font-black text-room-success">{approvedAccess}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2">Rechazados</p>
                <p className="text-3xl font-black text-room-error">{rejectedAccess}</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer Note */}
      <div className="text-center pt-4">
        <p className="text-xs text-white/30 uppercase tracking-widest">
          Datos actualizados en tiempo real • Última actualización: {lastUpdate.toLocaleString('es-MX')}
          {isRefreshing && <span className="ml-2 text-room-primary">actualizando...</span>}
        </p>
      </div>
    </div>
  );
};

export default ReportsPage;
