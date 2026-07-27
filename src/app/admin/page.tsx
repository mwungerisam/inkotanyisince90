'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product, Order, SalesReport } from '@/types';
import { products as initialProducts } from '@/data/products';

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'reports'>('products');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Simple authentication (in production, use proper auth)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid password');
    }
  };

  useEffect(() => {
    // Load orders from localStorage
    const savedOrders = JSON.parse(localStorage.getItem('inkotanyi-orders') || '[]');
    setOrders(savedOrders);

    // Load products from localStorage if any
    const savedProducts = JSON.parse(localStorage.getItem('inkotanyi-products') || '[]');
    if (savedProducts.length > 0) {
      setProducts(savedProducts);
    }
  }, []);

  const handleSaveProduct = (product: Product) => {
    let updatedProducts;
    if (editingProduct) {
      updatedProducts = products.map(p => p.id === product.id ? product : p);
    } else {
      updatedProducts = [...products, { ...product, id: `PROD-${Date.now()}` }];
    }
    setProducts(updatedProducts);
    localStorage.setItem('inkotanyi-products', JSON.stringify(updatedProducts));
    setEditingProduct(null);
    setShowAddForm(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const updatedProducts = products.filter(p => p.id !== id);
      setProducts(updatedProducts);
      localStorage.setItem('inkotanyi-products', JSON.stringify(updatedProducts));
    }
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('inkotanyi-orders', JSON.stringify(updatedOrders));
  };

  const generateSalesReport = (): SalesReport[] => {
    return orders.map(order => ({
      orderId: order.id,
      date: order.createdAt,
      items: order.items,
      total: order.total,
      customerPhone: order.customer.phone,
      customerEmail: order.customer.email,
      status: order.status,
    }));
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  if (!isAuthenticated) {
    return (
      <div className="flex-1 pt-36 pb-16">
        <div className="max-w-md mx-auto px-8 md:px-16 lg:px-20">
          <div className="border border-gray-200 rounded-lg p-8">
            <h1 className="text-3xl font-semibold mb-6 text-center">Admin Login</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter admin password"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white py-3 text-sm font-medium hover:bg-gray-800 transition-colors rounded-lg"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 pt-36 pb-16">
      <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 border border-gray-300 font-medium hover:bg-gray-100 transition-colors rounded-lg"
          >
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-sm font-medium text-gray-600 mb-2">Total Revenue</h2>
            <p className="text-3xl font-semibold">{totalRevenue.toLocaleString()} RWF</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-sm font-medium text-gray-600 mb-2">Total Orders</h2>
            <p className="text-3xl font-semibold">{totalOrders}</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-sm font-medium text-gray-600 mb-2">Pending Orders</h2>
            <p className="text-3xl font-semibold">{pendingOrders}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'products' ? 'bg-black text-white' : 'hover:bg-gray-100'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'orders' ? 'bg-black text-white' : 'hover:bg-gray-100'
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'reports' ? 'bg-black text-white' : 'hover:bg-gray-100'
            }`}
          >
            Sales Reports
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Product Management</h2>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setShowAddForm(true);
                }}
                className="px-6 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors rounded-lg"
              >
                Add New Product
              </button>
            </div>

            {showAddForm && (
              <ProductForm
                product={editingProduct}
                onSave={handleSaveProduct}
                onCancel={() => {
                  setShowAddForm(false);
                  setEditingProduct(null);
                }}
              />
            )}

            <div className="border border-gray-200 rounded-lg">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-medium text-sm">Code</th>
                    <th className="text-left p-4 font-medium text-sm">Name</th>
                    <th className="text-left p-4 font-medium text-sm">Price</th>
                    <th className="text-left p-4 font-medium text-sm">Stock</th>
                    <th className="text-left p-4 font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-gray-200">
                      <td className="p-4 font-medium">{product.code}</td>
                      <td className="p-4">{product.name}</td>
                      <td className="p-4">{product.price.toLocaleString()} RWF</td>
                      <td className="p-4">{product.stock || 0}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setShowAddForm(true);
                            }}
                            className="px-3 py-1 border border-gray-300 text-sm font-medium hover:bg-gray-100 transition-colors rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="px-3 py-1 border border-red-300 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Order Management</h2>
            <div className="border border-gray-200 rounded-lg">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-medium text-sm">Order ID</th>
                    <th className="text-left p-4 font-medium text-sm">Customer</th>
                    <th className="text-left p-4 font-medium text-sm">Total</th>
                    <th className="text-left p-4 font-medium text-sm">Status</th>
                    <th className="text-left p-4 font-medium text-sm">Date</th>
                    <th className="text-left p-4 font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-200">
                      <td className="p-4 font-medium">{order.id}</td>
                      <td className="p-4">
                        <p>{order.customer.name}</p>
                        <p className="text-sm text-gray-500">{order.customer.phone}</p>
                      </td>
                      <td className="p-4">{order.total.toLocaleString()} RWF</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs font-bold uppercase ${
                          order.status === 'completed' ? 'bg-green-100' :
                          order.status === 'pending' ? 'bg-yellow-100' :
                          'bg-red-100'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                          className="px-3 py-1 border border-gray-300 text-sm font-medium rounded focus:outline-none focus:ring-2 focus:ring-black"
                        >
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-lg font-medium">No orders yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Sales Reports</h2>
              <button
                onClick={() => {
                  const reports = generateSalesReport();
                  const blob = new Blob([JSON.stringify(reports, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `sales-report-${new Date().toISOString().split('T')[0]}.json`;
                  a.click();
                }}
                className="px-6 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors rounded-lg"
              >
                Download Report
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-medium text-sm">Order ID</th>
                    <th className="text-left p-4 font-medium text-sm">Date</th>
                    <th className="text-left p-4 font-medium text-sm">Items</th>
                    <th className="text-left p-4 font-medium text-sm">Total</th>
                    <th className="text-left p-4 font-medium text-sm">Customer</th>
                    <th className="text-left p-4 font-medium text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {generateSalesReport().map((report) => (
                    <tr key={report.orderId} className="border-b border-gray-200">
                      <td className="p-4 font-medium">{report.orderId}</td>
                      <td className="p-4">{new Date(report.date).toLocaleDateString()}</td>
                      <td className="p-4">
                        {report.items.map(item => `${item.product.name} (${item.quantity})`).join(', ')}
                      </td>
                      <td className="p-4">{report.total.toLocaleString()} RWF</td>
                      <td className="p-4">
                        <p>{report.customerPhone}</p>
                        <p className="text-sm text-gray-500">{report.customerEmail}</p>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs font-bold uppercase ${
                          report.status === 'completed' ? 'bg-green-100' :
                          report.status === 'pending' ? 'bg-yellow-100' :
                          'bg-red-100'
                        }`}>
                          {report.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-lg font-medium">No sales data available</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductForm({ product, onSave, onCancel }: { product: Product | null; onSave: (product: Product) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState<Product>(
    product || {
      id: '',
      code: '',
      name: '',
      price: 0,
      description: '',
      category: 'tshirts',
      images: [],
      sizes: ['S', 'M', 'L'],
      isNew: false,
      stock: 0,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4">{product ? 'Edit Product' : 'Add New Product'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Product Code</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Price (RWF)</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Product Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
            rows={3}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="tshirts">T-Shirts</option>
              <option value="hoodies">Hoodies</option>
              <option value="polos">Polos</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Stock</label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-black text-white py-3 text-sm font-medium hover:bg-gray-800 transition-colors rounded-lg"
          >
            Save Product
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 border border-gray-300 font-medium hover:bg-gray-100 transition-colors rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
