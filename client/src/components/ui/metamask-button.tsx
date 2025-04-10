import { useMetaMask } from '@/hooks/use-metamask';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MetaMaskButtonProps {
  variant?: 'default' | 'gradient' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function MetaMaskButton({
  variant = 'gradient',
  size = 'md',
  className,
}: MetaMaskButtonProps) {
  const { 
    isInstalled, 
    isConnected, 
    isConnecting, 
    address, 
    connect,
    getFormattedAddress
  } = useMetaMask();

  // Button size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-5 py-2.5 text-lg'
  };

  // Button variant classes
  const variantClasses = {
    default: 'bg-indigo-600 text-white hover:bg-indigo-700',
    gradient: 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700',
    outline: 'bg-transparent border border-indigo-600 text-indigo-600 hover:bg-indigo-50'
  };

  const buttonClasses = cn(
    'rounded-md flex items-center transition-colors font-medium',
    sizeClasses[size],
    variantClasses[variant],
    className
  );

  // MetaMask icon
  const MetaMaskIcon = () => (
    <svg 
      className="h-4 w-4 mr-2" 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 512 512"
      fill="currentColor"
    >
      <path d="M378.9 54.3L336 177.3l-30.9 11.3v42.8H204.9v-42.8l-30.9-11.3L129.6 54.3 139 160.4l65.3 29.7 71.8-48.4 15.6 19.7-71.8 48.4v39.6h71.8v-39.6l71.8-48.4 15.6-19.7-71.8 48.4 65.3-29.7z" />
      <path d="M349.4 337.6V301l-66.5-20.4h-53.8L162.6 301v36.6l9.4 5.4 86.8 48.6 80.6-48.6z" />
    </svg>
  );

  if (!isInstalled) {
    return (
      <a 
        href="https://metamask.io/download/" 
        target="_blank" 
        rel="noopener noreferrer"
        className={buttonClasses}
      >
        <MetaMaskIcon />
        Install MetaMask
      </a>
    );
  }

  if (isConnected && address) {
    return (
      <div className={buttonClasses}>
        <MetaMaskIcon />
        {getFormattedAddress()}
      </div>
    );
  }

  return (
    <button 
      className={buttonClasses}
      onClick={connect}
      disabled={isConnecting}
    >
      <MetaMaskIcon />
      {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
    </button>
  );
}