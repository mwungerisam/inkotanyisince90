export interface Product {
  id: string;
  code: string;
  name: string;
  price: number;
  description: string;
  category: 'tshirts' | 'hoodies' | 'polos' | 'accessories';
  images: string[];
  sizes: string[];
  isNew?: boolean;
  stock?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
}

export interface Cart {
  items: CartItem[];
  isOpen: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  paymentMethod: 'mtn';
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
}

export interface SalesReport {
  orderId: string;
  date: Date;
  items: CartItem[];
  total: number;
  customerPhone: string;
  customerEmail: string;
  status: string;
}
