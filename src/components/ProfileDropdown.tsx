import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import { UserCircle, Moon, Sun, LogOut, ChevronDown } from 'lucide-react';

export const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef} style={{ position: 'relative' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 btn-ghost"
        style={{ padding: '0.5rem', borderRadius: 'var(--radius)', border: 'none', cursor: 'pointer' }}
      >
        <UserCircle size={32} color="var(--primary-color)" />
        <div className="text-left" style={{ display: 'none' /* Will show on desktop if needed, but keeping it icon-focused for POS */ }}>
           <p className="font-bold text-sm">{user.name}</p>
           <p className="text-secondary text-sm">{user.role}</p>
        </div>
        <ChevronDown size={16} className="text-secondary" />
      </button>

      {isOpen && (
        <div 
          className="card" 
          style={{ 
            position: 'absolute', 
            top: '110%', 
            right: 0, 
            width: '240px', 
            padding: '1rem', 
            zIndex: 50,
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <div className="border-b pb-4 mb-2" style={{ borderColor: 'var(--border-color)', borderBottomStyle: 'solid', borderBottomWidth: '1px' }}>
            <p className="font-bold">{user.name}</p>
            <p className="text-secondary text-sm">{user.role}</p>
          </div>
          
          <div className="flex-col flex gap-2">
            <button 
              onClick={toggleTheme}
              className="btn btn-ghost" 
              style={{ justifyContent: 'flex-start', padding: '0.5rem' }}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button 
              onClick={handleLogout}
              className="btn btn-ghost text-danger" 
              style={{ justifyContent: 'flex-start', padding: '0.5rem' }}
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
