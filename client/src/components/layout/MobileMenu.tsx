import { Link } from "wouter";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isAppPage: boolean;
}

export default function MobileMenu({ isOpen, onClose, isAppPage }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-white pb-4 px-4">
      {isAppPage ? (
        <>
          <Link href="/" onClick={onClose} className="block py-2 text-gray-800 hover:text-gray-600 font-medium">
            Home
          </Link>
          <Link href="/#apps" onClick={onClose} className="block py-2 text-gray-800 hover:text-gray-600 font-medium">
            All Apps
          </Link>
          <Link href="/skills" onClick={onClose} className="block py-2 text-gray-800 hover:text-gray-600 font-medium">
            Skills
          </Link>
          <Link href="/blog" onClick={onClose} className="block py-2 text-gray-800 hover:text-gray-600 font-medium">
            Blog
          </Link>
          <Link href="/#about" onClick={onClose} className="block py-2 text-gray-800 hover:text-gray-600 font-medium">
            About
          </Link>
          <Link href="/#contact" onClick={onClose} className="block py-2 text-gray-800 hover:text-gray-600 font-medium">
            Contact
          </Link>
        </>
      ) : (
        <>
          <a href="#" onClick={onClose} className="block py-2 text-gray-800 hover:text-gray-600 font-medium">
            Home
          </a>
          <a href="#apps" onClick={onClose} className="block py-2 text-gray-800 hover:text-gray-600 font-medium">
            Apps
          </a>
          <Link href="/skills" onClick={onClose} className="block py-2 text-gray-800 hover:text-gray-600 font-medium">
            Skills
          </Link>
          <Link href="/blog" onClick={onClose} className="block py-2 text-gray-800 hover:text-gray-600 font-medium">
            Blog
          </Link>
          <a href="#about" onClick={onClose} className="block py-2 text-gray-800 hover:text-gray-600 font-medium">
            About
          </a>
          <a href="#contact" onClick={onClose} className="block py-2 text-gray-800 hover:text-gray-600 font-medium">
            Contact
          </a>
        </>
      )}
    </div>
  );
}
