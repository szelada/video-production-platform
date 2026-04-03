'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, CheckSquare, Camera, 
  Truck, BarChart3, ChevronRight 
} from 'lucide-react';

// Sub-components
import { PhaseProOverview } from './pro/PhaseProOverview';
import { PhaseProCrew } from './pro/PhaseProCrew';
import { PhaseProTasks } from './pro/PhaseProTasks';
import { PhaseProCasting } from './pro/PhaseProCasting';
import { PhaseProReports } from './pro/PhaseProReports';
import { PhaseProLogistics } from './pro/PhaseProLogistics';

interface PhaseProProps {
  activeSubTab: string;
  setActiveSubTab: (tab: any) => void;
  isAlternateView: boolean;
  project: any;
  tasks: any[];
  crew: any[];
  locations: any[];
  setIsAddExpenseModalOpen: (open: boolean) => void;
  setIsAddSupplierModalOpen: (open: boolean) => void;
  setIsAddCastingModalOpen: (open: boolean) => void;
  setIsAddLocationModalOpen: (open: boolean) => void;
  activities: any[];
  hasPermission: (perm: string) => boolean;
  setIsAddMemberModalOpen: (open: boolean) => void;
  setSelectedCrewMember: (member: any) => void;
  setIsCrewSidebarOpen: (open: boolean) => void;
  handleRemoveMember: (id: string) => void;
  isAddMemberModalOpen: boolean;
  handleAddMember: (e: React.FormEvent) => void;
  newMember: { profile_id: string; role_id: string };
  setNewMember: (member: { profile_id: string; role_id: string }) => void;
  profiles: any[];
  roles: any[];
  isSubmitting: boolean;
  taskViewMode: 'kanban' | 'gantt';
  setTaskViewMode: (mode: 'kanban' | 'gantt') => void;
  handleUpdateTaskStatus: (taskId: string, status: string) => void;
  handleAssignMemberToTask: (taskId: string, profileId: string) => void;
  setSelectedTask: (task: any) => void;
  fetchTaskDetails: (taskId: string) => void;
  handleRemoveTask: (taskId: string) => void;
  isAddTaskModalOpen: boolean;
  setIsAddTaskModalOpen: (open: boolean) => void;
  handleAddTask: (e: React.FormEvent) => void;
  newTask: any;
  setNewTask: (task: any) => void;
  setIsCastingTerminalOpen: (open: boolean) => void;
  setNewCasting: (casting: any) => void;
  setSelectedCastingProfile: (profile: any) => void;
  setIsCastingGalleryOpen: (open: boolean) => void;
  fetchReportsData: () => void;
  reportsData: any;
  budgetSummary: any[];
  expenses: any[];
  logisticsSubTab: string;
  setLogisticsSubTab: (tab: any) => void;
  locationsViewMode: 'grid' | 'map';
  setLocationsViewMode: (mode: 'grid' | 'map') => void;
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
  setIsArtTerminalOpen: (open: boolean) => void;
  artItems: any[];
  handleDeleteArtItem: (id: string) => void;
  projectSuppliers: any[];
  handleRemoveSupplier: (id: string) => void;
  transportRequests: any[];
  setSelectedTransportRequest: (req: any) => void;
  setIsAssignTransportModalOpen: (open: boolean) => void;
  setIsAddTransportModalOpen: (open: boolean) => void;
  cateringOrders: any[];
  setIsAddCateringModalOpen: (open: boolean) => void;
  setIsAddBudgetModalOpen: (open: boolean) => void;
  casting: any[];
}

