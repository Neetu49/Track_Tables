import React from 'react';
import { usePOSStore } from '../../store/usePOSStore';
import { MockEventBus } from '../../services/MockEventBus';
import { TrendingUp, TrendingDown, ShoppingBag, BarChart3, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StatCard = ({ title, value, trend, isUp, icon, iconColor, delay = 0 }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="card" 
    style={{ backgroundColor: 'var(--bg-color)', border: 'none', position: 'relative' }}
  >
    <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: iconColor }}>
      {icon}
    </div>
    <p style={{ color: '#8d8d8d', marginBottom: '0.5rem' }}>{title}</p>
    <motion.h3 
      key={value}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{ fontSize: '2rem', marginBottom: '0.5rem' }}
    >
      {value}
    </motion.h3>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem' }}>
      <span style={{ color: isUp ? '#ffc700' : '#ff403b', display: 'flex', alignItems: 'center' }}>
        {isUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
        <span style={{ marginLeft: '4px', fontWeight: 'bold' }}>{trend}%</span>
      </span>
      <span style={{ color: '#8d8d8d' }}>Since Last Month</span>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { activeOrders } = usePOSStore();
  const [events, setEvents] = React.useState(MockEventBus.getHistory());

  React.useEffect(() => {
    const unsubscribe = MockEventBus.subscribeAll(() => {
      setEvents(MockEventBus.getHistory());
    });
    return unsubscribe;
  }, []);

  const totalSales = activeOrders
    .filter(o => o.status === 'COMPLETED')
    .reduce((sum, order) => sum + order.total, 0);
  const totalOrders = activeOrders.filter(o => o.status === 'COMPLETED').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Row KPI Cards */}
      <div className="grid-3">
        <StatCard 
          title="Sales" 
          value={`$${totalSales.toFixed(2)}`} 
          trend={5.64} 
          isUp={true} 
          icon={<BarChart3 size={20} />} 
          iconColor="#ffc700" 
          delay={0.1}
        />
        <StatCard 
          title="Purchases" 
          value="2343" 
          trend={2.14} 
          isUp={false} 
          icon={<ShoppingBag size={20} />} 
          iconColor="#ff403b" 
          delay={0.2}
        />
        <StatCard 
          title="Orders" 
          value={totalOrders} 
          trend={8.32} 
          isUp={true} 
          icon={<ShoppingBag size={20} />} 
          iconColor="#ffc700" 
          delay={0.3}
        />
      </div>

      {/* Bottom Row Detailed Cards */}
      <div className="grid-3" style={{ alignItems: 'stretch' }}>
        
        {/* Overview List */}
        <div className="card flex-col flex" style={{ backgroundColor: 'var(--bg-color)', border: 'none', padding: '1rem' }}>
          <h3 style={{ color: '#8d8d8d', marginBottom: '1rem', padding: '0 0.5rem' }}>Overview</h3>
          <div className="flex-col flex gap-1">
            {/* Active Item */}
            <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#ffc700', color: 'black', padding: '0.75rem 1rem', borderRadius: '8px', fontWeight: 'bold' }}>
              <div>
                <span>Member Profit</span>
                <p style={{ fontSize: '0.75rem', opacity: 0.8, fontWeight: 'normal' }}>Last Month</p>
              </div>
              <span>+2345</span>
            </div>
            {/* Inactive Items */}
            {[1, 2, 3].map(i => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', color: '#8d8d8d', padding: '0.75rem 1rem', borderRadius: '8px' }}>
                <div>
                  <span style={{ fontWeight: 'bold' }}>Member Profit</span>
                  <p style={{ fontSize: '0.75rem' }}>Last Month</p>
                </div>
                <span>{i % 2 === 0 ? '-2345' : '+2345'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Total Sale Donut Chart */}
        <div className="card flex-col flex" style={{ backgroundColor: 'var(--bg-color)', border: 'none' }}>
          <div className="flex justify-between items-center mb-4">
            <h3 style={{ color: '#8d8d8d' }}>Total Sale</h3>
            <button style={{ backgroundColor: '#ffc700', color: 'black', border: 'none', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}>View All</button>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ 
              width: '150px', height: '150px', 
              borderRadius: '50%', 
              border: '15px solid #e2e8f0',
              borderTopColor: '#ffc700',
              borderRightColor: '#ffc700',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transform: 'rotate(-45deg)'
            }}>
              <span style={{ transform: 'rotate(45deg)', fontSize: '1.5rem', fontWeight: 'bold' }}>70%</span>
            </div>
          </div>
        </div>

        {/* Activity Timeline */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="card flex-col flex" style={{ backgroundColor: 'var(--bg-color)', border: 'none' }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 style={{ color: '#8d8d8d' }}>Activity</h3>
            <button style={{ backgroundColor: '#ffc700', color: 'black', border: 'none', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}>View All</button>
          </div>
          <div className="flex-col flex gap-4 mt-2">
            <AnimatePresence>
              {events.length === 0 ? (
                <p style={{ color: '#8d8d8d', fontSize: '0.875rem' }}>No recent activity.</p>
              ) : (
                events.map((evt, idx) => {
                  let color = '#8d8d8d';
                  let text = '';
                  
                  switch (evt.type) {
                    case 'ORDER_CREATED':
                      color = '#ffc700'; // Yellow
                      text = `New order #${evt.payload.id} received on Table ${evt.payload.tableId}`;
                      break;
                    case 'ORDER_STATUS_CHANGED':
                      color = evt.payload.status === 'COMPLETED' ? '#10b981' : '#ff403b'; // Green/Red
                      text = `Order #${evt.payload.orderId} marked as ${evt.payload.status}`;
                      break;
                    case 'ORDER_MODIFIED':
                      color = '#3b82f6'; // Blue
                      text = `Order #${evt.payload.id} was updated`;
                      break;
                    default:
                      text = `System event: ${evt.type}`;
                  }

                  return (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                      key={`${evt.timestamp}-${idx}`} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}
                    >
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: color, marginTop: '6px' }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ color: '#8d8d8d', fontSize: '0.875rem', margin: 0 }}>{text}</p>
                        <span style={{ fontSize: '0.65rem', color: '#64748b' }}>{new Date(evt.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Dashboard;
