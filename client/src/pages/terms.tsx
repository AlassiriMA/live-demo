import React from 'react';
import { FileText, Shield, Clock, Eye, Globe, Scale, HelpCircle } from 'lucide-react';

const Terms = () => {
  const lastUpdated = 'April 10, 2025';
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <FileText className="h-7 w-7 text-primary" />
          Terms of Service
        </h1>
        
        <p className="text-foreground/60 mb-8 flex items-center gap-1">
          <Clock className="h-4 w-4" />
          Last Updated: {lastUpdated}
        </p>
        
        <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
          <p>
            Welcome to the Portfolio & Skill Tracker application. These Terms of Service ("Terms") govern your use of our website, 
            demo applications, and services (collectively, the "Services"). Please read these Terms carefully before using our Services.
          </p>
          
          <section className="mb-8">
            <h2 className="flex items-center gap-2 !mt-8 !mb-4">
              <Shield className="h-5 w-5 text-primary" />
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, 
              please do not use our Services. These Terms constitute a legally binding agreement between you and Portfolio & Skill Tracker.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="flex items-center gap-2 !mt-8 !mb-4">
              <Globe className="h-5 w-5 text-primary" />
              2. Service Description
            </h2>
            <p>
              The Portfolio & Skill Tracker provides a platform for users to view demonstration applications showcasing various technologies
              and development skills. These demonstration applications include POS systems, e-commerce platforms, marketing tools, 
              business intelligence dashboards, and financial trading applications.
            </p>
            <p>
              All demo applications are for demonstration purposes only and do not process real financial transactions or store 
              sensitive personal information beyond what is necessary for the demonstration.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="flex items-center gap-2 !mt-8 !mb-4">
              <Eye className="h-5 w-5 text-primary" />
              3. Privacy
            </h2>
            <p>
              Your privacy is important to us. Please review our <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>, 
              which explains how we collect, use, and protect your information when you use our Services.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="flex items-center gap-2 !mt-8 !mb-4">
              <Scale className="h-5 w-5 text-primary" />
              4. User Conduct
            </h2>
            <p>
              When using our Services, you agree not to:
            </p>
            <ul>
              <li>Attempt to gain unauthorized access to any part of the Services</li>
              <li>Use the Services for any illegal purpose or in violation of any laws</li>
              <li>Interfere with or disrupt the Services or servers</li>
              <li>Attempt to test, scan, or probe the vulnerability of the system</li>
              <li>Impersonate any person or entity</li>
              <li>Collect or store personal data about other users</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="flex items-center gap-2 !mt-8 !mb-4">
              <HelpCircle className="h-5 w-5 text-primary" />
              5. Contact Us
            </h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p>
              <a href="mailto:contact@example.com" className="text-primary hover:underline">contact@example.com</a>
            </p>
          </section>
        </div>
        
        <div className="bg-muted/40 p-6 rounded-lg mt-12">
          <h3 className="text-lg font-semibold mb-3">Disclaimer</h3>
          <p className="text-sm text-foreground/70">
            The demonstration applications provided on this platform are for illustrative and educational purposes only. 
            They do not provide financial, legal, or professional advice. We make no representations or warranties of any kind, 
            express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information, 
            products, services, or related graphics contained within these demonstrations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;