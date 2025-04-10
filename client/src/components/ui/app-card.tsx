import { Link } from "wouter";
import { AppInfo } from "@/lib/app-data";

interface AppCardProps {
  app: AppInfo;
  index: number;
}

export default function AppCard({ app, index }: AppCardProps) {
  // Different card styles based on app type
  const getCardStyles = () => {
    switch (app.id) {
      case "pos":
        return {
          cardClass: "neu-bg rounded-2xl overflow-hidden shadow-neu transition-all hover:shadow-lg group",
          buttonClass: "neu-button inline-block w-full text-center font-medium py-3 px-6 text-[#6366F1]"
        };
      case "fruits":
        return {
          cardClass: "bg-white rounded-2xl overflow-hidden shadow-md transition-all hover:shadow-lg group",
          buttonClass: "inline-block w-full text-center font-medium py-3 px-6 rounded-lg border border-[#22C55E] text-[#22C55E] hover:bg-[#22C55E] hover:text-white transition-colors"
        };
      case "marketing":
        return {
          cardClass: "rounded-2xl overflow-hidden shadow-md transition-all hover:shadow-lg group relative",
          buttonClass: "inline-block w-full text-center font-medium py-3 px-6 rounded-lg bg-[#EC4899] text-white hover:bg-[#DB2777] transition-colors"
        };
      case "statarb":
        return {
          cardClass: "rounded-2xl overflow-hidden shadow-md transition-all hover:shadow-lg group",
          buttonClass: "inline-block w-full text-center font-medium py-3 px-6 rounded-lg border border-[#10B981] text-[#10B981] hover:bg-[#10B981] hover:text-gray-900 transition-colors"
        };
      case "triarb":
        return {
          cardClass: "rounded-2xl overflow-hidden shadow-md transition-all hover:shadow-lg group",
          buttonClass: "inline-block w-full text-center font-medium py-3 px-6 rounded-lg bg-[#8B5CF6] text-white shadow-[0_0_10px_rgba(139,92,246,0.7),0_0_20px_rgba(139,92,246,0.5)] hover:bg-[#7C3AED] transition-colors"
        };
      case "dydx":
        return {
          cardClass: "rounded-2xl overflow-hidden shadow-md transition-all hover:shadow-lg group",
          buttonClass: "inline-block w-full text-center font-medium py-3 px-6 rounded-lg bg-[#F59E0B] text-white hover:bg-[#D97706] transition-colors"
        };
      case "bi":
        return {
          cardClass: "bg-white rounded-2xl overflow-hidden shadow-md transition-all hover:shadow-lg group",
          buttonClass: "inline-block w-full text-center font-medium py-3 px-6 rounded-lg bg-[#3B82F6] text-white hover:bg-[#2563EB] transition-colors shadow-md"
        };
      default:
        return {
          cardClass: "bg-white rounded-2xl overflow-hidden shadow-md transition-all hover:shadow-lg group",
          buttonClass: "inline-block w-full text-center font-medium py-3 px-6 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        };
    }
  };

  const { cardClass, buttonClass } = getCardStyles();

  // Marketing card has a special background effect
  const renderMarketingCardWrapper = (children: React.ReactNode) => {
    if (app.id === "marketing") {
      return (
        <div className={cardClass}>
          <div className="absolute inset-0 bg-gradient-to-r from-[#EC4899]/20 to-purple-500/20 backdrop-blur-sm rounded-2xl -z-10"></div>
          <div className="glass-bg h-full">
            {children}
          </div>
        </div>
      );
    }
    return <div className={cardClass}>{children}</div>;
  };

  // Special content for terminal-style cards (StatArb)
  const renderCardContent = () => {
    if (app.id === "statarb") {
      return (
        <div className="h-48 bg-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 terminal-bg">
            <div className="font-mono text-xs p-4 text-green-400">
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-2 text-gray-400">stat-arb-terminal</span>
              </div>
              <div className="mb-1">$ initializing pairs scanner...</div>
              <div className="mb-1">$ loading market data...</div>
              <div className="mb-1">$ computing z-scores...</div>
              <div className="animate-pulse">$ ready ▋</div>
            </div>
          </div>
        </div>
      );
    } else if (app.id === "triarb") {
      return (
        <div className="h-48 bg-gray-900 relative overflow-hidden cyber-grid">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#8B5CF6]/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-900 to-transparent flex items-center justify-between">
            <div className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse mr-2"></span>
              <span className="text-green-500 font-mono text-sm">LIVE</span>
            </div>
            <div className="font-mono text-xs text-[#8B5CF6]">
              ETH → USDT → BTC → ETH (+0.32%)
            </div>
          </div>
        </div>
      );
    } else if (app.id === "dydx") {
      return (
        <div className="h-48 trading-view-bg relative overflow-hidden">
          <div className="p-2 h-full">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-[#F59E0B] font-mono font-bold">ETH-USD</span>
                <span className="text-green-500 text-sm">+2.46%</span>
              </div>
              <div className="flex space-x-1">
                <button className="w-6 h-6 rounded bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                  </svg>
                </button>
                <button className="w-6 h-6 rounded bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="h-32 relative">
              <svg viewBox="0 0 100 40" className="w-full h-full">
                <path d="M0,35 L5,32 L10,33 L15,25 L20,28 L25,26 L30,20 L35,15 L40,18 L45,16 L50,10 L55,12 L60,8 L65,14 L70,16 L75,12 L80,10 L85,16 L90,14 L95,8 L100,5" fill="none" stroke="#F59E0B" strokeWidth="1"></path>
                <path d="M0,35 L5,32 L10,33 L15,25 L20,28 L25,26 L30,20 L35,15 L40,18 L45,16 L50,10 L55,12 L60,8 L65,14 L70,16 L75,12 L80,10 L85,16 L90,14 L95,8 L100,5" fill="url(#dydxGradient)" fillOpacity="0.2" stroke="none"></path>
                <circle cx="100" cy="5" r="1.5" fill="#F59E0B"></circle>
                <defs>
                  <linearGradient id="dydxGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      );
    } else if (app.id === "bi") {
      return (
        <div className="h-48 bg-gray-200 relative overflow-hidden">
          {app.imageUrl && (
            <img 
              src={app.imageUrl} 
              alt="Business Intelligence Dashboard"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2">
            <div className="rounded bg-white shadow p-2 flex items-center justify-center">
              <svg className="w-6 h-6 text-[#3B82F6]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 13V17M16 11V17M12 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 12C3 4.5885 4.5885 3 12 3C19.4115 3 21 4.5885 21 12C21 19.4115 19.4115 21 12 21C4.5885 21 3 19.4115 3 12Z" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <div className="rounded bg-white shadow p-2 flex items-center justify-center">
              <svg className="w-6 h-6 text-[#3B82F6]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L22 8.5V15.5L12 22L2 15.5V8.5L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 22V15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 8.5L12 15.5L2 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 15.5L12 8.5L22 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 2V8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="rounded bg-white shadow p-2 flex items-center justify-center">
              <svg className="w-6 h-6 text-[#3B82F6]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="h-48 bg-gray-200 relative overflow-hidden">
          {app.imageUrl && (
            <img 
              src={app.imageUrl} 
              alt={app.name}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
          )}
          <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow">
            {getAppIcon(app.id)}
          </div>
        </div>
      );
    }
  };

  // Return appropriate icon based on app type
  const getAppIcon = (appId: string) => {
    switch (appId) {
      case "pos":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#6366F1]" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H15a1 1 0 100-2H8.414l1.293-1.293z" clipRule="evenodd" />
          </svg>
        );
      case "fruits":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#22C55E]" viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          </svg>
        );
      case "marketing":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#EC4899]" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  // Determine card background color for description section
  const getCardBgColor = () => {
    if (app.id === "statarb" || app.id === "triarb" || app.id === "dydx") {
      return "bg-gray-900 text-gray-100";
    }
    if (app.id === "marketing") {
      return "backdrop-blur-sm bg-white/80 rounded-b-2xl";
    }
    return ""; // Default (white background)
  };

  return renderMarketingCardWrapper(
    <>
      {renderCardContent()}
      <div className={`p-6 ${getCardBgColor()}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading font-bold text-xl text-gray-800 dark:text-gray-100">{app.name}</h3>
          <span 
            className="text-sm font-medium px-3 py-1 rounded-full" 
            style={{ 
              backgroundColor: `${app.primaryColor}10`, 
              color: app.primaryColor 
            }}
          >
            {app.style}
          </span>
        </div>
        <p className={`${app.id.match(/statarb|triarb|dydx/) ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
          {app.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          {app.tags.map((tag, i) => (
            <span 
              key={i} 
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                app.id.match(/statarb|triarb|dydx/) 
                  ? 'bg-gray-800 text-gray-300' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
        <Link href={app.route} className={buttonClass}>
          Launch App
        </Link>
      </div>
    </>
  );
}
