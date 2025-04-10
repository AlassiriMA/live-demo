import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart
} from "recharts";

interface TradingPair {
  id: number;
  symbol1: string;
  symbol2: string;
  exchange: string;
  correlation: number;
  lastUpdated: string;
  zScore?: number;
}

interface PairChartProps {
  pair: TradingPair;
  zScoreThreshold: number;
}

export default function PairChart({ pair, zScoreThreshold }: PairChartProps) {
  const [activeTab, setActiveTab] = useState("spread");
  
  // Generate historical price data
  const priceData = useMemo(() => {
    // Generate 30 data points
    return Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setMinutes(date.getMinutes() - (30 - i) * 15);
      
      // Create a base value around 1000 with slight variations
      const baseValue1 = 1000 + Math.sin(i / 3) * 50 + Math.random() * 20;
      const baseValue2 = 950 + Math.cos(i / 4) * 40 + Math.random() * 15;
      
      // Calculate spread
      const spread = baseValue1 - baseValue2;
      
      // Calculate z-score (normalized spread)
      const meanSpread = 50; // Arbitrary mean
      const stdDevSpread = 20; // Arbitrary standard deviation
      const zScore = (spread - meanSpread) / stdDevSpread;
      
      return {
        time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        price1: baseValue1.toFixed(2),
        price2: baseValue2.toFixed(2),
        spread: spread.toFixed(2),
        zScore: zScore.toFixed(2),
        // Simulate some entry/exit points
        signal: i === 10 || i === 20 ? (i === 10 ? 'ENTRY' : 'EXIT') : null
      };
    });
  }, [pair.id]);
  
  // Format tooltip values
  const formatTooltipValue = (value: string) => {
    return parseFloat(value).toFixed(2);
  };
  
  return (
    <Card className="bg-[#1a1a1a] border-[#33ff33]/30 text-[#33ff33]">
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-[#2a2a2a] border-b border-[#33ff33]/30 rounded-none w-full justify-start">
            <TabsTrigger value="spread" className="data-[state=active]:bg-[#33ff33]/20 data-[state=active]:text-[#33ff33]">
              Price Spread
            </TabsTrigger>
            <TabsTrigger value="zscore" className="data-[state=active]:bg-[#33ff33]/20 data-[state=active]:text-[#33ff33]">
              Z-Score
            </TabsTrigger>
            <TabsTrigger value="prices" className="data-[state=active]:bg-[#33ff33]/20 data-[state=active]:text-[#33ff33]">
              Individual Prices
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="spread" className="p-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="time" stroke="#33ff33" />
                  <YAxis stroke="#33ff33" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f0f0f', borderColor: '#33ff33', color: '#33ff33' }}
                    formatter={formatTooltipValue}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="spread" 
                    stroke="#33ff33" 
                    strokeWidth={2}
                    dot={false} 
                    activeDot={{ r: 6, fill: '#33ff33' }}
                  />
                  {priceData.map((entry, index) => (
                    entry.signal && (
                      <ReferenceLine 
                        key={index}
                        x={entry.time} 
                        stroke={entry.signal === 'ENTRY' ? "#ff3333" : "#ffff33"} 
                        strokeDasharray="3 3"
                        label={{ 
                          value: entry.signal, 
                          position: 'insideBottomRight', 
                          fill: entry.signal === 'ENTRY' ? "#ff3333" : "#ffff33",
                          fontSize: 10 
                        }}
                      />
                    )
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="zscore" className="p-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={priceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="time" stroke="#33ff33" />
                  <YAxis stroke="#33ff33" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f0f0f', borderColor: '#33ff33', color: '#33ff33' }}
                    formatter={formatTooltipValue}
                  />
                  <ReferenceLine y={0} stroke="#33ff33" strokeOpacity={0.5} />
                  <ReferenceLine y={zScoreThreshold} stroke="#ff3333" strokeDasharray="3 3" />
                  <ReferenceLine y={-zScoreThreshold} stroke="#ff3333" strokeDasharray="3 3" />
                  <defs>
                    <linearGradient id="colorZScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#33ff33" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#33ff33" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="zScore" 
                    stroke="#33ff33" 
                    strokeWidth={2}
                    fillOpacity={0.3}
                    fill="url(#colorZScore)"
                    activeDot={{ r: 6, fill: '#33ff33' }}
                  />
                  {priceData.map((entry, index) => (
                    entry.signal && (
                      <ReferenceLine 
                        key={index}
                        x={entry.time} 
                        stroke={entry.signal === 'ENTRY' ? "#ff3333" : "#ffff33"} 
                        strokeDasharray="3 3"
                        label={{ 
                          value: entry.signal, 
                          position: 'insideBottomRight', 
                          fill: entry.signal === 'ENTRY' ? "#ff3333" : "#ffff33",
                          fontSize: 10 
                        }}
                      />
                    )
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 text-xs flex justify-between">
              <div>
                <span className="inline-block w-3 h-3 bg-red-500 mr-1"></span>
                <span>Upper Threshold: {zScoreThreshold}</span>
              </div>
              <div>
                <span className="inline-block w-3 h-3 bg-red-500 mr-1"></span>
                <span>Lower Threshold: -{zScoreThreshold}</span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="prices" className="p-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="time" stroke="#33ff33" />
                  <YAxis stroke="#33ff33" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f0f0f', borderColor: '#33ff33', color: '#33ff33' }}
                    formatter={formatTooltipValue}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price1" 
                    name={pair.symbol1}
                    stroke="#33ff33" 
                    strokeWidth={2}
                    dot={false} 
                    activeDot={{ r: 6, fill: '#33ff33' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price2" 
                    name={pair.symbol2}
                    stroke="#3333ff" 
                    strokeWidth={2}
                    dot={false} 
                    activeDot={{ r: 6, fill: '#3333ff' }}
                  />
                  {priceData.map((entry, index) => (
                    entry.signal && (
                      <ReferenceLine 
                        key={index}
                        x={entry.time} 
                        stroke={entry.signal === 'ENTRY' ? "#ff3333" : "#ffff33"} 
                        strokeDasharray="3 3"
                        label={{ 
                          value: entry.signal, 
                          position: 'insideBottomRight', 
                          fill: entry.signal === 'ENTRY' ? "#ff3333" : "#ffff33",
                          fontSize: 10 
                        }}
                      />
                    )
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 text-xs flex justify-between">
              <div>
                <span className="inline-block w-3 h-3 bg-[#33ff33] mr-1"></span>
                <span>{pair.symbol1}</span>
              </div>
              <div>
                <span className="inline-block w-3 h-3 bg-blue-500 mr-1"></span>
                <span>{pair.symbol2}</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
