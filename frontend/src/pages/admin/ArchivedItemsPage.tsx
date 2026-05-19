import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrash,
  faSearch,
  faRotateLeft,
  faXmark,
  faCircleCheck,
  faExclamationTriangle,
  faBuilding
} from '@fortawesome/free-solid-svg-icons';
import { Button } from '../../components/globalcomponent/Button';
import api from '../../services/api';
import { showAlert } from '../../services/alerts';

interface ArchivedEmployee {
  id: number;
  internalId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  departmentName: string;
  createdAt: string;
}

interface ArchivedAdmin {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  createdAt: string;
}

interface ArchivedDepartment {
  id: number;
  name: string;
  description: string;
  createdAt: string;
}

const ArchivedItemsPage = () => {
  const [activeTab, setActiveTab] = useState<'employees' | 'admins' | 'departments'>('employees');
  const [archivedEmployees, setArchivedEmployees] = useState<ArchivedEmployee[]>([]);
  const [archivedAdmins, setArchivedAdmins] = useState<ArchivedAdmin[]>([]);
  const [archivedDepartments, setArchivedDepartments] = useState<ArchivedDepartment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [deleteConfirmType, setDeleteConfirmType] = useState<'employee' | 'admin' | 'department' | null>(null);

  useEffect(() => {
    fetchArchivedData();
  }, []);

  const fetchArchivedData = async () => {
    try {
      setIsLoading(true);
      const [empData, adminData, deptData] = await Promise.all([
        api.get('/employees/archived/list'),
        api.get('/admins/archived/list'),
        api.get('/departments/archived/list')
      ]);
      setArchivedEmployees(Array.isArray(empData) ? empData : []);
      setArchivedAdmins(Array.isArray(adminData) ? adminData : []);
      setArchivedDepartments(Array.isArray(deptData) ? deptData : []);
    } catch (error) {
      console.error('Error fetching archived data:', error);
      showAlert.error('Error', 'No se pudieron cargar los elementos archivados.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (id: number, type: 'employee' | 'admin' | 'department') => {
    try {
      let endpoint;
      if (type === 'employee') endpoint = `/employees/${id}/restore`;
      else if (type === 'admin') endpoint = `/admins/${id}/restore`;
      else endpoint = `/departments/${id}/restore`;
      await api.put(endpoint, {});
      showAlert.success('Restaurado', `El elemento ha sido restaurado exitosamente.`);
      fetchArchivedData();
    } catch (error) {
      showAlert.error('Error', 'No se pudo restaurar el elemento.');
    }
  };

  const handlePermanentDelete = async (id: number, type: 'employee' | 'admin' | 'department') => {
    try {
      let endpoint;
      if (type === 'employee') endpoint = `/employees/${id}/permanent`;
      else if (type === 'admin') endpoint = `/admins/${id}/permanent`;
      else endpoint = `/departments/${id}/permanent`;
      await api.delete(endpoint);
      showAlert.success('Eliminado Permanentemente', 'El elemento ha sido eliminado de forma permanente.');
      setDeleteConfirmId(null);
      setDeleteConfirmType(null);
      fetchArchivedData();
    } catch (error) {
      showAlert.error('Error', 'No se pudo eliminar el elemento.');
    }
  };

  const filteredEmployees = archivedEmployees.filter(e =>
    e.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.internalId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAdmins = archivedAdmins.filter(a =>
    a.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDepartments = archivedDepartments.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Confirmation Modal */}
      {deleteConfirmId !== null && deleteConfirmType !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-md bg-[#1f2a3c] border border-white/10 rounded-room shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-center gap-3 bg-[#152031]">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-room-error text-xl" />
              <h3 className="text-lg font-black uppercase tracking-tight text-white">
                Eliminación Permanente
              </h3>
            </div>

            <div className="p-8 space-y-6">
              <p className="text-white/70">
                ¿Estás seguro de que deseas eliminar permanentemente este elemento? Esta acción no se puede deshacer.
              </p>

              <div className="flex gap-4">
                <Button
                  type="button"
                  onClick={() => {
                    setDeleteConfirmId(null);
                    setDeleteConfirmType(null);
                  }}
                  text="Cancelar"
                  iconLeft={faXmark}
                  variant="secondary"
                  className="flex-1 py-3 uppercase text-[10px] tracking-widest font-bold"
                />
                <Button
                  type="button"
                  onClick={() => handlePermanentDelete(deleteConfirmId, deleteConfirmType)}
                  text="Eliminar Permanentemente"
                  iconLeft={faTrash}
                  variant="danger"
                  className="flex-1 py-3 uppercase text-[10px] tracking-widest font-bold"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight text-white">
            Gestión de <span className="text-room-primary">Elementos Archivados</span>
          </h2>
          <p className="text-white/40 text-sm mt-1">Restaura o elimina permanentemente elementos del sistema.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/5">
        <button
          onClick={() => {
            setActiveTab('employees');
            setSearchTerm('');
          }}
          className={`px-6 py-3 font-bold uppercase text-[10px] tracking-wider transition-all ${
            activeTab === 'employees'
              ? 'text-room-primary border-b-2 border-room-primary'
              : 'text-white/40 hover:text-white/60'
          }`}
        >
          Empleados ({archivedEmployees.length})
        </button>
        <button
          onClick={() => {
            setActiveTab('admins');
            setSearchTerm('');
          }}
          className={`px-6 py-3 font-bold uppercase text-[10px] tracking-wider transition-all ${
            activeTab === 'admins'
              ? 'text-room-primary border-b-2 border-room-primary'
              : 'text-white/40 hover:text-white/60'
          }`}
        >
          Administradores ({archivedAdmins.length})
        </button>
        <button
          onClick={() => {
            setActiveTab('departments');
            setSearchTerm('');
          }}
          className={`px-6 py-3 font-bold uppercase text-[10px] tracking-wider transition-all ${
            activeTab === 'departments'
              ? 'text-room-primary border-b-2 border-room-primary'
              : 'text-white/40 hover:text-white/60'
          }`}
        >
          Departamentos ({archivedDepartments.length})
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-[#152031] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96 group">
            <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-room-primary transition-colors" />
            <input
              type="text"
              placeholder="Buscar elemento archivado..."
              className="w-full bg-[#040e1f] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-room-primary/50 transition-all text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[300px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <div className="w-12 h-12 border-4 border-room-primary/30 border-t-room-primary rounded-full animate-spin"></div>
              <p className="text-[10px] uppercase font-black text-room-primary animate-pulse">Consultando Elementos Archivados...</p>
            </div>
          ) : activeTab === 'employees' ? (

            <>
              {filteredEmployees.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                  <FontAwesomeIcon icon={faTrash} className="text-white/20 text-3xl" />
                  <p className="text-white/40 uppercase text-sm font-bold">No hay empleados archivados</p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#040e1f]/50 border-b border-white/5">
                      <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">PIN / Empleado</th>
                      <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Email</th>
                      <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Departamento</th>
                      <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredEmployees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-room-primary/20 flex items-center justify-center text-room-primary font-black text-xs border border-room-primary/30">
                              {emp.internalId}
                            </div>
                            <div>
                              <p className="font-bold text-white text-sm">{emp.firstName} {emp.lastName}</p>
                              <p className="text-[10px] text-white/40">{emp.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm text-white/60">{emp.email}</td>
                        <td className="px-6 py-5 text-sm text-white/60">{emp.departmentName}</td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => handleRestore(emp.id, 'employee')}
                              className="p-2 rounded-lg bg-room-primary/10 text-room-primary hover:bg-room-primary/20 transition-colors"
                              title="Restaurar"
                            >
                              <FontAwesomeIcon icon={faRotateLeft} />
                            </button>
                            <button
                              onClick={() => {
                                setDeleteConfirmId(emp.id);
                                setDeleteConfirmType('employee');
                              }}
                              className="p-2 rounded-lg bg-room-error/10 text-room-error hover:bg-room-error/20 transition-colors"
                              title="Eliminar Permanentemente"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          ) : activeTab === 'admins' ? (
            <>
              {filteredAdmins.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                  <FontAwesomeIcon icon={faTrash} className="text-white/20 text-3xl" />
                  <p className="text-white/40 uppercase text-sm font-bold">No hay administradores archivados</p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#040e1f]/50 border-b border-white/5">
                      <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Usuario / Administrador</th>
                      <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Email</th>
                      <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Teléfono</th>
                      <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredAdmins.map((admin) => (
                      <tr key={admin.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-room-primary/20 flex items-center justify-center text-room-primary font-black text-xs border border-room-primary/30">
                              {admin.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-white text-sm">{admin.fullName || admin.username}</p>
                              <p className="text-[10px] text-white/40">{admin.username}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm text-white/60">{admin.email}</td>
                        <td className="px-6 py-5 text-sm text-white/60">{admin.phone || '-'}</td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => handleRestore(admin.id, 'admin')}
                              className="p-2 rounded-lg bg-room-primary/10 text-room-primary hover:bg-room-primary/20 transition-colors"
                              title="Restaurar"
                            >
                              <FontAwesomeIcon icon={faRotateLeft} />
                            </button>
                            <button
                              onClick={() => {
                                setDeleteConfirmId(admin.id);
                                setDeleteConfirmType('admin');
                              }}
                              className="p-2 rounded-lg bg-room-error/10 text-room-error hover:bg-room-error/20 transition-colors"
                              title="Eliminar Permanentemente"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          ) : (
            <>
              {filteredDepartments.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                  <FontAwesomeIcon icon={faTrash} className="text-white/20 text-3xl" />
                  <p className="text-white/40 uppercase text-sm font-bold">No hay departamentos archivados</p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#040e1f]/50 border-b border-white/5">
                      <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Departamento</th>
                      <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Descripción</th>
                      <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Creado</th>
                      <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredDepartments.map((dept) => (
                      <tr key={dept.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-room-primary/20 flex items-center justify-center text-room-primary font-black text-xs border border-room-primary/30">
                              {dept.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-white text-sm">{dept.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm text-white/60 max-w-xs truncate">{dept.description || '-'}</td>
                        <td className="px-6 py-5 text-sm text-white/60">{new Date(dept.createdAt).toLocaleDateString('es-MX')}</td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => handleRestore(dept.id, 'department')}
                              className="p-2 rounded-lg bg-room-primary/10 text-room-primary hover:bg-room-primary/20 transition-colors"
                              title="Restaurar"
                            >
                              <FontAwesomeIcon icon={faRotateLeft} />
                            </button>
                            <button
                              onClick={() => {
                                setDeleteConfirmId(dept.id);
                                setDeleteConfirmType('department');
                              }}
                              className="p-2 rounded-lg bg-room-error/10 text-room-error hover:bg-room-error/20 transition-colors"
                              title="Eliminar Permanentemente"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArchivedItemsPage;
