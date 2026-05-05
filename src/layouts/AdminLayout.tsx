import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, Key, Settings, LifeBuoy, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { ProfileDropdown } from '../components/ProfileDropdown';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/admin/home', icon: <Home size={20} />, label: 'Home' },
    { path: '/admin/users', icon: <Users size={20} />, label: 'User Control' },
    { path: '/admin', icon: <Key size={20} />, label: 'Access Request' }, // Making this the default admin path for the demo
    { path: '/admin/settings', icon: <Settings size={20} />, label: 'Settings' },
    { path: '/admin/support', icon: <LifeBuoy size={20} />, label: 'Support' },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#000000' }}>
      
      {/* Black Sidebar */}
      <nav style={{ 
        width: '260px', 
        backgroundColor: '#000000', 
        color: '#8d8d8d', 
        display: 'flex', 
        flexDirection: 'column',
        paddingTop: '2rem',
        paddingBottom: '2rem'
      }}>
        <div style={{ padding: '0 2rem', marginBottom: '2rem' }}>
          <h2 style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#ffc700' }}>M</span> - SoftTech
          </h2>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '1rem' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem 1.5rem',
                  backgroundColor: isActive ? 'var(--bg-surface)' : 'transparent',
                  color: isActive ? '#ffc700' : '#8d8d8d',
                  border: 'none',
                  borderTopLeftRadius: '30px',
                  borderBottomLeftRadius: '30px',
                  cursor: 'pointer',
                  fontWeight: isActive ? 'bold' : 'normal',
                  fontSize: '1rem',
                  transition: 'all 0.2s',
                  width: '100%'
                }}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
          
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem 1.5rem',
              backgroundColor: 'transparent',
              color: '#ff403b',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'normal',
              fontSize: '1rem',
              marginTop: 'auto'
            }}
          >
            <LogOut size={20} />
            Quit
          </button>
        </div>
      </nav>

      {/* Main Content Area (White rounded container) */}
      <main style={{ 
        flex: 1, 
        backgroundColor: 'var(--bg-surface)', 
        borderTopLeftRadius: '30px', 
        borderBottomLeftRadius: '30px', 
        margin: '1rem 1rem 1rem 0',
        padding: '2rem 3rem',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        boxShadow: '-10px 0 20px rgba(0,0,0,0.2)'
      }}>
        
        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
          <h2 style={{ color: '#8d8d8d', fontWeight: 'normal', fontSize: '1.25rem' }}>Dashboard</h2>
          <div>
            <ProfileDropdown />
          </div>
        </header>

        {/* Dashboard Content */}
        <div style={{ flex: 1 }}>
          <Outlet />
        </div>

      </main>

    </div>
  );
};

export default AdminLayout;
