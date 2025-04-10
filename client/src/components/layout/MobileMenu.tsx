import { Link } from "wouter";
import { NavigationLinks } from "@/components/site-settings/NavigationLinks";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isAppPage: boolean;
}

export default function MobileMenu({ isOpen, onClose, isAppPage }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-gray-900 text-white pb-4 px-4 mobile-menu">
      <NavigationLinks 
        isAppPage={isAppPage} 
        isMobile={true} 
        onItemClick={onClose} 
      />
    </div>
  );
}
