import { prisma } from "@/lib/prisma";

interface ParsedOrderItem {
  name: string;
  quantity: number;
  price: number;
  productId?: string;
}

interface ParsedOrder {
  contact: string;
  items: ParsedOrderItem[];
  notes?: string;
}

export async function extractAndCreateOrder(
  aiReply: string,
  userId: string,
  conversationId: string,
  channel: string
): Promise<string | null> {
  const match = aiReply.match(/ORDER_JSON:(\{.*\})/);
  if (!match) return null;

  let parsed: ParsedOrder;
  try {
    parsed = JSON.parse(match[1]);
  } catch {
    return null;
  }

  if (!parsed.items?.length) return null;

  const total = parsed.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = await prisma.order.create({
    data: {
      userId,
      conversationId,
      contact: parsed.contact,
      channel,
      notes: parsed.notes,
      total,
      items: {
        create: parsed.items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          productId: item.productId ?? null,
        })),
      },
    },
  });

  return order.id;
}
