// Helper functions and mock data for POS system

export type UserRole = 'admin' | 'cashier';

export interface User {
  id: number;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface SalesData {
  date: string;
  amount: number;
}

export interface InventoryAlert {
  id: number;
  bookId: number;
  bookTitle: string;
  currentStock: number;
  threshold: number;
  severity: 'low' | 'critical';
}

// Mock current user
export const currentUser: User = {
  id: 1,
  name: 'John Doe',
  role: 'admin',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
};

// Mock sales data for charts
export const salesData: SalesData[] = [
  { date: 'Jan', amount: 1200 },
  { date: 'Feb', amount: 1900 },
  { date: 'Mar', amount: 1500 },
  { date: 'Apr', amount: 2100 },
  { date: 'May', amount: 2400 },
  { date: 'Jun', amount: 1800 },
  { date: 'Jul', amount: 2200 },
  { date: 'Aug', amount: 2600 },
  { date: 'Sep', amount: 2900 },
  { date: 'Oct', amount: 3100 },
  { date: 'Nov', amount: 2800 },
  { date: 'Dec', amount: 3300 }
];

// Mock inventory alerts
export const inventoryAlerts: InventoryAlert[] = [
  { 
    id: 1, 
    bookId: 3, 
    bookTitle: 'The Great Gatsby', 
    currentStock: 2, 
    threshold: 5, 
    severity: 'low' 
  },
  { 
    id: 2, 
    bookId: 5, 
    bookTitle: 'To Kill a Mockingbird', 
    currentStock: 1, 
    threshold: 5, 
    severity: 'critical' 
  },
  { 
    id: 3, 
    bookId: 8, 
    bookTitle: '1984', 
    currentStock: 3, 
    threshold: 5, 
    severity: 'low' 
  }
];

// Mock barcode scanning function
export const scanBarcode = (isbn: string) => {
  // In a real app, this would use the device camera and a barcode scanning library
  // For the demo, we'll just verify if the ISBN is valid and return the book info
  
  // Basic ISBN-13 validation (simple check, not comprehensive)
  const isValidISBN13 = /^97(8|9)\d{10}$/.test(isbn);
  
  if (!isValidISBN13) {
    return {
      success: false,
      error: 'Invalid ISBN-13 format'
    };
  }
  
  // In a real app, we would perform a lookup against the database
  // For the demo, we'll just generate a mock response
  return {
    success: true,
    book: {
      id: Math.floor(Math.random() * 1000), // Generate a random ID for the demo
      title: `Book with ISBN ${isbn}`,
      author: 'Scanned Author',
      isbn: isbn,
      price: parseFloat((Math.random() * 50 + 10).toFixed(2)),
      stock: Math.floor(Math.random() * 20),
      category: 'Scanned Books'
    }
  };
};

// Mock sales analytics data
export const getSalesAnalytics = () => {
  return {
    totalSales: 24500,
    growth: 15, // 15% growth compared to previous period
    topSellingCategories: [
      { name: 'Fiction', sales: 8500 },
      { name: 'Non-Fiction', sales: 6200 },
      { name: 'Science', sales: 4800 },
      { name: 'History', sales: 3500 },
      { name: 'Children', sales: 1500 }
    ],
    recentTransactions: [
      { id: 101, date: '2023-10-01', amount: 125.30, items: 3 },
      { id: 102, date: '2023-10-02', amount: 78.50, items: 2 },
      { id: 103, date: '2023-10-03', amount: 210.75, items: 5 },
      { id: 104, date: '2023-10-04', amount: 45.20, items: 1 },
      { id: 105, date: '2023-10-05', amount: 156.80, items: 4 }
    ]
  };
};

// Mock function to check user permissions
export const hasPermission = (user: User, permission: string): boolean => {
  // For the demo, we use a simple permission model:
  // Admins can do everything, cashiers have limited permissions
  const adminPermissions = [
    'view_reports', 
    'manage_inventory', 
    'manage_users', 
    'process_refunds',
    'view_sales',
    'process_sales'
  ];
  
  const cashierPermissions = [
    'process_sales',
    'view_inventory'
  ];
  
  if (user.role === 'admin') {
    return adminPermissions.includes(permission);
  } else if (user.role === 'cashier') {
    return cashierPermissions.includes(permission);
  }
  
  return false;
};