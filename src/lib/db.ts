import { Order } from '@/types';
import { getSupabaseAdmin, isSupabaseConfigured } from './supabase';
import {
  getServerOrders as getFileOrders,
  saveServerOrder as saveFileOrder,
  findServerOrderById as findFileOrderById,
  findServerOrderByReference as findFileOrderByReference,
  updateServerOrder as updateFileOrder,
  updateServerOrderByReference as updateFileOrderByReference,
} from './orders';

/**
 * Server-side order persistence that prefers Supabase when configured,
 * otherwise falls back to the existing file-based storage (useful for
 * local dev / when no DB is configured).
 */

function mapRowToOrder(row: any): Order {
  return {
    id: row.id,
    referenceId: row.reference_id ?? undefined,
    externalId: row.external_id ?? undefined,
    items: row.items ?? [],
    total: Number(row.total ?? 0),
    customer: {
      name: row.customer_name ?? '',
      phone: row.customer_phone ?? '',
      email: row.customer_email ?? '',
      address: row.customer_address ?? '',
    },
    paymentMethod: row.payment_method ?? 'mtn',
    status: row.status ?? 'pending',
    createdAt: new Date(row.created_at),
  };
}

function mapOrderToRow(order: Order) {
  return {
    id: order.id,
    reference_id: order.referenceId ?? null,
    external_id: order.externalId ?? null,
    items: order.items,
    total: order.total,
    status: order.status,
    customer_name: order.customer.name,
    customer_phone: order.customer.phone,
    customer_email: order.customer.email,
    customer_address: order.customer.address,
    payment_method: order.paymentMethod,
    created_at: order.createdAt,
  };
}

export async function getServerOrders(): Promise<Order[]> {
  if (!isSupabaseConfigured()) {
    return getFileOrders();
  }

  const supabase = getSupabaseAdmin()!;
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase getServerOrders failed:', error.message);
    throw new Error(`Failed to load orders: ${error.message}`);
  }

  return (data ?? []).map(mapRowToOrder);
}

export async function saveServerOrder(order: Order): Promise<void> {
  if (!isSupabaseConfigured()) {
    return saveFileOrder(order);
  }

  const supabase = getSupabaseAdmin()!;
  const { error } = await supabase.from('orders').insert(mapOrderToRow(order));

  if (error) {
    console.error('Supabase saveServerOrder failed:', error.message);
    throw new Error(`Failed to save order: ${error.message}`);
  }
}

export async function saveServerOrders(orders: Order[]): Promise<void> {
  if (!isSupabaseConfigured()) {
    // Rely on file-based batch write if needed.
    const fileOrders = await getFileOrders();
    // This is best-effort; the file path is only used when Supabase is absent.
    const { saveServerOrders: saveFileOrdersBatch } = await import('./orders');
    await saveFileOrdersBatch(orders);
    return;
  }

  const supabase = getSupabaseAdmin()!;
  const { error } = await supabase.from('orders').upsert(orders.map(mapOrderToRow));

  if (error) {
    console.error('Supabase saveServerOrders failed:', error.message);
    throw new Error(`Failed to save orders: ${error.message}`);
  }
}

export async function findServerOrderById(orderId: string): Promise<Order | null> {
  if (!isSupabaseConfigured()) {
    return findFileOrderById(orderId);
  }

  const supabase = getSupabaseAdmin()!;
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .maybeSingle();

  if (error) {
    console.error('Supabase findServerOrderById failed:', error.message);
    throw new Error(`Failed to find order: ${error.message}`);
  }

  return data ? mapRowToOrder(data) : null;
}

export async function findServerOrderByReference(referenceId: string): Promise<Order | null> {
  if (!isSupabaseConfigured()) {
    return findFileOrderByReference(referenceId);
  }

  const supabase = getSupabaseAdmin()!;
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('reference_id', referenceId)
    .maybeSingle();

  if (error) {
    console.error('Supabase findServerOrderByReference failed:', error.message);
    throw new Error(`Failed to find order by reference: ${error.message}`);
  }

  return data ? mapRowToOrder(data) : null;
}

export async function updateServerOrder(orderId: string, updates: Partial<Order>): Promise<Order | null> {
  if (!isSupabaseConfigured()) {
    return updateFileOrder(orderId, updates);
  }

  const supabase = getSupabaseAdmin()!;
  const patch: any = {};
  if (updates.status !== undefined) patch.status = updates.status;
  if (updates.referenceId !== undefined) patch.reference_id = updates.referenceId;
  if (updates.externalId !== undefined) patch.external_id = updates.externalId;
  if (updates.items !== undefined) patch.items = updates.items;
  if (updates.total !== undefined) patch.total = updates.total;
  if (updates.customer) {
    patch.customer_name = updates.customer.name;
    patch.customer_phone = updates.customer.phone;
    patch.customer_email = updates.customer.email;
    patch.customer_address = updates.customer.address;
  }
  patch.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('orders')
    .update(patch)
    .eq('id', orderId)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Supabase updateServerOrder failed:', error.message);
    throw new Error(`Failed to update order: ${error.message}`);
  }

  return data ? mapRowToOrder(data) : null;
}

export async function updateServerOrderByReference(referenceId: string, updates: Partial<Order>): Promise<Order | null> {
  if (!isSupabaseConfigured()) {
    return updateFileOrderByReference(referenceId, updates);
  }

  const supabase = getSupabaseAdmin()!;
  const patch: any = {};
  if (updates.status !== undefined) patch.status = updates.status;
  patch.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('orders')
    .update(patch)
    .eq('reference_id', referenceId)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Supabase updateServerOrderByReference failed:', error.message);
    throw new Error(`Failed to update order by reference: ${error.message}`);
  }

  return data ? mapRowToOrder(data) : null;
}
