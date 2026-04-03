'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Search,
    Plus,
    Mail,
    Lock,
    User as UserIcon,
    Shield,
    Loader2,
    X,
    MoreVertical,
    Briefcase
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export default function TeamDirectoryPage() {
    const [profiles, setProfiles] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingProfile, setEditingProfile] = useState<any>(null);
    const [allRoles, setAllRoles] = useState<any[]>([]);

    // Form state
    const [newUser, setNewUser] = useState({
        email: '',
        password: '',
        full_name: '',
    });

    useEffect(() => {
        fetchProfiles();
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        const { data } = await supabase.from('roles').select('*').order('name');
        if (data) setAllRoles(data);
    };


    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ 
                    full_name: editingProfile.full_name,
                    default_role_id: editingProfile.default_role_id
                })
                .eq('id', editingProfile.id);

            if (error) throw error;
            setIsEditModalOpen(false);
            setEditingProfile(null);
            fetchProfiles();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleUserStatus = async (id: string, currentStatus: boolean) => {
        try {
            await supabase.from('profiles').update({ is_active: !currentStatus }).eq('id', id);
            fetchProfiles();
        } catch (err) {
            console.error(err);
        }
    };

    const fetchProfiles = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select(`
          *,
          roles:default_role_id (name)
        `)
                .order('full_name', { ascending: true });

            if (error) throw error;
            setProfiles(data || []);
        } catch (err) {
            console.error('Error fetching profiles:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al crear el usuario');
            }

            // Reset & Refresh
            setIsModalOpen(false);
            setNewUser({ email: '', password: '', full_name: '' });
            fetchProfiles();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredProfiles = profiles.filter(p =>
        p.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.roles?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 mb-2">Directorio de Equipo</h1>
                    <p className="text-zinc-500 max-w-2xl text-sm font-medium">Gestión administrativa del talento globalizado. Crea cuentas de acceso para miembros del crew y visualiza la nómina de perfiles dados de alta en la plataforma.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#1C1C1E] hover:bg-zinc-800 text-white px-6 py-3.5 rounded-[20px] shadow-xl flex items-center gap-2 font-black uppercase tracking-widest text-xs transition-all active:scale-95 whitespace-nowrap"
                >
                    <Plus size={16} />
                    Nuevo Miembro
                </button>
            </div>

            {/* Main Content Area */}
            <div className="bg-[#1C1C1E] rounded-[40px] p-6 lg:p-8 shadow-2xl space-y-8">

                {/* Search Bar */}
                <div className="relative w-full max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search size={18} className="text-zinc-500" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar por nombre o rol..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-[#2C2C2E] border-none focus:ring-2 focus:ring-teal-500/50 rounded-2xl text-white placeholder:text-zinc-500 transition-all font-medium text-sm"
                    />
                </div>

                {/* Profiles Grid */}
                {loading ? (
                    <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4">
                        <Loader2 className="animate-spin text-teal-500" size={32} />
                    </div>
                ) : filteredProfiles.length === 0 ? (
                    <div className="min-h-[30vh] flex flex-col items-center justify-center text-center gap-4 bg-[#2C2C2E]/50 rounded-[32px] p-10 border border-white/5">
                        <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 mb-2">
                            <Search size={24} />
                        </div>
                        <h3 className="text-lg font-black text-white">No se encontraron miembros</h3>
                        <p className="text-zinc-500 text-sm">Prueba buscando con otro término.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProfiles.map((profile, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.05 }}
                                key={profile.id}
                                onClick={() => {
                                    setEditingProfile({ ...profile });
                                    setIsEditModalOpen(true);
                                }}
                                className="bg-[#2C2C2E] p-6 rounded-[32px] border border-white/5 hover:border-teal-500/20 transition-colors group relative overflow-hidden cursor-pointer active:scale-[0.98]"
                            >
                                {/* Decorative background glow on hover */}
                                <div className="absolute -right-20 -top-20 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="flex items-start justify-between mb-6 relative z-10">
                                    <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center text-white overflow-hidden shadow-inner flex-shrink-0">
                                        {profile.avatar_url ? (
                                            <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-xl font-black">{profile.full_name?.substring(0, 2).toUpperCase() || 'MI'}</span>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveMenu(activeMenu === profile.id ? null : profile.id);
                                            }}
                                            className="text-zinc-500 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5 active:scale-95"
                                        >
                                            <MoreVertical size={18} />
                                        </button>
                                        
                                        <AnimatePresence>
                                            {activeMenu === profile.id && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="absolute right-0 top-full mt-2 w-48 bg-[#2C2C2E] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 py-2"
                                                >
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditingProfile({ ...profile });
                                                            setIsEditModalOpen(true);
                                                            setActiveMenu(null);
                                                        }}
                                                        className="w-full text-left px-4 py-2.5 text-xs font-bold text-white hover:bg-white/5 transition-colors flex items-center gap-3"
                                                    >
                                                        <UserIcon size={14} className="text-zinc-400" /> Editar Perfil
                                                    </button>
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleUserStatus(profile.id, profile.is_active);
                                                            setActiveMenu(null);
                                                        }}
                                                        className="w-full text-left px-4 py-2.5 text-xs font-bold text-white hover:bg-white/5 transition-colors flex items-center gap-3"
                                                    >
                                                        <Shield size={14} className={profile.is_active ? 'text-red-400' : 'text-emerald-400'} /> 
                                                        {profile.is_active ? 'Desactivar Cuenta' : 'Activar Cuenta'}
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                <div className="space-y-1 relative z-10">
                                    <h3 className="font-bold text-white text-lg truncate" title={profile.full_name}>
                                        {profile.full_name || 'Usuario Sin Nombre'}
                                    </h3>
                                    <div className="flex items-center text-teal-400 text-sm font-medium">
                                        <Briefcase size={14} className="mr-1.5" />
                                        <span className="truncate">{profile.roles?.name || 'Freelancer Genérico'}</span>
                                    </div>
                                </div>

                                <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-xs font-black uppercase tracking-wider text-zinc-500 relative z-10">
                                    <span>Status</span>
                                    <Badge variant={profile.is_active ? 'success' : 'default'} className="rounded-full px-3 py-1 text-[10px]">
                                        {profile.is_active ? 'Activo' : 'Inactivo'}
                                    </Badge>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Creación de Usuario Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-[#1C1C1E] w-full max-w-md rounded-[40px] overflow-hidden shadow-2xl border border-white/5"
                        >
                            <div className="flex justify-between items-center p-8 border-b border-white/5">
                                <div>
                                    <h2 className="text-xl font-black text-white">Alta de Miembro</h2>
                                    <p className="text-xs text-zinc-500 font-medium mt-1">Otorga credenciales de acceso al sistema.</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2.5 rounded-full hover:bg-white/5 text-zinc-400 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleCreateUser} className="p-8 space-y-6">
                                {error && (
                                    <div className="p-4 bg-red-950/30 text-red-400 text-sm border border-red-500/20 rounded-2xl">
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 ml-1">Nombre Completo</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <UserIcon size={18} className="text-zinc-500" />
                                            </div>
                                            <input
                                                required
                                                type="text"
                                                value={newUser.full_name}
                                                onChange={e => setNewUser({ ...newUser, full_name: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3.5 bg-[#2C2C2E] border-none focus:ring-2 focus:ring-teal-500/50 rounded-2xl text-white placeholder:text-zinc-600 transition-all font-medium text-sm"
                                                placeholder="Ej. Maria Lopez"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 ml-1">Email Profesional</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Mail size={18} className="text-zinc-500" />
                                            </div>
                                            <input
                                                required
                                                type="email"
                                                value={newUser.email}
                                                onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3.5 bg-[#2C2C2E] border-none focus:ring-2 focus:ring-teal-500/50 rounded-2xl text-white placeholder:text-zinc-600 transition-all font-medium text-sm"
                                                placeholder="maria@916studio.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 ml-1">Contraseña Provisoria</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Lock size={18} className="text-zinc-500" />
                                            </div>
                                            <input
                                                required
                                                type="password"
                                                minLength={6}
                                                value={newUser.password}
                                                onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3.5 bg-[#2C2C2E] border-none focus:ring-2 focus:ring-teal-500/50 rounded-2xl text-white placeholder:text-zinc-600 transition-all font-medium text-sm font-mono"
                                                placeholder="Mínimo 6 caracteres"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-6 py-3.5 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-teal-500 hover:bg-teal-600 px-6 py-3.5 text-white rounded-[16px] flex items-center justify-center font-black uppercase tracking-widest text-xs transition-colors shadow-lg shadow-teal-500/20 disabled:opacity-50 min-w-[140px]"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : 'Crear Cuenta'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edición de Perfil Modal */}
            <AnimatePresence>
                {isEditModalOpen && editingProfile && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-[#1C1C1E] w-full max-w-md rounded-[40px] overflow-hidden shadow-2xl border border-white/5"
                        >
                            <div className="flex justify-between items-center p-8 border-b border-white/5">
                                <div>
                                    <h2 className="text-xl font-black text-white">Editar Perfil</h2>
                                    <p className="text-xs text-zinc-500 font-medium mt-1">Actualiza los datos del miembro del equipo.</p>
                                </div>
                                <button
                                    onClick={() => { setIsEditModalOpen(false); setEditingProfile(null); }}
                                    className="p-2.5 rounded-full hover:bg-white/5 text-zinc-400 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleUpdateProfile} className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 ml-1">Nombre Completo</label>
                                        <input
                                            required
                                            type="text"
                                            value={editingProfile.full_name || ''}
                                            onChange={e => setEditingProfile({ ...editingProfile, full_name: e.target.value })}
                                            className="w-full px-5 py-3.5 bg-[#2C2C2E] border-none focus:ring-2 focus:ring-teal-500/50 rounded-2xl text-white transition-all font-medium text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 ml-1">Rol Asignado</label>
                                        <select
                                            value={editingProfile.default_role_id || ''}
                                            onChange={e => setEditingProfile({ ...editingProfile, default_role_id: e.target.value })}
                                            className="w-full px-5 py-3.5 bg-[#2C2C2E] border-none focus:ring-2 focus:ring-teal-500/50 rounded-2xl text-white transition-all font-medium text-sm appearance-none"
                                        >
                                            <option value="">Seleccionar rol...</option>
                                            {allRoles.map(role => (
                                                <option key={role.id} value={role.id}>{role.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => { setIsEditModalOpen(false); setEditingProfile(null); }}
                                        className="px-6 py-3.5 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-teal-500 hover:bg-teal-600 px-6 py-3.5 text-white rounded-[16px] flex items-center justify-center font-black uppercase tracking-widest text-xs transition-colors shadow-lg shadow-teal-500/20 disabled:opacity-50 min-w-[140px]"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : 'Guardar Cambios'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
