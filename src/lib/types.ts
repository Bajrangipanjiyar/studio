export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  status: 'confirmed' | 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  orderDate: string; // Keep as string for display
  carType: string;
  timeSlot: string;
}
