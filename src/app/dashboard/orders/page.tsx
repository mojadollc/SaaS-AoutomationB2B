"use client";
import { useEffect, useState } from "react";
import { ShoppingCart, Package, CheckCircle, XCircle, Clock, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

type OrderItem = { id: string; name: string; quantity: number; price: number };
type Order = {
  id: string;
  contact: string;
  channel: string;
  status: string;
  total: number;
  currency: string;
  notes: string | null;
  items: OrderItem[];
  createdAt: string;
};

const STATUS_COLORS: Record<string, "yellow" | "green" | "red" | "gray"> = {
  PENDING: "yellow",
  CONFIRMED: "green",
  PROCESSING: "yellow",
  COMPLETED: "green",
  CANCELLED: "red",
};

const STATUS_OPTIONS = ["PENDING", "CONFIRMED", "PROCESSING", "COMPLETED", "CANCELLED"];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  async function fetchOrders() {
    const res = await fetch("/api/orders");
    if (res.ok) setOrders(await res.json());
  }

  useEffect(() => { fetchOrders(); }, []);

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await fetchOrders();
    setUpdating(null);
  }

  async function deleteOrder(id: string) {
    if (!confirm("Delete this order?")) return;
    await fetch(`/api/orders/${id}`, { method: "DELETE" });
    fetchOrders();
  }

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "PENDING").length,
    completed: orders.filter((o) => o.status === "COMPLETED").length,
    revenue: orders.filter((o) => o.status !== "CANCELLED").reduce((s, o) => s + o.total, 0),
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500 text-sm mt-1">Orders collected by your AI agents</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Orders", value: stats.total, icon: ShoppingCart, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Pending", value: stats.pending, icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" },
          { label: "Completed", value: stats.completed, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
          { label: "Revenue", value: `$${stats.revenue.toFixed(2)}`, icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label}>
            <CardContent className="flex items-center gap-4 py-5">
              <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="font-medium">No orders yet</p>
          <p className="text-sm mt-1">Orders placed through your ORDER_TAKING agents will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{order.contact}</p>
                      <p className="text-xs text-gray-400">
                        {order.channel} · {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={STATUS_COLORS[order.status] ?? "gray"}>{order.status}</Badge>
                  </div>

                  <div className="flex items-center gap-3">
                    <p className="font-semibold text-gray-900">${order.total.toFixed(2)}</p>

                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      disabled={updating === order.id}
                      className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>

                    <button
                      onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500"
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform ${expanded === order.id ? "rotate-180" : ""}`} />
                    </button>

                    <button
                      onClick={() => deleteOrder(order.id)}
                      className="p-1.5 hover:bg-red-50 rounded-lg text-red-400"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {expanded === order.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-xs text-gray-500 text-left">
                          <th className="pb-2">Item</th>
                          <th className="pb-2 text-center">Qty</th>
                          <th className="pb-2 text-right">Price</th>
                          <th className="pb-2 text-right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {order.items.map((item) => (
                          <tr key={item.id}>
                            <td className="py-1.5 text-gray-800">{item.name}</td>
                            <td className="py-1.5 text-center text-gray-600">{item.quantity}</td>
                            <td className="py-1.5 text-right text-gray-600">${item.price.toFixed(2)}</td>
                            <td className="py-1.5 text-right font-medium text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan={3} className="pt-3 text-right font-semibold text-gray-700">Total</td>
                          <td className="pt-3 text-right font-bold text-gray-900">${order.total.toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    </table>
                    {order.notes && (
                      <p className="mt-3 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                        Notes: {order.notes}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
