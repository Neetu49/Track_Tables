import { create } from 'zustand';
import type { Order, Table, KitchenTicket, OrderItem, MenuItem, OrderType } from '../types';
import { mockTables, mockMenu } from '../data/mockData';
import { MockEventBus } from '../services/MockEventBus';

interface POSState {
  tables: Table[];
  menu: MenuItem[];
  activeOrders: Order[];
  kitchenTickets: KitchenTicket[];
  
  // Cart state
  currentCart: OrderItem[];
  selectedTableId: string | null;
  selectedOrderType: OrderType;
  
  // Actions
  setOrderType: (type: OrderType) => void;
  selectTable: (tableId: string) => void;
  addToCart: (item: MenuItem, notes?: string) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  submitOrder: () => void;
  
  // KDS Actions
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  
  // Billing Actions
  finalizeOrder: (orderId: string) => void;
}

export const usePOSStore = create<POSState>((set, get) => ({
  tables: mockTables,
  menu: mockMenu,
  activeOrders: [],
  kitchenTickets: [],
  
  currentCart: [],
  selectedTableId: null,
  selectedOrderType: 'DINE_IN',
  
  setOrderType: (type) => set({ selectedOrderType: type }),
  selectTable: (tableId) => set({ selectedTableId: tableId }),
  
  addToCart: (menuItem, notes) => {
    const newItem: OrderItem = {
      id: Math.random().toString(36).substring(7),
      menuItemId: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: 1,
      notes,
      status: 'NEW',
      station: menuItem.station
    };
    set((state) => ({ currentCart: [...state.currentCart, newItem] }));
  },
  
  removeFromCart: (itemId) => {
    set((state) => ({ currentCart: state.currentCart.filter(i => i.id !== itemId) }));
  },
  
  clearCart: () => set({ currentCart: [], selectedTableId: null }),
  
  submitOrder: () => {
    set((state) => {
      if (!state.selectedTableId || state.currentCart.length === 0) return state;

      const existingOrderIndex = state.activeOrders.findIndex(o => o.tableId === state.selectedTableId && o.status !== 'COMPLETED');
      
      if (existingOrderIndex >= 0) {
        // Append to existing order
        const existingOrder = state.activeOrders[existingOrderIndex];
        const updatedOrder = {
          ...existingOrder,
          items: [...existingOrder.items, ...state.currentCart],
          total: existingOrder.total + state.currentCart.reduce((sum, item) => sum + item.price, 0),
        };
        
        MockEventBus.emit('ORDER_MODIFIED', updatedOrder);
        
        const newActiveOrders = [...state.activeOrders];
        newActiveOrders[existingOrderIndex] = updatedOrder;
        
        return {
          activeOrders: newActiveOrders,
          currentCart: [],
          selectedTableId: null
        };
      }

      // Create new order
      const newOrder: Order = {
        id: Math.random().toString(36).substring(2, 9),
        type: state.selectedOrderType,
        tableId: state.selectedTableId,
        items: state.currentCart,
        status: 'NEW',
        total: state.currentCart.reduce((sum, item) => sum + item.price, 0),
        createdAt: Date.now()
      };

      const updatedTables = state.tables.map(t => 
        t.id === state.selectedTableId ? { ...t, status: 'OCCUPIED' as const, currentOrderId: newOrder.id } : t
      );

      MockEventBus.emit('ORDER_CREATED', newOrder);

      return {
        activeOrders: [...state.activeOrders, newOrder],
        tables: updatedTables,
        currentCart: [],
        selectedTableId: null
      };
    });
  },
  
  updateOrderStatus: (orderId, status) => {
    set((state) => {
      const order = state.activeOrders.find(o => o.id === orderId);
      if (!order) return state;

      const updatedOrder = { ...order, status };
      const newActiveOrders = state.activeOrders.map(o => o.id === orderId ? updatedOrder : o);

      let updatedTables = state.tables;

      return { activeOrders: newActiveOrders, tables: updatedTables };
    });
    MockEventBus.emit('ORDER_STATUS_CHANGED', { orderId, status });
  },
  
  finalizeOrder: (orderId) => {
    set((state) => {
      const order = state.activeOrders.find(o => o.id === orderId);
      if (!order) return state;

      const updatedOrder = { ...order, status: 'COMPLETED' as const };

      const updatedTables = state.tables.map(t => 
        t.id === order.tableId ? { ...t, status: 'AVAILABLE' as const, currentOrderId: undefined } : t
      );

      return {
        activeOrders: state.activeOrders.map(o => o.id === orderId ? updatedOrder : o),
        tables: updatedTables
      };
    });
    MockEventBus.emit('ORDER_STATUS_CHANGED', { orderId, status: 'COMPLETED' });
  }
}));

// Cross-tab synchronization simulation
let isSyncing = false;
const channel = new BroadcastChannel('pos-store-sync');

channel.onmessage = (event) => {
  if (event.data.type === 'SYNC_STATE') {
    isSyncing = true;
    usePOSStore.setState(event.data.state);
    isSyncing = false;
  }
};

usePOSStore.subscribe((state) => {
  if (!isSyncing) {
    channel.postMessage({ type: 'SYNC_STATE', state });
  }
});
