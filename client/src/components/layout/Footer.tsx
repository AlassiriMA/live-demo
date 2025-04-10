import React from 'react';
import { Link } from 'wouter';
import { Github, Linkedin, Twitter, Mail, Lock } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Main Site Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-foreground/80 hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/skills" className="text-foreground/80 hover:text-primary transition-colors">Skills</Link></li>
              <li><Link href="/blog" className="text-foreground/80 hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="text-foreground/80 hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          {/* Demo Apps */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Demo Apps</h3>
            <ul className="space-y-2">
              <li><Link href="/pos" className="text-foreground/80 hover:text-primary transition-colors">POS System</Link></li>
              <li><Link href="/fruits" className="text-foreground/80 hover:text-primary transition-colors">Fruit Store</Link></li>
              <li><Link href="/marketing" className="text-foreground/80 hover:text-primary transition-colors">Marketing Agency</Link></li>
              <li><Link href="/bi" className="text-foreground/80 hover:text-primary transition-colors">BI Dashboard</Link></li>
            </ul>
          </div>
          
          {/* Financial Tools */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Financial Tools</h3>
            <ul className="space-y-2">
              <li><Link href="/statarb" className="text-foreground/80 hover:text-primary transition-colors">Statistical Arbitrage</Link></li>
              <li><Link href="/triarb" className="text-foreground/80 hover:text-primary transition-colors">Triangular Arbitrage</Link></li>
              <li><Link href="/dydx" className="text-foreground/80 hover:text-primary transition-colors">dYdX Trading</Link></li>
            </ul>
          </div>
          
          {/* Legal & Admin */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal & Admin</h3>
            <ul className="space-y-2">
              <li><Link href="/sitemap" className="text-foreground/80 hover:text-primary transition-colors">Sitemap</Link></li>
              <li><Link href="/terms" className="text-foreground/80 hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-foreground/80 hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li>
                <Link href="/admin/login" className="text-foreground/80 hover:text-primary flex items-center gap-1 transition-colors">
                  <Lock className="h-4 w-4" />
                  <span>Admin Login</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Social Links & Copyright */}
        <div className="mt-8 pt-6 border-t flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-primary">
              <Github className="h-5 w-5" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-primary">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-primary">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="mailto:contact@example.com" className="text-foreground/70 hover:text-primary">
              <Mail className="h-5 w-5" />
            </a>
          </div>
          <div className="text-sm text-foreground/60">
            © {currentYear} Portfolio & Skill Tracker. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;