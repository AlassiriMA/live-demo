import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { scanBarcode } from '../utils/posHelpers';
import { useToast } from '@/hooks/use-toast';

interface BarcodeScannerProps {
  onAddToCart: (bookId: number) => void;
}

export default function BarcodeScanner({ onAddToCart }: BarcodeScannerProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isbn, setIsbn] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = () => {
    setIsScanning(true);
    setError(null);
    
    // Simulate scanning delay
    setTimeout(() => {
      const result = scanBarcode(isbn);
      
      if (result.success) {
        setScanResult(result.book);
        setError(null);
      } else {
        setScanResult(null);
        setError(result.error || "Unknown error occurred");
      }
      
      setIsScanning(false);
    }, 1500);
  };

  const handleAddToCart = () => {
    if (scanResult) {
      onAddToCart(scanResult.id);
      setIsOpen(false);
      setIsbn('');
      setScanResult(null);
      
      toast({
        title: "Book added",
        description: `${scanResult.title} has been added to the cart`,
      });
    }
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        className="neu-button flex items-center space-x-2 dark:bg-gray-800 dark:text-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#6366F1] dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
        <span className="font-medium text-gray-700 dark:text-gray-200">Scan Barcode</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="neu-bg dark:bg-gray-800 border-none max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gray-800 dark:text-white">Scan Book Barcode</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300">
              Enter the ISBN-13 code of the book or use a barcode scanner.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex gap-2">
              <Input
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                placeholder="Enter ISBN-13 (e.g., 9781234567897)"
                className="neu-input dark:bg-gray-700 dark:text-white"
              />
              <Button 
                onClick={handleScan} 
                disabled={isScanning || !isbn} 
                className="neu-button text-[#6366F1] dark:bg-gray-700 dark:text-white"
              >
                {isScanning ? 'Scanning...' : 'Scan'}
              </Button>
            </div>

            <AnimatePresence>
              {isScanning && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center py-4"
                >
                  <svg className="animate-spin h-8 w-8 text-[#6366F1]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </motion.div>
              )}

              {error && !isScanning && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-500 text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg"
                >
                  {error}
                </motion.div>
              )}

              {scanResult && !isScanning && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg"
                >
                  <h3 className="font-medium text-gray-800 dark:text-white">{scanResult.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">Author: {scanResult.author}</p>
                  <p className="text-gray-600 dark:text-gray-300">ISBN: {scanResult.isbn}</p>
                  <div className="flex justify-between mt-2">
                    <span className="font-bold text-[#6366F1] dark:text-blue-300">${scanResult.price.toFixed(2)}</span>
                    <span className={`text-sm ${scanResult.stock > 5 ? 'text-green-600 dark:text-green-400' : 'text-orange-500 dark:text-orange-300'}`}>
                      {scanResult.stock} in stock
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <DialogFooter className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="neu-button dark:bg-gray-700 dark:text-white"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddToCart} 
              disabled={!scanResult || isScanning}
              className="neu-button bg-[#6366F1] hover:bg-[#4F46E5] text-white"
            >
              Add to Cart
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}