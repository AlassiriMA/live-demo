import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import AppShell from "@/components/layout/AppShell";
import ProductGrid from "./components/ProductGrid";
import Cart from "./components/Cart";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  unit: string;
};

export default function Fruits() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["/api/fruits/products"],
  });

  const addToCart = (productId: number) => {
    const product = products.find((p: any) => p.id === productId);
    if (!product) return;
    
    const existingItem = cartItems.find(item => item.id === productId);
    
    if (existingItem) {
      setCartItems(
        cartItems.map(item => 
          item.id === productId 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.imageUrl,
          unit: product.unit
        }
      ]);
    }
  };

  const updateCartItemQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCartItems(
      cartItems.map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };

  const removeFromCart = (itemId: number) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  // Get unique categories for filter tabs
  const categories = ['all', ...new Set(products.map((product: any) => product.category))];

  return (
    <AppShell>
      <Helmet>
        <title>Fruits & Greens | Alassiri</title>
        <meta name="description" content="Lightweight and beautiful e-commerce built for eco-conscious shopping experiences." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#22C55E] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-gray-800">Fruits & Greens</h1>
            </div>
            
            <Button 
              onClick={toggleCart}
              className="flex items-center space-x-2 bg-white border border-[#22C55E] text-[#22C55E] hover:bg-[#22C55E] hover:text-white transition-colors rounded-full px-4 py-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>{itemCount > 0 ? `Cart (${itemCount})` : "Cart"}</span>
              {itemCount > 0 && (
                <span className="ml-1 text-sm font-medium">${cartTotal.toFixed(2)}</span>
              )}
            </Button>
          </div>

          {/* Banner */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-2xl overflow-hidden relative h-48 md:h-64 bg-[#22C55E]/10"
          >
            <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-12">
              <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">Fresh & Organic</h2>
              <p className="text-gray-600 mb-4 max-w-md">Support local farmers and enjoy the freshest produce delivered to your door.</p>
              <Button className="w-max bg-[#22C55E] hover:bg-[#16A34A] text-white">
                Shop Now
              </Button>
            </div>
          </motion.div>

          {/* Category Tabs */}
          <Tabs defaultValue="all" className="mb-8" value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="bg-green-50 p-1 rounded-xl mb-6">
              {categories.map(category => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="data-[state=active]:bg-[#22C55E] data-[state=active]:text-white rounded-lg capitalize"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {categories.map(category => (
              <TabsContent key={category} value={category} className="mt-0">
                <ProductGrid 
                  products={category === 'all' 
                    ? products 
                    : products.filter((product: any) => product.category === category)
                  }
                  isLoading={isLoading}
                  addToCart={addToCart}
                />
              </TabsContent>
            ))}
          </Tabs>

          {/* Cart Panel */}
          <Cart 
            isOpen={showCart}
            onClose={toggleCart}
            cartItems={cartItems}
            updateQuantity={updateCartItemQuantity}
            removeItem={removeFromCart}
            clearCart={clearCart}
          />
        </div>
      </div>
    </AppShell>
  );
}
