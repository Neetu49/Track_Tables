import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from './store/useThemeStore';
import { AnimatePresence, motion } from 'framer-motion';

// Layouts
import POSLayout from './layouts/POSLayout';
import KDSLayout from './layouts/KDSLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import Login from './pages/auth/Login';
import FloorPlan from './pages/pos/FloorPlan';
import OrderBuilder from './pages/pos/OrderBuilder';
import Billing from './pages/pos/Billing';
import KitchenMonitor from './pages/kds/KitchenMonitor';
import Dashboard from './pages/admin/Dashboard';

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: -20 }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5
};

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const user = useAuthStore(state => state.user);
  if (!user) return <Navigate to="/login" replace />;
  
  if (user.role === 'Owner/Admin') return <>{children}</>;
  
  const hasAccess = allowedRoles.includes(user.role);
  if (!hasAccess) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ display: 'flex', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-color)' }}
      >
        <div className="card text-center" style={{ padding: '3rem' }}>
          <h2 className="text-danger mb-4">Access Denied</h2>
          <p className="text-secondary">You do not have permission to view this module.</p>
        </div>
      </motion.div>
    );
  }
  
  return <>{children}</>;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname.split('/')[1] || '/'}>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path="/login" element={
          <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} style={{ height: '100%' }}>
            <Login />
          </motion.div>
        } />
        
        {/* POS Routes */}
        <Route path="/pos" element={
          <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} style={{ height: '100%' }}>
            <ProtectedRoute allowedRoles={['Cashier', 'Waiter/Captain', 'Manager']}>
              <POSLayout />
            </ProtectedRoute>
          </motion.div>
        }>
          <Route index element={<Navigate to="tables" replace />} />
          <Route path="tables" element={<FloorPlan />} />
          <Route path="order" element={<OrderBuilder />} />
          <Route path="billing" element={<Billing />} />
        </Route>

        {/* KDS Routes */}
        <Route path="/kds" element={
          <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} style={{ height: '100%' }}>
            <ProtectedRoute allowedRoles={['Kitchen Staff', 'Bar Staff', 'Manager']}>
              <KDSLayout />
            </ProtectedRoute>
          </motion.div>
        }>
          <Route index element={<KitchenMonitor />} />
        </Route>

        {/* Admin Dashboard */}
        <Route path="/admin" element={
          <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} style={{ height: '100%' }}>
            <ProtectedRoute allowedRoles={['Manager', 'Accountant']}>
              <AdminLayout />
            </ProtectedRoute>
          </motion.div>
        }>
          <Route index element={<Dashboard />} />
          {/* Mock nested routes to satisfy navigation without crashing */}
          <Route path="home" element={<Dashboard />} />
          <Route path="users" element={<Dashboard />} />
          <Route path="settings" element={<Dashboard />} />
          <Route path="support" element={<Dashboard />} />
        </Route>

      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const isDark = useThemeStore(state => state.isDark);

  React.useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [isDark]);

  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
