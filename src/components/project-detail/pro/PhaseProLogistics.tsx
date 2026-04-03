'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, ClipboardCheck, FileText, Package, Truck, DollarSign, 
  Wallet, Briefcase, Plus, ChevronRight, Users, Trash2, Info, 
  Calendar, Map as LucideMap, RefreshCw, ZoomIn,
  TrendingDown, CheckSquare, UserMinus
} from 'lucide-react';
import { Map, Marker } from "pigeon-maps";

interface PhaseProLogisticsProps {
  logisticsSubTab: string;
  setLogisticsSubTab: (tab: any) => void;
  locations: any[];
  locationsViewMode: 'grid' | 'map';
  setLocationsViewMode: (mode: 'grid' | 'map') => void;
  setIsAddLocationModalOpen: (open: boolean) => void;
  scoutingReports: any[];
  setIsLocationTerminalOpen: (open: boolean) => void;
  setIsAddScoutingReportModalOpen: (open: boolean) => void;
  setSelectedScoutingReport: (report: any) => void;
  setIsScoutingDetailModalOpen: (open: boolean) => void;
  callSheets: any[];
  setIsAddCallSheetModalOpen: (open: boolean) => void;
  setSelectedCallSheet: (sheet: any) => void;
  setIsCallSheetEditorOpen: (open: boolean) => void;
  fetchCallSheetDetails: (id: string) => void;
  artItems: any[];
  setIsArtTerminalOpen: (open: boolean) => void;
  handleDeleteArtItem: (id: string) => void;
  projectSuppliers: any[];
  handleRemoveSupplier: (id: string) => void;
  setIsAddSupplierModalOpen: (open: boolean) => void;
  transportRequests: any[];
  setIsAddTransportModalOpen: (open: boolean) => void;
  setSelectedTransportRequest: (req: any) => void;
  setIsAssignTransportModalOpen: (open: boolean) => void;
  cateringOrders: any[];
  setIsAddCateringModalOpen: (open: boolean) => void;
  budgetSummary: any[];
  expenses: any[];
  setIsAddBudgetModalOpen: (open: boolean) => void;
  setIsAddExpenseModalOpen: (open: boolean) => void;
}

