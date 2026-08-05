import { Cart, Product, Order } from '@/types';
import { products as defaultProducts } from '@/data/products';

const PRODUCTS_STORAGE_KEY = 'inkotanyi-products';
const ORDERS_STORAGE_KEY = 'inkotanyi-orders';
const CART_STORAGE_KEY = 'inkotanyi-cart';
const ADMIN_SESSION_STORAGE_KEY = 'inkotanyi-admin-session';

export function getStoredProducts(): Product[] {
  if (typeof window === 'undefined') {
    return defaultProducts;
  }

  try {
    const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!raw) {
      return defaultProducts;
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultProducts;
  } catch (error) {
    console.error('Error reading products from localStorage:', error);
    return defaultProducts;
  }
}

export function saveProducts(products: Product[]) {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
}

export function getStoredCart(): Cart {
  if (typeof window === 'undefined') {
    return { items: [], isOpen: false };
  }

  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      return { items: [], isOpen: false };
    }

    const parsed = JSON.parse(raw);
    return {
      items: Array.isArray(parsed?.items) ? parsed.items : [],
      isOpen: Boolean(parsed?.isOpen),
    };
  } catch (error) {
    console.error('Error reading cart from localStorage:', error);
    return { items: [], isOpen: false };
  }
}

export function saveCart(cart: Cart) {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

export function getAdminSession(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return localStorage.getItem(ADMIN_SESSION_STORAGE_KEY) === 'authenticated';
}

export function saveAdminSession(isAuthenticated: boolean) {
  if (typeof window === 'undefined') {
    return;
  }

  if (isAuthenticated) {
    localStorage.setItem(ADMIN_SESSION_STORAGE_KEY, 'authenticated');
    return;
  }

  localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
}

export function getStoredOrders(): Order[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error reading orders from localStorage:', error);
    return [];
  }
}

export function saveOrders(orders: Order[]) {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
}
