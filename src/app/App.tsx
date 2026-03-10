import React, { useState } from 'react';
import { LoginPage } from './components/auth/LoginPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './components/auth/ResetPasswordPage';
import { Dashboard } from './components/Dashboard';
import { QuotationList } from './components/QuotationList';
import { NewQuotationWizard, QuotationWizardData } from './components/NewQuotationWizard';
import { QuotationEditor } from './components/QuotationEditor';
import { ResourceManagement } from './components/ResourceManagement';
import { ParameterManagement } from './components/ParameterManagement';
import { ProposalViewer } from './components/ProposalViewer';
import { VersionHistory } from './components/VersionHistory';
import { ClientManagement } from './components/ClientManagement';
import { IssuingCompanyManagement } from './components/IssuingCompanyManagement';
import { Sidebar } from './components/Sidebar';
import { ConfirmDialog } from './components/ui/confirm-dialog';
import {
  mockQuotations,
  mockRoles,
  mockParameters,
  mockVersionHistory,
  mockClients,
  mockClientContacts,
  mockTenant,
  mockUsers,
  mockIssuingCompanies,
  mockIssuingCompanyUsers,
} from './data/mockData';
import {
  Quotation,
  Role,
  Parameters,
  QuotationVersion,
  Client,
  ClientContact,
  User,
  IssuingCompany,
  IssuingCompanyUser,
} from './types';
import { generateQuotationCode } from './utils/calculations';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

type View =
  | 'dashboard'
  | 'quotations'
  | 'new-quotation'
  | 'edit-quotation'
  | 'view-proposal'
  | 'resources'
  | 'parameters'
  | 'clients'
  | 'companies'
  | 'history';

