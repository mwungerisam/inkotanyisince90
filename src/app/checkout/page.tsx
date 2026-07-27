'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Order } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart, updateQuantity, removeFromCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    subscribe: false,
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    country: 'Rwanda',
    postalCode: '',
    phone: '',
    mtnPhone: '',
    mtnName: '',
  });

  const subtotal = cart.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmitOrder = async () => {
    // Validate required fields
    if (!formData.email || !formData.firstName || !formData.lastName || 
        !formData.address || !formData.city || !formData.phone ||
        !formData.mtnPhone || !formData.mtnName) {
      alert('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);

    // Create order
    const order: Order = {
      id: `ORD-${Date.now()}`,
      items: cart.items,
      total: subtotal,
      customer: {
        name: `${formData.firstName} ${formData.lastName}`,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
      },
      paymentMethod: 'mtn',
      status: 'pending',
      createdAt: new Date(),
    };

    // Save order to localStorage
    const existingOrders = JSON.parse(localStorage.getItem('inkotanyi-orders') || '[]');
    localStorage.setItem('inkotanyi-orders', JSON.stringify([...existingOrders, order]));

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    clearCart();
    router.push('/order-confirmation');
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="fixed top-0 left-0 right-0 z-50 bg-white">
          <div className="max-w-2xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.push('/')}
                className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                aria-label="Go back"
              >
                <ChevronLeft className="w-5 h-5 text-gray-900" strokeWidth={2} />
              </button>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight uppercase">CHECKOUT</h1>
              <div className="w-9" />
            </div>
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-6 pt-24 pb-8 text-center">
          <p className="text-base font-semibold text-gray-900 mb-4">Your cart is empty</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-900 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const cartCount = cart.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/')}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft className="w-5 h-5 text-gray-900" strokeWidth={2} />
            </button>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight uppercase">CHECKOUT</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">{cartCount}</span>
              <ShoppingBag className="w-5 h-5 text-gray-900" strokeWidth={2} />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Payment Section */}
            <div className="border border-gray-200 p-6">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Payment</h2>
              <button
                className="w-full p-4 border-2 border-black flex items-center justify-center gap-3 bg-black text-white hover:bg-gray-800 transition-colors"
              >
                <span className="font-bold uppercase text-sm">Pay with MTN Mobile Money</span>
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-xs text-gray-500 uppercase tracking-wider">Or continue below</span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            {/* Contact Information */}
            <div className="border border-gray-200 p-6">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-sm"
                    required
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="subscribe"
                    checked={formData.subscribe}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <span className="text-xs text-gray-600">Subscribe to updates</span>
                </label>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="border border-gray-200 p-6">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="John"
                      className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                      className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-sm"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Main Street"
                    className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Apartment, Suite, Unit (optional)</label>
                  <input
                    type="text"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleInputChange}
                    placeholder="Apt 4B"
                    className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Kigali"
                    className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 bg-gray-50 text-sm"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="0000"
                    className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+250 7XX XXX XXX"
                    className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* MTN Payment Details */}
            <div className="border border-gray-200 p-6">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">MTN Mobile Money Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">MTN Phone Number</label>
                  <input
                    type="tel"
                    name="mtnPhone"
                    value={formData.mtnPhone}
                    onChange={handleInputChange}
                    placeholder="+250 7XX XXX XXX"
                    className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Account Holder Name</label>
                  <input
                    type="text"
                    name="mtnName"
                    value={formData.mtnName}
                    onChange={handleInputChange}
                    placeholder="Name on MTN account"
                    className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmitOrder}
              disabled={isProcessing}
              className="w-full bg-black text-white py-4 text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : 'Complete Order'}
            </button>
          </div>

          {/* Right Column - Cart Summary */}
          <div className="border border-gray-200 p-6 h-fit">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Your Cart</h2>
            <div className="space-y-4 mb-6">
              {cart.items.map((item) => (
                <div key={`${item.product.id}-${item.size}`} className="flex gap-4 border-b border-gray-200 pb-4">
                  <div className="relative w-16 h-16 bg-white shrink-0 overflow-hidden border border-gray-200">
                    {item.product.images[0] && (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        sizes="64px"
                        quality={70}
                        className="object-contain"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-900 uppercase">{item.product.name}</p>
                    <p className="text-xs text-gray-500">{item.product.code}</p>
                    <p className="text-xs text-gray-500">Size: {item.size}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                        className="w-6 h-6 border border-gray-300 flex items-center justify-center text-gray-900 hover:bg-gray-50"
                      >
                        <Minus className="w-3 h-3" strokeWidth={2} />
                      </button>
                      <span className="w-6 text-center text-xs font-medium text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                        className="w-6 h-6 border border-gray-300 flex items-center justify-center text-gray-900 hover:bg-gray-50"
                      >
                        <Plus className="w-3 h-3" strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-900">
                      {(item.product.price * item.quantity).toLocaleString()} RWF
                    </p>
                    <button
                      onClick={() => removeFromCart(item.product.id, item.size)}
                      className="text-xs text-gray-500 hover:text-gray-900 mt-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="border-t border-gray-200 pt-4 space-y-3">
              <div className="flex justify-between text-xs font-semibold text-gray-900">
                <span className="uppercase">Subtotal</span>
                <span>{subtotal.toLocaleString()} RWF</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-gray-900">
                <span className="uppercase">Shipping</span>
                <span>Calculated at next step</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-gray-900">
                <span className="uppercase">Taxes</span>
                <span>Calculated at next step</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-gray-900 border-t border-gray-200 pt-3">
                <span className="uppercase">Total</span>
                <span>{subtotal.toLocaleString()} RWF</span>
              </div>
            </div>

            {/* Branding */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wider">INKOTANYI SINCE 90</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
