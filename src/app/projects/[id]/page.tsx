'use client';
import React, { useState, useEffect } from 'react';
import KanbanBoard from '@/components/KanbanBoard';
import GanttChart from '@/components/GanttChart';
import CastingTerminal from '@/components/CastingTerminal';
import LocationTerminal from '@/components/LocationTerminal';
import ArtTerminal from '@/components/ArtTerminal';
import AlternateDashboard from '@/components/dashboard/alternate/AlternateDashboard';
import { PhasePre } from '@/components/project-detail/PhasePre';
import { PhasePro } from '@/components/project-detail/PhasePro';
import { PhaseEntrega } from '@/components/project-detail/PhaseEntrega';
import {

  ArrowLeft,
  Settings,
  Users,
  CheckSquare,
  MapPin,
  Calculator,
  Package,
  Plus,
  MoreVertical,
  Loader2,
  Calendar,
  Briefcase,
  UserPlus,
  UserMinus,
  Phone,
  Mail,
  X,
  Truck,
  DollarSign,
  TrendingDown,
  Camera,
  Home,
  Image as ImageIcon,
  Trash2,
  Upload,
  ChevronRight,
  ChevronLeft,
  ClipboardCheck,
  FileText,
  Video,
  Music,
  Download,
  Clock,
  Clipboard as LucideClipboard,
  Map as LucideMap,
  RefreshCw,
  LayoutDashboard,
  Wallet,
  History,
  Maximize2,
  Rocket,
  FolderOpen,
  BarChart3,
  ListChecks,
  TrendingUp,
  Info,
  Link2,
  Sparkles,
  Check,
  QrCode,
  Printer,
  Palette,
  Building2,
  IdCard,
  Globe,
  Monitor,
  CheckCircle2,
  Film
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// UI Components
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StatCard } from '@/components/ui/StatCard';
import imageCompression from 'browser-image-compression';
import { Map, Marker, ZoomControl } from "pigeon-maps";

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([
    { id: 'l1', name: 'Parque Kennedy', type: 'Exterior', status: 'approved', image: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?q=80&w=400', contact: 'Parques Miraflores', price: '$200/día' },
    { id: 'l2', name: 'Café de la Paz', type: 'Interior', status: 'visited', image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=400', contact: 'Admin Café', price: '$150/día' },
    { id: 'l3', name: 'Apartamento Lince', type: 'Interior', status: 'potential', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=400', contact: 'AirBnB S.A.', price: '$100/día' }
  ]);
  const [casting, setCasting] = useState<any[]>([
    { id: 'c1', name: 'Pamela Denise', role: 'Niña 1', status: 'confirmed', age: '10', tags: ['Protagonista', 'Experiencia'], image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400' },
    { id: 'c2', name: 'Rafael Labastida', role: 'Niño 1', status: 'cast', age: '12', tags: ['Deportista', 'Balón'], image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400' },
    { id: 'c3', name: 'Aura Rivera', role: 'Niña 2', status: 'potential', age: '11', tags: ['Teatro'], image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400' }
  ]);
  const [crew, setCrew] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [projectSuppliers, setProjectSuppliers] = useState<any[]>([]);
  const [allSuppliers, setAllSuppliers] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'crew' | 'logistics' | 'tasks' | 'casting' | 'reports' | 'budget'>('overview');
  const [isAlternateView, setIsAlternateView] = useState(false);
  const [taskViewMode, setTaskViewMode] = useState<'kanban' | 'gantt'>('kanban');

  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [editProjectData, setEditProjectData] = useState({
    name: '',
    code: '',
    client_name: '',
    status: 'draft',
    start_date: '',
    end_date: '',
    cover_image: null as File | null
  });
  const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] = useState(false);
  const [isAddCastingModalOpen, setIsAddCastingModalOpen] = useState(false);
  const [isCrewSidebarOpen, setIsCrewSidebarOpen] = useState(false);
  const [selectedCrewMember, setSelectedCrewMember] = useState<any>(null);
  const [selectedCastingProfile, setSelectedCastingProfile] = useState<any>(null);
  const [isCastingGalleryOpen, setIsCastingGalleryOpen] = useState(false);
  const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isAddScoutingReportModalOpen, setIsAddScoutingReportModalOpen] = useState(false);
  const [isAddCallSheetModalOpen, setIsAddCallSheetModalOpen] = useState(false);
  const [isCallSheetEditorOpen, setIsCallSheetEditorOpen] = useState(false);
  const [selectedCallSheet, setSelectedCallSheet] = useState<any>(null);
  const [callSheetCrew, setCallSheetCrew] = useState<any[]>([]);
  const [callSheetSchedule, setCallSheetSchedule] = useState<any[]>([]);

  const [allProfiles, setAllProfiles] = useState<any[]>([]);
  const [allLocations, setAllLocations] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [isScoutingModalOpen, setIsScoutingModalOpen] = useState(false);
  const [scoutingReports, setScoutingReports] = useState<any[]>([]);
  const [callSheets, setCallSheets] = useState<any[]>([]);
  const [isScoutingDetailModalOpen, setIsScoutingDetailModalOpen] = useState(false);
  const [selectedScoutingReport, setSelectedScoutingReport] = useState<any>(null);
  const [isArtTerminalOpen, setIsArtTerminalOpen] = useState(false);
  const [logisticsSubTab, setLogisticsSubTab] = useState<'locations' | 'scouting' | 'call_sheets' | 'suppliers' | 'transport' | 'catering' | 'budget' | 'art'>('locations');
  const [transportRequests, setTransportRequests] = useState<any[]>([]);
  const [cateringOrders, setCateringOrders] = useState<any[]>([]);
  const idCardBannerRef = React.useRef<HTMLInputElement>(null);
  const [reportsData, setReportsData] = useState<any>({
    logistics: null,
    operations: null,
    financial: null
  });
  const [isAddTransportModalOpen, setIsAddTransportModalOpen] = useState(false);
  const [isAddCateringModalOpen, setIsAddCateringModalOpen] = useState(false);
  const [selectedTransportRequest, setSelectedTransportRequest] = useState<any>(null);
  const [isAssignTransportModalOpen, setIsAssignTransportModalOpen] = useState(false);
  const [budgetSummary, setBudgetSummary] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [isAddBudgetModalOpen, setIsAddBudgetModalOpen] = useState(false);
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [isCastingTerminalOpen, setIsCastingTerminalOpen] = useState(false);
  const [isLocationTerminalOpen, setIsLocationTerminalOpen] = useState(false);
  const [artItems, setArtItems] = useState<any[]>([]);
  
  // Production Phases & Sub-tabs
  const [activePhase, setActivePhase] = useState<'pre' | 'pro' | 'entrega'>('pre');
  const [activeSubTab, setActiveSubTab] = useState<string>('resumen');
  const [breakdownFilter, setBreakdownFilter] = useState<string>('Todos');
  
  // Pre-production Materials State
  const [materials, setMaterials] = useState<any[]>([]);


  const [breakdownItems, setBreakdownItems] = useState<any[]>([]);

  
  const [brandConfig, setBrandConfig] = useState({
    agency_name: '916 STUDIO',
    brand_color: '#6366f1',
    secondary_color: '#111827',
    agency_logo: null as string | null,
    client_logo: null as string | null,
    id_card_banner_url: null as string | null,
    id_card_banner_height: 120,
    id_card_logo_size: 40,
    id_card_accent_color: '#6366f1',
    id_card_avatar_scale: 1,
    id_card_avatar_offset_x: 0,
    id_card_avatar_offset_y: 0,
    platform_bg_color: '#ffffff',
    platform_card_color: '#f9fafb',
    platform_font_family: 'Inter',
    id_card_banner_color: '#0097b2',
    id_card_branding_text: 'Tunche Films',
    id_card_branding_font_size: 24,
    id_card_branding_font_color: '#ffffff',
    id_card_branding_scale: 1,
    id_card_branding_offset_x: 0,
    id_card_branding_offset_y: 0,
    id_card_use_texture: false,
    id_card_role_badge_color: '#4ade80',
    id_card_role_font_color: '#166534'
  });

  const [brandingInnerTab, setBrandingInnerTab] = useState<'global' | 'credencial'>('credencial');

  const [scoutingCategory, setScoutingCategory] = useState<'locaciones' | 'casting' | 'equipos' | 'utileria'>('locaciones');
  const [isIdCardModalOpen, setIsIdCardModalOpen] = useState(false);
  const [idCardUser, setIdCardUser] = useState({
    name: 'Marcos Valdivia',
    role: 'HEAD OF SCOUTING',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400',
    id_number: 'ID-916-2024-X',
    agency: '916 STUDIO',
    verified: true
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [activeScriptId, setActiveScriptId] = useState<string>('1');
  const [isMobileIdPreview, setIsMobileIdPreview] = useState(false);

  const handleDeleteMaterial = (id: string) => {
    setMaterials(prev => prev.filter(m => m.id !== id));
    if (activeScriptId === id) {
      const remainingScripts = materials.filter(m => m.type === 'script' && m.id !== id);
      if (remainingScripts.length > 0) setActiveScriptId(remainingScripts[0].id);
    }
  };

  const [analyzingPhase, setAnalyzingPhase] = useState<string>('');

  const handleAIAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    
    const activeScript = materials.find(m => m.id === activeScriptId) || materials[0];
    const name = activeScript?.file_name || 'Nuevo Proyecto';
    
    // Phase 1: Reading
    setAnalyzingPhase('LECTURA DE ARCHIVO...');
    await new Promise(r => setTimeout(r, 800));
    
    // Phase 2: Analyzing
    setAnalyzingPhase('DETECTANDO ESCENAS Y ELEMENTOS...');
    await new Promise(r => setTimeout(r, 1000));
    
    // Phase 3: Finalizing
    setAnalyzingPhase('GENERANDO TABLA DE DESGLOSE...');
    await new Promise(r => setTimeout(r, 1000));

    try {
      // ---------------------------------------------------------
      // REAL AI BACKEND INTEGRATION
      // ---------------------------------------------------------
      const response = await fetch('/api/ai/analyze-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          projectId: id, 
          materialId: activeScriptId,
          scriptName: name
        })
      });

      const result = await response.json();
      
      if (!response.ok) throw new Error(result.error || 'Fallo en el análisis de IA');

      // Update state with real results (now persistent in DB)
      setBreakdownItems(result.data || []);
      setAnalysisComplete(true);
      await logActivity('ai_analysis', `Análisis de IA completado para guion: ${name}`);
      
      // Auto-navigate
      setActiveSubTab('desglose');
    } catch (error: any) {
      console.error('Error in AI analysis:', error);
      alert('Error en el análisis: ' + error.message);
    } finally {
      setIsAnalyzing(false);
      setAnalyzingPhase('');
    }
  };

  const handlePromoteToScouting = async (item: any) => {
    try {
      console.log('Promoting item to scouting:', item);
      
      if (item.category.toLowerCase() === 'casting' || item.category.toLowerCase() === 'personaje') {
        // 1. Create Profile
        const { data: profile, error: pError } = await supabase
          .from('casting_profiles')
          .insert([{ 
            full_name: item.name,
            notes: item.description
          }])
          .select()
          .single();
        
        if (pError) throw pError;

        // 2. Link to Project Status
        const { error: sError } = await supabase
          .from('casting_project_status')
          .insert([{ 
            project_id: id, 
            casting_profile_id: profile.id, 
            status: 'new' 
          }]);
        
        if (sError) throw sError;

      } else if (item.category.toLowerCase() === 'locación' || item.category.toLowerCase() === 'locacion') {
        // 1. Create Location
        const { data: loc, error: lError } = await supabase
          .from('locations')
          .insert([{ 
            name: item.name, 
            description: item.description
          }])
          .select()
          .single();
        
        if (lError) throw lError;

        // 2. Link to Project Status
        const { error: sError } = await supabase
          .from('location_project_status')
          .insert([{ 
            project_id: id, 
            location_id: loc.id, 
            status: 'new' 
          }]);
        
        if (sError) throw sError;

      } else {
        // Assume Art/Prop/Eq
        const { error: artError } = await supabase
          .from('art_items')
          .insert([{
            project_id: id,
            name: item.name,
            category: item.category,
            description: item.description,
            status: 'Búsqueda'
          }]);
        
        if (artError) throw artError;
      }

      // 3. Mark as promoted in DB
      const { error: updateError } = await supabase
        .from('project_breakdown_items')
        .update({ status: 'linked' })
        .eq('id', item.id);
      
      if (updateError) throw updateError;

      // Update local state to show it's promoted
      setBreakdownItems(prev => prev.map(i => 
        i.id === item.id ? { ...i, status: 'linked' } : i
      ));

      await logActivity('scouting_promoted', `Elemento "${item.name}" promocionado a Scouting desde el desglose.`);
      fetchProjectData(id, true);
      
    } catch (error: any) {
      console.error('Error promoting item:', error);
      alert('Error al promover: ' + error.message);
    }
  };

  const handleDeleteBreakdownItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('project_breakdown_items')
        .delete()
        .eq('id', itemId);
      
      if (error) throw error;
      setBreakdownItems(prev => prev.filter(i => i.id !== itemId));
    } catch (error: any) {
      console.error('Error deleting breakdown item:', error);
    }
  };

  const handleAddBreakdownItem = async (newItem: any) => {
    try {
      const { error } = await supabase
        .from('project_breakdown_items')
        .insert([{
          ...newItem,
          project_id: id,
          status: 'pending'
        }]);
      
      if (error) throw error;
      fetchProjectData(id, true);
    } catch (error: any) {
      console.error('Error adding breakdown item:', error);
      alert('Error al añadir elemento: ' + error.message);
    }
  };

  const handleUpdateBreakdownItem = async (itemId: string, updates: any) => {
    try {
      const { error } = await supabase
        .from('project_breakdown_items')
        .update(updates)
        .eq('id', itemId);
      
      if (error) throw error;
      setBreakdownItems(prev => prev.map(i => i.id === itemId ? { ...i, ...updates } : i));
    } catch (error: any) {
      console.error('Error updating breakdown item:', error);
    }
  };

  const handleCreateTaskFromResource = (resource: any, type: 'location' | 'talent' | 'art') => {
    const title = `Scouting: ${resource.name || resource.full_name}`;
    const desc = resource.description || resource.notes || resource.needs || '';
    const area = type === 'location' ? 'Locaciones' : type === 'talent' ? 'Casting' : 'Arte';
    
    setNewTask({
      title,
      description: desc,
      area,
      priority: 'medium',
      assigned_to: '',
      start_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
    });
    setIsAddTaskModalOpen(true);
    setActivePhase('pro');
    setActiveSubTab('tasks');
  };

  const handleDeleteResource = async (resourceId: string, type: 'location' | 'casting' | 'art') => {
    if (!confirm('¿Estás seguro de que deseas eliminar este recurso?')) return;
    try {
      let table = '';
      if (type === 'location') table = 'locations';
      else if (type === 'casting') table = 'casting_profiles';
      else table = 'art_items';

      const { error } = await supabase.from(table).delete().eq('id', resourceId);
      if (error) throw error;
      
      fetchProjectData(id, true);
    } catch (error: any) {
      console.error('Error deleting resource:', error);
    }
  };

  const handleUpdateResource = async (resourceId: string, type: 'location' | 'casting' | 'art', updates: any) => {
    try {
      let table = '';
      if (type === 'location') table = 'locations';
      else if (type === 'casting') table = 'casting_profiles';
      else table = 'art_items';

      const { error } = await supabase.from(table).update(updates).eq('id', resourceId);
      if (error) throw error;
      
      fetchProjectData(id, true);
    } catch (error: any) {
      console.error('Error updating resource:', error);
    }
  };


  const agencyLogoRef = React.useRef<HTMLInputElement>(null);
  const clientLogoRef = React.useRef<HTMLInputElement>(null);
  const scriptInputRef = React.useRef<HTMLInputElement>(null);
  const storyboardInputRef = React.useRef<HTMLInputElement>(null);
  const idCardPhotoRef = React.useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      if (type === 'script') setAnalysisComplete(false);
      
      try {
        // 1. Upload to Storage
        const filePath = `projects/${id}/materials/${type}_${Date.now()}_${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('project-materials')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase.storage
          .from('project-materials')
          .getPublicUrl(filePath);

        // 3. Insert into Database
        const { data: materialData, error: dbError } = await supabase
          .from('project_materials')
          .insert([{
            project_id: id,
            type,
            file_name: file.name,
            file_url: publicUrl,
            version: materials.filter(m => m.type === type).length + 1,
            created_by: userProfile?.id
          }])
          .select()
          .single();

        if (dbError) throw dbError;

        setMaterials(prev => [materialData, ...prev]);
        if (type === 'script') setActiveScriptId(materialData.id);
        
        await logActivity('material_uploaded', `Nuevo material cargado (${type}): ${file.name}`);
      } catch (error: any) {
        console.error('Error uploading file:', error);
        alert('Error al cargar archivo: ' + error.message);
      } finally {
        setIsUploading(false);
      }
    }
  };


  const handleSaveCastingTerminal = async (data: any) => {
    try {
      const { photos, ...profileData } = data;
      // 1. Create Profile
      const { data: newProfile, error: profileError } = await supabase
        .from('casting_profiles')
        .insert([{ ...profileData, project_id: id }])
        .select()
        .single();
      
      if (profileError) throw profileError;

      // 2. Upload Photos (Simplified for now - just logging)
      console.log('Casting photos to upload:', photos);
      // In a real scenario, we'd loop through photos and upload to Supabase Storage
      
      fetchProjectData(id, true);
      await logActivity('casting_added', `Nuevo perfil de casting recaudado: ${profileData.full_name}`);
    } catch (error: any) {
      console.error('Error in casting terminal:', error);
      alert('Error: ' + error.message);
    }
  };

  const handleSaveLocationTerminal = async (data: any) => {
    try {
      const { photos, ...locationData } = data;
      // 1. Create Location
      const { data: newLoc, error: locError } = await supabase
        .from('locations')
        .insert([{ ...locationData, project_id: id }])
        .select()
        .single();

      if (locError) throw locError;

      console.log('Location photos to upload:', photos);
      
      fetchProjectData(id, true);
      await logActivity('location_added', `Nueva locación recaudada: ${locationData.name}`);
    } catch (error: any) {
      console.error('Error in location terminal:', error);
      alert('Error: ' + error.message);
    }
  };




  const [newBudget, setNewBudget] = useState({
    category: 'misc',
    planned_amount: 0
  });
  const [newExpense, setNewExpense] = useState({
    category: 'misc',
    description: '',
    amount: 0,
    expense_date: new Date().toISOString().split('T')[0],
    supplier_id: '',
    related_call_sheet: ''
  });
  const [newTransportRequest, setNewTransportRequest] = useState({
    call_sheet_id: '',
    profile_id: '',
    pickup_location: '',
    dropoff_location: '',
    pickup_time: '08:00',
    vehicle_type: 'pasajeros',
    notes: ''
  });
  const [newTransportAssignment, setNewTransportAssignment] = useState({
    supplier_id: '',
    driver_name: '',
    driver_phone: '',
    vehicle_plate: '',
    cost: 0
  });
  const [newCateringOrder, setNewCateringOrder] = useState({
    call_sheet_id: '',
    supplier_id: '',
    meal_type: 'lunch' as 'breakfast' | 'lunch' | 'dinner' | 'snacks',
    crew_count: 0,
    notes: ''
  });

  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [taskComments, setTaskComments] = useState<any[]>([]);
  const [taskAttachments, setTaskAttachments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isUploadingAttachment, setIsUploadingAttachment] = useState(false);
  const commentsEndRef = React.useRef<HTMLDivElement>(null);

  const [newMember, setNewMember] = useState({ profile_id: '', role_id: '' });
  const [newSupplier, setNewSupplier] = useState({ supplier_id: '', service_description: '', budgeted_amount: 0 });
  const [locationsViewMode, setLocationsViewMode] = useState<'grid' | 'map'>('grid');
  const [newCasting, setNewCasting] = useState({
    full_name: '',
    age_range: '',
    height: '',
    city: '',
    skills: '',
    photos: [] as { file: File, category: string, preview: string }[]
  });
  const [newLocation, setNewLocation] = useState({
    name: '',
    type: 'Interior',
    city: '',
    address: '',
    notes: '',
    description: '',
    owner: '',
    latitude: '',
    longitude: '',
    photos: [] as { file: File, category: string, preview: string }[]
  });
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    start_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    assigned_to: '',
    area: 'producción'
  });
  const [newScoutingReport, setNewScoutingReport] = useState({
    task_id: '',
    scouting_type: 'general',
    notes: '',
    summary: '',
    sun_start: '',
    sun_end: '',
    power_access: '',
    noise_notes: '',
    photos: [] as { id?: number, file: File, preview: string }[]
  });
  const [newCallSheet, setNewCallSheet] = useState({
    shoot_date: new Date().toISOString().split('T')[0],
    location_id: '',
    general_notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProjectData(id);
    fetchInitialData();
  }, [id]);

  useEffect(() => {
    if (selectedTask && commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [taskComments]);

  const fetchInitialData = async () => {
    const [{ data: rolesData }, { data: profilesData }, { data: suppliersData }, { data: locationsData }] = await Promise.all([
      supabase.from('roles').select('*').order('name'),
      supabase.from('profiles').select('*').order('full_name'),
      supabase.from('suppliers').select('*').order('name'),
      supabase.from('locations').select('id, name, location_type, city, main_photo_url').order('name')
    ]);
    if (rolesData) setRoles(rolesData);
    if (profilesData) {
      setProfiles(profilesData);
      setAllProfiles(profilesData);
    }
    if (suppliersData) setAllSuppliers(suppliersData);
    if (locationsData) setAllLocations(locationsData);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (profile) setUserProfile(profile);
    }
  };

  const fetchProjectData = async (projectId: string, silent = false) => {
    if (!silent) setLoading(true);
    try {
      // 1. Fetch Project Details
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (projectError) throw projectError;
      setProject(projectData);

      // 2. Fetch associated items in parallel
      const [tasksRes, castingRes, locationsRes, crewRes, suppliersRes] = await Promise.all([
        supabase.from('tasks')
          .select(`
            *,
            profiles:assigned_to (id, full_name, avatar_url),
            task_comments(id),
            task_attachments(id)
          `)
          .eq('project_id', projectId)
          .order('due_date', { ascending: true }),
        supabase.from('casting_project_status')
          .select(`
            status,
            casting_profiles (*)
          `)
          .eq('project_id', projectId),
        supabase.from('location_project_status')
          .select(`
            status,
            locations (id, name, location_type, address, city, scout_notes, description, main_photo_url)
          `)
          .eq('project_id', projectId),
        fetch(`/api/projects/members?projectId=${projectId}&t=${Date.now()}`, { cache: 'no-store' })
          .then(res => res.ok ? res.json() : Promise.reject('API Error'))
          .then(data => ({ data: Array.isArray(data) ? data : [] }))
          .catch(err => { console.error(err); return { data: [] }; }),
        supabase.from('project_suppliers')
          .select(`
            *,
            suppliers (*)
          `)
          .eq('project_id', projectId)
      ]);

      if (tasksRes.data) setTasks(tasksRes.data);

      // Fetch Casting via Association
      if (castingRes.data) {
        // We need to fetch photos for these profiles too
        const profileIds = castingRes.data.map((c: any) => c.casting_profiles.id);
        const { data: photos } = await supabase
          .from('casting_photos')
          .select('*')
          .in('casting_profile_id', profileIds)
          .order('created_at', { ascending: false });

        const mappedCasting = castingRes.data.map((item: any) => ({
          ...item.casting_profiles,
          status: item.status,
          casting_photos: photos?.filter(p => p.casting_profile_id === item.casting_profiles.id) || []
        }));
        setCasting(mappedCasting);
      }

      // Fetch Locations via Association
      if (locationsRes.data) {
        const locationIds = locationsRes.data.map((l: any) => l.locations.id);
        const { data: photos } = await supabase
          .from('location_photos')
          .select('*')
          .in('location_id', locationIds)
          .order('created_at', { ascending: false });

        const mappedLocations = locationsRes.data.map((item: any) => ({
          ...item.locations,
          status: item.status,
          location_photos: photos?.filter(p => p.location_id === item.locations.id) || []
        }));
        setLocations(mappedLocations);
      }
      if (crewRes.data) {
        setCrew(crewRes.data);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const userInCrew = crewRes.data.find((m: any) => m.profile_id === user.id);
          if (userInCrew) {
            setUserProfile((prev: any) => ({ ...prev, projectRole: userInCrew.roles?.name || 'Staff' }));
          }
        }
      }
      if (suppliersRes.data) setProjectSuppliers(suppliersRes.data);

      // Fetch Recent Activity
      const { data: activityData } = await supabase
        .from('project_activity')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (activityData) setActivities(activityData);

      // Fetch Scouting Reports
      const { data: scoutingData } = await supabase.from('scouting_reports').select('*, profiles(full_name, avatar_url), photos:scouting_report_photos(*)').eq('project_id', id).order('created_at', { ascending: false });
      setScoutingReports(scoutingData || []);

      // Fetch Call Sheets
      const { data: callSheetsData } = await supabase
        .from('call_sheets')
        .select('*, locations(name)')
        .eq('project_id', projectId)
        .order('shoot_date', { ascending: false });
      setCallSheets(callSheetsData || []);
      fetchTransportData(projectId);
      fetchCateringData(projectId);
      fetchBudgetData(projectId);
      fetchArtData(projectId);
      fetchMaterialsData(projectId);
      fetchBreakdownData(projectId);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching project data:', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchBudgetData = async (projectId: string) => {
    try {
      const { data: summaryData } = await supabase
        .from('project_budget_summary')
        .select('*')
        .eq('project_id', projectId);
      setBudgetSummary(summaryData || []);

      const { data: expensesData } = await supabase
        .from('project_expenses')
        .select('*, suppliers(name), call_sheets(shoot_date)')
        .eq('project_id', projectId)
        .order('expense_date', { ascending: false });
      setExpenses(expensesData || []);
    } catch (error) {
      console.error('Error fetching budget data:', error);
    }
  };
  
  const fetchArtData = async (projectId: string) => {
    try {
      const { data, error } = await supabase
        .from('art_items')
        .select('*, art_photos(*)')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.warn('Art items table missing or error:', error.message);
        return;
      }
      setArtItems(data || []);
    } catch (error) {
      console.warn('Error fetching art data:', error);
    }
  };

  const fetchMaterialsData = async (projectId: string) => {
    try {
      const { data, error } = await supabase
        .from('project_materials')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setMaterials(data || []);
      
      // Auto-select latest script
      const latestScript = data?.find(m => m.type === 'script');
      if (latestScript) setActiveScriptId(latestScript.id);
    } catch (error: any) {
      if (error?.code === 'PGRST205') {
        console.warn('Table project_materials not found. Showing empty state.');
        setMaterials([]);
      } else {
        console.error('Error fetching materials:', error);
      }
    }
  };

  const fetchBreakdownData = async (projectId: string) => {
    try {
      const { data, error } = await supabase
        .from('project_breakdown_items')
        .select('*')
        .eq('project_id', projectId)
        .order('scene_number', { ascending: true });
      
      if (error) throw error;
      setBreakdownItems(data || []);
    } catch (error: any) {
      if (error?.code === 'PGRST205') {
        console.warn('Table project_breakdown_items not found. Showing empty state.');
        setBreakdownItems([]);
      } else {
        console.error('Error fetching breakdown data:', error);
      }
    }
  };

  const hasPermission = (action: string): boolean => {
    const role = userProfile?.projectRole?.toLowerCase() || 'staff';
    
    // Admin Studio / Full Access for Management
    if (['admin', 'productor general', 'productor_general', 'productor ejecutivo', 'productor_ejecutivo'].includes(role)) return true;

    switch (action) {
      case 'manage_crew':
        return ['director'].includes(role);
      case 'manage_tasks':
        return [
          'director', 'asistente de dirección', 'asistente_direccion',
          'coordinador de producción', 'coordinador_produccion'
        ].includes(role);
      case 'manage_logistics':
        return [
          'coordinador de producción', 'coordinador_produccion',
          'asistente de producción', 'asistente_produccion'
        ].includes(role);
      case 'manage_casting':
        return ['casting', 'director'].includes(role);
      case 'view_finances':
        return ['contabilidad'].includes(role);
      case 'edit_project':
        return ['admin', 'productor general', 'productor_general'].includes(role);
      default:
        return false;
    }
  };

  const handleCreateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('project_budgets')
        .insert([{
          project_id: id,
          ...newBudget
        }]);
      if (error) throw error;
      setIsAddBudgetModalOpen(false);
      fetchBudgetData(id);
      logActivity('budget_created', `Se definió presupuesto para ${newBudget.category}: $${newBudget.planned_amount}`);
    } catch (error) {
      console.error('Error creating budget:', error);
      alert('Error al crear presupuesto');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('project_expenses')
        .insert([{
          project_id: id,
          ...newExpense,
          supplier_id: newExpense.supplier_id || null,
          related_call_sheet: newExpense.related_call_sheet || null
        }]);
      if (error) throw error;
      setIsAddExpenseModalOpen(false);
      fetchBudgetData(id);
      logActivity('expense_created', `Gasto registrado: ${newExpense.description} por $${newExpense.amount}`);
    } catch (error) {
      console.error('Error creating expense:', error);
      alert('Error al registrar gasto');
    } finally {
      setIsSubmitting(false);
    }
  }; const handleExportPDF = async (callSheet: any) => {
    try {
      const response = await fetch(`/api/projects/${id}/call-sheet/${callSheet.id}/pdf`);
      if (!response.ok) throw new Error('Error al generar PDF');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CallSheet_${project?.name || 'Project'}_${callSheet.shoot_date}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      await logActivity('call_sheet_exported', `Call Sheet del ${callSheet.shoot_date} exportada a PDF.`);
    } catch (error) {
      console.error('Export Error:', error);
      alert('Error al exportar el Call Sheet. Por favor, inténtalo de nuevo.');
    }
  };

  const handleExportScoutingPDF = async (report: any) => {
    try {
      const response = await fetch(`/api/reports/scouting/pdf?reportId=${report.id}`);
      if (!response.ok) throw new Error('Error al generar PDF');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ScoutingReport_${project?.name || 'Project'}_${new Date(report.created_at).toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      await logActivity('scouting_exported', `Reporte de avanzada (${report.scouting_type}) exportado a PDF.`);
    } catch (error) {
      console.error('Export Error:', error);
      alert('Error al exportar el reporte de avanzada. Por favor, inténtalo de nuevo.');
    }
  };

  const fetchTaskDetails = async (taskId: string) => {
    // Fetch Comments
    const { data: comments } = await supabase
      .from('task_comments')
      .select('*, profiles(full_name, avatar_url)')
      .eq('task_id', taskId)
      .order('created_at', { ascending: true });

    setTaskComments(comments || []);

    // Fetch Attachments
    const { data: attachments } = await supabase
      .from('task_attachments')
      .select('*, profiles(full_name)')
      .eq('task_id', taskId)
      .order('created_at', { ascending: false });

    setTaskAttachments(attachments || []);
  };

  const fetchReportsData = async () => {
    try {
      const [{ data: logistics }, { data: operations }, { data: financial }] = await Promise.all([
        supabase.from('project_logistics_summary').select('*').eq('project_id', id).single(),
        supabase.from('project_operations_summary').select('*').eq('project_id', id).single(),
        supabase.from('project_financial_summary').select('*').eq('project_id', id).single(),
      ]);
      setReportsData({ logistics, operations, financial });
    } catch (error) {
      console.error('Error fetching reports data:', error);
    }
  };

  const logActivity = async (action: string, description: string) => {
    try {
      await supabase.from('project_activity').insert([{
        project_id: id,
        action,
        description,
        created_at: new Date().toISOString()
      }]);
      // Optional: Refresh activities after logging
      const { data } = await supabase
        .from('project_activity')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: false })
        .limit(10);
      if (data) setActivities(data);
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedTask) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('task_comments')
        .insert([{
          task_id: selectedTask.id,
          author_id: user.id,
          comment: newComment.trim()
        }]);

      if (error) throw error;

      setNewComment('');
      fetchTaskDetails(selectedTask.id);
      logActivity('task_comment_added', `Se añadió un comentario a la tarea: ${selectedTask.title}`);
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Error al añadir comentario');
    }
  };

  const handleUploadAttachment = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedTask) return;

    setIsUploadingAttachment(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `tasks/${selectedTask.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('project_media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('project_media')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('task_attachments')
        .insert([{
          task_id: selectedTask.id,
          file_url: publicUrl,
          uploaded_by: user.id
        }]);

      if (dbError) throw dbError;

      fetchTaskDetails(selectedTask.id);
      logActivity('task_attachment_added', `Se subió un archivo a la tarea: ${selectedTask.title}`);
    } catch (error) {
      console.error('Error uploading attachment:', error);
      alert('Error al subir archivo');
    } finally {
      setIsUploadingAttachment(false);
    }
  };

  const getFileIcon = (url: string) => {
    const ext = url.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) return <ImageIcon size={16} />;
    if (['mp4', 'mov', 'webm'].includes(ext || '')) return <Video size={16} />;
    if (['mp3', 'wav'].includes(ext || '')) return <Music size={16} />;
    return <FileText size={16} />;
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('¿Eliminar este comentario?')) return;
    try {
      const { error } = await supabase.from('task_comments').delete().eq('id', commentId);
      if (error) throw error;
      setTaskComments(taskComments.filter(c => c.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleDeleteAttachment = async (attachment: any) => {
    if (!confirm('¿Eliminar este archivo?')) return;
    try {
      // 1. Delete from storage
      const filePath = attachment.file_url.split('/project_media/').pop();
      if (filePath) {
        await supabase.storage.from('project_media').remove([filePath]);
      }
      // 2. Delete from DB
      const { error } = await supabase.from('task_attachments').delete().eq('id', attachment.id);
      if (error) throw error;
      setTaskAttachments(taskAttachments.filter(a => a.id !== attachment.id));
    } catch (error) {
      console.error('Error deleting attachment:', error);
    }
  };


  const handleEditProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let cover_image_url = project?.cover_image_url;
      if (editProjectData.cover_image) {
        const fileExt = editProjectData.cover_image.name.split('.').pop();
        const fileName = `${id}_cover_${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('project_media')
          .upload(`projects/${id}/${fileName}`, editProjectData.cover_image, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('project_media')
          .getPublicUrl(`projects/${id}/${fileName}`);

        cover_image_url = publicUrl;
      }

      const { error } = await supabase
        .from('projects')
        .update({
          name: editProjectData.name,
          client_name: editProjectData.client_name,
          status: editProjectData.status,
          start_date: editProjectData.start_date || null,
          cover_image_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      setIsEditProjectModalOpen(false);
      fetchProjectData(id);
    } catch (err: any) {
      console.error('Error updating project:', err);
      alert('Error al actualizar el proyecto: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditProject = () => {
    setEditProjectData({
      name: project?.name || '',
      code: project?.code || '',
      client_name: project?.client_name || '',
      status: project?.status || 'draft',
      start_date: project?.start_date || '',
      end_date: project?.end_date || '',
      cover_image: null
    });
    setIsEditProjectModalOpen(true);
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.profile_id || !newMember.role_id) {
      alert('Por favor selecciona un perfil y un rol (algunos campos pueden estar ocultos si no haces scroll).');
      return;
    }

    setIsSubmitting(true);
    try {
      // Ensure role_id is passed as the correct type (number if necessary, but string usually works for Supabase if it's text-like)
      // Based on our check, roles.id IS numeric, so we might need to parse it
      const numericRoleId = parseInt(newMember.role_id);

      const response = await fetch('/api/projects/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: id,
          profile_id: newMember.profile_id,
          role_id: isNaN(numericRoleId) ? newMember.role_id : numericRoleId
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Error al añadir miembro');

      const memberProfile = profiles.find(p => p.id === newMember.profile_id);
      await logActivity('crew_member_added', `Se añadió a ${memberProfile?.full_name || 'un nuevo miembro'} al equipo.`);

      setIsAddMemberModalOpen(false);
      setNewMember({ profile_id: '', role_id: '' });
      fetchProjectData(id); // Refresh list
    } catch (error: any) {
      console.error('Error adding member:', error);
      alert('Error al añadir miembro: ' + (error.message || 'Error desconocido'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este miembro del equipo?')) return;

    try {
      const { error } = await supabase
        .from('project_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;
      const member = crew.find(m => m.id === memberId);
      await logActivity('crew_member_removed', `Se eliminó a ${member?.profiles?.full_name || 'un miembro'} del equipo.`);
      fetchProjectData(id);
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  const handleUpdateMemberRole = async (memberId: string, newRoleId: string) => {
    try {
      const numericRoleId = parseInt(newRoleId);
      const { error } = await supabase
        .from('project_members')
        .update({ role_id: isNaN(numericRoleId) ? newRoleId : numericRoleId })
        .eq('id', memberId);
      if (error) throw error;
      
      const member = crew.find(m => m.id === memberId);
      await logActivity('crew_updated', `Se actualizó el rol de ${member?.profiles?.full_name || 'un miembro'}.`);
      fetchProjectData(id);
      setIsCrewSidebarOpen(false);
    } catch (error: any) {
      console.error('Error updating member role:', error);
      alert('Error: ' + error.message);
    }
  };
  const handleAddSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupplier.supplier_id) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('project_suppliers')
        .insert([{
          project_id: id,
          supplier_id: newSupplier.supplier_id,
          service_description: newSupplier.service_description,
          budgeted_amount: newSupplier.budgeted_amount
        }]);

      if (error) throw error;

      setIsAddSupplierModalOpen(false);
      setNewSupplier({ supplier_id: '', service_description: '', budgeted_amount: 0 });
      fetchProjectData(id);
    } catch (error) {
      console.error('Error adding supplier:', error);
      alert('Error al añadir proveedor al proyecto');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveSupplier = async (supplierId: string) => {
    if (!confirm('¿Estás seguro de que deseas desvincular este proveedor?')) return;

    try {
      const { error } = await supabase
        .from('project_suppliers')
        .delete()
        .eq('id', supplierId);

      if (error) throw error;
      const ps = projectSuppliers.find(p => p.id === supplierId);
      await logActivity('supplier_removed', `Se desvinculó al proveedor ${ps?.suppliers?.name || 'desconocido'}.`);
      fetchProjectData(id);
    } catch (error) {
      console.error('Error removing supplier:', error);
    }
  };


  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('tasks')
        .insert([{
          ...newTask,
          assigned_to: newTask.assigned_to === '' ? null : newTask.assigned_to,
          project_id: id,
          status: 'pending'
        }]);

      if (error) throw error;

      await logActivity('task_created', `Nueva tarea creada: ${newTask.title}`);

      setIsAddTaskModalOpen(false);
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        start_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        assigned_to: '',
        area: 'producción'
      });
      fetchProjectData(id);
    } catch (error: any) {
      console.error('Error adding task:', error);
      alert('Error al crear tarea: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveArtTerminal = async (data: any) => {
    try {
      const { photos, ...artData } = data;
      setIsSubmitting(true);

      // 1. Create Art Item
      const { data: newItem, error: itemError } = await supabase
        .from('art_items')
        .insert([{ ...artData, project_id: id }])
        .select()
        .single();

      if (itemError) throw itemError;

      // 2. Upload Photos
      if (photos && photos.length > 0) {
        const photoPromises = photos.map(async (file: File, index: number) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${newItem.id}_${index}_${Date.now()}.${fileExt}`;
          const filePath = `art/${fileName}`;
          const url = await uploadFile(file, filePath);
          
          return supabase
            .from('art_photos')
            .insert([{ art_item_id: newItem.id, file_url: url }]);
        });
        await Promise.all(photoPromises);
      }

      setIsArtTerminalOpen(false);
      fetchArtData(id);
      await logActivity('art_item_added', `Nuevo objeto de arte registrado: ${artData.name}`);
    } catch (error: any) {
      console.error('Error in art terminal:', error);
      alert('Error: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteArtItem = async (itemId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este objeto de arte?')) return;
    try {
      const { error } = await supabase.from('art_items').delete().eq('id', itemId);
      if (error) throw error;
      fetchArtData(id);
      await logActivity('art_item_removed', 'Se eliminó un objeto de arte.');
    } catch (error) {
      console.error('Error deleting art item:', error);
    }
  };

  const handleCreateCallSheet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCallSheet.shoot_date) return;
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('call_sheets')
        .insert([{
          project_id: id,
          shoot_date: newCallSheet.shoot_date,
          location_id: newCallSheet.location_id || null,
          general_notes: newCallSheet.general_notes,
          status: 'draft'
        }])
        .select()
        .single();

      if (error) throw error;

      await logActivity('call_sheet_created', `Nueva hoja de llamado creada para el día: ${newCallSheet.shoot_date}`);

      setIsAddCallSheetModalOpen(false);
      setNewCallSheet({
        shoot_date: new Date().toISOString().split('T')[0],
        location_id: '',
        general_notes: ''
      });
      fetchProjectData(id);
    } catch (error: any) {
      console.error('Error creating call sheet:', error);
      alert('Error: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchCallSheetDetails = async (sheetId: string) => {
    const [{ data: crewData }, { data: scheduleData }] = await Promise.all([
      supabase.from('call_sheet_crew').select('*, profiles(full_name, avatar_url)').eq('call_sheet_id', sheetId).order('call_time'),
      supabase.from('call_sheet_schedule').select('*').eq('call_sheet_id', sheetId).order('time_start')
    ]);
    setCallSheetCrew(crewData || []);
    setCallSheetSchedule(scheduleData || []);
  };

  const handleAddCrewToCallSheet = async (profileId: string) => {
    if (!selectedCallSheet) return;
    try {
      const { error } = await supabase
        .from('call_sheet_crew')
        .insert([{
          call_sheet_id: selectedCallSheet.id,
          profile_id: profileId,
          call_time: '08:00:00'
        }]);
      if (error) throw error;
      fetchCallSheetDetails(selectedCallSheet.id);
    } catch (error: any) {
      console.error('Error adding crew to call sheet:', error);
      alert('Error: ' + error.message);
    }
  };

  const handleRemoveCrewFromCallSheet = async (crewId: string) => {
    try {
      const { error } = await supabase
        .from('call_sheet_crew')
        .delete()
        .eq('id', crewId);
      if (error) throw error;
      fetchCallSheetDetails(selectedCallSheet.id);
    } catch (error: any) {
      console.error('Error removing crew from call sheet:', error);
    }
  };

  const handleAddScheduleBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCallSheet) return;
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    try {
      const { error } = await supabase
        .from('call_sheet_schedule')
        .insert([{
          call_sheet_id: selectedCallSheet.id,
          scene: formData.get('scene'),
          description: formData.get('description'),
          time_start: formData.get('time_start'),
          time_end: formData.get('time_end'),
          is_break: formData.get('is_break') === 'on'
        }]);
      if (error) throw error;
      form.reset();
      fetchCallSheetDetails(selectedCallSheet.id);
    } catch (error: any) {
      console.error('Error adding schedule block:', error);
      alert('Error: ' + error.message);
    }
  };

  const handleRemoveScheduleBlock = async (blockId: string) => {
    try {
      const { error } = await supabase
        .from('call_sheet_schedule')
        .delete()
        .eq('id', blockId);
      if (error) throw error;
      fetchCallSheetDetails(selectedCallSheet.id);
    } catch (error: any) {
      console.error('Error removing schedule block:', error);
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId);

      if (error) throw error;
      const task = tasks.find(t => t.id === taskId);
      await logActivity('task_updated', `Tarea "${task?.title}" actualizada a estado: ${newStatus.toUpperCase()}`);
      
      // Update local state immediately to match optimistic UI in KanbanBoard
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
      
      // Delay the background sync to account for DB replication/eventual consistency
      setTimeout(() => {
        fetchProjectData(id, true);
      }, 1000);
    } catch (error: any) {
      console.error('Error updating task status:', error);
      alert('Error al actualizar estado: ' + error.message);
    }
  };

  const handleAssignMemberToTask = async (taskId: string, memberId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ assigned_to: memberId })
        .eq('id', taskId);

      if (error) throw error;

      const member = crew.find((m: any) => m.profiles?.id === memberId);
      const task = tasks.find((t: any) => t.id === taskId);
      
      // Update local state
      setTasks(prev => prev.map(t => 
        t.id === taskId ? { 
          ...t, 
          assigned_to: memberId,
          profiles: member?.profiles || t.profiles 
        } : t
      ));

      await logActivity('task_assigned', `Tarea "${task?.title}" asignada a: ${member?.profiles?.full_name || 'miembro'}`);
      
      // Sync
      setTimeout(() => fetchProjectData(id, true), 1000);
    } catch (error: any) {
      console.error('Error assigning task:', error);
    }
  };

  const handleUpdateTaskField = async (taskId: string, field: string, value: any) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ [field]: value })
        .eq('id', taskId);

      if (error) throw error;
      
      // Update local state
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, [field]: value } : t));
      if (selectedTask && selectedTask.id === taskId) {
          setSelectedTask((prev: any) => ({ ...prev, [field]: value }));
      }
      
      fetchProjectData(id, true); // Silent refresh
    } catch (error: any) {
      console.error(`Error updating task ${field}:`, error);
    }
  };

  const fetchTransportData = async (projectId: string) => {
    try {
      const { data, error } = await supabase
        .from('transport_requests')
        .select(`
          *,
          profiles(full_name, avatar_url),
          call_sheets(shoot_date),
          transport_assignments(
            *,
            suppliers(name)
          )
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Transport data table missing or error:', error.message);
        return;
      }
      setTransportRequests(data || []);
    } catch (error) {
      console.warn('Error fetching transport data:', error);
    }
  };

  const handleCreateTransportRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('transport_requests')
        .insert([{
          ...newTransportRequest,
          project_id: id,
          status: 'pending'
        }]);

      if (error) throw error;

      await logActivity('transport_requested', `Nueva solicitud de transporte creada.`);
      setIsAddTransportModalOpen(false);
      setNewTransportRequest({
        call_sheet_id: '',
        profile_id: '',
        pickup_location: '',
        dropoff_location: '',
        pickup_time: '08:00',
        vehicle_type: 'pasajeros',
        notes: ''
      });
      fetchTransportData(id);
    } catch (error: any) {
      console.error('Error creating transport request:', error);
      alert('Error: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignTransport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTransportRequest) return;
    setIsSubmitting(true);
    try {
      const { error: assignError } = await supabase
        .from('transport_assignments')
        .insert([{
          ...newTransportAssignment,
          transport_request_id: selectedTransportRequest.id
        }]);

      if (assignError) throw assignError;

      const { error: statusError } = await supabase
        .from('transport_requests')
        .update({ status: 'assigned' })
        .eq('id', selectedTransportRequest.id);

      if (statusError) throw statusError;

      await logActivity('transport_assigned', `Transporte asignado para solicitud #${selectedTransportRequest.id.slice(0, 8)}`);
      setIsAssignTransportModalOpen(false);
      setNewTransportAssignment({
        supplier_id: '',
        driver_name: '',
        driver_phone: '',
        vehicle_plate: '',
        cost: 0
      });
      fetchTransportData(id);
    } catch (error: any) {
      console.error('Error assigning transport:', error);
      alert('Error: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchCateringData = async (projectId: string) => {
    try {
      const { data, error } = await supabase
        .from('catering_orders')
        .select(`
          *,
          suppliers(name, category),
          call_sheets(shoot_date)
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Catering data table missing or error:', error.message);
        return;
      }
      setCateringOrders(data || []);
    } catch (error) {
      console.warn('Error fetching catering data:', error);
    }
  };

  const handleCreateCateringOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('catering_orders')
        .insert([{
          ...newCateringOrder,
          project_id: id
        }]);

      if (error) throw error;

      await logActivity('catering_ordered', `Nuevo pedido de catering registrado (${newCateringOrder.meal_type.toUpperCase()}).`);
      setIsAddCateringModalOpen(false);
      setNewCateringOrder({
        call_sheet_id: '',
        supplier_id: '',
        meal_type: 'lunch',
        crew_count: 0,
        notes: ''
      });
      fetchCateringData(id);
    } catch (error: any) {
      console.error('Error creating catering order:', error);
      alert('Error: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveTask = async (taskId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta tarea?')) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      const task = tasks.find(t => t.id === taskId);
      await logActivity('task_removed', `Tarea eliminada: ${task?.title || 'desconocida'}`);
      fetchProjectData(id);
    } catch (error) {
      console.error('Error removing task:', error);
    }
  };

  const compressImage = async (file: File) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/webp'
    };
    try {
      return await imageCompression(file, options);
    } catch (error) {
      console.error('Compression error:', error);
      return file; // Fallback to original
    }
  };

  const uploadFile = async (file: File, path: string) => {
    // Compress BEFORE upload
    const compressedFile = await compressImage(file);

    const { data, error } = await supabase.storage
      .from('project_media')
      .upload(path, compressedFile);
    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('project_media')
      .getPublicUrl(path);
    return publicUrl;
  };

  const handleCreateCasting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCasting.full_name) return;
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      // 1. Create Profile
      const { data: profile, error: profileError } = await supabase
        .from('casting_profiles')
        .insert([{
          full_name: newCasting.full_name,
          age_range: newCasting.age_range,
          height_cm: newCasting.height ? parseInt(newCasting.height) : null,
          city: newCasting.city,
          skills: newCasting.skills,
          created_by: user?.id
        }])
        .select()
        .single();

      if (profileError) throw profileError;

      // 2. Associate with Project
      const { error: assocError } = await supabase
        .from('casting_project_status')
        .insert([{
          project_id: id,
          casting_profile_id: profile.id,
          status: 'new'
        }]);

      if (assocError) throw assocError;

      // 3. Upload Photos
      if (newCasting.photos.length > 0) {
        console.log(`Project: Uploading ${newCasting.photos.length} photos for casting profile ${profile.id}`);
        const photoPromises = newCasting.photos.map(async (p) => {
          const fileExt = p.file.name.split('.').pop();
          const fileName = `${profile.id}_${p.category}_${Date.now()}.${fileExt}`;
          const filePath = `casting/${fileName}`;
          const url = await uploadFile(p.file, filePath);
          console.log(`Uploaded ${p.category} photo to ${url}`);

          return {
            casting_profile_id: profile.id,
            file_url: url,
            photo_type: p.category,
            uploaded_by: user?.id
          };
        });

        const photoData = await Promise.all(photoPromises);

        // SYNC FIRST PHOTO TO MAIN RECORD
        if (photoData.length > 0) {
          const firstPhotoUrl = photoData[0].file_url;
          console.log(`Syncing primary photo_url: ${firstPhotoUrl}`);
          const { error: syncError } = await supabase
            .from('casting_profiles')
            .update({ photo_url: firstPhotoUrl })
            .eq('id', profile.id);
          if (syncError) console.warn('Error syncing photo_url:', syncError);
        }

        const { error: photosError } = await supabase
          .from('casting_photos')
          .insert(photoData);

        if (photosError) {
          console.error('PROJECT GALLERY ERROR:', photosError);
          alert(`Perfil creado, pero hubo un error en la galería: ${photosError.message}`);
        } else {
          console.log('All photos saved successfully to gallery');
        }
      }

      await logActivity('casting_added', `Nuevo perfil de casting creado y vinculado: ${newCasting.full_name}`);

      setIsAddCastingModalOpen(false);
      setNewCasting({ full_name: '', age_range: '', height: '', city: '', skills: '', photos: [] });
      fetchProjectData(id);
    } catch (error: any) {
      console.error('Error creating casting:', error);
      alert('Error: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocation.name) return;
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      // 1. Create Location
      const { data: location, error: locError } = await supabase
        .from('locations')
        .insert([{
          name: newLocation.name,
          location_type: newLocation.type,
          city: newLocation.city,
          address: newLocation.address,
          scout_notes: newLocation.notes,
          description: newLocation.description,
          owner_name: newLocation.owner,
          latitude: newLocation.latitude ? parseFloat(newLocation.latitude) : null,
          longitude: newLocation.longitude ? parseFloat(newLocation.longitude) : null,
          created_by: user?.id
        }])
        .select()
        .single();

      if (locError) throw locError;

      // 2. Associate with Project
      const { error: assocError } = await supabase
        .from('location_project_status')
        .insert([{
          project_id: id,
          location_id: location.id,
          status: 'new'
        }]);

      if (assocError) throw assocError;

      // 3. Upload Photos
      if (newLocation.photos.length > 0) {
        console.log(`Project: Uploading ${newLocation.photos.length} photos for location ${location.id}`);
        const photoPromises = newLocation.photos.map(async (p) => {
          const fileExt = p.file.name.split('.').pop();
          const fileName = `${location.id}_${p.category}_${Date.now()}.${fileExt}`;
          const filePath = `locations/${fileName}`;
          const url = await uploadFile(p.file, filePath);
          console.log(`Uploaded ${p.category} photo to ${url}`);

          return {
            location_id: location.id,
            file_url: url,
            uploaded_by: user?.id
          };
        });

        const photoData = await Promise.all(photoPromises);

        // SYNC FIRST PHOTO TO MAIN RECORD
        if (photoData.length > 0) {
          const firstPhotoUrl = photoData[0].file_url;
          console.log(`Syncing main_photo_url: ${firstPhotoUrl}`);
          const { error: syncError } = await supabase
            .from('locations')
            .update({ main_photo_url: firstPhotoUrl })
            .eq('id', location.id);
          if (syncError) console.warn('Error syncing main_photo_url:', syncError);
        }

        const { error: photosError } = await supabase
          .from('location_photos')
          .insert(photoData);

        if (photosError) throw photosError;
        console.log('All location photos saved successfully');
      }

      await logActivity('location_added', `Nueva locación registrada y vinculada: ${newLocation.name}`);

      setIsAddLocationModalOpen(false);
      setNewLocation({ name: '', type: 'Interior', city: '', address: '', notes: '', description: '', owner: '', latitude: '', longitude: '', photos: [] });
      fetchProjectData(id);
    } catch (error: any) {
      console.error('Error creating location:', error);
      alert('Error: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateScoutingReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      // 1. Create Scouting Report
      const { data: report, error: reportError } = await supabase
        .from('scouting_reports')
        .insert([{
          project_id: id,
          task_id: newScoutingReport.task_id || null,
          reported_by: user?.id,
          scouting_type: newScoutingReport.scouting_type,
          notes: newScoutingReport.notes,
          status: 'submitted'
        }])
        .select()
        .single();

      if (reportError) throw reportError;

      // 2. Upload Photos
      if (newScoutingReport.photos.length > 0) {
        const photoPromises = newScoutingReport.photos.map(async (p, index) => {
          const fileExt = p.file.name.split('.').pop();
          const fileName = `${report.id}_${index}_${Date.now()}.${fileExt}`;
          const filePath = `scouting/${report.id}/${fileName}`;
          const url = await uploadFile(p.file, filePath);

          return {
            scouting_report_id: report.id,
            file_url: url
          };
        });

        const photoData = await Promise.all(photoPromises);
        const { error: photosError } = await supabase
          .from('scouting_report_photos')
          .insert(photoData);

        if (photosError) throw photosError;
      }

      await logActivity('scouting_added', `Reporte de avanzada enviado por el equipo de campo (${newScoutingReport.scouting_type}).`);

      setIsAddScoutingReportModalOpen(false);
      setIsScoutingModalOpen(false);
      setNewScoutingReport({
        task_id: '',
        scouting_type: 'general',
        notes: '',
        summary: '',
        sun_start: '',
        sun_end: '',
        power_access: '',
        noise_notes: '',
        photos: []
      });
      fetchProjectData(id);
    } catch (error: any) {
      console.error('Error creating scouting report:', error);
      alert('Error: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-white/20" size={48} />
        <p className="text-muted-foreground text-sm animate-pulse">Cargando detalles del proyecto...</p>
      </div>
    );
  }

  if (!project) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Loader2 size={32} className="animate-spin text-indigo-600" />
    </div>
  );

  return (
    <div 
      className="flex flex-col min-h-screen transition-all duration-700"
      style={{ 
        backgroundColor: brandConfig.platform_bg_color,
        fontFamily: brandConfig.platform_font_family === 'Outfit' ? '"Outfit", sans-serif' : 
                    brandConfig.platform_font_family === 'Roboto' ? '"Roboto", sans-serif' : 
                    brandConfig.platform_font_family === 'Montserrat' ? '"Montserrat", sans-serif' : 
                    '"Inter", sans-serif',
        // @ts-ignore
        '--platform-card': brandConfig.platform_card_color,
        '--brand-accent': brandConfig.brand_color
      } as React.CSSProperties}
    >
      <style jsx global>{`
        .bg-white { background-color: var(--platform-card, #ffffff) !important; }
        .bg-gray-50 { background-color: ${brandConfig.platform_bg_color} !important; opacity: 0.9; }
      `}</style>
      {/* Project Header (Local Top Bar) */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-10 py-6 sticky top-0 z-30">
        <div className="flex items-center gap-6">
          <Link href="/projects" className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-500 transition-all border border-gray-100">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">{project.name}</h2>
              <Badge variant={project.status === 'production' ? 'success' : 'info'}>
                {project.status === 'production' ? 'En Rodaje' : 'Pre-Producción'}
              </Badge>
            </div>
            <p className="text-xs text-gray-400 font-medium mt-0.5 flex items-center gap-2">
              <Calendar size={12} /> {new Date(project.start_date || '').toLocaleDateString('es-ES', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex -space-x-3 pr-4 border-r border-gray-100 py-1">
            {crew.slice(0, 4).map((member: any) => (
              <div key={member.id} className="w-9 h-9 rounded-full border-2 border-white bg-indigo-50 flex items-center justify-center overflow-hidden shadow-sm" title={member.profiles?.full_name}>
                {member.profiles?.avatar_url ? (
                  <img src={member.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Users size={14} className="text-indigo-400" />
                )}
              </div>
            ))}
            {crew.length > 4 && (
              <div className="w-9 h-9 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-400 shadow-sm">
                +{crew.length - 4}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 mr-2">
            <button
              onClick={() => setIsAlternateView(!isAlternateView)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                isAlternateView 
                  ? 'bg-[#D9FF54] text-black shadow-lg shadow-[#D9FF54]/20' 
                  : 'bg-white text-gray-400 border border-gray-100 hover:border-gray-200'
              }`}
            >
              <LayoutDashboard size={14} />
              {isAlternateView ? 'VISTA APPLE' : 'VISTA CLÁSICA'}
            </button>
          </div>
          {hasPermission('edit_project') && (
            <Button variant="primary" size="md" onClick={openEditProject}>
              <Settings size={18} /> GESTIONAR
            </Button>
          )}
        </div>
      </div>

      {/* Phase Selector (Navigation Main) */}
      <div className="bg-white/40 backdrop-blur-xl border-b border-gray-100 px-10 py-1">
        <div className="flex items-center gap-2">
          {[
            { id: 'pre', label: 'Pre-producción', color: 'bg-amber-500' },
            { id: 'pro', label: 'Producción', color: 'bg-indigo-600' },
            { id: 'entrega', label: 'Cierre / Entrega', color: 'bg-emerald-500' },
          ].map((phase) => (
            <button
              key={phase.id}
              onClick={() => {
                setActivePhase(phase.id as any);
                setActiveSubTab(phase.id === 'pro' ? 'overview' : 'resumen');
              }}
              className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 ${
                activePhase === phase.id 
                  ? 'bg-white text-gray-900 shadow-sm border border-gray-100' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${activePhase === phase.id ? phase.color : 'bg-gray-200'}`} />
              {phase.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-Tabs Navigation (Contextual) */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-10 py-2 sticky top-[80px] z-20">
        <div className="flex items-center gap-8 overflow-x-auto scrollbar-hide">
          {activePhase === 'pre' && [
            { id: 'resumen', label: 'Resumen', icon: LayoutDashboard },
            { id: 'base', label: 'Material Base', icon: FolderOpen },
            { id: 'cotizacion', label: 'Cotización', icon: Calculator },
            { id: 'desglose', label: 'Desglose', icon: ListChecks },
            { id: 'scouting', label: 'Scouting', icon: Package },
            { id: 'biblia', label: 'Biblia del Proyecto', icon: FileText },
            { id: 'personalizacion', label: 'Personalización Pro', icon: Sparkles },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`group flex flex-col items-center gap-1.5 py-2 px-1 transition-all relative ${
                activeSubTab === tab.id ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className={`p-2 rounded-xl transition-all ${
                activeSubTab === tab.id ? 'bg-indigo-50 shadow-inner' : 'bg-transparent group-hover:bg-gray-50'
              }`}>
                <tab.icon size={18} />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest">{tab.label}</span>
              {activeSubTab === tab.id && (
                <motion.div layoutId="subTabUnderline" className="absolute -bottom-2 left-0 right-0 h-1 bg-indigo-600 rounded-t-full" />
              )}
            </button>
          ))}
          
          {activePhase === 'pro' && [
            { id: 'overview', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'crew', icon: Users, label: 'Personal' },
            { id: 'tasks', icon: ListChecks, label: 'Tareas' },
            { id: 'casting', icon: UserPlus, label: 'Casting' },
            { id: 'logistics', icon: Truck, label: 'Operaciones' },
            { id: 'reports', icon: BarChart3, label: 'Reportes' },
            { id: 'personalizacion', icon: Sparkles, label: 'Personalización Pro' },
          ].map((tab) => (
             <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`group flex flex-col items-center gap-1.5 py-2 px-1 transition-all relative ${
                activeSubTab === tab.id ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className={`p-2 rounded-xl transition-all ${
                activeSubTab === tab.id ? 'bg-indigo-50 shadow-inner' : 'bg-transparent group-hover:bg-gray-50'
              }`}>
                <tab.icon size={18} />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest">{tab.label}</span>
              {activeSubTab === tab.id && (
                <motion.div layoutId="subTabUnderline" className="absolute -bottom-2 left-0 right-0 h-1 bg-indigo-600 rounded-t-full" />
              )}
            </button>
          ))}
          
          {activePhase === 'entrega' && [
            { id: 'resumen', icon: LayoutDashboard, label: 'Resumen' },
            { id: 'entregables', icon: Film, label: 'Entregables' },
            { id: 'finanzas', icon: Wallet, label: 'Finanzas' },
            { id: 'cierre', icon: CheckCircle2, label: 'Cierre' },
          ].map((tab) => (
             <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`group flex flex-col items-center gap-1.5 py-2 px-1 transition-all relative ${
                activeSubTab === tab.id ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className={`p-2 rounded-xl transition-all ${
                activeSubTab === tab.id ? 'bg-indigo-50 shadow-inner' : 'bg-transparent group-hover:bg-gray-50'
              }`}>
                <tab.icon size={18} />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest">{tab.label}</span>
              {activeSubTab === tab.id && (
                <motion.div layoutId="subTabUnderline" className="absolute -bottom-2 left-0 right-0 h-1 bg-indigo-600 rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </nav>

      <div className="flex-1 overflow-y-auto p-10 bg-gray-50/50">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              {/* PHASE: PRE-PRODUCCIÓN */}
              {activePhase === 'pre' && activeSubTab !== 'personalizacion' && (
                <PhasePre
                  activeSubTab={activeSubTab}
                  setActiveSubTab={setActiveSubTab}
                  materials={materials}
                  isAnalyzing={isAnalyzing}
                  analysisComplete={analysisComplete}
                  analyzingPhase={analyzingPhase}
                  handleAIAnalysis={handleAIAnalysis}
                  activeScriptId={activeScriptId}
                  setActiveScriptId={setActiveScriptId}
                  handleDeleteMaterial={handleDeleteMaterial}
                  handleFileUpload={handleFileUpload}
                  scriptInputRef={scriptInputRef}
                  storyboardInputRef={storyboardInputRef}
                  breakdownItems={breakdownItems}
                  breakdownFilter={breakdownFilter}
                  setBreakdownFilter={setBreakdownFilter}
                  scoutingCategory={scoutingCategory}
                  setScoutingCategory={setScoutingCategory}
                  locations={locations}
                  casting={casting}
                  artItems={artItems}
                  crew={crew}
                  callSheets={callSheets}
                  setIsAddTaskModalOpen={setIsAddTaskModalOpen}
                  handleAddTask={handleAddTask}
                  onPromoteToScouting={handlePromoteToScouting}
                  onDeleteBreakdownItem={handleDeleteBreakdownItem}
                  onUpdateBreakdownItem={handleUpdateBreakdownItem}
                  onCreateTaskFromResource={handleCreateTaskFromResource}
                  onDeleteResource={handleDeleteResource}
                  onUpdateResource={handleUpdateResource}
                  onAddBreakdownItem={handleAddBreakdownItem}
                  setIsCastingTerminalOpen={setIsCastingTerminalOpen}
                  setIsLocationTerminalOpen={setIsLocationTerminalOpen}
                  setIsArtTerminalOpen={setIsArtTerminalOpen}
                  project={project}
                  budgetSummary={budgetSummary}
                  onUpdate={() => fetchBudgetData(id)}
                />
              )}
              {/* PHASE: PRE-PRODUCCIÓN - CREDENCIALES (Link to Config) */}
              {/* PHASE: (PRE/PRO) - CREDENCIALES (The full Engine) */}
              {(activePhase === 'pre' || activePhase === 'pro') && activeSubTab === 'personalizacion' && (
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

              {/* PHASE: PRODUCCIÓN */}
              {activePhase === 'pro' && (
                <PhasePro
                  activeSubTab={activeSubTab}
                  setActiveSubTab={setActiveSubTab}
                  isAlternateView={isAlternateView}
                  project={project}
                  tasks={tasks}
                  crew={crew}
                  locations={locations}
                  setIsAddExpenseModalOpen={setIsAddExpenseModalOpen}
                  setIsAddSupplierModalOpen={setIsAddSupplierModalOpen}
                  setIsAddCastingModalOpen={setIsAddCastingModalOpen}
                  setIsAddLocationModalOpen={setIsAddLocationModalOpen}
                  activities={activities}
                  hasPermission={hasPermission}
                  setIsAddMemberModalOpen={setIsAddMemberModalOpen}
                  setSelectedCrewMember={setSelectedCrewMember}
                  setIsCrewSidebarOpen={setIsCrewSidebarOpen}
                  handleRemoveMember={handleRemoveMember}
                  isAddMemberModalOpen={isAddMemberModalOpen}
                  handleAddMember={handleAddMember}
                  newMember={newMember}
                  setNewMember={setNewMember}
                  profiles={profiles}
                  roles={roles}
                  isSubmitting={isSubmitting}
                  taskViewMode={taskViewMode}
                  setTaskViewMode={setTaskViewMode}
                  handleUpdateTaskStatus={handleUpdateTaskStatus}
                  handleAssignMemberToTask={handleAssignMemberToTask}
                  setSelectedTask={setSelectedTask}
                  fetchTaskDetails={fetchTaskDetails}
                  handleRemoveTask={handleRemoveTask}
                  isAddTaskModalOpen={isAddTaskModalOpen}
                  setIsAddTaskModalOpen={setIsAddTaskModalOpen}
                  handleAddTask={handleAddTask}
                  newTask={newTask}
                  setNewTask={setNewTask}
                  setIsCastingTerminalOpen={setIsCastingTerminalOpen}
                  setNewCasting={setNewCasting}
                  setSelectedCastingProfile={setSelectedCastingProfile}
                  setIsCastingGalleryOpen={setIsCastingGalleryOpen}
                  fetchReportsData={fetchReportsData}
                  reportsData={reportsData}
                  budgetSummary={budgetSummary}
                  expenses={expenses}
                  logisticsSubTab={logisticsSubTab}
                  setLogisticsSubTab={setLogisticsSubTab}
                  locationsViewMode={locationsViewMode}
                  setLocationsViewMode={setLocationsViewMode}
                  scoutingReports={scoutingReports}
                  setIsLocationTerminalOpen={setIsLocationTerminalOpen}
                  setIsAddScoutingReportModalOpen={setIsAddScoutingReportModalOpen}
                  setSelectedScoutingReport={setSelectedScoutingReport}
                  setIsScoutingDetailModalOpen={setIsScoutingDetailModalOpen}
                  callSheets={callSheets}
                  setIsAddCallSheetModalOpen={setIsAddCallSheetModalOpen}
                  setSelectedCallSheet={setSelectedCallSheet}
                  setIsCallSheetEditorOpen={setIsCallSheetEditorOpen}
                  fetchCallSheetDetails={fetchCallSheetDetails}
                  setIsArtTerminalOpen={setIsArtTerminalOpen}
                  artItems={artItems}
                  handleDeleteArtItem={handleDeleteArtItem}
                  projectSuppliers={projectSuppliers}
                  handleRemoveSupplier={handleRemoveSupplier}
                  transportRequests={transportRequests}
                  setSelectedTransportRequest={setSelectedTransportRequest}
                  setIsAssignTransportModalOpen={setIsAssignTransportModalOpen}
                  setIsAddTransportModalOpen={setIsAddTransportModalOpen}
                  cateringOrders={cateringOrders}
                  setIsAddCateringModalOpen={setIsAddCateringModalOpen}
                  setIsAddBudgetModalOpen={setIsAddBudgetModalOpen}
                  casting={casting}
                />
              )}










            {/* PHASE: ENTREGA + CIERRE */}
            {activePhase === 'entrega' && (
              <PhaseEntrega
                activeSubTab={activeSubTab}
                setActiveSubTab={setActiveSubTab}
                budgetSummary={budgetSummary}
                expenses={expenses}
              />
            )}

          </AnimatePresence>

            {/* Add Supplier Modal */}
            {isAddSupplierModalOpen && (
              <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="glass-card w-full max-w-md p-8 rounded-3xl border border-white/10 shadow-2xl relative"
                >
                  <button onClick={() => setIsAddSupplierModalOpen(false)} className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors">
                    <X size={20} />
                  </button>
                  <div className="mb-8">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-1">Financial & Logistics</h4>
                    <h3 className="text-xl font-bold text-white uppercase tracking-tight">Vincular Proveedor</h3>
                    <p className="text-sm text-white/40 mt-1 italic">Asigna un proveedor del catálogo al proyecto.</p>
                  </div>

                  <form onSubmit={handleAddSupplier} className="space-y-6">
                    <div className="space-y-1">
                      <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Seleccionar Proveedor</label>
                      <select
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5 appearance-none cursor-pointer"
                        value={newSupplier.supplier_id}
                        onChange={(e) => setNewSupplier({ ...newSupplier, supplier_id: e.target.value })}
                      >
                        <option value="" disabled className="bg-neutral-900 text-white/40">Elegir de la lista...</option>
                        {allSuppliers.map(s => (
                          <option key={s.id} value={s.id} className="bg-neutral-900">{s.name} ({s.category})</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Descripción del Servicio</label>
                      <textarea
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5 h-24 resize-none"
                        placeholder="Ej: Alquiler de set 3 días..."
                        value={newSupplier.service_description}
                        onChange={(e) => setNewSupplier({ ...newSupplier, service_description: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Monto Presupuestado</label>
                      <input
                        type="number"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5"
                        placeholder="0.00"
                        value={newSupplier.budgeted_amount}
                        onChange={(e) => setNewSupplier({ ...newSupplier, budgeted_amount: parseFloat(e.target.value) })}
                      />
                    </div>
                    <button type="submit" className="w-full py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-neutral-200 transition-all shadow-xl mt-2 active:scale-[0.98]">
                      VINCULAR A PROYECTO
                    </button>
                  </form>
                </motion.div>
              </div>
            )}

            {/* Add Catering Order Modal */}
            {isAddCateringModalOpen && (
              <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="glass-card w-full max-w-md my-8 p-8 rounded-3xl border border-white/10 shadow-2xl relative"
                >
                  <button onClick={() => setIsAddCateringModalOpen(false)} className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors">
                    <X size={20} />
                  </button>
                  <div className="mb-8">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-1">Logistics & Catering</h4>
                    <h3 className="text-xl font-bold text-white uppercase tracking-tight">Nuevo Pedido de Catering</h3>
                    <p className="text-sm text-white/40 mt-1 italic">Registra un pedido de alimentación para el rodaje.</p>
                  </div>

                  <form onSubmit={handleCreateCateringOrder} className="space-y-6">
                    <div className="space-y-1">
                      <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Día de Rodaje (Call Sheet)</label>
                      <select
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5 appearance-none cursor-pointer"
                        value={newCateringOrder.call_sheet_id}
                        onChange={(e) => setNewCateringOrder({ ...newCateringOrder, call_sheet_id: e.target.value })}
                      >
                        <option value="" disabled className="bg-neutral-900 text-white/40">Seleccionar fecha...</option>
                        {callSheets.map(cs => (
                          <option key={cs.id} value={cs.id} className="bg-neutral-900">{new Date(cs.shoot_date).toLocaleDateString()} - {cs.locations?.name || 'Locación N/A'}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Tipo de Comida</label>
                        <select
                          required
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5 appearance-none cursor-pointer"
                          value={newCateringOrder.meal_type}
                          onChange={(e) => setNewCateringOrder({ ...newCateringOrder, meal_type: e.target.value as any })}
                        >
                          <option value="breakfast" className="bg-neutral-900">Desayuno</option>
                          <option value="lunch" className="bg-neutral-900">Almuerzo</option>
                          <option value="dinner" className="bg-neutral-900">Cena</option>
                          <option value="snacks" className="bg-neutral-900">Snacks / Crew</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Cant. Personas</label>
                        <input
                          required
                          type="number"
                          min="1"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5"
                          value={newCateringOrder.crew_count}
                          onChange={(e) => setNewCateringOrder({ ...newCateringOrder, crew_count: parseInt(e.target.value) })}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Proveedor</label>
                      <select
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5 appearance-none cursor-pointer"
                        value={newCateringOrder.supplier_id}
                        onChange={(e) => setNewCateringOrder({ ...newCateringOrder, supplier_id: e.target.value })}
                      >
                        <option value="" disabled className="bg-neutral-900 text-white/40">Seleccionar proveedor...</option>
                        {allSuppliers.filter(s => s.category?.toLowerCase().includes('catering') || s.category?.toLowerCase().includes('food')).map(s => (
                          <option key={s.id} value={s.id} className="bg-neutral-900">{s.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Notas especiales</label>
                      <textarea
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5 h-24 resize-none"
                        placeholder="Ej: 3 vegetarianos, 1 celíaco..."
                        value={newCateringOrder.notes}
                        onChange={(e) => setNewCateringOrder({ ...newCateringOrder, notes: e.target.value })}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-xl mt-2 active:scale-[0.98]"
                    >
                      {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'CONFIRMAR PEDIDO'}
                    </button>
                  </form>
                </motion.div>
              </div>
            )}

            {/* Add Call Sheet Modal */}
            {isAddCallSheetModalOpen && (
              <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="glass-card w-full max-w-md p-8 rounded-3xl border border-white/10 shadow-2xl relative"
                >
                  <button onClick={() => setIsAddCallSheetModalOpen(false)} className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors">
                    <X size={20} />
                  </button>
                  <div className="mb-8">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-1">Production Planning</h4>
                    <h3 className="text-xl font-bold text-white uppercase tracking-tight">Nuevo Call Sheet</h3>
                    <p className="text-sm text-white/40 mt-1 italic">Inicia el plan para un día de rodaje.</p>
                  </div>

                  <form onSubmit={handleCreateCallSheet} className="space-y-6">
                    <div className="space-y-1">
                      <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Fecha de Rodaje</label>
                      <input
                        required
                        type="date"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5"
                        value={newCallSheet.shoot_date}
                        onChange={(e) => setNewCallSheet({ ...newCallSheet, shoot_date: e.target.value })}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Locación Principal</label>
                      <select
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5 appearance-none cursor-pointer"
                        value={newCallSheet.location_id}
                        onChange={(e) => setNewCallSheet({ ...newCallSheet, location_id: e.target.value })}
                      >
                        <option value="" className="bg-neutral-900 text-white/40">Por definir...</option>
                        {locations.map((loc: any) => (
                          <option key={loc.id} value={loc.id} className="bg-neutral-900">{loc.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Notas Generales</label>
                      <textarea
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5 h-24 resize-none"
                        placeholder="Instrucciones clave para el equipo..."
                        value={newCallSheet.general_notes}
                        onChange={(e) => setNewCallSheet({ ...newCallSheet, general_notes: e.target.value })}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-xl mt-2 active:scale-[0.98]"
                    >
                      {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'CREAR CALL SHEET'}
                    </button>
                  </form>
                </motion.div>
              </div>
            )}

            {/* Add Transport Request Modal */}
            {isAddTransportModalOpen && (
              <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="glass-card w-full max-w-md p-8 rounded-3xl border border-white/10 shadow-2xl relative"
                >
                  <button onClick={() => setIsAddTransportModalOpen(false)} className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors">
                    <X size={20} />
                  </button>
                  <div className="mb-8">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-1">Logistics & Transport</h4>
                    <h3 className="text-xl font-bold text-white uppercase tracking-tight">Nueva Solicitud de Transporte</h3>
                    <p className="text-sm text-white/40 mt-1 italic">Organiza el traslado de personal o equipo.</p>
                  </div>

                  <form onSubmit={handleCreateTransportRequest} className="space-y-5">
                    <div className="space-y-1">
                      <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Día de Rodaje (Call Sheet)</label>
                      <select
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5 appearance-none cursor-pointer"
                        value={newTransportRequest.call_sheet_id}
                        onChange={(e) => setNewTransportRequest({ ...newTransportRequest, call_sheet_id: e.target.value })}
                      >
                        <option value="" className="bg-neutral-900 text-white/40">Seleccionar día...</option>
                        {callSheets.map((cs: any) => (
                          <option key={cs.id} value={cs.id} className="bg-neutral-900">
                            {new Date(cs.shoot_date).toLocaleDateString()}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Pasajero / Responsable</label>
                      <select
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5 appearance-none cursor-pointer"
                        value={newTransportRequest.profile_id}
                        onChange={(e) => setNewTransportRequest({ ...newTransportRequest, profile_id: e.target.value })}
                      >
                        <option value="" className="bg-neutral-900 text-white/40">Seleccionar persona...</option>
                        {profiles.map((p: any) => (
                          <option key={p.id} value={p.id} className="bg-neutral-900">{p.full_name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Hora Recogida</label>
                        <input
                          required
                          type="time"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5"
                          value={newTransportRequest.pickup_time}
                          onChange={(e) => setNewTransportRequest({ ...newTransportRequest, pickup_time: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Tipo Vehículo</label>
                        <select
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5 appearance-none cursor-pointer"
                          value={newTransportRequest.vehicle_type}
                          onChange={(e) => setNewTransportRequest({ ...newTransportRequest, vehicle_type: e.target.value })}
                        >
                          <option value="pasajeros" className="bg-neutral-900 text-white">Pasajeros</option>
                          <option value="producción" className="bg-neutral-900 text-white">Producción</option>
                          <option value="cámara" className="bg-neutral-900 text-white">Cámara</option>
                          <option value="camión" className="bg-neutral-900 text-white">Camión</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Origen (Pick-up)</label>
                      <input
                        required
                        placeholder="Ej: Hotel o Domicilio..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5"
                        value={newTransportRequest.pickup_location}
                        onChange={(e) => setNewTransportRequest({ ...newTransportRequest, pickup_location: e.target.value })}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Destino (Drop-off)</label>
                      <input
                        required
                        placeholder="Ej: Locación o Set..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5"
                        value={newTransportRequest.dropoff_location}
                        onChange={(e) => setNewTransportRequest({ ...newTransportRequest, dropoff_location: e.target.value })}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-xl mt-2 active:scale-[0.98]"
                    >
                      {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'SOLICITAR TRANSPORTE'}
                    </button>
                  </form>
                </motion.div>
              </div>
            )}

            {/* Assign Transport Modal */}
            {isAssignTransportModalOpen && selectedTransportRequest && (
              <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="glass-card w-full max-w-md p-8 rounded-3xl border border-white/10 shadow-2xl relative"
                >
                  <button onClick={() => setIsAssignTransportModalOpen(false)} className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors">
                    <X size={20} />
                  </button>
                  <div className="mb-8">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-1">Fleet Management</h4>
                    <h3 className="text-xl font-bold text-white uppercase tracking-tight">Asignar Transporte</h3>
                    <p className="text-sm text-white/40 mt-1 italic">
                      Para: {selectedTransportRequest.profiles?.full_name}
                    </p>
                  </div>

                  <form onSubmit={handleAssignTransport} className="space-y-5">
                    <div className="space-y-1">
                      <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Proveedor Externo</label>
                      <select
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5 appearance-none cursor-pointer"
                        value={newTransportAssignment.supplier_id}
                        onChange={(e) => setNewTransportAssignment({ ...newTransportAssignment, supplier_id: e.target.value })}
                      >
                        <option value="" className="bg-neutral-900 text-white/40">Seleccionar proveedor...</option>
                        {allSuppliers.filter((s: any) => s.category?.toLowerCase().includes('transp') || s.category?.toLowerCase().includes('logist')).map((s: any) => (
                          <option key={s.id} value={s.id} className="bg-neutral-900">{s.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Nombre Conductor</label>
                      <input
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5"
                        placeholder="Ej: Roberto Gómez..."
                        value={newTransportAssignment.driver_name}
                        onChange={(e) => setNewTransportAssignment({ ...newTransportAssignment, driver_name: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Teléfono Cond.</label>
                        <input
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5"
                          placeholder="Ej: +51 999..."
                          value={newTransportAssignment.driver_phone}
                          onChange={(e: any) => setNewTransportAssignment({ ...newTransportAssignment, driver_phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Placa / Matrícula</label>
                        <input
                          required
                          placeholder="ABC-123"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5 uppercase"
                          value={newTransportAssignment.vehicle_plate}
                          onChange={(e: any) => setNewTransportAssignment({ ...newTransportAssignment, vehicle_plate: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Costo Estimado (S/.)</label>
                      <input
                        type="number"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5"
                        placeholder="0.00"
                        value={newTransportAssignment.cost}
                        onChange={(e: any) => setNewTransportAssignment({ ...newTransportAssignment, cost: parseFloat(e.target.value) })}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-xl mt-2 active:scale-[0.98]"
                    >
                      {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'CONFIRMAR ASIGNACIÓN'}
                    </button>
                  </form>
                </motion.div>
              </div>
            )}

            {/* Call Sheet Editor Modal */}
            {isCallSheetEditorOpen && selectedCallSheet && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card w-full max-w-5xl my-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
                >
                  {/* Modal Header */}
                  <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <FileText size={32} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Detalles de Call Sheet</h3>
                        <p className="text-blue-400 font-medium flex items-center gap-2">
                          <Calendar size={14} />
                          {new Date(selectedCallSheet.shoot_date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleExportPDF(selectedCallSheet.id)}
                        className="flex items-center gap-2 bg-white text-black px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-neutral-200 transition-all shadow-xl"
                      >
                        <Download size={16} /> Export Call Sheet PDF
                      </button>
                      <button
                        onClick={() => setIsCallSheetEditorOpen(false)}
                        className="p-3 rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                      >
                        <X size={24} />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-8 space-y-12">
                    {/* General Info & Notes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="glass-card p-6 rounded-2xl border border-white/5">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4 flex items-center gap-2">
                          <MapPin size={12} /> Locación de Rodaje
                        </h4>
                        <div className="flex items-center gap-4">
                          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-white">
                            <LucideMap size={24} />
                          </div>
                          <div>
                            <span className="block text-lg font-bold text-white">
                              {selectedCallSheet.locations?.name || 'Locación por definir'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {selectedCallSheet.locations?.address || 'Sin dirección asignada'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="glass-card p-6 rounded-2xl border border-white/5">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4 flex items-center gap-2">
                          <LucideClipboard size={12} /> Notas del Día
                        </h4>
                        <p className="text-sm text-white/70 italic leading-relaxed">
                          {selectedCallSheet.general_notes || 'No hay notas generales para este día.'}
                        </p>
                      </div>
                    </div>

                    {/* Crew Management */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
                          <Users size={12} /> Llamado de Equipo (Crew)
                        </h4>
                        <div className="relative group">
                          <button className="flex items-center gap-2 text-[10px] font-black bg-white/5 text-white/60 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/10 transition-all">
                            <Plus size={14} /> ASIGNAR EQUIPO
                          </button>
                          <div className="invisible group-hover:visible absolute right-0 mt-2 w-64 glass-card border border-white/10 z-50 rounded-xl overflow-hidden shadow-2xl">
                            <div className="p-2 border-b border-white/5 text-[8px] font-black text-white/40 uppercase tracking-widest text-center">
                              Seleccionar del equipo del proyecto
                            </div>
                            <div className="max-h-60 overflow-y-auto p-2 space-y-1">
                              {crew.map((m: any) => (
                                <button
                                  key={m.profile_id}
                                  onClick={() => handleAddCrewToCallSheet(m.profile_id)}
                                  className="w-full text-left p-2 rounded-lg hover:bg-white/5 transition-all flex items-center gap-3"
                                >
                                  <img src={m.profiles?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${m.profiles?.full_name}`} className="w-6 h-6 rounded-full border border-white/10" alt="" />
                                  <span className="text-[10px] font-bold text-white uppercase">{m.profiles?.full_name}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {callSheetCrew.map((c: any) => (
                          <div key={c.id} className="glass-card p-4 rounded-xl border border-white/5 flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                              <img
                                src={c.profiles?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${c.profiles?.full_name}`}
                                className="w-10 h-10 rounded-full border border-white/10"
                                alt=""
                              />
                              <div>
                                <span className="block text-xs font-bold text-white uppercase tracking-wide">{c.profiles?.full_name}</span>
                                <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest">Call: {c.call_time.slice(0, 5)}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveCrewFromCallSheet(c.id)}
                              className="p-2 text-white/10 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                        {callSheetCrew.length === 0 && (
                          <div className="col-span-full py-12 text-center border border-white/5 border-dashed rounded-2xl">
                            <p className="text-xs text-white/20 uppercase font-black tracking-widest">No hay personal asignado</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Schedule Management */}
                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
                        <Clock size={12} /> Cronograma de Actividades
                      </h4>

                      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-white/[0.02] border-b border-white/5">
                              <th className="px-6 py-4 text-[9px] font-black text-white/40 uppercase tracking-widest">Tiempo</th>
                              <th className="px-6 py-4 text-[9px] font-black text-white/40 uppercase tracking-widest">Escena / Rubro</th>
                              <th className="px-6 py-4 text-[9px] font-black text-white/40 uppercase tracking-widest">Descripción / Acción</th>
                              <th className="px-6 py-4 text-[9px] font-black text-white/40 uppercase tracking-widest text-right">Acción</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {callSheetSchedule.map((block: any) => (
                              <tr key={block.id} className={`group hover:bg-white/[0.01] transition-all ${block.is_break ? 'bg-emerald-500/5' : ''}`}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-[10px] font-black text-blue-400 uppercase font-mono">
                                    {block.time_start.slice(0, 5)} - {block.time_end.slice(0, 5)}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="text-sm font-bold text-white uppercase tracking-wide">{block.scene || '-'}</span>
                                </td>
                                <td className="px-6 py-4">
                                  <p className="text-xs text-white/60 leading-relaxed font-medium">{block.description}</p>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <button
                                    onClick={() => handleRemoveScheduleBlock(block.id)}
                                    className="p-2 text-white/10 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {/* Add New Block Form */}
                            <tr className="bg-white/[0.01]">
                              <form onSubmit={handleAddScheduleBlock}>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    <input required name="time_start" type="time" className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white focus:outline-none" />
                                    <span className="text-white/20">-</span>
                                    <input required name="time_end" type="time" className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white focus:outline-none" />
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <input name="scene" type="text" placeholder="SC 01 / BREAK" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-white/20 focus:outline-none" />
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-4">
                                    <input required name="description" type="text" placeholder="Descripción de la actividad..." className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-white/20 focus:outline-none" />
                                    <label className="flex items-center gap-2 cursor-pointer shrink-0">
                                      <input name="is_break" type="checkbox" className="sr-only peer" />
                                      <div className="w-8 h-4 bg-white/5 border border-white/10 rounded-full peer-checked:bg-emerald-500 flex items-center transition-all px-0.5">
                                        <div className="w-3 h-3 bg-white rounded-full translate-x-0 peer-checked:translate-x-4 transition-all" />
                                      </div>
                                      <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">BREAK</span>
                                    </label>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <button type="submit" className="bg-white text-black px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-neutral-200 transition-all">
                                    AÑADIR
                                  </button>
                                </td>
                              </form>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="p-6 bg-white/[0.02] border-t border-white/5 flex justify-end gap-4 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-20">
                    <button
                      onClick={() => setIsCallSheetEditorOpen(false)}
                      className="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all"
                    >
                      Cerrar Editor
                    </button>
                    <button className="px-8 py-3 rounded-xl bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                      <Download size={14} /> EXPORTAR PDF (Próximamente)
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
            {/* Add Casting Modal */}
            {isAddCastingModalOpen && (
              <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="glass-card w-full max-w-2xl my-8 p-8 rounded-3xl border border-white/10 shadow-2xl relative"
                >
                  <button onClick={() => setIsAddCastingModalOpen(false)} className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors">
                    <X size={20} />
                  </button>
                  <div className="mb-8">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-1">Talent & Casting</h4>
                    <h3 className="text-xl font-bold text-white uppercase tracking-tight">Nuevo Perfil de Casting</h3>
                    <p className="text-sm text-white/40 mt-1 italic">Registra un nuevo talento para esta producción.</p>
                  </div>

                  <form onSubmit={handleCreateCasting} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Nombre Completo</label>
                          <input
                            required
                            type="text"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5"
                            placeholder="Ej: Juan Pérez"
                            value={newCasting.full_name}
                            onChange={(e) => setNewCasting({ ...newCasting, full_name: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Rango Edad</label>
                            <input
                              type="text"
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5"
                              placeholder="25-30"
                              value={newCasting.age_range}
                              onChange={(e) => setNewCasting({ ...newCasting, age_range: e.target.value })}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Altura (cm)</label>
                            <input
                              type="text"
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5"
                              placeholder="180"
                              value={newCasting.height}
                              onChange={(e) => setNewCasting({ ...newCasting, height: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Ciudad</label>
                          <input
                            type="text"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5"
                            placeholder="Lima, Perú"
                            value={newCasting.city}
                            onChange={(e) => setNewCasting({ ...newCasting, city: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Habilidades</label>
                          <textarea
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5 h-24 resize-none"
                            placeholder="Actuación, Canto, Baile..."
                            value={newCasting.skills}
                            onChange={(e) => setNewCasting({ ...newCasting, skills: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Fotos por Categoría</label>
                        <div className="grid grid-cols-2 gap-3">
                          {['headshot', 'bust', 'medium', 'full_body'].map(cat => (
                            <div key={cat} className="space-y-2">
                              <label className="text-[8px] text-white/20 uppercase font-black block text-center bg-white/5 py-1.5 rounded-lg border border-white/5">{cat}</label>
                              <div className="relative aspect-square rounded-2xl border border-white/10 bg-white/5 overflow-hidden group hover:border-white/20 transition-all">
                                {newCasting.photos.find(p => p.category === cat) ? (
                                  <>
                                    <img
                                      src={newCasting.photos.find(p => p.category === cat)?.preview}
                                      className="w-full h-full object-cover"
                                      alt={cat}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setNewCasting({
                                          ...newCasting,
                                          photos: newCasting.photos.filter(p => p.category !== cat)
                                        });
                                      }}
                                      className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-20"
                                    >
                                      <X size={12} />
                                    </button>
                                  </>
                                ) : (
                                  <div className="absolute inset-0 flex items-center justify-center text-white/10">
                                    <ImageIcon size={24} />
                                  </div>
                                )}
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const preview = URL.createObjectURL(file);
                                      const filtered = newCasting.photos.filter(p => p.category !== cat);
                                      setNewCasting({ ...newCasting, photos: [...filtered, { file, category: cat, preview }] });
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-xl mt-2 active:scale-[0.98]"
                    >
                      {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'CREAR PERFIL & SUBIR FOTOS'}
                    </button>
                  </form>
                </motion.div>
              </div>
            )}

            {/* Add Location Modal */}
            {isAddLocationModalOpen && (
              <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="glass-card w-full max-w-4xl my-8 p-8 rounded-3xl border border-white/10 shadow-2xl relative"
                >
                  <button onClick={() => setIsAddLocationModalOpen(false)} className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors">
                    <X size={20} />
                  </button>
                  <div className="mb-8">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-1">Scouting & Locations</h4>
                    <h3 className="text-xl font-bold text-white uppercase tracking-tight">Nueva Locación</h3>
                    <p className="text-sm text-white/40 mt-1 italic">Registra un espacio para el rodaje.</p>
                  </div>

                  <form onSubmit={handleCreateLocation} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                      <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Nombre</label>
                            <input
                              required
                              type="text"
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5"
                              placeholder="Ej: Sala Moderna"
                              value={newLocation.name}
                              onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Tipo</label>
                            <select
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5 appearance-none cursor-pointer"
                              value={newLocation.type}
                              onChange={(e) => setNewLocation({ ...newLocation, type: e.target.value })}
                            >
                              <option value="Interior" className="bg-neutral-900">Interior</option>
                              <option value="Exterior" className="bg-neutral-900">Exterior</option>
                              <option value="Estudio" className="bg-neutral-900">Estudio</option>
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Ciudad</label>
                            <input
                              required
                              type="text"
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5"
                              value={newLocation.city}
                              onChange={(e) => setNewLocation({ ...newLocation, city: e.target.value })}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Dueño/Contacto</label>
                            <input
                              type="text"
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5"
                              value={newLocation.owner}
                              onChange={(e) => setNewLocation({ ...newLocation, owner: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Dirección</label>
                          <input
                            type="text"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5"
                            value={newLocation.address}
                            onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] text-white/20 uppercase font-black tracking-widest pl-1">Latitud</label>
                            <input
                              type="text"
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5"
                              placeholder="-12.0464"
                              value={newLocation.latitude}
                              onChange={(e) => setNewLocation({ ...newLocation, latitude: e.target.value })}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-white/20 uppercase font-black tracking-widest pl-1">Longitud</label>
                            <input
                              type="text"
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5"
                              placeholder="-77.0428"
                              value={newLocation.longitude}
                              onChange={(e) => setNewLocation({ ...newLocation, longitude: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Resumen / Descripción</label>
                          <textarea
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5 h-20 resize-none"
                            placeholder="Breve descripción..."
                            value={newLocation.description}
                            onChange={(e) => setNewLocation({ ...newLocation, description: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Notas de Scouting</label>
                          <textarea
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5 h-20 resize-none"
                            placeholder="Detalles técnicos (acceso, parqueo, etc)..."
                            value={newLocation.notes}
                            onChange={(e) => setNewLocation({ ...newLocation, notes: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-6">
                        <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Fotos del Espacio</label>
                        <div className="grid grid-cols-3 gap-3">
                          {['exterior', 'interior', 'room', 'kitchen', 'bathroom', 'parking', 'access'].map(cat => (
                            <div key={cat} className="space-y-1.5">
                              <label className="text-[8px] text-white/20 uppercase font-black block text-center truncate px-1 bg-white/5 py-1 rounded border border-white/5">{cat}</label>
                              <div className="relative aspect-square rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:border-white/20 transition-all group">
                                {newLocation.photos.find(p => p.category === cat) ? (
                                  <>
                                    <img
                                      src={newLocation.photos.find(p => p.category === cat)?.preview}
                                      className="w-full h-full object-cover"
                                      alt={cat}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setNewLocation({
                                          ...newLocation,
                                          photos: newLocation.photos.filter(p => p.category !== cat)
                                        });
                                      }}
                                      className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-20"
                                    >
                                      <X size={10} />
                                    </button>
                                  </>
                                ) : (
                                  <div className="absolute inset-0 flex items-center justify-center text-white/10">
                                    <Camera size={20} />
                                  </div>
                                )}
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const preview = URL.createObjectURL(file);
                                      const filtered = newLocation.photos.filter(p => p.category !== cat);
                                      setNewLocation({ ...newLocation, photos: [...filtered, { file, category: cat, preview }] });
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-xl mt-4 active:scale-[0.98]"
                    >
                      {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'REGISTRAR LOCACIÓN & SUBIR FOTOS'}
                    </button>
                  </form>
                </motion.div>
              </div>
            )}
            {/* Add Scouting Report Modal */}
            {isAddScoutingReportModalOpen && (
              <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="glass-card w-full max-w-2xl my-8 p-8 rounded-3xl border border-white/10 shadow-2xl relative"
                >
                  <button onClick={() => setIsAddScoutingReportModalOpen(false)} className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors">
                    <X size={20} />
                  </button>
                  <div className="mb-8">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-1">Field Intelligence</h4>
                    <h3 className="text-xl font-bold text-white uppercase tracking-tight">Nuevo Reporte de Avanzada</h3>
                    <p className="text-sm text-white/40 mt-1 italic">Registra hallazgos, fotos o notas desde el campo.</p>
                  </div>

                  <form onSubmit={handleCreateScoutingReport} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Tipo de Avanzada</label>
                          <select
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5 appearance-none cursor-pointer"
                            value={newScoutingReport.scouting_type}
                            onChange={(e) => setNewScoutingReport({ ...newScoutingReport, scouting_type: e.target.value })}
                          >
                            <option value="general" className="bg-neutral-900">General</option>
                            <option value="location" className="bg-neutral-900">Locación</option>
                            <option value="casting" className="bg-neutral-900">Casting</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Tarea Vinculada (Opcional)</label>
                          <select
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5 appearance-none cursor-pointer"
                            value={newScoutingReport.task_id}
                            onChange={(e) => setNewScoutingReport({ ...newScoutingReport, task_id: e.target.value })}
                          >
                            <option value="" className="bg-neutral-900 text-white/40">Sin tarea específica</option>
                            {tasks.map((task: any) => (
                              <option key={task.id} value={task.id} className="bg-neutral-900">{task.title}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Notas / Hallazgos</label>
                          <textarea
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5 h-32 resize-none"
                            placeholder="Ej: El set tiene buena acústica pero poco parking..."
                            value={newScoutingReport.notes}
                            onChange={(e) => setNewScoutingReport({ ...newScoutingReport, notes: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Fotos / Evidencia</label>
                        <div className="grid grid-cols-2 gap-3">
                          {newScoutingReport.photos.map((p, i) => (
                            <div key={i} className="relative aspect-square rounded-2xl border border-white/10 bg-white/5 overflow-hidden group hover:border-white/20 transition-all">
                              <img src={p.preview} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => setNewScoutingReport({
                                  ...newScoutingReport,
                                  photos: newScoutingReport.photos.filter((_, idx) => idx !== i)
                                })}
                                className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-20"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}

                          {newScoutingReport.photos.length < 8 && (
                            <div className="relative aspect-square rounded-2xl border border-white/10 border-dashed bg-white/5 flex flex-col items-center justify-center gap-2 text-white/10 hover:text-white hover:bg-white/10 transition-all cursor-pointer group">
                              <Camera size={24} className="group-hover:scale-110 transition-transform" />
                              <span className="text-[8px] font-black uppercase tracking-widest">Subir Foto</span>
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) => {
                                  const files = Array.from(e.target.files || []);
                                  const newPhotos = files.map(file => ({
                                    file,
                                    preview: URL.createObjectURL(file)
                                  }));
                                  setNewScoutingReport({
                                    ...newScoutingReport,
                                    photos: [...newScoutingReport.photos, ...newPhotos].slice(0, 8)
                                  });
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-xl mt-4 active:scale-[0.98]"
                    >
                      {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'ENVIAR REPORTE A PRODUCCIÓN'}
                    </button>
                  </form>
                </motion.div>
              </div>
            )}

            {/* Technical Scouting Report Modal (from Location) */}
            {isScoutingModalOpen && selectedLocation && (
              <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="glass-card w-full max-w-4xl my-8 p-8 rounded-3xl border border-white/10 shadow-2xl relative"
                >
                  <button onClick={() => setIsScoutingModalOpen(false)} className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors">
                    <X size={20} />
                  </button>
                  <div className="mb-8">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-1">Scouting Intelligence</h4>
                    <h3 className="text-xl font-bold text-white uppercase tracking-tight">Reporte Técnico de Scouting</h3>
                    <p className="text-sm text-white/40 mt-1 italic">Locación: {selectedLocation.name}</p>
                  </div>

                  <form onSubmit={handleCreateScoutingReport} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                      <div className="space-y-6">
                        <div className="space-y-1">
                          <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Resumen del Scouting</label>
                          <textarea
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5 h-32 resize-none"
                            placeholder="Describe las impresiones generales, luz, sonido ambiental..."
                            value={newScoutingReport.summary}
                            onChange={(e) => setNewScoutingReport({ ...newScoutingReport, summary: e.target.value })}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Hora inicio Sol</label>
                            <input
                              type="time"
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5"
                              value={newScoutingReport.sun_start}
                              onChange={(e) => setNewScoutingReport({ ...newScoutingReport, sun_start: e.target.value })}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Hora fin Sol</label>
                            <input
                              type="time"
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5"
                              value={newScoutingReport.sun_end}
                              onChange={(e) => setNewScoutingReport({ ...newScoutingReport, sun_end: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Acceso Eléctrico / Potencia</label>
                          <input
                            type="text"
                            placeholder="Ej: 220V, Trifásica disponible..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5"
                            value={newScoutingReport.power_access}
                            onChange={(e) => setNewScoutingReport({ ...newScoutingReport, power_access: e.target.value })}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Observaciones de Ruido</label>
                          <input
                            type="text"
                            placeholder="Ej: Tráfico moderado, construcción cerca..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5"
                            value={newScoutingReport.noise_notes}
                            onChange={(e) => setNewScoutingReport({ ...newScoutingReport, noise_notes: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-6">
                        <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Evidencia Fotográfica (Técnica)</label>
                        <div className="grid grid-cols-2 gap-4">
                          {[1, 2, 3, 4].map(num => (
                            <div key={num} className="relative aspect-video rounded-2xl border border-white/10 bg-white/5 overflow-hidden group hover:border-white/20 transition-all">
                              {newScoutingReport.photos.find(p => p.id === num) ? (
                                <>
                                  <img
                                    src={newScoutingReport.photos.find(p => p.id === num)?.preview}
                                    className="w-full h-full object-cover"
                                    alt={`Scouting ${num}`}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setNewScoutingReport({
                                        ...newScoutingReport,
                                        photos: newScoutingReport.photos.filter(p => p.id !== num)
                                      });
                                    }}
                                    className="absolute top-2 right-2 p-2 bg-black/60 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity z-20"
                                  >
                                    <X size={14} />
                                  </button>
                                </>
                              ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/10 gap-2">
                                  <Camera size={24} />
                                  <span className="text-[8px] uppercase font-black tracking-tighter">Subir Foto {num}</span>
                                </div>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const preview = URL.createObjectURL(file);
                                    const filtered = newScoutingReport.photos.filter(p => p.id !== num);
                                    setNewScoutingReport({ ...newScoutingReport, photos: [...filtered, { id: num, file, preview }] });
                                  }
                                }}
                              />
                            </div>
                          ))}
                        </div>
                        <p className="text-[10px] text-white/20 italic text-center px-4">
                          * Captura detalles técnicos como tableros eléctricos, accesos de camiones y puntos de cámara.
                        </p>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-xl mt-4 active:scale-[0.98]"
                    >
                      {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'FINALIZAR REPORTE DE SCOUTING'}
                    </button>
                  </form>
                </motion.div>
              </div>
            )}


            {/* Scouting Report Detail Modal */}
            {isScoutingDetailModalOpen && selectedScoutingReport && (
              <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsScoutingDetailModalOpen(false)}></div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="relative glass-card w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] border border-white/10 overflow-hidden flex flex-col shadow-2xl"
                >
                  <div className="p-8 border-b border-white/5 flex items-center justify-between shrink-0 bg-white/[0.02]">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shadow-inner">
                        {selectedScoutingReport.profiles?.avatar_url ? (
                          <img src={selectedScoutingReport.profiles.avatar_url} className="w-full h-full object-cover" />
                        ) : (
                          <Users size={24} className="text-white/20" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Intelligence Report</span>
                          <span className="w-1 h-1 rounded-full bg-white/20"></span>
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{selectedScoutingReport.scouting_type}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Reporte de Avanzada</h3>
                        <p className="text-xs text-white/40 mt-0.5">
                          Generado por <span className="text-white font-bold">{selectedScoutingReport.profiles?.full_name}</span> • {new Date(selectedScoutingReport.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleExportScoutingPDF(selectedScoutingReport)}
                        className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-neutral-200 transition-all shadow-xl active:scale-95"
                      >
                        <Download size={14} /> Export PDF
                      </button>
                      <button
                        onClick={() => setIsScoutingDetailModalOpen(false)}
                        className="p-3 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white"
                      >
                        <X size={24} />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-12">
                    {/* Insights & Notes */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                          <FileText size={16} />
                        </div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-white/60">Notas & Observaciones</h4>
                      </div>
                      <div className="glass-card p-8 rounded-3xl border border-white/5 bg-white/[0.02] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/20"></div>
                        <p className="text-lg text-white/90 leading-relaxed italic font-medium">"{selectedScoutingReport.notes}"</p>
                        {selectedScoutingReport.summary && (
                          <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-2 gap-8">
                            <div>
                              <span className="text-[10px] text-white/20 font-black uppercase tracking-widest block mb-2">Resumen Técnico</span>
                              <p className="text-sm text-white/60 leading-relaxed">{selectedScoutingReport.summary}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              {selectedScoutingReport.sun_start && (
                                <div>
                                  <span className="text-[10px] text-white/20 font-black uppercase tracking-widest block mb-1">Luz Solar</span>
                                  <p className="text-sm text-white font-bold">{selectedScoutingReport.sun_start} - {selectedScoutingReport.sun_end}</p>
                                </div>
                              )}
                              {selectedScoutingReport.power_access && (
                                <div>
                                  <span className="text-[10px] text-white/20 font-black uppercase tracking-widest block mb-1">Energía</span>
                                  <p className="text-sm text-white font-bold">{selectedScoutingReport.power_access}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Photos Gallery */}
                    {selectedScoutingReport.scouting_report_photos?.length > 0 && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                            <Camera size={16} />
                          </div>
                          <h4 className="text-xs font-black uppercase tracking-widest text-white/60">Evidencia Visual ({selectedScoutingReport.scouting_report_photos.length})</h4>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                          {selectedScoutingReport.scouting_report_photos.map((photo: any, i: number) => (
                            <motion.div 
                              key={i} 
                              whileHover={{ scale: 1.02 }}
                              className="aspect-video rounded-3xl border border-white/10 bg-white/5 overflow-hidden group relative cursor-pointer shadow-lg"
                              onClick={() => window.open(photo.file_url, '_blank')}
                            >
                              <img
                                src={photo.file_url}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Ver en alta resolución</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Meta Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                      {selectedScoutingReport.tasks?.title && (
                        <div className="space-y-4">
                          <label className="text-[10px] text-white/20 uppercase font-black tracking-widest pl-1">Tarea Vinculada</label>
                          <div className="glass-card p-5 rounded-2xl border border-white/5 bg-white/[0.01] flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400 shadow-inner">
                                <ClipboardCheck size={20} />
                              </div>
                              <div>
                                <span className="text-sm font-bold text-white block">{selectedScoutingReport.tasks.title}</span>
                                <span className="text-[10px] text-white/40 uppercase font-black tracking-tighter">Workflow Relation</span>
                              </div>
                            </div>
                            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] text-white/60 font-black uppercase tracking-widest">{selectedScoutingReport.tasks.status}</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="space-y-4">
                        <label className="text-[10px] text-white/20 uppercase font-black tracking-widest pl-1">Ubicación del Archivo</label>
                        <div className="glass-card p-5 rounded-2xl border border-white/5 bg-white/[0.01] flex items-center gap-4">
                          <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-500 shadow-inner">
                            <MapPin size={20} />
                          </div>
                          <div>
                            <span className="text-sm font-bold text-white block">Servidor Seguro 916</span>
                            <span className="text-[10px] text-white/40 uppercase font-black tracking-tighter">ID: {selectedScoutingReport.id.slice(0, 12)}...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Task Detail Modal */}
            <AnimatePresence>
              {selectedTask && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="glass-card w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col"
                  >
                    {/* Header */}
                    <div className="p-8 border-b border-white/5 flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${selectedTask.priority === 'urgent' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' :
                          selectedTask.priority === 'high' ? 'bg-orange-500' :
                            selectedTask.priority === 'medium' ? 'bg-blue-500' : 'bg-white/20'
                          }`} />
                        <div>
                          {hasPermission('edit_project') ? (
                            <input
                              type="text"
                              className="text-2xl font-black text-white uppercase tracking-tight bg-transparent border-none focus:ring-0 w-full hover:bg-white/5 rounded px-2"
                              value={selectedTask.title}
                              onBlur={(e) => handleUpdateTaskField(selectedTask.id, 'title', e.target.value)}
                              onChange={(e) => setSelectedTask({...selectedTask, title: e.target.value})}
                            />
                          ) : (
                            <h2 className="text-2xl font-black text-white uppercase tracking-tight px-2">{selectedTask.title}</h2>
                          )}
                          <div className="flex items-center gap-4 mt-1 px-2">
                            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{selectedTask.area}</span>
                            <span className="w-1 h-1 rounded-full bg-white/10" />
                            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">DUE: {selectedTask.due_date}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedTask(null)}
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all"
                      >
                        <X size={24} />
                      </button>
                    </div>

                    <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                      {/* Left: Info & Attachments */}
                      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar border-r border-white/5 space-y-8">
                        <div>
                          <h3 className="text-[10px] text-white/40 uppercase font-black tracking-[0.2em] mb-4">Descripción</h3>
                          {hasPermission('edit_project') ? (
                            <textarea
                              className="w-full text-sm text-white/80 leading-relaxed bg-white/[0.02] p-4 rounded-2xl border border-white/5 focus:outline-none focus:border-white/20 min-h-[100px]"
                              value={selectedTask.description || ''}
                              onBlur={(e) => handleUpdateTaskField(selectedTask.id, 'description', e.target.value)}
                              onChange={(e) => setSelectedTask({...selectedTask, description: e.target.value})}
                            />
                          ) : (
                            <p className="text-sm text-white/80 leading-relaxed bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                              {selectedTask.description || 'Sin descripción adicional.'}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                          <div>
                            <h3 className="text-[10px] text-white/40 uppercase font-black tracking-[0.2em] mb-4">Responsable</h3>
                            <select
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5 appearance-none cursor-pointer"
                              value={selectedTask.assigned_to || ''}
                              onChange={(e) => handleUpdateTaskField(selectedTask.id, 'assigned_to', e.target.value)}
                            >
                              <option value="" className="bg-neutral-900 text-white/40">Sin asignar</option>
                              {crew.map((member: any) => (
                                <option key={member.profiles?.id} value={member.profiles?.id} className="bg-neutral-900">
                                  {member.profiles?.full_name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <h3 className="text-[10px] text-white/40 uppercase font-black tracking-[0.2em] mb-4">Prioridad</h3>
                            <select
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5 appearance-none cursor-pointer"
                              value={selectedTask.priority || 'medium'}
                              onChange={(e) => handleUpdateTaskField(selectedTask.id, 'priority', e.target.value)}
                            >
                              <option value="low" className="bg-neutral-900">Baja</option>
                              <option value="medium" className="bg-neutral-900">Media</option>
                              <option value="high" className="bg-neutral-900">Alta</option>
                              <option value="urgent" className="bg-neutral-900">Urgente</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[10px] text-white/40 uppercase font-black tracking-[0.2em]">Archivos Adjuntos</h3>
                            <div className="relative">
                              <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                disabled={isUploadingAttachment}
                                onChange={handleUploadAttachment}
                              />
                              <button className="text-[10px] font-black text-blue-400 hover:text-blue-300 uppercase tracking-widest flex items-center gap-2">
                                {isUploadingAttachment ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                                {isUploadingAttachment ? 'Subiendo...' : 'Subir Archivo'}
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {taskAttachments.length > 0 ? taskAttachments.map((att) => {
                              const fileName = att.file_url.split('/').pop()?.split('_').slice(1).join('_') || 'Archivo adjunto';
                              return (
                                <div key={att.id} className="group relative">
                                  <a
                                    href={att.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="glass-card p-4 rounded-2xl border border-white/5 flex items-center gap-4 hover:bg-white/5 transition-all"
                                  >
                                    <div className="p-3 bg-white/5 text-blue-400 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-all shadow-lg">
                                      {getFileIcon(att.file_url)}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                      <p className="text-xs font-bold text-white truncate">{fileName}</p>
                                      <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mt-0.5">Subido por {att.profiles?.full_name?.split(' ')[0]}</p>
                                    </div>
                                  </a>
                                  <button
                                    onClick={() => handleDeleteAttachment(att)}
                                    className="absolute -top-2 -right-2 p-1.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white z-10"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              );
                            }) : (
                              <div className="col-span-full p-12 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-white/5">
                                <Upload size={32} strokeWidth={1} />
                                <span className="text-[10px] uppercase font-black mt-4 tracking-[0.2em]">Sin documentos adjuntos</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Comments Thread */}
                      <div className="w-full md:w-80 lg:w-96 bg-black/20 flex flex-col overflow-hidden">
                        <div className="p-6 border-b border-white/5">
                          <h3 className="text-[10px] text-white/40 uppercase font-black tracking-[0.2em] flex items-center gap-2">
                            <ClipboardCheck size={14} className="text-blue-400" /> Conversación
                          </h3>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                          {taskComments.length > 0 ? taskComments.map((comment) => (
                            <div key={comment.id} className="group space-y-2 relative">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {comment.profiles?.avatar_url ? (
                                    <img src={comment.profiles.avatar_url} className="w-5 h-5 rounded-full ring-1 ring-white/10" />
                                  ) : (
                                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[8px] font-black border border-white/5">
                                      {comment.profiles?.full_name?.charAt(0) || '?'}
                                    </div>
                                  )}
                                  <span className="text-[10px] font-black text-white/80 uppercase tracking-tighter">{comment.profiles?.full_name}</span>
                                  <span className="text-[9px] text-white/20 uppercase font-black tracking-widest">
                                    {new Date(comment.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                                <button
                                  onClick={() => handleDeleteComment(comment.id)}
                                  className="p-1 text-white/10 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                  <Trash2 size={10} />
                                </button>
                              </div>
                              <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5 shadow-sm">
                                <p className="text-xs text-white/70 leading-relaxed font-medium">{comment.comment}</p>
                              </div>
                            </div>
                          )) : (
                            <div className="h-full flex flex-col items-center justify-center text-white/5 italic">
                              <p className="text-xs font-bold uppercase tracking-widest">Inicia la conversación...</p>
                            </div>
                          )}
                          <div ref={commentsEndRef} />
                        </div>

                        {/* Comment Input */}
                        <form onSubmit={handleAddComment} className="p-6 bg-black/40 border-t border-white/5">
                          <div className="relative group">
                            <textarea
                              placeholder="Escribe un comentario..."
                              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 pb-12 text-xs text-white focus:outline-none focus:border-white/20 transition-all resize-none h-24"
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                            />
                            <button
                              type="submit"
                              disabled={!newComment.trim()}
                              className="absolute bottom-3 right-3 px-4 py-2 bg-white text-black text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-neutral-200 disabled:opacity-20 disabled:hover:bg-white transition-all shadow-xl"
                            >
                              Enviar
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
        {/* Edit Project Modal */}
        <AnimatePresence>
          {isEditProjectModalOpen && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditProjectModalOpen(false)}></div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="glass-card w-full max-w-lg p-8 rounded-3xl border border-white/10 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsEditProjectModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="mb-8">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-1">Project Settings</h4>
                <h3 className="text-xl font-bold text-white uppercase tracking-tight">Configuración del Proyecto</h3>
                <p className="text-sm text-white/40 mt-1 italic">Actualiza los detalles y el estado del rodaje.</p>
              </div>

              <form onSubmit={handleEditProject} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Nombre de la Producción</label>
                  <input
                    required
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-white/5"
                    value={editProjectData.name}
                    onChange={(e) => setEditProjectData({ ...editProjectData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Cliente / Casa Productora</label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-white/5"
                    value={editProjectData.client_name}
                    onChange={(e) => setEditProjectData({ ...editProjectData, client_name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Fecha de Inicio</label>
                    <input
                      type="date"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-white/5"
                      value={editProjectData.start_date}
                      onChange={(e) => setEditProjectData({ ...editProjectData, start_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Estado de Producción</label>
                    <select
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-white/5 appearance-none cursor-pointer uppercase"
                      value={editProjectData.status}
                      onChange={(e) => setEditProjectData({ ...editProjectData, status: e.target.value })}
                    >
                      <option value="draft" className="bg-neutral-900">Borrador</option>
                      <option value="pre-production" className="bg-neutral-900">Pre-producción</option>
                      <option value="production" className="bg-neutral-900">En Rodaje</option>
                      <option value="post-production" className="bg-neutral-900">Post-producción</option>
                      <option value="completed" className="bg-neutral-900">Completado</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Fotografía de Portada (Key Art)</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/5 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-white/10 file:text-white hover:file:bg-white/20 transition-all"
                    onChange={(e) => setEditProjectData({ ...editProjectData, cover_image: e.target.files?.[0] || null })}
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-neutral-200 transition-all shadow-xl flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'SINCRONIZAR CAMBIOS'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Casting Gallery Modal */}
        <AnimatePresence>
          {isCastingGalleryOpen && selectedCastingProfile && (
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsCastingGalleryOpen(false)}></div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="glass-card w-full max-w-6xl h-[90vh] rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col overflow-hidden relative"
              >
                <button
                  onClick={() => setIsCastingGalleryOpen(false)}
                  className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all z-20 backdrop-blur-md border border-white/10"
                >
                  <X size={20} />
                </button>

                <div className="flex flex-1 h-full overflow-hidden">
                  {/* Sidebar Info - Cinematic Dark */}
                  <div className="w-96 bg-black/40 border-r border-white/5 p-10 flex flex-col overflow-y-auto">
                    <div className="aspect-[3/4] w-full rounded-2xl border border-white/10 overflow-hidden mb-8 shadow-2xl bg-white/5 relative group">
                      {selectedCastingProfile.photo_url || selectedCastingProfile.casting_photos?.[0]?.file_url ? (
                        <img src={selectedCastingProfile.photo_url || selectedCastingProfile.casting_photos?.[0]?.file_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/10"><Users size={48} strokeWidth={1} /></div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                    </div>

                    <div className="space-y-1 mb-8">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Talent Profile</h4>
                      <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-[0.9]">{selectedCastingProfile.full_name}</h2>
                    </div>

                    <div className="flex gap-2 mb-10">
                      <span className="text-[10px] font-black bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full uppercase tracking-widest border border-blue-500/20">{selectedCastingProfile.status || 'NEW'}</span>
                      <span className="text-[10px] font-black bg-white/5 text-white/60 px-3 py-1 rounded-full uppercase tracking-widest border border-white/10">{selectedCastingProfile.city || 'Ubicación N/A'}</span>
                    </div>

                    <div className="space-y-8 flex-1">
                      <div className="space-y-2">
                        <p className="text-[10px] text-white/30 uppercase font-black tracking-widest border-b border-white/5 pb-2">Especificaciones Físicas</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[9px] text-white/20 uppercase font-bold">Rango Edad</p>
                            <p className="text-sm font-black text-white">{selectedCastingProfile.age_range || '--'} Años</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-white/20 uppercase font-bold">Estatura</p>
                            <p className="text-sm font-black text-white">{selectedCastingProfile.height_cm || '--'} cm</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <p className="text-[10px] text-white/30 uppercase font-black tracking-widest border-b border-white/5 pb-2">Habilidades & Skills</p>
                        <div className="flex flex-wrap gap-1.5 text-white">
                          {selectedCastingProfile.skills ? selectedCastingProfile.skills.split(',').map((s: string, i: number) => (
                            <span key={i} className="text-[10px] font-bold bg-white/5 border border-white/10 text-white/80 px-3 py-1 rounded-lg uppercase">{s.trim()}</span>
                          )) : <span className="text-sm text-white/20 italic">No registradas</span>}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <p className="text-[10px] text-white/30 uppercase font-black tracking-widest border-b border-white/5 pb-2">Información de Contacto</p>
                        <p className="text-sm font-medium text-white/60 leading-relaxed">{selectedCastingProfile.contact_info || 'Información de contacto restringida en vista previa.'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Main Gallery Area - White Content on Dark Background */}
                  <div className="flex-1 p-12 overflow-y-auto bg-black/20">
                    <div className="flex items-center justify-between mb-10">
                      <h3 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                        <Camera size={24} className="text-blue-400" /> Expanded Media Gallery
                      </h3>
                      <p className="text-[10px] text-white/20 uppercase font-black tracking-[0.2em]">{selectedCastingProfile.casting_photos?.length || 0} ASSETS DISPONIBLES</p>
                    </div>

                    {selectedCastingProfile.casting_photos?.length > 0 ? (
                      <div className="space-y-16">
                        {[{ id: 'headshot', label: 'HEADSHOTS / CLOSE-UPS' }, { id: 'bust', label: 'PLANO BUSTO (PORTFOLIO)' }, { id: 'medium', label: 'PLANO MEDIO (ACCION)' }, { id: 'full_body', label: 'CUERPO ENTERO (FULL BODY)' }].map(catItem => {
                          const photos = selectedCastingProfile.casting_photos.filter((p: any) => p.photo_type === catItem.id);
                          if (photos.length === 0) return null;
                          return (
                            <div key={catItem.id} className="space-y-6">
                              <h4 className="text-xs font-black text-white/30 uppercase tracking-[0.3em] flex items-center gap-4">
                                {catItem.label}
                                <div className="h-px flex-1 bg-white/5" />
                              </h4>
                              <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                                {photos.map((p: any) => (
                                  <div key={p.id} className="aspect-[3/4] rounded-2xl border border-white/10 overflow-hidden shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 group bg-white/5 relative">
                                    <img src={p.file_url} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                                      <a href={p.file_url} target="_blank" rel="noreferrer" className="p-4 bg-white text-black rounded-full hover:scale-110 transition-transform shadow-2xl">
                                        <Maximize2 size={24} />
                                      </a>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="h-[60vh] flex flex-col items-center justify-center text-white/10 space-y-6">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center border border-white/10"><Camera size={40} strokeWidth={1} /></div>
                        <p className="font-bold uppercase tracking-widest text-sm">No exhaustive media library found</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>


        {/* Crew Member Sidebar */}
        <AnimatePresence>
          {isCrewSidebarOpen && selectedCrewMember && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsCrewSidebarOpen(false)}
                className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[140]"
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-[150] border-l border-gray-100 flex flex-col"
              >
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs flex items-center gap-2">
                    <Users size={14} className="text-indigo-600" /> Perfil del Equipo
                  </h3>
                  <button onClick={() => setIsCrewSidebarOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-white rounded-full transition-all">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                  <div className="p-8 pb-10 border-b border-gray-50 flex flex-col items-center text-center bg-white relative">
                    <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-indigo-50 to-white opacity-50" />
                    {selectedCrewMember.profiles?.avatar_url ? (
                      <div className="w-24 h-24 rounded-3xl border-4 border-white shadow-lg overflow-hidden bg-white mb-4 relative z-10">
                        <img src={selectedCrewMember.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-3xl border-4 border-white shadow-lg bg-indigo-50 text-indigo-300 flex items-center justify-center text-3xl font-black mb-4 relative z-10">
                        {selectedCrewMember.profiles?.full_name?.charAt(0) || '?'}
                      </div>
                    )}
                    <h2 className="text-xl font-bold text-gray-900 leading-tight relative z-10">{selectedCrewMember.profiles?.full_name}</h2>
                    
                    {hasPermission('manage_crew') ? (
                      <div className="mt-4 relative z-10 w-full max-w-[200px]">
                        <select
                          className="w-full bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl uppercase font-black tracking-widest text-[10px] border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-200 appearance-none text-center cursor-pointer"
                          value={selectedCrewMember.role_id}
                          onChange={(e) => handleUpdateMemberRole(selectedCrewMember.id, e.target.value)}
                        >
                          {roles.map((r: any) => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                          <ChevronRight size={10} className="rotate-90 text-indigo-400" />
                        </div>
                      </div>
                    ) : (
                      <span className="text-[10px] bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full uppercase font-black tracking-widest mt-3 block relative z-10 border border-indigo-100">
                        {selectedCrewMember.roles?.name || 'Staff'}
                      </span>
                    )}
                    
                    <div className="flex items-center justify-center gap-4 mt-6 w-full relative z-10">
                      <a href={`tel:${selectedCrewMember.profiles?.phone || ''}`} className="flex-1 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-600 hover:text-indigo-600 hover:border-indigo-100 transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest">
                        <Phone size={12} /> Llamar
                      </a>
                      <a href={`mailto:${selectedCrewMember.profiles?.email || ''}`} className="flex-1 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-600 hover:text-indigo-600 hover:border-indigo-100 transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest">
                        <Mail size={12} /> Email
                      </a>
                    </div>
                  </div>
                  
                  <div className="p-8 bg-gray-50/30 min-h-full">
                     <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                       <CheckSquare size={12} /> Tareas Asignadas en este Proyecto
                     </h4>
                     
                     <div className="space-y-4">
                       {tasks.filter((t: any) => t.assigned_to === selectedCrewMember.profile_id).length > 0 ? (
                         tasks.filter((t: any) => t.assigned_to === selectedCrewMember.profile_id).map((task: any) => (
                           <div key={task.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group" onClick={() => { setSelectedTask(task); fetchTaskDetails(task.id); setIsCrewSidebarOpen(false); }}>
                             <div className="flex items-center justify-between mb-2">
                               <div className={`w-8 h-1.5 rounded-full ${task.priority === 'urgent' ? 'bg-red-500' : task.priority === 'high' ? 'bg-orange-500' : task.priority === 'medium' ? 'bg-indigo-500' : 'bg-gray-200'}`} />
                               <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                                  task.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                                  task.status === 'in_progress' ? 'bg-blue-50 text-blue-600' :
                                  task.status === 'blocked' ? 'bg-red-50 text-red-600' :
                                  'bg-gray-50 text-gray-500'
                               }`}>
                                 {task.status === 'completed' ? 'Completado' : task.status === 'in_progress' ? 'En Proceso' : task.status === 'blocked' ? 'Bloqueada' : 'Pendiente'}
                               </span>
                             </div>
                             <h5 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight mb-3">{task.title}</h5>
                             <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase font-black tracking-widest">
                               <Calendar size={12} /> {task.due_date ? new Date(task.due_date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }) : 'Sin fecha'}
                             </div>
                           </div>
                         ))
                       ) : (
                         <div className="text-center py-10 bg-white rounded-2xl border border-gray-100 border-dashed">
                           <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3 text-gray-300">
                             <CheckSquare size={20} />
                           </div>
                           <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Aún no tiene tareas</p>
                         </div>
                       )}
                     </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isAddBudgetModalOpen && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="glass-card w-full max-w-md p-8 rounded-3xl border border-white/10 shadow-2xl relative"
              >
                <button onClick={() => setIsAddBudgetModalOpen(false)} className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors">
                  <X size={20} />
                </button>
                <div className="mb-8">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-1">Financial Planning</h4>
                  <h3 className="text-xl font-bold text-white uppercase tracking-tight">Planificar Presupuesto</h3>
                  <p className="text-sm text-white/40 mt-1 italic">Define el monto planeado para una categoría operativa.</p>
                </div>

                <form onSubmit={handleCreateBudget} className="space-y-6">
                  <div className="space-y-1">
                    <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Categoría de Gasto</label>
                    <select
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5 appearance-none uppercase cursor-pointer"
                      value={newBudget.category}
                      onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                    >
                      <option value="casting" className="bg-neutral-900">Casting & Talent</option>
                      <option value="locations" className="bg-neutral-900">Locaciones & Scouting</option>
                      <option value="equipment" className="bg-neutral-900">Equipamiento Técnico</option>
                      <option value="transport" className="bg-neutral-900">Transporte & Logística</option>
                      <option value="catering" className="bg-neutral-900">Catering & Services</option>
                      <option value="crew" className="bg-neutral-900">Personal / Crew</option>
                      <option value="postproduction" className="bg-neutral-900">Postproducción</option>
                      <option value="misc" className="bg-neutral-900">Otros / Misc</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Monto Planeado (USD)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400 font-bold">$</span>
                      <input
                        type="number"
                        required
                        placeholder="0.00"
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3.5 text-sm font-black text-white focus:outline-none focus:ring-2 focus:ring-white/5"
                        value={newBudget.planned_amount || ''}
                        onChange={(e) => setNewBudget({ ...newBudget, planned_amount: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 mt-4 active:scale-[0.98]"
                  >
                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'AUTORIZAR PRESUPUESTO'}
                  </button>
                </form>
              </motion.div>
            </div>
          )}

          {isAddExpenseModalOpen && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="glass-card w-full max-w-lg my-8 p-8 rounded-3xl border border-white/10 shadow-2xl relative"
              >
                <button onClick={() => setIsAddExpenseModalOpen(false)} className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors">
                  <X size={20} />
                </button>
                <div className="mb-8">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400 mb-1">Expense Tracking</h4>
                  <h3 className="text-xl font-bold text-white uppercase tracking-tight">Registrar Gasto Real</h3>
                  <p className="text-sm text-white/40 mt-1 italic">Ingresa los detalles del gasto operativo para el proyecto.</p>
                </div>

                <form onSubmit={handleCreateExpense} className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Descripción del Gasto</label>
                    <input
                      type="text"
                      placeholder="Ej: Pago de locación dia 1"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5"
                      value={newExpense.description}
                      onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Categoría</label>
                    <select
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5 appearance-none uppercase cursor-pointer"
                      value={newExpense.category}
                      onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                    >
                      <option value="casting" className="bg-neutral-900">Casting</option>
                      <option value="locations" className="bg-neutral-900">Locaciones</option>
                      <option value="equipment" className="bg-neutral-900">Equipamiento</option>
                      <option value="transport" className="bg-neutral-900">Transporte</option>
                      <option value="catering" className="bg-neutral-900">Catering</option>
                      <option value="crew" className="bg-neutral-900">Personal / Crew</option>
                      <option value="postproduction" className="bg-neutral-900">Postproducción</option>
                      <option value="misc" className="bg-neutral-900">Otros / Misc</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Monto ($)</label>
                    <input
                      type="number"
                      required
                      placeholder="0.00"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-black text-white focus:outline-none focus:ring-2 focus:ring-white/5"
                      value={newExpense.amount || ''}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Proveedor (Opcional)</label>
                    <select
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5 appearance-none cursor-pointer"
                      value={newExpense.supplier_id}
                      onChange={(e) => setNewExpense({ ...newExpense, supplier_id: e.target.value })}
                    >
                      <option value="" className="bg-neutral-900 text-white/40">Ninguno</option>
                      {allSuppliers.map(s => <option key={s.id} value={s.id} className="bg-neutral-900">{s.name}</option>)}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Fecha de Gasto</label>
                    <input
                      type="date"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5"
                      value={newExpense.expense_date}
                      onChange={(e) => setNewExpense({ ...newExpense, expense_date: e.target.value })}
                    />
                  </div>

                  <div className="col-span-2 space-y-1 pt-2">
                    <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Día de Rodaje Relacionado (Opcional)</label>
                    <select
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/5 appearance-none cursor-pointer"
                      value={newExpense.related_call_sheet}
                      onChange={(e) => setNewExpense({ ...newExpense, related_call_sheet: e.target.value })}
                    >
                      <option value="" className="bg-neutral-900 text-white/40">Seleccionar día...</option>
                      {callSheets.map((cs: any) => (
                        <option key={cs.id} value={cs.id} className="bg-neutral-900">
                          {new Date(cs.shoot_date).toLocaleDateString()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-4 col-span-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-xl active:scale-[0.98]"
                    >
                      {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'REGISTRAR GASTO'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Terminal Modals */}
        <AnimatePresence>
          {isCastingTerminalOpen && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 overflow-y-auto">
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 40 }}>
                <CastingTerminal onSave={handleSaveCastingTerminal} onClose={() => setIsCastingTerminalOpen(false)} />
              </motion.div>
            </div>
          )}
          {isLocationTerminalOpen && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 overflow-y-auto">
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 40 }}>
                <LocationTerminal onSave={handleSaveLocationTerminal} onClose={() => setIsLocationTerminalOpen(false)} />
              </motion.div>
            </div>
          )}
          {isArtTerminalOpen && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 overflow-y-auto">
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 40 }}>
                <ArtTerminal onSave={handleSaveArtTerminal} onClose={() => setIsArtTerminalOpen(false)} />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Global Add Task Modal */}
        <AnimatePresence>
          {isAddTaskModalOpen && (
            <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto font-sans">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="glass-card w-full max-w-lg my-8 p-8 rounded-[3rem] border border-white/10 shadow-2xl relative"
              >
                <button onClick={() => setIsAddTaskModalOpen(false)} className="absolute top-8 right-8 p-2 text-white/40 hover:text-white transition-colors">
                  <X size={24} />
                </button>
                <div className="mb-10">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-2">Production Workflow</h4>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">Nueva Tarea de Producción</h3>
                  <p className="text-sm text-white/40 mt-1 italic">Define una acción clara para el equipo operativo.</p>
                </div>

                <form onSubmit={handleAddTask} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-2">Título de la Tarea</label>
                    <input
                      required
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-white/5"
                      placeholder="Ej: Revisión de Guion Técnico"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-2">Prioridad</label>
                      <select
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-white/5 appearance-none cursor-pointer uppercase"
                        value={newTask.priority}
                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                      >
                        <option value="low" className="bg-neutral-900">Baja</option>
                        <option value="medium" className="bg-neutral-900">Media</option>
                        <option value="high" className="bg-neutral-900">Alta</option>
                        <option value="urgent" className="bg-neutral-900">Urgente</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-2">Departamento / Área</label>
                      <input
                        type="text"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-white/5"
                        placeholder="Producción, Arte, etc."
                        value={newTask.area}
                        onChange={(e) => setNewTask({ ...newTask, area: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-2">Responsable Asignado</label>
                    <select
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-white/5 appearance-none cursor-pointer"
                      value={newTask.assigned_to}
                      onChange={(e) => setNewTask({ ...newTask, assigned_to: e.target.value })}
                    >
                      <option value="" className="bg-neutral-900 text-white/40">Seleccionar miembro del crew...</option>
                      {crew.map((member: any) => (
                        <option key={member.profiles?.id} value={member.profiles?.id} className="bg-neutral-900">
                          {member.profiles?.full_name} — {member.roles?.name || 'Staff'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-2">Fecha Inicio</label>
                      <input
                        type="date"
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-white/5"
                        value={newTask.start_date}
                        onChange={(e) => setNewTask({ ...newTask, start_date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-2">Fecha Límite</label>
                      <input
                        type="date"
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-white/5"
                        value={newTask.due_date}
                        onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-2">Instrucciones Adicionales</label>
                    <textarea
                      className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-white/5 h-32 resize-none"
                      placeholder="Describe los detalles de la tarea..."
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    />
                  </div>

                  <div className="pt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-5 bg-white text-black rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-2xl active:scale-[0.98]"
                    >
                      {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : 'CONFIRMAR Y ASIGNAR TAREA'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
