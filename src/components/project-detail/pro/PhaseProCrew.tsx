'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, UserMinus, Mail, Phone, X, Loader2 } from 'lucide-react';

interface PhaseProCrewProps {
  crew: any[];
  profiles: any[];
  roles: any[];
  isAddMemberModalOpen: boolean;
  setIsAddMemberModalOpen: (open: boolean) => void;
  handleAddMember: (e: React.FormEvent) => void;
  handleRemoveMember: (id: string) => void;
  newMember: { profile_id: string; role_id: string };
  setNewMember: (member: { profile_id: string; role_id: string }) => void;
  isSubmitting: boolean;
  hasPermission: (perm: string) => boolean;
  setSelectedCrewMember: (member: any) => void;
  setIsCrewSidebarOpen: (open: boolean) => void;
}

export const PhaseProCrew: React.FC<PhaseProCrewProps> = ({
  crew,
  profiles,
  roles,
  isAddMemberModalOpen,
  setIsAddMemberModalOpen,
  handleAddMember,
  handleRemoveMember,
  newMember,
  setNewMember,
  isSubmitting,
  hasPermission,
  setSelectedCrewMember,
  setIsCrewSidebarOpen
}) => {
  const categories = [
    { title: 'Liderazgo & Producción', roles: ['director', 'productor'] },
    { title: 'Imagen & Fotografía', roles: ['dp', 'gaffer'] },
    { title: 'Arte & Escenografía', roles: ['arte'] },
    { title: 'Sonido & Técnica', roles: ['sonido'] },
    { title: 'Otros', roles: [] }
  ];

  const renderCrewMember = (member: any) => (
    <div 
      key={member.id} 
      className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative group hover:border-indigo-300 transition-all cursor-pointer hover:shadow-md" 
      onClick={() => { setSelectedCrewMember(member); setIsCrewSidebarOpen(true); }}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          {member.profiles?.avatar_url ? (
            <div className="w-14 h-14 rounded-2xl border border-gray-100 overflow-hidden bg-gray-50 p-0.5">
              <img
                src={member.profiles.avatar_url}
                alt={member.profiles.full_name}
                className="w-full h-full rounded-[14px] object-cover"
              />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xl font-bold text-indigo-300">
              {member.profiles?.full_name?.charAt(0) || '?'}
            </div>
          )}
          <div>
            <h4 className="text-sm font-bold text-gray-900 leading-tight">{member.profiles?.full_name}</h4>
            <span className="text-[10px] text-indigo-600 uppercase font-black tracking-widest mt-1.5 block">
              {member.roles?.name || 'Staff'}
            </span>
          </div>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); handleRemoveMember(member.id); }}
          className="p-2 text-gray-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
          title="Eliminar del proyecto"
        >
          <UserMinus size={16} />
        </button>
      </div>

      <div className="space-y-3 pt-6 border-t border-gray-50">
        <div className="flex items-center gap-3 text-gray-400 hover:text-indigo-600 transition-colors">
          <Mail size={12} className="shrink-0" />
          <span className="text-xs font-medium truncate">{member.profiles?.email || 'profesional@916.studio'}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-400 hover:text-indigo-600 transition-colors">
          <Phone size={12} className="shrink-0" />
          <span className="text-xs font-medium">{member.profiles?.phone || '+51 900 000 000'}</span>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between text-[9px] text-gray-300 uppercase font-black tracking-widest">
        <span>ASIGNADO EL</span>
        <span className="text-gray-400">{member.joined_at ? new Date(member.joined_at).toLocaleDateString() : 'RECENT'}</span>
      </div>
    </div>
  );

  return (
    <motion.div
      key="crew"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Miembros del Equipo</h2>
          <p className="text-sm text-gray-400 uppercase font-black tracking-widest mt-1">Gestión de profesionales y roles</p>
        </div>
        {hasPermission('manage_crew') && (
          <button
            onClick={() => setIsAddMemberModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            <Plus size={16} /> Añadir Miembro
          </button>
        )}
      </div>

      {categories.map(cat => {
        const members = crew.filter(m => {
          const roleKey = m.roles?.key?.toLowerCase() || '';
          if (cat.roles.length === 0) {
            return !categories.some(c => c.roles.includes(roleKey));
          }
          return cat.roles.includes(roleKey);
        });

        if (members.length === 0) return null;

        return (
          <div key={cat.title} className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-gray-100" />
              {cat.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map(renderCrewMember)}
            </div>
          </div>
        );
      })}

      {crew.length === 0 && (
        <div className="col-span-full p-20 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200 flex flex-col items-center justify-center gap-4 text-center">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mx-auto">
            <Users size={32} className="text-gray-200" />
          </div>
          <p className="text-xs text-gray-400 font-black uppercase tracking-widest">No hay miembros asignados.</p>
        </div>
      )}

      {/* Add Member Modal */}
      {isAddMemberModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="glass-card w-full max-w-md p-8 rounded-3xl border border-white/10 shadow-2xl relative"
          >
            <button
              onClick={() => setIsAddMemberModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="mb-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-1">Crew Management</h4>
              <h3 className="text-xl font-bold text-white uppercase tracking-tight">Añadir Profesional</h3>
              <p className="text-sm text-white/40 mt-1 italic">Asigna un miembro del equipo al proyecto.</p>
            </div>

            <form onSubmit={handleAddMember} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Seleccionar Perfil</label>
                <select
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5 appearance-none cursor-pointer"
                  value={newMember.profile_id}
                  onChange={(e) => setNewMember({ ...newMember, profile_id: e.target.value })}
                >
                  <option value="" disabled className="bg-neutral-900">Elegir perfil...</option>
                  {profiles.map(p => (
                    <option key={p.id} value={p.id} className="bg-neutral-900">{p.full_name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Rol en el Proyecto</label>
                <select
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5 appearance-none cursor-pointer"
                  value={newMember.role_id}
                  onChange={(e) => setNewMember({ ...newMember, role_id: e.target.value })}
                >
                  <option value="" disabled className="bg-neutral-900">Asignar rol...</option>
                  {roles.map(r => (
                    <option key={r.id} value={r.id} className="bg-neutral-900">{r.name}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-neutral-200 transition-all shadow-xl flex items-center justify-center gap-2 mt-4"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Confirmar Asignación'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
