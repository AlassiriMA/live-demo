import { ReactNode } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import BarcodeScanner from "./BarcodeScanner";
import InventoryAlerts from "./InventoryAlerts";
import UserProfile from "./UserProfile";
import SalesAnalytics from "./SalesAnalytics";
import HelpTutorial from "./HelpTutorial";

interface BookstoreLayoutProps {
  children: ReactNode;
  view: "browse" | "checkout";
  setView: (view: "browse" | "checkout") => void;
  cartTotal: number;
  itemCount: number;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  addToCart: (bookId: number) => void;
}

export default function BookstoreLayout({
  children,
  view,
  setView,
  cartTotal,
  itemCount,
  searchTerm,
  setSearchTerm,
  addToCart,
}: BookstoreLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        <header className="neu-bg p-6 rounded-xl shadow-neu">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center">
              <Link href="/">
                <a className="flex items-center mr-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#6366F1] dark:text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span className="font-heading font-bold text-xl text-gray-800 dark:text-white">BookPOS</span>
                </a>
              </Link>
              
              {view === "browse" && (
                <div className="relative w-full md:w-64 search-bar">
                  <Input
                    type="search"
                    placeholder="Search books or scan ISBN..."
                    className="neu-input w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* User profile component */}
              <UserProfile />
              
              {/* Theme toggle */}
              <div className="theme-toggle">
                <ThemeToggle />
              </div>
              
              {/* Inventory alerts */}
              <div className="inventory-alerts">
                <InventoryAlerts />
              </div>
              
              {/* Barcode scanner */}
              {view === "browse" && (
                <div className="barcode-scan">
                  <BarcodeScanner onAddToCart={addToCart} />
                </div>
              )}
              
              {/* Sales analytics */}
              {view === "browse" && (
                <div className="sales-analytics">
                  <SalesAnalytics />
                </div>
              )}
              
              {/* Cart button */}
              <div className="cart-button">
                {view === "browse" ? (
                  <Button 
                    onClick={() => setView("checkout")}
                    className="neu-button px-4 py-2 flex items-center space-x-2"
                    disabled={itemCount === 0}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#6366F1] dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="font-medium text-[#6366F1] dark:text-blue-400">
                      {itemCount > 0 ? `Cart (${itemCount})` : "Cart Empty"}
                    </span>
                  </Button>
                ) : (
                  <Button 
                    onClick={() => setView("browse")}
                    className="neu-button px-4 py-2 flex items-center space-x-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#6366F1] dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="font-medium text-[#6366F1] dark:text-blue-400">Back to Browse</span>
                  </Button>
                )}
              </div>
              
              {itemCount > 0 && (
                <div className="text-gray-800 dark:text-white font-medium hidden md:block">
                  Total: <span className="text-[#6366F1] dark:text-blue-400 font-bold">${cartTotal.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
        </header>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-1"
        >
          {children}
        </motion.div>
        
        <footer className="py-4 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} BookPOS System by Mohammad Alassiri</p>
        </footer>
      </div>
      
      {/* Help tutorial button */}
      <HelpTutorial />
    </div>
  );
}
