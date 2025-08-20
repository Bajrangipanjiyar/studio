"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft, FilePenLine } from "lucide-react";
import { doc, getDoc, updateDoc } from "firebase/firestore";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import type { Order } from "@/lib/types";

const orderFormSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters."),
  phone: z.string().min(10, "Phone number must be at least 10 digits."),
  address: z.string().min(5, "Address must be at least 5 characters."),
  status: z.enum(["Pending", "Shipped", "Delivered", "Cancelled"]),
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
        const docRef = doc(db, "orders", orderId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const orderData = { id: docSnap.id, ...docSnap.data() } as Order;
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
        const orderRef = doc(db, 'orders', order.id);
        await updateDoc(orderRef, data);
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
                            <p className="font-bold text-foreground">${order.total.toFixed(2)}</p>
                        </div>
                    </div>
                    <h3 className="font-semibold mb-2">Items</h3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead className="text-center">Quantity</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.items.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell className="text-center">{item.quantity}</TableCell>
                                    <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
