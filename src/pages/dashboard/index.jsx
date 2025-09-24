import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Sidebar from '@/components/Sidebar';
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
  Plus
} from 'lucide-react';

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

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

  const stats = [
    { label: 'Total Website', value: '09', change: '+12%', trend: 'up' },
    { label: 'Active Websites', value: '09', change: '+5%', trend: 'up' },
    { label: 'Abandoned', value: '47', change: '-8%', trend: 'down' },
    { label: 'Completion Rate', value: '94.2%', change: '+2.1%', trend: 'up' },
  ];

  const recentRecords = [
      { id: '#REC-045', title: 'Astra Soul', website: 'https://astrasoul.in/', time: '3 hours ago' },
      { id: '#REC-046', title: 'AstraSoul Love', website: 'https://astrasoul.in/love-record', time: '5 hours ago' },
      { id: '#REC-047', title: 'Signature Main', website: 'https://astrasoul.in/signature/', time: '1 day ago' },
      { id: '#REC-048', title: 'Easy Astro', website: 'https://www.easyastro.in/', time: '1 day ago' },
  ];

  const abandonedRecords = [
    { id: '#REC-045', title: 'Astra Soul', website: 'https://astrasoul.in/', time: '3 hours ago' },
    { id: '#REC-046', title: 'AstraSoul Love', website: 'https://astrasoul.in/love-record', time: '5 hours ago' },
    { id: '#REC-047', title: 'Signature Main', website: 'https://astrasoul.in/signature/', time: '1 day ago' },
    { id: '#REC-048', title: 'Easy Astro', website: 'https://www.easyastro.in/', time: '1 day ago' },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'pending': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  // Removed unused getStatusBadge function

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
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 animate-fade-in">
            {stats.map((stat, index) => (
              <Card key={index} className="hover:shadow-lg hover:scale-105 transition-all duration-300 animate-scale-in border-0 shadow-sm bg-gradient-to-br from-card to-card/50" style={{animationDelay: `${index * 0.1}s`}}>
                <CardContent className="p-3 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
                    <div className="flex-1">
                      <p className="text-xs md:text-sm font-medium text-muted-foreground truncate">{stat.label}</p>
                      <p className="text-lg md:text-2xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`flex items-center gap-1 text-xs md:text-sm self-start md:self-auto ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendingUp className={`w-3 h-3 md:w-4 md:h-4 ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
                      <span className="whitespace-nowrap">{stat.change}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 animate-slide-up">
            <Card className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50/50 to-card shadow-md">
              <CardHeader className="pb-3 md:pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                      <FileText className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg md:text-xl truncate">Show Records</CardTitle>
                      <CardDescription className="text-sm hidden sm:block">View and manage all active records</CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 self-start sm:self-auto whitespace-nowrap">
                    {recentRecords.length} Recent
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 md:space-y-3">
                  {recentRecords.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-2 md:p-3 rounded-lg border bg-card/50 hover:bg-card transition-colors">
                      <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                        {getStatusIcon(record.status)}
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate">{record.title}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            <span className="inline sm:hidden">{record.id}</span>
                            <span className="hidden sm:inline">{record.id} • {record.time}</span>
                          </p>
                          <p className="text-xs text-muted-foreground truncate sm:hidden">{record.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full group" variant="default" onClick={() => navigate('/records')}>
                  View All Records
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-l-4 border-l-red-500 bg-gradient-to-br from-red-50/50 to-card shadow-md">
              <CardHeader className="pb-3 md:pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
                      <Archive className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg md:text-xl truncate">Abandoned Records</CardTitle>
                      <CardDescription className="text-sm hidden sm:block">Review records that need attention</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 md:space-y-3">
                  {abandonedRecords.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-2 md:p-3 rounded-lg border bg-card/50 hover:bg-card transition-colors">
                      <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate">{record.title}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            <span className="inline sm:hidden">{record.id}</span>
                            <span className="hidden sm:inline">{record.id} • {record.time}</span>
                          </p>
                          <p className="text-xs text-muted-foreground truncate sm:hidden">{record.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button className="w-full group" variant="destructive" onClick={() => navigate('/abandoned')}>
                  Review Abandoned Records
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
