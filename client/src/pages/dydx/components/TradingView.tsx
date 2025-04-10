import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

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

interface TradingViewProps {
  pair: TradingPair;
  zScoreThreshold: number;
}

// Function to generate mock price data
function generatePriceData(length: number, basePrice: number) {
  const volatility = basePrice * 0.02; // 2% volatility
  let lastPrice = basePrice;
  
  return Array.from({ length }, (_, i) => {
    const timestamp = new Date();
    timestamp.setMinutes(timestamp.getMinutes() - (length - i));
    
    // Random walk with drift
    const randomChange = (Math.random() - 0.48) * volatility;
    lastPrice = lastPrice + randomChange;
    
    return {
      time: timestamp.getTime(),
      price: lastPrice,
      volume: Math.random() * 100 + 50
    };
  });
}

// Function to generate Z-score data
function generateZScoreData(length: number) {
  const volatility = 0.5;
  let lastValue = 0;
  
  return Array.from({ length }, (_, i) => {
    const timestamp = new Date();
    timestamp.setMinutes(timestamp.getMinutes() - (length - i));
    
    // Random walk for Z-score
    const randomChange = (Math.random() - 0.5) * volatility;
    lastValue = lastValue + randomChange;
    
    // Add some spikes occasionally
    if (Math.random() < 0.05) {
      lastValue = lastValue + (Math.random() > 0.5 ? 1 : -1) * Math.random() * 2;
    }
    
    return {
      time: timestamp.getTime(),
      zScore: lastValue
    };
  });
}

