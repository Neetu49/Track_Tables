import { Order, Table } from '../types';

export const ReceiptService = {
  /**
   * Simulates sending a digital receipt payload to a third-party service like WhatsApp/Twilio.
   */
  sendDigitalReceipt: async (order: Order, table: Table | undefined, paymentMode: string): Promise<boolean> => {
    
    // Construct the payload that would be sent to the backend
    const payload = {
      orderId: order.id,
      table: table?.name || 'Walk-in',
      paymentMode,
      totalAmount: (order.total * 1.05).toFixed(2),
      taxAmount: (order.total * 0.05).toFixed(2),
      items: order.items.map(item => ({
        name: item.name,
        price: item.price.toFixed(2),
      })),
      timestamp: new Date().toISOString()
    };

    console.log('[ReceiptService] Preparing to send digital receipt payload:', payload);

    // Simulate network request delay
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`[ReceiptService] Receipt sent successfully for Order #${order.id}`);
        resolve(true);
      }, 800);
    });
  }
};
