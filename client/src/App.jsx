import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { SuperAdmin } from './pages/SuperAdmin';
import { BranchManagerOverview } from './pages/BranchManagerOverview';
import { BranchManager } from './pages/BranchManager';
import { BranchCoordinator } from './pages/BranchCoordinator';
import { Reports } from './pages/Reports';
import { Placeholder } from './components/Placeholder';
import { Organizations } from './pages/Organizations';
import { Branches } from './pages/Branches';
import { UsersList } from './pages/UsersList';
import { SettingsProfile } from './pages/SettingsProfile';
import { CustomerScan } from './pages/CustomerScan';
import { ForgotPassword } from './pages/ForgotPassword';

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/login" replace />;
    }
    return <Outlet />;
  } catch (err) {
     return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Public Customer Facing QR Routes */}
        <Route path="/scan" element={<CustomerScan />} />
        <Route path="/scan/:qrUrl" element={<CustomerScan />} />
        
        {/* Strictly Super Admin Only */}
        <Route element={<ProtectedRoute allowedRoles={['super_admin']} />}>
          <Route element={<Layout role="super_admin" title="Super Admin Dashboard" />}>
            <Route path="/admin" element={<SuperAdmin />} />
            <Route path="/admin/orgs" element={<Organizations />} />
            <Route path="/admin/branches" element={<Branches />} />
            <Route path="/admin/users" element={<UsersList />} />
            <Route path="/admin/settings" element={<SettingsProfile />} />
            <Route path="/analytics" element={<Reports />} />
          </Route>
        </Route>

        {/* Strictly Branch Manager Only */}
        <Route element={<ProtectedRoute allowedRoles={['manager']} />}>
          <Route element={<Layout role="manager" title="Branch Manager Dashboard" />}>
            <Route path="/manager" element={<BranchManagerOverview />} />
            <Route path="/manager/branch" element={<BranchManager />} />
            <Route path="/manager/feedback" element={<Reports />} />
            <Route path="/manager/settings" element={<SettingsProfile />} />
          </Route>
        </Route>

        {/* Strictly Branch Coordinator Only */}
        <Route element={<ProtectedRoute allowedRoles={['coordinator']} />}>
          <Route element={<Layout role="coordinator" title="Branch Coordinator Dashboard" />}>
            <Route path="/coordinator" element={<BranchCoordinator />} />
            <Route path="/coordinator/branches" element={<BranchManager />} />
            <Route path="/coordinator/reports" element={<Reports />} />
            <Route path="/coordinator/settings" element={<SettingsProfile />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
