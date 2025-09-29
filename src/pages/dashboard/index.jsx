import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { 
  FileText, 
  Archive, 
  TrendingUp, 
  Users, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Calendar,
  Filter,
  Search,
  Download,
  Plus,
  Globe,
  Activity,
  Target,
  BarChart3
} from 'lucide-react';

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Check if device is mobile and auto-collapse sidebar
  React.useEffect(() => {
    const checkMobile = () => {
      // Auto-collapse sidebar on mobile
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const stats = [
    { 
      label: 'Total Websites', 
      value: '09', 
      change: '+12%', 
      trend: 'up',
      icon: Globe,
      color: 'white',
      description: 'Active domains'
    },
    { 
      label: 'Active Websites', 
      value: '09', 
      change: '+5%', 
      trend: 'up',
      icon: Activity,
      color: 'white',
      description: 'Currently running'
    },
    { 
      label: 'Abandoned', 
      value: '47', 
      change: '-8%', 
      trend: 'down',
      icon: AlertCircle,
      color: 'white',
      description: 'Need attention'
    },
    { 
      label: 'Completion Rate', 
      value: '94.2%', 
      change: '+2.1%', 
      trend: 'up',
      icon: Target,
      color: 'white',
      description: 'Success rate'
    },
  ];

  const [recentRecords, setRecentRecords] = useState([]);
  const [abandonedRecords, setAbandonedRecords] = useState([]);
  const [signatureRecords, setSignatureRecords] = useState([]);
  const [abandonedSignatures, setAbandonedSignatures] = useState([]);

  // Formats ISO time to a simple relative string like "3 hours ago"
  const formatRelativeTime = (isoString) => {
    try {
      const now = new Date();
      const then = new Date(isoString);
      const diffMs = now - then;
      const minutes = Math.floor(diffMs / (1000 * 60));
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      if (minutes < 1) return 'just now';
      if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'} ago`;
      if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
      return `${days} day${days === 1 ? '' : 's'} ago`;
    } catch {
      return 'unknown';
    }
  };

  React.useEffect(() => {
    const loadStats = async () => {
      try {
        const [
          recordsRes,
          abandonedRes,
          signatureRes,
          signatureAbandonedRes
        ] = await Promise.all([
          fetch('https://skyscale-be.onrender.com/api/auth/get-stats/record').catch(() => null),
          fetch('https://skyscale-be.onrender.com/api/auth/get-stats/abandoned').catch(() => null),
          fetch('https://signature-backend-bm3q.onrender.com/api/auth/get-stats/record').catch(() => null),
          fetch('https://signature-backend-bm3q.onrender.com/api/auth/get-stats/abandoned').catch(() => null)
        ]);

        const [recordsJson, abandonedJson, signatureJson, signatureAbandonedJson] = await Promise.all([
          recordsRes ? recordsRes.json().catch(() => ({})) : ({}),
          abandonedRes ? abandonedRes.json().catch(() => ({})) : ({}),
          signatureRes ? signatureRes.json().catch(() => ({})) : ({}),
          signatureAbandonedRes ? signatureAbandonedRes.json().catch(() => ({})) : ({})
        ]);

        const toArray = (statsObj) => {
          const entries = Object.values(statsObj || {});
          return entries.map((s, idx) => ({
            id: `#REC-${String(idx + 1).padStart(3, '0')}`,
            title: s?.title ?? 'Untitled',
            count: Number(s?.count ?? 0),
            time: s?.lastOrderTime ? formatRelativeTime(s.lastOrderTime) : 'No orders yet',
            lastOrderTime: s?.lastOrderTime ?? null
          }));
        };

        const sortByCountDescThenTime = (a, b) => {
          if (b.count !== a.count) return b.count - a.count;
          const aTime = a.lastOrderTime ? new Date(a.lastOrderTime).getTime() : 0;
          const bTime = b.lastOrderTime ? new Date(b.lastOrderTime).getTime() : 0;
          return bTime - aTime;
        };

        const recent = toArray(recordsJson?.stats).sort(sortByCountDescThenTime);
        const abandoned = toArray(abandonedJson?.stats).sort(sortByCountDescThenTime);
        const signatures = toArray(signatureJson?.stats).sort(sortByCountDescThenTime);
        const signaturesAbandoned = toArray(signatureAbandonedJson?.stats).sort(sortByCountDescThenTime);

        setRecentRecords(recent);
        setAbandonedRecords(abandoned);
        setSignatureRecords(signatures);
        setAbandonedSignatures(signaturesAbandoned);
      } catch (err) {
        console.error('Failed to load stats', err);
      }
    };

    loadStats();
  }, []);


  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <main className="flex-1 overflow-auto scrollbar-thin">
        {/* Header */}
        <header className="sticky top-0 z-10 glass-effect border-b border-border">
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-2xl font-bold truncate">Dashboard</h1>
              <p className="text-sm text-muted-foreground hidden sm:block">Welcome back! Here's your overview.</p>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <Button size="sm" className="hidden sm:flex">
                <Plus className="w-4 h-4 mr-2" />
                New Record
              </Button>
              <Button size="sm" className="sm:hidden">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
          {isLoading ? (
            <div className="min-h-[40vh] flex items-center justify-center">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-6 h-6 rounded-full border-2 border-muted-foreground border-t-transparent animate-spin" />
                <p className="text-sm text-muted-foreground">Loading...</p>
              </div>
            </div>
          ) : isAuthenticated && user?.role?.toLowerCase() === 'admin' ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 animate-fade-in">
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  const colorClasses = {
                    white: 'from-white to-white border-gray-200'
                  };
                  const iconColorClasses = {
                    white: 'text-black bg-gray-100'
                  };
                  
                  return (
                    <Card 
                      key={index} 
                      className={`group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 animate-scale-in border shadow-sm bg-gradient-to-br ${colorClasses[stat.color]} cursor-pointer`} 
                      style={{animationDelay: `${index * 0.1}s`}}
                    >
                      <CardContent className="p-4 md:p-6">
                        <div className="flex flex-col space-y-3">
                          <div className="flex items-center justify-between">
                            <div className={`p-2 rounded-lg ${iconColorClasses[stat.color]}`}>
                              <IconComponent className="w-4 h-4 md:w-5 md:h-5" />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-medium ${
                              stat.trend === 'up' ? 'text-black' : 'text-gray-600'
                            }`}>
                              <TrendingUp className={`w-3 h-3 ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
                              <span className="whitespace-nowrap">{stat.change}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <p className="text-xs md:text-sm font-medium text-gray-600">{stat.label}</p>
                            <p className="text-xl md:text-3xl font-bold tracking-tight text-black">{stat.value}</p>
                            <p className="text-xs text-gray-500">{stat.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 animate-slide-up">
                <Card className="group hover:shadow-xl hover:scale-[1.01] transition-all duration-300 border border-gray-200 bg-white shadow-lg">
                  <CardHeader className="pb-4 md:pb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-100 rounded-xl flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                          <FileText className="w-6 h-6 md:w-7 md:h-7 text-black" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-xl md:text-2xl font-bold truncate text-black">
                            Show Records
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-600 mt-1">
                            View and manage all active records
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-gray-100 text-black border-gray-200 self-start sm:self-auto whitespace-nowrap font-medium px-3 py-1">
                        {recentRecords.length} Recent
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      {recentRecords.map((record, index) => (
                        <div 
                          key={record.id} 
                          className="group/record flex items-center justify-between p-3 md:p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 cursor-pointer hover:shadow-sm"
                          style={{animationDelay: `${index * 0.1}s`}}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                              <CheckCircle2 className="w-4 h-4 text-black" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-sm text-black truncate group-hover/record:text-gray-700 transition-colors">
                                {record.title}
                              </p>
                              <p className="text-xs text-gray-600 truncate">
                                <span className="inline sm:hidden">{record.id}</span>
                                <span className="hidden sm:inline">{record.id} • {record.time}</span>
                              </p>
                              <p className="text-xs text-gray-600 font-medium truncate sm:hidden">{record.time}</p>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button 
                      className="w-full group/btn bg-black hover:bg-gray-800 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 py-6" 
                      onClick={() => navigate('/records')}
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View All Records
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-xl hover:scale-[1.01] transition-all duration-300 border border-gray-200 bg-white shadow-lg">
                  <CardHeader className="pb-4 md:pb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-100 rounded-xl flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                          <Archive className="w-6 h-6 md:w-7 md:h-7 text-black" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-xl md:text-2xl font-bold truncate text-black">
                            Abandoned Records
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-600 mt-1">
                            Review records that need attention
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-gray-100 text-black border-gray-200 self-start sm:self-auto whitespace-nowrap font-medium px-3 py-1">
                        {abandonedRecords.length} Pending
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      {abandonedRecords.map((record, index) => (
                        <div 
                          key={record.id} 
                          className="group/record flex items-center justify-between p-3 md:p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 cursor-pointer hover:shadow-sm"
                          style={{animationDelay: `${index * 0.1}s`}}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                              <AlertCircle className="w-4 h-4 text-black" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-sm text-black truncate group-hover/record:text-gray-700 transition-colors">
                                {record.title}
                              </p>
                              <p className="text-xs text-gray-600 truncate">
                                <span className="inline sm:hidden">{record.id}</span>
                                <span className="hidden sm:inline">{record.id} • {record.time}</span>
                              </p>
                              <p className="text-xs text-gray-600 font-medium truncate sm:hidden">{record.time}</p>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      className="w-full group/btn bg-black hover:bg-gray-800 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 py-6" 
                      onClick={() => navigate('/abandoned')}
                    >
                      <Archive className="w-4 h-4 mr-2" />
                      Review Abandoned Records
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 animate-slide-up">
                <Card className="group hover:shadow-xl hover:scale-[1.01] transition-all duration-300 border border-gray-200 bg-white shadow-lg">
                  <CardHeader className="pb-4 md:pb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-100 rounded-xl flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                          <FileText className="w-6 h-6 md:w-7 md:h-7 text-black" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-xl md:text-2xl font-bold truncate text-black">
                            Signature Records
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-600 mt-1">
                            View and manage all signatures
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-gray-100 text-black border-gray-200 self-start sm:self-auto whitespace-nowrap font-medium px-3 py-1">
                        {signatureRecords.length} Recent
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      {signatureRecords.map((record, index) => (
                        <div 
                          key={record.id} 
                          className="group/record flex items-center justify-between p-3 md:p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 cursor-pointer hover:shadow-sm"
                          style={{animationDelay: `${index * 0.1}s`}}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                              <CheckCircle2 className="w-4 h-4 text-black" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-sm text-black truncate group-hover/record:text-gray-700 transition-colors">
                                {record.title}
                              </p>
                              <p className="text-xs text-gray-600 truncate">
                                <span className="inline sm:hidden">{record.id}</span>
                                <span className="hidden sm:inline">{record.id} • {record.time}</span>
                              </p>
                              <p className="text-xs text-gray-600 font-medium truncate sm:hidden">{record.time}</p>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button 
                      className="w-full group/btn bg-black hover:bg-gray-800 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 py-6" 
                      onClick={() => navigate('/records')}
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View All Records
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-xl hover:scale-[1.01] transition-all duration-300 border border-gray-200 bg-white shadow-lg">
                  <CardHeader className="pb-4 md:pb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-100 rounded-xl flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                          <Archive className="w-6 h-6 md:w-7 md:h-7 text-black" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-xl md:text-2xl font-bold truncate text-black">
                            Abandoned Signatures
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-600 mt-1">
                            Review signatures that need attention
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-gray-100 text-black border-gray-200 self-start sm:self-auto whitespace-nowrap font-medium px-3 py-1">
                        {abandonedSignatures.length} Pending
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      {abandonedSignatures.map((record, index) => (
                        <div 
                          key={record.id} 
                          className="group/record flex items-center justify-between p-3 md:p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 cursor-pointer hover:shadow-sm"
                          style={{animationDelay: `${index * 0.1}s`}}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                              <AlertCircle className="w-4 h-4 text-black" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-sm text-black truncate group-hover/record:text-gray-700 transition-colors">
                                {record.title}
                              </p>
                              <p className="text-xs text-gray-600 truncate">
                                <span className="inline sm:hidden">{record.id}</span>
                                <span className="hidden sm:inline">{record.id} • {record.time}</span>
                              </p>
                              <p className="text-xs text-gray-600 font-medium truncate sm:hidden">{record.time}</p>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button 
                      className="w-full group/btn bg-black hover:bg-gray-800 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 py-6" 
                      onClick={() => navigate('/abandoned')}
                    >
                      <Archive className="w-4 h-4 mr-2" />
                      View All Abandoned
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <div className="max-w-xl mx-auto">
              <Card className="border border-gray-200 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Hi{user?.email ? `, ${user.email}` : ''} 👋</CardTitle>
                  <CardDescription>Welcome back! Choose where to go next.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-3">
                  <Button className="flex-1" onClick={() => navigate('/records')}>
                    Go to Records
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => navigate('/abandoned')}>
                    Go to Abandoned
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
