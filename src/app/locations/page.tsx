'use client';
import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  MapPin,
  Building,
  Star,
  X,
  Loader2,
  Info,
  Upload,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

export default function LocationsPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    location_type: 'Interior',
    address: '',
    city: '',
    district: '',
    region: '',
    owner_name: '',
    owner_phone: '',
    scout_notes: '',
    description: '',
    project_id: '',
    main_photo_url: '',
    status: 'scouting' as 'scouting' | 'viewed' | 'approved' | 'rejected'
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    // Fetch projects for the selection modal
    const { data: projectsData } = await supabase.from('projects').select('id, name');
    if (projectsData) setProjects(projectsData);

    // Fetch locations
    const [locationsRes, photosRes] = await Promise.all([
      supabase.from('locations').select('*').order('created_at', { ascending: false }),
      supabase.from('location_photos').select('*').order('created_at', { ascending: false })
    ]);

    if (locationsRes.error) console.error('Error fetching locations:', locationsRes.error);
    if (photosRes.error) console.error('Error fetching location photos:', photosRes.error);

    if (locationsRes.data) {
      console.log(`Locations: Fetched ${locationsRes.data.length} records and ${photosRes.data?.length || 0} photos`);
      const mapped = locationsRes.data.map((l: any) => ({
        ...l,
        location_photos: photosRes.data?.filter((ph: any) => ph.location_id === l.id) || [],
        description: l.description || '',
        scout_notes: l.scout_notes || ''
      }));
      setLocations(mapped);
    }
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!formData.city.trim()) newErrors.city = 'La ciudad es obligatoria';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const dataToSave = {
        name: formData.name,
        location_type: formData.location_type,
        address: formData.address,
        city: formData.city,
        district: formData.district,
        region: formData.region,
        owner_name: formData.owner_name,
        owner_phone: formData.owner_phone,
        scout_notes: formData.scout_notes,
        description: formData.description,
        main_photo_url: formData.main_photo_url,
        created_by: user?.id
      };

      let locId = editingId;

      if (editingId) {
        const { error } = await supabase
          .from('locations')
          .update(dataToSave)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        const { data: newLoc, error } = await supabase
          .from('locations')
          .insert([dataToSave])
          .select()
          .single();

        if (error) throw error;
        locId = newLoc.id;
      }

      // Save Photo to Gallery redundantly
      if (formData.main_photo_url && locId) {
        const { data: existingPhotos } = await supabase
          .from('location_photos')
          .select('id')
          .eq('location_id', locId)
          .eq('file_url', formData.main_photo_url);

        if (!existingPhotos || existingPhotos.length === 0) {
          const photoPayload = {
            location_id: locId,
            file_url: formData.main_photo_url
          };
          console.log('Inserting location photo with payload:', JSON.stringify(photoPayload, null, 2));

          const { error: insertPhotoError } = await supabase.from('location_photos').insert([photoPayload]);

          if (insertPhotoError) {
            console.error('SERVER ERROR inserting into location_photos:', insertPhotoError);
            console.error('Error Code:', insertPhotoError.code);
            console.error('Error Message:', insertPhotoError.message);
            // Non-blocking but logged
          } else {
            console.log('Location photo saved successfully');
          }
        }
      }

      // If project_id provided, sync association
      if (formData.project_id && locId) {
        await supabase
          .from('location_project_status')
          .upsert({
            project_id: formData.project_id,
            location_id: locId,
            status: formData.status || 'new'
          });
      }

      fetchData();
      handleCloseModal();
    } catch (error: any) {
      console.error('Error saving location:', error);
      alert('Error al guardar locación: ' + error.message);
    }
    setSubmitting(false);
  };

  const handleEdit = (location: any) => {
    setEditingId(location.id);
    setFormData({
      name: location.name || '',
      location_type: location.location_type || 'Interior',
      address: location.address || '',
      city: location.city || '',
      district: location.district || '',
      region: location.region || '',
      owner_name: location.owner_name || '',
      owner_phone: location.owner_phone || '',
      scout_notes: location.scout_notes || '',
      description: location.description || '',
      project_id: location.project_id || '',
      main_photo_url: location.main_photo_url || '',
      status: location.status || 'scouting'
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setUploadSuccess(false);
    setFormData({
      name: '',
      location_type: 'Interior',
      address: '',
      city: '',
      district: '',
      region: '',
      owner_name: '',
      owner_phone: '',
      scout_notes: '',
      description: '',
      project_id: '',
      main_photo_url: '',
      status: 'scouting'
    });
    setErrors({});
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `locations/${fileName}`;

      const { data, error } = await supabase.storage
        .from('project_media')
        .upload(filePath, file);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('project_media')
        .getPublicUrl(filePath);

      console.log('Public URL obtained:', publicUrl);
      setFormData(prev => ({ ...prev, main_photo_url: publicUrl }));
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error: any) {
      console.error('Error uploading file:', error);
      alert('Error al subir imagen: ' + error.message);
    }
    setUploading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-zinc-900 mb-1">Locaciones</h1>
          <p className="text-zinc-500 font-medium">Explora y gestiona los espacios para tus rodajes.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-zinc-900 text-white px-6 py-3.5 rounded-full font-bold hover:bg-zinc-800 transition-all shadow-lg hover:-translate-y-1 self-start uppercase tracking-widest text-sm"
        >
          <Plus size={18} strokeWidth={2.5} /> Nueva Locación
        </button>
      </div>

      {/* Dark Container Wraps Everything Below */}
      <div className="bg-[#1C1C1E] rounded-[40px] p-6 lg:p-8 shadow-2xl space-y-8">

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[#2C2C2E] p-3 rounded-[32px] border border-zinc-800">
          <div className="flex items-center gap-3 bg-zinc-900 rounded-full px-5 py-3 flex-1 w-full border border-zinc-800 shadow-inner">
            <Search size={18} className="text-zinc-500" />
            <input
              type="text"
              placeholder="Filtrar por nombre, ciudad o tipo..."
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-zinc-500 text-zinc-100 font-medium"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-zinc-800 text-zinc-300 font-bold hover:text-white hover:bg-zinc-700 transition-all w-full sm:w-auto uppercase tracking-widest text-xs">
              <Filter size={16} strokeWidth={2.5} /> Tipo
            </button>
            <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-zinc-800 text-zinc-300 font-bold hover:text-white hover:bg-zinc-700 transition-all w-full sm:w-auto uppercase tracking-widest text-xs">
              Aprobadas
            </button>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-orange-500" size={40} />
            <p className="text-zinc-500 text-sm font-medium animate-pulse">Cargando locaciones...</p>
          </div>
        ) : locations.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4 bg-[#2C2C2E] rounded-[32px] border border-zinc-800 border-dashed">
            <p className="text-zinc-400 font-bold text-sm">No hay locaciones en tu catálogo.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 text-xs font-black text-zinc-900 bg-emerald-200 rounded-full hover:bg-emerald-300 uppercase tracking-widest"
            >
              Añadir primer espacio
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((loc) => (
              <div
                key={loc.id}
                onClick={() => handleEdit(loc)}
                className="bg-[#2C2C2E] group flex flex-col rounded-[32px] border border-transparent hover:border-zinc-700 overflow-hidden shadow-sm transition-all duration-300 cursor-pointer hover:-translate-y-1"
              >
                <div className="aspect-video bg-zinc-900 relative overflow-hidden">
                  {(loc.main_photo_url || (loc.location_photos && loc.location_photos.length > 0)) ? (
                    <img
                      src={loc.main_photo_url || loc.location_photos[0]?.file_url}
                      alt={loc.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).parentElement?.querySelector('.location-placeholder-icon')?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`location-placeholder-icon absolute inset-0 flex items-center justify-center text-zinc-800 ${(loc.main_photo_url || (loc.location_photos && loc.location_photos.length > 0)) ? 'hidden' : ''}`}>
                    <MapPin size={48} strokeWidth={1} />
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] font-black px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-zinc-100 uppercase tracking-widest">
                      {loc.status}
                    </span>
                  </div>
                  <button className="absolute top-4 right-4 p-2 rounded-full bg-black/40 backdrop-blur-md text-white/60 hover:text-orange-400 transition-all opacity-0 group-hover:opacity-100">
                    <Star size={18} strokeWidth={2.5} />
                  </button>
                </div>

                <div className="p-6 space-y-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1.5">
                      <h3 className="text-xl font-bold text-zinc-50 group-hover:text-orange-400 transition-colors">{loc.name}</h3>
                      <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
                        <span className="bg-zinc-800 px-2 py-1 rounded-md">{loc.location_type}</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-700" />
                        <span className="bg-zinc-800 px-2 py-1 rounded-md flex items-center gap-1.5"><MapPin size={12} />{loc.city}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-[20px] bg-zinc-900/50 border border-zinc-800/50 flex-1">
                    <p className="text-[11px] text-zinc-400 font-medium leading-relaxed italic line-clamp-2">
                      {loc.description || loc.scout_notes || 'Sin descripción adicional.'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/50">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[9px] font-black text-zinc-500 uppercase">
                        {loc.owner_name ? loc.owner_name.substring(0, 2) : '?'}
                      </div>
                      <span className="text-xs font-bold text-zinc-500">{loc.owner_name || 'Contacto TBD'}</span>
                    </div>
                    <button className="px-4 py-2 text-[10px] font-black tracking-widest uppercase text-white hover:bg-zinc-800 rounded-full border border-transparent hover:border-zinc-700 transition-colors">
                      VER MÁS
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Tooltip / Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-2xl bg-[#1C1C1E] rounded-[40px] border border-zinc-800 overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-zinc-800 flex items-center justify-between">
                <h2 className="text-2xl font-black text-white">
                  {editingId ? 'Editar Locación' : 'Nueva Locación'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-full text-zinc-400 hover:text-white transition-colors"
                >
                  <X size={20} strokeWidth={2.5} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Nombre del Espacio *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Ej: Loft Minimalista"
                      className={`w-full bg-[#2C2C2E] border ${errors.name ? 'border-red-500/50' : 'border-transparent'} rounded-[20px] px-5 py-4 text-sm text-white font-bold focus:outline-none focus:border-zinc-500 transition-all`}
                    />
                  </div>

                  {/* City & District */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Ciudad *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Ej: Barcelona"
                      className={`w-full bg-[#2C2C2E] border ${errors.city ? 'border-red-500/50' : 'border-transparent'} rounded-[20px] px-5 py-4 text-sm text-white font-bold focus:outline-none focus:border-zinc-500 transition-all`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Distrito / Zona</label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      placeholder="Ej: Eixample"
                      className="w-full bg-[#2C2C2E] border border-transparent rounded-[20px] px-5 py-4 text-sm text-white font-bold focus:outline-none focus:border-zinc-500 transition-all"
                    />
                  </div>

                  {/* Address (Full Width) */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Dirección Exacta</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Calle, número, piso..."
                      className="w-full bg-[#2C2C2E] border border-transparent rounded-[20px] px-5 py-4 text-sm text-white font-bold focus:outline-none focus:border-zinc-500 transition-all"
                    />
                  </div>

                  {/* Type */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Tipo de Locación</label>
                    <select
                      name="location_type"
                      value={formData.location_type}
                      onChange={handleInputChange}
                      className="w-full bg-[#2C2C2E] border border-transparent rounded-[20px] px-5 py-4 text-sm text-white font-bold focus:outline-none focus:border-zinc-500 transition-all appearance-none"
                    >
                      <option value="Interior">Interior</option>
                      <option value="Exterior">Exterior</option>
                      <option value="Estudio">Estudio</option>
                      <option value="Urbano">Urbano</option>
                      <option value="Naturaleza">Naturaleza</option>
                    </select>
                  </div>

                  {/* Project */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Vincular a Proyecto</label>
                    <select
                      name="project_id"
                      value={formData.project_id}
                      onChange={handleInputChange}
                      className="w-full bg-[#2C2C2E] border border-transparent rounded-[20px] px-5 py-4 text-sm text-white font-bold focus:outline-none focus:border-zinc-500 transition-all appearance-none"
                    >
                      <option value="">Ninguno específico</option>
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Owner & Phone */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Dueño / Contacto</label>
                    <input
                      type="text"
                      name="owner_name"
                      value={formData.owner_name}
                      onChange={handleInputChange}
                      placeholder="Nombre o entidad"
                      className="w-full bg-[#2C2C2E] border border-transparent rounded-[20px] px-5 py-4 text-sm text-white font-bold focus:outline-none focus:border-zinc-500 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Teléfono de Contacto</label>
                    <input
                      type="text"
                      name="owner_phone"
                      value={formData.owner_phone}
                      onChange={handleInputChange}
                      placeholder="+34 000 000 000"
                      className="w-full bg-[#2C2C2E] border border-transparent rounded-[20px] px-5 py-4 text-sm text-white font-bold focus:outline-none focus:border-zinc-500 transition-all"
                    />
                  </div>

                  {/* Status */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Estado de Scouting</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full bg-[#2C2C2E] border border-transparent rounded-[20px] px-5 py-4 text-sm text-white font-bold focus:outline-none focus:border-zinc-500 transition-all appearance-none"
                    >
                      <option value="scouting">Scouting</option>
                      <option value="viewed">Visitada</option>
                      <option value="approved">Aprobada</option>
                      <option value="rejected">Rechazada</option>
                    </select>
                  </div>

                  {/* Photo Section */}
                  <div className="md:col-span-2 space-y-4">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Multimedia (Imagen Principal)</label>

                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Preview Area */}
                      <div className="w-full md:w-64 aspect-video rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden relative group">
                        {formData.main_photo_url ? (
                          <>
                            <img
                              src={formData.main_photo_url}
                              alt="Preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '';
                                (e.target as HTMLImageElement).classList.add('hidden');
                                (e.target as HTMLImageElement).parentElement?.querySelector('.location-modal-placeholder')?.classList.remove('hidden');
                              }}
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, main_photo_url: '' }))}
                                className="p-2 rounded-full bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg border border-red-500/20"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </>
                        ) : null}
                        <div className={`location-modal-placeholder w-full h-full flex flex-col items-center justify-center text-zinc-600 ${formData.main_photo_url ? 'hidden' : ''}`}>
                          <ImageIcon size={48} strokeWidth={1} />
                          <span className="text-[10px] uppercase font-bold mt-2">Sin imagen</span>
                        </div>
                        {uploading && (
                          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-2 z-30">
                            <Loader2 className="animate-spin text-white" size={24} />
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Subiendo...</span>
                          </div>
                        )}
                        {uploadSuccess && (
                          <div className="absolute inset-0 bg-green-500/90 flex flex-col items-center justify-center gap-2 z-30">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-green-600 shadow-xl">
                              <Plus className="rotate-45" size={24} strokeWidth={3} />
                            </div>
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">¡Listo!</span>
                          </div>
                        )}
                      </div>

                      {/* Info & Upload Button */}
                      <div className="flex-1 space-y-4">
                        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                          <p className="text-xs text-blue-400 font-bold leading-relaxed">
                            Sube una foto representativa del espacio. Se recomienda formato horizontal (16:9) para mejores resultados.
                          </p>
                        </div>

                        <div className="relative group">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            disabled={uploading}
                          />
                          <div className="w-full h-24 rounded-xl border-2 border-dashed border-zinc-700 group-hover:border-zinc-500 transition-all flex flex-col items-center justify-center gap-2 bg-[#2C2C2E]">
                            <Upload size={20} className="text-zinc-500 group-hover:text-white group-hover:scale-110 transition-all" />
                            <span className="text-xs font-bold text-zinc-500 group-hover:text-white uppercase tracking-widest">
                              {uploading ? 'Cargando archivo...' : 'Seleccionar o arrastrar foto'}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2 pt-2">
                          <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">O pega una URL externa</label>
                          <input
                            type="text"
                            name="main_photo_url"
                            value={formData.main_photo_url}
                            onChange={handleInputChange}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-[11px] text-zinc-400 focus:outline-none focus:border-zinc-500 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description and Scout Notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Resumen / Descripción</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Breve descripción para el catálogo..."
                      rows={3}
                      className="w-full bg-[#2C2C2E] border border-transparent rounded-[20px] px-5 py-4 text-sm text-white font-bold focus:outline-none focus:border-zinc-500 transition-all resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Notas de Scouting</label>
                    <textarea
                      name="scout_notes"
                      value={formData.scout_notes}
                      onChange={handleInputChange}
                      placeholder="Acceso, iluminación, parqueo, etc..."
                      rows={3}
                      className="w-full bg-[#2C2C2E] border border-transparent rounded-[20px] px-5 py-4 text-sm text-white font-bold focus:outline-none focus:border-zinc-500 transition-all resize-none"
                    />
                  </div>
                </div>

                <div className="pt-8 border-t border-zinc-800 flex gap-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-4 rounded-full font-bold text-sm text-zinc-400 bg-zinc-800 hover:bg-zinc-700 hover:text-white transition-all"
                    disabled={submitting}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-4 rounded-full font-black text-sm text-zinc-950 bg-emerald-300 hover:bg-emerald-200 transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        GUARDANDO...
                      </>
                    ) : 'Registrar Locación'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
