import React, { useState } from 'react';
import { Camera, Plus, X, Check, Loader2, User, Ruler, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CastingTerminalProps {
  onSave: (data: any) => Promise<void>;
  onClose: () => void;
}

export default function CastingTerminal({ onSave, onClose }: CastingTerminalProps) {
  const [formData, setFormData] = useState({
    full_name: '',
    age_range: '',
    height_cm: '',
    experience_level: 'New Face',
    contact_info: ''
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files);
      setPhotos(prev => [...prev, ...newPhotos]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (photos.length < 4) {
      setError('Se requieren al menos 4 fotos para el registro de casting.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await onSave({ ...formData, photos });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar el perfil.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden max-w-2xl w-full mx-auto">
      <div className="bg-indigo-600 p-8 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight">Terminal de Casting</h2>
            <p className="text-xs font-bold text-indigo-100 uppercase tracking-widest mt-1">Recaudación de Perfiles v1.0</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1 flex items-center gap-2">
              <User size={12} className="text-indigo-600" /> Nombre Completo *
            </label>
            <input
              required
              type="text"
              placeholder="Ej: Ana García"
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                <Hash size={12} className="text-indigo-600" /> Edad
              </label>
              <input
                required
                type="text"
                placeholder="20-25"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                value={formData.age_range}
                onChange={(e) => setFormData({ ...formData, age_range: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                <Ruler size={12} className="text-indigo-600" /> Altura (cm)
              </label>
              <input
                required
                type="number"
                placeholder="175"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                value={formData.height_cm}
                onChange={(e) => setFormData({ ...formData, height_cm: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1 flex items-center gap-2">
              <Camera size={14} className="text-indigo-600" /> Fotos Requeridas (Mínimo 4)
            </label>
            <span className={`text-[10px] font-black px-2 py-1 rounded-md ${photos.length >= 4 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
              {photos.length} de 4+
            </span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <AnimatePresence>
              {photos.map((photo, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 shadow-sm group"
                >
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Casting photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                  >
                    <X size={12} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            
            <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition-all group">
              <Plus size={24} className="text-gray-300 group-hover:text-indigo-400 transition-colors" />
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-2">Añadir</span>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </label>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 rounded-2xl border border-red-100 text-red-600 text-[10px] font-bold uppercase tracking-widest text-center">
            {error}
          </div>
        )}

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-xl ${
              photos.length >= 4 
              ? 'bg-zinc-900 text-white hover:bg-zinc-800' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                <Check size={18} /> Guardar Perfil de Casting
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
