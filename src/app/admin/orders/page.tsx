"use client";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

type OrderItem = { id: string; name: string; quantity: number; price: number };
type Order = {
  id: string;
  contact: string;
  channel: string;
  status: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
  user: { id: string; name: string | null; email: string };
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-900 text-yellow-300",
  CONFIRMED: "bg-blue-900 text-blue-300",
  PROCESSING: "bg-indigo-900 text-indigo-300",
  COMPLETED: "bg-green-900 text-green-300",
  CANCELLED: "bg-red-900 text-red-300",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expanded, setExpanded] = useState<string | null>(null);

  async function fetchOrders() {
    const params = new URLSearchParams({ page: String(page), ...(status ? { status } : {}) });
    const res = await fetch(`/api/admin/orders?${params}`);
    if (res.ok) {
      const data = await res.json();
      setOrders(data.orders);
      setTotalPages(data.pages);
    }
  }

  useEffect(() => { fetchOrders(); }, [status, page]);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">All Orders</h1>
          <p className="text-gray-400 text-sm mt-1">Orders across all users and channels</p>
        </div>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="bg-gray-900 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Statuses</option>
          {["PENDING", "CONFIRMED", "PROCESSING", "COMPLETED", "CANCELLED"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div
              className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-800/50"
              onClick={() => setExpanded(expanded === order.id ? null : order.id)}
            >
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-medium text-white text-sm">{order.contact}</p>
                  <p className="text-xs text-gray-400">
                    {order.user.email} · {order.channel} · {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status] ?? ""}`}>
                  {order.status}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-bold text-white">${order.total.toFixed(2)}</p>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expanded === order.id ? "rotate-180" : ""}`} />
              </div>
            </div>

            {expanded === order.id && (
              <div className="px-6 pb-5 border-t border-gray-800">
                <table className="w-full text-sm mt-4">
                  <thead>
                    <tr className="text-xs text-gray-500 text-left">
                      <th className="pb-2">Item</th>
                      <th className="pb-2 text-center">Qty</th>
                      <th className="pb-2 text-right">Price</th>
                      <th className="pb-2 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-2 text-gray-300">{item.name}</td>
                        <td className="py-2 text-center text-gray-400">{item.quantity}</td>
                        <td className="py-2 text-right text-gray-400">${item.price.toFixed(2)}</td>
                        <td className="py-2 text-right text-white font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="pt-3 text-right text-gray-400 font-semibold">Total</td>
                      <td className="pt-3 text-right text-white font-bold">${order.total.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-xs text-gray-500">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg text-gray-400 hover:bg-gray-800 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg text-gray-400 hover:bg-gray-800 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
