import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Sidebar from '@/components/Sidebar';
import { 
  ArrowLeft,
  Download,
  Filter,
  Calendar,
  BarChart3,
  Table,
  Search,
  Clock,
  DollarSign,
  Package,
  User,
  Mail,
  Phone,
  AlertTriangle,
  TrendingUp,
  Loader2,
  RefreshCw
} from 'lucide-react';

const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dateFilter, setDateFilter] = useState('today');
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'chart'
  const [isMobile, setIsMobile] = useState(false);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [itemsPerPage] = useState(100000000);

  // Check if device is mobile
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-collapse sidebar on mobile
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const recordDetails = {
    id: id || '#REC-045',
    website: 'easyAstro.in',
    domain: 'easyastro.in',
    title: 'Account Verification Process',
    reason: 'Timeout',
    description: 'User verification process timed out after 15 minutes of inactivity',
    abandonedAt: '2024-09-24T10:30:00Z',
    severity: 'medium',
    category: 'Authentication'
  };

  // Fetch order data from API
  const fetchOrderData = useCallback(async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      setError(null);
      let url = "";

      if (id === "rag" || id === "lander42") {
        if (id === "lander42") {
          url = `https://signature-backend-bm3q.onrender.com/api/lander4/get-orders/main?page=${page}&limit=${limit}`;
        } else {
          url = `https://signature-backend-bm3q.onrender.com/api/signature/${id}/get-orders/main?page=${page}&limit=${limit}`;
        }
      } else {
        url = `https://skyscale-be.onrender.com/api/${id}/get-order/main?page=${page}&limit=${limit}`;
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Handle both old format (data.orders) and new signature format (data array)
      let ordersArray;
      if (Array.isArray(data)) {
        // New signature backend format - data is directly an array
        ordersArray = data;
      } else if (data.data && Array.isArray(data.data)) {
        // New signature format - data.data is an array
        ordersArray = data.data;
      } else if (data.data?.orders) {
        // Old format - data.data.orders contains the array
        ordersArray = data.data.orders;
      } else if (data.orders) {
        // Alternative old format - data.orders contains the array
        ordersArray = data.orders;
      } else {
        // Fallback to empty array
        ordersArray = [];
      }

      const transformedOrders = ordersArray.map((order, index) => ({
        orderId: order.abdOrderId || order.orderId || order._id || `ORD-${Date.now()}-${index + 1}`,
        name: order.fullName || order.name || order.customerName || 'N/A',
        email: order.email || order.customerEmail || 'N/A',
        phone: order.phoneNumber || order.phone || order.customerPhone || 'N/A',
        additionalProducts: Array.isArray(order.additionalProducts) 
          ? (order.additionalProducts.length > 0 ? order.additionalProducts.join(', ') : order.profession || 'Basic Plan')
          : (order.additionalProducts || order.profession || order.products || order.items || 'Basic Plan'),
        amount: order.amount ? `₹${parseFloat(order.amount).toFixed(2)}` : '₹0.00',
        orderDate: order.orderDate || order.createdAt || new Date().toISOString(),
        dob: order.dob || 'N/A',
        gender: order.gender || 'N/A',
        placeOfBirth: order.placeOfBirth || order.remarks || 'N/A',
        razorpayPaymentId: order.razorpayPaymentId
      }));
      
      setOrderData(transformedOrders);
      
      // Handle pagination data for both formats
      let totalCount = transformedOrders.length;
      let apiTotalPages = 1;
      let apiCurrentPage = page;

      if (Array.isArray(data) || (data.data && Array.isArray(data.data))) {
        // New signature format - assume single page for now
        totalCount = ordersArray.length;
        apiTotalPages = 1;
        apiCurrentPage = 1;
      } else {
        // Old format with pagination info
        totalCount = data.total || data.totalCount || data.count || transformedOrders.length;
        apiTotalPages = data.data?.totalPages || data.totalPages || Math.ceil(totalCount / limit);
        apiCurrentPage = parseInt(data.data?.currentPage || data.currentPage || page);
      }
      
      setTotalPages(apiTotalPages);
      setTotalOrders(totalCount);
      setCurrentPage(apiCurrentPage);
      
    } catch (err) {
      console.error('Error fetching order data:', err);
      setError(err.message || 'Failed to fetch order data');
      // Fallback to empty array on error
      setOrderData([]);
      setTotalPages(1);
      setTotalOrders(0);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Fetch data on component mount and when page or items per page changes
  useEffect(() => {
    fetchOrderData(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage, fetchOrderData]);

  // Filter data based on date range and search
  const filteredData = useMemo(() => {
    let filtered = [...orderData];

    // Apply date filter
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    switch (dateFilter) {
      case 'all':
        break;
      case 'yesterday':
        filtered = filtered.filter(order => {
          const orderDate = new Date(order.orderDate);
          return orderDate >= yesterday && orderDate < today;
        });
        break;
      case 'last7days':
        filtered = filtered.filter(order => {
          const orderDate = new Date(order.orderDate);
          return orderDate >= lastWeek;
        });
        break;
      case 'custom':
        if (customDateRange.start && customDateRange.end) {
          const startDate = new Date(customDateRange.start);
          const endDate = new Date(customDateRange.end);
          filtered = filtered.filter(order => {
            const orderDate = new Date(order.orderDate);
            return orderDate >= startDate && orderDate <= endDate;
          });
        }
        break;
      default:
        filtered = filtered.filter(order => {
          const orderDate = new Date(order.orderDate);
          return orderDate >= today;
        });
        break;
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.phone.includes(searchQuery) ||
        (order.placeOfBirth && order.placeOfBirth.toLowerCase().includes(searchQuery.toLowerCase())) ||
        order.additionalProducts.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [orderData, dateFilter, customDateRange, searchQuery]);

  // Calculate chart data
  const chartData = useMemo(() => {
    const dailyTotals = {};
    filteredData.forEach(order => {
      const date = new Date(order.orderDate).toISOString().split('T')[0];
      // Remove ₹ symbol and any commas, then parse as float
      const cleanAmount = order.amount.replace('₹', '').replace(/,/g, '');
      const amount = parseFloat(cleanAmount) || 0;
      dailyTotals[date] = (dailyTotals[date] || 0) + amount;
    });

    return Object.entries(dailyTotals).map(([date, total]) => ({
      date,
      total: total.toFixed(2)
    })).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [filteredData]);

  const exportToCSV = () => {
    const headers = ['Order ID', 'Name', 'Email', 'Phone', 'Place of Birth/Remarks', 'Gender', 'Products/Profession', 'Amount', 'Order Date'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(order => [
        order.orderId,
        `"${order.name}"`,
        order.email,
        order.phone,
        `"${order.placeOfBirth || 'N/A'}"`,
        order.gender || 'N/A',
        `"${order.additionalProducts}"`,
        order.amount,
        new Date(order.orderDate).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${recordDetails.id}-orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTotalAmount = () => {
    return filteredData.reduce((sum, order) => {
      // Remove ₹ symbol and any commas, then parse as float
      const cleanAmount = order.amount.replace('₹', '').replace(/,/g, '');
      const numericAmount = parseFloat(cleanAmount) || 0;
      return sum + numericAmount;
    }, 0).toFixed(2);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <main className="flex-1 overflow-auto scrollbar-thin">
        {/* Header */}
        <header className="sticky top-0 z-10 glass-effect border-b border-border">
          <div className="flex h-auto min-h-[64px] items-center justify-between px-4 md:px-6 py-3 md:py-0">
            <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg md:text-2xl font-bold truncate">Record Details</h1>
                <p className="text-sm text-muted-foreground truncate">
                  <span className="inline sm:hidden">{recordDetails.id}</span>
                  <span className="hidden sm:inline">{recordDetails.id} - {recordDetails.website}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => fetchOrderData(currentPage, itemsPerPage)}
                disabled={loading}
                className="hidden sm:flex"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => fetchOrderData(currentPage, itemsPerPage)}
                disabled={loading}
                className="sm:hidden"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setViewMode(viewMode === 'table' ? 'chart' : 'table')}
                className="hidden sm:flex"
              >
                {viewMode === 'table' ? (
                  <>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Chart View
                  </>
                ) : (
                  <>
                    <Table className="w-4 h-4 mr-2" />
                    Table View
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setViewMode(viewMode === 'table' ? 'chart' : 'table')}
                className="sm:hidden"
              >
                {viewMode === 'table' ? <BarChart3 className="w-4 h-4" /> : <Table className="w-4 h-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={exportToCSV} className="hidden sm:flex" disabled={loading || filteredData.length === 0}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm" onClick={exportToCSV} className="sm:hidden" disabled={loading || filteredData.length === 0}>
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Error State */}
          {error && (
            <Card className="border-0 shadow-sm border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-red-900">Failed to load order data</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-3 border-red-300 text-red-700 hover:bg-red-100"
                      onClick={() => fetchOrderData(currentPage, itemsPerPage)}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Retrying...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Try Again
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Record Summary */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-lg md:text-xl truncate">{recordDetails.title}</CardTitle>
                  <CardDescription className="text-sm">{recordDetails.description}</CardDescription>
                </div>
                <Badge variant="destructive" className="self-start sm:self-auto whitespace-nowrap">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  {recordDetails.reason}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-blue-50 rounded-lg">
                  <Package className="w-6 h-6 md:w-8 md:h-8 text-blue-600 flex-shrink-0" />
                  <div className="min-w-0">
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                        <p className="text-lg md:text-2xl font-bold text-blue-600">...</p>
                      </div>
                    ) : (
                      <p className="text-lg md:text-2xl font-bold text-blue-600">{filteredData.length}</p>
                    )}
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {loading ? 'Loading...' : 'Total Orders'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-green-50 rounded-lg">
                  <div className="min-w-0">
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-green-600" />
                        <p className="text-lg md:text-2xl font-bold text-green-600">...</p>
                      </div>
                    ) : (
                      <p className="text-lg md:text-2xl font-bold text-green-600 truncate">₹{getTotalAmount()}</p>
                    )}
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {loading ? 'Loading...' : 'Total Revenue'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-orange-50 rounded-lg">
                  <Clock className="w-6 h-6 md:w-8 md:h-8 text-orange-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-lg md:text-2xl font-bold text-orange-600 truncate">{recordDetails.category}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Category</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-red-50 rounded-lg">
                  <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-red-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-lg md:text-2xl font-bold text-red-600 capitalize">{recordDetails.severity}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Severity</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 md:p-4">
              <div className="flex flex-col gap-3 md:gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    placeholder={isMobile ? "Search orders..." : "Search by name, email, order ID, place, or products..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 flex-shrink-0"
                  >
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="last7days">Last 7 Days</option>
                    <option value="custom">Custom Range</option>
                    <option value="all">All</option>
                  </select>
                  
                  
                  {dateFilter === 'custom' && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      <input
                        type="date"
                        value={customDateRange.start}
                        onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                        className="px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 w-full sm:w-auto"
                      />
                      <span className="text-muted-foreground text-sm self-center">to</span>
                      <input
                        type="date"
                        value={customDateRange.end}
                        onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                        className="px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 w-full sm:w-auto"
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          {viewMode === 'table' ? (
            /* Table View */
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
                <CardDescription>
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading orders...
                    </div>
                  ) : (
                    `Showing ${((currentPage - 1) * itemsPerPage) + 1}-${Math.min(currentPage * itemsPerPage, totalOrders)} of ${totalOrders} orders`
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-3 font-medium">Order ID</th>
                        <th className="text-left p-3 font-medium">Name</th>
                        <th className="text-left p-3 font-medium">Email</th>
                        <th className="text-left p-3 font-medium">Phone</th>
                        <th className="text-left p-3 font-medium">Place of Birth/Remarks</th>
                        <th className="text-left p-3 font-medium">Products/Profession</th>
                        <th className="text-left p-3 font-medium">Amount</th>
                        <th className="text-left p-3 font-medium">Order Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((order) => (
                        <tr key={order.orderId} className="border-b border-border/50 hover:bg-muted/50">
                          <td className="p-3">
                            <span className="font-mono text-sm text-blue-600">{order.orderId}</span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium">{order.name}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">{order.email}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">{order.phone}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="text-sm text-muted-foreground">{order.placeOfBirth || 'N/A'}</span>
                          </td>
                          <td className="p-3">
                            <span className="text-sm text-muted-foreground">{order.additionalProducts}</span>
                          </td>
                          <td className="p-3">
                            <span className="font-bold text-green-600">{order.amount}</span>
                          </td>
                          <td className="p-3">
                            <span className="text-sm text-muted-foreground">{formatDate(order.orderDate)}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Loading State for Desktop */}
                {loading && (
                  <div className="hidden md:block text-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading orders...</p>
                  </div>
                )}
                
                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                  {filteredData.map((order) => (
                    <div key={order.orderId} className="border border-border rounded-lg p-4 space-y-3 hover:bg-muted/50">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm text-blue-600 font-medium">{order.orderId}</span>
                        <span className="font-bold text-green-600">{order.amount}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <span className="font-medium truncate">{order.name}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm text-muted-foreground truncate">{order.email}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{order.phone}</span>
                        </div>
                        
                        {order.placeOfBirth && (
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{order.placeOfBirth}</span>
                          </div>
                        )}
                        
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground font-medium">Products:</p>
                          <p className="text-sm text-muted-foreground">{order.additionalProducts}</p>
                        </div>
                        
                        <div className="flex items-center gap-2 pt-1">
                          <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-xs text-muted-foreground">{formatDate(order.orderDate)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Loading State for Mobile */}
                {loading && (
                  <div className="md:hidden text-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading orders...</p>
                  </div>
                )}
                
                {filteredData.length === 0 && !loading && (
                  <div className="text-center py-8 md:py-12">
                    <Package className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-base md:text-lg font-medium mb-2">No orders found</h3>
                    <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
                  </div>
                )}
                
                {/* Pagination Controls */}
                {!loading && totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6 pt-4 border-t border-border gap-4">
                    <div className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages} ({totalOrders} total orders)
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className="hidden sm:flex"
                      >
                        First
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      
                      {/* Page numbers */}
                      <div className="hidden sm:flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(pageNum)}
                              className="w-8 h-8 p-0"
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>
                      
                      <div className="sm:hidden text-sm text-muted-foreground px-2">
                        {currentPage} / {totalPages}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className="hidden sm:flex"
                      >
                        Last
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            /* Chart View */
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Revenue Chart</CardTitle>
                <CardDescription>
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading chart data...
                    </div>
                  ) : (
                    'Daily revenue overview'
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 md:h-96 flex items-end justify-center gap-1 md:gap-2 p-2 md:p-4 overflow-x-auto">
                  {loading ? (
                    <div className="text-center">
                      <Loader2 className="w-10 h-10 md:w-12 md:h-12 animate-spin text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Loading chart data...</p>
                    </div>
                  ) : chartData.length > 0 ? (
                    chartData.map((day) => {
                      const maxValue = Math.max(...chartData.map(d => parseFloat(d.total)));
                      const mobileHeight = (parseFloat(day.total) / maxValue) * 200; // Shorter on mobile
                      const desktopHeight = (parseFloat(day.total) / maxValue) * 300;
                      
                      return (
                        <div key={day.date} className="flex flex-col items-center gap-1 md:gap-2 flex-shrink-0">
                          <div className="text-xs font-medium text-green-600 whitespace-nowrap">
                            ₹{isMobile && day.total.length > 6 ? parseFloat(day.total).toFixed(0) : day.total}
                          </div>
                          <div
                            className="bg-gradient-to-t from-green-500 to-green-400 rounded-t-md transition-all duration-500 hover:from-green-600 hover:to-green-500"
                            style={{ 
                              height: `${Math.max(isMobile ? mobileHeight : desktopHeight, 20)}px`,
                              minWidth: isMobile ? '24px' : '40px',
                              width: isMobile ? '24px' : '40px'
                            }}
                          ></div>
                          <div className="text-xs text-muted-foreground transform -rotate-45 origin-bottom-left whitespace-nowrap">
                            {isMobile 
                              ? new Date(day.date).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })
                              : new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                            }
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center">
                      <BarChart3 className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-base md:text-lg font-medium mb-2">No data to display</h3>
                      <p className="text-sm text-muted-foreground">Try adjusting your filter criteria</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default DetailPage;
