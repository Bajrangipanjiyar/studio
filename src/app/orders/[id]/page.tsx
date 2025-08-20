"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft, FilePenLine } from "lucide-react";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import type { Order } from "@/lib/types";

const orderFormSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters."),
  phone: z.string().min(10, "Phone number must be at least 10 digits."),
  address: z.string().min(5, "Address must be at least 5 characters."),
  status: z.enum(["confirmed", "Pending", "Shipped", "Delivered", "Cancelled"]),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customerName: "",
      phone: "",
      address: "",
      status: "Pending",
    },
  });

  useEffect(() => {
    const fetchOrder = async () => {
      const orderId = params.id as string;
      if (!orderId) return;

      try {
        const docRef = doc(db, "bookings", orderId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const orderDate = data.date instanceof Timestamp ? data.date.toDate() : new Date();

          const orderData = { 
            id: docSnap.id,
            customerName: data.userName || 'N/A',
            phone: data.userPhone || 'N/A',
            address: data.address || 'N/A',
            status: data.status || 'Pending',
            total: Number(data.price) || 0,
            orderDate: orderDate.toISOString(),
            carType: data.carType || 'N/A',
            timeSlot: data.timeSlot || 'N/A',
          } as Order;

          setOrder(orderData);
          form.reset({
            customerName: orderData.customerName,
            phone: orderData.phone,
            address: orderData.address,
            status: orderData.status,
          });
        } else {
          toast({ variant: "destructive", title: "Order not found" });
          router.push("/orders");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        toast({ variant: "destructive", title: "Failed to fetch order details" });
        router.push("/orders");
      }
    };

    fetchOrder();
  }, [params.id, router, toast, form]);

  async function onSubmit(data: OrderFormValues) {
    if (!order) return;
    try {
        const orderRef = doc(db, 'bookings', order.id);
        const updateData = {
          userName: data.customerName,
          userPhone: data.phone,
          address: data.address,
          status: data.status
        };
        await updateDoc(orderRef, updateData);
        setOrder({ ...order, ...data });
        setIsEditing(false);
        toast({
            title: "Order Updated",
            description: `Order #${order.id.slice(0, 6)} has been updated.`,
        });
    } catch (error) {
        console.error("Error updating order: ", error);
        toast({
            variant: "destructive",
            title: "Update Failed",
            description: "Could not update the order in the database.",
        });
    }
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href="/orders">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Order Details
        </h1>
        <div className="ml-auto flex items-center gap-2">
            <Button size="sm" onClick={() => setIsEditing(!isEditing)} variant={isEditing ? "secondary" : "default"}>
                <FilePenLine className="h-4 w-4 mr-2" />
                {isEditing ? 'Cancel' : 'Edit Order'}
            </Button>
        </div>
      </div>
      
      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>Edit Order Information</CardTitle>
            <CardDescription>Update customer details and order status.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="123-456-7890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shipping Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St, Anytown, USA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Order Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select order status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Shipped">Shipped</SelectItem>
                            <SelectItem value="Delivered">Delivered</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                />
                <Button type="submit">Save Changes</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader>
                    <CardTitle>Customer Details</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="text-sm">
                        <p className="font-medium">Name</p>
                        <p className="text-muted-foreground">{order.customerName}</p>
                    </div>
                    <div className="text-sm">
                        <p className="font-medium">Phone</p>
                        <p className="text-muted-foreground">{order.phone}</p>
                    </div>
                    <div className="text-sm">
                        <p className="font-medium">Address</p>
                        <p className="text-muted-foreground">{order.address}</p>
                    </div>
                </CardContent>
            </Card>
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                        <div>
                            <p className="font-medium">Order ID</p>
                            <p className="text-muted-foreground">#{order.id.slice(0, 6)}</p>
                        </div>
                        <div>
                            <p className="font-medium">Order Date</p>
                            <p className="text-muted-foreground">{new Date(order.orderDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="font-medium">Status</p>
                            <p className="text-muted-foreground">{order.status}</p>
                        </div>
                        <div>
                            <p className="font-medium">Total</p>
                            <p className="font-bold text-foreground">{typeof order.total === 'number' ? `$${order.total.toFixed(2)}` : 'N/A'}</p>
                        </div>
                        <div>
                            <p className="font-medium">Car Type</p>
                            <p className="text-muted-foreground">{order.carType}</p>
                        </div>
                        <div>
                            <p className="font-medium">Time Slot</p>
                            <p className="text-muted-foreground">{order.timeSlot}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
