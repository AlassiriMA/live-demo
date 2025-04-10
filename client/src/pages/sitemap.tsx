import React from 'react';
import { Link } from 'wouter';
import { ExternalLink, FolderTree, FileText, Home, Code, BookOpen, ShoppingBag, BarChart3, LineChart, Network, Mail, Lock } from 'lucide-react';

const Sitemap = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <FolderTree className="h-7 w-7 text-primary" />
          Sitemap
        </h1>
        
        <div className="space-y-10">
          {/* Main Pages */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              Main Pages
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-8">
              <li>
                <Link href="/" className="text-foreground/80 hover:text-primary transition-colors flex items-center">
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link href="/skills" className="text-foreground/80 hover:text-primary transition-colors flex items-center">
                  <span>Skills</span>
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-foreground/80 hover:text-primary transition-colors flex items-center">
                  <span>Blog</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-foreground/80 hover:text-primary transition-colors flex items-center">
                  <span>Contact</span>
                </Link>
              </li>
            </ul>
          </section>
          
          {/* Demo Applications */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Code className="h-5 w-5 text-primary" />
              Demo Applications
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-8">
              <li>
                <Link href="/pos" className="text-foreground/80 hover:text-primary transition-colors flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <span>POS System (Bookstore)</span>
                </Link>
              </li>
              <li>
                <Link href="/fruits" className="text-foreground/80 hover:text-primary transition-colors flex items-center">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  <span>Fruit Store</span>
                </Link>
              </li>
              <li>
                <Link href="/marketing" className="text-foreground/80 hover:text-primary transition-colors flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>Marketing Agency</span>
                </Link>
              </li>
              <li>
                <Link href="/bi" className="text-foreground/80 hover:text-primary transition-colors flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  <span>BI Dashboard</span>
                </Link>
              </li>
            </ul>
          </section>
          
          {/* Financial Trading Tools */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <LineChart className="h-5 w-5 text-primary" />
              Financial Trading Tools
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-8">
              <li>
                <Link href="/statarb" className="text-foreground/80 hover:text-primary transition-colors flex items-center">
                  <Network className="h-4 w-4 mr-2" />
                  <span>Statistical Arbitrage</span>
                </Link>
              </li>
              <li>
                <Link href="/triarb" className="text-foreground/80 hover:text-primary transition-colors flex items-center">
                  <Network className="h-4 w-4 mr-2" />
                  <span>Triangular Arbitrage</span>
                </Link>
              </li>
              <li>
                <Link href="/dydx" className="text-foreground/80 hover:text-primary transition-colors flex items-center">
                  <LineChart className="h-4 w-4 mr-2" />
                  <span>dYdX Trading</span>
                </Link>
              </li>
            </ul>
          </section>
          
          {/* Legal & Admin */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Legal & Admin
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-8">
              <li>
                <Link href="/terms" className="text-foreground/80 hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-foreground/80 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-foreground/80 hover:text-primary transition-colors flex items-center">
                  <Lock className="h-4 w-4 mr-2" />
                  <span>Admin Login</span>
                </Link>
              </li>
            </ul>
          </section>
        </div>
        
        {/* SEO Sitemap Info */}
        <div className="mt-12 p-4 bg-muted/40 rounded-lg">
          <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
            <ExternalLink className="h-5 w-5 text-primary" />
            XML Sitemap
          </h3>
          <p className="text-foreground/70">
            For search engines, an XML sitemap is available at <code className="bg-muted px-2 py-1 rounded">sitemap.xml</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;