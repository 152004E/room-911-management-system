import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory, faSearch, faCircleCheck, faCircleXmark, faClock, faUser } from '@fortawesome/free-solid-svg-icons';
import api from '../../services/api';

interface AccessLog {
  id: number;
  attemptedInternalId: string;
  employeeId?: number;
  employeeFullName?: string;
  firstName?: string;
  lastName?: string;
  accessTimestamp: string;
  isSuccessful: boolean;
  accessType?: string;
  reasonDenied?: string;
}

const AccessLogsPage = () => {
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filterSuccess, setFilterSuccess] = useState<'all' | 'success' | 'failed'>('all');

  useEffect(() => {
    fetchAccessLogs();
    // Auto-refresh cada 10 segundos
    const interval = setInterval(fetchAccessLogs, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchAccessLogs = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/access-logs');
      setLogs(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error fetching access logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLogs = logs
    .filter(log => {
      const employeeName = log.employeeFullName || `${log.firstName || ''} ${log.lastName || ''}`.trim();
      const matchesSearch =
        log.attemptedInternalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employeeName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filterSuccess === 'all' ||
        (filterSuccess === 'success' && log.isSuccessful) ||
        (filterSuccess === 'failed' && !log.isSuccessful);

      return matchesSearch && matchesFilter;
    })
    .reverse();

  const successCount = logs.filter(l => l.isSuccessful).length;
  const failedCount = logs.filter(l => !l.isSuccessful).length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-room-primary/20 rounded-lg flex items-center justify-center border border-room-primary/30">
          <FontAwesomeIcon icon={faHistory} className="text-room-primary text-xl" />
        </div>
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white">Registros de Acceso</h1>
          <p className="text-sm text-white/40 mt-1">Historial de todos los intentos de acceso al ROOM 911</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass p-6 rounded-room">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2">Total Intentos</p>
              <p className="text-4xl font-black text-room-primary">{logs.length}</p>
            </div>
            <div className="w-14 h-14 bg-room-primary/10 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faClock} className="text-room-primary text-2xl" />
            </div>
          </div>
        </div>

        <div className="glass p-6 rounded-room">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2">Accesos Aprobados</p>
              <p className="text-4xl font-black text-room-success">{successCount}</p>
            </div>
            <div className="w-14 h-14 bg-room-success/10 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faCircleCheck} className="text-room-success text-2xl" />
            </div>
          </div>
        </div>

        <div className="glass p-6 rounded-room">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2">Accesos Denegados</p>
              <p className="text-4xl font-black text-room-error">{failedCount}</p>
            </div>
            <div className="w-14 h-14 bg-room-error/10 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faCircleXmark} className="text-room-error text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-[#152031] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
        {/* Search and Filters */}
        <div className="p-6 border-b border-white/5 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
              <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-room-primary transition-colors" />
              <input
                type="text"
                placeholder="Buscar por PIN o empleado..."
                className="w-full bg-[#040e1f] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-room-primary/50 transition-all text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'success', 'failed'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setFilterSuccess(filter)}
                  className={`px-4 py-3 rounded-lg uppercase text-[10px] font-bold tracking-widest transition-all ${
                    filterSuccess === filter
                      ? filter === 'success'
                        ? 'bg-room-success/20 border border-room-success/50 text-room-success'
                        : filter === 'failed'
                        ? 'bg-room-error/20 border border-room-error/50 text-room-error'
                        : 'bg-room-primary/20 border border-room-primary/50 text-room-primary'
                      : 'bg-white/5 border border-white/10 text-white/40 hover:text-white/60'
                  }`}
                >
                  {filter === 'all' ? 'Todos' : filter === 'success' ? 'Aprobados' : 'Denegados'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-96 gap-4">
              <div className="w-12 h-12 border-4 border-room-primary/30 border-t-room-primary rounded-full animate-spin"></div>
              <p className="text-[10px] uppercase font-black text-room-primary animate-pulse">Cargando registros de acceso...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 gap-4">
              <FontAwesomeIcon icon={faHistory} className="text-white/20 text-3xl" />
              <p className="text-white/40 uppercase text-sm font-bold">No hay registros de acceso</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#040e1f]/50 border-b border-white/5 sticky top-0">
                  <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Hora de Intento</th>
                  <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">PIN Utilizado</th>
                  <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Empleado</th>
                  <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Estado</th>
                  <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-5">
                      <p className="text-sm font-mono text-white/70">
                        {new Date(log.accessTimestamp).toLocaleString('es-MX')}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 bg-room-primary/10 rounded-lg text-sm font-black text-room-primary border border-room-primary/30">
                        {log.attemptedInternalId}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      {log.employeeId ? (
                        <div className="flex items-center gap-2">
                          <FontAwesomeIcon icon={faUser} className="text-white/40" />
                          <span className="text-sm font-bold text-white">
                            {log.employeeFullName || `${log.firstName || ''} ${log.lastName || ''}`.trim()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-white/40 italic">No registrado</span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={log.isSuccessful ? faCircleCheck : faCircleXmark}
                          className={log.isSuccessful ? 'text-room-success' : 'text-room-error'}
                        />
                        <span
                          className={`text-[10px] font-bold uppercase tracking-widest ${
                            log.isSuccessful ? 'text-room-success' : 'text-room-error'
                          }`}
                        >
                          {log.isSuccessful ? 'Aprobado' : 'Denegado'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-[10px] text-white/50">
                        {log.reasonDenied ? log.reasonDenied : log.accessType || 'Acceso normal'}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-4">
        <p className="text-xs text-white/30 uppercase tracking-widest">
          Total de registros: {filteredLogs.length} • Auto-actualización cada 10 segundos
        </p>
      </div>
    </div>
  );
};

export default AccessLogsPage;