export const PhasePro: React.FC<PhaseProProps> = (props) => {
  const { activeSubTab, setActiveSubTab } = props;

  const subTabs = [
    { id: 'overview', label: 'Resumen', icon: <LayoutDashboard size={18} /> },
    { id: 'crew', label: 'Equipo / Crew', icon: <Users size={18} /> },
    { id: 'tasks', label: 'Tareas / Rodaje', icon: <CheckSquare size={18} /> },
    { id: 'casting', label: 'Talento / Casting', icon: <Camera size={18} /> },
    { id: 'logistics', label: 'Logística', icon: <Truck size={18} /> },
    { id: 'reports', label: 'Reportes', icon: <BarChart3 size={18} /> }
  ];

  return (
    <AnimatePresence mode="wait">
        {activeSubTab === 'overview' && (
          <PhaseProOverview 
            isAlternateView={props.isAlternateView}
            project={props.project}
            tasks={props.tasks}
            crew={props.crew}
            locations={props.locations}
            setIsAddExpenseModalOpen={props.setIsAddExpenseModalOpen}
            setIsAddSupplierModalOpen={props.setIsAddSupplierModalOpen}
            setIsAddLocationModalOpen={props.setIsAddLocationModalOpen}
            setActiveSubTab={props.setActiveSubTab}
            setIsAddCastingModalOpen={props.setIsAddCastingModalOpen}
            setIsAddTaskModalOpen={props.setIsAddTaskModalOpen}
            casting={props.casting}
            activities={props.activities}
          />
        )}

        {activeSubTab === 'crew' && (
          <PhaseProCrew 
            crew={props.crew}
            profiles={props.profiles}
            roles={props.roles}
            isAddMemberModalOpen={props.isAddMemberModalOpen}
            setIsAddMemberModalOpen={props.setIsAddMemberModalOpen}
            handleAddMember={props.handleAddMember}
            handleRemoveMember={props.handleRemoveMember}
            newMember={props.newMember}
            setNewMember={props.setNewMember}
            isSubmitting={props.isSubmitting}
            hasPermission={props.hasPermission}
            setSelectedCrewMember={props.setSelectedCrewMember}
            setIsCrewSidebarOpen={props.setIsCrewSidebarOpen}
          />
        )}

        {activeSubTab === 'tasks' && (
          <PhaseProTasks 
            tasks={props.tasks}
            crew={props.crew}
            taskViewMode={props.taskViewMode}
            setTaskViewMode={props.setTaskViewMode}
            handleUpdateTaskStatus={props.handleUpdateTaskStatus}
            handleAssignMemberToTask={props.handleAssignMemberToTask}
            setSelectedTask={props.setSelectedTask}
            fetchTaskDetails={props.fetchTaskDetails}
            handleRemoveTask={props.handleRemoveTask}
            isAddTaskModalOpen={props.isAddTaskModalOpen}
            setIsAddTaskModalOpen={props.setIsAddTaskModalOpen}
            handleAddTask={props.handleAddTask}
            newTask={props.newTask}
            setNewTask={props.setNewTask}
            isSubmitting={props.isSubmitting}
            hasPermission={props.hasPermission}
          />
        )}

        {activeSubTab === 'casting' && (
          <PhaseProCasting 
            casting={props.casting}
            hasPermission={props.hasPermission}
            setIsCastingTerminalOpen={props.setIsCastingTerminalOpen}
            setNewCasting={props.setNewCasting}
            setIsAddCastingModalOpen={props.setIsAddCastingModalOpen}
            setSelectedCastingProfile={props.setSelectedCastingProfile}
            setIsCastingGalleryOpen={props.setIsCastingGalleryOpen}
          />
        )}

        {activeSubTab === 'reports' && (
          <PhaseProReports 
            reportsData={props.reportsData}
            fetchReportsData={props.fetchReportsData}
            budgetSummary={props.budgetSummary}
            expenses={props.expenses}
            activities={props.activities}
          />
        )}

        {activeSubTab === 'logistics' && (
          <PhaseProLogistics 
            logisticsSubTab={props.logisticsSubTab}
            setLogisticsSubTab={props.setLogisticsSubTab}
            locations={props.locations}
            locationsViewMode={props.locationsViewMode}
            setLocationsViewMode={props.setLocationsViewMode}
            setIsAddLocationModalOpen={props.setIsAddLocationModalOpen}
            scoutingReports={props.scoutingReports}
            setIsLocationTerminalOpen={props.setIsLocationTerminalOpen}
            setIsAddScoutingReportModalOpen={props.setIsAddScoutingReportModalOpen}
            setSelectedScoutingReport={props.setSelectedScoutingReport}
            setIsScoutingDetailModalOpen={props.setIsScoutingDetailModalOpen}
            callSheets={props.callSheets}
            setIsAddCallSheetModalOpen={props.setIsAddCallSheetModalOpen}
            setSelectedCallSheet={props.setSelectedCallSheet}
            setIsCallSheetEditorOpen={props.setIsCallSheetEditorOpen}
            fetchCallSheetDetails={props.fetchCallSheetDetails}
            setIsArtTerminalOpen={props.setIsArtTerminalOpen}
            artItems={props.artItems}
            handleDeleteArtItem={props.handleDeleteArtItem}
            projectSuppliers={props.projectSuppliers}
            handleRemoveSupplier={props.handleRemoveSupplier}
            setIsAddSupplierModalOpen={props.setIsAddSupplierModalOpen}
            transportRequests={props.transportRequests}
            setIsAddTransportModalOpen={props.setIsAddTransportModalOpen}
            setSelectedTransportRequest={props.setSelectedTransportRequest}
            setIsAssignTransportModalOpen={props.setIsAssignTransportModalOpen}
            cateringOrders={props.cateringOrders}
            setIsAddCateringModalOpen={props.setIsAddCateringModalOpen}
            budgetSummary={props.budgetSummary}
            expenses={props.expenses}
            setIsAddBudgetModalOpen={props.setIsAddBudgetModalOpen}
            setIsAddExpenseModalOpen={props.setIsAddExpenseModalOpen}
          />
        )}
      </AnimatePresence>
  );
};
