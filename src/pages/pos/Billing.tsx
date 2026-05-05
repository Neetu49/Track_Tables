import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePOSStore } from '../../store/usePOSStore';
import { useToastStore } from '../../store/useToastStore';
import { ReceiptService } from '../../services/ReceiptService';
import { Receipt, CheckCircle, CreditCard, Banknote, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Billing = () => {
  const { tables, activeOrders, finalizeOrder } = usePOSStore();
  const { addToast } = useToastStore();
  const navigate = useNavigate();

  const [selectedTable, setSelectedTable] = useState<string>('');
  const [paymentMode, setPaymentMode] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const readyTables = tables.filter(t => t.status === 'BILLING' || t.status === 'OCCUPIED');
  
  const selectedOrder = activeOrders.find(
    o => o.tableId === selectedTable && o.status !== 'COMPLETED'
  );

  const handleFinalize = async () => {
    if (!selectedOrder || !paymentMode) return;
    
    setIsProcessing(true);
    
    // Attempt digital receipt integration
    const tableObj = tables.find(t => t.id === selectedTable);
    await ReceiptService.sendDigitalReceipt(selectedOrder, tableObj, paymentMode);
    
    setIsProcessing(false);
    setIsSuccess(true);
    finalizeOrder(selectedOrder.id);
    addToast(`Payment of $${(selectedOrder.total * 1.05).toFixed(2)} received via ${paymentMode}. Receipt sent!`, 'success');
    
    setTimeout(() => {
      navigate('/pos/tables');
    }, 1500); // Wait for success animation before navigating
  };

  return (
    <div className="p-6 h-full flex flex-col items-center">
      <div className="w-full max-w-3xl flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Billing & Checkout</h1>
      </div>

      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-col flex items-center justify-center h-full gap-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10, stiffness: 100 }}
            >
              <CheckCircle size={80} color="var(--success-color)" />
            </motion.div>
            <h2 className="text-2xl font-bold">Payment Successful!</h2>
            <p className="text-secondary">Closing table and returning to floor plan...</p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-3xl grid grid-cols-2 gap-8 h-full"
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}
          >
            {/* Left Column: Selection */}
            <div className="flex-col flex gap-6">
              <div className="card">
                <h3 className="font-bold mb-4">Select Table</h3>
                <div className="flex-col flex gap-2">
                  {readyTables.length === 0 ? (
                    <p className="text-secondary">No tables currently need billing.</p>
                  ) : (
                    readyTables.map(t => {
                      const orderTotal = activeOrders.find(o => o.tableId === t.id && o.status !== 'COMPLETED')?.total || 0;
                      return (
                        <button
                          key={t.id}
                          className={`btn ${selectedTable === t.id ? 'btn-primary' : 'btn-outline'}`}
                          style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem' }}
                          onClick={() => setSelectedTable(t.id)}
                          disabled={isProcessing}
                        >
                          <span>{t.name}</span>
                          <span className="font-bold">${orderTotal.toFixed(2)}</span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              <AnimatePresence>
                {selectedOrder && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    exit={{ opacity: 0, height: 0 }}
                    className="card overflow-hidden"
                  >
                    <h3 className="font-bold mb-4">Payment Method</h3>
                    <div className="grid-3 gap-2">
                      <button 
                        className={`btn ${paymentMode === 'CASH' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setPaymentMode('CASH')}
                        disabled={isProcessing}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1rem' }}
                      >
                        <Banknote size={24} /> Cash
                      </button>
                      <button 
                        className={`btn ${paymentMode === 'CARD' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setPaymentMode('CARD')}
                        disabled={isProcessing}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1rem' }}
                      >
                        <CreditCard size={24} /> Card
                      </button>
                      <button 
                        className={`btn ${paymentMode === 'UPI' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setPaymentMode('UPI')}
                        disabled={isProcessing}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1rem' }}
                      >
                        <Smartphone size={24} /> UPI
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column: Receipt Preview */}
            <div>
              <AnimatePresence mode="wait">
                {selectedOrder ? (
                  <motion.div 
                    key="receipt"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="card h-full flex flex-col" 
                    style={{ backgroundColor: 'var(--bg-surface)' }}
                  >
                    <div className="text-center mb-6 border-b pb-4">
                      <Receipt size={32} className="mx-auto mb-2 text-primary" color="var(--primary-color)" />
                      <h2 className="font-bold text-xl">Order #{selectedOrder.id}</h2>
                      <p className="text-secondary">{tables.find(t => t.id === selectedTable)?.name}</p>
                    </div>

                    <div className="flex-1 overflow-y-auto flex-col flex gap-3 mb-6">
                      {selectedOrder.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <span>{item.name}</span>
                          <span className="font-bold">${item.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4 flex-col flex gap-2">
                      <div className="flex justify-between text-secondary text-sm">
                        <span>Subtotal</span>
                        <span>${selectedOrder.total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-secondary text-sm">
                        <span>Tax (5%)</span>
                        <span>${(selectedOrder.total * 0.05).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-xl mt-2 pt-2 border-t">
                        <span>Total</span>
                        <span className="text-primary" style={{ color: 'var(--primary-color)' }}>${(selectedOrder.total * 1.05).toFixed(2)}</span>
                      </div>
                    </div>

                    <motion.button 
                      whileTap={paymentMode && !isProcessing ? { scale: 0.95 } : {}}
                      className="btn btn-primary mt-6 w-full" 
                      style={{ padding: '1rem', fontSize: '1.1rem' }}
                      disabled={!paymentMode || isProcessing}
                      onClick={handleFinalize}
                    >
                      {isProcessing ? 'Processing...' : `Pay $${(selectedOrder.total * 1.05).toFixed(2)}`}
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="card h-full flex flex-col items-center justify-center text-secondary border-dashed"
                  >
                    <Receipt size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                    <p>Select a table to view the receipt and process payment.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Billing;
