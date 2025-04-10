import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { salesData, getSalesAnalytics } from "../utils/posHelpers";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from "recharts";

interface SalesAnalyticsProps {
  className?: string;
}

export default function SalesAnalytics({ className = "" }: SalesAnalyticsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const analyticsData = getSalesAnalytics();
  
  // Colors for the charts
  const COLORS = ["#6366F1", "#60A5FA", "#34D399", "#F59E0B", "#EC4899"];
  
  // Format data for the pie chart
  const pieChartData = analyticsData.topSellingCategories.map(category => ({
    name: category.name,
    value: category.sales
  }));
  
  // Custom tooltip for the charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="neu-bg dark:bg-gray-800 p-3 rounded-md shadow-md border border-gray-200 dark:border-gray-700">
          <p className="text-gray-800 dark:text-white font-medium">{`${label}`}</p>
          <p className="text-[#6366F1] dark:text-blue-400">{`$${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        className={`neu-button flex items-center space-x-2 dark:bg-gray-800 dark:text-white ${className}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#6366F1] dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <span className="font-medium text-gray-700 dark:text-gray-200">Sales Reports</span>
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="neu-bg dark:bg-gray-800 border-none max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-gray-800 dark:text-white">Sales Analytics</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300">
              View detailed sales performance and analysis.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="neu-bg dark:bg-gray-700 grid grid-cols-3 mb-6">
              <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-[#6366F1] dark:data-[state=active]:bg-gray-600 dark:data-[state=active]:text-blue-400">
                Overview
              </TabsTrigger>
              <TabsTrigger value="categories" className="data-[state=active]:bg-white data-[state=active]:text-[#6366F1] dark:data-[state=active]:bg-gray-600 dark:data-[state=active]:text-blue-400">
                Categories
              </TabsTrigger>
              <TabsTrigger value="transactions" className="data-[state=active]:bg-white data-[state=active]:text-[#6366F1] dark:data-[state=active]:bg-gray-600 dark:data-[state=active]:text-blue-400">
                Recent Transactions
              </TabsTrigger>
            </TabsList>
            
            <AnimatePresence mode="wait">
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="neu-bg dark:bg-gray-700 shadow-neu border-none">
                      <CardContent className="p-6">
                        <h3 className="text-gray-500 dark:text-gray-300 text-sm font-medium">Total Sales</h3>
                        <div className="mt-2 flex items-baseline">
                          <p className="text-3xl font-semibold text-gray-800 dark:text-white">
                            ${analyticsData.totalSales.toLocaleString()}
                          </p>
                          <p className="ml-2 text-sm text-green-500 dark:text-green-400">
                            +{analyticsData.growth}%
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="md:col-span-2"
                  >
                    <Card className="neu-bg dark:bg-gray-700 shadow-neu border-none h-full">
                      <CardContent className="p-6">
                        <h3 className="text-gray-500 dark:text-gray-300 text-sm font-medium mb-2">Top Category</h3>
                        <div className="flex justify-between items-center">
                          <p className="text-xl font-semibold text-gray-800 dark:text-white">
                            {analyticsData.topSellingCategories[0].name}
                          </p>
                          <p className="text-lg font-medium text-[#6366F1] dark:text-blue-400">
                            ${analyticsData.topSellingCategories[0].sales.toLocaleString()}
                          </p>
                        </div>
                        <div className="mt-2 h-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#6366F1] dark:bg-blue-500 rounded-full"
                            style={{
                              width: `${(analyticsData.topSellingCategories[0].sales / analyticsData.totalSales) * 100}%`
                            }}
                          ></div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Card className="neu-bg dark:bg-gray-700 shadow-neu border-none">
                    <CardContent className="p-6">
                      <h3 className="text-gray-500 dark:text-gray-300 text-sm font-medium mb-2">Monthly Sales Trend</h3>
                      <div className="h-80 mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={salesData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis 
                              dataKey="date" 
                              stroke="#6B7280" 
                              tick={{ fill: "#6B7280" }} 
                            />
                            <YAxis 
                              stroke="#6B7280" 
                              tick={{ fill: "#6B7280" }} 
                              tickFormatter={(value) => `$${value}`} 
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                              type="monotone"
                              dataKey="amount"
                              stroke="#6366F1"
                              strokeWidth={3}
                              activeDot={{ r: 8 }}
                              dot={{ r: 4, fill: "#6366F1" }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="categories">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="neu-bg dark:bg-gray-700 shadow-neu border-none">
                    <CardContent className="p-6">
                      <h3 className="text-gray-500 dark:text-gray-300 text-sm font-medium mb-2">Sales by Category</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={pieChartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                {pieChartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value) => `$${value}`} />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={analyticsData.topSellingCategories}
                              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                              <XAxis 
                                dataKey="name" 
                                stroke="#6B7280" 
                                tick={{ fill: "#6B7280" }} 
                                angle={-45}
                                textAnchor="end"
                              />
                              <YAxis 
                                stroke="#6B7280" 
                                tick={{ fill: "#6B7280" }} 
                                tickFormatter={(value) => `$${value}`} 
                              />
                              <Tooltip formatter={(value) => `$${value}`} />
                              <Bar dataKey="sales" fill="#6366F1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="transactions">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="neu-bg dark:bg-gray-700 shadow-neu border-none">
                    <CardContent className="p-6">
                      <h3 className="text-gray-500 dark:text-gray-300 text-sm font-medium mb-4">Recent Transactions</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="text-xs uppercase text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600">
                            <tr>
                              <th scope="col" className="px-4 py-3">ID</th>
                              <th scope="col" className="px-4 py-3">Date</th>
                              <th scope="col" className="px-4 py-3">Items</th>
                              <th scope="col" className="px-4 py-3">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {analyticsData.recentTransactions.map((transaction, index) => (
                              <motion.tr 
                                key={transaction.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="border-b border-gray-200 dark:border-gray-600"
                              >
                                <td className="px-4 py-3 font-medium">{transaction.id}</td>
                                <td className="px-4 py-3">{transaction.date}</td>
                                <td className="px-4 py-3">{transaction.items}</td>
                                <td className="px-4 py-3 font-medium text-[#6366F1] dark:text-blue-400">
                                  ${transaction.amount.toFixed(2)}
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}