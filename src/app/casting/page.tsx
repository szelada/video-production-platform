'use client';
import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  User,
  MapPin,
  Star,
  X,
  Loader2,
  Upload,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

export default function CastingPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    age_range: '',
    height_cm: '',
    city: '',
    skills: '',
    notes: '',
    project_id: '',
    photo_url: '',
    status: 'backlog' as 'backlog' | 'shortlist' | 'target' | 'confirmed'
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

    // Fetch casting profiles with their first photo
    const [profilesRes, photosRes] = await Promise.all([
      supabase.from('casting_profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('casting_photos').select('*').order('created_at', { ascending: false })
    ]);

    if (profilesRes.error) console.error('Error fetching casting profiles:', profilesRes.error);
    if (photosRes.error) console.error('Error fetching casting photos:', photosRes.error);

    if (profilesRes.data) {
      console.log(`Casting: Fetched ${profilesRes.data.length} profiles and ${photosRes.data?.length || 0} photos`);
      const mapped = profilesRes.data.map((p: any) => {
        // Find ALL photos for this profile, take the first one (which is the most recent due to chronological sorting)
        const profilePhotos = photosRes.data?.filter((ph: any) => ph.casting_profile_id === p.id) || [];
        const photoUrl = profilePhotos.length > 0 ? profilePhotos[0].file_url : p.photo_url || '';

        // Ensure skills is at least an empty string to avoid crashes
        const skills = p.skills || '';

        return {
          ...p,
          photo_url: photoUrl,
          skills: skills // Override with non-null string
        };
      });
      setProfiles(mapped);
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
    if (!formData.full_name.trim()) newErrors.full_name = 'El nombre es obligatorio';
    if (!formData.age_range.trim()) newErrors.age_range = 'El rango de edad es obligatorio';
    if (!formData.city.trim()) newErrors.city = 'La ciudad es obligatoria';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const dataToSave = {
        full_name: formData.full_name,
        phone: formData.phone,
        email: formData.email,
        age_range: formData.age_range,
        height_cm: formData.height_cm ? parseInt(formData.height_cm) : null,
        city: formData.city,
        skills: formData.skills,
        notes: formData.notes,
        photo_url: formData.photo_url // Save directly for fast access
      };

      let profileId = editingId;

      if (editingId) {
        const { error } = await supabase
          .from('casting_profiles')
          .update(dataToSave)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        const { data: newProfile, error } = await supabase
          .from('casting_profiles')
          .insert([dataToSave])
          .select()
          .single();

        if (error) throw error;
        profileId = newProfile.id;
      }

      // 1.5 Save Photo if provided
      if (formData.photo_url && profileId) {
        console.log(`Saving photo to gallery for profile ${profileId}: ${formData.photo_url}`);
        const { data: existingPhotos, error: fetchPhotoError } = await supabase
          .from('casting_photos')
          .select('id')
          .eq('casting_profile_id', profileId)
          .eq('file_url', formData.photo_url);

        if (fetchPhotoError) console.error('Error checking existing photos:', fetchPhotoError);

        if (!existingPhotos || existingPhotos.length === 0) {
          const photoPayload = {
            casting_profile_id: profileId,
            file_url: formData.photo_url,
            photo_type: 'headshot'
          };
          console.log('Inserting photo with payload:', JSON.stringify(photoPayload, null, 2));

          const { error: insertPhotoError } = await supabase.from('casting_photos').insert([photoPayload]);

          if (insertPhotoError) {
            console.error('SERVER ERROR inserting into casting_photos:', insertPhotoError);
            console.error('Error Code:', insertPhotoError.code);
            console.error('Error Message:', insertPhotoError.message);
            console.error('Error Details:', insertPhotoError.details);
            // Re-throw to be visible in the UI alert
            throw new Error(`Error en galería: ${insertPhotoError.message || 'Error desconocido'}`);
          } else {
            console.log('Photo saved to gallery successfully');
          }
        }
      }

      // If project_id provided, sync association
      if (formData.project_id && profileId) {
        await supabase
          .from('casting_project_status')
          .upsert({
            project_id: formData.project_id,
            casting_profile_id: profileId,
            status: formData.status || 'new'
          });
      }

      fetchData();
      handleCloseModal();
    } catch (error: any) {
      console.error('Error saving profile:', error);
      alert('Error al guardar perfil: ' + error.message);
    }
    setSubmitting(false);
  };

  const handleEdit = (profile: any) => {
    setEditingId(profile.id);
    setFormData({
      full_name: profile.full_name || '',
      phone: profile.phone || '',
      email: profile.email || '',
      age_range: profile.age_range || '',
      height_cm: profile.height_cm?.toString() || '',
      city: profile.city || '',
      skills: profile.skills || '',
      notes: profile.notes || '',
      project_id: profile.project_id || '',
      photo_url: profile.photo_url || '',
      status: profile.status || 'backlog'
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      full_name: '',
      phone: '',
      email: '',
      age_range: '',
      height_cm: '',
      city: '',
      skills: '',
      notes: '',
      project_id: '',
      photo_url: '',
      status: 'backlog'
    });
    setErrors({});
    setUploadSuccess(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    console.log('Starting file upload...');
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `casting/${fileName}`;
      const bucketName = 'project_media';

      console.log(`Uploading file: ${file.name} to ${bucketName}/${filePath}`);
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (error) {
        console.error(`Error during upload to ${bucketName}/${filePath}:`, error);
        throw error;
      }
      console.log('File uploaded successfully:', data);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      console.log('Public URL obtained:', publicUrl);
      setFormData(prev => ({ ...prev, photo_url: publicUrl }));
      setUploadSuccess(true);
      // Auto-revert success state after a few seconds
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error: any) {
      console.error('Error uploading file:', error);
      alert('Error al subir imagen: ' + error.message);
    }
    setUploading(false);
    console.log('File upload process finished.');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 p-8 lg:p-12 min-h-[calc(100vh-theme(spacing.24))] bg-[#F8F9FA]"
    >
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-5xl font-black tracking-tightest text-zinc-900 leading-none mb-4">Casting</h1>
          <p className="text-sm font-black text-zinc-400 uppercase tracking-widest leading-none">Base de datos de talento y perfiles para tus proyectos</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-3 bg-zinc-900 text-white px-8 py-4 rounded-[2rem] font-black hover:bg-zinc-800 transition-all shadow-2xl hover:scale-105 active:scale-95 uppercase tracking-widest text-[10px]"
        >
          <Plus size={18} strokeWidth={3} /> Nuevo Perfil
        </button>
      </div>

      {/* Main Content Area */}
      <div className="space-y-10">
        {/* Unified Search & Filter Header */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white/50 backdrop-blur-xl p-4 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-[2rem] px-6 py-4 flex-1 w-full shadow-sm group focus-within:ring-4 focus-within:ring-zinc-100 transition-all">
            <Search size={16} className="text-zinc-300 group-focus-within:text-zinc-900 transition-colors" />
            <input
              type="text"
              placeholder="Buscar por nombre, habilidades..."
              className="bg-transparent border-none outline-none text-[11px] font-bold w-full placeholder:text-zinc-300 text-zinc-900"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="flex items-center justify-center gap-3 px-8 py-4 rounded-[2rem] bg-white border border-gray-100 text-zinc-400 font-black hover:text-zinc-900 transition-all w-full sm:w-auto uppercase tracking-widest text-[10px] shadow-sm">
              <Filter size={14} strokeWidth={3} /> Filtros
            </button>
            <button className="flex items-center justify-center gap-3 px-8 py-4 rounded-[2rem] bg-zinc-900 text-white font-black transition-all shadow-xl w-full sm:w-auto uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95">
              Top Talent
            </button>
          </div>
        </div>

        {/* Profile Grid */}
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-6">
            <div className="w-16 h-16 border-4 border-zinc-100 border-t-zinc-900 rounded-full animate-spin" />
            <p className="text-zinc-400 font-black uppercase tracking-widest text-[10px] animate-pulse">Analizando perfiles de casting...</p>
          </div>
        ) : profiles.length === 0 ? (
          <div className="h-96 flex flex-col items-center justify-center gap-6 bg-white rounded-[3rem] border border-gray-100 border-dashed shadow-sm">
            <div className="w-20 h-20 bg-zinc-50 rounded-[2rem] flex items-center justify-center text-zinc-200">
               <User size={40} />
            </div>
            <div className="text-center">
               <p className="text-zinc-900 font-black text-sm uppercase tracking-tight">No hay perfiles registrados</p>
               <p className="text-zinc-400 text-xs font-medium mt-1">Comienza agregando talento a tu base de datos</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-10 py-4 text-[10px] font-black text-white bg-zinc-900 rounded-[2rem] hover:scale-105 active:scale-95 transition-all shadow-xl uppercase tracking-[0.2em]"
            >
              AGREGAR TALENTO
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {profiles.map((profile, i) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleEdit(profile)}
                className="bg-white group relative flex flex-col rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-zinc-200/50 transition-all duration-500 cursor-pointer overflow-hidden"
              >
                <div className="aspect-[3/4] bg-[#F8F9FA] relative overflow-hidden">
                   <div className="flex items-center justify-center absolute inset-0 text-zinc-200">
                    <User size={64} strokeWidth={1} />
                  </div>
                  {profile.photo_url && (
                    <img
                      src={profile.photo_url}
                      alt={profile.full_name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 blur-0"
                    />
                  )}
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-60 group-hover:opacity-80 transition-opacity" />
                  
                  <div className="absolute top-6 left-6 flex flex-col gap-2">
                    <span className="text-[8px] font-black px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md text-zinc-900 uppercase tracking-widest shadow-xl">
                      {profile.status}
                    </span>
                  </div>

                  {/* Bottom Info in Image */}
                  <div className="absolute bottom-6 left-6 right-6">
                     <h3 className="text-xl font-black text-white tracking-tightest leading-tight group-hover:text-lime-300 transition-colors">{profile.full_name}</h3>
                     <div className="flex items-center gap-2 mt-2">
                        <span className="text-[9px] font-black text-white/70 uppercase tracking-widest">{profile.age_range} AÑOS</span>
                        <div className="w-1 h-1 rounded-full bg-white/30" />
                        <span className="text-[9px] font-black text-white/70 uppercase tracking-widest">{profile.height_cm || '—'} CM</span>
                     </div>
                  </div>

                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-3 rounded-2xl bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white hover:text-zinc-900 transition-all">
                      <Star size={16} strokeWidth={3} />
                    </button>
                  </div>
                </div>

                <div className="p-8 space-y-5 flex-1 flex flex-col justify-between">
                  <div className="flex items-center gap-3 text-xs font-bold text-zinc-400">
                    <MapPin size={14} className="text-zinc-300" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{profile.city}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-50">
                    {profile.skills && profile.skills.trim() !== "" ?
                      profile.skills.split(',').slice(0, 3).map((skill: string, x: number) => (
                        <span key={x} className="text-[8px] font-black px-3 py-1.5 rounded-xl bg-zinc-50 text-zinc-400 uppercase tracking-widest border border-gray-100/50">
                          {skill.trim()}
                        </span>
                      )) : (
                        <span className="text-[8px] text-zinc-300 italic font-black uppercase tracking-widest">Sin etiquetas</span>
                      )
                    }
                    {profile.skills && profile.skills.split(',').length > 3 && (
                       <span className="text-[8px] font-black px-3 py-1.5 rounded-xl bg-zinc-100 text-zinc-500 uppercase tracking-widest">+{profile.skills.split(',').length - 3}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Creation Modal */}
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
              className="relative w-full max-w-2xl bg-white/90 backdrop-blur-2xl rounded-[3rem] border border-gray-100 overflow-hidden shadow-2xl"
            >
              <div className="p-10 border-b border-gray-50 flex items-center justify-between">
                <div>
                   <h2 className="text-3xl font-black text-zinc-900 tracking-tightest">
                     {editingId ? 'Editar Perfil' : 'Nuevo Talento'}
                   </h2>
                   <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">Gestión de base de datos de casting</p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-4 bg-zinc-50 hover:bg-zinc-100 rounded-2xl text-zinc-300 hover:text-zinc-900 transition-all border border-gray-100 shadow-inner"
                >
                  <X size={20} strokeWidth={3} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto scrollbar-hide">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Name */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Nombre Completo *</label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      placeholder="Ej: Ana García"
                      className={`w-full bg-[#F8F9FA] border ${errors.full_name ? 'border-red-200' : 'border-gray-100'} rounded-2xl px-6 py-4 text-sm text-zinc-900 font-bold focus:outline-none focus:ring-4 focus:ring-zinc-50 transition-all placeholder:text-zinc-300`}
                    />
                  </div>

                  {/* Age Range */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Rango de Edad *</label>
                    <input
                      type="text"
                      name="age_range"
                      value={formData.age_range}
                      onChange={handleInputChange}
                      placeholder="Ej: 25-30"
                      className={`w-full bg-[#F8F9FA] border ${errors.age_range ? 'border-red-200' : 'border-gray-100'} rounded-2xl px-6 py-4 text-sm text-zinc-900 font-bold focus:outline-none focus:ring-4 focus:ring-zinc-50 transition-all placeholder:text-zinc-300`}
                    />
                  </div>

                  {/* Height */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Altura (cm)</label>
                    <input
                      type="number"
                      name="height_cm"
                      value={formData.height_cm}
                      onChange={handleInputChange}
                      placeholder="Ej: 175"
                      className="w-full bg-[#F8F9FA] border border-gray-100 rounded-2xl px-6 py-4 text-sm text-zinc-900 font-bold focus:outline-none focus:ring-4 focus:ring-zinc-50 transition-all placeholder:text-zinc-300"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Teléfono</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Ej: +34 000 000 000"
                      className="w-full bg-[#F8F9FA] border border-gray-100 rounded-2xl px-6 py-4 text-sm text-zinc-900 font-bold focus:outline-none focus:ring-4 focus:ring-zinc-50 transition-all placeholder:text-zinc-300"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Ej: ana@example.com"
                      className="w-full bg-[#F8F9FA] border border-gray-100 rounded-2xl px-6 py-4 text-sm text-zinc-900 font-bold focus:outline-none focus:ring-4 focus:ring-zinc-50 transition-all placeholder:text-zinc-300"
                    />
                  </div>

                  {/* City */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Ciudad *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Ej: Madrid, Lima, etc."
                      className={`w-full bg-[#F8F9FA] border ${errors.city ? 'border-red-200' : 'border-gray-100'} rounded-2xl px-6 py-4 text-sm text-zinc-900 font-bold focus:outline-none focus:ring-4 focus:ring-zinc-50 transition-all placeholder:text-zinc-300`}
                    />
                  </div>

                  {/* Project */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Asignar a Proyecto</label>
                    <select
                      name="project_id"
                      value={formData.project_id}
                      onChange={handleInputChange}
                      className="w-full bg-[#F8F9FA] border border-gray-100 rounded-2xl px-6 py-4 text-sm text-zinc-900 font-bold focus:outline-none focus:ring-4 focus:ring-zinc-50 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Ninguno</option>
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Status */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Estado</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full bg-[#F8F9FA] border border-gray-100 rounded-2xl px-6 py-4 text-sm text-zinc-900 font-bold focus:outline-none focus:ring-4 focus:ring-zinc-50 transition-all appearance-none cursor-pointer"
                    >
                      <option value="backlog">Backlog</option>
                      <option value="shortlist">Shortlist</option>
                      <option value="target">Target</option>
                      <option value="confirmed">Confirmado</option>
                    </select>
                  </div>

                  {/* Photo Section */}
                  <div className="md:col-span-2 space-y-6">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block ml-1">Multimedia (Foto de Perfil)</label>

                    <div className="flex flex-col md:flex-row gap-8">
                      {/* Preview Area */}
                      <div className="w-full md:w-48 aspect-[3/4] rounded-[2rem] bg-[#F8F9FA] border border-gray-100 overflow-hidden relative group shadow-inner">
                        {formData.photo_url ? (
                          <>
                            <img
                              src={formData.photo_url}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, photo_url: '' }))}
                                className="p-3 rounded-2xl bg-white text-red-500 hover:scale-110 transition-all shadow-xl"
                              >
                                <Trash2 size={20} />
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-zinc-200">
                             <ImageIcon size={48} strokeWidth={1} />
                             <span className="text-[8px] font-black uppercase mt-2 tracking-widest text-zinc-300">VISTA PREVIA</span>
                          </div>
                        )}
                        {uploading && (
                          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-30">
                            <Loader2 className="animate-spin text-zinc-900" size={24} />
                            <span className="text-[10px] font-black text-zinc-900 uppercase tracking-widest">Subiendo...</span>
                          </div>
                        )}
                      </div>

                      {/* Info & Upload Button */}
                      <div className="flex-1 space-y-6">
                        <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-100">
                          <p className="text-[11px] text-indigo-600 font-bold leading-relaxed">
                            Sube una foto de alta calidad (Headshot). Se recomienda luz natural y fondo neutro para coherencia en el catálogo.
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
                          <div className="w-full h-28 rounded-[2rem] border-2 border-dashed border-gray-100 group-hover:border-zinc-900 transition-all flex flex-col items-center justify-center gap-2 bg-[#F8F9FA]">
                            <Upload size={20} className="text-zinc-300 group-hover:text-zinc-900 transition-all" />
                            <span className="text-[10px] font-black text-zinc-400 group-hover:text-zinc-900 uppercase tracking-widest">
                              {uploading ? 'PROCESANDO...' : 'CARGAR HEADSHOT'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Habilidades (separadas por coma)</label>
                  <textarea
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    placeholder="Ej: Actuación, Canto, Danza, Idiomas..."
                    rows={3}
                    className="w-full bg-[#F8F9FA] border border-gray-100 rounded-2xl px-6 py-4 text-sm text-zinc-900 font-bold focus:outline-none focus:ring-4 focus:ring-zinc-50 transition-all placeholder:text-zinc-300 resize-none"
                  />
                </div>

                <div className="pt-10 border-t border-gray-50 flex gap-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-8 py-5 rounded-[2rem] font-black text-[10px] text-zinc-400 bg-zinc-50 hover:bg-zinc-100 hover:text-zinc-900 transition-all uppercase tracking-widest border border-gray-100"
                    disabled={submitting}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-8 py-5 rounded-[2rem] font-black text-[10px] text-white bg-zinc-900 hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 uppercase tracking-[0.2em]"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        GUARDANDO...
                      </>
                    ) : 'Guardar Perfil'}
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
