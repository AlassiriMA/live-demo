import React from 'react';
import { Lock, Clock, Database, Cookie, Eye, Shield, Mail, HelpCircle } from 'lucide-react';

const Privacy = () => {
  const lastUpdated = 'April 10, 2025';
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Lock className="h-7 w-7 text-primary" />
          Privacy Policy
        </h1>
        
        <p className="text-foreground/60 mb-8 flex items-center gap-1">
          <Clock className="h-4 w-4" />
          Last Updated: {lastUpdated}
        </p>
        
        <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
          <p>
            At Portfolio & Skill Tracker, we respect your privacy and are committed to protecting your personal information.
            This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and demo applications.
          </p>
          
          <section className="mb-8">
            <h2 className="flex items-center gap-2 !mt-8 !mb-4">
              <Database className="h-5 w-5 text-primary" />
              1. Information We Collect
            </h2>
            <p>
              <strong>Information You Provide:</strong> When you interact with our demo applications or contact us, we may collect information you provide, such as:
            </p>
            <ul>
              <li>Contact information (name, email address)</li>
              <li>Account credentials for demo purposes</li>
              <li>Feedback and correspondence</li>
            </ul>
            
            <p>
              <strong>Automatically Collected Information:</strong> We may automatically collect certain information when you visit our website, including:
            </p>
            <ul>
              <li>Device information (browser type, operating system)</li>
              <li>Usage data (pages visited, time spent)</li>
              <li>IP address and location information</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="flex items-center gap-2 !mt-8 !mb-4">
              <Eye className="h-5 w-5 text-primary" />
              2. How We Use Your Information
            </h2>
            <p>
              We use the information we collect to:
            </p>
            <ul>
              <li>Provide and maintain our Services</li>
              <li>Understand how you use our demo applications</li>
              <li>Respond to your inquiries and provide support</li>
              <li>Analyze and improve our Services</li>
              <li>Customize content and user experience</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="flex items-center gap-2 !mt-8 !mb-4">
              <Cookie className="h-5 w-5 text-primary" />
              3. Cookies and Similar Technologies
            </h2>
            <p>
              We use cookies and similar tracking technologies to collect and track information about your browsing activities. 
              You can control cookies through your browser settings, but disabling cookies may limit your ability to use certain features 
              of our Services.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="flex items-center gap-2 !mt-8 !mb-4">
              <Shield className="h-5 w-5 text-primary" />
              4. Data Security
            </h2>
            <p>
              We implement appropriate security measures to protect your personal information from unauthorized access, alteration, 
              disclosure, or destruction. However, no internet transmission or electronic storage is completely secure, and we cannot 
              guarantee absolute security.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="flex items-center gap-2 !mt-8 !mb-4">
              <HelpCircle className="h-5 w-5 text-primary" />
              5. Your Rights
            </h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul>
              <li>The right to access your personal information</li>
              <li>The right to correct inaccurate information</li>
              <li>The right to delete your personal information</li>
              <li>The right to object to processing</li>
              <li>The right to data portability</li>
            </ul>
            <p>
              To exercise these rights, please contact us using the information provided below.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="flex items-center gap-2 !mt-8 !mb-4">
              <Mail className="h-5 w-5 text-primary" />
              6. Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p>
              <a href="mailto:privacy@example.com" className="text-primary hover:underline">privacy@example.com</a>
            </p>
          </section>
        </div>
        
        <div className="bg-muted/40 p-6 rounded-lg mt-12">
          <h3 className="text-lg font-semibold mb-3">Important Note</h3>
          <p className="text-sm text-foreground/70">
            The demo applications on this platform are for demonstration purposes only and do not process or store real user data permanently.
            Any information entered into the demo applications is used solely for the purpose of demonstrating the functionality of the application
            and is not shared with third parties or used for marketing purposes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;