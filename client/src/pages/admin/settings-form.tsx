import { useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest } from '@/lib/queryClient';
import AuthCheck from '@/components/auth/AuthCheck';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { FadeInSection } from '@/components/performance';

// Group related settings
const SETTING_GROUPS = {
  site: ['site.title', 'site.description', 'site.keywords'],
  hero: ['hero.title', 'hero.subtitle', 'hero.buttonText', 'hero.buttonUrl', 'hero.imageUrl'],
  footer: ['footer.copyright', 'footer.links'],
  contact: ['contact.email', 'contact.phone', 'contact.address'],
  social: ['social.github', 'social.linkedin', 'social.twitter', 'social.facebook', 'social.instagram'],
};

// Define setting types
const SETTING_TYPES = {
  'site.title': 'text',
  'site.description': 'textarea',
  'site.keywords': 'text',
  'hero.title': 'text',
  'hero.subtitle': 'textarea',
  'hero.buttonText': 'text',
  'hero.buttonUrl': 'text',
  'hero.imageUrl': 'text',
  'footer.copyright': 'text',
  'footer.links': 'json',
  'contact.email': 'text',
  'contact.phone': 'text',
  'contact.address': 'textarea',
  'social.github': 'text',
  'social.linkedin': 'text',
  'social.twitter': 'text',
  'social.facebook': 'text',
  'social.instagram': 'text',
};

// Descriptions for each setting
const SETTING_DESCRIPTIONS = {
  'site.title': 'The title of your website, shown in browser tabs',
  'site.description': 'A brief description of your website for SEO',
  'site.keywords': 'Comma-separated keywords for SEO',
  'hero.title': 'Main headline on the landing page',
  'hero.subtitle': 'Secondary text below the headline',
  'hero.buttonText': 'Text for the call-to-action button',
  'hero.buttonUrl': 'Link for the call-to-action button',
  'hero.imageUrl': 'URL for the hero section background image',
  'footer.copyright': 'Copyright notice in the footer',
  'footer.links': 'JSON array of links shown in the footer',
  'contact.email': 'Your contact email address',
  'contact.phone': 'Your contact phone number',
  'contact.address': 'Your physical address',
  'social.github': 'URL to your GitHub profile',
  'social.linkedin': 'URL to your LinkedIn profile',
  'social.twitter': 'URL to your Twitter profile',
  'social.facebook': 'URL to your Facebook page',
  'social.instagram': 'URL to your Instagram profile',
};

const SettingsForm = () => {
  const { category } = useParams();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(category || 'site');

  // Fetch all settings
  const { data: settingsData, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['/api/settings'],
    enabled: !!user,
  });

  const settings = settingsData?.settings || {};

  // Initialize form
  const form = useForm({
    defaultValues: settings,
  });

  // Update form values when settings data is loaded
  useState(() => {
    if (settings) {
      Object.entries(settings).forEach(([key, value]) => {
        // Handle special cases for JSON values
        if (SETTING_TYPES[key] === 'json' && typeof value === 'object') {
          form.setValue(key, JSON.stringify(value, null, 2));
        } else {
          form.setValue(key, value as string);
        }
      });
    }
  });

  // Update setting mutation
  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      let processedValue = value;
      
      // Parse JSON strings
      if (SETTING_TYPES[key] === 'json' && typeof value === 'string') {
        try {
          processedValue = JSON.parse(value);
        } catch (e) {
          throw new Error(`Invalid JSON format for ${key}`);
        }
      }
      
      const response = await apiRequest('PATCH', `/api/settings/${key}`, { value: processedValue });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
      setSuccessMessage('Settings updated successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    },
    onError: (error: any) => {
      setError(error.message || 'Failed to update settings');
    },
  });

  const onSubmit = async (data: Record<string, any>) => {
    // Get the active section's settings
    const activeSettings = SETTING_GROUPS[activeTab] || [];
    
    // Update each changed setting
    const updates = activeSettings.map(async (key) => {
      const value = data[key];
      if (value !== undefined) {
        try {
          await updateSettingMutation.mutateAsync({ key, value });
        } catch (e) {
          console.error(`Error updating ${key}:`, e);
        }
      }
    });
    
    await Promise.all(updates);
  };

  return (
    <AuthCheck requiredRole="admin">
      <div className="container mx-auto py-10 px-4 md:px-6">
        <div className="flex items-center gap-2 mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Site Settings</h1>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {successMessage && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Settings Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {Object.keys(SETTING_GROUPS).map((group) => (
                    <Button
                      key={group}
                      variant={activeTab === group ? "default" : "ghost"}
                      className="w-full justify-start text-left capitalize"
                      onClick={() => {
                        setActiveTab(group);
                        navigate(`/admin/settings/${group}`);
                      }}
                    >
                      {group}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-3">
            <FadeInSection>
              <Card>
                <CardHeader>
                  <CardTitle className="capitalize">{activeTab} Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingSettings ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {SETTING_GROUPS[activeTab]?.map((key) => (
                          <div key={key}>
                            <FormField
                              control={form.control}
                              name={key}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{formatLabel(key)}</FormLabel>
                                  <FormControl>
                                    {SETTING_TYPES[key] === 'textarea' ? (
                                      <Textarea 
                                        placeholder={`Enter ${formatLabel(key).toLowerCase()}`}
                                        className="min-h-[100px]"
                                        {...field} 
                                      />
                                    ) : SETTING_TYPES[key] === 'json' ? (
                                      <Textarea 
                                        placeholder="Enter valid JSON"
                                        className="min-h-[150px] font-mono text-sm"
                                        {...field} 
                                      />
                                    ) : (
                                      <Input 
                                        placeholder={`Enter ${formatLabel(key).toLowerCase()}`}
                                        {...field} 
                                      />
                                    )}
                                  </FormControl>
                                  <FormDescription>
                                    {SETTING_DESCRIPTIONS[key]}
                                  </FormDescription>
                                </FormItem>
                              )}
                            />
                            <Separator className="my-4" />
                          </div>
                        ))}
                        
                        <div className="flex justify-end pt-4">
                          <Button
                            type="submit"
                            disabled={updateSettingMutation.isPending}
                          >
                            {updateSettingMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="mr-2 h-4 w-4" /> 
                                Save Changes
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  )}
                </CardContent>
              </Card>
            </FadeInSection>
          </div>
        </div>
      </div>
    </AuthCheck>
  );
};

// Helper to format setting keys as readable labels
function formatLabel(key: string): string {
  const parts = key.split('.');
  if (parts.length === 2) {
    return parts[1]
      .split(/(?=[A-Z])/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  return key;
}

export default SettingsForm;