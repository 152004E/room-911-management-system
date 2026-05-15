import { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faUserPlus,
  faSearch,
  faFilter,
  faEye,
  faPen,
  faTrash,
  faChevronLeft,
  faChevronRight,
  faSpinner,
  faTriangleExclamation,
  faRotateRight,
  faIdBadge,
  faBuilding,
  faCircleCheck,
  faCircleXmark,
  faTimes,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import api from '../../services/api';
import { Button } from '../../components/globalcomponent/Button';

// ─── Types ────────────────────────────────────────────────────────────────────

// Shape returned by the backend (EmployeeDTO)
interface EmployeeDTO {
  id: number;
  internalId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  isAuthorized: boolean;
  departmentId?: number;
  departmentName?: string;
}

// Shape used internally by the UI
interface Employee {
  employeeId: number;
  internalId: string;
  name: string;
  departmentName: string;
  accessStatus: 'ACTIVE' | 'INACTIVE';
  email?: string;
  phone?: string;
}

const mapDTO = (dto: EmployeeDTO): Employee => ({
  employeeId: dto.id,
  internalId: dto.internalId,
  name: `${dto.firstName} ${dto.lastName}`,
  departmentName: dto.departmentName ?? '—',
  accessStatus: dto.isAuthorized ? 'ACTIVE' : 'INACTIVE',
  email: dto.email,
  phone: dto.phoneNumber,
});

// ─── Status Badge ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; icon: typeof faCircleCheck; cls: string }> = {
  ACTIVE:   { label: 'Autorizado',    icon: faCircleCheck, cls: 'bg-room-success/10 text-room-success border border-room-success/20' },
  INACTIVE: { label: 'No Autorizado', icon: faCircleXmark, cls: 'bg-room-error/10 text-room-error border border-room-error/20' },
};

