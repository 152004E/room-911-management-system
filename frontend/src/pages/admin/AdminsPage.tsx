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
import { showAlert } from '../../services/alerts';

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
  const [isEdit, setIsEdit] = useState(false);
  const [editingAdminId, setEditingAdminId] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    role: 'ADMIN_ROOM_911',
    isActive: true,
    username: ''
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

  const handleEdit = (admin: Admin) => {
    setIsEdit(true);
    setEditingAdminId(admin.id);
    setFormData({
      fullName: admin.fullName || '',
      email: admin.email,
      phone: admin.phone || '',
      password: '', // Contraseña vacía al editar para que sea opcional
      role: admin.role,
      isActive: admin.isActive,
      username: admin.username
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit && editingAdminId !== null) {
        await api.put(`/admins/${editingAdminId}`, formData);
        showAlert.success('Administrador Actualizado', `La cuenta de administrador ${formData.fullName || formData.username} ha sido actualizada.`);
      } else {
        await api.post('/admins', formData);
        showAlert.success('Administrador Registrado', `El administrador ${formData.fullName} ha sido registrado exitosamente.`);
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
      fullName: '',
      email: '',
      phone: '',
      password: '',
      role: 'ADMIN_ROOM_911',
      isActive: true,
      username: ''
    });
    setIsEdit(false);
    setEditingAdminId(null);
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Modal - Rediseñado para ID Automático */}
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
              {/* Aviso de ID Automático */}
              <div className="bg-room-primary/5 border border-room-primary/20 p-4 rounded-room flex items-center gap-4 mb-2">
                <div className="w-10 h-10 rounded-room bg-room-primary/10 flex items-center justify-center text-room-primary">
                  <FontAwesomeIcon icon={faIdCard} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-room-primary uppercase tracking-widest">
                    {isEdit ? 'ID de Acceso Asignado' : 'ID de Acceso'}
                  </p>
                  <p className="text-xs text-white/60">
                    {isEdit ? `Código de Seguridad: ${formData.username}` : 'Se generará automáticamente (A000X)'}
                  </p>
                </div>
              </div>

              {/* Nombre Completo */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Nombre Completo</label>
                <div className="relative group">
                  <FontAwesomeIcon icon={faIdCard} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-room-primary transition-colors" />
                  <input 
                    className="w-full bg-[#040e1f] border border-white/10 rounded-room pl-12 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-room-primary/50 focus:outline-none transition-all"
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
                      className="w-full bg-[#040e1f] border border-white/10 rounded-room pl-12 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-room-primary/50 focus:outline-none transition-all"
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
                      className="w-full bg-[#040e1f] border border-white/10 rounded-room pl-12 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-room-primary/50 focus:outline-none transition-all"
                      placeholder="+57..."
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Contraseña */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
                  {isEdit ? 'Nueva Contraseña de Seguridad (Opcional)' : 'Contraseña de Seguridad'}
                </label>
                <div className="relative group">
                  <FontAwesomeIcon icon={faLock} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-room-primary transition-colors" />
                  <input 
                    type="password"
                    className="w-full bg-[#040e1f] border border-white/10 rounded-room pl-12 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-room-primary/50 focus:outline-none transition-all"
                    placeholder={isEdit ? "•••••••• (Dejar en blanco para mantener)" : "••••••••"}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required={!isEdit}
                  />
                </div>
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

      {/* Header Section */}
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
                          AD
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
                              `¿Está seguro de eliminar al administrador ${admin.fullName || admin.username}? Esta acción no se puede deshacer.`,
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
