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
    <div className="md:hidden bg-white pb-4 px-4">
      <NavigationLinks 
        isAppPage={isAppPage} 
        isMobile={true} 
        onItemClick={onClose} 
      />
    </div>
  );
}
