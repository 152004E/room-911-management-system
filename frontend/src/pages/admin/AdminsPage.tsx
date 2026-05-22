import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserShield, 
  faPlus, 
  faCircleCheck, 
  faEdit,
  faTrash,
  faSearch,
  faXmark,
  faLock,
  faIdCard,
  faFingerprint,
  faUser,
  faShieldHalved,
  faChevronDown,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import { Button } from '../../components/globalcomponent/Button';
import api from '../../services/api';
import { showAlert } from '../../services/alerts';
import type { Employee } from '../../types/room911.types';

interface Admin {
  id: number;
  employeeId: number;
  employeeName: string;
  employeeEmail: string;
  username: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

const AdminsPage = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [availableEmployees, setAvailableEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingAdminId, setEditingAdminId] = useState<number | null>(null);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: 0,
    password: '',
    isActive: true
  });

  useEffect(() => {
    fetchAdmins();
    fetchAvailableEmployees();
  }, []);

  const fetchAdmins = async () => {
    try {
      setIsLoading(true);
      const data = await api.get('/admins');
      setAdmins(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching admins:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailableEmployees = async () => {
    try {
      const data = await api.get('/employees');
      setAvailableEmployees(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching available employees:', error);
    }
  };

  const [editingAdminData, setEditingAdminData] = useState<{ username: string; employeeName: string } | null>(null);

  const selectedEmployee = availableEmployees.find(e => e.id === formData.employeeId);

  const filteredEmployees = availableEmployees.filter(e => {
    const search = employeeSearch.toLowerCase();
    return (
      e.firstName.toLowerCase().includes(search) ||
      e.lastName.toLowerCase().includes(search) ||
      e.internalId.toLowerCase().includes(search) ||
      e.email.toLowerCase().includes(search)
    );
  });

  const handleEdit = (admin: Admin) => {
    setIsEdit(true);
    setEditingAdminId(admin.id);
    setEditingAdminData({ username: admin.username, employeeName: admin.employeeName });
    setFormData({
      employeeId: admin.employeeId,
      password: '',
      isActive: admin.isActive
    });
    setEmployeeSearch(admin.employeeName || '');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEdit && !formData.employeeId) {
      showAlert.error('Error', 'Debe seleccionar un empleado.');
      return;
    }
    try {
      const payload: any = {
        employeeId: formData.employeeId,
        password: formData.password,
        isActive: formData.isActive
      };

      if (isEdit && editingAdminId !== null) {
        payload.id = editingAdminId;
        payload.username = editingAdminData?.username;
        await api.put(`/admins/${editingAdminId}`, payload);
        showAlert.success('Administrador Actualizado', `La cuenta ha sido actualizada.`);
      } else {
        const created = await api.post('/admins', payload);
        showAlert.success('Administrador Registrado', `El administrador "${created.username}" ha sido registrado exitosamente.`);
      }
      setShowModal(false);
      resetForm();
      fetchAdmins();
    } catch (error) {
      showAlert.error('Error de Operación', isEdit ? 'No se pudo actualizar los datos del administrador.' : 'No se pudo registrar al administrador.');
    }
  };

  const resetForm = () => {
    setFormData({
      employeeId: 0,
      password: '',
      isActive: true
    });
    setEmployeeSearch('');
    setIsEdit(false);
    setEditingAdminId(null);
    setEditingAdminData(null);
  };

  const generatedUsername = !isEdit && selectedEmployee
    ? `${selectedEmployee.firstName.toLowerCase()}.${selectedEmployee.lastName.toLowerCase()}`.replace(/[^a-z0-9.]/g, '')
    : '';

  return (
    <div className="space-y-8 animate-fade-in relative">
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-[#1f2a3c] border border-white/10 rounded-room shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#152031]">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={isEdit ? faEdit : faFingerprint} className="text-room-primary animate-pulse" />
                <h3 className="text-lg font-black uppercase tracking-tight text-white">
                  {isEdit ? 'Actualizar Credenciales' : 'Registro de Administrador'}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-white/20 hover:text-white transition-colors">
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Empleado */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
                  Empleado
                </label>
                <div className="relative">
                  <div className="relative group">
                    <FontAwesomeIcon icon={faUser} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-room-primary transition-colors z-10" />
                    <input
                      type="text"
                      className="w-full bg-[#040e1f] border border-white/10 rounded-room pl-12 pr-10 py-3 text-sm text-white focus:ring-2 focus:ring-room-primary/50 focus:outline-none transition-all cursor-pointer"
                      placeholder="Buscar empleado por nombre o ID..."
                      value={isEdit ? (selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName} (${selectedEmployee.internalId})` : employeeSearch) : employeeSearch}
                      onChange={(e) => {
                        setEmployeeSearch(e.target.value);
                        if (!isEdit) {
                          setFormData({...formData, employeeId: 0});
                          setShowEmployeeDropdown(true);
                        }
                      }}
                      onFocus={() => !isEdit && setShowEmployeeDropdown(true)}
                      readOnly={isEdit}
                      required={!isEdit}
                    />
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none"
                    />
                  </div>

                  {showEmployeeDropdown && !isEdit && (
                    <div className="absolute z-50 mt-1 w-full bg-[#1f2a3c] border border-white/10 rounded-room shadow-2xl max-h-60 overflow-y-auto">
                      {filteredEmployees.length === 0 ? (
                        <div className="p-4 text-xs text-white/40 text-center">No hay empleados disponibles</div>
                      ) : (
                        filteredEmployees.map(emp => (
                          <button
                            type="button"
                            key={emp.id}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0 ${
                              formData.employeeId === emp.id ? 'bg-room-primary/10' : ''
                            }`}
                            onClick={() => {
                              setFormData({...formData, employeeId: emp.id});
                              setEmployeeSearch(`${emp.firstName} ${emp.lastName} (${emp.internalId})`);
                              setShowEmployeeDropdown(false);
                            }}
                          >
                            <div className="w-8 h-8 rounded-full bg-room-primary/20 flex items-center justify-center text-room-primary font-black text-[10px] border border-room-primary/30 shrink-0">
                              {emp.internalId}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-white uppercase truncate">{emp.firstName} {emp.lastName}</p>
                              <p className="text-[10px] text-white/40 truncate">{emp.email} · {emp.departmentName}</p>
                            </div>
                            <span className="text-[9px] font-mono text-room-primary shrink-0">{emp.internalId}</span>
                          </button>
                        ))
                      )}
                    </div>
                  )}

                  {isEdit && selectedEmployee && (
                    <div className="mt-2 flex items-center gap-2 px-4 py-2 bg-room-primary/5 border border-room-primary/20 rounded-room">
                      <div className="w-6 h-6 rounded-full bg-room-primary/20 flex items-center justify-center text-room-primary font-black text-[9px] border border-room-primary/30">
                        {selectedEmployee.internalId}
                      </div>
                      <p className="text-xs text-white/60">
                        {selectedEmployee.firstName} {selectedEmployee.lastName} · {selectedEmployee.email}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Username - auto-generado en creación / solo lectura en edición */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
                  Usuario de Ingreso
                </label>
                <div className="relative group">
                  <FontAwesomeIcon icon={faIdCard} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-room-primary transition-colors z-10" />
                  <input
                    className="w-full bg-[#040e1f] border border-white/10 rounded-room pl-12 pr-4 py-3 text-sm text-white/60 focus:ring-2 focus:ring-room-primary/50 focus:outline-none transition-all cursor-not-allowed"
                    value={isEdit ? (editingAdminData?.username || '') : generatedUsername}
                    readOnly
                  />
                </div>
                {!isEdit && selectedEmployee && (
                  <p className="flex items-center gap-1 text-[10px] text-room-primary">
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Se generará automáticamente desde el nombre del empleado
                  </p>
                )}
                {isEdit && (
                  <p className="flex items-center gap-1 text-[10px] text-white/40">
                    <FontAwesomeIcon icon={faInfoCircle} />
                    El usuario no se puede modificar
                  </p>
                )}
              </div>

              {/* Contraseña */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
                  {isEdit ? 'Nueva Contraseña (Opcional)' : 'Contraseña'}
                </label>
                <div className="relative group">
                  <FontAwesomeIcon icon={faLock} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-room-primary transition-colors" />
                  <input
                    type="password"
                    className="w-full bg-[#040e1f] border border-white/10 rounded-room pl-12 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-room-primary/50 focus:outline-none transition-all"
                    placeholder={isEdit ? "•••••••• (dejar en blanco para mantener)" : "••••••••"}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required={!isEdit}
                  />
                </div>
              </div>

              {/* isActive */}
              <div className="flex items-center justify-between p-4 bg-[#040e1f] rounded-room border border-white/5">
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faShieldHalved} className={formData.isActive ? 'text-room-success' : 'text-white/20'} />
                  <div>
                    <p className="text-xs font-bold text-white uppercase">Cuenta Activa</p>
                    <p className="text-[10px] text-white/30 uppercase">Habilitar acceso al sistema</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-room-primary"></div>
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  onClick={() => setShowModal(false)}
                  text="Cancelar"
                  iconLeft={faXmark}
                  variant="secondary"
                  className="flex-1 py-4 uppercase text-[10px] tracking-widest font-bold"
                />
                <Button
                  type="submit"
                  text={isEdit ? "Guardar" : "Registrar Administrador"}
                  iconLeft={isEdit ? faCircleCheck : faPlus}
                  variant="primary"
                  className="flex-1 py-4 uppercase text-[10px] tracking-widest font-bold"
                />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight text-white">
            Gestión de <span className="text-room-primary">Administradores</span>
          </h2>
          <p className="text-white/40 text-sm mt-1">Supervisión jerárquica y control de protocolos de seguridad.</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          text="Añadir Administrador"
          iconLeft={faPlus}
          variant="primary"
          className="shadow-glow py-3 px-8"
        />
      </div>

      {/* Table */}
      <div className="bg-[#152031] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96 group">
            <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-room-primary transition-colors" />
            <input
              type="text"
              placeholder="Buscar por nombre, ID o email..."
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
              <p className="text-[10px] uppercase font-black text-room-primary animate-pulse">Consultando Registros Maestros...</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#040e1f]/50 border-b border-white/5">
                  <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">ID / Nombre</th>
                  <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Email Institucional</th>
                  <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Nivel</th>
                  <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Estado</th>
                  <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {admins.filter(a =>
                  a.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (a.employeeName && a.employeeName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                  a.employeeEmail.toLowerCase().includes(searchTerm.toLowerCase())
                ).map((admin) => (
                  <tr key={admin.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-room-primary/20 flex items-center justify-center text-room-primary font-black text-xs border border-room-primary/30">
                          AD
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white uppercase tracking-tight">{admin.employeeName || 'Oficial'}</p>
                          <p className="text-[10px] text-room-primary font-mono tracking-wider">{admin.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-[11px] text-white/60 font-medium">{admin.employeeEmail}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-2 py-1 bg-white/5 rounded text-[10px] font-mono text-room-primary border border-white/5">
                        {admin.role}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${admin.isActive ? 'bg-room-success animate-pulse' : 'bg-room-error'}`}></div>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${admin.isActive ? 'text-room-success' : 'text-room-error'}`}>
                          {admin.isActive ? 'ACTIVO' : 'DE BAJA'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          onClick={() => handleEdit(admin)}
                          text=""
                          iconLeft={faEdit}
                          variant="secondary"
                          className="w-8 h-8 !p-0 !gap-0 rounded-room"
                        />
                        <Button
                          onClick={async () => {
                            const result = await showAlert.confirm(
                              '¿Dar de baja / Eliminar?',
                              `¿Está seguro de eliminar al administrador ${admin.employeeName || admin.username}? Esta acción no se puede deshacer.`,
                              'Eliminar'
                            );
                            if (result.isConfirmed) {
                              try {
                                await api.delete(`/admins/${admin.id}`);
                                showAlert.success('Registro Eliminado', 'El administrador ha sido removido del sistema.');
                                fetchAdmins();
                              } catch (e) {
                                showAlert.error('Acción Fallida', 'No se pudo eliminar el registro del administrador.');
                              }
                            }
                          }}
                          text=""
                          iconLeft={faTrash}
                          variant="error"
                          className="w-8 h-8 !p-0 !gap-0 rounded-room"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminsPage;