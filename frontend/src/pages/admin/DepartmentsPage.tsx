import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding,
  faPlus,
  faSearch,
  faXmark,
  faPen,
  faEdit,
  faTrash,
  faCircleCheck,
  faFileAlt
} from '@fortawesome/free-solid-svg-icons';
import { Button } from '../../components/globalcomponent/Button';
import api from '../../services/api';
import { showAlert } from '../../services/alerts';

interface Department {
  id: number;
  name: string;
  description: string;
  createdAt: string;
}

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingDepartmentId, setEditingDepartmentId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await api.get('/departments');
      setDepartments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching departments:', error);
      showAlert.error('Error de Carga', 'No se pudieron cargar los departamentos.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (dept: Department) => {
    setIsEdit(true);
    setEditingDepartmentId(dept.id);
    setFormData({
      name: dept.name,
      description: dept.description
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit && editingDepartmentId !== null) {
        await api.put(`/departments/${editingDepartmentId}`, formData);
        showAlert.success('Departamento Actualizado', `${formData.name} ha sido actualizado con éxito.`);
      } else {
        await api.post('/departments', formData);
        showAlert.success('Departamento Creado', `${formData.name} ha sido creado exitosamente.`);
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      showAlert.error('Error de Operación', isEdit ? 'No se pudo actualizar el departamento.' : 'No se pudo crear el departamento.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: ''
    });
    setIsEdit(false);
    setEditingDepartmentId(null);
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Modal para Departamentos */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-[#1f2a3c] border border-white/10 rounded-room shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#152031]">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={isEdit ? faEdit : faPlus} className="text-room-primary" />
                <h3 className="text-lg font-black uppercase tracking-tight text-white">
                  {isEdit ? 'Actualizar Departamento' : 'Crear Departamento'}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-white/20 hover:text-white transition-colors">
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="bg-room-primary/5 border border-room-primary/20 p-4 rounded-room flex items-center gap-4">
                <div className="w-10 h-10 rounded-room bg-room-primary/10 flex items-center justify-center text-room-primary">
                  <FontAwesomeIcon icon={faBuilding} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-room-primary uppercase tracking-widest">
                    Gestión de Departamentos
                  </p>
                  <p className="text-xs text-white/60">
                    {isEdit ? 'Modifica los datos del departamento' : 'Registra un nuevo departamento en el sistema'}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Nombre del Departamento</label>
                <div className="relative group">
                  <FontAwesomeIcon icon={faBuilding} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-room-primary transition-colors" />
                  <input
                    className="w-full bg-[#040e1f] border border-white/10 rounded-room pl-12 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-room-primary/50 focus:outline-none transition-all"
                    placeholder="Ej: Investigación y Desarrollo"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Descripción</label>
                <div className="relative group">
                  <FontAwesomeIcon icon={faFileAlt} className="absolute left-4 top-4 text-white/20 group-focus-within:text-room-primary transition-colors" />
                  <textarea
                    className="w-full bg-[#040e1f] border border-white/10 rounded-room pl-12 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-room-primary/50 focus:outline-none transition-all resize-none"
                    placeholder="Descripción del departamento..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
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
                  text={isEdit ? "Guardar" : "Crear Departamento"}
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
            Gestión de <span className="text-room-primary">Departamentos</span>
          </h2>
          <p className="text-white/40 text-sm mt-1">Administra y organiza los departamentos del ROOM_911.</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          text="Nuevo Departamento"
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
              placeholder="Buscar departamentos..."
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
              <p className="text-[10px] uppercase font-black text-room-primary animate-pulse">Cargando Departamentos...</p>
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
                {departments.filter(d =>
                  d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  d.description.toLowerCase().includes(searchTerm.toLowerCase())
                ).map((dept) => (
                  <tr key={dept.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-room-primary/20 flex items-center justify-center text-room-primary font-black text-xs border border-room-primary/30">
                          <FontAwesomeIcon icon={faBuilding} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white uppercase tracking-tight">{dept.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-[11px] text-white/40 font-medium max-w-xs truncate">{dept.description}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-[10px] text-white/30 font-mono">
                        {new Date(dept.createdAt).toLocaleDateString('es-MX')}
                      </p>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          onClick={() => handleEdit(dept)}
                          text=""
                          iconLeft={faEdit}
                          variant="secondary"
                          className="w-8 h-8 !p-0 rounded-room"
                        />
                        <Button
                          onClick={async () => {
                            const result = await showAlert.confirm(
                              '¿Eliminar Departamento?',
                              `¿Está seguro de eliminar ${dept.name}? Esta acción no se puede deshacer.`,
                              'Eliminar'
                            );
                            if (result.isConfirmed) {
                              try {
                                await api.delete(`/departments/${dept.id}`);
                                showAlert.success('Departamento Eliminado', 'El departamento ha sido removido del sistema.');
                                fetchData();
                              } catch (e) {
                                showAlert.error('Acción Fallida', 'No se pudo eliminar el departamento.');
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

export default DepartmentsPage;
