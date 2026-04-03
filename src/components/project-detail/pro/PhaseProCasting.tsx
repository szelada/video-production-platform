'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, Camera } from 'lucide-react';

interface PhaseProCastingProps {
  casting: any[];
  hasPermission: (perm: string) => boolean;
  setIsCastingTerminalOpen: (open: boolean) => void;
  setNewCasting: (casting: any) => void;
  setIsAddCastingModalOpen: (open: boolean) => void;
  setSelectedCastingProfile: (profile: any) => void;
  setIsCastingGalleryOpen: (open: boolean) => void;
}

export const PhaseProCasting: React.FC<PhaseProCastingProps> = ({
  casting,
  hasPermission,
  setIsCastingTerminalOpen,
  setNewCasting,
  setIsAddCastingModalOpen,
  setSelectedCastingProfile,
  setIsCastingGalleryOpen
}) => {
  return (
    <motion.div
      key="casting"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Talento & Casting</h2>
          <p className="text-sm text-gray-500">Gestión de perfiles y selección de talento</p>
        </div>
        {hasPermission('manage_casting') && (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setIsCastingTerminalOpen(true)}
              className="flex items-center gap-2 bg-indigo-50 text-indigo-700 border border-indigo-100 px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-all shadow-sm"
            >
              <Camera size={16} /> Modo Terminal
            </button>
            <button
              type="button"
              onClick={() => {
                setNewCasting({ full_name: '', age_range: '', height: '', city: '', skills: '', photos: [] });
                setIsAddCastingModalOpen(true);
              }}
              className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md"
            >
              <Plus size={16} /> Nuevo Perfil
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {casting.length > 0 ? casting.map((profile: any) => (
          <div 
            key={profile.id} 
            className="bg-white shadow-sm group relative flex flex-col rounded-2xl border border-gray-100 overflow-hidden cursor-pointer hover:border-indigo-300 hover:shadow-lg transition-all" 
            onClick={() => { setSelectedCastingProfile(profile); setIsCastingGalleryOpen(true); }}
          >
            <div className="aspect-[3/4] bg-white/[0.03] relative overflow-hidden">
              {profile.casting_photos?.length > 0 || profile.photo_url ? (
                <img
                  src={profile.photo_url || profile.casting_photos?.find((p: any) => p.photo_type === 'headshot')?.file_url || profile.casting_photos?.[0]?.file_url}
                  alt={profile.full_name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-300 placeholder-icon">
                  <Users size={64} strokeWidth={1} />
                </div>
              )}
              <div className="absolute top-4 left-4">
                <span className="text-[10px] font-black px-2 py-1 rounded bg-white/90 backdrop-blur-md border border-gray-100 text-gray-900 uppercase tracking-widest">
                  {profile.status || 'NEW'}
                </span>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{profile.full_name}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <span>{profile.age_range} años</span>
                  <span className="w-1 h-1 rounded-full bg-gray-200" />
                  <span>{profile.height_cm} cm</span>
                </div>
              </div>

              {profile.casting_photos?.length > 0 && (
                <div className="flex flex-wrap gap-2 py-2">
                  {[{ id: 'headshot', label: 'Perfil' }, { id: 'bust', label: 'Busto' }, { id: 'medium', label: '3/4' }, { id: 'full_body', label: 'Cuerpo Entero' }].map(catItem => {
                    const cat = catItem.id;
                    const photos = profile.casting_photos.filter((p: any) => p.photo_type === cat);
                    if (photos.length === 0) return null;
                    return (
                      <div key={cat} className="flex flex-col gap-1">
                        <span className="text-[8px] text-gray-500 uppercase font-black">{cat}</span>
                        <div className="flex gap-1">
                          {photos.map((p: any) => (
                            <div key={p.id} className="w-6 h-6 rounded bg-gray-100 border border-gray-100 overflow-hidden">
                              <img src={p.file_url} className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex flex-wrap gap-1.5 pt-1">
                {profile.skills && profile.skills.trim() !== "" ?
                  profile.skills.split(',').filter((s: string) => s.trim() !== "").map((skill: string, i: number) => (
                    <span key={i} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gray-50 text-gray-500 border border-gray-100 uppercase">
                      {skill.trim()}
                    </span>
                  )) : (
                    <span className="text-[9px] text-gray-400 italic">Sin habilidades</span>
                  )
                }
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full p-20 bg-white shadow-sm rounded-2xl border border-gray-100 border-dashed flex flex-col items-center justify-center gap-4 text-center">
            <span className="p-4 rounded-full bg-gray-50 text-gray-400"><Users size={32} /></span>
            <p className="text-gray-500 max-w-xs">No hay talentos registrados para este proyecto. Comienza agregando uno.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
