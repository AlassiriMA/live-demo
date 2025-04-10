import { useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface TerminalProps {
  logMessages: string[];
}

export default function Terminal({ logMessages }: TerminalProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logMessages]);

  return (
    <Card className="bg-[#1a1a1a] border-[#33ff33]/30 text-[#33ff33]">
      <CardContent className="p-4">
        <div className="flex items-center mb-2">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="ml-2 text-[#33ff33]/70 text-sm">stat-arb-terminal</span>
        </div>
        
        <div className="bg-[#0f0f0f] p-4 rounded font-mono text-sm h-64 overflow-y-auto">
          {logMessages.map((msg, index) => (
            <div key={index} className="mb-1">
              {msg.includes("ERROR") || msg.includes("Error") ? (
                <span className="text-red-400">{msg}</span>
              ) : msg.includes("ENTRY") ? (
                <span className="text-green-400">{msg}</span>
              ) : msg.includes("EXIT") ? (
                <span className="text-yellow-400">{msg}</span>
              ) : (
                <span>{msg}</span>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        
        <div className="mt-2 flex items-center">
          <span className="text-[#33ff33] mr-2">$</span>
          <div className="h-4 w-2 bg-[#33ff33] animate-pulse"></div>
        </div>
      </CardContent>
    </Card>
  );
}
