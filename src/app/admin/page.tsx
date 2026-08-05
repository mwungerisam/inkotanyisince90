'use client';

import { useMemo, useRef, useState } from 'react';
import { Order, Product, SalesReport } from '@/types';
import {
  getAdminSession,
  getStoredOrders,
  getStoredProducts,
  saveAdminSession,
  saveOrders,
  saveProducts,
} from '@/lib/storage';

const EMPTY_PRODUCT: Product = {
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
};

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => getAdminSession());
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'reports'>('products');
  const [products, setProducts] = useState<Product[]>(() => getStoredProducts());
  const [orders, setOrders] = useState<Order[]>(() => getStoredOrders());
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const notificationTimeoutRef = useRef<number | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    if (notificationTimeoutRef.current) {
      window.clearTimeout(notificationTimeoutRef.current);
    }
    notificationTimeoutRef.current = window.setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const filteredProducts = useMemo(() => {
    const query = productSearch.trim().toLowerCase();

    if (!query) {
      return products;
    }

    return products.filter((product) => {
      return [product.code, product.name, product.category]
        .join(' ')
        .toLowerCase()
        .includes(query);
    });
  }, [productSearch, products]);

  const filteredOrders = useMemo(() => {
    const query = orderSearch.trim().toLowerCase();

    if (!query) {
      return orders;
    }

    return orders.filter((order) => {
      return [
        order.id,
        order.referenceId || '',
        order.customer.name,
        order.customer.phone,
        order.customer.email,
        order.status,
      ]
        .join(' ')
        .toLowerCase()
        .includes(query);
    });
  }, [orderSearch, orders]);

  const reports = useMemo<SalesReport[]>(() => {
    return orders.map((order) => ({
      orderId: order.id,
      date: order.createdAt,
      items: order.items,
      total: order.total,
      customerPhone: order.customer.phone,
      customerEmail: order.customer.email,
      status: order.status,
    }));
  }, [orders]);

  const totalRevenue = orders
    .filter((order) => order.status !== 'cancelled')
    .reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const processingOrders = orders.filter(
    (order) => order.status === 'pending' || order.status === 'processing'
  ).length;
