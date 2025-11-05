import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import ProfessorDashboard from './pages/ProfessorDashboard'
import StudentDashboard from './pages/StudentDashboard'
import AssignmentManagement from './pages/AssignmentManagement'
import StudentAssignments from './pages/StudentAssignments'
import LoadingSpinner from './components/LoadingSpinner'

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <LoadingSpinner />
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }
  
  return children
}

function AppRoutes() {
  const { user } = useAuth()
  
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route 
        path="/" 
        element={
          user ? (
            user.role === 'professor' ? 
              <Navigate to="/professor/dashboard" replace /> : 
              <Navigate to="/student/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
      
      <Route 
        path="/professor/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['professor']}>
            <ProfessorDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/professor/course/:courseId/assignments" 
        element={
          <ProtectedRoute allowedRoles={['professor']}>
            <AssignmentManagement />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/student/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/student/course/:courseId/assignments" 
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentAssignments />
          </ProtectedRoute>
        } 
      />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App