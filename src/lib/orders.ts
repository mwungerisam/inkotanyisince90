import { promises as fs } from 'fs';
import path from 'path';
import { Order } from '@/types';

const ordersFilePath = path.join(process.cwd(), 'data', 'orders.json');

async function readOrdersFile(): Promise<Order[]> {
  try {
    const raw = await fs.readFile(ordersFilePath, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      await fs.writeFile(ordersFilePath, '[]', 'utf-8');
      return [];
    }
    console.error('Error reading orders file:', error);
    return [];
  }
}

async function writeOrdersFile(orders: Order[]) {
  await fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 2), 'utf-8');
}

export async function getServerOrders(): Promise<Order[]> {
  return readOrdersFile();
}

export async function saveServerOrders(orders: Order[]): Promise<void> {
  await writeOrdersFile(orders);
}

export async function saveServerOrder(order: Order): Promise<void> {
  const orders = await readOrdersFile();
  orders.push(order);
  await writeOrdersFile(orders);
}

export async function findServerOrderById(orderId: string): Promise<Order | null> {
  const orders = await readOrdersFile();
  return orders.find((order) => order.id === orderId) ?? null;
}

export async function findServerOrderByReference(referenceId: string): Promise<Order | null> {
  const orders = await readOrdersFile();
  return orders.find((order) => order.referenceId === referenceId) ?? null;
}

export async function updateServerOrder(orderId: string, updates: Partial<Order>): Promise<Order | null> {
  const orders = await readOrdersFile();
  const index = orders.findIndex((order) => order.id === orderId);
  if (index === -1) {
    return null;
  }

  orders[index] = {
    ...orders[index],
    ...updates,
  };

  await writeOrdersFile(orders);
  return orders[index];
}

export async function updateServerOrderByReference(referenceId: string, updates: Partial<Order>): Promise<Order | null> {
  const orders = await readOrdersFile();
  const index = orders.findIndex((order) => order.referenceId === referenceId);
  if (index === -1) {
    return null;
  }

  orders[index] = {
    ...orders[index],
    ...updates,
  };

  await writeOrdersFile(orders);
  return orders[index];
}
