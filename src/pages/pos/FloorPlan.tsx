import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePOSStore } from '../../store/usePOSStore';
import { Users, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Helper component for live timer
const OccupancyTimer = ({ createdAt }: { createdAt: number }) => {
  const [elapsed, setElapsed] = useState(Date.now() - createdAt);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Date.now() - createdAt);
    }, 60000); // update every minute
    return () => clearInterval(interval);
  }, [createdAt]);

  const mins = Math.floor(elapsed / 60000);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', marginTop: '4px' }}>
      <Clock size={12} /> {mins}m
    </div>
  );
};

const FloorPlan = () => {
  const tables = usePOSStore((state) => state.tables);
  const activeOrders = usePOSStore((state) => state.activeOrders);
  const setSelectedTableId = usePOSStore((state) => state.setSelectedTableId);
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState<'Indoor' | 'Outdoor' | 'Patio'>('Indoor');

  const filteredTables = tables.filter(t => t.section === activeSection);

  const handleTableClick = (tableId: string, status: string) => {
    setSelectedTableId(tableId);
    if (status === 'AVAILABLE') {
      navigate('/pos/order');
    } else if (status === 'OCCUPIED' || status === 'RESERVED') {
      // If occupied, normally we might slide open a preview. For now, navigate to order to append/edit.
      navigate('/pos/order');
    } else if (status === 'BILLING') {
      navigate('/pos/billing');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'var(--success-color)';
      case 'OCCUPIED': return 'var(--primary-color)';
      case 'RESERVED': return 'var(--warning-color)';
      case 'BILLING': return 'var(--info-color)';
      case 'CLEANING': return 'var(--text-secondary)';
      default: return 'var(--border-color)';
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Floor Plan</h1>
          <p className="text-secondary">Select a table to start an order</p>
        </div>
        
        {/* Animated Section Tabs */}
        <div style={{ display: 'flex', backgroundColor: 'var(--bg-surface)', padding: '4px', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
          {['Indoor', 'Outdoor', 'Patio'].map(section => (
            <button
              key={section}
              onClick={() => setActiveSection(section as any)}
              style={{
                position: 'relative',
                padding: '8px 24px',
                border: 'none',
                backgroundColor: 'transparent',
                fontWeight: 'bold',
                color: activeSection === section ? 'white' : 'var(--text-secondary)',
                cursor: 'pointer',
                zIndex: 1,
                transition: 'color 0.3s'
              }}
            >
              {activeSection === section && (
                <motion.div
                  layoutId="activeTabIndicator"
                  style={{ position: 'absolute', inset: 0, backgroundColor: 'var(--primary-color)', borderRadius: '8px', zIndex: -1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              {section}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem', flex: 1, overflowY: 'auto', padding: '10px' }}>
        <AnimatePresence mode="popLayout">
          {filteredTables.map((table) => {
            const tableOrder = activeOrders.find(o => o.tableId === table.id && o.status !== 'COMPLETED');
            const hasReadyItems = tableOrder?.items.some(i => i.status === 'READY');

            return (
              <motion.button
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                key={table.id}
                className="card"
                onClick={() => handleTableClick(table.id, table.status)}
                style={{
                  height: '140px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: `4px solid ${getStatusColor(table.status)}`,
                  cursor: 'pointer',
                  textAlign: 'left',
                  position: 'relative'
                }}
              >
                {/* Pulse animation for ready orders */}
                {hasReadyItems && (
                  <motion.div
                    animate={{ boxShadow: ['0 0 0 0 rgba(16, 185, 129, 0.4)', '0 0 0 15px rgba(16, 185, 129, 0)'] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    style={{ position: 'absolute', inset: 0, borderRadius: 'var(--radius)', pointerEvents: 'none' }}
                  />
                )}

                <div className="flex justify-between items-start">
                  <h3 className="font-bold">{table.name}</h3>
                  <div className="flex items-center gap-1 text-secondary" style={{ fontSize: '0.875rem' }}>
                    <Users size={16} /> {table.capacity}
                  </div>
                </div>

                <div>
                  <span className={`badge badge-${table.status.toLowerCase()}`}>
                    {table.status}
                  </span>
                  {tableOrder && (
                    <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 'bold' }}>${tableOrder.total.toFixed(2)}</span>
                      <OccupancyTimer createdAt={tableOrder.createdAt} />
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="mt-6 flex gap-4 p-4 rounded bg-surface">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-success"></div> Available</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary"></div> Occupied</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-warning"></div> Reserved</div>
      </div>
    </div>
  );
};

export default FloorPlan;
