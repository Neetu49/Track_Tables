import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutGrid, Coffee, Receipt, Search, Bell, Clock } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { usePOSStore } from '../store/usePOSStore';
import { useToastStore } from '../store/useToastStore';
import { ProfileDropdown } from '../components/ProfileDropdown';
import { motion, AnimatePresence } from 'framer-motion';

const ToastContainer = () => {
  const toasts = useToastStore(state => state.toasts);
  
  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            style={{
              padding: '12px 20px',
              borderRadius: '8px',
              backgroundColor: toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#ef4444' : 'var(--bg-surface)',
              color: 'white',
              boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
              fontWeight: '500'
            }}
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const POSLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const activeOrders = usePOSStore(state => state.activeOrders);
  
  const openOrdersCount = activeOrders.filter(o => o.status !== 'COMPLETED').length;
  const billingReadyCount = activeOrders.filter(o => o.status === 'READY').length;

  const navItems = [
    { path: '/pos/tables', icon: <LayoutGrid size={24} />, label: 'Tables' },
    { path: '/pos/order', icon: <Coffee size={24} />, label: 'Order', badge: openOrdersCount },
    { path: '/pos/billing', icon: <Receipt size={24} />, label: 'Billing', badge: billingReadyCount > 0 ? billingReadyCount : null },
  ];

  return (
    <div className="app-container" style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      
      {/* Sidebar Navigation */}
      <nav className="sidebar" style={{ width: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRight: '1px solid var(--border-color)' }}>
        <div className="p-4 flex justify-center w-full" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary-color)', borderRadius: '8px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>T&T</div>
        </div>
        
        <div className="flex-1 w-full" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem', gap: '1rem' }}>
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <button
                key={item.path}
                className="btn btn-ghost"
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '1rem',
                  gap: '0.5rem',
                  color: isActive ? 'var(--primary-color)' : 'var(--text-secondary)',
                  width: '80%',
                  borderRadius: '12px',
                  backgroundColor: isActive ? 'var(--bg-color)' : 'transparent',
                  position: 'relative'
                }}
              >
                {item.icon}
                <span style={{ fontSize: '0.75rem', fontWeight: isActive ? 'bold' : 'normal' }}>{item.label}</span>
                
                {/* Animated Badge */}
                <AnimatePresence>
                  {item.badge !== null && item.badge > 0 && (
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      style={{
                        position: 'absolute', top: '5px', right: '15px',
                        backgroundColor: '#ef4444', color: 'white',
                        borderRadius: '12px', padding: '2px 6px',
                        fontSize: '0.7rem', fontWeight: 'bold',
                        minWidth: '20px', textAlign: 'center'
                      }}
                    >
                      {item.badge}
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t w-full flex justify-center">
          <ProfileDropdown />
        </div>
      </nav>

      {/* Main Workspace Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Persistent Header */}
        <header style={{ 
          height: '70px', 
          backgroundColor: 'var(--bg-surface)', 
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem'
        }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Downtown Branch</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
              Shift: Morning (Active)
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="btn btn-ghost" style={{ padding: '0.5rem', borderRadius: '50%' }}><Search size={20} /></button>
            <button className="btn btn-ghost" style={{ padding: '0.5rem', borderRadius: '50%' }}><Clock size={20} /></button>
            <div style={{ position: 'relative' }}>
              <button className="btn btn-ghost" style={{ padding: '0.5rem', borderRadius: '50%' }}><Bell size={20} /></button>
              <div style={{ position: 'absolute', top: 5, right: 5, width: 8, height: 8, backgroundColor: '#ef4444', borderRadius: '50%' }} />
            </div>
            <div style={{ borderLeft: '1px solid var(--border-color)', height: '30px', margin: '0 0.5rem' }} />
            <span style={{ fontWeight: '500' }}>{user?.name}</span>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <main style={{ flex: 1, overflow: 'hidden', backgroundColor: 'var(--bg-color)', position: 'relative' }}>
          <Outlet />
        </main>
      </div>

      <ToastContainer />
    </div>
  );
};

export default POSLayout;
