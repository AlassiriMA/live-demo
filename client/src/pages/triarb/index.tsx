import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import AppShell from "@/components/layout/AppShell";
import CycleDetection from "./components/CycleDetection";
import TradeLog from "./components/TradeLog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

interface Cycle {
  id: string;
  tokens: string[];
  profitability: number;
  lastUpdate: Date;
  pool1: string;
  pool2: string;
  pool3: string;
}

export default function TriArb() {
  const [botActive, setBotActive] = useState(false);
  const [selectedExchange, setSelectedExchange] = useState("Binance");
  const [trades, setTrades] = useState<Trade[]>([]);
  const [cycles, setCycles] = useState<Cycle[]>([]);
  
  // Generate cycles on exchange selection
  useEffect(() => {
    if (selectedExchange === "Binance") {
      setCycles([
        {
          id: "1",
          tokens: ["ETH", "USDT", "BTC"],
          profitability: 0.32,
          lastUpdate: new Date(),
          pool1: "ETH/USDT",
          pool2: "BTC/USDT",
          pool3: "ETH/BTC"
        },
        {
          id: "2",
          tokens: ["BNB", "ETH", "USDT"],
          profitability: 0.18,
          lastUpdate: new Date(),
          pool1: "BNB/ETH",
          pool2: "ETH/USDT",
          pool3: "BNB/USDT"
        },
        {
          id: "3",
          tokens: ["SOL", "USDT", "BTC"],
          profitability: 0.05,
          lastUpdate: new Date(),
          pool1: "SOL/USDT",
          pool2: "BTC/USDT",
          pool3: "SOL/BTC"
        },
        {
          id: "4",
          tokens: ["MATIC", "USDT", "ETH"],
          profitability: -0.12,
          lastUpdate: new Date(),
          pool1: "MATIC/USDT",
          pool2: "ETH/USDT",
          pool3: "MATIC/ETH"
        }
      ]);
    } else {
      setCycles([
        {
          id: "5",
          tokens: ["ETH", "USDC", "BTC"],
          profitability: 0.24,
          lastUpdate: new Date(),
          pool1: "ETH/USDC",
          pool2: "BTC/USDC",
          pool3: "ETH/BTC"
        },
        {
          id: "6",
          tokens: ["UNI", "ETH", "USDC"],
          profitability: 0.11,
          lastUpdate: new Date(),
          pool1: "UNI/ETH",
          pool2: "ETH/USDC",
          pool3: "UNI/USDC"
        },
        {
          id: "7",
          tokens: ["AAVE", "ETH", "USDC"],
          profitability: -0.08,
          lastUpdate: new Date(),
          pool1: "AAVE/ETH",
          pool2: "ETH/USDC",
          pool3: "AAVE/USDC"
        }
      ]);
    }
  }, [selectedExchange]);

  // Start/stop the bot
  const toggleBot = () => {
    setBotActive(!botActive);
  };

  // Simulate trading activity when the bot is active
  useEffect(() => {
    if (!botActive) return;

    // Generate a new trade periodically
    const interval = setInterval(() => {
      // Get all profitable cycles
      const profitableCycles = cycles.filter(c => c.profitability > 0);
      
      if (profitableCycles.length === 0) return;
      
      // Randomly select a cycle
      const cycle = profitableCycles[Math.floor(Math.random() * profitableCycles.length)];
      
      // Start with 1 ETH
      const startAmount = 1;
      
      // Calculate end amount based on profitability (add some randomness)
      const randomness = (Math.random() * 0.2) - 0.1; // -0.1 to 0.1
      const profitability = cycle.profitability + randomness;
      const endAmount = startAmount * (1 + profitability / 100);
      
      // Sometimes trades fail
      const tradeFailed = Math.random() < 0.2;
      
      const newTrade: Trade = {
        id: Date.now().toString(),
        timestamp: new Date(),
        cycle: cycle.tokens.join(' → '),
        startAmount,
        endAmount: tradeFailed ? startAmount * 0.95 : endAmount,
        profit: tradeFailed ? startAmount * -0.05 : endAmount - startAmount,
        profitPercent: tradeFailed ? -5 : profitability,
        gasUsed: Math.random() * 0.01 + 0.01, // 0.01 to 0.02 ETH
        status: tradeFailed ? 'failed' : 'success'
      };
      
      setTrades(prev => [newTrade, ...prev].slice(0, 100)); // Keep max 100 trades
      
      // Update cycle profitability (simulate market changes)
      setCycles(prev => 
        prev.map(c => 
          c.id === cycle.id 
            ? { ...c, profitability: c.profitability + (Math.random() * 0.1 - 0.05), lastUpdate: new Date() } 
            : c
        )
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, [botActive, cycles]);

  return (
    <AppShell>
      <Helmet>
        <title>TriArb Bot | Alassiri</title>
        <meta name="description" content="A high-frequency simulated trading bot that detects profit edges in triangle cycles." />
      </Helmet>

      <div className="min-h-screen cyber-grid text-white font-mono">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col space-y-6">
            <header className="bg-[#0f172a] p-6 rounded-lg border border-[#8B5CF6]/30 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/20 flex items-center justify-center mr-3 border border-[#8B5CF6]/50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#8B5CF6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <span className="font-bold text-xl text-white">TriArb Cycle Bot</span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Select
                    defaultValue={selectedExchange}
                    onValueChange={setSelectedExchange}
                  >
                    <SelectTrigger className="w-[180px] bg-[#1e293b] border-[#8B5CF6]/30 text-white">
                      <SelectValue placeholder="Select exchange" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1e293b] border-[#8B5CF6]/50 text-white">
                      <SelectItem value="Binance">Binance</SelectItem>
                      <SelectItem value="Uniswap">Uniswap</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    onClick={toggleBot}
                    className={`shadow-cyber px-6 py-2 rounded-md ${botActive 
                      ? 'bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/50' 
                      : 'bg-[#8B5CF6]/20 hover:bg-[#8B5CF6]/30 text-[#8B5CF6] border border-[#8B5CF6]/50'
                    }`}
                  >
                    {botActive ? 'STOP BOT' : 'START BOT'}
                  </Button>
                  
                  <div className="flex items-center">
                    <span className={`h-3 w-3 rounded-full ${botActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'} mr-2`}></span>
                    <span className="text-sm">{botActive ? 'RUNNING' : 'INACTIVE'}</span>
                  </div>
                </div>
              </div>
            </header>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cycle Detection */}
              <Card className="lg:col-span-1 bg-[#0f172a] border-[#8B5CF6]/30 text-white shadow-cyber">
                <CardContent className="p-6">
                  <h2 className="text-lg font-bold mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#8B5CF6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Profitable Cycles ({selectedExchange})
                  </h2>
                  
                  <CycleDetection cycles={cycles} />
                </CardContent>
              </Card>
              
              {/* Trade Log */}
              <Card className="lg:col-span-2 bg-[#0f172a] border-[#8B5CF6]/30 text-white shadow-cyber">
                <CardContent className="p-6">
                  <h2 className="text-lg font-bold mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#8B5CF6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Trading Activity
                  </h2>
                  
                  <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-[#1e293b] p-4 rounded-lg border border-[#8B5CF6]/30">
                      <div className="text-sm text-gray-400 mb-1">Total Trades</div>
                      <div className="text-xl font-bold text-white">{trades.length}</div>
                    </div>
                    <div className="bg-[#1e293b] p-4 rounded-lg border border-[#8B5CF6]/30">
                      <div className="text-sm text-gray-400 mb-1">Success Rate</div>
                      <div className="text-xl font-bold text-white">
                        {trades.length > 0 
                          ? `${(trades.filter(t => t.status === 'success').length / trades.length * 100).toFixed(1)}%`
                          : '0%'
                        }
                      </div>
                    </div>
                    <div className="bg-[#1e293b] p-4 rounded-lg border border-[#8B5CF6]/30">
                      <div className="text-sm text-gray-400 mb-1">Total Profit</div>
                      <div className="text-xl font-bold text-white">
                        {trades.length > 0
                          ? `${trades.reduce((sum, t) => sum + t.profit, 0).toFixed(4)} ETH`
                          : '0.0000 ETH'
                        }
                      </div>
                    </div>
                    <div className="bg-[#1e293b] p-4 rounded-lg border border-[#8B5CF6]/30">
                      <div className="text-sm text-gray-400 mb-1">Gas Used</div>
                      <div className="text-xl font-bold text-white">
                        {trades.length > 0
                          ? `${trades.reduce((sum, t) => sum + t.gasUsed, 0).toFixed(4)} ETH`
                          : '0.0000 ETH'
                        }
                      </div>
                    </div>
                  </div>
                  
                  <TradeLog trades={trades} />
                </CardContent>
              </Card>
            </div>
            
            {/* Network Status */}
            <Card className="bg-[#0f172a] border-[#8B5CF6]/30 text-white shadow-cyber overflow-hidden">
              <CardContent className="p-0">
                <Tabs defaultValue="status" className="w-full">
                  <TabsList className="bg-[#1e293b] w-full border-b border-[#8B5CF6]/30 rounded-none">
                    <TabsTrigger value="status" className="data-[state=active]:bg-[#8B5CF6]/20 data-[state=active]:text-white">
                      Network Status
                    </TabsTrigger>
                    <TabsTrigger value="pools" className="data-[state=active]:bg-[#8B5CF6]/20 data-[state=active]:text-white">
                      Pool Liquidity
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="data-[state=active]:bg-[#8B5CF6]/20 data-[state=active]:text-white">
                      Bot Settings
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="status" className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="col-span-1">
                        <h3 className="text-sm text-gray-400 mb-2">Network</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span>Gas Price</span>
                            <Badge className="bg-[#1e293b] text-gray-300">12 Gwei</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Block Number</span>
                            <Badge className="bg-[#1e293b] text-gray-300">{15248000 + Math.floor(Date.now() / 12000)}</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Network</span>
                            <div className="flex items-center">
                              <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                              <span>Ethereum Mainnet</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-span-1">
                        <h3 className="text-sm text-gray-400 mb-2">Wallet</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span>Balance</span>
                            <Badge className="bg-[#1e293b] text-gray-300">23.45 ETH</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Address</span>
                            <span className="text-xs truncate max-w-[150px]">0x1a2b...3c4d</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Status</span>
                            <div className="flex items-center">
                              <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                              <span>Connected</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-span-1">
                        <h3 className="text-sm text-gray-400 mb-2">Exchange</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span>Name</span>
                            <Badge className="bg-[#1e293b] text-gray-300">{selectedExchange}</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>API Status</span>
                            <div className="flex items-center">
                              <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                              <span>Online</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Rate Limit</span>
                            <Badge className="bg-[#1e293b] text-gray-300">120/min</Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-span-1">
                        <h3 className="text-sm text-gray-400 mb-2">System</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span>CPU</span>
                            <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                              <div className="h-full bg-[#8B5CF6]" style={{ width: '30%' }}></div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Memory</span>
                            <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                              <div className="h-full bg-[#8B5CF6]" style={{ width: '45%' }}></div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Uptime</span>
                            <Badge className="bg-[#1e293b] text-gray-300">23h 45m</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="pools" className="p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-[#8B5CF6]/30">
                            <th className="text-left p-2">Pool</th>
                            <th className="text-right p-2">Liquidity</th>
                            <th className="text-right p-2">24h Volume</th>
                            <th className="text-right p-2">Fees</th>
                            <th className="text-right p-2">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-800">
                            <td className="p-2">ETH/USDT</td>
                            <td className="text-right p-2">$245.3M</td>
                            <td className="text-right p-2">$78.4M</td>
                            <td className="text-right p-2">0.3%</td>
                            <td className="text-right p-2"><span className="h-2 w-2 rounded-full bg-green-500 inline-block mr-2"></span>Active</td>
                          </tr>
                          <tr className="border-b border-gray-800">
                            <td className="p-2">BTC/USDT</td>
                            <td className="text-right p-2">$312.8M</td>
                            <td className="text-right p-2">$124.5M</td>
                            <td className="text-right p-2">0.3%</td>
                            <td className="text-right p-2"><span className="h-2 w-2 rounded-full bg-green-500 inline-block mr-2"></span>Active</td>
                          </tr>
                          <tr className="border-b border-gray-800">
                            <td className="p-2">ETH/BTC</td>
                            <td className="text-right p-2">$98.5M</td>
                            <td className="text-right p-2">$34.2M</td>
                            <td className="text-right p-2">0.3%</td>
                            <td className="text-right p-2"><span className="h-2 w-2 rounded-full bg-green-500 inline-block mr-2"></span>Active</td>
                          </tr>
                          <tr className="border-b border-gray-800">
                            <td className="p-2">BNB/ETH</td>
                            <td className="text-right p-2">$45.7M</td>
                            <td className="text-right p-2">$12.3M</td>
                            <td className="text-right p-2">0.3%</td>
                            <td className="text-right p-2"><span className="h-2 w-2 rounded-full bg-green-500 inline-block mr-2"></span>Active</td>
                          </tr>
                          <tr className="border-b border-gray-800">
                            <td className="p-2">SOL/BTC</td>
                            <td className="text-right p-2">$23.9M</td>
                            <td className="text-right p-2">$8.7M</td>
                            <td className="text-right p-2">0.3%</td>
                            <td className="text-right p-2"><span className="h-2 w-2 rounded-full bg-yellow-500 inline-block mr-2"></span>Low Liquidity</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="settings" className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h3 className="text-sm text-gray-400 mb-2">Trading Parameters</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span>Min Profit Threshold</span>
                            <div className="flex items-center space-x-2">
                              <input type="range" min="0" max="100" value="10" className="w-32" />
                              <span>0.1%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Max Gas Price</span>
                            <div className="flex items-center space-x-2">
                              <input type="range" min="0" max="100" value="50" className="w-32" />
                              <span>50 Gwei</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Trade Size</span>
                            <div className="flex items-center space-x-2">
                              <input type="range" min="0" max="100" value="25" className="w-32" />
                              <span>1.0 ETH</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Slippage Tolerance</span>
                            <div className="flex items-center space-x-2">
                              <input type="range" min="0" max="100" value="30" className="w-32" />
                              <span>0.3%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-sm text-gray-400 mb-2">Notifications</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span>Email Alerts</span>
                            <div className="relative inline-block w-10 h-5 rounded-full bg-gray-700">
                              <input type="checkbox" className="sr-only" />
                              <span className="block absolute left-1 top-1 w-3 h-3 rounded-full bg-white"></span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Telegram Notifications</span>
                            <div className="relative inline-block w-10 h-5 rounded-full bg-[#8B5CF6]">
                              <input type="checkbox" className="sr-only" checked />
                              <span className="block absolute right-1 top-1 w-3 h-3 rounded-full bg-white"></span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Discord Alerts</span>
                            <div className="relative inline-block w-10 h-5 rounded-full bg-gray-700">
                              <input type="checkbox" className="sr-only" />
                              <span className="block absolute left-1 top-1 w-3 h-3 rounded-full bg-white"></span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Trade Summary (Daily)</span>
                            <div className="relative inline-block w-10 h-5 rounded-full bg-[#8B5CF6]">
                              <input type="checkbox" className="sr-only" checked />
                              <span className="block absolute right-1 top-1 w-3 h-3 rounded-full bg-white"></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