const StatusBadge = ({ status }: { status: Employee['accessStatus'] }) => {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.INACTIVE;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${cfg.cls}`}>
      <FontAwesomeIcon icon={cfg.icon} className="text-[10px]" />
      {cfg.label}
    </span>
  );
};

// ─── Avatar Placeholder ───────────────────────────────────────────────────────

const Avatar = ({ name }: { name: string }) => {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
  return (
    <div className="w-9 h-9 rounded-full bg-room-primary/20 border border-room-primary/30 flex items-center justify-center text-room-primary text-xs font-bold shrink-0">
      {initials}
    </div>
  );
};

// ─── Modal de Confirmación de Eliminación ─────────────────────────────────────

const DeleteModal = ({
  employee,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  employee: Employee;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
    <div className="relative bg-[#152031] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-room-error/10 border border-room-error/20 flex items-center justify-center shrink-0">
          <FontAwesomeIcon icon={faTriangleExclamation} className="text-room-error text-xl" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-1">Confirmar Eliminación</h3>
          <p className="text-sm text-white/50 leading-relaxed">
            ¿Está seguro que desea eliminar a <strong className="text-white">{employee.name}</strong> ({employee.internalId})? Esta acción no se puede deshacer.
          </p>
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <Button variant="secondary" text="Cancelar" iconLeft={faTimes} onClick={onCancel} />
        <Button variant="error" text="Eliminar" iconLeft={faTrash} onClick={onConfirm} isLoading={isDeleting} loadingText="Eliminando..." />
      </div>
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const DEPARTMENTS = ['Todos', 'I+D', 'Seguridad', 'Producción', 'Logística', 'Administración'];
const PAGE_SIZE = 10;

const EmployeesPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [total, setTotal]         = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage]           = useState(0);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [search, setSearch]       = useState('');
  const [deptFilter, setDeptFilter] = useState('Todos');
  const [toDelete, setToDelete]   = useState<Employee | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // El backend devuelve List<EmployeeDTO> (array plano, sin paginación)
      const raw = await api.get<EmployeeDTO[]>('/employees');
      const mapped = (raw ?? []).map(mapDTO);

      // Filtrado local por búsqueda y departamento
      const filtered = mapped.filter((e) => {
        const matchSearch =
          !search ||
          e.name.toLowerCase().includes(search.toLowerCase()) ||
          e.internalId.toLowerCase().includes(search.toLowerCase()) ||
          (e.email ?? '').toLowerCase().includes(search.toLowerCase());
        const matchDept =
          deptFilter === 'Todos' || e.departmentName === deptFilter;
        return matchSearch && matchDept;
      });

      // Paginación local
      const start = page * PAGE_SIZE;
      const paginated = filtered.slice(start, start + PAGE_SIZE);
      setEmployees(paginated);
      setTotal(filtered.length);
      setTotalPages(Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)));
    } catch (err: any) {
      setEmployees([]);
      setTotal(0);
      setTotalPages(0);
      if (!err.message?.includes('401') && !err.message?.includes('403')) {
        setError('No se pudo conectar con el servidor. Verifique que el backend esté activo.');
      }
    } finally {
      setLoading(false);
    }
  }, [page, search, deptFilter]);

  useEffect(() => {
    const timer = setTimeout(fetchEmployees, search ? 400 : 0);
    return () => clearTimeout(timer);
  }, [fetchEmployees]);

  const handleDelete = async () => {
    if (!toDelete) return;
    setIsDeleting(true);
    try {
      await api.delete(`/employees/${toDelete.employeeId}`);
      setToDelete(null);
      fetchEmployees();
    } catch {
      setError('Error al eliminar el empleado.');
    } finally {
      setIsDeleting(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-room-primary/20 border border-room-primary/30 flex items-center justify-center">
              <FontAwesomeIcon icon={faUsers} className="text-room-primary text-sm" />
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight uppercase">Gestión de Empleados</h2>
          </div>
          <p className="text-sm text-white/40 ml-11">Administración y control de acceso del personal</p>
        </div>

        <Button
          variant="primary"
          text="Añadir Empleado"
          iconLeft={faUserPlus}
          onClick={() => {/* TODO: open modal */}}
        />
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-room-error/10 border border-room-error/20 rounded-xl">
          <FontAwesomeIcon icon={faTriangleExclamation} className="text-room-error shrink-0" />
          <p className="text-sm text-room-error flex-1">{error}</p>
          <button onClick={fetchEmployees} className="text-room-error/60 hover:text-room-error transition-colors p-1">
            <FontAwesomeIcon icon={faRotateRight} />
          </button>
        </div>
      )}

      {/* Action / Filter Bar */}
      <div className="bg-[#152031] border border-white/5 rounded-xl p-4 flex flex-col md:flex-row items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 w-full md:max-w-xs group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/20 group-focus-within:text-room-primary transition-colors">
            <FontAwesomeIcon icon={faSearch} className="text-sm" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder="Buscar empleado..."
            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm placeholder:text-white/20 focus:outline-none focus:border-room-primary/50 focus:ring-1 focus:ring-room-primary/50 transition-all text-white"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/20 hover:text-white transition-colors">
              <FontAwesomeIcon icon={faXmark} />
            </button>
          )}
        </div>

        {/* Department Filter */}
        <div className="relative w-full md:w-52">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/20">
            <FontAwesomeIcon icon={faFilter} className="text-sm" />
          </div>
          <select
            value={deptFilter}
            onChange={(e) => { setDeptFilter(e.target.value); setPage(0); }}
            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-room-primary/50 focus:ring-1 focus:ring-room-primary/50 transition-all appearance-none cursor-pointer"
          >
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d} className="bg-[#152031]">{d === 'Todos' ? 'Todos los Departamentos' : d}</option>
            ))}
          </select>
        </div>

        {/* Record count */}
        <div className="ml-auto hidden md:flex items-center gap-2 text-[10px] font-bold text-white/30 uppercase tracking-widest">
          <FontAwesomeIcon icon={faUsers} />
          <span>{total.toLocaleString()} registros</span>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-[#152031] border border-white/5 rounded-xl overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-[#0d1a2a] text-[10px] font-bold text-white/30 uppercase tracking-widest">
                <th className="px-5 py-4">Empleado</th>
                <th className="px-5 py-4">
                  <span className="flex items-center gap-2"><FontAwesomeIcon icon={faIdBadge} /> ID Interno</span>
                </th>
                <th className="px-5 py-4">
                  <span className="flex items-center gap-2"><FontAwesomeIcon icon={faBuilding} /> Departamento</span>
                </th>
                <th className="px-5 py-4">Estado de Acceso</th>
                <th className="px-5 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-white/[0.03]">
              {/* Loading rows */}
              {loading && (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-white/5" />
                        <div className="space-y-1.5">
                          <div className="h-3 w-32 bg-white/5 rounded" />
                          <div className="h-2.5 w-24 bg-white/5 rounded" />
                        </div>
                      </div>
                    </td>
                    {[1, 2, 3, 4].map((j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-3 bg-white/5 rounded w-20" />
                      </td>
                    ))}
                  </tr>
                ))
              )}

              {/* Empty state */}
              {!loading && employees.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <FontAwesomeIcon icon={faUsers} className="text-2xl text-white/20" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white/20 uppercase tracking-widest">Sin empleados registrados</p>
                        <p className="text-[11px] text-white/10 mt-1">
                          {search || deptFilter !== 'Todos'
                            ? 'No se encontraron resultados para los filtros aplicados.'
                            : 'Añada el primer empleado para comenzar a gestionar el personal.'}
                        </p>
                      </div>
                      {(search || deptFilter !== 'Todos') && (
                        <button
                          onClick={() => { setSearch(''); setDeptFilter('Todos'); }}
                          className="text-[11px] text-room-primary hover:text-blue-400 transition-colors flex items-center gap-1.5"
                        >
                          <FontAwesomeIcon icon={faXmark} /> Limpiar filtros
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}

              {/* Data rows */}
              {!loading && employees.map((emp) => (
                <tr key={emp.employeeId} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={emp.name} />
                      <div className="min-w-0">
                        <p className="font-semibold text-white truncate">{emp.name}</p>
                        <p className="text-[11px] text-white/30 truncate">{emp.email ?? emp.departmentName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-mono text-xs text-white/50 bg-white/5 px-2 py-1 rounded">{emp.internalId}</span>
                  </td>
                  <td className="px-5 py-4 text-white/70 text-xs">{emp.departmentName}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={emp.accessStatus} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        title="Ver detalles"
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/5 transition-all"
                      >
                        <FontAwesomeIcon icon={faEye} className="text-sm" />
                      </button>
                      <button
                        title="Editar empleado"
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-room-primary hover:bg-room-primary/10 transition-all"
                      >
                        <FontAwesomeIcon icon={faPen} className="text-sm" />
                      </button>
                      <button
                        title="Eliminar empleado"
                        onClick={() => setToDelete(emp)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-room-error hover:bg-room-error/10 transition-all"
                      >
                        <FontAwesomeIcon icon={faTrash} className="text-sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="border-t border-white/5 px-5 py-3 flex items-center justify-between bg-[#0d1a2a]">
          <span className="text-[10px] text-white/20 uppercase tracking-widest font-bold">
            {loading ? (
              <span className="flex items-center gap-2"><FontAwesomeIcon icon={faSpinner} className="animate-spin" /> Cargando...</span>
            ) : (
              `Mostrando ${employees.length === 0 ? 0 : page * PAGE_SIZE + 1}–${Math.min((page + 1) * PAGE_SIZE, total ?? 0)} de ${(total ?? 0).toLocaleString()} empleados`
            )}
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={page === 0 || loading}
              onClick={() => setPage((p) => p - 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="text-sm" />
            </button>

            {/* Page numbers */}
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pageNum = totalPages <= 5 ? i : Math.max(0, Math.min(page - 2, totalPages - 5)) + i;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  disabled={loading}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    pageNum === page
                      ? 'bg-room-primary text-white shadow-glow'
                      : 'text-white/30 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {pageNum + 1}
                </button>
              );
            })}

            <button
              disabled={page >= totalPages - 1 || loading}
              onClick={() => setPage((p) => p + 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
            >
              <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {toDelete && (
        <DeleteModal
          employee={toDelete}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

export default EmployeesPage;
