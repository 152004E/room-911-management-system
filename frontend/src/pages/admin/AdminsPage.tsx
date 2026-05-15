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
  faXmark,
  faAt,
  faLock,
  faPhone,
  faIdCard,
  faFingerprint
} from '@fortawesome/free-solid-svg-icons';
import { Button } from '../../components/globalcomponent/Button';
import api from '../../services/api';

interface Admin {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

const AdminsPage = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Form State - ID removido (ahora es automático)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
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
      // Enviamos el objeto sin username, el backend lo generará
      await api.post('/admins', formData);
      setShowModal(false);
      resetForm();
      fetchAdmins();
    } catch (error) {
      alert('Error al registrar. Verifique el email institucional.');
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      password: '',
      role: 'ADMIN_ROOM_911',
      isActive: true
    });
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Modal - Rediseñado para ID Automático */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-[#1f2a3c] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#152031]">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faFingerprint} className="text-room-primary animate-pulse" />
                <h3 className="text-lg font-black uppercase tracking-tight text-white">Registro de Administrador</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-white/20 hover:text-white transition-colors">
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Aviso de ID Automático */}
              <div className="bg-room-primary/5 border border-room-primary/20 p-4 rounded-xl flex items-center gap-4 mb-2">
                <div className="w-10 h-10 rounded-lg bg-room-primary/10 flex items-center justify-center text-room-primary">
                  <FontAwesomeIcon icon={faIdCard} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-room-primary uppercase tracking-widest">ID de Acceso</p>
                  <p className="text-xs text-white/60">Se generará automáticamente (A000X)</p>
                </div>
              </div>

              {/* Nombre Completo */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Nombre Completo</label>
                <div className="relative group">
                  <FontAwesomeIcon icon={faIdCard} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-room-primary transition-colors" />
                  <input 
                    className="w-full bg-[#040e1f] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-room-primary/50 focus:outline-none transition-all"
                    placeholder="Nombre del oficial"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Email Institucional</label>
                  <div className="relative group">
                    <FontAwesomeIcon icon={faAt} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-room-primary transition-colors" />
                    <input 
                      type="email"
                      className="w-full bg-[#040e1f] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-room-primary/50 focus:outline-none transition-all"
                      placeholder="oficial@room911.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                </div>

                {/* Teléfono */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Teléfono Acceso</label>
                  <div className="relative group">
                    <FontAwesomeIcon icon={faPhone} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-room-primary transition-colors" />
                    <input 
                      className="w-full bg-[#040e1f] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-room-primary/50 focus:outline-none transition-all"
                      placeholder="+57..."
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Contraseña */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Contraseña de Seguridad</label>
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

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-4 rounded-xl font-bold border border-white/10 text-white/40 hover:bg-white/5 hover:text-white transition-all uppercase text-[10px] tracking-widest"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-4 rounded-xl font-bold bg-room-primary text-on-primary-fixed hover:brightness-110 active:scale-95 transition-all shadow-glow uppercase text-[10px] tracking-widest"
                >
                  Registrar Administrador
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
            Gestión de <span className="text-room-primary">Administradores</span>
          </h2>
          <p className="text-white/40 text-sm mt-1">Supervisión jerárquica y control de protocolos de seguridad.</p>
        </div>
        <Button 
          onClick={() => setShowModal(true)}
          text="Añadir Administrador"
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
                  (a.fullName && a.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                  a.email.toLowerCase().includes(searchTerm.toLowerCase())
                ).map((admin) => (
                  <tr key={admin.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-room-primary/20 flex items-center justify-center text-room-primary font-black text-xs border border-room-primary/30">
                          {admin.username}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white uppercase tracking-tight">{admin.fullName || 'Oficial'}</p>
                          <p className="text-[10px] text-room-primary font-mono tracking-wider">{admin.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-[11px] text-white/60 font-medium">{admin.email}</p>
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
