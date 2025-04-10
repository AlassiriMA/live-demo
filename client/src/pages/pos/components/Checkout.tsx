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
}

export default function Checkout({ 
  cartItems, 
  updateQuantity, 
  removeItem, 
  completeCheckout,
  isProcessing
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
      <div className="text-center py-16">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h3 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h3>
        <p className="text-gray-600 mb-6">Add some books to continue with checkout.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="neu-bg shadow-neu overflow-hidden">
          <CardContent className="p-6">
            <h3 className="font-heading font-bold text-xl text-gray-800 mb-4">Cart Items</h3>
            
            <div className="space-y-4">
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className="flex items-center p-4 bg-white rounded-lg shadow-sm"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{item.title}</h4>
                    <p className="text-sm text-gray-500">by {item.author}</p>
                    <p className="text-xs text-gray-400">ISBN: {item.isbn}</p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-[#6366F1] font-medium">${item.price.toFixed(2)}</div>
                    
                    <div className="flex items-center neu-input h-8 rounded-lg overflow-hidden">
                      <button 
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#6366F1] focus:outline-none"
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
                        className="w-12 border-0 text-center focus:outline-none focus:ring-0 p-0 h-full"
                      />
                      <button 
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#6366F1] focus:outline-none"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="text-gray-700 font-medium w-20 text-right">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    
                    <button 
                      className="text-red-500 hover:text-red-700 focus:outline-none"
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
        <Card className="neu-bg shadow-neu overflow-hidden">
          <CardContent className="p-6">
            <h3 className="font-heading font-bold text-xl text-gray-800 mb-4">Order Summary</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (7%)</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-[#6366F1]">${total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-medium text-gray-800 mb-2">Payment Method</h4>
              <div className="grid grid-cols-2 gap-2">
                {paymentMethods.map((method) => (
                  <Button
                    key={method.id}
                    type="button"
                    className={`neu-button flex items-center justify-center space-x-2 ${paymentMethod === method.id ? 'bg-[#6366F1] text-white hover:text-white' : 'text-gray-700'}`}
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <span>{method.icon}</span>
                    <span>{method.name}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            <Button
              className="w-full neu-button bg-[#6366F1] text-white hover:bg-[#4F46E5] hover:text-white"
              onClick={handleCompleteCheckout}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Complete Purchase"}
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
            <Card className="bg-white shadow-md overflow-hidden">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <h3 className="font-heading font-bold text-xl text-gray-800">BookPOS Receipt</h3>
                  <p className="text-gray-500 text-sm">{new Date().toLocaleString()}</p>
                </div>
                
                <div className="space-y-2 mb-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.title} x{item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-2" />
                
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold mt-2">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="mt-4 text-center text-gray-500 text-xs">
                  <p>Thank you for your purchase!</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
