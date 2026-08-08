# INKOTANYISINCE90

Premium brutalist fashion e-commerce website for the clothing brand "INKOTANYISINCE90".

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
4. **MTN Mobile Money**:
   - **Sandbox**: request is created and tracked by status; no real phone PIN prompt is sent
   - **Production**: customer should receive a real MoMo payment prompt on their phone
5. **Order Confirmation**: Order and payment reference are stored locally for tracking
6. **Order Tracking**: Customer can track status from `/order-status`

## MTN Payment Configuration

The codebase supports both **sandbox** and **production/live** MTN MoMo Collections setups.

### Required environment variables

- `MTN_API_BASE`
- `MTN_API_KEY`
- `MTN_SUBSCRIPTION_KEY`
- `MERCHANT_ID`
- `CALLBACK_URL`
- `NEXT_PUBLIC_BASE_URL`

### Optional environment variables

- `MTN_API_USER` (alias for `MERCHANT_ID`)
- `MTN_TARGET_ENVIRONMENT`
- `MTN_CURRENCY`
- `MERCHANT_PHONE_NUMBER`

### Credential meaning

- `MERCHANT_ID` = MTN API user UUID
- `MTN_API_KEY` = MTN API user key
- `MTN_SUBSCRIPTION_KEY` = MTN Collections product subscription key
- `CALLBACK_URL` = full public callback URL ending in `/api/payment/callback`
- `NEXT_PUBLIC_BASE_URL` = public site base URL

### Sandbox example

```env
MTN_API_BASE=https://sandbox.momodeveloper.mtn.com
MTN_TARGET_ENVIRONMENT=sandbox
MERCHANT_ID=<SANDBOX_API_USER_UUID>
MTN_API_KEY=<SANDBOX_API_USER_KEY>
MTN_SUBSCRIPTION_KEY=<SANDBOX_COLLECTIONS_PRIMARY_KEY>
MTN_CURRENCY=EUR
CALLBACK_URL=https://your-ngrok-or-public-url/api/payment/callback
NEXT_PUBLIC_BASE_URL=https://your-ngrok-or-public-url
```

### Production example

```env
MTN_API_BASE=https://proxy.momoapi.mtn.com
MTN_TARGET_ENVIRONMENT=<LIVE_TARGET_ENVIRONMENT_FROM_MTN>
MERCHANT_ID=<LIVE_API_USER_OR_MERCHANT_UUID>
MTN_API_KEY=<LIVE_API_USER_KEY>
MTN_SUBSCRIPTION_KEY=<LIVE_COLLECTIONS_SUBSCRIPTION_KEY>
MTN_CURRENCY=RWF
CALLBACK_URL=https://your-real-domain.com/api/payment/callback
NEXT_PUBLIC_BASE_URL=https://your-real-domain.com
```

### Exactly what changes from sandbox to live

| Variable | Sandbox | Production / Live |
| --- | --- | --- |
| `MTN_API_BASE` | `https://sandbox.momodeveloper.mtn.com` | `https://proxy.momoapi.mtn.com` |
| `MTN_TARGET_ENVIRONMENT` | `sandbox` | live value provided by MTN for your market/account |
| `MERCHANT_ID` | sandbox API user UUID | live merchant/API user UUID |
| `MTN_API_KEY` | sandbox API user key | live API user key |
| `MTN_SUBSCRIPTION_KEY` | sandbox Collections key | live Collections subscription key |
| `MTN_CURRENCY` | often `EUR` in sandbox | your approved live currency, likely `RWF` |
| `CALLBACK_URL` | ngrok/public test URL | real production HTTPS domain |
| `NEXT_PUBLIC_BASE_URL` | ngrok/public test URL | real production HTTPS domain |

### Production readiness checklist

Before switching to live MTN MoMo, confirm all of the following:

1. MTN has approved your business for **live Collections** access.
2. You have the correct **live subscription key** for Collections.
3. You have the correct **live API user/merchant UUID**.
4. You have the correct **live API user key**.
5. MTN has given you the correct **live target environment** value.
6. Your domain is public over **HTTPS**.
7. `CALLBACK_URL` points to your real production callback endpoint.
8. `NEXT_PUBLIC_BASE_URL` points to your real production frontend domain.
9. Your live wallet/account supports the intended **currency**.
10. You test with a real supported MTN MoMo number in the live market.
11. Admin password and session handling are hardened before production deployment.
12. Orders should be persisted in a real database instead of browser localStorage.

### Important notes

- `MTN_API_SECRET` is **not used** by the current app and should not be used as a subscription key fallback.
- In sandbox, a real phone PIN prompt is not expected.
- In production, the prompt behavior depends on MTN live availability, wallet validity, account balance, and market rules.

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

- Store orders, subscribers, and DNSMPI requests in Supabase (implemented — see below)
- Implement secure authentication for admin dashboard
- Integrate actual MTN Mobile Money API
- Add proper error handling and validation
- Implement image hosting (Cloudinary recommended)
- Add email notifications for order confirmations
- Set up proper analytics and monitoring

## Supabase Persistence

Orders, subscribers, and DNSMPI requests are persisted to **Supabase (PostgreSQL)** when configured, and gracefully fall back to local JSON files when the Supabase env vars are absent (useful for local dev).

### Setup

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run the schema in `supabase/schema.sql`. This creates the `orders`, `subscribers`, `dnsmpi_requests`, and `admin_products` tables with row-level security enabled.
3. Add the following to your `.env.local`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

> **Security:** `SUPABASE_SERVICE_ROLE_KEY` is a server-only secret. It is used only in API routes / server-side libs (`src/lib/supabase.ts`) and must never be exposed to the browser. Never add a `NEXT_PUBLIC_` prefix to it.

## Favicons

- **Files added/updated:** [public/favicon.svg](public/favicon.svg), [public/favicon.ico](public/favicon.ico), generated PNGs (`favicon-16x16.png`, `favicon-32x32.png`, `favicon-48x48.png`, `favicon-64x64.png`, `favicon-128x128.png`, `favicon-256x256.png`), [public/site.webmanifest](public/site.webmanifest), [public/safari-pinned-tab.svg](public/safari-pinned-tab.svg). The app head was updated at [src/app/head.tsx](src/app/head.tsx#L1-L20).
- **Regenerate favicons:** edit `public/favicon.svg` (the canonical source) and run:

```bash
npm install
npm run generate:favicons
```

- **Notes:** The SVG is the single source of truth; the generator creates PNGs and a multi-size ICO for compatibility. `site.webmanifest` and `safari-pinned-tab.svg` enable PWA and Safari pinned-tab support.
