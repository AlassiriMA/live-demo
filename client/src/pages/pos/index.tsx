import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AppShell from "@/components/layout/AppShell";
import BookstoreLayout from "./components/BookstoreLayout";
import ProductList from "./components/ProductList";
import Checkout from "./components/Checkout";

export type CartItem = {
  id: number;
  title: string;
  author: string;
  isbn: string;
  price: number;
  quantity: number;
};

export default function POS() {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [view, setView] = useState<"browse" | "checkout">("browse");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: books = [], isLoading } = useQuery({
    queryKey: ["/api/pos/books"],
  });

  const createTransaction = useMutation({
    mutationFn: (data: any) => {
      return apiRequest("POST", "/api/pos/transactions", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Transaction completed successfully!",
        variant: "default",
      });
      setCartItems([]);
      setView("browse");
      queryClient.invalidateQueries({ queryKey: ["/api/pos/books"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to complete transaction",
        variant: "destructive",
      });
    },
  });

  const filteredBooks = books.filter((book: any) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      book.title.toLowerCase().includes(searchLower) ||
      book.author.toLowerCase().includes(searchLower) ||
      book.isbn.includes(searchTerm)
    );
  });

  const addToCart = (bookId: number) => {
    const book = books.find((b: any) => b.id === bookId);
    if (!book) return;

    const existingItem = cartItems.find(item => item.id === bookId);
    
    if (existingItem) {
      setCartItems(
        cartItems.map(item => 
          item.id === bookId 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          id: book.id,
          title: book.title,
          author: book.author,
          isbn: book.isbn,
          price: book.price,
          quantity: 1
        }
      ]);
    }

    toast({
      title: "Added to cart",
      description: `${book.title} added to cart`,
      variant: "default",
    });
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

  const completeCheckout = (paymentMethod: string) => {
    // Calculate totals
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.07; // 7% tax
    const total = subtotal + tax;

    // Prepare transaction data
    const transactionData = {
      items: cartItems,
      total,
      tax,
      paymentMethod,
      cashierId: 1, // Mock user ID
    };

    createTransaction.mutate(transactionData);
  };

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <AppShell>
      <Helmet>
        <title>POS for Bookstores | Alassiri</title>
        <meta name="description" content="An elegant, intuitive POS system tailored for bookstores. Built with obsessive attention to UI and offline resilience." />
      </Helmet>

      <div className="neu-bg min-h-screen">
        <BookstoreLayout 
          view={view}
          setView={setView}
          cartTotal={cartTotal}
          itemCount={itemCount}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          addToCart={addToCart}
        >
          {view === "browse" ? (
            <ProductList 
              books={filteredBooks}
              isLoading={isLoading}
              addToCart={addToCart}
            />
          ) : (
            <Checkout 
              cartItems={cartItems}
              updateQuantity={updateCartItemQuantity}
              removeItem={removeFromCart}
              completeCheckout={completeCheckout}
              isProcessing={createTransaction.isPending}
              setView={setView}
            />
          )}
        </BookstoreLayout>
      </div>
    </AppShell>
  );
}