export const PhaseProLogistics: React.FC<PhaseProLogisticsProps> = ({
  logisticsSubTab,
  setLogisticsSubTab,
  locations,
  locationsViewMode,
  setLocationsViewMode,
  setIsAddLocationModalOpen,
  scoutingReports,
  setIsLocationTerminalOpen,
  setIsAddScoutingReportModalOpen,
  setSelectedScoutingReport,
  setIsScoutingDetailModalOpen,
  callSheets,
  setIsAddCallSheetModalOpen,
  setSelectedCallSheet,
  setIsCallSheetEditorOpen,
  fetchCallSheetDetails,
  artItems,
  setIsArtTerminalOpen,
  handleDeleteArtItem,
  projectSuppliers,
  handleRemoveSupplier,
  setIsAddSupplierModalOpen,
  transportRequests,
  setIsAddTransportModalOpen,
  setSelectedTransportRequest,
  setIsAssignTransportModalOpen,
  cateringOrders,
  setIsAddCateringModalOpen,
  budgetSummary,
  expenses,
  setIsAddBudgetModalOpen,
  setIsAddExpenseModalOpen
}) => {
  return (
    <motion.div
      key="logistics"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8"
    >
      {/* Logistics Sub-Navigation */}
      <div className="flex border-b border-gray-100 gap-8 overflow-x-auto pb-px scrollbar-hide">
        {[
          { id: 'locations', label: 'Locaciones', icon: <MapPin size={14} /> },
          { id: 'scouting', label: 'Avanzada', icon: <ClipboardCheck size={14} /> },
          { id: 'call_sheets', label: 'Call Sheets', icon: <FileText size={14} /> },
          { id: 'art', label: 'Arte/Utilería', icon: <Package size={14} /> },
          { id: 'transport', label: 'Transporte', icon: <Truck size={14} /> },
          { id: 'catering', label: 'Catering', icon: <DollarSign size={14} /> },
          { id: 'budget', label: 'Finanzas', icon: <Wallet size={14} /> },
          { id: 'suppliers', label: 'Proveedores', icon: <Briefcase size={14} /> }
        ].map((sub) => (
          <button
            key={sub.id}
            onClick={() => setLogisticsSubTab(sub.id as any)}
            className={`flex items-center gap-2 pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${logisticsSubTab === sub.id ? 'text-gray-900' : 'text-gray-500 hover:text-gray-600'
              }`}
          >
            {sub.icon}
            {sub.label}
            {logisticsSubTab === sub.id && (
              <motion.div layoutId="logistics-active-sub" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            )}
          </button>
        ))}
      </div>

      {logisticsSubTab === 'locations' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Locaciones</h2>
              <p className="text-sm text-gray-500">Espacios y sets de filmación asignados</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex p-1 bg-gray-50 border border-gray-100 rounded-xl">
                <button
                  onClick={() => setLocationsViewMode('grid')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${locationsViewMode === 'grid' ? 'bg-white text-black' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setLocationsViewMode('map')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${locationsViewMode === 'map' ? 'bg-white text-black' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  Mapa
                </button>
              </div>
              <button
                onClick={() => setIsAddLocationModalOpen(true)}
                className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-neutral-200 transition-colors"
              >
                <Plus size={16} /> Nueva Locación
              </button>
            </div>
          </div>

          {locationsViewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {locations.length > 0 ? locations.map((loc: any) => (
                <div key={loc.id} className="bg-white shadow-sm group relative flex flex-col rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="aspect-video bg-white/[0.03] relative overflow-hidden">
                    {loc.main_photo_url || loc.location_photos?.length > 0 ? (
                      <img
                        src={loc.main_photo_url || loc.location_photos?.[0]?.file_url}
                        alt={loc.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-300 placeholder-icon">
                        <MapPin size={48} strokeWidth={1} />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="text-[10px] font-black px-2 py-1 rounded bg-white/90 backdrop-blur-md border border-gray-100 text-gray-900 uppercase tracking-widest">
                        {loc.status || 'NEW'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-900">{loc.name}</h3>
                        <span className="text-[10px] text-blue-400 font-bold uppercase">{loc.type}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <MapPin size={12} className="text-gray-400" />
                        <span>{loc.city}, {loc.address}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 italic">"{loc.notes || 'Sin notas adicionales.'}"</p>
                  </div>
                </div>
              )) : (
                <div className="col-span-full p-20 bg-white shadow-sm rounded-2xl border border-gray-100 border-dashed flex flex-col items-center justify-center gap-4 text-center">
                  <span className="p-4 rounded-full bg-gray-50 text-gray-400"><MapPin size={32} /></span>
                  <p className="text-gray-500 max-w-xs">No hay locaciones registradas. Agrega el primer set de rodaje.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-[600px] bg-white shadow-sm rounded-3xl border border-gray-100 overflow-hidden relative">
              <Map
                height={600}
                defaultCenter={(() => {
                  const locWithCoords = locations.find(l => l.latitude && l.longitude);
                  return locWithCoords ? [parseFloat(locWithCoords.latitude), parseFloat(locWithCoords.longitude)] : [-12.046374, -77.042793];
                })()}
                defaultZoom={13}
              >
                {locations.filter(l => l.latitude && l.longitude).map(loc => (
                  <Marker
                    key={loc.id}
                    width={40}
                    anchor={[parseFloat(loc.latitude), parseFloat(loc.longitude)]}
                    color="#ffffff"
                    onClick={() => alert(`${loc.name}\n${loc.address}`)}
                  />
                ))}
                <ZoomIn />
              </Map>
            </div>
          )}
        </div>
      )}

      {logisticsSubTab === 'scouting' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Reportes de Avanzada</h2>
              <p className="text-sm text-gray-500">Informes de campo y registros de scouting</p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsLocationTerminalOpen(true)}
                className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-100 px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-100 transition-all shadow-sm"
              >
                <MapPin size={16} /> Modo Terminal
              </button>
              <button
                onClick={() => setIsAddScoutingReportModalOpen(true)}
                className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-md"
              >
                <Plus size={16} /> Enviar Reporte
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scoutingReports.length > 0 ? scoutingReports.map((report: any) => (
              <div
                key={report.id}
                className="bg-white shadow-sm p-6 rounded-2xl border border-gray-100 space-y-4 cursor-pointer hover:border-gray-200 transition-all"
                onClick={() => {
                  setSelectedScoutingReport(report);
                  setIsScoutingDetailModalOpen(true);
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                      {report.profiles?.avatar_url ? (
                        <img src={report.profiles.avatar_url} className="w-full h-full object-cover" />
                      ) : (
                        <Users size={18} className="text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{report.profiles?.full_name || 'Asistente'}</p>
                      <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">
                        {report.created_at ? new Date(report.created_at).toLocaleDateString() : 'Pendiente'} • {report.scouting_type || 'General'}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 italic line-clamp-2">"{report.notes || 'Sin observaciones'}"</p>
              </div>
            )) : (
              <div className="col-span-full py-12 bg-white shadow-sm rounded-2xl border border-gray-100 border-dashed flex flex-col items-center justify-center gap-4 text-center">
                <ClipboardCheck size={32} className="text-gray-300" />
                <p className="text-sm text-gray-500">No hay reportes de avanzada aún.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {logisticsSubTab === 'call_sheets' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Call Sheets</h2>
              <p className="text-sm text-gray-500">Hojas de llamado y cronogramas diarios de rodaje</p>
            </div>
            <button
              onClick={() => setIsAddCallSheetModalOpen(true)}
              className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-neutral-200 transition-colors"
            >
              <Plus size={16} /> Crear Call Sheet
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {callSheets.length > 0 ? callSheets.map((sheet: any) => (
              <div key={sheet.id} className="bg-white shadow-sm border border-gray-100 group relative overflow-hidden rounded-2xl hover:border-gray-200 transition-all">
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${sheet.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'} uppercase tracking-widest`}>
                      {sheet.status}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">#{sheet.id.slice(0, 8)}</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-1">Día de Rodaje</h4>
                  <div className="flex items-center gap-2 text-sm text-blue-400 font-medium">
                    <Calendar size={14} />
                    <span>{new Date(sheet.shoot_date).toLocaleDateString()}</span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCallSheet(sheet);
                      setIsCallSheetEditorOpen(true);
                      fetchCallSheetDetails(sheet.id);
                    }}
                    className="w-full mt-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-900 transition-all flex items-center justify-center gap-2"
                  >
                    Ver Detalles <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )) : (
              <div className="col-span-full p-20 bg-white shadow-sm rounded-2xl border border-gray-100 border-dashed flex flex-col items-center justify-center gap-4 text-center">
                <FileText size={32} className="text-gray-400" />
                <p className="text-gray-500 max-w-xs">No hay hojas de llamado creadas.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {logisticsSubTab === 'art' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Arte & Utilería</h2>
              <p className="text-sm text-gray-500">Gestión de recursos estéticos y utilería de producción</p>
            </div>
            <button
              onClick={() => setIsArtTerminalOpen(true)}
              className="flex items-center gap-2 bg-amber-50 text-amber-700 border border-amber-100 px-4 py-2 rounded-xl text-sm font-bold hover:bg-amber-100 transition-all shadow-sm"
            >
              <Package size={16} /> Modo Terminal
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artItems.length > 0 ? artItems.map((item: any) => (
              <div key={item.id} className="bg-white shadow-sm rounded-3xl border border-gray-100 overflow-hidden group hover:border-gray-200 transition-all flex flex-col">
                <div className="relative aspect-video bg-gray-100 overflow-hidden">
                   {item.art_photos?.[0] ? (
                     <img src={item.art_photos[0].file_url} className="w-full h-full object-cover group-hover:scale-110 transition-all" alt={item.name} />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-gray-300"><Package size={40} /></div>
                   )}
                   <button onClick={() => handleDeleteArtItem(item.id)} className="absolute top-4 right-4 p-2 bg-white/90 text-gray-400 hover:text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all">
                     <Trash2 size={16} />
                   </button>
                </div>
                <div className="p-6 space-y-3 flex-1">
                   <h4 className="text-lg font-bold text-gray-900 leading-tight">{item.name}</h4>
                   <p className="text-xs text-gray-500 line-clamp-2 italic">{item.description}</p>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-24 bg-white shadow-sm rounded-3xl border border-gray-100 border-dashed text-center">
                <Package size={40} className="mx-auto text-gray-300 mb-4" />
                <p className="text-sm font-bold text-gray-600 uppercase tracking-widest">Sin recursos de arte</p>
              </div>
            )}
          </div>
        </div>
      )}

      {logisticsSubTab === 'transport' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Gestión de Transporte</h2>
              <p className="text-sm text-gray-500 italic">Logística de traslados para personal y equipo técnico</p>
            </div>
            <button
              onClick={() => setIsAddTransportModalOpen(true)}
              className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-neutral-200 transition-all shadow-xl"
            >
              <Plus size={16} /> Nueva Solicitud
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {transportRequests.length > 0 ? transportRequests.map((req: any) => (
              <div key={req.id} className="bg-white shadow-sm p-6 rounded-2xl border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-gray-200 transition-all">
                <div className="flex items-center gap-5 min-w-[240px]">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <Truck size={28} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900 uppercase tracking-wider">{req.profiles?.full_name || 'Personal'}</p>
                    <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mt-0.5">{req.vehicle_type}</p>
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-1">
                     <span className="block text-[8px] text-gray-400 uppercase font-black tracking-widest">Recogida</span>
                     <p className="text-xs text-gray-900 font-medium">{req.pickup_location} @ {req.pickup_time.slice(0, 5)}</p>
                   </div>
                   <div className="space-y-1">
                     <span className="block text-[8px] text-gray-400 uppercase font-black tracking-widest">Destino</span>
                     <p className="text-xs text-gray-900 font-medium">{req.dropoff_location}</p>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                   <span className={`text-[9px] font-black px-2.5 py-1 rounded border ${req.status === 'assigned' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'} uppercase`}>
                     {req.status}
                   </span>
                   {req.status === 'pending' && (
                     <button onClick={() => { setSelectedTransportRequest(req); setIsAssignTransportModalOpen(true); }} className="px-4 py-2 bg-gray-50 hover:bg-blue-50 text-[9px] font-black uppercase rounded-xl">ASIGNAR</button>
                   )}
                </div>
              </div>
            )) : (
              <div className="col-span-full py-24 bg-white shadow-sm rounded-2xl border border-gray-100 border-dashed text-center">
                <Truck size={40} className="mx-auto text-gray-300 mb-4" />
                <p className="text-sm font-bold text-gray-600 uppercase tracking-widest">No hay solicitudes</p>
              </div>
            )}
          </div>
        </div>
      )}

      {logisticsSubTab === 'catering' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Gestión de Catering</h2>
              <p className="text-sm text-gray-500 italic">Pedidos de alimentación para los días de rodaje</p>
            </div>
            <button
              onClick={() => setIsAddCateringModalOpen(true)}
              className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-neutral-200 transition-all shadow-xl"
            >
              <Plus size={16} /> Nuevo Pedido
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cateringOrders.length > 0 ? cateringOrders.map((order: any) => (
              <div key={order.id} className="bg-white shadow-sm p-6 rounded-2xl border border-gray-100 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-black text-gray-900 uppercase tracking-wider">{order.meal_type}</p>
                  <p className="text-lg font-black text-gray-900">{order.crew_count} Platos</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar size={12} /> {new Date(order.call_sheets?.shoot_date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                    <Briefcase size={12} /> {order.suppliers?.name || 'Por definir'}
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-24 bg-white shadow-sm rounded-2xl border border-gray-100 border-dashed text-center">
                <DollarSign size={40} className="mx-auto text-gray-300 mb-4" />
                <p className="text-sm font-bold text-gray-600 uppercase tracking-widest">Sin catering</p>
              </div>
            )}
          </div>
        </div>
      )}

      {logisticsSubTab === 'budget' && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Control Financiero</h2>
              <p className="text-sm text-gray-500 italic">Seguimiento de presupuesto vs gastos reales</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setIsAddBudgetModalOpen(true)} className="px-5 py-2.5 rounded-2xl text-xs font-black uppercase bg-indigo-50 text-indigo-600 border border-indigo-100 transition-all">Planificar</button>
              <button onClick={() => setIsAddExpenseModalOpen(true)} className="px-5 py-2.5 rounded-2xl text-xs font-black uppercase bg-emerald-600 text-white shadow-lg transition-all">Registrar Gasto</button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* Simplified budget stats */}
             {[
               { label: 'Presupuesto Total', value: `$${budgetSummary.reduce((sum, b) => sum + Number(b.planned_amount), 0).toLocaleString()}`, icon: Wallet, color: 'text-indigo-600', bg: 'bg-indigo-50' },
               { label: 'Gastado a la Fecha', value: `$${expenses.reduce((sum, e) => sum + Number(e.amount), 0).toLocaleString()}`, icon: TrendingDown, color: 'text-emerald-600', bg: 'bg-emerald-50' },
               { label: 'Saldo Disponible', value: `$${(budgetSummary.reduce((sum, b) => sum + Number(b.planned_amount), 0) - expenses.reduce((sum, e) => sum + Number(e.amount), 0)).toLocaleString()}`, icon: CheckSquare, color: 'text-blue-600', bg: 'bg-blue-50' },
             ].map((stat) => (
               <div key={stat.label} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-3">
                 <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                    <stat.icon size={20} />
                 </div>
                 <p className="text-2xl font-black text-gray-900 tracking-tight">{stat.value}</p>
                 <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{stat.label}</p>
               </div>
             ))}
          </div>
        </div>
      )}

      {logisticsSubTab === 'suppliers' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Proveedores & Servicios</h3>
              <p className="text-sm text-gray-500">Contrataciones externas para producción</p>
            </div>
            <button
              onClick={() => setIsAddSupplierModalOpen(true)}
              className="px-4 py-2 bg-gray-50 text-gray-900 rounded-lg text-sm font-bold hover:bg-gray-100 border border-gray-200 transition-colors"
            >
              Vincular Proveedor
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectSuppliers.length > 0 ? projectSuppliers.map((ps: any) => (
              <div key={ps.id} className="bg-white shadow-sm p-6 rounded-2xl border border-gray-100 group">
                <div className="flex items-start justify-between mb-4">
                   <div>
                     <span className="text-[10px] text-blue-400 uppercase font-black tracking-widest">{ps.suppliers?.category}</span>
                     <h4 className="text-lg font-bold text-gray-900 leading-tight mt-1">{ps.suppliers?.name}</h4>
                   </div>
                   <button onClick={() => handleRemoveSupplier(ps.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                     <UserMinus size={16} />
                   </button>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2 mb-4 italic">"{ps.service_description}"</p>
                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                   <div className="flex items-center gap-1 text-sm font-black text-gray-900"><DollarSign size={14} className="text-gray-400" /> {ps.budgeted_amount.toLocaleString()}</div>
                   <span className="text-[9px] font-black px-2 py-0.5 rounded bg-blue-50 text-blue-500 border border-blue-100 uppercase">{ps.status}</span>
                </div>
              </div>
            )) : (
              <div className="col-span-full p-12 bg-white shadow-sm rounded-2xl border border-gray-100 border-dashed text-center">
                 <Briefcase size={32} className="text-gray-300 mx-auto" />
                 <p className="text-sm text-gray-500 mt-4">No hay proveedores vinculados.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};
