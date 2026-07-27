import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";

export default function ProductLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CartProvider>
      {children}
      <CartDrawer />
    </CartProvider>
  );
}
