import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

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

interface DashboardViewProps {
  dashboard: Dashboard;
  salesData: any[];
  marketingData: any[];
  productData: any[];
  colors: string[];
}

export default function DashboardView({ 
  dashboard, 
  salesData, 
  marketingData, 
  productData, 
  colors 
}: DashboardViewProps) {
  return (
    <div className="flex-1">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">{dashboard.name}</h1>
        <p className="text-muted-foreground">{dashboard.description}</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {dashboard.kpis.map(kpi => (
          <Card key={kpi.id} className="bg-card border-none shadow-sm">
            <CardContent className="p-4">
              <div className="text-sm font-medium text-muted-foreground">{kpi.title}</div>
              <div className="text-2xl font-bold mt-1 mb-1">{kpi.value}</div>
              <div className={`text-xs flex items-center ${kpi.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                <span>{kpi.change >= 0 ? '↑' : '↓'} {Math.abs(kpi.change)}%</span>
                <span className="ml-1 text-muted-foreground">{kpi.timeframe}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales Analysis</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-card border-none shadow-md p-4">
              <CardHeader className="p-0 pb-2">
                <CardTitle className="text-lg">Revenue & Profit</CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="profit" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-card border-none shadow-md p-4">
              <CardHeader className="p-0 pb-2">
                <CardTitle className="text-lg">Channel Distribution</CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={marketingData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {marketingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <Card className="bg-card border-none shadow-md p-4">
            <CardHeader className="p-0 pb-2">
              <CardTitle className="text-lg">Monthly Sales Trend</CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="sales" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="profit" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketing" className="space-y-4">
          <Card className="bg-card border-none shadow-md p-4">
            <CardHeader className="p-0 pb-2">
              <CardTitle className="text-lg">Marketing Channel Performance</CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={marketingData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {marketingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card className="bg-card border-none shadow-md p-4">
            <CardHeader className="p-0 pb-2">
              <CardTitle className="text-lg">Product Performance</CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#8884d8" />
                  <Bar dataKey="returns" fill="#ff8042" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}