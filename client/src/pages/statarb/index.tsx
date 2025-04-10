import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import AppShell from "@/components/layout/AppShell";
import Terminal from "./components/Terminal";
import PairChart from "./components/PairChart";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

// Trading pair type
interface TradingPair {
  id: number;
  symbol1: string;
  symbol2: string;
  exchange: string;
  correlation: number;
  lastUpdated: string;
  zScore?: number;
}

// Mock trade type
interface Trade {
  id: number;
  pairId: number;
  timestamp: Date;
  type: 'ENTRY' | 'EXIT';
  direction: 'LONG' | 'SHORT';
  price: number;
  size: number;
  pnl?: number;
}

export default function StatArb() {
  const [selectedPair, setSelectedPair] = useState<TradingPair | null>(null);
  const [botActive, setBotActive] = useState(false);
  const [zScoreThreshold, setZScoreThreshold] = useState(2);
  const [activeTrades, setActiveTrades] = useState<Trade[]>([]);
  const [tradeHistory, setTradeHistory] = useState<Trade[]>([]);
  const [logMessages, setLogMessages] = useState<string[]>([
    "System initialized...",
    "Loading pairs data...",
    "Computing z-scores...",
    "Statistical arbitrage bot ready."
  ]);

  // Fetch trading pairs
  const { data: tradingPairs = [], isLoading } = useQuery({
    queryKey: ["/api/trading/pairs"],
  });

  // Add calculated z-scores to pairs
  const pairsWithZScores: TradingPair[] = tradingPairs.map((pair: TradingPair) => ({
    ...pair,
    zScore: generateRandomZScore()
  }));

  // Generate a random z-score (for demonstration)
  function generateRandomZScore() {
    return (Math.random() * 6 - 3).toFixed(2);
  }

  // Select a pair
  const handleSelectPair = (pair: TradingPair) => {
    setSelectedPair(pair);
    addLogMessage(`Selected pair: ${pair.symbol1}/${pair.symbol2}`);
  };

  // Add a log message
  const addLogMessage = (message: string) => {
    setLogMessages(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  // Start/stop the bot
  const toggleBot = () => {
    if (!botActive) {
      if (!selectedPair) {
        addLogMessage("Error: No trading pair selected");
        return;
      }
      
      setBotActive(true);
      addLogMessage(`Bot activated for ${selectedPair.symbol1}/${selectedPair.symbol2}`);
      addLogMessage(`Z-score threshold set to ${zScoreThreshold}`);
    } else {
      setBotActive(false);
      addLogMessage("Bot deactivated");
    }
  };

  // Simulate trading activity when the bot is active
  useEffect(() => {
    if (!botActive || !selectedPair) return;
    
    const interval = setInterval(() => {
      const currentZScore = parseFloat((Math.random() * 6 - 3).toFixed(2));
      
      // Update selected pair's z-score
      setSelectedPair(prev => prev ? {...prev, zScore: currentZScore} : null);
      
      // Check if we should enter or exit a trade
      if (Math.abs(currentZScore) > zScoreThreshold) {
        // If no active trade for this pair, enter a new trade
        if (!activeTrades.some(t => t.pairId === selectedPair.id)) {
          const direction = currentZScore > 0 ? 'SHORT' : 'LONG';
          const newTrade: Trade = {
            id: Date.now(),
            pairId: selectedPair.id,
            timestamp: new Date(),
            type: 'ENTRY',
            direction,
            price: parseFloat((1000 + Math.random() * 100).toFixed(2)),
            size: parseFloat((Math.random() * 5 + 1).toFixed(2)),
          };
          
          setActiveTrades(prev => [...prev, newTrade]);
          addLogMessage(`ENTRY: ${direction} ${selectedPair.symbol1}/${selectedPair.symbol2} at $${newTrade.price}. Z-score: ${currentZScore.toFixed(2)}`);
        }
      } else if (Math.abs(currentZScore) < 0.5) {
        // If we have an active trade for this pair and z-score is close to mean, exit trade
        const existingTrade = activeTrades.find(t => t.pairId === selectedPair.id);
        if (existingTrade) {
          const pnl = existingTrade.direction === 'LONG' 
            ? parseFloat((Math.random() * 100 - 20).toFixed(2))
            : parseFloat((Math.random() * 100 - 20).toFixed(2));
          
          const exitTrade: Trade = {
            ...existingTrade,
            id: Date.now(),
            timestamp: new Date(),
            type: 'EXIT',
            price: parseFloat((existingTrade.price + Math.random() * 50 - 25).toFixed(2)),
            pnl
          };
          
          setActiveTrades(prev => prev.filter(t => t.pairId !== selectedPair.id));
          setTradeHistory(prev => [...prev, exitTrade]);
          
          addLogMessage(`EXIT: ${existingTrade.direction} ${selectedPair.symbol1}/${selectedPair.symbol2} at $${exitTrade.price}. PnL: ${pnl > 0 ? '+' : ''}${pnl}. Z-score: ${currentZScore.toFixed(2)}`);
        }
      }
      
      // Random log messages
      if (Math.random() > 0.8) {
        const messages = [
          `Market scan complete for ${selectedPair.exchange}`,
          `Z-score updated: ${currentZScore.toFixed(2)}`,
          `Checking cointegration status...`,
          `Signal strength: ${Math.abs(currentZScore) > 1.5 ? 'Strong' : 'Weak'}`
        ];
        addLogMessage(messages[Math.floor(Math.random() * messages.length)]);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [botActive, selectedPair, activeTrades, zScoreThreshold]);

  return (
    <AppShell>
      <Helmet>
        <title>StatArb Bot | Alassiri</title>
        <meta name="description" content="A smart bot simulating mean-reverting strategies using z-score models and live data." />
      </Helmet>

      <div className="min-h-screen bg-[#1a1a1a] text-[#33ff33] font-mono">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col space-y-6">
            <header className="bg-[#1a1a1a] p-4 border border-[#33ff33]/30 rounded-lg">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#33ff33] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="font-bold text-xl text-[#33ff33]">StatArb Terminal</span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <span className="text-sm mr-2">Z-score threshold:</span>
                    <Input 
                      type="number" 
                      min="0.5"
                      max="5"
                      step="0.1"
                      value={zScoreThreshold}
                      onChange={(e) => setZScoreThreshold(parseFloat(e.target.value))}
                      className="w-20 bg-[#2a2a2a] border-[#33ff33]/30 text-[#33ff33]"
                    />
                  </div>
                  
                  <Button 
                    onClick={toggleBot}
                    className={`px-4 py-2 rounded ${botActive 
                      ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' 
                      : 'bg-green-900/30 text-[#33ff33] hover:bg-green-900/50'
                    } border border-current`}
                  >
                    {botActive ? 'STOP BOT' : 'START BOT'}
                  </Button>
                  
                  <div className="flex items-center">
                    <span className={`h-3 w-3 rounded-full ${botActive ? 'bg-[#33ff33] animate-pulse' : 'bg-red-500'} mr-2`}></span>
                    <span className="text-sm">{botActive ? 'RUNNING' : 'INACTIVE'}</span>
                  </div>
                </div>
              </div>
            </header>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Trading Pairs List */}
              <Card className="lg:col-span-1 bg-[#1a1a1a] border-[#33ff33]/30 text-[#33ff33]">
                <CardContent className="p-4">
                  <h2 className="text-lg font-bold mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                    Trading Pairs
                  </h2>
                  
                  {isLoading ? (
                    <div className="text-center py-8 animate-pulse">Loading pairs...</div>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                      {pairsWithZScores.map((pair: TradingPair) => (
                        <div 
                          key={pair.id} 
                          className={`p-3 border border-[#33ff33]/30 rounded cursor-pointer hover:bg-[#33ff33]/10 transition-colors ${
                            selectedPair?.id === pair.id ? 'bg-[#33ff33]/20' : ''
                          }`}
                          onClick={() => handleSelectPair(pair)}
                        >
                          <div className="flex justify-between items-center">
                            <div className="font-bold">{pair.symbol1}/{pair.symbol2}</div>
                            <Badge className={`${
                              Math.abs(pair.zScore!) > zScoreThreshold
                                ? 'bg-red-900/30 text-red-400'
                                : 'bg-[#2a2a2a] text-[#33ff33]'
                            }`}>
                              z: {pair.zScore}
                            </Badge>
                          </div>
                          <div className="flex justify-between text-xs mt-1">
                            <span>{pair.exchange}</span>
                            <span>Corr: {pair.correlation.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Main Terminal Section */}
              <div className="lg:col-span-2 space-y-6">
                {selectedPair ? (
                  <>
                    {/* Pair Chart */}
                    <Card className="bg-[#1a1a1a] border-[#33ff33]/30 text-[#33ff33]">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-lg font-bold flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                            </svg>
                            {selectedPair.symbol1}/{selectedPair.symbol2} - {selectedPair.exchange}
                          </h2>
                          <Badge className={`${
                            Math.abs(selectedPair.zScore!) > zScoreThreshold
                              ? 'bg-red-900/30 text-red-400'
                              : 'bg-[#2a2a2a] text-[#33ff33]'
                          }`}>
                            Z-Score: {selectedPair.zScore}
                          </Badge>
                        </div>
                        
                        <PairChart pair={selectedPair} zScoreThreshold={zScoreThreshold} />
                      </CardContent>
                    </Card>
                    
                    {/* Bot Activity & Trades */}
                    <Tabs defaultValue="terminal" className="w-full">
                      <TabsList className="bg-[#2a2a2a] border border-[#33ff33]/30">
                        <TabsTrigger value="terminal" className="data-[state=active]:bg-[#33ff33]/20 data-[state=active]:text-[#33ff33]">Terminal</TabsTrigger>
                        <TabsTrigger value="trades" className="data-[state=active]:bg-[#33ff33]/20 data-[state=active]:text-[#33ff33]">Active Trades</TabsTrigger>
                        <TabsTrigger value="history" className="data-[state=active]:bg-[#33ff33]/20 data-[state=active]:text-[#33ff33]">Trade History</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="terminal">
                        <Terminal logMessages={logMessages} />
                      </TabsContent>
                      
                      <TabsContent value="trades">
                        <Card className="bg-[#1a1a1a] border-[#33ff33]/30 text-[#33ff33]">
                          <CardContent className="p-4">
                            <h2 className="text-lg font-bold mb-4">Active Trades</h2>
                            
                            {activeTrades.length === 0 ? (
                              <div className="text-center py-8 bg-[#2a2a2a]/30 rounded">
                                No active trades
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {activeTrades.map(trade => (
                                  <div key={trade.id} className="p-3 border border-[#33ff33]/30 rounded">
                                    <div className="flex justify-between items-center">
                                      <div className="font-bold">
                                        {trade.direction} {pairsWithZScores.find(p => p.id === trade.pairId)?.symbol1}/
                                        {pairsWithZScores.find(p => p.id === trade.pairId)?.symbol2}
                                      </div>
                                      <Badge className={`${
                                        trade.direction === 'LONG' 
                                          ? 'bg-green-900/30 text-green-400' 
                                          : 'bg-red-900/30 text-red-400'
                                      }`}>
                                        {trade.direction}
                                      </Badge>
                                    </div>
                                    <div className="flex justify-between text-xs mt-2">
                                      <span>Entry: ${trade.price}</span>
                                      <span>Size: {trade.size}</span>
                                      <span>Time: {trade.timestamp.toLocaleTimeString()}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </TabsContent>
                      
                      <TabsContent value="history">
                        <Card className="bg-[#1a1a1a] border-[#33ff33]/30 text-[#33ff33]">
                          <CardContent className="p-4">
                            <h2 className="text-lg font-bold mb-4">Trade History</h2>
                            
                            {tradeHistory.length === 0 ? (
                              <div className="text-center py-8 bg-[#2a2a2a]/30 rounded">
                                No trade history
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {tradeHistory.map(trade => (
                                  <div key={trade.id} className="p-3 border border-[#33ff33]/30 rounded">
                                    <div className="flex justify-between items-center">
                                      <div className="font-bold">
                                        {trade.direction} {pairsWithZScores.find(p => p.id === trade.pairId)?.symbol1}/
                                        {pairsWithZScores.find(p => p.id === trade.pairId)?.symbol2}
                                      </div>
                                      <Badge className={`${
                                        trade.pnl && trade.pnl > 0 
                                          ? 'bg-green-900/30 text-green-400' 
                                          : 'bg-red-900/30 text-red-400'
                                      }`}>
                                        {trade.pnl && trade.pnl > 0 ? '+' : ''}{trade.pnl}
                                      </Badge>
                                    </div>
                                    <div className="flex justify-between text-xs mt-2">
                                      <span>Exit: ${trade.price}</span>
                                      <span>Size: {trade.size}</span>
                                      <span>Time: {trade.timestamp.toLocaleTimeString()}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </>
                ) : (
                  <Card className="bg-[#1a1a1a] border-[#33ff33]/30 text-[#33ff33] h-96 flex items-center justify-center">
                    <CardContent className="text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-[#33ff33]/50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                      </svg>
                      <h3 className="text-xl font-bold mb-2">Select a Trading Pair</h3>
                      <p className="text-[#33ff33]/70">Choose a pair from the list to view stats and start trading</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
