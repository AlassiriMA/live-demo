import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

interface Trade {
  id: string;
  timestamp: Date;
  cycle: string;
  startAmount: number;
  endAmount: number;
  profit: number;
  profitPercent: number;
  gasUsed: number;
  status: 'success' | 'failed';
}

interface TradeLogProps {
  trades: Trade[];
}

export default function TradeLog({ trades }: TradeLogProps) {
  return (
    <div className="border border-[#8B5CF6]/30 rounded-lg overflow-hidden">
      <div className="bg-[#1e293b] px-4 py-2 border-b border-[#8B5CF6]/30 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="h-2 w-2 rounded-full bg-green-500"></span>
          <span className="text-sm">Live Trading Log</span>
        </div>
        <div className="text-xs text-gray-400">Auto-refreshing</div>
      </div>
      
      <ScrollArea className="h-[400px]">
        <div className="p-4">
          <AnimatePresence initial={false}>
            {trades.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                No trades recorded yet. Start the bot to see activity.
              </div>
            ) : (
              <div className="space-y-2">
                {trades.map(trade => (
                  <motion.div
                    key={trade.id}
                    initial={{ opacity: 0, y: -20, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: 20, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`border rounded-md p-3 ${
                      trade.status === 'success' 
                        ? trade.profit > 0 
                          ? 'border-green-500/30 bg-green-900/10' 
                          : 'border-red-500/30 bg-red-900/10'
                        : 'border-yellow-500/30 bg-yellow-900/10'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2">
                          <Badge className={`${
                            trade.status === 'success'
                              ? trade.profit > 0 
                                ? 'bg-green-900/30 text-green-400' 
                                : 'bg-red-900/30 text-red-400'
                              : 'bg-yellow-900/30 text-yellow-400'
                          }`}>
                            {trade.status === 'success' 
                              ? trade.profit > 0 ? 'PROFIT' : 'LOSS' 
                              : 'FAILED'
                            }
                          </Badge>
                          <span className="font-medium">{trade.cycle}</span>
                        </div>
                        <div className="mt-1 text-xs text-gray-400">
                          {trade.timestamp.toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`font-bold ${
                          trade.status === 'success'
                            ? trade.profit > 0 
                              ? 'text-green-400' 
                              : 'text-red-400'
                            : 'text-yellow-400'
                        }`}>
                          {trade.profit > 0 ? '+' : ''}{trade.profit.toFixed(6)} ETH
                        </div>
                        <div className="text-xs text-gray-400">
                          {trade.profitPercent > 0 ? '+' : ''}{trade.profitPercent.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-xs grid grid-cols-3 gap-2">
                      <div>
                        <div className="text-gray-400">Start Amount</div>
                        <div>{trade.startAmount.toFixed(6)} ETH</div>
                      </div>
                      <div>
                        <div className="text-gray-400">End Amount</div>
                        <div>{trade.endAmount.toFixed(6)} ETH</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Gas Used</div>
                        <div>{trade.gasUsed.toFixed(6)} ETH</div>
                      </div>
                    </div>
                    
                    {trade.status === 'failed' && (
                      <div className="mt-2 text-xs text-yellow-400 italic">
                        Transaction failed: Slippage exceeded or liquidity changed
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
}
