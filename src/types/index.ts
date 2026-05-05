export type Role = 'Super Admin' | 'Owner/Admin' | 'Manager' | 'Cashier' | 'Waiter/Captain' | 'Kitchen Staff' | 'Bar Staff' | 'Accountant' | 'Customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export type OrderType = 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';
export type OrderStatus = 'NEW' | 'ACCEPTED' | 'QUEUED' | 'PREPARING' | 'READY' | 'SERVED' | 'COMPLETED' | 'CANCELLED';

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  isAvailable: boolean;
  station: 'KITCHEN' | 'BAR';
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
  status: OrderStatus; // Item level status
  station: 'KITCHEN' | 'BAR';
}

export interface Order {
  id: string;
  type: OrderType;
  status: OrderStatus;
  items: OrderItem[];
  tableId?: string;
  seatId?: string;
  total: number;
  createdAt: number;
}

export interface Table {
  id: string;
  name: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'BILLING' | 'CLEANING';
  capacity: number;
  currentOrderId?: string;
  section?: string;
}

export interface KitchenTicket {
  id: string;
  orderId: string;
  items: OrderItem[];
  status: OrderStatus;
  station: 'KITCHEN' | 'BAR';
  createdAt: number;
  tableName?: string;
  orderType: OrderType;
}
