import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import ClubDashboard from './pages/club/ClubDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import CreateEvent from './pages/club/CreateEvent';
import EventDetails from './pages/shared/EventDetails';
import Layout from './components/Layout';
import { UserRole } from './types';

// Use PropsWithChildren to correctly type components that accept children
type ProtectedRouteProps = React.PropsWithChildren<{
  allowedRoles: UserRole[];
}>;

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" />;
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Club Routes */}
            <Route path="/club" element={
              <ProtectedRoute allowedRoles={[UserRole.CLUB]}>
                <Layout>
                  <ClubDashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/club/create-event" element={
              <ProtectedRoute allowedRoles={[UserRole.CLUB]}>
                <Layout>
                  <CreateEvent />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Student Routes */}
            <Route path="/student" element={
              <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                <Layout>
                  <StudentDashboard />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Shared Routes */}
            <Route path="/event/:id" element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.CLUB, UserRole.STUDENT]}>
                <Layout>
                  <EventDetails />
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </HashRouter>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;