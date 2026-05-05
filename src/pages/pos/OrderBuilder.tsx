import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePOSStore } from '../../store/usePOSStore';
import { useToastStore } from '../../store/useToastStore';
import { ShoppingCart, Send, Plus, Minus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OrderBuilder = () => {
  const { menu, currentCart, addToCart, removeFromCart, clearCart, submitOrder, selectedTableId, tables } = usePOSStore();
  const { addToast } = useToastStore();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>('All');
  const [isSending, setIsSending] = useState(false);

  const categories = ['All', ...Array.from(new Set(menu.map(m => m.category)))];
  const filteredMenu = filter === 'All' ? menu : menu.filter(m => m.category === filter);
  const total = currentCart.reduce((sum, item) => sum + item.price, 0);

  const handleSubmit = () => {
    setIsSending(true);
    setTimeout(() => {
      submitOrder();
      addToast('Order sent to kitchen successfully!', 'success');
      navigate('/pos/tables');
    }, 600); // simulate sending delay for animation
  };

  const table = tables.find(t => t.id === selectedTableId);

  // Group cart items to show quantities instead of flat list
  const groupedCart = currentCart.reduce((acc, item) => {
    const existing = acc.find(i => i.id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      acc.push({ ...item, quantity: 1 });
    }
    return acc;
  }, [] as any[]);

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      
      {/* Menu Area */}
      <div style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Menu</h2>
          <div className="flex gap-2 p-1 rounded-lg bg-surface" style={{ backgroundColor: 'var(--bg-surface)' }}>
            {categories.map(cat => (
              <button 
                key={cat} 
                style={{
                  position: 'relative',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  fontWeight: 'bold',
                  color: filter === cat ? 'white' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  zIndex: 1,
                  transition: 'color 0.3s'
                }}
                onClick={() => setFilter(cat)}
              >
                {filter === cat && (
                  <motion.div
                    layoutId="categoryIndicator"
                    style={{ position: 'absolute', inset: 0, backgroundColor: 'var(--primary-color)', borderRadius: '8px', zIndex: -1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid-3" style={{ overflowY: 'auto', paddingRight: '1rem', paddingBottom: '2rem', alignContent: 'start' }}>
          <AnimatePresence mode="popLayout">
            {filteredMenu.map(item => (
              <motion.button 
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={item.isAvailable ? { scale: 1.05, y: -5 } : {}}
                whileTap={item.isAvailable ? { scale: 0.95 } : {}}
                key={item.id} 
                className="card" 
                onClick={() => addToCart(item)}
                disabled={!item.isAvailable}
                style={{ 
                  textAlign: 'left', 
                  cursor: item.isAvailable ? 'pointer' : 'not-allowed', 
                  opacity: item.isAvailable ? 1 : 0.5,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {!item.isAvailable && (
                  <div style={{ position: 'absolute', top: 10, right: -25, backgroundColor: 'var(--danger-color)', color: 'white', padding: '2px 30px', transform: 'rotate(45deg)', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    OUT
                  </div>
                )}
                <h3 style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>{item.name}</h3>
                <p className="text-secondary mb-3 text-sm">{item.category}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p className="font-bold text-success">${item.price.toFixed(2)}</p>
                  <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}>
                    <Plus size={16} />
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Cart Area - Sliding Drawer Style */}
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        style={{ 
          width: '380px', 
          backgroundColor: 'white', 
          boxShadow: '-10px 0 30px rgba(0,0,0,0.05)', 
          display: 'flex', 
          flexDirection: 'column',
          zIndex: 10
        }}
      >
        <div className="p-5 border-b" style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>
          <div className="flex justify-between items-center">
            <h2 className="flex items-center gap-2 font-bold"><ShoppingCart size={24} /> Current Order</h2>
            {table && <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '16px', fontSize: '0.875rem', fontWeight: 'bold' }}>{table.name}</span>}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }} className="flex-col flex gap-4">
          <AnimatePresence>
            {groupedCart.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-secondary" style={{ textAlign: 'center', marginTop: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <ShoppingCart size={48} style={{ opacity: 0.2 }} />
                <p>Cart is empty. Select items from the menu to start building the order.</p>
              </motion.div>
            ) : (
              groupedCart.map((item) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, scale: 0.9 }}
                  key={item.id} 
                  className="flex justify-between items-center p-3 rounded-lg border"
                >
                  <div style={{ flex: 1 }}>
                    <p className="font-bold">{item.name}</p>
                    <p className="text-secondary text-sm">${item.price.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div style={{ backgroundColor: 'var(--bg-surface)', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>x{item.quantity}</div>
                    <button 
                      className="btn btn-ghost" 
                      style={{ padding: '0.5rem', color: 'var(--danger-color)' }} 
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        <div className="p-6 border-t" style={{ backgroundColor: 'var(--bg-surface)' }}>
          <div className="flex justify-between mb-6 font-bold" style={{ fontSize: '1.5rem' }}>
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-outline" style={{ flex: 1, padding: '1rem' }} onClick={clearCart} disabled={currentCart.length === 0 || isSending}>
              Clear
            </button>
            <motion.button 
              whileTap={currentCart.length > 0 && !isSending ? { scale: 0.95 } : {}}
              className="btn btn-primary flex items-center justify-center gap-2" 
              style={{ flex: 2, padding: '1rem', backgroundColor: isSending ? 'var(--success-color)' : 'var(--primary-color)' }} 
              onClick={handleSubmit} 
              disabled={currentCart.length === 0 || isSending}
            >
              <Send size={20} /> {isSending ? 'Sending...' : 'Send to Kitchen'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderBuilder;
