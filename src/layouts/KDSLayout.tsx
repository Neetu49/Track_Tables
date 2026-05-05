import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { ProfileDropdown } from '../components/ProfileDropdown';

const KDSLayout = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <div className="app-container" style={{ flexDirection: 'column' }}>
      <header className="header" style={{ backgroundColor: '#020617' }}>
        <div className="flex items-center gap-4">
          <h1 className="font-bold">KITCHEN MONITOR</h1>
          <span className="badge badge-preparing">{user?.name}</span>
        </div>
        <ProfileDropdown />
      </header>
      <main className="main-content" style={{ backgroundColor: '#0f172a' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default KDSLayout;
