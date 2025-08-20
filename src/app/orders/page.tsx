"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { collection, getDocs, query, where } from "firebase/firestore";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/firebase";
import type { Order } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";


export default function OrdersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const q = searchQuery 
          ? query(collection(db, "bookings"), where("phone", ">=", searchQuery), where("phone", "<=", searchQuery + '\uf8ff'))
          : collection(db, "bookings");
        const querySnapshot = await getDocs(q);
        const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders: ", error);
        toast({
            variant: "destructive",
            title: "Failed to fetch orders",
            description: "Could not retrieve orders from the database.",
        });
      }
      setLoading(false);
    };

    const debounceTimer = setTimeout(() => {
        fetchOrders();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, toast]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage and view customer orders.</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>
            A list of all orders in the system. Search by phone number to filter results.
          </CardDescription>
          <div className="pt-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by phone number..."
                className="w-full rounded-lg bg-card pl-8 md:w-[200px] lg:w-[320px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Loading orders...
                  </TableCell>
                </TableRow>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <TableRow
                    key={order.id}
                    className="cursor-pointer"
                    onClick={() => router.push(`/orders/${order.id}`)}
                  >
                    <TableCell className="font-medium">#{order.id.slice(0, 6)}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>
                       <Badge variant={
                        order.status === 'Delivered' ? 'default' :
                        order.status === 'Shipped' ? 'secondary' :
                        order.status === 'Cancelled' ? 'destructive' : 'outline'
                      }>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {typeof order.total === 'number' ? `$${order.total.toFixed(2)}` : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
