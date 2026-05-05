import type { MenuItem, Table, User } from '../types';

export const mockUsers: User[] = [
  { id: '1', name: 'Alice Owner', email: 'owner@test.com', role: 'Owner/Admin' },
  { id: '2', name: 'Bob Cashier', email: 'cashier@test.com', role: 'Cashier' },
  { id: '3', name: 'Charlie Waiter', email: 'waiter@test.com', role: 'Waiter/Captain' },
  { id: '4', name: 'Dave Kitchen', email: 'kitchen@test.com', role: 'Kitchen Staff' },
];

export const mockMenu: MenuItem[] = [
  { id: 'm1', name: 'Burger', category: 'Mains', price: 12.50, isAvailable: true, station: 'KITCHEN' },
  { id: 'm2', name: 'Fries', category: 'Sides', price: 4.50, isAvailable: true, station: 'KITCHEN' },
  { id: 'm3', name: 'Cola', category: 'Beverages', price: 2.50, isAvailable: true, station: 'BAR' },
  { id: 'm4', name: 'Salad', category: 'Mains', price: 8.50, isAvailable: true, station: 'KITCHEN' },
  { id: 'm5', name: 'Beer', category: 'Beverages', price: 6.00, isAvailable: true, station: 'BAR' },
];

export const mockTables: Table[] = [
  { id: 't1', name: 'Table 1', status: 'AVAILABLE', capacity: 4, section: 'Indoor' },
  { id: 't2', name: 'Table 2', status: 'OCCUPIED', capacity: 2, section: 'Indoor' },
  { id: 't3', name: 'Table 3', status: 'AVAILABLE', capacity: 6, section: 'Indoor' },
  { id: 't4', name: 'Table 4', status: 'AVAILABLE', capacity: 4, section: 'Indoor' },
  { id: 't5', name: 'Table 5', status: 'AVAILABLE', capacity: 2, section: 'Indoor' },
  { id: 't6', name: 'Table 6', status: 'CLEANING', capacity: 8, section: 'Outdoor' },
];