const completedOrders = orders.filter((order) => order.status === 'completed').length;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      setLoginError('Please enter a password.');
      return;
    }

    setIsLoading(true);
    setLoginError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setLoginError(data.error || 'Invalid password');
        return;
      }

      setIsAuthenticated(true);
      setPassword('');
      saveAdminSession(true);
    } catch {
      setLoginError('Unable to reach the login service. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginError('');
    setPassword('');
    saveAdminSession(false);
  };

  const openProductForm = (product: Product | null) => {
    setEditingProduct(product);
    setShowAddForm(true);
  };

  const closeProductForm = () => {
    setEditingProduct(null);
    setShowAddForm(false);
  };

  const handleSaveProduct = (product: Product) => {
    const normalizedProduct: Product = {
      ...product,
      code: product.code.trim().toUpperCase(),
      name: product.name.trim(),
      description: product.description.trim(),
      images: product.images.filter(Boolean),
      sizes: product.category === 'accessories' ? ['One Size'] : product.sizes,
      stock: Math.max(0, product.stock || 0),
      price: Math.max(0, product.price),
    };

    const duplicateCode = products.some(
      (existingProduct) =>
        existingProduct.code.toLowerCase() === normalizedProduct.code.toLowerCase() &&
        existingProduct.id !== normalizedProduct.id
    );

    if (duplicateCode) {
      showNotification('error', 'A product with this code already exists.');
      return;
    }

    let updatedProducts: Product[];

    if (editingProduct) {
      updatedProducts = products.map((existingProduct) =>
        existingProduct.id === normalizedProduct.id ? normalizedProduct : existingProduct
      );
    } else {
      updatedProducts = [
        ...products,
        {
          ...normalizedProduct,
          id: `PROD-${Date.now()}`,
        },
      ];
    }

    setProducts(updatedProducts);
    saveProducts(updatedProducts);
    closeProductForm();
    showNotification('success', editingProduct ? 'Product updated successfully.' : 'Product added successfully.');
  };

  const handleDeleteProduct = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) {
      return;
    }

    setShowAddForm(false);
    setPendingDelete(product);
  };

  const confirmDeleteProduct = () => {
    if (!pendingDelete) {
      return;
    }

    const updatedProducts = products.filter((product) => product.id !== pendingDelete.id);
    setProducts(updatedProducts);
    saveProducts(updatedProducts);
    setPendingDelete(null);
    showNotification('success', 'Product deleted.');
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status } : order
    );

    setOrders(updatedOrders);
    saveOrders(updatedOrders);
  };

  const handleDownloadReport = () => {
    const reportPayload = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalRevenue,
        totalOrders,
        processingOrders,
        completedOrders,
      },
      orders: reports,
    };

    const blob = new Blob([JSON.stringify(reportPayload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `sales-report-${new Date().toISOString().split('T')[0]}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

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
              {loginError && (
                <p className="text-sm text-red-600">{loginError}</p>
              )}
<button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-3 text-sm font-medium hover:bg-gray-800 transition-colors rounded-lg disabled:opacity-60"
              >
                {isLoading ? 'Logging in...' : 'Login'}
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
          <div>
            <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 mt-2">
              Manage products, monitor order progress, and export sales data.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-gray-300 font-medium hover:bg-gray-100 transition-colors rounded-lg"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-sm font-medium text-gray-600 mb-2">Total Revenue</h2>
            <p className="text-3xl font-semibold">{totalRevenue.toLocaleString()} RWF</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-sm font-medium text-gray-600 mb-2">Total Orders</h2>
            <p className="text-3xl font-semibold">{totalOrders}</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-sm font-medium text-gray-600 mb-2">Open Orders</h2>
            <p className="text-3xl font-semibold">{processingOrders}</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-sm font-medium text-gray-600 mb-2">Completed Orders</h2>
            <p className="text-3xl font-semibold">{completedOrders}</p>
          </div>
        </div>

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

        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-end gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-semibold">Product Management</h2>
                <p className="text-sm text-gray-500 mt-2">
                  Add, edit, and maintain the storefront catalogue.
                </p>
              </div>
              <button
                onClick={() => openProductForm(null)}
                className="px-6 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors rounded-lg"
              >
                Add New Product
              </button>
            </div>

            <div className="mb-6">
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search by code, name, or category"
                className="w-full max-w-md p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {showAddForm && (
              <ProductForm
                key={editingProduct?.id || 'new-product'}
                product={editingProduct}
                onSave={handleSaveProduct}
                onCancel={closeProductForm}
              />
            )}

            <div className="border border-gray-200 rounded-lg overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-medium text-sm">Code</th>
                    <th className="text-left p-4 font-medium text-sm">Name</th>
                    <th className="text-left p-4 font-medium text-sm">Category</th>
                    <th className="text-left p-4 font-medium text-sm">Price</th>
                    <th className="text-left p-4 font-medium text-sm">Sizes</th>
                    <th className="text-left p-4 font-medium text-sm">Stock</th>
                    <th className="text-left p-4 font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-gray-200 align-top">
                      <td className="p-4 font-medium">{product.code}</td>
                      <td className="p-4">
                        <p>{product.name}</p>
                        {product.isNew && (
                          <span className="inline-block mt-2 px-2 py-1 text-[10px] font-bold uppercase bg-gray-100">
                            New
                          </span>
                        )}
                      </td>
                      <td className="p-4 capitalize">{product.category}</td>
                      <td className="p-4">{product.price.toLocaleString()} RWF</td>
                      <td className="p-4">{product.sizes.join(', ')}</td>
                      <td className="p-4">{product.stock || 0}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openProductForm(product)}
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
              {filteredProducts.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-lg font-medium">No matching products found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <div className="flex justify-between items-end gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-semibold">Order Management</h2>
                <p className="text-sm text-gray-500 mt-2">
                  Track payment progress and move orders through fulfillment.
                </p>
              </div>
            </div>

            <div className="mb-6">
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search by order ID, reference, customer, email, or status"
                className="w-full max-w-md p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="border border-gray-200 rounded-lg overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-medium text-sm">Order ID</th>
                    <th className="text-left p-4 font-medium text-sm">Reference</th>
                    <th className="text-left p-4 font-medium text-sm">Customer</th>
                    <th className="text-left p-4 font-medium text-sm">Items</th>
                    <th className="text-left p-4 font-medium text-sm">Total</th>
                    <th className="text-left p-4 font-medium text-sm">Status</th>
                    <th className="text-left p-4 font-medium text-sm">Date</th>
                    <th className="text-left p-4 font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-200 align-top">
                      <td className="p-4 font-medium">{order.id}</td>
                      <td className="p-4 text-sm text-gray-500">{order.referenceId || '—'}</td>
                      <td className="p-4">
                        <p>{order.customer.name}</p>
                        <p className="text-sm text-gray-500">{order.customer.phone}</p>
                        <p className="text-sm text-gray-500">{order.customer.email}</p>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {order.items.map((item) => `${item.product.name} (${item.size}) × ${item.quantity}`).join(', ')}
                      </td>
                      <td className="p-4">{order.total.toLocaleString()} RWF</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 text-xs font-bold uppercase ${
                            order.status === 'completed'
                              ? 'bg-green-100'
                              : order.status === 'processing' || order.status === 'pending'
                                ? 'bg-yellow-100'
                                : 'bg-red-100'
                          }`}
                        >
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
                          <option value="processing">Processing</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredOrders.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-lg font-medium">No matching orders found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-semibold">Sales Reports</h2>
                <p className="text-sm text-gray-500 mt-2">
                  Export current order data and review the latest sales summary.
                </p>
              </div>
              <button
                onClick={handleDownloadReport}
                className="px-6 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors rounded-lg"
              >
                Download Report
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Revenue Tracked</h3>
                <p className="text-2xl font-semibold">{totalRevenue.toLocaleString()} RWF</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Orders In Report</h3>
                <p className="text-2xl font-semibold">{reports.length}</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Completed Orders</h3>
                <p className="text-2xl font-semibold">{completedOrders}</p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-x-auto">
              <table className="w-full min-w-[1000px]">
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
                  {reports.map((report) => (
                    <tr key={report.orderId} className="border-b border-gray-200 align-top">
                      <td className="p-4 font-medium">{report.orderId}</td>
                      <td className="p-4">{new Date(report.date).toLocaleDateString()}</td>
                      <td className="p-4 text-sm text-gray-600">
                        {report.items.map((item) => `${item.product.name} (${item.quantity})`).join(', ')}
                      </td>
                      <td className="p-4">{report.total.toLocaleString()} RWF</td>
                      <td className="p-4">
                        <p>{report.customerPhone}</p>
                        <p className="text-sm text-gray-500">{report.customerEmail}</p>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 text-xs font-bold uppercase ${
                            report.status === 'completed'
                              ? 'bg-green-100'
                              : report.status === 'processing' || report.status === 'pending'
                                ? 'bg-yellow-100'
                                : 'bg-red-100'
                          }`}
                        >
                          {report.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {reports.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-lg font-medium">No sales data available</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Toast notification */}
      {notification && (
        <div
          role="status"
          className={`fixed bottom-6 right-6 z-50 max-w-sm rounded-lg px-5 py-4 text-sm font-medium shadow-lg border ${
            notification.type === 'success'
              ? 'bg-white text-green-700 border-green-200'
              : 'bg-white text-red-700 border-red-200'
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Delete confirmation dialog */}
      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-2">Delete product?</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete{' '}
              <span className="font-medium text-black">{pendingDelete.name}</span> ({pendingDelete.code})?
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmDeleteProduct}
                className="flex-1 bg-red-600 text-white py-2.5 text-sm font-medium hover:bg-red-700 transition-colors rounded-lg"
              >
                Delete
              </button>
              <button
                onClick={() => setPendingDelete(null)}
                className="flex-1 py-2.5 border border-gray-300 font-medium hover:bg-gray-100 transition-colors rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductForm({
  product,
  onSave,
  onCancel,
}: {
  product: Product | null;
  onSave: (product: Product) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Product>(product || EMPTY_PRODUCT);
  const [rawImages, setRawImages] = useState(product?.images.join('\n') || '');
  const [rawSizes, setRawSizes] = useState(product?.sizes.join(', ') || 'S, M, L');
  const [formError, setFormError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedImages = rawImages
      .split('\n')
      .map((image) => image.trim())
      .filter(Boolean);

    const parsedSizes = formData.category === 'accessories'
      ? ['One Size']
      : rawSizes
          .split(',')
          .map((size) => size.trim())
          .filter(Boolean);

    if (parsedImages.length === 0) {
      setFormError('Add at least one image path.');
      return;
    }

    if (parsedSizes.length === 0) {
      setFormError('Add at least one size.');
      return;
    }

    setFormError('');
    onSave({
      ...formData,
      code: formData.code.trim(),
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Number.isNaN(formData.price) ? 0 : formData.price,
      stock: Number.isNaN(formData.stock || 0) ? 0 : formData.stock || 0,
      images: parsedImages,
      sizes: parsedSizes,
    });
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
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
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
              onChange={(e) => setFormData({ ...formData, category: e.target.value as Product['category'] })}
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
              min="0"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Sizes</label>
            <input
              type="text"
              value={formData.category === 'accessories' ? 'One Size' : rawSizes}
              onChange={(e) => setRawSizes(e.target.value)}
              disabled={formData.category === 'accessories'}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-50"
              placeholder="S, M, L"
            />
            <p className="text-xs text-gray-500 mt-2">Separate sizes with commas.</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Mark as New Arrival</label>
            <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg">
              <input
                type="checkbox"
                checked={Boolean(formData.isNew)}
                onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">Show in new arrivals</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Image Paths</label>
          <textarea
            value={rawImages}
            onChange={(e) => setRawImages(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
            rows={5}
            placeholder="/images/product-front.png&#10;/images/product-back.png"
            required
          />
          <p className="text-xs text-gray-500 mt-2">Add one image path per line.</p>
        </div>

        {formError && <p className="text-sm text-red-600">{formError}</p>}

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
