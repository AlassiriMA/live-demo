import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { CartItem } from "../index";

interface CheckoutProps {
  cartItems: CartItem[];
  updateQuantity: (itemId: number, quantity: number) => void;
  removeItem: (itemId: number) => void;
  completeCheckout: (paymentMethod: string) => void;
  isProcessing: boolean;
  setView: (view: "browse" | "checkout") => void;
}

export default function Checkout({ 
  cartItems, 
  updateQuantity, 
  removeItem, 
  completeCheckout,
  isProcessing,
  setView
}: CheckoutProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [showReceipt, setShowReceipt] = useState<boolean>(false);
  
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.07; // 7% tax
  const total = subtotal + tax;
  
  const handleCompleteCheckout = () => {
    // First show receipt, then process payment
    setShowReceipt(true);
    setTimeout(() => {
      completeCheckout(paymentMethod);
      setShowReceipt(false);
    }, 1000);
  };
  
  const paymentMethods = [
    { id: "cash", name: "Cash", icon: "💵" },
    { id: "credit", name: "Credit Card", icon: "💳" },
    { id: "debit", name: "Debit Card", icon: "💳" },
    { id: "mobile", name: "Mobile Payment", icon: "📱" },
  ];
  
  if (cartItems.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-100 dark:border-gray-800">
        <div className="bg-indigo-50 dark:bg-indigo-900/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-medium text-gray-900 dark:text-white mb-2">Your cart is empty</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          Looks like you haven't added any books to your cart yet. Browse our collection and find your next great read!
        </p>
        <Button 
          onClick={() => setView("browse")}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          Browse Books
        </Button>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="bg-white dark:bg-gray-900 shadow-md border border-gray-100 dark:border-gray-800 overflow-hidden rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500 dark:text-indigo-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="font-heading font-bold text-xl text-gray-800 dark:text-white">Your Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</h3>
            </div>
            
            <div className="space-y-4">
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 dark:text-white">{item.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">by {item.author}</p>
                    <div className="flex items-center text-xs text-gray-400 dark:text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      ISBN: {item.isbn}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-indigo-600 dark:text-indigo-400 font-medium">${item.price.toFixed(2)}</div>
                    
                    <div className="flex items-center h-8 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                      <button 
                        className="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                        className="w-12 border-0 text-center focus:outline-none focus:ring-0 p-0 h-full bg-transparent dark:text-white"
                      />
                      <button 
                        className="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="text-gray-800 dark:text-white font-medium w-20 text-right">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    
                    <button 
                      className="p-2 rounded-full text-red-500 hover:text-white hover:bg-red-500 focus:outline-none transition-colors"
                      onClick={() => removeItem(item.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-1">
        <Card className="bg-white dark:bg-gray-900 shadow-md border border-gray-100 dark:border-gray-800 overflow-hidden rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500 dark:text-indigo-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="font-heading font-bold text-xl text-gray-800 dark:text-white">Order Summary</h3>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700 mb-6">
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-800 dark:text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax (7%)</span>
                  <span className="font-medium text-gray-800 dark:text-white">${tax.toFixed(2)}</span>
                </div>
                <Separator className="my-2 bg-gray-200 dark:bg-gray-700" />
                <div className="flex justify-between text-lg">
                  <span className="font-bold text-gray-800 dark:text-white">Total</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-medium text-gray-800 dark:text-white mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Payment Method
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {paymentMethods.map((method) => (
                  <Button
                    key={method.id}
                    type="button"
                    className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all duration-200 ${
                      paymentMethod === method.id 
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-transparent shadow-md' 
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <span className="text-xl">{method.icon}</span>
                    <span className="font-medium">{method.name}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            <Button
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-3 rounded-lg shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all duration-300"
              onClick={handleCompleteCheckout}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Complete Purchase</span>
                </>
              )}
            </Button>
          </CardContent>
        </Card>
        
        {showReceipt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6"
          >
            <Card className="bg-white dark:bg-gray-900 shadow-md border border-gray-100 dark:border-gray-800 overflow-hidden rounded-xl">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-heading font-bold text-xl text-gray-800 dark:text-white mb-1">BookPOS Receipt</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{new Date().toLocaleString()}</p>
                </div>
                
                <div className="space-y-2 mb-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div className="flex-1 truncate mr-4">
                        <span className="text-gray-800 dark:text-gray-200">{item.title}</span>
                        <span className="text-gray-500 dark:text-gray-400"> × {item.quantity}</span>
                      </div>
                      <span className="text-gray-800 dark:text-white font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-3 bg-gray-200 dark:bg-gray-700" />
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span className="text-gray-800 dark:text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Tax (7%)</span>
                    <span className="text-gray-800 dark:text-white">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold mt-2 text-base">
                    <span className="text-gray-800 dark:text-white">Total</span>
                    <span className="text-indigo-600 dark:text-indigo-400">${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                    Thank you for your purchase!
                  </p>
                  <p className="text-gray-500 dark:text-gray-500 text-xs">
                    Order ID: #{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
