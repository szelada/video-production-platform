import sys
import os

filepath = r'e:\WEBS y APPS Antigravity\video-production-platform\next_app\src\app\projects\[id]\page.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# The block to replacement (Lines 2688 to 3447, 1-indexed)
# In 0-indexed: 2687 to 3447
start_idx = 2687
end_idx = 3447

new_content = r'''              {(activePhase === 'pre' || activePhase === 'pro') && activeSubTab === 'personalizacion' && (
                <motion.div
                  key="pre-personalizacion"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-10"
                >
                   <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-10">
                     <div className="flex items-center gap-6">
                       <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">Branding & Personalización</h2>
                       <div className="h-8 w-[1px] bg-gray-200" />
                       <div className="flex items-center gap-2 bg-gray-100/80 p-1.5 rounded-2xl border border-gray-200 shadow-inner">
                          <button 
                            onClick={() => setBrandingInnerTab('global')}
                            className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${brandingInnerTab === 'global' ? 'bg-white text-indigo-600 shadow-lg shadow-indigo-100' : 'text-gray-400 hover:text-gray-600'}`}
                          >
                             <Globe size={14} className="inline mr-2" /> Global
                          </button>
                          <button 
                            onClick={() => setBrandingInnerTab('credencial')}
                            className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${brandingInnerTab === 'credencial' ? 'bg-white text-indigo-600 shadow-lg shadow-indigo-100' : 'text-gray-400 hover:text-gray-600'}`}
                          >
                             <IdCard size={14} className="inline mr-2" /> Fotocheck Pro
                          </button>
                       </div>
                     </div>
                   </div>

                   {brandingInnerTab === 'global' && (
                      <div className="space-y-12">
                        {/* CORPORATE IDENTITY CONTROLS */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                           <div className="bg-white rounded-[3.5rem] p-12 border border-gray-100 shadow-sm space-y-12 relative overflow-hidden group">
                              <div className="flex items-center gap-4 border-b border-gray-50 pb-8">
                                 <div className="p-4 bg-indigo-50 text-indigo-600 rounded-[1.5rem] shadow-sm ring-1 ring-indigo-100 transition-all font-black" style={{ color: brandConfig.brand_color, backgroundColor: `${brandConfig.brand_color}10`, boxShadow: `0 0 0 1px ${brandConfig.brand_color}20` }}>
                                    <Building2 size={28} />
                                 </div>
                                 <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Identidad Corporativa</h3>
                              </div>
                              
                              <div className="space-y-10">
                                 <div className="space-y-4">
                                    <div className="flex items-center justify-between px-2">
                                       <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Nombre de la Productora / Marca</label>
                                       <span className="text-[8px] font-bold text-indigo-400 uppercase tracking-widest ring-1 ring-indigo-50 ring-offset-2 rounded-full px-2" style={{ color: brandConfig.brand_color, boxShadow: `0 0 0 1px ${brandConfig.brand_color}40` }}>Global UI Sync</span>
                                    </div>
                                    <input 
                                       type="text" 
                                       value={brandConfig.agency_name}
                                       onChange={(e) => setBrandConfig({ ...brandConfig, agency_name: e.target.value })}
                                       className="w-full px-10 py-6 bg-gray-50 border border-gray-100 rounded-[2.5rem] text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-mono shadow-inner uppercase"
                                       placeholder="NOMBRE DE LA AGENCIA..."
                                    />
                                 </div>

                                 <div className="grid grid-cols-2 gap-10">
                                    <div className="space-y-5">
                                       <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-2">Logo Principal (Agencia)</label>
                                       <div 
                                          onClick={() => agencyLogoRef.current?.click()}
                                          className="aspect-square bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-10 text-center group cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/10 transition-all relative overflow-hidden shadow-sm"
                                       >
                                          {brandConfig.agency_logo ? (
                                             <img src={brandConfig.agency_logo} className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500" alt="Agency Logo" />
                                          ) : (
                                             <>
                                                <div className="p-6 bg-white rounded-3xl shadow-xl group-hover:scale-125 group-hover:rotate-6 transition-all duration-500">
                                                   <Upload size={32} className="text-gray-200 group-hover:text-indigo-500" style={{ color: brandConfig.brand_color }} />
                                                </div>
                                                <span className="text-[10px] font-black text-gray-400 uppercase mt-6 tracking-widest">Subir Logotipo</span>
                                             </>
                                          )}
                                          <input type="file" ref={agencyLogoRef} className="hidden" onChange={(e) => {
                                             const file = e.target.files?.[0];
                                             if (file) {
                                                const reader = new FileReader();
                                                reader.onload = (re) => setBrandConfig({ ...brandConfig, agency_logo: re.target?.result as string });
                                                reader.readAsDataURL(file);
                                             }
                                          }} />
                                       </div>
                                    </div>

                                    <div className="space-y-5">
                                       <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-2">Logo Cliente (Proyecto)</label>
                                       <div 
                                          onClick={() => clientLogoRef.current?.click()}
                                          className="aspect-square bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-10 text-center group cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/10 transition-all relative overflow-hidden shadow-sm"
                                       >
                                          {brandConfig.client_logo ? (
                                             <img src={brandConfig.client_logo} className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500" alt="Client Logo" />
                                          ) : (
                                             <>
                                                <div className="p-6 bg-white rounded-3xl shadow-xl group-hover:scale-125 group-hover:-rotate-6 transition-all duration-500">
                                                   <Upload size={32} className="text-gray-200 group-hover:text-emerald-500" />
                                                </div>
                                                <span className="text-[10px] font-black text-gray-400 uppercase mt-6 tracking-widest">Logo Cliente</span>
                                             </>
                                          )}
                                          <input type="file" ref={clientLogoRef} className="hidden" onChange={(e) => {
                                             const file = e.target.files?.[0];
                                             if (file) {
                                                const reader = new FileReader();
                                                reader.onload = (re) => setBrandConfig({ ...brandConfig, client_logo: re.target?.result as string });
                                                reader.readAsDataURL(file);
                                             }
                                          }} />
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>

                           <div className="bg-white rounded-[3.5rem] p-12 border border-gray-100 shadow-sm space-y-12 flex flex-col justify-between group">
                              <div className="space-y-12">
                                 <div className="flex items-center gap-4 border-b border-gray-50 pb-8">
                                    <div className="p-4 bg-amber-50 text-amber-600 rounded-[1.5rem] shadow-sm ring-1 ring-amber-100">
                                       <Palette size={28} />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Sistemas de Color</h3>
                                 </div>

                                 <div className="space-y-10">
                                    <div className="space-y-8">
                                       <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none block px-1">Tono Principal (UI System)</label>
                                       <div className="flex flex-wrap gap-6">
                                          {['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#000000', '#7c3aed', '#ec4899'].map((color, i) => (
                                             <button 
                                                key={i}
                                                type="button"
                                                onClick={() => setBrandConfig({ ...brandConfig, brand_color: color })}
                                                className={`w-16 h-16 rounded-[1.8rem] shadow-xl transition-all relative ${brandConfig.brand_color === color ? 'ring-4 ring-offset-8 scale-110 z-10' : 'hover:scale-105 opacity-40 hover:opacity-100'}`}
                                                style={{ backgroundColor: color, boxShadow: `0 0 0 1px ${color}` }}
                                             >
                                                {brandConfig.brand_color === color && <Check className="absolute inset-0 m-auto text-white drop-shadow-md" size={28} />}
                                             </button>
                                          ))}
                                          <input 
                                             type="color" 
                                             value={brandConfig.brand_color}
                                             onChange={(e) => setBrandConfig({ ...brandConfig, brand_color: e.target.value })}
                                             className="w-16 h-16 rounded-[1.8rem] border-none p-0 bg-transparent cursor-pointer shadow-xl appearance-none ring-1 ring-gray-100"
                                          />
                                       </div>
                                    </div>
                                    <div className="space-y-4">
                                       <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-2">Color de Cabeceras (Secondary)</label>
                                       <div className="flex items-center gap-6">
                                          <input 
                                             type="color" 
                                             value={brandConfig.secondary_color}
                                             onChange={(e) => setBrandConfig({ ...brandConfig, secondary_color: e.target.value })}
                                             className="w-16 h-16 rounded-[1.8rem] border-none p-0 bg-transparent cursor-pointer shadow-xl appearance-none ring-1 ring-gray-100"
                                          />
                                          <span className="text-sm font-bold text-gray-400 font-mono uppercase">{brandConfig.secondary_color}</span>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                              <button
                                 type="button"
                                 className="w-full py-7 bg-gray-900 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-black transition-all shadow-2xl shadow-gray-200 flex items-center justify-center gap-4 group active:scale-[0.98]"
                              >
                                 <Building2 size={22} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                 SINCRONIZAR PLATAFORMA CORPORATIVA
                              </button>
                           </div>
                        </div>

                        {/* PLATFORM BRANDING (GLOBAL) */}
                        <div className="bg-white rounded-[3.5rem] p-12 border border-gray-100 shadow-sm space-y-10">
                           <div className="flex items-center gap-4 border-b border-gray-50 pb-8">
                              <div className="p-4 bg-purple-50 text-purple-600 rounded-[1.5rem] shadow-sm ring-1 ring-purple-100">
                                 <Monitor size={28} />
                              </div>
                              <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Branding de Plataforma</h3>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                              <div className="space-y-6">
                                 <div className="space-y-4">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">Tipografía Principal</label>
                                    <select 
                                       value={brandConfig.platform_font_family}
                                       onChange={(e) => setBrandConfig({ ...brandConfig, platform_font_family: e.target.value })}
                                       className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-[2rem] text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-mono shadow-inner uppercase"
                                    >
                                       <option value="Inter">Inter (Swiss Classic)</option>
                                       <option value="Outfit">Outfit (Moderna/Redonda)</option>
                                       <option value="Roboto">Roboto (Neo-Grotesque)</option>
                                       <option value="Montserrat">Montserrat (Cinematic)</option>
                                    </select>
                                 </div>
                                 <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                       <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">Fondo App</label>
                                       <input 
                                          type="color" 
                                          value={brandConfig.platform_bg_color}
                                          onChange={(e) => setBrandConfig({ ...brandConfig, platform_bg_color: e.target.value })}
                                          className="w-full h-12 rounded-xl border-2 border-gray-100 bg-white cursor-pointer"
                                       />
                                    </div>
                                    <div className="space-y-4">
                                       <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">Color Cards</label>
                                       <input 
                                          type="color" 
                                          value={brandConfig.platform_card_color}
                                          onChange={(e) => setBrandConfig({ ...brandConfig, platform_card_color: e.target.value })}
                                          className="w-full h-12 rounded-xl border-2 border-gray-100 bg-white cursor-pointer"
                                       />
                                    </div>
                                 </div>
                              </div>
                              <div className="bg-gray-50 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center space-y-4">
                                 <Info size={32} className="text-gray-300" />
                                 <p className="text-[10px] text-gray-400 uppercase font-black leading-relaxed tracking-widest">
                                    Los cambios de plataforma afectan el dashboard y las áreas de gestión para todos los usuarios.
                                 </p>
                              </div>
                           </div>
                        </div>
                      </div>
                   )}

                   {brandingInnerTab === 'credencial' && (
                      <div className="space-y-12">
                         <div className="w-full bg-white rounded-[3.5rem] p-12 border border-gray-100 shadow-sm space-y-12">
                            <div className="flex items-center justify-between border-b border-gray-50 pb-8">
                               <div className="flex items-center gap-4">
                                  <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl shadow-sm">
                                    <IdCard size={28} />
                                  </div>
                                  <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Credencial Maestra (Fotocheck)</h3>
                               </div>
                               <button onClick={() => window.print()} className="px-6 py-3 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">Imprimir Prueba</button>
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                               {/* PREVIEW PANEL */}
                               <div className="flex flex-col items-center justify-center bg-gray-50 rounded-[3rem] p-10 border border-gray-100 shadow-inner relative overflow-hidden group/card shadow-sm">
                                  <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
                                  
                                  <div className="w-[320px] h-[520px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col relative border border-gray-200 print-card group-hover/card:scale-105 transition-transform duration-700">
                                     <div 
                                       className="text-white flex items-center justify-center transition-all duration-500 relative overflow-hidden"
                                       style={{ 
                                         backgroundColor: brandConfig.id_card_banner_color,
                                         height: `${brandConfig.id_card_banner_height}px`,
                                         backgroundImage: (brandConfig.id_card_use_texture && brandConfig.id_card_banner_url) ? `url(${brandConfig.id_card_banner_url})` : 'none',
                                         backgroundSize: 'cover',
                                         backgroundPosition: 'center',
                                         borderRadius: '2.5rem 2.5rem 0 0'
                                       }}
                                     >
                                         <div 
                                           className="relative z-10 font-black tracking-[0.1em] uppercase text-center px-4"
                                           style={{ 
                                             transform: `scale(${brandConfig.id_card_branding_scale}) translate(${brandConfig.id_card_branding_offset_x}px, ${brandConfig.id_card_branding_offset_y}px)`,
                                             color: brandConfig.id_card_branding_font_color,
                                             fontSize: `${brandConfig.id_card_branding_font_size}px`
                                           }}
                                         >
                                           {brandConfig.id_card_branding_text}
                                         </div>
                                     </div>

                                      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
                                         <div className="w-40 h-40 rounded-[2.5rem] border-4 border-white shadow-2xl overflow-hidden relative group/photo bg-gray-100">
                                            <img 
                                              src={idCardUser.photo || ''} 
                                              className="w-full h-full" 
                                              style={{ 
                                                  objectFit: 'cover',
                                                  transform: `scale(${brandConfig.id_card_avatar_scale}) translate(${brandConfig.id_card_avatar_offset_x}px, ${brandConfig.id_card_avatar_offset_y}px)`,
                                                  transformOrigin: 'center'
                                              }}
                                              alt="Portador" 
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center">
                                               <Camera size={24} className="text-white" />
                                            </div>
                                         </div>
                                        
                                        <div className="text-center space-y-6">
                                            <div className="space-y-1">
                                               <h5 className="text-xl font-black text-gray-900 uppercase tracking-tighter">{idCardUser.name}</h5>
                                               <p className="text-[10px] font-black tracking-widest uppercase py-1 px-4 inline-block rounded-full mb-1" style={{ 
                                                     color: brandConfig.id_card_role_font_color, 
                                                     backgroundColor: brandConfig.id_card_role_badge_color,
                                                     border: `1px solid ${brandConfig.id_card_role_font_color}20` 
                                                   }}>{idCardUser.role}</p>
                                            </div>
                                            <div className="flex flex-col items-center pt-8 opacity-40">
                                               <div className="w-16 h-[1px] bg-gray-200" />
                                            </div>
                                         </div>
                                     </div>

                                     <div className="bg-gray-50 border-t border-gray-100 p-8 flex items-center justify-between">
                                        <div className="flex flex-col">
                                           <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest">EXPEDICIÓN</span>
                                           <span className="text-[10px] font-black text-gray-900 uppercase font-mono">{idCardUser.id_number}</span>
                                        </div>
                                        <div className="w-16 h-16 bg-white p-2 rounded-xl shadow-md border border-gray-100 flex items-center justify-center">
                                           <QrCode size={48} className="text-gray-900" />
                                        </div>
                                     </div>
                                  </div>
                               </div>

                               {/* EDITOR PANEL */}
                               <div className="space-y-10">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                     <div className="space-y-3">
                                       <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-2">Bearar Name</label>
                                       <input 
                                         type="text" 
                                         value={idCardUser.name}
                                         onChange={(e) => setIdCardUser({ ...idCardUser, name: e.target.value })}
                                         className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-[2rem] text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-mono"
                                       />
                                     </div>
                                     <div className="space-y-3">
                                       <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-2">Role / Function</label>
                                       <input 
                                         type="text" 
                                         value={idCardUser.role}
                                         onChange={(e) => setIdCardUser({ ...idCardUser, role: e.target.value })}
                                         className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-[2rem] text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-mono"
                                       />
                                     </div>
                                  </div>

                                  <div className="flex flex-wrap items-center gap-6">
                                     <input type="file" ref={idCardPhotoRef} className="hidden" onChange={(e) => {
                                       const file = e.target.files?.[0];
                                       if (file) {
                                         const reader = new FileReader();
                                         reader.onload = (re) => setIdCardUser({ ...idCardUser, photo: re.target?.result as string });
                                         reader.readAsDataURL(file);
                                       }
                                     }} />
                                     <button onClick={() => idCardPhotoRef.current?.click()} className="flex items-center gap-4 px-10 py-5 bg-white border border-gray-100 text-gray-900 rounded-[2.2rem] text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm">
                                        <Camera size={18} className="text-indigo-500" /> Cambiar Avatar
                                     </button>
                                     <button onClick={() => setIdCardUser({ ...idCardUser, id_number: `ID-${Math.floor(Math.random() * 900 + 100)}-${new Date().getFullYear()}-${Math.random().toString(36).substr(2,1).toUpperCase()}` })} className="flex items-center gap-4 px-10 py-5 bg-white border border-gray-100 text-gray-900 rounded-[2.2rem] text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm">
                                        <RefreshCw size={18} className="text-emerald-500" /> Regenerar ID
                                     </button>
                                  </div>

                                  <div className="bg-gray-900 rounded-[3rem] p-10 space-y-10 shadow-2xl border border-white/5">
                                     <div className="flex items-center justify-between border-b border-white/10 pb-6">
                                        <div className="flex items-center gap-4">
                                           <div className="p-3 bg-white/5 text-amber-400 rounded-xl">
                                             <Sparkles size={20} />
                                           </div>
                                           <h4 className="text-sm font-black text-white uppercase tracking-widest leading-none">Configuración Tunche</h4>
                                        </div>
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                           <span className="text-[10px] font-black text-white/40 uppercase tracking-widest group-hover:text-white/60 transition-colors">Usar Textura</span>
                                           <div className="relative">
                                              <input 
                                                type="checkbox" 
                                                checked={brandConfig.id_card_use_texture}
                                                onChange={(e) => setBrandConfig({ ...brandConfig, id_card_use_texture: e.target.checked })}
                                                className="sr-only"
                                              />
                                              <div className={`w-12 h-6 rounded-full transition-colors ${brandConfig.id_card_use_texture ? 'bg-amber-500' : 'bg-white/10'}`} />
                                              <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${brandConfig.id_card_use_texture ? 'translate-x-6' : ''}`} />
                                           </div>
                                        </label>
                                     </div>

                                     <div className="space-y-10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                           <div className="space-y-4">
                                              <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] block pl-1">Nombre de Empresa (Texto)</label>
                                              <input 
                                                 type="text" 
                                                 value={brandConfig.id_card_branding_text}
                                                 onChange={(e) => setBrandConfig({ ...brandConfig, id_card_branding_text: e.target.value })}
                                                 className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all uppercase"
                                              />
                                           </div>
                                           <div className="space-y-4">
                                              <div className="flex justify-between items-center px-1">
                                                 <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Escala Branding</label>
                                                 <span className="text-[10px] font-mono text-amber-400 font-bold">{brandConfig.id_card_branding_scale.toFixed(2)}x</span>
                                              </div>
                                              <input 
                                                 type="range" min="0.5" max="3" step="0.05"
                                                 value={brandConfig.id_card_branding_scale}
                                                 onChange={(e) => setBrandConfig({ ...brandConfig, id_card_branding_scale: parseFloat(e.target.value) })}
                                                 className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-amber-400"
                                              />
                                           </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                           <div className="space-y-3">
                                              <label className="text-[8px] font-black text-white/20 uppercase tracking-widest pl-1">Fondo Banner</label>
                                              <input 
                                                 type="color" 
                                                 value={brandConfig.id_card_banner_color}
                                                 onChange={(e) => setBrandConfig({ ...brandConfig, id_card_banner_color: e.target.value })}
                                                 className="w-full h-12 rounded-xl bg-transparent border-2 border-white/10 cursor-pointer p-0 overflow-hidden"
                                              />
                                           </div>
                                           <div className="space-y-3">
                                              <label className="text-[8px] font-black text-white/20 uppercase tracking-widest pl-1">Color Fuente</label>
                                              <input 
                                                 type="color" 
                                                 value={brandConfig.id_card_branding_font_color}
                                                 onChange={(e) => setBrandConfig({ ...brandConfig, id_card_branding_font_color: e.target.value })}
                                                 className="w-full h-12 rounded-xl bg-transparent border-2 border-white/10 cursor-pointer p-0 overflow-hidden"
                                              />
                                           </div>
                                           <div className="space-y-3">
                                              <label className="text-[8px] font-black text-white/20 uppercase tracking-widest pl-1">Fondo Badge</label>
                                              <input 
                                                 type="color" 
                                                 value={brandConfig.id_card_role_badge_color}
                                                 onChange={(e) => setBrandConfig({ ...brandConfig, id_card_role_badge_color: e.target.value })}
                                                 className="w-full h-12 rounded-xl bg-transparent border-2 border-white/10 cursor-pointer p-0 overflow-hidden"
                                              />
                                           </div>
                                           <div className="space-y-3">
                                              <label className="text-[8px] font-black text-white/20 uppercase tracking-widest pl-1">Fuente Badge</label>
                                              <input 
                                                 type="color" 
                                                 value={brandConfig.id_card_role_font_color}
                                                 onChange={(e) => setBrandConfig({ ...brandConfig, id_card_role_font_color: e.target.value })}
                                                 className="w-full h-12 rounded-xl bg-transparent border-2 border-white/10 cursor-pointer p-0 overflow-hidden"
                                              />
                                           </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                           <div className="space-y-3">
                                              <div className="flex justify-between px-1">
                                                 <label className="text-[8px] font-black text-white/20 uppercase tracking-widest">Banner Altura</label>
                                                 <span className="text-[9px] font-mono text-white/40">{brandConfig.id_card_banner_height}px</span>
                                              </div>
                                              <input 
                                                 type="range" min="80" max="220" step="5"
                                                 value={brandConfig.id_card_banner_height}
                                                 onChange={(e) => setBrandConfig({ ...brandConfig, id_card_banner_height: parseInt(e.target.value) })}
                                                 className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white/20"
                                              />
                                           </div>
                                           <div className="space-y-3">
                                              <div className="flex justify-between px-1">
                                                 <label className="text-[8px] font-black text-white/20 uppercase tracking-widest">Branding X</label>
                                                 <span className="text-[9px] font-mono text-white/40">{brandConfig.id_card_branding_offset_x}px</span>
                                              </div>
                                              <input 
                                                 type="range" min="-100" max="100" step="1"
                                                 value={brandConfig.id_card_branding_offset_x}
                                                 onChange={(e) => setBrandConfig({ ...brandConfig, id_card_branding_offset_x: parseInt(e.target.value) })}
                                                 className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white/20"
                                              />
                                           </div>
                                           <div className="space-y-3">
                                              <div className="flex justify-between px-1">
                                                 <label className="text-[8px] font-black text-white/20 uppercase tracking-widest">Branding Y</label>
                                                 <span className="text-[9px] font-mono text-white/40">{brandConfig.id_card_branding_offset_y}px</span>
                                              </div>
                                              <input 
                                                 type="range" min="-50" max="50" step="1"
                                                 value={brandConfig.id_card_branding_offset_y}
                                                 onChange={(e) => setBrandConfig({ ...brandConfig, id_card_branding_offset_y: parseInt(e.target.value) })}
                                                 className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white/20"
                                              />
                                           </div>
                                           <div className="space-y-3">
                                              <div className="flex justify-between px-1">
                                                 <label className="text-[8px] font-black text-white/20 uppercase tracking-widest">Avatar Escala</label>
                                                 <span className="text-[9px] font-mono text-white/40">{brandConfig.id_card_avatar_scale}x</span>
                                              </div>
                                              <input 
                                                 type="range" min="0.8" max="2.5" step="0.1"
                                                 value={brandConfig.id_card_avatar_scale}
                                                 onChange={(e) => setBrandConfig({ ...brandConfig, id_card_avatar_scale: parseFloat(e.target.value) })}
                                                 className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white/20"
                                              />
                                           </div>
                                        </div>
                                     </div>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                   )}
                </motion.div>
              )}
'''

# Construct the new lines
new_lines = [line + '\n' for line in new_content.split('\n')]

# Perform replacement
final_lines = lines[:start_idx] + new_lines + lines[end_idx:]

with open(filepath, 'w', encoding='utf-8') as f:
    f.writelines(final_lines)

print("Success")
