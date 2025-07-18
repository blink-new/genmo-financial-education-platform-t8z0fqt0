import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AppProvider } from '@/contexts/AppContext';
import AdminDashboard from './pages/AdminDashboard';
import ClientManagement from './pages/ClientManagement';
import ContentManagement from './pages/ContentManagement';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import DemoPortal from './pages/DemoPortal';
import WidgetPreview from './pages/WidgetPreview';
import UserFlowDemo from './pages/UserFlowDemo';
import ModuleLibraryDemo from './pages/ModuleLibraryDemo';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-slate-50">
          <Routes>
            <Route path="/" element={<Navigate to="/admin" replace />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/clients" element={<ClientManagement />} />
            <Route path="/admin/content" element={<ContentManagement />} />
            <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
            <Route path="/demo" element={<DemoPortal />} />
            <Route path="/demo/user-flow" element={<UserFlowDemo />} />
            <Route path="/demo/modules" element={<ModuleLibraryDemo />} />
            <Route path="/widget/:clientId" element={<WidgetPreview />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;