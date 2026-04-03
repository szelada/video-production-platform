'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { 
  CheckSquare, 
  ClipboardCheck, 
  UserPlus, 
  MapPin, 
  Camera, 
  Home, 
  LogOut,
  ChevronRight,
  Plus,
  Loader2,
  X,
  Briefcase,
  AlertCircle, 
  Search,
  FileText,
  Video,
  Music,
  Trash2,
  Upload,
  Download,
  ImageIcon
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import imageCompression from 'browser-image-compression';

type View = 'menu' | 'tasks' | 'scouting' | 'casting' | 'locations';

export default function AssistantPage() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<View>('menu');

  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [taskComments, setTaskComments] = useState<any[]>([]);
  const [taskAttachments, setTaskAttachments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isUploadingAttachment, setIsUploadingAttachment] = useState(false);
  const [isLoadingTaskDetails, setIsLoadingTaskDetails] = useState(false);
  const commentsEndRef = React.useRef<HTMLDivElement>(null);

  // Form States
  const [scoutingForm, setScoutingForm] = useState({ type: 'general', notes: '', photos: [] as any[] });
  const [castingForm, setCastingForm] = useState({ name: '', age: '', city: '', skills: '', photos: [] as any[] });
  const [locationForm, setLocationForm] = useState({ name: '', type: 'exterior', city: '', description: '', scout_notes: '', photos: [] as any[] });

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchTasks();
    }
  }, [selectedProject]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      fetchProjects();
    } else {
      router.push('/projects'); // Redirect if not logged in
    }
  };

  useEffect(() => {
    if (selectedTask && commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [taskComments]);

  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (data && data.length > 0) {
      setProjects(data);
      setSelectedProject(data[0].id);
    }
    setLoading(false);
  };

  const fetchTasks = async () => {
    const { data } = await supabase
      .from('tasks')
      .select('*, task_comments(id), task_attachments(id)')
      .eq('project_id', selectedProject)
      .eq('assigned_to', user?.id)
      .order('due_date', { ascending: true });
    setTasks(data || []);
  };

  const handleToggleTask = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'todo' : 'completed';
    await supabase.from('tasks').update({ status: newStatus }).eq('id', taskId);
    const task = tasks.find(t => t.id === taskId);
    logActivity('task_updated', `Tarea "${task?.title}" marcada como ${newStatus.toUpperCase()} (Móvil)`);
    fetchTasks();
  };

  const logActivity = async (action: string, description: string) => {
    try {
      await supabase.from('project_activity').insert([{
        project_id: selectedProject,
        action,
        description,
        created_at: new Date().toISOString()
      }]);
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  const fetchTaskDetails = async (taskId: string) => {
    setIsLoadingTaskDetails(true);
    // Comments
    const { data: comments } = await supabase
      .from('task_comments')
      .select('*, profiles(full_name, avatar_url)')
      .eq('task_id', taskId)
      .order('created_at', { ascending: true });
    setTaskComments(comments || []);

    // Attachments
    const { data: attachments } = await supabase
      .from('task_attachments')
      .select('*, profiles(full_name)')
      .eq('task_id', taskId)
      .order('created_at', { ascending: false });
    setTaskAttachments(attachments || []);
    setIsLoadingTaskDetails(false);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedTask) return;

    try {
      const { error } = await supabase.from('task_comments').insert({
        task_id: selectedTask.id,
        author_id: user.id,
        comment: newComment.trim()
      });
      if (error) throw error;
      setNewComment('');
      fetchTaskDetails(selectedTask.id);
      logActivity('task_comment_added', `Nuevo comentario en tarea "${selectedTask.title}" (Móvil)`);
    } catch (error) { console.error(error); }
  };

  const handleUploadAttachment = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedTask) return;

    setIsUploadingAttachment(true);
    try {
      const urls = await compressAndUpload([file], 'project_media', `tasks/${selectedTask.id}`);
      if (urls.length > 0) {
        await supabase.from('task_attachments').insert({
          task_id: selectedTask.id,
          file_url: urls[0],
          uploaded_by: user.id
        });
        fetchTaskDetails(selectedTask.id);
        logActivity('task_attachment_added', `Nuevo archivo adjunto en tarea "${selectedTask.title}" (Móvil)`);
      }
    } catch (error) { console.error(error); }
    setIsUploadingAttachment(false);
  };

  const getFileIcon = (url: string) => {
    const ext = url.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) return <ImageIcon size={20} />;
    if (['mp4', 'mov', 'webm'].includes(ext || '')) return <Video size={20} />;
    if (['mp3', 'wav'].includes(ext || '')) return <Music size={20} />;
    return <FileText size={20} />;
  };

  const handleDeleteComment = async (id: string) => {
    if (!confirm('¿Eliminar comentario?')) return;
    await supabase.from('task_comments').delete().eq('id', id);
    setTaskComments(taskComments.filter(c => c.id !== id));
  };

  const handleDeleteAttachment = async (attachment: any) => {
    if (!confirm('¿Eliminar archivo?')) return;
    const filePath = attachment.file_url.split('/project_media/').pop();
    if (filePath) await supabase.storage.from('project_media').remove([filePath]);
    await supabase.from('task_attachments').delete().eq('id', attachment.id);
    setTaskAttachments(taskAttachments.filter(a => a.id !== attachment.id));
  };

  const compressAndUpload = async (files: File[], bucket: string, path: string) => {
    const urls = [];
    const options = { maxSizeMB: 1, maxWidthOrHeight: 1280, useWebWorker: true };
    
    for (const file of files) {
      const compressed = await imageCompression(file, options);
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;
      const filePath = `${path}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, compressed);
      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath);
        urls.push(publicUrl);
      }
    }
    return urls;
  };

  const submitScouting = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data: report, error } = await supabase.from('scouting_reports').insert({
        project_id: selectedProject,
        reported_by: user.id,
        scouting_type: scoutingForm.type,
        notes: scoutingForm.notes,
        status: 'pending'
      }).select().single();

      if (report && scoutingForm.photos.length > 0) {
        const photoFiles = scoutingForm.photos.map(p => p.file);
        const urls = await compressAndUpload(photoFiles, 'project_media', `scouting/${report.id}`);
        const photoInserts = urls.map(url => ({ scouting_report_id: report.id, file_url: url }));
        await supabase.from('scouting_report_photos').insert(photoInserts);
      }
      logActivity('scouting_report_created', `Nuevo reporte de scouting enviado (Móvil): ${scoutingForm.notes.substring(0, 30)}...`);
      setScoutingForm({ type: 'general', notes: '', photos: [] });
      setActiveView('menu');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitCasting = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Logic for quick casting entry
    try {
      const { data: { user } } = await supabase.auth.getUser();

      // 1. Create Profile
      const { data: profile } = await supabase.from('casting_profiles').insert({
        full_name: castingForm.name,
        age_range: castingForm.age,
        city: castingForm.city,
        skills: castingForm.skills,
        created_by: user?.id
      }).select().single();

      if (profile) {
        // 2. Associate with project
        await supabase.from('casting_project_status').insert({
          project_id: selectedProject,
          casting_profile_id: profile.id,
          status: 'new'
        });

        // 3. Upload Photos
        if (castingForm.photos.length > 0) {
          console.log(`Assistant: Uploading ${castingForm.photos.length} photos for casting profile ${profile.id}`);
          const urls = await compressAndUpload(castingForm.photos.map(p => p.file), 'project_media', `casting/${profile.id}`);
          
          if (urls.length === 0) {
            console.error('Assistant: No photo URLs returned from compressAndUpload. Upload might have failed.');
          }

          // Update profile with first photo URL for fast access
          if (urls.length > 0) {
            console.log(`Assistant: Syncing main photo_url column: ${urls[0]}`);
            const { error: updateError } = await supabase.from('casting_profiles').update({ photo_url: urls[0] }).eq('id', profile.id);
            if (updateError) console.error('Assistant: Error updating photo_url column:', updateError);
          }

          const photoInserts = urls.map(url => ({ 
            casting_profile_id: profile.id, 
            file_url: url, 
            photo_type: 'headshot',
            uploaded_by: user?.id 
          }));

          if (photoInserts.length > 0) {
            console.log(`Assistant: Inserting ${photoInserts.length} gallery records into casting_photos`);
            const { error: galleryError } = await supabase.from('casting_photos').insert(photoInserts);
            if (galleryError) console.error('Assistant: Error inserting gallery records:', galleryError);
          }
        }
        logActivity('casting_profile_created', `Nuevo perfil de casting añadido desde móvil: ${castingForm.name}`);
      }
      setCastingForm({ name: '', age: '', city: '', skills: '', photos: [] });
      setActiveView('menu');
    } catch (error) { console.error(error); }
    setIsSubmitting(false);
  };

  const submitLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      // 1. Create Location
      const { data: loc } = await supabase.from('locations').insert({
        name: locationForm.name,
        location_type: locationForm.type,
        city: locationForm.city,
        description: locationForm.description,
        scout_notes: locationForm.scout_notes,
        created_by: user?.id
      }).select().single();

      if (loc) {
        // 2. Associate with project
        await supabase.from('location_project_status').insert({
          project_id: selectedProject,
          location_id: loc.id,
          status: 'new'
        });

        // 3. Upload Photos
        if (locationForm.photos.length > 0) {
          const urls = await compressAndUpload(locationForm.photos.map(p => p.file), 'project_media', `locations/${loc.id}`);
          
          if (urls.length > 0) {
            await supabase.from('locations').update({ main_photo_url: urls[0] }).eq('id', loc.id);
          }

          const photoInserts = urls.map(url => ({ 
            location_id: loc.id, 
            file_url: url,
            uploaded_by: user?.id 
          }));
          await supabase.from('location_photos').insert(photoInserts);
        }
        logActivity('location_created', `Nueva locación añadida desde móvil: ${locationForm.name}`);
      }
      setLocationForm({ name: '', type: 'exterior', city: '', description: '', scout_notes: '', photos: [] });
      setActiveView('menu');
    } catch (error) { console.error(error); }
    setIsSubmitting(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <Loader2 className="animate-spin text-white" size={32} />
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      {/* Mobile-only restriction message for Large screens (Optional, but nice) */}
      <div className="hidden lg:flex fixed inset-0 bg-black z-[100] items-center justify-center p-8 text-center flex-col gap-4">
        <AlertCircle size={48} className="text-white/20" />
        <h2 className="text-xl font-bold">Consola de Asistente (Móvil)</h2>
        <p className="max-w-xs text-muted-foreground text-sm">Esta interfaz está diseñada exclusivamente para dispositivos móviles. Por favor, abre esta página en tu smartphone o tablet.</p>
        <button onClick={() => router.push('/projects')} className="text-xs font-black uppercase tracking-widest border-b border-white/20 pb-1 hover:text-white/60">Volver a Proyectos</button>
      </div>

      <header className="fixed top-0 inset-x-0 bg-black/60 backdrop-blur-xl border-b border-white/5 z-50 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
            <Briefcase size={16} />
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-widest">Assistant Console</h1>
            <p className="text-[9px] text-muted-foreground uppercase tracking-widest leading-none">Status: Active</p>
          </div>
        </div>
        <select 
          className="bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest px-2 py-1 focus:outline-none max-w-[120px]"
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          {projects.map(p => (
            <option key={p.id} value={p.id} className="bg-neutral-900">{p.title}</option>
          ))}
        </select>
      </header>

      <main className="pt-24 pb-32 px-6">
        <AnimatePresence mode="wait">
          {activeView === 'menu' && (
            <motion.div 
              key="menu"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-1 gap-4"
            >
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">¿Qué necesitas hacer hoy?</h2>
              
              <MenuButton 
                icon={<CheckSquare size={24} />} 
                title="Mis Tareas" 
                subtitle={`${tasks.filter(t => t.status !== 'completed').length} pendientes`}
                color="bg-blue-500"
                onClick={() => setActiveView('tasks')}
              />
              <MenuButton 
                icon={<ClipboardCheck size={24} />} 
                title="Enviar Scouting" 
                subtitle="Reporte de campo / fotos"
                color="bg-purple-500"
                onClick={() => setActiveView('scouting')}
              />
              <MenuButton 
                icon={<UserPlus size={24} />} 
                title="Casting Encontrado" 
                subtitle="Nuevo perfil de talento"
                color="bg-amber-500"
                onClick={() => setActiveView('casting')}
              />
              <MenuButton 
                icon={<MapPin size={24} />} 
                title="Locación Encontrada" 
                subtitle="Nuevo set / espacio"
                color="bg-emerald-500"
                onClick={() => setActiveView('locations')}
              />
            </motion.div>
          )}

          {activeView === 'tasks' && (
            <motion.div 
              key="tasks"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-6"
            >
              <ViewHeader title="Mis Tareas" onBack={() => setActiveView('menu')} />
              <div className="space-y-3">
                {tasks.length > 0 ? tasks.map(task => (
                  <div key={task.id} className="glass-card p-4 rounded-3xl border border-white/5 flex items-center justify-between active:scale-[0.98] transition-all">
                    <div className="flex items-center gap-4 flex-1" onClick={() => {
                        setSelectedTask(task);
                        fetchTaskDetails(task.id);
                      }}>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleTask(task.id, task.status);
                        }}
                        className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all shrink-0 ${task.status === 'completed' ? 'bg-white border-white text-black shadow-lg shadow-white/10' : 'border-white/10 text-white/20 hover:border-white/20'}`}
                      >
                        <CheckSquare size={24} />
                      </button>
                      <div className="flex-1 overflow-hidden">
                        <p className={`text-base font-black uppercase tracking-tight truncate ${task.status === 'completed' ? 'text-white/40 line-through' : 'text-white'}`}>{task.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-50">{new Date(task.due_date).toLocaleDateString()}</p>
                          <span className="w-1 h-1 rounded-full bg-white/10" />
                          <div className="flex items-center gap-2">
                            {task.task_comments?.length > 0 && (
                              <div className="flex items-center gap-1 text-[9px] text-blue-400 font-black">
                                <ClipboardCheck size={10} />
                                <span>{task.task_comments.length}</span>
                              </div>
                            )}
                            {task.task_attachments?.length > 0 && (
                              <div className="flex items-center gap-1 text-[9px] text-purple-400 font-black">
                                <Upload size={10} />
                                <span>{task.task_attachments.length}</span>
                              </div>
                            )}
                            {(!task.task_comments?.length && !task.task_attachments?.length) && (
                              <span className="text-[10px] text-white/20 uppercase font-black tracking-widest">Sin Actividad</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {task.priority === 'urgent' && <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)] ml-4" />}
                  </div>
                )) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                    <CheckSquare size={48} className="text-white/5" />
                    <p className="text-sm text-muted-foreground">No tienes tareas asignadas en este proyecto.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeView === 'scouting' && (
            <motion.div key="scouting" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
              <ViewHeader title="Nuevo Reporte" onBack={() => setActiveView('menu')} />
              <form onSubmit={submitScouting} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-muted-foreground uppercase font-black">Tipo de Registro</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white appearance-none"
                    value={scoutingForm.type}
                    onChange={e => setScoutingForm({...scoutingForm, type: e.target.value})}
                  >
                    <option value="general" className="bg-neutral-900">General</option>
                    <option value="location" className="bg-neutral-900">Locación</option>
                    <option value="casting" className="bg-neutral-900">Casting</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-muted-foreground uppercase font-black">Hallazgos / Notas</label>
                  <textarea 
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white h-32 resize-none"
                    placeholder="Escribe aquí lo observado..."
                    value={scoutingForm.notes}
                    onChange={e => setScoutingForm({...scoutingForm, notes: e.target.value})}
                  />
                </div>
                <PhotoUploader photos={scoutingForm.photos} setPhotos={(p: any[]) => setScoutingForm({...scoutingForm, photos: p})} />
                <SubmitButton disabled={isSubmitting} />
              </form>
            </motion.div>
          )}

          {activeView === 'casting' && (
            <motion.div key="casting" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
              <ViewHeader title="Casting Rápido" onBack={() => setActiveView('menu')} />
              <form onSubmit={submitCasting} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-muted-foreground uppercase font-black">Nombre Completo</label>
                  <input 
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white"
                    placeholder="Nombre del talento..."
                    value={castingForm.name}
                    onChange={e => setCastingForm({...castingForm, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-muted-foreground uppercase font-black">Rango de Edad (Ej: 20-25)</label>
                  <input 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white"
                    placeholder="Ej: 25-30"
                    value={castingForm.age}
                    onChange={e => setCastingForm({...castingForm, age: e.target.value})}
                  />
                </div>
                <InputField label="Ciudad" name="city" value={castingForm.city} onChange={(v: string) => setCastingForm({...castingForm, city: v})} />
                <InputField label="Habilidades" name="skills" value={castingForm.skills} onChange={(v: string) => setCastingForm({...castingForm, skills: v})} />
                <PhotoUploader photos={castingForm.photos} setPhotos={(p: any[]) => setCastingForm({...castingForm, photos: p})} label="Headshot / Fotos" />
                <SubmitButton disabled={isSubmitting} />
              </form>
            </motion.div>
          )}

          {activeView === 'locations' && (
            <motion.div key="locations" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
              <ViewHeader title="Nueva Locación" onBack={() => setActiveView('menu')} />
              <form onSubmit={submitLocation} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-muted-foreground uppercase font-black">Nombre del Espacio</label>
                  <input 
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white"
                    placeholder="Ej: Casona Barranco, Parque..."
                    value={locationForm.name}
                    onChange={e => setLocationForm({...locationForm, name: e.target.value})}
                  />
                </div>
                <InputField label="Ciudad" name="city" value={locationForm.city} onChange={(v: string) => setLocationForm({...locationForm, city: v})} />
                <div className="space-y-2">
                  <label className="text-[10px] text-muted-foreground uppercase font-black">Tipo</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white appearance-none"
                    value={locationForm.type}
                    onChange={e => setLocationForm({...locationForm, type: e.target.value})}
                  >
                    <option value="exterior" className="bg-neutral-900">Exterior</option>
                    <option value="interior" className="bg-neutral-900">Interior</option>
                    <option value="estudio" className="bg-neutral-900">Estudio</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-muted-foreground uppercase font-black">Resumen / Descripción</label>
                  <textarea 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white h-20 resize-none"
                    placeholder="Breve descripción..."
                    value={locationForm.description}
                    onChange={e => setLocationForm({...locationForm, description: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-muted-foreground uppercase font-black">Notas de Scouting</label>
                  <textarea 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white h-24 resize-none"
                    placeholder="Acceso, parqueo, etc..."
                    value={locationForm.scout_notes}
                    onChange={e => setLocationForm({...locationForm, scout_notes: e.target.value})}
                  />
                </div>
                <PhotoUploader photos={locationForm.photos} setPhotos={(p: any[]) => setLocationForm({...locationForm, photos: p})} label="Fotos del Espacio" />
                <SubmitButton disabled={isSubmitting} />
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Task Detail Modal */}
        <AnimatePresence>
          {selectedTask && (
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-[100] bg-black flex flex-col pt-12"
            >
              {/* Modal Header */}
              <div className="px-6 pb-6 border-b border-white/5 flex items-center justify-between shrink-0">
                <button 
                  onClick={() => setSelectedTask(null)}
                  className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white"
                >
                  <ChevronRight size={24} className="rotate-180" />
                </button>
                <div className="text-center flex-1 mx-4 overflow-hidden">
                  <h2 className="text-lg font-black uppercase tracking-tight truncate">{selectedTask.title}</h2>
                  <p className="text-[9px] text-muted-foreground uppercase font-black tracking-[0.2em]">{selectedTask.area}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${selectedTask.priority === 'urgent' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-white/10'}`} />
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10 custom-scrollbar pb-32">
                {isLoadingTaskDetails ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="animate-spin text-white/20" size={32} />
                    <p className="text-[10px] text-white/20 uppercase font-black tracking-widest">Sincronizando Detalles...</p>
                  </div>
                ) : (
                  <>
                    {/* Description */}
                    <div className="space-y-4">
                      <h3 className="text-[10px] text-white/40 uppercase font-black tracking-[0.2em]">Objetivo / Info</h3>
                      <div className="bg-white/5 p-5 rounded-3xl border border-white/5">
                        <p className="text-sm text-white/80 leading-relaxed font-medium">
                          {selectedTask.description || 'No hay descripción detallada para esta tarea.'}
                        </p>
                      </div>
                    </div>

                    {/* Attachments */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[10px] text-white/40 uppercase font-black tracking-[0.2em]">Archivos & Evidencia</h3>
                        <div className="relative">
                          <input 
                            type="file" 
                            accept="image/*"
                            className="absolute inset-0 opacity-0"
                            onChange={handleUploadAttachment}
                            disabled={isUploadingAttachment}
                          />
                          <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-400 active:scale-95 transition-all">
                            {isUploadingAttachment ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                            {isUploadingAttachment ? 'Subiendo...' : 'Añadir'}
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3">
                        {taskAttachments.length > 0 ? taskAttachments.map((att) => (
                          <div key={att.id} className="relative group">
                            <a 
                              href={att.file_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="glass-card p-4 rounded-2xl border border-white/5 flex items-center gap-4 active:bg-white/5"
                            >
                              <div className="p-3 bg-white/5 text-blue-400 rounded-xl">
                                {getFileIcon(att.file_url)}
                              </div>
                              <div className="flex-1 overflow-hidden">
                                <p className="text-xs font-bold text-white truncate">Evidencia de campo</p>
                                <p className="text-[9px] text-white/40 uppercase font-black mt-1">Subido por {att.profiles?.full_name?.split(' ')[0]}</p>
                              </div>
                            </a>
                            <button 
                              onClick={() => handleDeleteAttachment(att)}
                              className="absolute -top-1 -right-1 p-2 bg-red-500 rounded-xl text-white shadow-lg shadow-red-500/20"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        )) : (
                          <div className="p-10 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-white/10 gap-3">
                            <Upload size={24} strokeWidth={1} />
                            <span className="text-[9px] font-black uppercase tracking-widest">Sin archivos adjuntos</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Comments */}
                    <div className="space-y-6">
                      <h3 className="text-[10px] text-white/40 uppercase font-black tracking-[0.2em]">Conversación</h3>
                      <div className="space-y-4">
                        {taskComments.length > 0 ? taskComments.map((comment) => (
                          <div key={comment.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[8px] font-black border border-white/5 shrink-0 overflow-hidden">
                                  {comment.profiles?.avatar_url ? <img src={comment.profiles.avatar_url} /> : comment.profiles?.full_name?.charAt(0)}
                                </div>
                                <span className="text-[10px] font-black text-white/80 uppercase">{comment.profiles?.full_name?.split(' ')[0]}</span>
                              </div>
                              <button onClick={() => handleDeleteComment(comment.id)} className="text-white/10 p-1">
                                <Trash2 size={10} />
                              </button>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5">
                              <p className="text-xs text-white/70 leading-relaxed font-medium">{comment.comment}</p>
                            </div>
                          </div>
                        )) : (
                          <p className="text-center text-[10px] text-white/10 uppercase font-black tracking-[0.2em] py-4">No hay mensajes todavía</p>
                        )}
                        <div ref={commentsEndRef} />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Comment Input Fixed Bottom */}
              <div className="p-6 bg-black border-t border-white/5 pb-10">
                <form onSubmit={handleAddComment} className="relative">
                  <textarea 
                    placeholder="Escribe un mensaje..."
                    className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 pb-14 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all resize-none h-28"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button 
                    type="submit"
                    disabled={!newComment.trim()}
                    className="absolute bottom-4 right-4 px-6 py-2.5 bg-white text-black text-[10px] font-black rounded-2xl uppercase tracking-widest hover:bg-neutral-200 disabled:opacity-20 transition-all shadow-xl"
                  >
                    Enviar
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Persistent Bottom Nav */}
      <nav className="fixed bottom-0 inset-x-0 bg-black/80 backdrop-blur-2xl border-t border-white/5 px-8 pt-4 pb-8 flex items-center justify-between z-50">
        <NavButton active={activeView === 'menu'} icon={<Home size={22} />} label="Inicio" onClick={() => setActiveView('menu')} />
        <NavButton active={activeView === 'tasks'} icon={<CheckSquare size={22} />} label="Tareas" onClick={() => setActiveView('tasks')} />
        <NavButton active={activeView === 'scouting'} icon={<ClipboardCheck size={22} />} label="Scout" onClick={() => setActiveView('scouting')} />
        <button 
          onClick={() => {
            supabase.auth.signOut();
            router.push('/projects');
          }}
          className="flex flex-col items-center gap-1 text-red-500 opacity-60 hover:opacity-100 transition-all"
        >
          <LogOut size={22} />
          <span className="text-[8px] font-black uppercase">Salir</span>
        </button>
      </nav>
    </div>
  );
}

function MenuButton({ icon, title, subtitle, color, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className="glass-card p-6 rounded-3xl border border-white/5 flex items-center justify-between group active:scale-[0.98] transition-all"
    >
      <div className="flex items-center gap-5">
        <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <div className="text-left">
          <h3 className="text-lg font-black uppercase tracking-tight">{title}</h3>
          <p className="text-xs text-muted-foreground font-medium">{subtitle}</p>
        </div>
      </div>
      <ChevronRight className="text-white/20 group-hover:text-white transition-colors" />
    </button>
  );
}

function ViewHeader({ title, onBack }: any) {
  return (
    <div className="flex items-center gap-4">
      <button 
        onClick={onBack}
        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
      >
        <ChevronRight size={20} className="rotate-180" />
      </button>
      <h2 className="text-2xl font-black uppercase tracking-tight">{title}</h2>
    </div>
  );
}

function PhotoUploader({ photos, setPhotos, label = "Fotos / Evidencia" }: any) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPhotos = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setPhotos([...photos, ...newPhotos].slice(0, 8));
  };

  return (
    <div className="space-y-3">
      <label className="text-[10px] text-muted-foreground uppercase font-black">{label}</label>
      <div className="grid grid-cols-4 gap-2">
        {photos.map((p: any, i: number) => (
          <div key={i} className="relative aspect-square rounded-xl border border-white/10 bg-white/5 overflow-hidden group">
            <img src={p.preview} className="w-full h-full object-cover" />
            <button 
              type="button"
              onClick={() => setPhotos(photos.filter((_: any, idx: number) => idx !== i))}
              className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-lg z-20"
            >
              <X size={10} />
            </button>
          </div>
        ))}
        {photos.length < 8 && (
          <div className="relative aspect-square rounded-xl border border-white/10 border-dashed bg-white/5 flex flex-col items-center justify-center gap-1 text-white/20 hover:text-white hover:bg-white/10 transition-all">
            <Camera size={20} />
            <span className="text-[8px] font-bold uppercase">Cámara</span>
            <input 
              type="file" 
              multiple
              accept="image/*"
              className="absolute inset-0 opacity-0"
              onChange={handleFileChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  return (
    <button 
      type="submit"
      disabled={disabled}
      className="w-full py-5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-neutral-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
    >
      {disabled ? <Loader2 size={16} className="animate-spin" /> : 'Sincronizar con Producción'}
    </button>
  );
}

function NavButton({ active, icon, label, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-white' : 'text-white/20 hover:text-white/40'}`}
    >
      <div className={active ? 'scale-110' : ''}>{icon}</div>
      <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
      {active && <motion.div layoutId="nav-dot" className="w-1 h-1 rounded-full bg-white mt-1" />}
    </button>
  );
}

function InputField({ label, name, value, onChange, type = "text" }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] text-muted-foreground uppercase font-black">{label}</label>
      <input 
        type={type}
        name={name}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-blue-500/50 transition-all font-medium"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
