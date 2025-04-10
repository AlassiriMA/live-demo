import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Cycle {
  id: string;
  tokens: string[];
  profitability: number;
  lastUpdate: Date;
  pool1: string;
  pool2: string;
  pool3: string;
}

interface CycleDetectionProps {
  cycles: Cycle[];
}

export default function CycleDetection({ cycles }: CycleDetectionProps) {
  const [selectedCycle, setSelectedCycle] = useState<Cycle | null>(null);
  const [tokenRates, setTokenRates] = useState<Record<string, Record<string, number>>>({});
  
  // Generate token exchange rates on mount
  useEffect(() => {
    const rates: Record<string, Record<string, number>> = {
      ETH: {
        USDT: 3240.50,
        BTC: 0.06155,
        BNB: 12.35,
        SOL: 42.78,
        MATIC: 1980.45,
        USDC: 3240.75,
        UNI: 485.32,
        AAVE: 185.45
      },
      BTC: {
        USDT: 51240.25,
        ETH: 16.28,
        BNB: 201.32,
        SOL: 695.48,
        USDC: 51245.75
      },
      USDT: {
        ETH: 0.000308,
        BTC: 0.0000195,
        BNB: 0.00381,
        SOL: 0.0132,
        MATIC: 0.000505,
        USDC: 0.9998,
        UNI: 0.0149,
        AAVE: 0.0391
      },
      BNB: {
        ETH: 0.0809,
        USDT: 261.45,
        USDC: 261.58
      },
      SOL: {
        USDT: 75.85,
        BTC: 0.00144,
        ETH: 0.0234
      },
      MATIC: {
        USDT: 1.634,
        ETH: 0.000505
      },
      USDC: {
        ETH: 0.000308,
        BTC: 0.0000195,
        BNB: 0.00382,
        UNI: 0.0149,
        AAVE: 0.0391
      },
      UNI: {
        ETH: 0.00206,
        USDC: 6.68
      },
      AAVE: {
        ETH: 0.0054,
        USDC: 17.45
      }
    };
    
    setTokenRates(rates);
  }, []);
  
  // Calculate cycle profit simulation
  const calculateProfit = (cycle: Cycle): [number, number, number, number] => {
    // Start with 1 token of the first in the cycle
    const startToken = cycle.tokens[0];
    const midToken = cycle.tokens[1];
    const endToken = cycle.tokens[2];
    
    let amount = 1;
    
    // First trade
    if (tokenRates[startToken] && tokenRates[startToken][midToken]) {
      amount = amount * tokenRates[startToken][midToken];
    }
    
    // Second trade
    if (tokenRates[midToken] && tokenRates[midToken][endToken]) {
      amount = amount * tokenRates[midToken][endToken];
    }
    
    // Third trade (back to start)
    if (tokenRates[endToken] && tokenRates[endToken][startToken]) {
      amount = amount * tokenRates[endToken][startToken];
    }
    
    const profit = amount - 1;
    const profitPercent = (profit * 100).toFixed(2);
    
    // Add some randomness to simulate price movements
    const randomFactor = 1 + (Math.random() * 0.008 - 0.004); // -0.4% to +0.4%
    
    return [
      parseFloat((1 * tokenRates[startToken][midToken]).toFixed(6)),
      parseFloat((1 * tokenRates[startToken][midToken] * tokenRates[midToken][endToken]).toFixed(6)),
      parseFloat((amount * randomFactor).toFixed(6)),
      parseFloat(profitPercent)
    ];
  };

  return (
    <>
      <ScrollArea className="h-[300px] pr-4 -mr-4">
        <div className="space-y-2">
          <AnimatePresence>
            {cycles.map((cycle) => (
              <motion.div
                key={cycle.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className={`p-3 border rounded-md cursor-pointer hover:bg-[#1e293b] transition-colors ${
                  selectedCycle?.id === cycle.id 
                    ? 'bg-[#1e293b] border-[#8B5CF6]' 
                    : 'border-gray-700'
                }`}
                onClick={() => setSelectedCycle(cycle.id === selectedCycle?.id ? null : cycle)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className={`h-2 w-2 rounded-full mr-2 ${
                      cycle.profitability > 0.2 ? 'bg-green-500' :
                      cycle.profitability > 0 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></span>
                    <span className="font-medium">{cycle.tokens.join(' → ')}</span>
                  </div>
                  <Badge 
                    className={`${
                      cycle.profitability > 0.2 ? 'bg-green-900/30 text-green-400' :
                      cycle.profitability > 0 ? 'bg-yellow-900/30 text-yellow-400' : 'bg-red-900/30 text-red-400'
                    }`}
                  >
                    {cycle.profitability > 0 ? '+' : ''}{cycle.profitability.toFixed(2)}%
                  </Badge>
                </div>
                
                <div className="mt-2 text-xs text-gray-400 flex justify-between">
                  <span>Last update: {cycle.lastUpdate.toLocaleTimeString()}</span>
                </div>
                
                {selectedCycle?.id === cycle.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-3 pt-3 border-t border-gray-700"
                  >
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span>Pool 1:</span>
                        <span className="text-gray-300">{cycle.pool1}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Pool 2:</span>
                        <span className="text-gray-300">{cycle.pool2}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Pool 3:</span>
                        <span className="text-gray-300">{cycle.pool3}</span>
                      </div>
                      
                      <div className="py-2">
                        <div className="text-xs text-gray-400 mb-2">Profit Simulation (1 {cycle.tokens[0]})</div>
                        <div className="bg-[#0f172a] rounded-md p-2 space-y-2">
                          {(() => {
                            const [step1, step2, step3, profitPercent] = calculateProfit(cycle);
                            return (
                              <>
                                <div className="flex justify-between items-center">
                                  <span>Start:</span>
                                  <span className="text-gray-300">1.000000 {cycle.tokens[0]}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span>Step 1:</span>
                                  <span className="text-gray-300">{step1} {cycle.tokens[1]}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span>Step 2:</span>
                                  <span className="text-gray-300">{step2} {cycle.tokens[2]}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span>Step 3:</span>
                                  <span className="text-gray-300">{step3} {cycle.tokens[0]}</span>
                                </div>
                                <div className="flex justify-between items-center pt-1 border-t border-gray-700">
                                  <span>Profit:</span>
                                  <span className={`${
                                    profitPercent > 0 ? 'text-green-400' : 'text-red-400'
                                  }`}>
                                    {profitPercent > 0 ? '+' : ''}{(step3 - 1).toFixed(6)} {cycle.tokens[0]} ({profitPercent}%)
                                  </span>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {cycles.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No cycles detected
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="mt-4 pt-4 border-t border-gray-700 text-xs text-gray-400">
        <p>Scanning for arbitrage opportunities across {cycles.length} potential cycles.</p>
        <p className="mt-1">Minimum profitability threshold: 0.1%</p>
      </div>
    </>
  );
}
