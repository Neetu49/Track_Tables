import React, { useEffect } from 'react';
import { usePOSStore } from '../../store/usePOSStore';
import { useToastStore } from '../../store/useToastStore';
import { MockEventBus } from '../../services/MockEventBus';
import { Clock, CheckCircle, ChefHat } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Ticket = ({ order, onUpdateStatus }: any) => {
  const isDelayed = (Date.now() - order.createdAt) > 10 * 60000; // 10 mins

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        y: 0,
        boxShadow: isDelayed && order.status === 'NEW' 
          ? ['0 0 0 0 rgba(239, 68, 68, 0.4)', '0 0 0 10px rgba(239, 68, 68, 0)'] 
          : 'none'
      }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      transition={{ 
        boxShadow: { repeat: Infinity, duration: 1.5 },
        layout: { type: 'spring', stiffness: 300, damping: 30 }
      }}
      className="card" 
      style={{ 
        borderLeft: `4px solid ${order.status === 'NEW' ? 'var(--primary-color)' : order.status === 'PREPARING' ? 'var(--warning-color)' : 'var(--success-color)'}`,
        position: 'relative'
      }}
    >
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h3 className="font-bold">Order #{order.id}</h3>
        <div className="flex items-center gap-2 text-secondary" style={{ color: isDelayed && order.status === 'NEW' ? 'var(--danger-color)' : '' }}>
          <Clock size={16} />
          <span>{Math.floor((Date.now() - order.createdAt) / 60000)}m</span>
        </div>
      </div>
      
      <div className="flex-col flex gap-2 mb-4">
        {order.items.map((item: any, idx: number) => (
          <div key={`${item.id}-${idx}`} className="flex justify-between items-center bg-surface p-2 rounded">
            <span className="font-bold">{item.name}</span>
            <span className="badge badge-preparing">x1</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-auto">
        {order.status === 'NEW' && (
          <button className="btn btn-outline w-full" onClick={() => onUpdateStatus(order.id, 'PREPARING')}>
            Start Preparing
          </button>
        )}
        {order.status === 'PREPARING' && (
          <button className="btn btn-primary w-full flex justify-center items-center gap-2" style={{ backgroundColor: 'var(--success-color)', border: 'none' }} onClick={() => onUpdateStatus(order.id, 'READY')}>
            <CheckCircle size={16} /> Mark Ready
          </button>
        )}
        {order.status === 'READY' && (
          <button className="btn btn-outline w-full text-success" disabled>
            Waiting for pickup...
          </button>
        )}
      </div>
    </motion.div>
  );
};

const KitchenMonitor = () => {
  const { activeOrders, updateOrderStatus } = usePOSStore();
  const { addToast } = useToastStore();

  useEffect(() => {
    // Listen for new orders to trigger a notification toast in KDS
    const unsubCreate = MockEventBus.subscribe('ORDER_CREATED', (order) => {
      addToast(`New Order #${order.id} received!`, 'info');
    });
    const unsubModify = MockEventBus.subscribe('ORDER_MODIFIED', (order) => {
      addToast(`Order #${order.id} was updated!`, 'warning');
    });
    return () => {
      unsubCreate();
      unsubModify();
    };
  }, [addToast]);

  const columns = [
    { id: 'NEW', title: 'New Tickets', color: 'var(--primary-color)' },
    { id: 'PREPARING', title: 'Preparing', color: 'var(--warning-color)' },
    { id: 'READY', title: 'Ready to Serve', color: 'var(--success-color)' }
  ];

  return (
    <div className="p-6 h-full flex flex-col overflow-hidden" style={{ backgroundColor: '#0f172a' }}>
      <div className="flex justify-between items-center mb-6 text-white">
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-2"><ChefHat /> Kitchen Display System</h1>
          <p style={{ color: '#94a3b8' }}>Live operational queue</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--danger-color)' }} /> Delayed
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--primary-color)' }} /> On Time
          </div>
        </div>
      </div>

      <div className="grid-3 h-full overflow-hidden" style={{ gap: '2rem' }}>
        {columns.map(col => {
          const colOrders = activeOrders.filter(o => o.status === col.id).sort((a, b) => a.createdAt - b.createdAt);
          
          return (
            <div key={col.id} className="flex-col flex h-full" style={{ backgroundColor: '#1e293b', borderRadius: '16px', borderTop: `4px solid ${col.color}` }}>
              <div className="p-4 flex justify-between items-center" style={{ borderBottom: '1px solid #334155' }}>
                <h2 className="font-bold text-white">{col.title}</h2>
                <span className="badge" style={{ backgroundColor: col.color, color: 'white' }}>{colOrders.length}</span>
              </div>
              
              <div className="p-4 flex-col flex gap-4 overflow-y-auto" style={{ flex: 1 }}>
                <AnimatePresence mode="popLayout">
                  {colOrders.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center mt-10" style={{ color: '#475569' }}>
                      No tickets
                    </motion.div>
                  ) : (
                    colOrders.map(order => (
                      <Ticket key={order.id} order={order} onUpdateStatus={updateOrderStatus} />
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KitchenMonitor;
