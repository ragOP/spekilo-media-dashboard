import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import RoleProtectedRoute from './components/RoleProtectedRoute'
import Dashboard from './pages/dashboard';
import Records from './pages/records';
import Abandoned from './pages/abandoned';
import DetailPage from './pages/detail-page';
import RecordsDetail from './pages/records/detail';
import Login from './pages/login';
import Admins from './pages/admins';
import AdminRegister from './pages/admins/register';
import AdminUpdate from './pages/admins/update';
import Passwords from './pages/passwords';
import PasswordAdd from './pages/passwords/add';
import PasswordEdit from './pages/passwords/edit';

const App = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen safe-area-inset">
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/records" element={
              <ProtectedRoute>
                <Records />
              </ProtectedRoute>
            } />
            <Route path="/records/:id" element={
              <ProtectedRoute>
                <RecordsDetail />
              </ProtectedRoute>
            } />
            <Route path="/abandoned" element={
              <ProtectedRoute>
                <Abandoned />
              </ProtectedRoute>
            } />
            <Route path="/abandoned/:id" element={
              <ProtectedRoute>
                <DetailPage />
              </ProtectedRoute>
            } />
            <Route path="/admins" element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <Admins />
              </RoleProtectedRoute>
            } />
            <Route path="/admins/register" element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <AdminRegister />
              </RoleProtectedRoute>
            } />
            <Route path="/admins/update/:id" element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <AdminUpdate />
              </RoleProtectedRoute>
            } />
            <Route path="/passwords" element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <Passwords />
              </RoleProtectedRoute>
            } />
            <Route path="/passwords/add" element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <PasswordAdd />
              </RoleProtectedRoute>
            } />
            <Route path="/passwords/edit/:id" element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <PasswordEdit />
              </RoleProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  )
}

export default App