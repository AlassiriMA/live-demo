import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import AppShell from "@/components/layout/AppShell";
import TradingView from "./components/TradingView";
import PairsList from "./components/PairsList";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TradingPair {
  id: number;
  symbol1: string;
  symbol2: string;
  exchange: string;
  correlation: number;
  lastUpdated: string;
  price?: number;
  change24h?: number;
}

interface Position {
  id: string;
  pair: string;
  side: 'LONG' | 'SHORT';
  size: number;
  leverage: number;
  entryPrice: number;
  markPrice: number;
  liquidationPrice: number;
  pnl: number;
  pnlPercent: number;
  timestamp: Date;
}

interface Alert {
  id: string;
  pair: string;
  condition: string;
  target: number;
  status: 'active' | 'triggered';
  timestamp: Date;
}

export default function DYDX() {
  const [selectedPair, setSelectedPair] = useState<TradingPair | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [zScoreThreshold, setZScoreThreshold] = useState(2);
  const [orderSide, setOrderSide] = useState<'LONG' | 'SHORT'>('LONG');
  const [orderSize, setOrderSize] = useState(1);
  const [orderLeverage, setOrderLeverage] = useState(3);

  // Fetch pairs from API
  const { data: tradingPairs = [], isLoading } = useQuery({
    queryKey: ["/api/trading/pairs", { exchange: "DYDX" }],
  });

  // Enhance pairs with additional data
  const enhancedPairs: TradingPair[] = tradingPairs.map((pair: TradingPair) => ({
    ...pair,
    price: Math.random() * (pair.symbol1 === 'BTC' ? 50000 : 3000) + (pair.symbol1 === 'BTC' ? 30000 : 1000),
    change24h: (Math.random() * 10) - 5,
  }));

  // Handle pair selection
  const handleSelectPair = (pair: TradingPair) => {
    setSelectedPair(pair);
  };

  // Place a simulated order
  const handlePlaceOrder = () => {
    if (!selectedPair) return;
    
    // Create new position
    const newPosition: Position = {
      id: Date.now().toString(),
      pair: `${selectedPair.symbol1}/${selectedPair.symbol2}`,
      side: orderSide,
      size: orderSize,
      leverage: orderLeverage,
      entryPrice: selectedPair.price || 0,
      markPrice: selectedPair.price || 0,
      liquidationPrice: orderSide === 'LONG' 
        ? (selectedPair.price || 0) * (1 - 0.95 / orderLeverage)
        : (selectedPair.price || 0) * (1 + 0.95 / orderLeverage),
      pnl: 0,
      pnlPercent: 0,
      timestamp: new Date()
    };
    
    setPositions([newPosition, ...positions]);
  };

  // Create an alert
  const handleCreateAlert = (condition: string, target: number) => {
    if (!selectedPair) return;
    
    const newAlert: Alert = {
      id: Date.now().toString(),
      pair: `${selectedPair.symbol1}/${selectedPair.symbol2}`,
      condition,
      target,
      status: 'active',
      timestamp: new Date()
    };
    
    setAlerts([newAlert, ...alerts]);
  };

  // Update positions and prices periodically
  useEffect(() => {
    if (positions.length === 0) return;
    
    const interval = setInterval(() => {
      setPositions(prevPositions => 
        prevPositions.map(position => {
          // Simulate price movements
          const priceChange = position.markPrice * (Math.random() * 0.02 - 0.01); // -1% to +1%
          const newMarkPrice = position.markPrice + priceChange;
          
          // Calculate PnL
          const priceDelta = newMarkPrice - position.entryPrice;
          const pnlDirection = position.side === 'LONG' ? 1 : -1;
          const pnl = priceDelta * position.size * position.leverage * pnlDirection;
          const pnlPercent = (pnl / (position.size * position.entryPrice)) * 100;
          
          return {
            ...position,
            markPrice: newMarkPrice,
            pnl,
            pnlPercent
          };
        })
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, [positions]);

  // Update selected pair price
  useEffect(() => {
    if (!selectedPair) return;
    
    const interval = setInterval(() => {
      setSelectedPair(prev => {
        if (!prev) return prev;
        
        const priceChange = (prev.price || 0) * (Math.random() * 0.01 - 0.005); // -0.5% to +0.5%
        return {
          ...prev,
          price: (prev.price || 0) + priceChange
        };
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, [selectedPair]);

  return (
    <AppShell>
      <Helmet>
        <title>DYDX Pairs Trading Bot | Alassiri</title>
        <meta name="description" content="Simulates trading on DYDX's L2 network with cointegration-based entry and exit strategies." />
      </Helmet>

      <div className="min-h-screen bg-[#131722] text-[#d1d4dc] font-sans">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col space-y-6">
            <header className="bg-[#1e222d] p-4 rounded-lg border border-[#2a2e39]">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#F59E0B] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="font-bold text-xl text-white">DYDX Cointegrated Pairs Trading</span>
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
                      className="w-20 bg-[#2a2e39] border-[#363a45] text-white"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
                    <span className="text-sm">Connected</span>
                  </div>
                </div>
              </div>
            </header>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Pairs List */}
              <Card className="bg-[#1e222d] border-[#2a2e39] text-white rounded-lg overflow-hidden">
                <CardContent className="p-0">
                  <PairsList 
                    pairs={enhancedPairs} 
                    isLoading={isLoading} 
                    selectedPair={selectedPair}
                    onSelectPair={handleSelectPair}
                  />
                </CardContent>
              </Card>
              
              {/* Main Trading View */}
              <Card className="lg:col-span-3 bg-[#1e222d] border-[#2a2e39] text-white rounded-lg overflow-hidden">
                <CardContent className="p-0">
                  {selectedPair ? (
                    <div>
                      <div className="border-b border-[#2a2e39] p-4 flex justify-between items-center">
                        <div>
                          <div className="flex items-center">
                            <span className="text-xl font-bold">{selectedPair.symbol1}/{selectedPair.symbol2}</span>
                            <Badge className={`ml-2 ${
                              selectedPair.change24h && selectedPair.change24h > 0
                                ? 'bg-green-900/30 text-green-400'
                                : 'bg-red-900/30 text-red-400'
                            }`}>
                              {selectedPair.change24h && selectedPair.change24h > 0 ? '+' : ''}
                              {selectedPair.change24h?.toFixed(2)}%
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-400">DYDX Perpetual</div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-2xl font-bold">${selectedPair.price?.toFixed(2)}</div>
                          <div className="text-sm text-gray-400">Correlation: {selectedPair.correlation.toFixed(2)}</div>
                        </div>
                      </div>
                      
                      <TradingView pair={selectedPair} zScoreThreshold={zScoreThreshold} />
                      
                      <div className="p-4 border-t border-[#2a2e39]">
                        <Tabs defaultValue="trade">
                          <TabsList className="bg-[#2a2e39] w-full">
                            <TabsTrigger value="trade" className="data-[state=active]:bg-[#F59E0B] data-[state=active]:text-white">
                              Trade
                            </TabsTrigger>
                            <TabsTrigger value="positions" className="data-[state=active]:bg-[#F59E0B] data-[state=active]:text-white">
                              Positions
                            </TabsTrigger>
                            <TabsTrigger value="alerts" className="data-[state=active]:bg-[#F59E0B] data-[state=active]:text-white">
                              Alerts
                            </TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="trade" className="mt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <div className="mb-4">
                                  <div className="text-sm font-medium mb-2">Side</div>
                                  <div className="flex space-x-2">
                                    <Button 
                                      className={`flex-1 ${orderSide === 'LONG' 
                                        ? 'bg-green-500 hover:bg-green-600 text-white' 
                                        : 'bg-[#2a2e39] hover:bg-[#363a45] text-gray-400'
                                      }`}
                                      onClick={() => setOrderSide('LONG')}
                                    >
                                      LONG
                                    </Button>
                                    <Button 
                                      className={`flex-1 ${orderSide === 'SHORT' 
                                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                                        : 'bg-[#2a2e39] hover:bg-[#363a45] text-gray-400'
                                      }`}
                                      onClick={() => setOrderSide('SHORT')}
                                    >
                                      SHORT
                                    </Button>
                                  </div>
                                </div>
                                
                                <div className="mb-4">
                                  <div className="text-sm font-medium mb-2">Size (ETH)</div>
                                  <Input 
                                    type="number" 
                                    min="0.1"
                                    step="0.1"
                                    value={orderSize}
                                    onChange={(e) => setOrderSize(parseFloat(e.target.value))}
                                    className="w-full bg-[#2a2e39] border-[#363a45] text-white"
                                  />
                                </div>
                                
                                <div className="mb-4">
                                  <div className="text-sm font-medium mb-2">Leverage</div>
                                  <div className="flex items-center space-x-2">
                                    <input 
                                      type="range" 
                                      min="1" 
                                      max="10" 
                                      value={orderLeverage} 
                                      onChange={(e) => setOrderLeverage(parseInt(e.target.value))} 
                                      className="flex-1"
                                    />
                                    <span className="w-8 text-center">{orderLeverage}x</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="bg-[#2a2e39] p-4 rounded-lg">
                                <div className="text-sm font-medium mb-4">Order Summary</div>
                                
                                <div className="space-y-2 text-sm mb-4">
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Market Price</span>
                                    <span>${selectedPair.price?.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Order Type</span>
                                    <span>Market</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Size</span>
                                    <span>{orderSize} ETH (${(orderSize * (selectedPair.price || 0)).toFixed(2)})</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Leverage</span>
                                    <span>{orderLeverage}x</span>
                                  </div>
                                </div>
                                
                                <div className="mb-4 pt-2 border-t border-[#363a45]">
                                  <div className="flex justify-between mb-1">
                                    <span className="text-gray-400">Liquidation Price (est.)</span>
                                    <span>${orderSide === 'LONG' 
                                      ? ((selectedPair.price || 0) * (1 - 0.95 / orderLeverage)).toFixed(2)
                                      : ((selectedPair.price || 0) * (1 + 0.95 / orderLeverage)).toFixed(2)
                                    }</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Margin Required</span>
                                    <span>${((orderSize * (selectedPair.price || 0)) / orderLeverage).toFixed(2)}</span>
                                  </div>
                                </div>
                                
                                <Button
                                  className={`w-full ${orderSide === 'LONG' 
                                    ? 'bg-green-500 hover:bg-green-600' 
                                    : 'bg-red-500 hover:bg-red-600'
                                  } text-white`}
                                  onClick={handlePlaceOrder}
                                >
                                  Place {orderSide} Order
                                </Button>
                              </div>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="positions" className="mt-4">
                            {positions.length === 0 ? (
                              <div className="text-center py-8 text-gray-400">
                                No open positions. Place an order to get started.
                              </div>
                            ) : (
                              <div className="space-y-3">
                                {positions.map(position => (
                                  <div 
                                    key={position.id} 
                                    className={`border ${
                                      position.pnl > 0 
                                        ? 'border-green-500/30 bg-green-900/10' 
                                        : 'border-red-500/30 bg-red-900/10'
                                    } rounded-lg p-4`}
                                  >
                                    <div className="flex justify-between items-center">
                                      <div>
                                        <div className="flex items-center">
                                          <Badge className={position.side === 'LONG' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}>
                                            {position.side}
                                          </Badge>
                                          <span className="ml-2 font-medium">{position.pair}</span>
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1">
                                          {position.size} {position.pair.split('/')[0]} @ {position.leverage}x
                                        </div>
                                      </div>
                                      
                                      <div className="text-right">
                                        <div className={position.pnl > 0 ? 'text-green-400' : 'text-red-400'}>
                                          {position.pnl > 0 ? '+' : ''}{position.pnl.toFixed(4)} USD ({position.pnlPercent.toFixed(2)}%)
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1">
                                          Entry: ${position.entryPrice.toFixed(2)} | Current: ${position.markPrice.toFixed(2)}
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="mt-3 pt-3 border-t border-[#2a2e39] flex justify-between items-center">
                                      <div className="text-xs text-gray-400">
                                        Liquidation: ${position.liquidationPrice.toFixed(2)}
                                      </div>
                                      <div className="flex space-x-2">
                                        <Button variant="outline" size="sm" className="text-gray-300 border-[#363a45]">
                                          Edit
                                        </Button>
                                        <Button variant="destructive" size="sm">
                                          Close
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </TabsContent>
                          
                          <TabsContent value="alerts" className="mt-4">
                            <div className="flex justify-between items-center mb-4">
                              <div className="text-sm font-medium">Price Alerts</div>
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  className="bg-[#F59E0B] hover:bg-[#D97706] text-white"
                                  onClick={() => handleCreateAlert('Price above', (selectedPair.price || 0) * 1.05)}
                                >
                                  Price Above
                                </Button>
                                <Button 
                                  size="sm" 
                                  className="bg-[#F59E0B] hover:bg-[#D97706] text-white"
                                  onClick={() => handleCreateAlert('Price below', (selectedPair.price || 0) * 0.95)}
                                >
                                  Price Below
                                </Button>
                                <Button 
                                  size="sm" 
                                  className="bg-[#F59E0B] hover:bg-[#D97706] text-white"
                                  onClick={() => handleCreateAlert('Z-score above', 2)}
                                >
                                  Z-Score Above
                                </Button>
                              </div>
                            </div>
                            
                            {alerts.length === 0 ? (
                              <div className="text-center py-8 text-gray-400">
                                No alerts set. Create an alert to get notified of price movements.
                              </div>
                            ) : (
                              <div className="space-y-3">
                                {alerts.map(alert => (
                                  <div 
                                    key={alert.id} 
                                    className="border border-[#2a2e39] rounded-lg p-4 flex justify-between items-center"
                                  >
                                    <div>
                                      <div className="font-medium">
                                        {alert.pair}: {alert.condition} ${alert.target.toFixed(2)}
                                      </div>
                                      <div className="text-xs text-gray-400 mt-1">
                                        Created: {alert.timestamp.toLocaleString()}
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-3">
                                      <Badge className={alert.status === 'active' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}>
                                        {alert.status}
                                      </Badge>
                                      <Button size="sm" variant="destructive">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </TabsContent>
                        </Tabs>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <h3 className="text-xl font-medium text-white mb-2">Select a Trading Pair</h3>
                      <p className="text-gray-400">Choose a pair from the left to view charts and trade</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