type AuthView = 'login' | 'forgot-password' | 'reset-password';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState<AuthView>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [view, setView] = useState<View>('dashboard');
  const [quotations, setQuotations] = useState<Quotation[]>(mockQuotations);
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [parameters, setParameters] = useState<Parameters>(mockParameters);
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [clientContacts, setClientContacts] = useState<ClientContact[]>(mockClientContacts);
  const [issuingCompanies, setIssuingCompanies] = useState<IssuingCompany[]>(mockIssuingCompanies);
  const [issuingCompanyUsers, setIssuingCompanyUsers] = useState<IssuingCompanyUser[]>(
    mockIssuingCompanyUsers
  );
  const [users, setUsers] = useState<User[]>(mockUsers);

  const [selectedQuotationId, setSelectedQuotationId] = useState<string | null>(null);
  const [versionHistory] = useState<QuotationVersion[]>(mockVersionHistory);
  const [deleteQuotationDialog, setDeleteQuotationDialog] = useState<{
    open: boolean;
    quotationId: string | null;
  }>({
    open: false,
    quotationId: null,
  });
  const [restoreVersionDialog, setRestoreVersionDialog] = useState<{
    open: boolean;
    versionId: string | null;
  }>({
    open: false,
    versionId: null,
  });

  const selectedQuotation = quotations.find((q) => q.id === selectedQuotationId);

  // Authentication handlers
  const handleLogin = (email: string, password: string) => {
    const user = users.find((u) => u.email === email && u.isActive);
    
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      toast.success(`Bienvenido, ${user.name}!`);
    } else {
      toast.error('Credenciales inválidas');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setView('dashboard');
    toast.success('Sesión cerrada exitosamente');
  };

  const handleForgotPassword = () => {
    setAuthView('forgot-password');
  };

  const handleResetPassword = () => {
    setAuthView('login');
    toast.success('Ya puedes iniciar sesión con tu nueva contraseña');
  };

  const handleNewQuotation = () => {
    setView('new-quotation');
  };

  const handleCreateQuotation = (data: QuotationWizardData) => {
    if (!currentUser) {
      toast.error('Usuario no autenticado');
      return;
    }

    const newQuotation: Quotation = {
      id: `q${Date.now()}`,
      code: generateQuotationCode(),
      ...data,
      createdBy: currentUser.id,
      updatedBy: currentUser.id,
      activityGroups: [],
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      version: 1,
    };

    setQuotations((prev) => [...prev, newQuotation]);
    setSelectedQuotationId(newQuotation.id);
    setView('edit-quotation');
    toast.success('Cotización creada exitosamente');
  };

  const handleEditQuotation = (id: string) => {
    setSelectedQuotationId(id);
    setView('edit-quotation');
  };

  const handleViewQuotation = (id: string) => {
    setSelectedQuotationId(id);
    setView('view-proposal');
  };

  const handleDuplicateQuotation = (id: string) => {
    const original = quotations.find((q) => q.id === id);
    if (!original) return;

    const duplicated: Quotation = {
      ...original,
      id: `q${Date.now()}`,
      code: generateQuotationCode(),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      version: 1,
      status: 'draft',
    };

    setQuotations((prev) => [...prev, duplicated]);
    toast.success('Cotización duplicada exitosamente');
  };

  const handleDeleteQuotation = (id: string) => {
    setDeleteQuotationDialog({ open: true, quotationId: id });
  };

  const confirmDeleteQuotation = () => {
    if (deleteQuotationDialog.quotationId) {
      setQuotations((prev) => prev.filter((q) => q.id !== deleteQuotationDialog.quotationId));
      toast.success('Cotización eliminada');
    }
  };

  const handleSaveQuotation = (quotation: Quotation) => {
    setQuotations((prev) =>
      prev.map((q) =>
        q.id === quotation.id
          ? {
              ...quotation,
              updatedBy: currentUser?.id,
              updatedAt: new Date().toISOString().split('T')[0],
              version: q.version + 1,
            }
          : q
      )
    );
    toast.success('Cotización guardada exitosamente');
  };

  const handleViewProposal = (quotation: Quotation) => {
    setSelectedQuotationId(quotation.id);
    setView('view-proposal');
  };

  const handleUpdateRoles = (updatedRoles: Role[]) => {
    setRoles(updatedRoles);
    toast.success('Recursos actualizados');
  };

  const handleUpdateParameters = (updatedParameters: Parameters) => {
    setParameters(updatedParameters);
    toast.success('Parámetros actualizados');
    setView('dashboard');
  };

  const handleUpdateClients = (updatedClients: Client[]) => {
    setClients(updatedClients);
  };

  const handleUpdateClientContacts = (updatedContacts: ClientContact[]) => {
    setClientContacts(updatedContacts);
  };

  const handleCreateClient = (newClient: Client) => {
    setClients((prev) => [...prev, newClient]);
  };

  const handleUpdateIssuingCompanies = (updatedCompanies: IssuingCompany[]) => {
    setIssuingCompanies(updatedCompanies);
  };

  const handleUpdateUsers = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
  };

  const handleUpdateIssuingCompanyUsers = (updatedCompanyUsers: IssuingCompanyUser[]) => {
    setIssuingCompanyUsers(updatedCompanyUsers);
  };

  const handleRestoreVersion = (versionId: string) => {
    setRestoreVersionDialog({ open: true, versionId });
  };

  const confirmRestoreVersion = () => {
    if (restoreVersionDialog.versionId) {
      toast.success('Versión restaurada exitosamente');
      setView('edit-quotation');
    }
  };

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard onNewQuotation={handleNewQuotation} quotations={quotations} />;

      case 'quotations':
        return (
          <QuotationList
            quotations={quotations}
            onNewQuotation={handleNewQuotation}
            onEditQuotation={handleEditQuotation}
            onViewQuotation={handleViewQuotation}
            onDuplicateQuotation={handleDuplicateQuotation}
            onDeleteQuotation={handleDeleteQuotation}
          />
        );

      case 'new-quotation':
        return (
          <NewQuotationWizard
            clients={clients}
            issuingCompanies={issuingCompanies.filter((ic) => ic.isActive)}
            currentUser={currentUser!}
            onBack={() => setView('quotations')}
            onCreate={handleCreateQuotation}
            onCreateClient={handleCreateClient}
          />
        );

      case 'edit-quotation':
        if (!selectedQuotation) return null;
        return (
          <QuotationEditor
            quotation={selectedQuotation}
            roles={roles}
            hoursPerMonth={parameters.hoursPerMonth}
            onBack={() => setView('quotations')}
            onSave={handleSaveQuotation}
            onViewProposal={handleViewProposal}
          />
        );

      case 'view-proposal':
        if (!selectedQuotation) return null;
        return (
          <ProposalViewer
            quotation={selectedQuotation}
            onBack={() => setView('edit-quotation')}
          />
        );

      case 'resources':
        return (
          <ResourceManagement
            roles={roles}
            onBack={() => setView('dashboard')}
            onUpdateRoles={handleUpdateRoles}
          />
        );

      case 'parameters':
        return (
          <ParameterManagement
            parameters={parameters}
            onBack={() => setView('dashboard')}
            onUpdate={handleUpdateParameters}
          />
        );

      case 'clients':
        return (
          <ClientManagement
            clients={clients}
            contacts={clientContacts}
            onUpdateClients={handleUpdateClients}
            onUpdateContacts={handleUpdateClientContacts}
          />
        );

      case 'companies':
        return (
          <IssuingCompanyManagement
            companies={issuingCompanies}
            users={users}
            companyUsers={issuingCompanyUsers}
            onUpdateCompanies={handleUpdateIssuingCompanies}
            onUpdateUsers={handleUpdateUsers}
            onUpdateCompanyUsers={handleUpdateIssuingCompanyUsers}
          />
        );

      case 'history':
        return (
          <VersionHistory
            versions={versionHistory}
            currentVersion={selectedQuotation?.version || 1}
            onBack={() => setView('edit-quotation')}
            onRestore={handleRestoreVersion}
          />
        );

      default:
        return null;
    }
  };

  // Views with sidebar
  const viewsWithSidebar = ['dashboard', 'quotations', 'resources', 'parameters', 'clients', 'companies'];
  const showSidebar = viewsWithSidebar.includes(view);

  // Show auth screens if not authenticated
  if (!isAuthenticated) {
    if (authView === 'login') {
      return (
        <>
          <LoginPage onLogin={handleLogin} onForgotPassword={handleForgotPassword} />
          <Toaster />
        </>
      );
    }

    if (authView === 'forgot-password') {
      return (
        <>
          <ForgotPasswordPage onBack={() => setAuthView('login')} />
          <Toaster />
        </>
      );
    }

    if (authView === 'reset-password') {
      return (
        <>
          <ResetPasswordPage token="dummy-token" onSuccess={handleResetPassword} />
          <Toaster />
        </>
      );
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {showSidebar && (
        <Sidebar
          currentView={view}
          onNavigate={(newView) => setView(newView as View)}
          onLogout={handleLogout}
          currentUser={currentUser}
        />
      )}
      <div className={showSidebar ? 'flex-1' : 'w-full'}>{renderView()}</div>
      <Toaster position="top-right" />

      {/* Confirm Dialogs */}
      <ConfirmDialog
        open={deleteQuotationDialog.open}
        onOpenChange={(open) =>
          setDeleteQuotationDialog({ open, quotationId: null })
        }
        title="Eliminar Cotización"
        description="¿Estás seguro de que deseas eliminar esta cotización? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmDeleteQuotation}
        variant="destructive"
      />

      <ConfirmDialog
        open={restoreVersionDialog.open}
        onOpenChange={(open) => setRestoreVersionDialog({ open, versionId: null })}
        title="Restaurar Versión"
        description="¿Estás seguro de que deseas restaurar esta versión? Los cambios actuales se perderán."
        confirmText="Restaurar"
        cancelText="Cancelar"
        onConfirm={confirmRestoreVersion}
        variant="default"
      />
    </div>
  );
}
