import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserShield, 
  faPlus, 
  faShieldHalved, 
  faCircleCheck, 
  faCircleXmark, 
  faClock, 
  faEdit,
  faTrash,
  faSearch,
  faFilter,
  faDownload,
  faXmark,
  faAt,
  faLock
} from '@fortawesome/free-solid-svg-icons';
import { Button } from '../../components/globalcomponent/Button';
import api from '../../services/api';

interface Admin {
  id: number;
  username: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

const AdminsPage = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'ADMIN_ROOM_911',
    isActive: true
  });

  useEffect(() => {
    fetchAdmins();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admins', formData);
      setShowModal(false);
      setFormData({ username: '', password: '', role: 'ADMIN_ROOM_911', isActive: true });
      fetchAdmins();
    } catch (error) {
      alert('Error al crear administrador');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Modal - Integrado según diseño solicitado */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-md bg-[#1f2a3c] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#152031]">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faPlus} className="text-room-primary" />
                <h3 className="text-lg font-black uppercase tracking-tight text-white">Nuevo Administrador</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-white/20 hover:text-white transition-colors">
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Usuario</label>
                <div className="relative group">
                  <FontAwesomeIcon icon={faAt} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-room-primary transition-colors" />
                  <input 
                    className="w-full bg-[#040e1f] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-room-primary/50 focus:outline-none transition-all"
                    placeholder="ej. admin_root"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Contraseña</label>
                <div className="relative group">
                  <FontAwesomeIcon icon={faLock} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-room-primary transition-colors" />
                  <input 
                    type="password"
                    className="w-full bg-[#040e1f] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-room-primary/50 focus:outline-none transition-all"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Rol del Sistema</label>
                <div className="relative group">
                  <FontAwesomeIcon icon={faUserShield} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-room-primary transition-colors" />
                  <select 
                    className="w-full bg-[#040e1f] border border-white/10 rounded-xl pl-12 pr-10 py-3 text-sm text-white appearance-none focus:ring-2 focus:ring-room-primary/50 focus:outline-none cursor-pointer"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="ADMIN_ROOM_911">ADMIN_ROOM_911</option>
                    <option value="VIEWER_ROOM_911">VIEWER_ROOM_911</option>
                    <option value="AUDITOR_ROOM_911">AUDITOR_ROOM_911</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#040e1f] rounded-xl border border-white/5">
                <div>
                  <p className="text-xs font-bold text-white uppercase">Estado Cuenta</p>
                  <p className="text-[10px] text-white/30 uppercase">Activar acceso inmediato</p>
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
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 rounded-xl font-bold border border-white/10 text-white/40 hover:bg-white/5 hover:text-white transition-all uppercase text-[10px] tracking-widest"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-3 rounded-xl font-bold bg-room-primary text-on-primary-fixed hover:brightness-110 active:scale-95 transition-all shadow-glow uppercase text-[10px] tracking-widest"
                >
                  Guardar Admin
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
            Gestión de Usuarios <span className="text-room-primary">Administrativos</span>
          </h2>
          <p className="text-white/40 text-sm mt-1">Supervisa y controla los niveles de acceso de la plataforma ROOM_911.</p>
        </div>
        <Button 
          onClick={() => setShowModal(true)}
          text="Añadir Administrador"
          iconLeft={faPlus}
          variant="primary"
          className="shadow-glow py-3"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Admins', value: admins.length.toString(), icon: faUserShield, color: 'text-room-primary', bg: 'bg-room-primary/10' },
          { label: 'Activos', value: admins.filter(a => a.isActive).length.toString(), icon: faCircleCheck, color: 'text-room-success', bg: 'bg-room-success/10' },
          { label: 'Inactivos', value: admins.filter(a => !a.isActive).length.toString(), icon: faCircleXmark, color: 'text-room-error', bg: 'bg-room-error/10' },
          { label: 'Último Acceso', value: 'Live', icon: faClock, color: 'text-white/40', bg: 'bg-white/5' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#1f2a3c] border border-white/5 p-6 rounded-2xl flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center text-xl border border-white/5`}>
              <FontAwesomeIcon icon={stat.icon} />
            </div>
            <div>
              <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">{stat.label}</p>
              <p className="text-2xl font-black text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Container */}
      <div className="bg-[#152031] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96 group">
            <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-room-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar administrador..."
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
              <p className="text-[10px] uppercase font-black text-room-primary animate-pulse">Sincronizando Base de Datos...</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#040e1f]/50 border-b border-white/5">
                  <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Usuario</th>
                  <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Rol</th>
                  <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Estado</th>
                  <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Registro</th>
                  <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {admins.filter(a => a.username.toLowerCase().includes(searchTerm.toLowerCase())).map((admin) => (
                  <tr key={admin.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-room-primary/20 flex items-center justify-center text-room-primary font-black text-xs border border-room-primary/30">
                          {admin.username.substring(0, 2).toUpperCase()}
                        </div>
                        <p className="text-sm font-bold text-white uppercase tracking-tight">{admin.username}</p>
                      </div>
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
                          {admin.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-mono text-[10px] text-white/40">
                      {new Date(admin.createdAt).toLocaleDateString()}
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

export default AdminsPage;
