export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  status: 'confirmed' | 'running' | 'pending' | 'cancelled' | 'completed';
  total: number;
  orderDate: string; // Keep as string for display
  carType: string;
  timeSlot: string;
  paymentMethod: string;
}
