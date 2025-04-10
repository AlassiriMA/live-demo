import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface PairsListProps {
  pairs: TradingPair[];
  isLoading: boolean;
  selectedPair: TradingPair | null;
  onSelectPair: (pair: TradingPair) => void;
}

export default function PairsList({ pairs, isLoading, selectedPair, onSelectPair }: PairsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "correlation" | "change">("name");
  
  // Filter and sort pairs
  const filteredPairs = pairs
    .filter(pair => {
      const searchString = `${pair.symbol1}${pair.symbol2}`.toLowerCase();
      return searchString.includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return `${a.symbol1}${a.symbol2}`.localeCompare(`${b.symbol1}${b.symbol2}`);
      } else if (sortBy === "correlation") {
        return b.correlation - a.correlation;
      } else {
        return (b.change24h || 0) - (a.change24h || 0);
      }
    });

  return (
    <div className="h-full flex flex-col">
      <CardHeader className="p-4 border-b border-[#2a2e39]">
        <CardTitle className="text-lg">Trading Pairs</CardTitle>
      </CardHeader>
      
      <div className="p-4 border-b border-[#2a2e39]">
        <Input
          placeholder="Search pair..."
          className="bg-[#2a2e39] border-[#363a45] text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="flex border-b border-[#2a2e39] text-xs">
        <button 
          className={`flex-1 px-4 py-2 ${sortBy === "name" ? "text-[#F59E0B]" : "text-gray-400"}`}
          onClick={() => setSortBy("name")}
        >
          Name
        </button>
        <button 
          className={`flex-1 px-4 py-2 ${sortBy === "correlation" ? "text-[#F59E0B]" : "text-gray-400"}`}
          onClick={() => setSortBy("correlation")}
        >
          Correl.
        </button>
        <button 
          className={`flex-1 px-4 py-2 ${sortBy === "change" ? "text-[#F59E0B]" : "text-gray-400"}`}
          onClick={() => setSortBy("change")}
        >
          24h
        </button>
      </div>
      
      <CardContent className="flex-1 p-0">
        {isLoading ? (
          <div className="p-4 text-center text-gray-400">
            Loading pairs...
          </div>
        ) : filteredPairs.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            No pairs found matching "{searchTerm}"
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-300px)]">
            <ul>
              {filteredPairs.map(pair => (
                <li 
                  key={pair.id}
                  className={`p-3 border-b border-[#2a2e39] cursor-pointer hover:bg-[#2a2e39]/30 ${
                    selectedPair?.id === pair.id ? "bg-[#2a2e39]" : ""
                  }`}
                  onClick={() => onSelectPair(pair)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium flex items-center">
                        {pair.symbol1}/{pair.symbol2}
                        {pair.correlation > 0.7 && (
                          <Badge className="ml-2 bg-green-900/30 text-green-400 text-xs">High</Badge>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Correlation: {pair.correlation.toFixed(2)}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium">
                        ${pair.price?.toFixed(2)}
                      </div>
                      <div className={`text-xs mt-1 ${
                        pair.change24h && pair.change24h > 0
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}>
                        {pair.change24h && pair.change24h > 0 ? '+' : ''}
                        {pair.change24h?.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
    </div>
  );
}