export default function TradingView({ pair, zScoreThreshold }: TradingViewProps) {
  const [priceData, setPriceData] = useState<any[]>([]);
  const [zScoreData, setZScoreData] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState("1h");
  const [showZScore, setShowZScore] = useState(true);
  
  // Initialize and update data
  useEffect(() => {
    if (!pair.price) return;
    
    const dataPoints = timeframe === "1h" ? 60 : timeframe === "4h" ? 240 : 24;
    setPriceData(generatePriceData(dataPoints, pair.price));
    setZScoreData(generateZScoreData(dataPoints));
    
    // Update data periodically
    const interval = setInterval(() => {
      setPriceData(prevData => {
        const newPoint = {
          time: new Date().getTime(),
          price: prevData[prevData.length - 1].price * (1 + (Math.random() - 0.48) * 0.005),
          volume: Math.random() * 100 + 50
        };
        return [...prevData.slice(1), newPoint];
      });
      
      setZScoreData(prevData => {
        const lastValue = prevData[prevData.length - 1].zScore;
        const newPoint = {
          time: new Date().getTime(),
          zScore: lastValue + (Math.random() - 0.5) * 0.1
        };
        return [...prevData.slice(1), newPoint];
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, [pair.price, timeframe]);
  
  // Calculate chart dimensions
  const chartWidth = "100%";
  const priceChartHeight = 300;
  const zScoreChartHeight = 150;
  
  // Determine max and min values for rendering
  const maxPrice = Math.max(...priceData.map(d => d.price)) * 1.01;
  const minPrice = Math.min(...priceData.map(d => d.price)) * 0.99;
  const priceRange = maxPrice - minPrice;
  const maxZScore = Math.max(zScoreThreshold + 0.5, Math.max(...zScoreData.map(d => d.zScore)));
  const minZScore = Math.min(-zScoreThreshold - 0.5, Math.min(...zScoreData.map(d => d.zScore)));
  const zScoreRange = maxZScore - minZScore;
  
  // Calculate positions for rendering
  const getPriceY = (price: number) => 
    priceChartHeight - ((price - minPrice) / priceRange) * (priceChartHeight * 0.9) - 10;
  
  const getZScoreY = (zScore: number) => 
    zScoreChartHeight - ((zScore - minZScore) / zScoreRange) * (zScoreChartHeight * 0.8) - 10;
  
  // Generate path data
  const pricePathData = priceData.length > 0 
    ? `M ${priceData.map((d, i) => `${(i / (priceData.length - 1)) * 100}% ${getPriceY(d.price)}`).join(" L ")}` 
    : "";
  
  const zScorePathData = zScoreData.length > 0 
    ? `M ${zScoreData.map((d, i) => `${(i / (zScoreData.length - 1)) * 100}% ${getZScoreY(d.zScore)}`).join(" L ")}` 
    : "";
  
  // Prepare threshold lines for Z-score
  const upperThresholdY = getZScoreY(zScoreThreshold);
  const lowerThresholdY = getZScoreY(-zScoreThreshold);
  const zeroLineY = getZScoreY(0);

  return (
    <div className="p-4">
      {/* Timeframe selector */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          {["1h", "4h", "1d"].map(tf => (
            <button
              key={tf}
              className={`px-3 py-1 text-xs rounded ${
                timeframe === tf 
                  ? 'bg-[#F59E0B] text-white' 
                  : 'bg-[#2a2e39] text-gray-400'
              }`}
              onClick={() => setTimeframe(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
        <div className="flex items-center">
          <label className="flex items-center text-sm text-gray-400 mr-4">
            <input
              type="checkbox"
              className="mr-2"
              checked={showZScore}
              onChange={() => setShowZScore(!showZScore)}
            />
            Show Z-Score
          </label>
        </div>
      </div>
      
      {/* Price chart */}
      <Card className="bg-[#131722] border-[#2a2e39] mb-4">
        <CardContent className="p-0">
          <div className="relative p-4">
            <div className="mb-1 text-xs text-gray-400">Price</div>
            <svg width={chartWidth} height={priceChartHeight} className="overflow-visible">
              {/* Grid lines */}
              {Array.from({ length: 5 }).map((_, i) => {
                const y = i * (priceChartHeight / 4);
                const price = maxPrice - (i * priceRange / 4);
                return (
                  <g key={i}>
                    <line 
                      x1="0" 
                      y1={y} 
                      x2="100%" 
                      y2={y} 
                      stroke="#2a2e39" 
                      strokeWidth="1" 
                    />
                    <text 
                      x="5" 
                      y={y + 15} 
                      fill="#9ca3af" 
                      fontSize="10"
                    >
                      {price.toFixed(2)}
                    </text>
                  </g>
                );
              })}
              
              {/* Price line */}
              <path
                d={pricePathData}
                fill="none"
                stroke="#F59E0B"
                strokeWidth="2"
              />
              
              {/* Current price line */}
              {priceData.length > 0 && (
                <line
                  x1="0"
                  y1={getPriceY(priceData[priceData.length - 1].price)}
                  x2="100%"
                  y2={getPriceY(priceData[priceData.length - 1].price)}
                  stroke="#F59E0B"
                  strokeWidth="1"
                  strokeDasharray="5,5"
                />
              )}
              
              {/* Last price label */}
              {priceData.length > 0 && (
                <text
                  x="100%"
                  y={getPriceY(priceData[priceData.length - 1].price) - 5}
                  fill="#F59E0B"
                  fontSize="12"
                  textAnchor="end"
                >
                  ${priceData[priceData.length - 1].price.toFixed(2)}
                </text>
              )}
            </svg>
          </div>
        </CardContent>
      </Card>
      
      {/* Z-Score chart */}
      {showZScore && (
        <Card className="bg-[#131722] border-[#2a2e39]">
          <CardContent className="p-0">
            <div className="relative p-4">
              <div className="mb-1 text-xs text-gray-400">Z-Score</div>
              <svg width={chartWidth} height={zScoreChartHeight} className="overflow-visible">
                {/* Zero line */}
                <line
                  x1="0"
                  y1={zeroLineY}
                  x2="100%"
                  y2={zeroLineY}
                  stroke="#9ca3af"
                  strokeWidth="1"
                  strokeDasharray="5,5"
                />
                <text
                  x="5"
                  y={zeroLineY + 15}
                  fill="#9ca3af"
                  fontSize="10"
                >
                  0
                </text>
                
                {/* Threshold lines */}
                <line
                  x1="0"
                  y1={upperThresholdY}
                  x2="100%"
                  y2={upperThresholdY}
                  stroke="#10b981"
                  strokeWidth="1"
                  strokeDasharray="5,5"
                />
                <text
                  x="5"
                  y={upperThresholdY + 15}
                  fill="#10b981"
                  fontSize="10"
                >
                  +{zScoreThreshold}
                </text>
                
                <line
                  x1="0"
                  y1={lowerThresholdY}
                  x2="100%"
                  y2={lowerThresholdY}
                  stroke="#ef4444"
                  strokeWidth="1"
                  strokeDasharray="5,5"
                />
                <text
                  x="5"
                  y={lowerThresholdY + 15}
                  fill="#ef4444"
                  fontSize="10"
                >
                  -{zScoreThreshold}
                </text>
                
                {/* Z-Score line */}
                <path
                  d={zScorePathData}
                  fill="none"
                  stroke="#8884d8"
                  strokeWidth="2"
                />
                
                {/* Latest Z-Score value */}
                {zScoreData.length > 0 && (
                  <text
                    x="100%"
                    y={getZScoreY(zScoreData[zScoreData.length - 1].zScore) - 5}
                    fill="#8884d8"
                    fontSize="12"
                    textAnchor="end"
                  >
                    {zScoreData[zScoreData.length - 1].zScore.toFixed(2)}
                  </text>
                )}
                
                {/* Signal indicators */}
                {zScoreData.map((d, i) => {
                  if (i < zScoreData.length - 1) {
                    const crossedAboveUpper = d.zScore > zScoreThreshold && zScoreData[i+1].zScore <= zScoreThreshold;
                    const crossedBelowLower = d.zScore < -zScoreThreshold && zScoreData[i+1].zScore >= -zScoreThreshold;
                    
                    if (crossedAboveUpper || crossedBelowLower) {
                      const x = (i / (zScoreData.length - 1)) * 100;
                      const y = getZScoreY(d.zScore);
                      const color = crossedAboveUpper ? "#ef4444" : "#10b981";
                      
                      return (
                        <circle
                          key={i}
                          cx={`${x}%`}
                          cy={y}
                          r="4"
                          fill={color}
                        />
                      );
                    }
                  }
                  return null;
                })}
              </svg>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Trading signals */}
      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2">Trading Signals</h3>
        
        {zScoreData.length > 0 && (
          <div className="bg-[#1e222d] p-3 rounded-md border border-[#2a2e39]">
            <div className="flex justify-between mb-2">
              <span className="text-xs text-gray-400">Current Z-Score:</span>
              <span className={`text-xs font-medium ${
                zScoreData[zScoreData.length - 1].zScore > zScoreThreshold
                  ? 'text-red-400'
                  : zScoreData[zScoreData.length - 1].zScore < -zScoreThreshold
                    ? 'text-green-400'
                    : 'text-gray-300'
              }`}>
                {zScoreData[zScoreData.length - 1].zScore.toFixed(2)}
              </span>
            </div>
            
            <div className="flex justify-between mb-2">
              <span className="text-xs text-gray-400">Threshold:</span>
              <span className="text-xs text-gray-300">±{zScoreThreshold.toFixed(1)}</span>
            </div>
            
            <div className="px-3 py-2 bg-[#131722] rounded mt-2">
              {zScoreData[zScoreData.length - 1].zScore > zScoreThreshold ? (
                <div className="text-xs text-red-400 font-medium">
                  SIGNAL: Potential short opportunity. Pair likely to revert to mean.
                </div>
              ) : zScoreData[zScoreData.length - 1].zScore < -zScoreThreshold ? (
                <div className="text-xs text-green-400 font-medium">
                  SIGNAL: Potential long opportunity. Pair likely to revert to mean.
                </div>
              ) : (
                <div className="text-xs text-gray-400">
                  No trading signal. Z-score within normal range.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}