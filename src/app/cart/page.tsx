'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  ChevronLeft,
  Plus,
  Minus
} from 'lucide-react'

import { useCart } from '@/context/CartContext'
import CartIcon from '@/components/CartIcon'
import { Order } from '@/types'
import { getStoredOrders, saveOrders } from '@/lib/storage'

export default function CartPage() {
  const router = useRouter()

  const {
    cart,
    itemCount,
    removeFromCart,
    updateQuantity,
    clearCart
  } = useCart()

  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const [paymentMessage, setPaymentMessage] = useState('')

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    country: 'Rwanda',
    postalCode: '',
    phone: '',
    email: '',
  })

  const subtotal = cart.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  )

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())

  const validateRwandaPhone = (value: string) => {
    const normalized = value.replace(/\s+/g, '')
    return /^\+?2507\d{8}$/.test(normalized) || /^07\d{8}$/.test(normalized)
  }

  const handleCheckout = async () => {
    if (
      !formData.email ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.address ||
      !formData.city ||
      !formData.phone
    ) {
      setPaymentError('Please fill in all required fields.')
      setPaymentMessage('')
      return
    }

    if (!validateEmail(formData.email)) {
      setPaymentError('Please enter a valid email address.')
      setPaymentMessage('')
      return
    }

    if (!validateRwandaPhone(formData.phone)) {
      setPaymentError('Enter a valid Rwanda MTN phone number starting with 07 or +2507.')
      setPaymentMessage('')
      return
    }

    if (cart.items.length === 0) {
      setPaymentError('Your cart is empty.')
      setPaymentMessage('')
      return
    }

    setIsProcessingPayment(true)
    setPaymentError('')
    setPaymentMessage('Sending payment request to your MTN phone...')

    try {
      const response = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: subtotal,
          phoneNumber: formData.phone,
          cartItems: cart.items,
          customerInfo: formData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Payment initiation failed')
      }

      setPaymentMessage(
        data.message ||
          'Payment request sent. In production, the customer should receive a MoMo prompt to enter their PIN.'
      )

      if (data.success) {
        const createdAt = new Date()
        const orderId = data.orderId || `ORD-${createdAt.getTime()}`
        const order: Order = {
          id: orderId,
          referenceId: data.referenceId,
          externalId: data.externalId,
          items: cart.items,
          total: subtotal,
          customer: {
            name: `${formData.firstName} ${formData.lastName}`,
            phone: formData.phone,
            email: formData.email,
            address: [formData.address, formData.apartment, formData.city, formData.country, formData.postalCode]
              .filter(Boolean)
              .join(', '),
          },
          paymentMethod: 'mtn',
          status: data.status === 'processing' ? 'processing' : 'pending',
          createdAt,
        }

        const existingOrders = getStoredOrders()
        saveOrders([...existingOrders, order])

        await new Promise((resolve) => setTimeout(resolve, 1800))

        clearCart()
        router.push('/order-confirmation')
      }
    } catch (error) {
      console.error('Payment error:', error)
      setPaymentMessage('')
      setPaymentError(error instanceof Error ? error.message : 'Payment failed')
    } finally {
      setIsProcessingPayment(false)
    }
  }

return (
    <>
      <div
        className="min-h-screen bg-white text-black flex flex-col"
        style={{
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: '12px',
          fontWeight: 400,
          lineHeight: 1.8,
          textTransform: 'uppercase',
          letterSpacing: '0.15em'
        }}
      >
      {/* HEADER */}

      <div className="fixed top-0 left-0 right-0 z-50 bg-white">
        <div className="max-w-[1800px] mx-auto px-8 md:px-16 lg:px-20">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.push('/')}
              className="text-black hover:text-gray-600 transition-colors px-2"
              aria-label="Go back"
            >
              <ChevronLeft className="w-6 h-6" strokeWidth={2} />
            </button>

            <button
              onClick={() => router.push('/cart')}
              className="cart"
              aria-label="Open cart"
            >
              <CartIcon count={itemCount} />
            </button>
          </div>
        </div>
      </div>

      {/* spacer equal to header height */}
      <div className="h-16 shrink-0" />

      <main className="flex-1 flex items-start justify-center py-6">

