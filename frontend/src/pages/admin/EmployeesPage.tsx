import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faPlus,
  faSearch,
  faXmark,
  faUser,
  faAt,
  faPhone,
  faBuilding,
  faIdCard,
  faEdit,
  faTrash,
  faCircleCheck,
  faCircleXmark,
  faShieldHalved,
  faFileUpload,
  faDownload
} from '@fortawesome/free-solid-svg-icons';
import { Button } from '../../components/globalcomponent/Button';
import api from '../../services/api';
import { showAlert } from '../../services/alerts';

interface Employee {
  id: number;
  internalId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  isAuthorized: boolean;
  departmentId: number;
  departmentName: string;
  createdAt: string;
}

interface Department {
  id: number;
  name: string;
}

const EmployeesPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState<number | null>(null);
  const [csvFile, setCSVFile] = useState<File | null>(null);
  const [csvLoading, setCSVLoading] = useState(false);
  const [csvResult, setCSVResult] = useState<{successCount: number, errorCount: number, errors: string[]} | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    departmentId: 1,
    isAuthorized: true,
    internalId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [empData, deptData] = await Promise.all([
        api.get('/employees'),
        api.get('/departments')
      ]);
      setEmployees(Array.isArray(empData) ? empData : []);
      setDepartments(Array.isArray(deptData) ? deptData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback para departamentos si falla la API
      setDepartments([
        { id: 1, name: 'I+D' },
        { id: 2, name: 'Seguridad' },
        { id: 3, name: 'Producción' },
        { id: 4, name: 'Administración' },
        { id: 5, name: 'Logística' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (emp: Employee) => {
    setIsEdit(true);
    setEditingEmployeeId(emp.id);
    setFormData({
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      phoneNumber: emp.phoneNumber || '',
      departmentId: emp.departmentId,
      isAuthorized: emp.isAuthorized,
      internalId: emp.internalId
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
       if (isEdit && editingEmployeeId !== null) {
        await api.put(`/employees/${editingEmployeeId}`, formData);
        showAlert.success('Personal Actualizado', `La ficha del empleado ${formData.firstName} ${formData.lastName} ha sido actualizada con éxito.`);
      } else {
        await api.post('/employees', formData);
        showAlert.success('Personal Registrado', `El empleado ${formData.firstName} ${formData.lastName} ha sido registrado exitosamente.`);
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      showAlert.error('Error de Operación', isEdit ? 'No se pudo actualizar los datos del empleado.' : 'No se pudo registrar al empleado.');
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      departmentId: 1,
      isAuthorized: true,
      internalId: ''
    });
    setIsEdit(false);
    setEditingEmployeeId(null);
  };

  const handleCSVUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvFile) {
      showAlert.error('Error', 'Por favor selecciona un archivo CSV');
      return;
    }

    try {
      setCSVLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append('file', csvFile);

      const response = await api.post('/employees/import-csv', formDataToSend);

      setCSVResult(response);
      showAlert.success('Importación Completada', `${response.successCount} empleados importados exitosamente.`);
      setCSVFile(null);
      fetchData();
      setTimeout(() => setShowCSVModal(false), 2000);
    } catch (error: any) {
      showAlert.error('Error de Importación', error.message || 'No se pudo importar el archivo CSV');
    } finally {
      setCSVLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Modal Premium para Empleados */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-[#1f2a3c] border border-white/10 rounded-room shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#152031]">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={isEdit ? faEdit : faPlus} className="text-room-primary" />
                <h3 className="text-lg font-black uppercase tracking-tight text-white">
                  {isEdit ? 'Actualizar Ficha de Personal' : 'Registro de Personal'}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-white/20 hover:text-white transition-colors">
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* PIN de Acceso Notice */}
              <div className="bg-room-primary/5 border border-room-primary/20 p-4 rounded-room flex items-center gap-4">
                <div className="w-10 h-10 rounded-room bg-room-primary/10 flex items-center justify-center text-room-primary">
                  <FontAwesomeIcon icon={faIdCard} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-room-primary uppercase tracking-widest">
                    {isEdit ? 'PIN de Acceso Asignado' : 'PIN de Acceso'}
                  </p>
                  <p className="text-xs text-white/60">
                    {isEdit ? `Código de Seguridad: ${formData.internalId}` : 'Generación automática encriptada (R9-XXXX)'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Nombre</label>
                  <div className="relative group">
                    <FontAwesomeIcon icon={faUser} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-room-primary transition-colors" />
                    <input 
                      className="w-full bg-[#040e1f] border border-white/10 rounded-room pl-12 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-room-primary/50 focus:outline-none transition-all"
                      placeholder="Nombre"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Apellido</label>
                  <div className="relative group">
                    <FontAwesomeIcon icon={faUser} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-room-primary transition-colors" />
                    <input 
                      className="w-full bg-[#040e1f] border border-white/10 rounded-room pl-12 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-room-primary/50 focus:outline-none transition-all"
                      placeholder="Apellido"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Email de Contacto</label>
                <div className="relative group">
                  <FontAwesomeIcon icon={faAt} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-room-primary transition-colors" />
                  <input 
                    type="email"
                    className="w-full bg-[#040e1f] border border-white/10 rounded-room pl-12 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-room-primary/50 focus:outline-none transition-all"
                    placeholder="email@ejemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Departamento</label>
                  <div className="relative group">
                    <FontAwesomeIcon icon={faBuilding} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-room-primary transition-colors" />
                    <select 
                      className="w-full bg-[#040e1f] border border-white/10 rounded-room pl-12 pr-10 py-3 text-sm text-white appearance-none focus:ring-2 focus:ring-room-primary/50 focus:outline-none cursor-pointer"
                      value={formData.departmentId}
                      onChange={(e) => setFormData({...formData, departmentId: parseInt(e.target.value)})}
                    >
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Teléfono</label>
                  <div className="relative group">
                    <FontAwesomeIcon icon={faPhone} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-room-primary transition-colors" />
                    <input 
                      className="w-full bg-[#040e1f] border border-white/10 rounded-room pl-12 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-room-primary/50 focus:outline-none transition-all"
                      placeholder="+XX..."
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#040e1f] rounded-room border border-white/5">
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faShieldHalved} className={formData.isAuthorized ? 'text-room-success' : 'text-white/20'} />
                  <div>
                    <p className="text-xs font-bold text-white uppercase">Acceso Autorizado</p>
                    <p className="text-[10px] text-white/30 uppercase">Habilitar entrada al ROOM_911</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.isAuthorized}
                    onChange={(e) => setFormData({...formData, isAuthorized: e.target.checked})}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-room-primary"></div>
                </label>
              </div>

              <div className="flex gap-4 pt-2">
                <Button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  text="Cerrar"
                  iconLeft={faXmark}
                  variant="secondary"
                  className="flex-1 py-4 uppercase text-[10px] tracking-widest font-bold"
                />
                <Button 
                  type="submit"
                  text={isEdit ? "Guardar" : "Registrar Personal"}
                  iconLeft={isEdit ? faCircleCheck : faPlus}
                  variant="primary"
                  className="flex-1 py-4 uppercase text-[10px] tracking-widest font-bold"
                />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Modal */}
      {showCSVModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-[#1f2a3c] border border-white/10 rounded-room shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#152031]">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faFileUpload} className="text-room-primary" />
                <h3 className="text-lg font-black uppercase tracking-tight text-white">
                  Importar Personal desde CSV
                </h3>
              </div>
              <button onClick={() => setShowCSVModal(false)} className="text-white/20 hover:text-white transition-colors">
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <form onSubmit={handleCSVUpload} className="p-8 space-y-6">
              <div className="bg-room-primary/5 border border-room-primary/20 p-4 rounded-room flex items-center gap-4">
                <div className="w-10 h-10 rounded-room bg-room-primary/10 flex items-center justify-center text-room-primary">
                  <FontAwesomeIcon icon={faFileUpload} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-room-primary uppercase tracking-widest">
                    Formato CSV
                  </p>
                  <p className="text-xs text-white/60">
                    Columnas: firstName, lastName, email, phoneNumber, departmentId, isAuthorized
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Selecciona archivo CSV</label>
                <div className="relative group">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => setCSVFile(e.target.files?.[0] || null)}
                    className="w-full bg-[#040e1f] border border-white/10 rounded-room px-4 py-3 text-sm text-white focus:ring-2 focus:ring-room-primary/50 focus:outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-room-primary/20 file:text-room-primary hover:file:bg-room-primary/30"
                    required
                    disabled={csvLoading}
                  />
                </div>
                {csvFile && (
                  <p className="text-[10px] text-room-primary font-mono">
                    📄 {csvFile.name} ({(csvFile.size / 1024).toFixed(2)} KB)
                  </p>
                )}
              </div>

              {csvResult && (
                <div className="bg-white/5 border border-room-primary/20 p-4 rounded-room space-y-2">
                  <p className="text-sm font-bold text-room-success">✓ {csvResult.successCount} importados</p>
                  {csvResult.errorCount > 0 && (
                    <p className="text-sm font-bold text-room-error">✗ {csvResult.errorCount} errores</p>
                  )}
                  {csvResult.errors.length > 0 && (
                    <div className="max-h-32 overflow-y-auto">
                      {csvResult.errors.map((error, idx) => (
                        <p key={idx} className="text-[10px] text-white/60 font-mono">{error}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-4 pt-2">
                <Button
                  type="button"
                  onClick={() => setShowCSVModal(false)}
                  text="Cerrar"
                  iconLeft={faXmark}
                  variant="secondary"
                  className="flex-1 py-4 uppercase text-[10px] tracking-widest font-bold"
                  disabled={csvLoading}
                />
                <Button
                  type="submit"
                  text={csvLoading ? "Importando..." : "Importar"}
                  iconLeft={faFileUpload}
                  variant="primary"
                  className="flex-1 py-4 uppercase text-[10px] tracking-widest font-bold"
                  disabled={!csvFile || csvLoading}
                />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight text-white">
            Gestión de <span className="text-room-primary">Personal Operativo</span>
          </h2>
          <p className="text-white/40 text-sm mt-1">Control de acceso y base de datos de empleados del ROOM_911.</p>
        </div>
        <div className="flex gap-3">
          <a
            href="/employees_example.csv"
            download
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all border border-white/10 text-sm font-bold uppercase tracking-widest"
          >
            <FontAwesomeIcon icon={faDownload} />
            Descargar Ejemplo
          </a>
          <Button
            onClick={() => setShowCSVModal(true)}
            text="Importar CSV"
            iconLeft={faFileUpload}
            variant="secondary"
            className="py-3 px-6"
          />
          <Button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            text="Añadir Empleado"
            iconLeft={faPlus}
            variant="primary"
            className="shadow-glow py-3 px-8"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-[#152031] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96 group">
            <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-room-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar por nombre, PIN o departamento..."
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
              <p className="text-[10px] uppercase font-black text-room-primary animate-pulse">Consultando Registros Biométricos...</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#040e1f]/50 border-b border-white/5">
                  <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">PIN / Empleado</th>
                  <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Departamento</th>
                  <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Email</th>
                  <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Acceso</th>
                  <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {employees.filter(e => 
                  e.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  e.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  e.internalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  e.departmentName.toLowerCase().includes(searchTerm.toLowerCase())
                ).map((emp) => (
                  <tr key={emp.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-room-primary/20 flex items-center justify-center text-room-primary font-black text-xs border border-room-primary/30">
                          {emp.internalId}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white uppercase tracking-tight">{emp.firstName} {emp.lastName}</p>
                          <p className="text-[10px] text-room-primary font-mono tracking-wider">{emp.internalId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-2 py-1 bg-white/5 rounded text-[10px] font-mono text-white/60 border border-white/5 uppercase">
                        {emp.departmentName}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-[11px] text-white/40 font-medium">{emp.email}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${emp.isAuthorized ? 'bg-room-success animate-pulse' : 'bg-room-error'}`}></div>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${emp.isAuthorized ? 'text-room-success' : 'text-room-error'}`}>
                          {emp.isAuthorized ? 'Autorizado' : 'Restringido'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          onClick={() => handleEdit(emp)}
                          text=""
                          iconLeft={faEdit}
                          variant="secondary"
                          className="w-8 h-8 !p-0 rounded-room"
                        />
                        <Button
                          onClick={async () => {
                            const result = await showAlert.confirm(
                              '¿Dar de baja / Eliminar?',
                              `¿Está seguro de eliminar a ${emp.firstName} ${emp.lastName}? Esta acción no se puede deshacer.`,
                              'Eliminar'
                            );
                            if (result.isConfirmed) {
                              try {
                                await api.delete(`/employees/${emp.id}`);
                                showAlert.success('Registro Eliminado', 'El empleado ha sido removido del sistema.');
                                fetchData();
                              } catch (e) {
                                showAlert.error('Acción Fallida', 'No se pudo eliminar el registro del empleado.');
                              }
                            }
                          }}
                          text=""
                          iconLeft={faTrash}
                          variant="error"
                          className="w-8 h-8 !p-0 rounded-room"
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

export default EmployeesPage;
