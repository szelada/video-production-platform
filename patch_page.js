const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/projects/[id]/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const anchor = 'TIP: Estos cambios sirven de plantilla para las credenciales de este proyecto. El branding se sincroniza con los ajustes generales.';
const snippet = `

                             {/* ADVANCED CUSTOMIZATION PRO */}
                             <div className="bg-gray-900 rounded-[3rem] p-10 space-y-8 shadow-2xl">
                                <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                                   <div className="p-3 bg-white/5 text-amber-400 rounded-xl">
                                     <Sparkles size={20} />
                                   </div>
                                   <h4 className="text-sm font-black text-white uppercase tracking-widest">Personalización Pro</h4>
                                </div>

                                <div className="space-y-8">
                                   {/* BANNER UPLOAD */}
                                   <div className="space-y-4">
                                      <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] block pl-1">Banner Superior (Fondo)</label>
                                      <div className="flex items-center gap-6">
                                         <div 
                                           onClick={() => idCardBannerRef.current?.click()}
                                           className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-all overflow-hidden"
                                         >
                                            {brandConfig.id_card_banner_url ? (
                                              <img src={brandConfig.id_card_banner_url} className="w-full h-full object-cover" alt="Banner" />
                                            ) : (
                                              <Camera size={24} className="text-white/20" />
                                            )}
                                         </div>
                                         <div className="flex-1 space-y-2">
                                            <button 
                                              onClick={() => idCardBannerRef.current?.click()}
                                              className="px-6 py-3 bg-white text-black rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
                                            >
                                              Subir Imagen
                                            </button>
                                            <p className="text-[8px] text-white/20 uppercase font-bold">1200x400 recomendado</p>
                                         </div>
                                         <input type="file" ref={idCardBannerRef} className="hidden" onChange={(e) => {
                                           const file = e.target.files?.[0];
                                           if (file) {
                                             const reader = new FileReader();
                                             reader.onload = (re) => setBrandConfig({ ...brandConfig, id_card_banner_url: re.target?.result as string });
                                             reader.readAsDataURL(file);
                                           }
                                         }} />
                                      </div>
                                   </div>

                                   {/* RANGE CONTROLS */}
                                   <div className="grid grid-cols-2 gap-8">
                                      <div className="space-y-4">
                                         <div className="flex justify-between items-center px-1">
                                            <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Altura Banner</label>
                                            <span className="text-[10px] font-mono text-amber-400 font-bold">{brandConfig.id_card_banner_height}px</span>
                                         </div>
                                         <input 
                                           type="range" 
                                           min="80" 
                                           max="220" 
                                           step="5"
                                           value={brandConfig.id_card_banner_height}
                                           onChange={(e) => setBrandConfig({ ...brandConfig, id_card_banner_height: parseInt(e.target.value) })}
                                           className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-amber-400"
                                         />
                                      </div>
                                      <div className="space-y-4">
                                         <div className="flex justify-between items-center px-1">
                                            <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Tamaño Logo</label>
                                            <span className="text-[10px] font-mono text-amber-400 font-bold">{brandConfig.id_card_logo_size}px</span>
                                         </div>
                                         <input 
                                           type="range" 
                                           min="25" 
                                           max="60" 
                                           step="1"
                                           value={brandConfig.id_card_logo_size}
                                           onChange={(e) => setBrandConfig({ ...brandConfig, id_card_logo_size: parseInt(e.target.value) })}
                                           className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-amber-400"
                                         />
                                      </div>
                                   </div>

                                   {/* ACCENT COLOR */}
                                   <div className="space-y-4">
                                      <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] block pl-1">Color de Acento (Línea)</label>
                                      <div className="flex flex-wrap gap-4">
                                         {[brandConfig.brand_color, '#ffffff', '#fbbf24', '#f87171', '#34d399', '#60a5fa'].map((c, i) => (
                                           <button 
                                             key={i}
                                             type="button"
                                             onClick={() => setBrandConfig({ ...brandConfig, id_card_accent_color: c })}
                                             className={'w-10 h-10 rounded-full border-2 transition-all ' + (brandConfig.id_card_accent_color === c ? 'border-amber-400 scale-110 shadow-lg shadow-amber-400/20' : 'border-white/5 hover:scale-110')}
                                             style={{ backgroundColor: c }}
                                           />
                                         ))}
                                         <input 
                                           type="color" 
                                           value={brandConfig.id_card_accent_color}
                                           onChange={(e) => setBrandConfig({ ...brandConfig, id_card_accent_color: e.target.value })}
                                           className="w-10 h-10 rounded-full border-2 border-white/10 bg-transparent cursor-pointer p-0 overflow-hidden appearance-none"
                                         />
                                      </div>
                                   </div>
                                </div>
                             </div>`;

if (content.includes(anchor) && !content.includes('ADVANCED CUSTOMIZATION PRO')) {
    const searchString = '</p>\r\n                             </div>';
    const index = content.indexOf(anchor);
    const endIndex = content.indexOf(searchString, index) + searchString.length;
    
    if (index !== -1 && endIndex !== -1) {
        const newContent = content.slice(0, endIndex) + snippet + content.slice(endIndex);
        fs.writeFileSync(filePath, newContent);
        console.log('Successfully patched!');
    } else {
        const searchString2 = '</p>\n                             </div>';
        const endIndex2 = content.indexOf(searchString2, index) + searchString2.length;
        if (index !== -1 && endIndex2 !== -1) {
            const newContent = content.slice(0, endIndex2) + snippet + content.slice(endIndex2);
            fs.writeFileSync(filePath, newContent);
            console.log('Successfully patched (LF)!');
        } else {
            console.log('Target block not found precisely.');
        }
    }
} else {
    console.log('Anchor not found or already patched.');
}
