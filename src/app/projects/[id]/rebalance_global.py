import sys
import re

filepath = r'e:\WEBS y APPS Antigravity\video-production-platform\next_app\src\app\projects\[id]\page.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Balanced Global Content
balanced_global = r'''{brandingInnerTab === 'global' && (
                      <div className="space-y-12">
                        {/* CORPORATE IDENTITY CONTROLS (Moved from Config) */}
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
                                             <img src={brandConfig.agency_logo} className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500" />
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
                                             <img src={brandConfig.client_logo} className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500" />
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
                                          <div className="relative group">
                                             <input 
                                                type="color" 
                                                value={brandConfig.brand_color}
                                                onChange={(e) => setBrandConfig({ ...brandConfig, brand_color: e.target.value })}
                                                className="w-16 h-16 rounded-[1.8rem] border-none p-0 bg-transparent cursor-pointer shadow-xl appearance-none ring-1 ring-gray-100"
                                             />
                                          </div>
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
                    )}'''

# 2. Add missing closing tags to overview block
# We found 11 unclosed divs in overview.
# I'll manually find where they should close.

# Actually, I'll just replace the entire faulty sections with a fixed version.

pattern_global = re.compile(r'\{brandingInnerTab === \'global\' && \(.*?\)\}', re.DOTALL)
content = pattern_global.sub(balanced_global, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Success")