<div
          className="
          grid
          grid-cols-1
          lg:grid-cols-[60%_40%]
          gap-8
          items-start
          max-w-[1000px]
          w-full
          px-6 md:px-8 lg:px-10
        "
        >
          {/* LEFT COLUMN */}

<div className="w-full space-y-8">

  <h1 className="text-sm font-semibold uppercase tracking-widest mb-10">
    Checkout
  </h1>
  <p className="text-[10px] uppercase tracking-[0.14em] text-gray-400 -mt-6 mb-8">
    Review your order details and confirm payment securely.
  </p>

  {/* Payment */}

  <section style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f0f0f0' }}>

    <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-6 font-medium">
      Payment Method
    </h2>

    {/* MTN card */}
    <div
      style={{
        border: '2px solid #ffcb05',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #fffdf0 0%, #fff8d0 100%)',
        padding: '24px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 20px rgba(255,203,5,0.18)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>

        {/* logo */}
        <div style={{
          width: '64px', height: '64px',
          borderRadius: '14px',
          overflow: 'hidden',
          border: '1px solid #e8d800',
          flexShrink: 0,
          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 122.88" style={{ width: '100%', height: '100%', display: 'block' }}>
            <polygon fill="#ffcb05" points="0 122.88 122.88 122.88 122.88 0 0 0 0 122.88"/>
            <path fill="#00678f" d="M119,61.09c0,13.11-25.78,23.75-57.58,23.75S3.85,74.2,3.85,61.09s25.79-23.75,57.6-23.75S119,48,119,61.09Z"/>
            <polygon fill="#fff" points="24.55 72.81 30.5 49.06 40.02 49.06 40.02 62.89 46.27 49.06 56.1 49.06 50.15 72.81 43.89 72.81 47.46 57.48 40.02 72.81 34.97 72.81 34.97 57.48 31.09 72.81 24.55 72.81"/>
            <polygon fill="#ed1d24" points="58.02 73.11 58.91 69.8 65.76 69.8 64.86 73.11 58.02 73.11"/>
            <polygon fill="#fff" points="73.34 72.81 79.29 49.06 86.14 49.06 89.12 61.69 92.39 49.06 98.64 49.06 92.69 72.81 86.14 72.81 82.87 59.88 79.59 72.81 73.34 72.81"/>
            <polygon fill="#ffcb05" points="58.02 49.06 56.53 55.08 62.79 55.08 59.42 68.12 66.26 68.12 69.64 55.08 75.88 55.08 77.37 49.06 58.02 49.06"/>
          </svg>
        </div>

        <div style={{ textAlign: 'left' }}>
          <p style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.12em', color: '#1a1a1a', textTransform: 'uppercase', marginBottom: '4px' }}>
            MTN Mobile Money
          </p>
          <p style={{ fontSize: '11px', color: '#666', letterSpacing: '0.05em', textTransform: 'none', fontWeight: 400 }}>
            Pay securely using your MTN phone number
          </p>
          <span style={{
            display: 'inline-block',
            marginTop: '8px',
            fontSize: '9px',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#fff',
            background: '#ffcb05',
            padding: '2px 10px',
            borderRadius: '20px',
          }}>
            Selected
          </span>
        </div>

      </div>

      {/* checkmark */}
      <div style={{
        width: '28px', height: '28px',
        borderRadius: '50%',
        background: '#000',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <svg viewBox="0 0 12 12" width="14" height="14" fill="none" stroke="#fff" strokeWidth="2.2">
          <path d="M2 6l3 3 5-5" />
        </svg>
      </div>

    </div>

  </section>

  {/* CONTACT */}

  <section style={{ marginTop: '0', paddingBottom: '1.5rem', borderBottom: '1px solid #f0f0f0' }}>

    <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-6 font-medium">
      Contact Information
    </h2>

    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-3 font-medium">
      Email Address
    </label>
    <input
      type="email"
      name="email"
      value={formData.email}
      onChange={handleInputChange}
      className="
      w-full
      h-12
      border
      border-gray-200
      rounded-md
      px-4
      text-xs
      font-normal
      outline-none
      focus:border-black
      focus:bg-white
      hover:border-gray-300
      transition-all
      duration-200
      bg-white
      "
      placeholder="you@example.com"
    />

    <label className="flex items-center gap-3 mt-8 text-xs uppercase tracking-wide text-gray-500 cursor-pointer hover:text-black transition-colors duration-200">

      <input
        type="checkbox"
        className="w-4 h-4 accent-black cursor-pointer"
      />

      Email me with news and offers

    </label>

  </section>

  {/* SHIPPING */}

  <section className="pt-2">

    <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-10 font-medium">
      Shipping Address
    </h2>

    <div className="space-y-0">

<div className="grid grid-cols-1 sm:grid-cols-[35%_65%] gap-4" style={{ marginBottom: '2rem' }}>

        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-500 mb-3 font-medium">
            First Name
          </label>
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="w-full border border-gray-200 rounded-md h-12 px-4 text-xs font-normal outline-none focus:border-black focus:bg-white hover:border-gray-300 transition-all duration-200 bg-white"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-500 mb-3 font-medium">
            Last Name
          </label>
          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="w-full border border-gray-200 rounded-md h-12 px-4 text-xs font-normal outline-none focus:border-black focus:bg-white hover:border-gray-300 transition-all duration-200 bg-white"
          />
        </div>

      </div>

      <div style={{ marginBottom: '2rem' }}>
        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-3 font-medium">
          Address
        </label>
        <input
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          className="w-full border border-gray-200 rounded-md h-12 px-4 text-xs font-normal outline-none focus:border-black focus:bg-white hover:border-gray-300 transition-all duration-200 bg-white"
        />
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-3 font-medium">
          Apartment, Suite, Unit (optional)
        </label>
        <input
          name="apartment"
          value={formData.apartment}
          onChange={handleInputChange}
          className="w-full border border-gray-200 rounded-md h-12 px-4 text-xs font-normal outline-none focus:border-black focus:bg-white hover:border-gray-300 transition-all duration-200 bg-white"
        />
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-3 font-medium">
          City
        </label>
        <input
          name="city"
          value={formData.city}
          onChange={handleInputChange}
          className="w-full border border-gray-200 rounded-md h-12 px-4 text-xs font-normal outline-none focus:border-black focus:bg-white hover:border-gray-300 transition-all duration-200 bg-white"
        />
      </div>

<div className="grid grid-cols-1 sm:grid-cols-[35%_65%] gap-4" style={{ marginBottom: '2rem' }}>

        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-500 mb-3 font-medium">
            Country
          </label>
          <input
            value="Rwanda"
            disabled
            className="w-full border border-gray-200 rounded-md h-12 px-4 bg-gray-50 text-xs text-gray-500 font-normal"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-500 mb-3 font-medium">
            Postal Code
          </label>
          <input
            name="postalCode"
            value={formData.postalCode}
            onChange={handleInputChange}
            className="w-full border border-gray-200 rounded-md h-12 px-4 text-xs font-normal outline-none focus:border-black focus:bg-white hover:border-gray-300 transition-all duration-200 bg-white"
          />
        </div>

      </div>

      <div>
        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-3 font-medium">
          Phone Number
        </label>
        <input
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className="w-full border border-gray-200 rounded-md h-12 px-4 text-xs font-normal outline-none focus:border-black focus:bg-white hover:border-gray-300 transition-all duration-200 bg-white"
        />
      </div>

    </div>

  </section>

  {paymentMessage && !paymentError && (
    <div className="mt-10 border border-gray-200 bg-gray-50 px-4 py-3 text-[10px] uppercase tracking-[0.12em] text-gray-700">
      {paymentMessage}
    </div>
  )}

  {paymentError && (
    <div className="mt-10 border border-red-200 bg-red-50 px-4 py-3 text-[10px] uppercase tracking-[0.12em] text-red-700">
      {paymentError}
    </div>
  )}

  <button
    onClick={handleCheckout}
    disabled={isProcessingPayment}
    className="
      w-full
      h-12
      mt-16
      bg-black
      text-white
      uppercase
      tracking-widest
      text-xs
      font-normal
      hover:bg-gray-900
      transition-all
      duration-200
      disabled:opacity-50
      disabled:cursor-not-allowed
    "
  >
    {isProcessingPayment ? 'Check Your Phone...' : 'Continue to Payment'}
  </button>

</div>

          {/* RIGHT COLUMN */}

          <div className="w-full space-y-6 lg:pl-4">
            <div className="pb-4 border-b border-gray-100">
              <h2 className="text-xs font-semibold uppercase tracking-widest">Your Cart</h2>
            </div>
            {cart.items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-4">Your cart is empty</p>
                <button
                  onClick={() => router.push('/')}
                  className="text-xs text-black uppercase tracking-wide hover:underline"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
<div className="flex flex-col gap-8">
                  {cart.items.map((item, index) => (
                    <div key={`${item.product.id}-${item.size}-${index}`} className="flex gap-4 border-b border-gray-100 pb-8">
                      <div className="relative w-20 h-20 shrink-0 overflow-hidden bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
                        {item.product.images[0] && (
                          <Image src={item.product.images[0]} alt={item.product.name} fill sizes="80px" quality={85} className="object-contain p-2" />
                        )}
                      </div>
<div className="flex-1 pt-1">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black mb-1 leading-tight">
                          {item.product.code}
                        </p>
                        <p className="text-[10px] text-gray-500 mb-3 tracking-[0.12em] uppercase">
                          Size: {item.size}
                        </p>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)} className="w-8 h-8 border border-gray-300 flex items-center justify-center text-black hover:border-black hover:bg-gray-50 transition-colors duration-200" aria-label="Decrease quantity">
                            <Minus size={14} strokeWidth={1.5} />
                          </button>
                          <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)} className="w-8 h-8 border border-gray-300 flex items-center justify-center text-black hover:border-black hover:bg-gray-50 transition-colors duration-200" aria-label="Increase quantity">
                            <Plus size={14} strokeWidth={1.5} />
                          </button>
                        </div>
                      </div>
                      <div className="text-right pt-1">
                        <p className="text-[11px] font-semibold tracking-[0.08em] text-black mb-2">
                          {(item.product.price * item.quantity).toLocaleString()} RWF
                        </p>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.size)}
                          className="text-[9px] uppercase tracking-[0.16em] text-gray-400 hover:text-black transition-colors duration-300 underline underline-offset-4"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 pt-6 space-y-4">
                  <div className="flex justify-between text-[10px]"><span className="uppercase tracking-wide text-gray-500">Subtotal</span><span className="font-semibold">{subtotal.toLocaleString()} RWF</span></div>
                  <div className="flex justify-between text-[10px]"><span className="uppercase tracking-wide text-gray-500">Shipping</span><span className="text-gray-500">Calculated at next step</span></div>
                  <div className="flex justify-between text-[10px]"><span className="uppercase tracking-wide text-gray-500">Taxes</span><span className="text-gray-500">Calculated at next step</span></div>
                  <div className="flex justify-between text-xs font-semibold border-t border-gray-100 pt-4 mt-4"><span className="uppercase tracking-wide">Total</span><span>{subtotal.toLocaleString()} RWF</span></div>
                </div>
              </>
            )}
            <div className="pt-6 border-t border-gray-100 text-center">
              <p className="text-[10px] uppercase tracking-wide text-gray-400">INKOTANYISINCE90</p>
            </div>
          </div>

        </div>

      </main>

    </div>
    </>
  )
}
