import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
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
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [websiteParam, setWebsiteParam] = useState('');
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

  // Read website from query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const websiteFromQuery = params.get('website');
    if (websiteFromQuery) {
      setWebsiteParam(websiteFromQuery);
    }
  }, [location.search]);

  const recordDetails = {
    id: id || '#REC-045',
    website: websiteParam || 'easyastro.in',
    domain: websiteParam || 'easyastro.in',
    title: 'Order Details',
    reason: '',
    description: 'A place to view the details of the orders',
    abandonedAt: '2024-09-24T10:30:00Z',
    severity: 'N/A',
    category: 'N/A'
  };

  // Check if this is a signature record
  const isSignatureRecord = id === "rag" || id === "lander42" || id === "lander4" || id === "signature";
  
  // Check if user is admin
  const isAdmin = user?.role?.toLowerCase() === 'admin';

  // Fetch order data from API
  const fetchOrderData = useCallback(async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      setError(null);
      let url = "";

      if (id === "rag" || id === "lander42" || id === "rag-v2" || id === "lander5") {
        if (id === "lander42") {
          url = `https://signature-backend-x93b.onrender.com/api/lander4/get-orders/main?page=${page}&limit=${limit}`;
        } else if (id === "rag-v2") {
          url = `https://signature-backend-x93b.onrender.com/api/signature/rag-v2/get-orders/main?page=${page}&limit=${limit}`;
        } else if (id === "lander5") {
          url = `https://signature-backend-x93b.onrender.com/api/signature/lander5/get-orders/main?page=${page}&limit=${limit}`;
        } else {
          url = `https://signature-backend-x93b.onrender.com/api/signature/${id}/get-orders/main?page=${page}&limit=${limit}`;
        }
      } else {
        url = `https://skyscale-be-cr0i.onrender.com/api/${id}/get-order/main?page=${page}&limit=${limit}`;
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
        profession: order.profession || null,
        additionalProducts: Array.isArray(order.additionalProducts) 
          ? (order.additionalProducts.length > 0 ? order.additionalProducts.join(', ') : null)
          : (order.additionalProducts || null),
        products: order.products || order.items || null,
        amount: order.amount ? `₹${parseFloat(order.amount).toFixed(2)}` : '₹0.00',
        orderDate: order.orderDate || order.createdAt || new Date().toISOString(),
        dob: order.dob || null,
        gender: order.gender || null,
        placeOfBirth: order.placeOfBirth || null,
        remarks: order.remarks || null,
        razorpayPaymentId: order.razorpayPaymentId,
        // Preserve boolean false; don't coerce with || null
        deliveryStatusEmail: order.deliveryStatusEmail,
        // Normalize to display string
        isEmailSent: (typeof order.deliveryStatusEmail === 'boolean')
          ? (order.deliveryStatusEmail ? 'Yes' : 'No')
          : (typeof order.deliveryStatusEmail === 'string')
            ? (order.deliveryStatusEmail.toLowerCase() === 'yes' ? 'Yes' : order.deliveryStatusEmail.toLowerCase() === 'no' ? 'No' : 'N/A')
            : 'N/A',
        mongoId: order._id || order.id || null,
        hasBackendData: order.deliveryStatusEmail !== undefined
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
      filtered = filtered.filter(order => {
        const searchLower = searchQuery.toLowerCase();
        const baseMatch = 
          order.name.toLowerCase().includes(searchLower) ||
          order.email.toLowerCase().includes(searchLower) ||
          order.orderId.toLowerCase().includes(searchLower) ||
          order.phone.includes(searchQuery) ||
          (order.additionalProducts && order.additionalProducts.toLowerCase().includes(searchLower)) ||
          order.isEmailSent.toLowerCase().includes(searchLower);
        
        if (isSignatureRecord) {
          return baseMatch ||
            (order.profession && order.profession.toLowerCase().includes(searchLower)) ||
            (order.remarks && order.remarks.toLowerCase().includes(searchLower));
        } else {
          return baseMatch ||
            (order.placeOfBirth && order.placeOfBirth.toLowerCase().includes(searchLower)) ||
            (order.gender && order.gender.toLowerCase().includes(searchLower)) ||
            (order.dob && order.dob.toLowerCase().includes(searchLower));
        }
      });
    }

    return filtered;
  }, [orderData, dateFilter, customDateRange, searchQuery, isSignatureRecord]);

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
    const headers = isSignatureRecord 
      ? ['Order ID', 'Name', 'Email', 'Phone', 'Profession', 'Remarks', 'Additional Products', ...(isAdmin ? ['Amount'] : []), 'Order Date', 'Email Sent']
      : ['Order ID', 'Name', 'Email', 'Phone', 'Gender', 'DOB', 'Place of Birth', 'Additional Products', ...(isAdmin ? ['Amount'] : []), 'Order Date', 'Email Sent'];
    
    const csvContent = [
      headers.join(','),
      ...filteredData.map(order => {
        if (isSignatureRecord) {
          return [
            order.orderId,
            `"${order.name}"`,
            order.email,
            order.phone,
            `"${order.profession || 'N/A'}"`,
            `"${order.remarks || 'N/A'}"`,
            `"${order.additionalProducts || 'N/A'}"`,
            ...(isAdmin ? [order.amount] : []),
            new Date(order.orderDate).toLocaleDateString(),
            order.isEmailSent
          ].join(',');
        } else {
          return [
            order.orderId,
            `"${order.name}"`,
            order.email,
            order.phone,
            `"${order.gender || 'N/A'}"`,
            `"${order.dob || 'N/A'}"`,
            `"${order.placeOfBirth || 'N/A'}"`,
            `"${order.additionalProducts || 'N/A'}"`,
            ...(isAdmin ? [order.amount] : []),
            new Date(order.orderDate).toLocaleDateString(),
            order.isEmailSent
          ].join(',');
        }
      })
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
      year: '2-digit',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDOB = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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

  // Function to send webhook with full order info
  const handleYesClick = async (order) => {
    try {
      await fetch('https://automations.chatsonway.com/webhook/69254b511b9845c02d55251a', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recordId: id,
          website: websiteParam || null,
          orderId: order.orderId,
          name: order.name,
          email: order.email,
          phone: order.phone,
          profession: order.profession,
          remarks: order.remarks,
          additionalProducts: order.additionalProducts,
          amount: order.amount.replace('₹', '').replace(/,/g, ''),
          orderDate: order.orderDate,
          emailSent: true,
          dob: order.dob,
          gender: order.gender,
          placeOfBirth: order.placeOfBirth,
        }),
      });

      console.log('Webhook sent successfully for order:', order.orderId);
    } catch (error) {
      console.error('Error sending webhook for order:', order.orderId, error);
    }
  };

  // Function to mark email status as "no"
  const markEmailStatusAsNo = async (mongoId) => {
    if (!mongoId) {
      console.error('No MongoDB ID provided');
      return;
    }

    try {
      const response = await fetch(`https://skyscale-be-cr0i.onrender.com/api/${id}/delivery-status/${mongoId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deliveryStatusEmail: false
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update the local state to reflect the change
      setOrderData(prevData => 
        prevData.map(order => 
          order.mongoId === mongoId 
            ? { ...order, deliveryStatusEmail: false, isEmailSent: 'No' }
            : order
        )
      );

      console.log('Email status updated successfully');
    } catch (error) {
      console.error('Error updating email status:', error);
      // You might want to show a toast notification here
    }
  };

  // Function to mark email status as "yes" (and send webhook for that order)
  const markEmailStatusAsYes = async (mongoId) => {
    if (!mongoId) {
      console.error('No MongoDB ID provided');
      return;
    }

    // Find the order in local state so we can send full info
    const orderToSend = orderData.find(order => order.mongoId === mongoId);
    if (orderToSend) {
      // Fire and forget; if this fails, we still update status
      handleYesClick(orderToSend);
    }

    try {
      const response = await fetch(`https://skyscale-be-cr0i.onrender.com/api/${id}/delivery-status/${mongoId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deliveryStatusEmail: true
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update the local state to reflect the change
      setOrderData(prevData => 
        prevData.map(order => 
          order.mongoId === mongoId 
            ? { ...order, deliveryStatusEmail: true, isEmailSent: 'Yes' }
            : order
        )
      );

      console.log('Email status updated successfully');
    } catch (error) {
      console.error('Error updating email status:', error);
      // You might want to show a toast notification here
    }
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
                <span className="inline sm:hidden">{recordDetails.website}</span>
                  <span className="hidden sm:inline">
                    {recordDetails.website}
                  </span>
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
                {isAdmin && (
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
                )}
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
                    placeholder={
                      isMobile 
                        ? "Search orders..." 
                        : isSignatureRecord 
                          ? "Search by name, email, order ID, profession, remarks, additional products, or email status..." 
                          : "Search by name, email, order ID, gender, DOB, place of birth, additional products, or email status..."
                    }
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
                    `Showing ${filteredData.length} orders`
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <div className="min-w-full">
                    <table className="w-full table-auto">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-3 font-medium whitespace-nowrap">Order ID</th>
                        <th className="text-left p-3 font-medium whitespace-nowrap">Name</th>
                        <th className="text-left p-3 font-medium whitespace-nowrap">Email</th>
                        <th className="text-left p-3 font-medium whitespace-nowrap">Phone</th>
                        {isSignatureRecord ? (
                          <>
                            <th className="text-left p-3 font-medium whitespace-nowrap">Profession</th>
                            <th className="text-left p-3 font-medium whitespace-nowrap">Remarks</th>
                          </>
                        ) : (
                          <>
                            <th className="text-left p-3 font-medium whitespace-nowrap">Gender</th>
                            <th className="text-left p-3 font-medium whitespace-nowrap">DOB</th>
                            <th className="text-left p-3 font-medium whitespace-nowrap">Place of Birth</th>
                          </>
                        )}
                        <th className="text-left p-3 font-medium whitespace-nowrap">Additional Products</th>
                        {isAdmin && <th className="text-left p-3 font-medium whitespace-nowrap">Amount</th>}
                        <th className="text-left p-3 font-medium whitespace-nowrap">Order Date</th>
                        <th className="text-left p-3 font-medium whitespace-nowrap">Email Sent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((order) => (
                        <tr key={order.orderId} className="border-b border-border/50 hover:bg-muted/50">
                          <td className="p-3">
                            <span className="font-mono text-sm text-blue-600 whitespace-nowrap">{order.orderId}</span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                              <span className="font-medium whitespace-nowrap">{order.name}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                              <span className="text-sm whitespace-nowrap">{order.email}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="text-sm whitespace-nowrap">{order.phone}</span>
                          </td>
                          {isSignatureRecord ? (
                            <>
                              <td className="p-3">
                                <span
                                  className="text-sm text-muted-foreground whitespace-nowrap"
                                  title={order.profession || 'N/A'}
                                >
                                  {order.profession || 'N/A'}
                                </span>
                              </td>
                              <td className="p-3 max-w-xs">
                                <span
                                  className="text-sm text-muted-foreground break-words whitespace-pre-wrap"
                                  title={order.remarks || 'N/A'}
                                >
                                  {order.remarks || 'N/A'}
                                </span>
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="p-3">
                                <span className="text-sm text-muted-foreground whitespace-nowrap">{order.gender || 'N/A'}</span>
                              </td>
                              <td className="p-3">
                                <span className="text-sm text-muted-foreground whitespace-nowrap">{formatDOB(order.dob)}</span>
                              </td>
                              <td className="p-3">
                                <span className="text-sm text-muted-foreground whitespace-nowrap" title={order.placeOfBirth || 'N/A'}>{order.placeOfBirth || 'N/A'}</span>
                              </td>
                            </>
                          )}
                          <td className="p-3">
                            {order.additionalProducts ? (
                              <div className="flex flex-wrap gap-1">
                                {order.additionalProducts.split(',').map((product, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {product.trim()}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">N/A</span>
                            )}
                          </td>
                          {isAdmin && (
                            <td className="p-3">
                              <span className="font-bold text-green-600 whitespace-nowrap">{order.amount}</span>
                            </td>
                          )}
                          <td className="p-3">
                            <span className="text-sm text-muted-foreground whitespace-nowrap">{formatDate(order.orderDate)}</span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              {order.isEmailSent === 'Yes' ? (
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant="default"
                                    className="bg-green-100 text-green-800 border-green-200"
                                  >
                                    Yes
                                  </Badge>
                                  {order.hasBackendData && order.mongoId && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => markEmailStatusAsNo(order.mongoId)}
                                      className="h-6 px-2 text-xs"
                                    >
                                      Mark No
                                    </Button>
                                  )}
                                </div>
                              ) : order.isEmailSent === 'No' ? (
                                <div className="flex items-center gap-2">
                                  <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
                                    No
                                  </Badge>
                                  {order.hasBackendData && order.mongoId && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => markEmailStatusAsYes(order.mongoId)}
                                      className="h-6 px-2 text-xs"
                                    >
                                      Mark Yes
                                    </Button>
                                  )}
                                </div>
                              ) : (
                                <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-gray-200">
                                  N/A
                                </Badge>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    </table>
                  </div>
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
                        {isAdmin && <span className="font-bold text-green-600">{order.amount}</span>}
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
                        
                        {isSignatureRecord ? (
                          <>
                            {order.profession && (
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground font-medium">Profession:</p>
                                <p className="text-sm text-muted-foreground">{order.profession}</p>
                              </div>
                            )}
                            
                            {order.remarks && (
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground font-medium">Remarks:</p>
                                <p className="text-sm text-muted-foreground break-words whitespace-pre-wrap">{order.remarks}</p>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            {order.dob && (
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                <span className="text-sm text-muted-foreground">DOB: {formatDOB(order.dob)}</span>
                              </div>
                            )}
                            
                            {order.gender && (
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                <span className="text-sm text-muted-foreground">Gender: {order.gender}</span>
                              </div>
                            )}
                            
                            {order.placeOfBirth && (
                              <div className="flex items-center gap-2">
                                <Package className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                <span className="text-sm text-muted-foreground">Place: {order.placeOfBirth}</span>
                              </div>
                            )}
                          </>
                        )}
                        
                        {order.additionalProducts && (
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground font-medium">Additional Products:</p>
                            <div className="flex flex-wrap gap-1">
                              {order.additionalProducts.split(',').map((product, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {product.trim()}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 pt-1">
                          <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-xs text-muted-foreground">{formatDate(order.orderDate)}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-xs text-muted-foreground font-medium">Email Sent:</span>
                            {order.isEmailSent === 'Yes' ? (
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="default"
                                  className="bg-green-100 text-green-800 border-green-200 text-xs"
                                >
                                  Yes
                                </Badge>
                                {order.hasBackendData && order.mongoId && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => markEmailStatusAsNo(order.mongoId)}
                                    className="h-5 px-2 text-xs"
                                  >
                                    Mark No
                                  </Button>
                                )}
                              </div>
                            ) : order.isEmailSent === 'No' ? (
                              <div className="flex items-center gap-2">
                                <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200 text-xs">
                                  No
                                </Badge>
                                {order.hasBackendData && order.mongoId && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => markEmailStatusAsYes(order.mongoId)}
                                    className="h-5 px-2 text-xs"
                                  >
                                    Mark Yes
                                  </Button>
                                )}
                              </div>
                            ) : (
                              <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-gray-200 text-xs">
                                N/A
                              </Badge>
                            )}
                          </div>
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
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading chart data...
                    </div>
                  ) : (
                    "Daily revenue trend with interactive data points"
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 md:h-[28rem] p-2 md:p-4 overflow-x-auto">
                  {loading ? (
                    <div className="text-center">
                      <Loader2 className="w-10 h-10 md:w-12 md:h-12 animate-spin text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Loading chart data...
                      </p>
                    </div>
                  ) : chartData.length > 0 ? (
                    <div className="relative w-full h-full">
                      {/* Line Chart SVG */}
                      <svg
                        className="w-full h-full"
                        viewBox="0 0 800 350"
                        preserveAspectRatio="xMidYMid meet"
                      >
                        {/* Grid lines */}
                        <defs>
                          <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#e5e7eb" strokeWidth="0.5" opacity="0.3"/>
                          </pattern>
                          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3"/>
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.05"/>
                          </linearGradient>
                        </defs>
                        
                        <rect width="100%" height="100%" fill="url(#grid)" />
                        
                        {/* Calculate chart dimensions and scaling */}
                        {(() => {
                          const maxValue = Math.max(...chartData.map((d) => parseFloat(d.total)));
                          const minValue = Math.min(...chartData.map((d) => parseFloat(d.total)));
                          const valueRange = maxValue - minValue || 1;
                          const padding = 40;
                          const chartWidth = 800 - (padding * 2);
                          const chartHeight = 280 - (padding * 2);
                          const stepX = chartWidth / (chartData.length - 1);
                          
                          // Generate path for line
                          const points = chartData.map((day, index) => {
                            const x = padding + (index * stepX);
                            const y = padding + chartHeight - ((parseFloat(day.total) - minValue) / valueRange) * chartHeight;
                            return `${x},${y}`;
                          });
                          
                          const linePath = `M ${points.join(' L ')}`;
                          const areaPath = `${linePath} L ${padding + chartWidth},${padding + chartHeight} L ${padding},${padding + chartHeight} Z`;
                          
                          return (
                            <>
                              {/* Area under the line */}
                              <path
                                d={areaPath}
                                fill="url(#areaGradient)"
                                className="transition-all duration-500"
                              />
                              
                              {/* Line */}
                              <path
                                d={linePath}
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="transition-all duration-500"
                              />
                              
                              {/* Data points */}
                              {chartData.map((day, index) => {
                                const x = padding + (index * stepX);
                                const y = padding + chartHeight - ((parseFloat(day.total) - minValue) / valueRange) * chartHeight;
                                
                                return (
                                  <g key={day.date}>
                                    {/* Hover circle */}
                                    <circle
                                      cx={x}
                                      cy={y}
                                      r="6"
                                      fill="#10b981"
                                      className="opacity-0 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                                    />
                                    {/* Main circle */}
                                    <circle
                                      cx={x}
                                      cy={y}
                                      r="4"
                                      fill="#10b981"
                                      stroke="#ffffff"
                                      strokeWidth="2"
                                      className="transition-all duration-200 hover:r-6"
                                    />
                                    
                                    {/* Value label on hover */}
                                    <text
                                      x={x}
                                      y={y - 15}
                                      textAnchor="middle"
                                      className="text-xs font-medium fill-green-600 opacity-0 hover:opacity-100 transition-opacity duration-200"
                                      fontSize="12"
                                    >
                                      ₹{parseFloat(day.total).toFixed(0)}
                                    </text>
                                    
                                    {/* Date label - only show every few labels to prevent overlap */}
                                    {index % Math.max(1, Math.floor(chartData.length / 8)) === 0 && (
                                      <text
                                        x={x}
                                        y={padding + chartHeight + 25}
                                        textAnchor="middle"
                                        className="text-xs fill-gray-500"
                                        fontSize="10"
                                        style={{ 
                                          transform: 'rotate(-45deg)',
                                          transformOrigin: `${x}px ${padding + chartHeight + 25}px`
                                        }}
                                      >
                                        {new Date(day.date).toLocaleDateString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                        })}
                                      </text>
                                    )}
                                  </g>
                                );
                              })}
                              
                              {/* Y-axis labels */}
                              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                                const value = minValue + (valueRange * ratio);
                                const y = padding + chartHeight - (ratio * chartHeight);
                                
                                return (
                                  <g key={ratio}>
                                    <line
                                      x1={padding - 5}
                                      y1={y}
                                      x2={padding}
                                      y2={y}
                                      stroke="#d1d5db"
                                      strokeWidth="1"
                                    />
                                    <text
                                      x={padding - 10}
                                      y={y + 4}
                                      textAnchor="end"
                                      className="text-xs fill-gray-500"
                                      fontSize="10"
                                    >
                                      ₹{value.toFixed(0)}
                                    </text>
                                  </g>
                                );
                              })}
                            </>
                          );
                        })()}
                      </svg>
                      
                      {/* Chart summary */}
                      {isAdmin && (
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm border">
                          <div className="text-sm font-medium text-gray-700">Total Revenue</div>
                          <div className="text-lg font-bold text-green-600">₹{getTotalAmount()}</div>
                          <div className="text-xs text-gray-500">{chartData.length} days</div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center">
                      <BarChart3 className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-base md:text-lg font-medium mb-2">
                        No data to display
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Try adjusting your filter criteria
                      </p>
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
