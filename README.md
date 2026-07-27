# INKOTANYI SINCE 90

Premium brutalist fashion e-commerce website for the clothing brand "INKOTANYI SINCE 90".

## Tech Stack

- **Next.js 15** - App Router
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons

## Design Philosophy

- **Brutalist Aesthetic**: Bold borders, high contrast, monochrome palette
- **Large Typography**: Uppercase, bold, commanding presence
- **Product-First**: Clothing is the primary visual focus
- **Rwandan Identity**: Celebrating local culture through fashion
- **Performance**: Fast loading and smooth interactions

## Features

### Customer Experience
- **Homepage**: Bold product grid with brand statement
- **Product Cards**: Quick add with size selection overlay
- **Product Pages**: Detailed gallery, size/quantity selection
- **Shopping Cart**: Slide-out drawer with +/- quantity controls
- **Checkout Flow**: Multi-step process (Phone → Email → Address → Payment)
- **MTN Mobile Money**: Integrated payment method for Rwanda
- **Order Confirmation**: Clear order summary and WhatsApp community link

### Admin Dashboard
- **Authentication**: Simple password protection (default: admin123)
- **Product Management**: Add, edit, delete products
- **Order Management**: View orders, update status (pending/completed/cancelled)
- **Sales Reports**: Generate and download sales reports
- **Real-time Stats**: Total revenue, order count, pending orders

### Integration
- **WhatsApp Community**: Direct link to customer community
- **Local Storage**: Orders and products persist in browser storage
- **Responsive Design**: Optimized for all devices

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Admin Access

Navigate to `/admin` and enter the default password: `admin123`

**Important**: Change the admin password in `src/app/admin/page.tsx` before production deployment.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard
│   ├── checkout/          # Checkout flow
│   ├── order-confirmation/# Order confirmation
│   ├── product/[id]/      # Product detail pages
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── Header.tsx         # Brutalist navigation
│   ├── Footer.tsx         # Minimalist footer
│   ├── CartDrawer.tsx     # Slide-out cart
│   ├── ProductCard.tsx    # Product card with quick add
│   ├── ProductGrid.tsx    # Product grid layout
│   ├── ProductGallery.tsx # Product image gallery
│   ├── AddToCartForm.tsx  # Size/quantity selection
│   └── RelatedProducts.tsx # Related products section
├── context/               # React context
│   └── CartContext.tsx    # Shopping cart state
├── data/                  # Mock data
│   └── products.ts        # Product data (RWF pricing)
├── types/                 # TypeScript types
│   └── index.ts           # Shared types (Order, SalesReport)
└── lib/                   # Utilities
    └── utils.ts           # Helper functions
```

## Payment Flow

1. **Phone Number**: Customer enters MTN phone number
2. **Email Address**: Customer provides email for confirmation
3. **Shipping Address**: Full delivery address
4. **MTN Mobile Money**: Customer receives payment prompt
5. **Order Confirmation**: Order saved to admin dashboard

## Sales Reporting

The admin dashboard automatically tracks:
- Order ID and date
- Items purchased and quantities
- Total revenue
- Customer contact information
- Order status

Reports can be downloaded as JSON files for further analysis.

## Deployment

The easiest way to deploy is using [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Production Considerations

- Replace localStorage with a proper database (Supabase recommended)
- Implement secure authentication for admin dashboard
- Integrate actual MTN Mobile Money API
- Add proper error handling and validation
- Implement image hosting (Cloudinary recommended)
- Add email notifications for order confirmations
- Set up proper analytics and monitoring
