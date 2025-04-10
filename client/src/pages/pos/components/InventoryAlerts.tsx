import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { inventoryAlerts } from '../utils/posHelpers';
import { motion, AnimatePresence } from 'framer-motion';

export default function InventoryAlerts() {
  const [openPopover, setOpenPopover] = useState(false);
  
  const alertCount = inventoryAlerts.length;
  const hasCritical = inventoryAlerts.some(alert => alert.severity === 'critical');

  if (alertCount === 0) {
    return null;
  }

  return (
    <Popover open={openPopover} onOpenChange={setOpenPopover}>
      <PopoverTrigger asChild>
        <Button 
          className="neu-button relative dark:bg-gray-800"
          variant="outline"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 ${hasCritical ? 'text-red-500' : 'text-yellow-500'}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
          
          <Badge 
            className={`absolute -top-2 -right-2 ${
              hasCritical ? 'bg-red-500' : 'bg-yellow-500'
            }`}
          >
            {alertCount}
          </Badge>
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="neu-bg dark:bg-gray-800 border-none w-80 p-0 shadow-lg"
        align="end"
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-heading font-bold text-gray-800 dark:text-white">Inventory Alerts</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">The following items are low in stock</p>
        </div>
        
        <AnimatePresence>
          <div className="max-h-80 overflow-y-auto p-2">
            {inventoryAlerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-3 mb-2 rounded-lg ${
                  alert.severity === 'critical' 
                    ? 'bg-red-50 dark:bg-red-900/20' 
                    : 'bg-yellow-50 dark:bg-yellow-900/20'
                }`}
              >
                <div className="flex items-start">
                  <div className={`p-1 rounded-full mr-3 ${
                    alert.severity === 'critical' 
                      ? 'bg-red-100 dark:bg-red-800' 
                      : 'bg-yellow-100 dark:bg-yellow-800'
                  }`}>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-4 w-4 ${
                        alert.severity === 'critical' 
                          ? 'text-red-500 dark:text-red-300' 
                          : 'text-yellow-500 dark:text-yellow-300'
                      }`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                      />
                    </svg>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 dark:text-white">{alert.bookTitle}</h4>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Current stock: {alert.currentStock}
                      </span>
                      <Badge variant="outline" className={
                        alert.severity === 'critical' 
                          ? 'border-red-500 text-red-500 dark:border-red-400 dark:text-red-400' 
                          : 'border-yellow-500 text-yellow-500 dark:border-yellow-400 dark:text-yellow-400'
                      }>
                        {alert.severity === 'critical' ? 'Critical' : 'Low'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
        
        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          <Button 
            className="neu-button w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white"
            onClick={() => setOpenPopover(false)}
          >
            View All Inventory
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}