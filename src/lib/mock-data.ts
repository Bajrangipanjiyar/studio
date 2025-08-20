import type { Order } from './types';

export const orders: Order[] = [
  {
    id: 'a1b2c3d4',
    customerName: 'Alice Johnson',
    phone: '123-456-7890',
    address: '123 Maple Street, Springfield, IL',
    status: 'Delivered',
    items: [
      { id: 'item-1', name: 'Wireless Mouse', quantity: 1, price: 25.99 },
      { id: 'item-2', name: 'USB-C Hub', quantity: 1, price: 39.99 },
    ],
    total: 65.98,
    orderDate: '2023-10-26',
  },
  {
    id: 'e5f6g7h8',
    customerName: 'Bob Smith',
    phone: '234-567-8901',
    address: '456 Oak Avenue, Metropolis, NY',
    status: 'Shipped',
    items: [
      { id: 'item-3', name: 'Mechanical Keyboard', quantity: 1, price: 120.0 },
    ],
    total: 120.0,
    orderDate: '2023-10-28',
  },
  {
    id: 'i9j0k1l2',
    customerName: 'Charlie Brown',
    phone: '345-678-9012',
    address: '789 Pine Lane, Gotham, NJ',
    status: 'Pending',
    items: [
      { id: 'item-4', name: '4K Webcam', quantity: 1, price: 89.5 },
      { id: 'item-5', name: 'Desk Mat', quantity: 1, price: 15.75 },
    ],
    total: 105.25,
    orderDate: '2023-10-30',
  },
  {
    id: 'm3n4o5p6',
    customerName: 'Diana Prince',
    phone: '456-789-0123',
    address: '101 Paradise Island, Themyscira, DC',
    status: 'Cancelled',
    items: [
      { id: 'item-6', name: 'Ergonomic Chair', quantity: 1, price: 350.0 },
    ],
    total: 350.0,
    orderDate: '2023-10-29',
  },
  {
    id: 'q7r8s9t0',
    customerName: 'Ethan Hunt',
    phone: '567-890-1234',
    address: '221B Baker Street, London, UK',
    status: 'Delivered',
    items: [
      { id: 'item-1', name: 'Wireless Mouse', quantity: 2, price: 25.99 },
      { id: 'item-7', name: 'Laptop Stand', quantity: 1, price: 45.0 },
    ],
    total: 96.98,
    orderDate: '2023-10-25',
  },
  {
    id: 'u1v2w3x4',
    customerName: 'Fiona Glenanne',
    phone: '678-901-2345',
    address: '305 Ocean Drive, Miami, FL',
    status: 'Pending',
    items: [
      { id: 'item-2', name: 'USB-C Hub', quantity: 1, price: 39.99 },
    ],
    total: 39.99,
    orderDate: '2023-10-31',
  },
  {
    id: 'y5z6a7b8',
    customerName: 'George Costanza',
    phone: '123-456-7890',
    address: '1344 Queens Blvd, Queens, NY',
    status: 'Shipped',
    items: [
      { id: 'item-8', name: 'Noise Cancelling Headphones', quantity: 1, price: 299.99 },
    ],
    total: 299.99,
    orderDate: '2023-10-30',
  },
];
