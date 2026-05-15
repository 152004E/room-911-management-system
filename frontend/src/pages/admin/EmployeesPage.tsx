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
  faShieldHalved
} from '@fortawesome/free-solid-svg-icons';
import { Button } from '../../components/globalcomponent/Button';
import api from '../../services/api';

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

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    departmentId: 1,
    isAuthorized: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [empData, deptData] = await Promise.all([
        api.get('/employees'),
        api.get('/departments') // Asumiendo que existe este endpoint
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/employees', formData);
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      alert('Error al registrar empleado. Verifique los datos.');
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      departmentId: 1,
      isAuthorized: true
    });
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Modal Premium para Empleados */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-[#1f2a3c] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#152031]">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faPlus} className="text-room-primary" />
                <h3 className="text-lg font-black uppercase tracking-tight text-white">Registro de Personal</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-white/20 hover:text-white transition-colors">
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* ID Automático Notice */}
              <div className="bg-room-primary/5 border border-room-primary/20 p-4 rounded-xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-room-primary/10 flex items-center justify-center text-room-primary">
                  <FontAwesomeIcon icon={faIdCard} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-room-primary uppercase tracking-widest">PIN de Acceso</p>
                  <p className="text-xs text-white/60">Generación automática encriptada (R9-XXXX)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Nombre</label>
                  <div className="relative group">
                    <FontAwesomeIcon icon={faUser} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-room-primary transition-colors" />
                    <input 
                      className="w-full bg-[#040e1f] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-room-primary/50 focus:outline-none transition-all"
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
                      className="w-full bg-[#040e1f] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-room-primary/50 focus:outline-none transition-all"
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
                    className="w-full bg-[#040e1f] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-room-primary/50 focus:outline-none transition-all"
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
                      className="w-full bg-[#040e1f] border border-white/10 rounded-xl pl-12 pr-10 py-3 text-sm text-white appearance-none focus:ring-2 focus:ring-room-primary/50 focus:outline-none cursor-pointer"
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
                      className="w-full bg-[#040e1f] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-room-primary/50 focus:outline-none transition-all"
                      placeholder="+XX..."
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#040e1f] rounded-xl border border-white/5">
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
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-4 rounded-xl font-bold border border-white/10 text-white/40 hover:bg-white/5 hover:text-white transition-all uppercase text-[10px] tracking-widest"
                >
                  Cerrar
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-4 rounded-xl font-bold bg-room-primary text-on-primary-fixed hover:brightness-110 active:scale-95 transition-all shadow-glow uppercase text-[10px] tracking-widest"
                >
                  Registrar Personal
                </button>
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
        <Button 
          onClick={() => setShowModal(true)}
          text="Añadir Empleado"
          iconLeft={faPlus}
          variant="primary"
          className="shadow-glow py-3 px-8"
        />
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
                        <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-room-primary/20 text-white/40 hover:text-room-primary transition-all">
                          <FontAwesomeIcon icon={faEdit} className="text-xs" />
                        </button>
                        <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-room-error/20 text-white/40 hover:text-room-error transition-all">
                          <FontAwesomeIcon icon={faTrash} className="text-xs" />
                        </button>
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
