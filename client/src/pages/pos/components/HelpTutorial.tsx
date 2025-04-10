import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface TutorialStep {
  title: string;
  content: string;
  image?: string;
  target?: string; // CSS selector for element to highlight
}

export default function HelpTutorial() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false);
  
  // Check if user has seen the tutorial before
  useEffect(() => {
    const tutorialSeen = localStorage.getItem("pos-tutorial-seen");
    setHasSeenTutorial(!!tutorialSeen);
    
    // If user hasn't seen the tutorial, show it automatically
    if (!tutorialSeen) {
      setIsOpen(true);
    }
  }, []);
  
  const tutorialSteps: TutorialStep[] = [
    {
      title: "Welcome to BookPOS!",
      content: "BookPOS is an intuitive point-of-sale system designed specifically for bookstores. This quick tutorial will help you get started.",
      image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&w=500"
    },
    {
      title: "Browsing Books",
      content: "Use the search bar to find books by title, author, or ISBN. You can also filter books by category using the buttons at the top.",
      target: ".search-bar"
    },
    {
      title: "Scanning Barcodes",
      content: "Click the 'Scan Barcode' button to quickly add books to your cart by scanning their ISBN codes.",
      target: ".barcode-scan"
    },
    {
      title: "Managing Your Cart",
      content: "Add books to your cart and adjust quantities. When you're ready to complete the purchase, click the cart button.",
      target: ".cart-button"
    },
    {
      title: "Sales Analytics",
      content: "Access detailed sales reports and analytics to track your store's performance over time.",
      target: ".sales-analytics"
    },
    {
      title: "Inventory Alerts",
      content: "The system will alert you when book inventory is running low, so you can restock in time.",
      target: ".inventory-alerts"
    },
    {
      title: "Dark Mode",
      content: "Toggle between light and dark mode based on your preference or working conditions.",
      target: ".theme-toggle"
    }
  ];
  
  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTutorial();
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const completeTutorial = () => {
    localStorage.setItem("pos-tutorial-seen", "true");
    setHasSeenTutorial(true);
    setIsOpen(false);
    setCurrentStep(0);
  };
  
  const openTutorial = () => {
    setCurrentStep(0);
    setIsOpen(true);
  };
  
  return (
    <>
      <Button
        variant="ghost"
        className="neu-button text-gray-700 dark:bg-gray-800 dark:text-white help-button fixed bottom-4 right-4 z-50 rounded-full w-12 h-12 p-0 flex items-center justify-center shadow-lg"
        onClick={openTutorial}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#6366F1] dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="neu-bg dark:bg-gray-800 border-none max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-gray-800 dark:text-white">
              {tutorialSteps[currentStep].title}
            </DialogTitle>
          </DialogHeader>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="py-4"
            >
              {tutorialSteps[currentStep].image && (
                <div className="mb-4 flex justify-center">
                  <img 
                    src={tutorialSteps[currentStep].image} 
                    alt={tutorialSteps[currentStep].title}
                    className="rounded-lg max-h-56 object-cover"
                  />
                </div>
              )}
              
              <p className="text-gray-600 dark:text-gray-300 text-center">
                {tutorialSteps[currentStep].content}
              </p>
              
              <div className="flex justify-center mt-6">
                {Array.from({ length: tutorialSteps.length }).map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full mx-1 ${
                      index === currentStep
                        ? 'bg-[#6366F1] dark:bg-blue-400'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
          
          <DialogFooter className="flex justify-between">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={completeTutorial}
                className="neu-button dark:bg-gray-700 dark:text-white"
              >
                Skip
              </Button>
              
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  className="neu-button dark:bg-gray-700 dark:text-white"
                >
                  Previous
                </Button>
              )}
            </div>
            
            <Button
              onClick={handleNext}
              className="neu-button bg-[#6366F1] hover:bg-[#4F46E5] text-white"
            >
              {currentStep < tutorialSteps.length - 1 ? 'Next' : 'Finish'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}