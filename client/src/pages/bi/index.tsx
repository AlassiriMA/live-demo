import { useState } from "react";
import { Helmet } from "react-helmet-async";
import AppShell from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import DashboardView from "./components/DashboardView";

// Sample data for charts
const salesData = [
  { name: 'Jan', sales: 4000, profit: 2400, amt: 2400 },
  { name: 'Feb', sales: 3000, profit: 1398, amt: 2210 },
  { name: 'Mar', sales: 2000, profit: 9800, amt: 2290 },
  { name: 'Apr', sales: 2780, profit: 3908, amt: 2000 },
  { name: 'May', sales: 1890, profit: 4800, amt: 2181 },
  { name: 'Jun', sales: 2390, profit: 3800, amt: 2500 },
  { name: 'Jul', sales: 3490, profit: 4300, amt: 2100 },
];

const marketingData = [
  { name: 'Email', value: 400 },
  { name: 'Social', value: 300 },
  { name: 'Direct', value: 300 },
  { name: 'Organic', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const productData = [
  { name: 'Product A', sales: 4000, returns: 240 },
  { name: 'Product B', sales: 3000, returns: 139 },
  { name: 'Product C', sales: 2000, returns: 980 },
  { name: 'Product D', sales: 2780, returns: 390 },
  { name: 'Product E', sales: 1890, returns: 480 },
];

interface KPI {
  id: number;
  title: string;
  value: string;
  change: number;
  timeframe: string;
}

interface Dashboard {
  id: number;
  name: string;
  description: string;
  kpis: KPI[];
  createdAt: string;
}

// Sample data
const dashboards: Dashboard[] = [
  {
    id: 1,
    name: "Sales Overview",
    description: "Key metrics for sales performance",
    kpis: [
      { id: 1, title: "Revenue", value: "$42,890", change: 12.5, timeframe: "vs last month" },
      { id: 2, title: "Orders", value: "1,234", change: 8.3, timeframe: "vs last month" },
      { id: 3, title: "Avg. Order Value", value: "$34.76", change: 3.1, timeframe: "vs last month" },
      { id: 4, title: "Conversion Rate", value: "2.4%", change: -0.8, timeframe: "vs last month" }
    ],
    createdAt: "2023-03-15T12:00:00Z"
  },
  {
    id: 2,
    name: "Marketing Performance",
    description: "Campaign and channel analytics",
    kpis: [
      { id: 5, title: "Site Visits", value: "48,568", change: 23.4, timeframe: "vs last month" },
      { id: 6, title: "Bounce Rate", value: "32%", change: -5.2, timeframe: "vs last month" },
      { id: 7, title: "Email CTR", value: "4.8%", change: 1.2, timeframe: "vs last month" },
      { id: 8, title: "CAC", value: "$24.50", change: -2.6, timeframe: "vs last month" }
    ],
    createdAt: "2023-04-02T09:30:00Z"
  }
];

export default function BI() {
  const [selectedDashboard, setSelectedDashboard] = useState<Dashboard>(dashboards[0]);

  return (
    <AppShell>
      <Helmet>
        <title>Business Intelligence Dashboard | Alassiri</title>
        <meta name="description" content="Visualize key business metrics and KPIs through interactive dashboards and reports." />
      </Helmet>

      <div className="container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <Card className="w-full md:w-64 bg-card border-none shadow-md">
            <CardHeader className="bg-primary/10 text-primary font-medium">
              <CardTitle className="text-lg">Dashboards</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[300px]">
                <ul className="p-2">
                  {dashboards.map(dashboard => (
                    <li key={dashboard.id} className="mb-1">
                      <Button
                        variant={selectedDashboard.id === dashboard.id ? "default" : "ghost"}
                        className="w-full justify-start text-left font-normal"
                        onClick={() => setSelectedDashboard(dashboard)}
                      >
                        {dashboard.name}
                      </Button>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Main content */}
          <DashboardView 
            dashboard={selectedDashboard}
            salesData={salesData}
            marketingData={marketingData}
            productData={productData}
            colors={COLORS}
          />
        </div>
      </div>
    </AppShell>
  );
}