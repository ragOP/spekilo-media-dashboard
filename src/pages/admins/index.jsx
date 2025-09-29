import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '../../components/ui/dialog';
import Sidebar from '../../components/Sidebar';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Loader2,
  UserPlus,
  Shield,
  Mail,
  Calendar,
  Activity,
  AlertTriangle
} from 'lucide-react';

const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await fetch('https://skyscale-be.onrender.com/api/auth/get-all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAdmins(data.users || data.admins || data); 
      } else {
        setError('Failed to fetch admins');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (adminId) => {
    setAdminToDelete(adminId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!adminToDelete) return;

    try {
      const response = await fetch(`https://skyscale-be.onrender.com/api/auth/delete/${adminToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Remove admin from local state
        setAdmins(admins.filter(admin => admin.id !== adminToDelete));
        setError(''); // Clear any previous errors
      } else {
        setError('Failed to delete admin');
      }
    } catch {
      setError('Network error while deleting admin');
    } finally {
      setDeleteDialogOpen(false);
      setAdminToDelete(null);
    }
  };

  const getRoleBadgeVariant = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'default';
      case 'signature':
        return 'secondary';
      case 'astro':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = admin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || admin.role?.toLowerCase() === filterRole.toLowerCase();
    return matchesSearch && matchesRole;
  });

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        <main className="flex-1 overflow-auto scrollbar-thin flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading admins...</p>
          </div>
        </main>
      </div>
    );
  }

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
              <h1 className="text-xl md:text-2xl font-bold truncate flex items-center gap-2">
                <Users className="h-6 w-6" />
                Admin Management
              </h1>
              <p className="text-sm text-muted-foreground hidden sm:block">
                Manage system administrators and their permissions
              </p>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <Button 
                onClick={() => navigate('/admins/register')}
                className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white"
                size="sm"
              >
                <UserPlus className="h-4 w-4" />
                <span className="hidden sm:inline">Add New Admin</span>
              </Button>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-6 space-y-4 md:space-y-6">

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 animate-fade-in">
          <Card className="hover:shadow-lg hover:scale-105 transition-all duration-300 animate-scale-in border border-gray-200 shadow-sm bg-white">
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Users className="h-5 w-5 md:h-6 md:w-6 text-black" />
                </div>
                <div>
                  <p className="text-lg md:text-2xl font-bold text-black">{admins.length}</p>
                  <p className="text-xs md:text-sm text-gray-600">Total Admins</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg hover:scale-105 transition-all duration-300 animate-scale-in border border-gray-200 shadow-sm bg-white">
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Shield className="h-5 w-5 md:h-6 md:w-6 text-black" />
                </div>
                <div>
                  <p className="text-lg md:text-2xl font-bold text-black">
                    {admins.filter(admin => admin.role?.toLowerCase() === 'signature').length}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600">Signature Admins</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg hover:scale-105 transition-all duration-300 animate-scale-in border border-gray-200 shadow-sm bg-white md:col-span-1 col-span-2">
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Shield className="h-5 w-5 md:h-6 md:w-6 text-black" />
                </div>
                <div>
                  <p className="text-lg md:text-2xl font-bold text-black">
                    {admins.filter(admin => admin.role?.toLowerCase() === 'astro').length}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600">Astro Admins</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardContent className="p-3 md:p-4">
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-4 h-4" />
                <input
                  type="text"
                  placeholder={isMobile ? "Search admins..." : "Search admins by name or email..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-gray-400/20 focus:border-gray-400"
                />
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="flex-1 md:flex-none px-3 py-2 border border-gray-200 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-gray-400/20 focus:border-gray-400"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="signature">Signature</option>
                  <option value="astro">Astro</option>
                </select>
                <Button variant="outline" onClick={fetchAdmins} size="sm" className="border-gray-200 text-black hover:bg-gray-50">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <p className="text-sm text-gray-600">
            Showing {filteredAdmins.length} of {admins.length} admins
          </p>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
            <Activity className="w-3 h-3 sm:w-4 sm:h-4" />
            Last updated: just now
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 text-sm text-gray-600 bg-gray-100 border border-gray-200 rounded-md">
            {error}
          </div>
        )}

        {/* Admins List */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 animate-fade-in">
          {filteredAdmins.map((admin, index) => (
            <Card 
              key={admin.id || admin._id} 
              className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200 shadow-md bg-white group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="h-5 w-5 text-black" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base md:text-lg group-hover:text-gray-700 transition-colors truncate text-black">
                        {admin.name || 'No Name'}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1 text-gray-600">
                        <Mail className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{admin.email}</span>
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="flex-shrink-0 bg-gray-100 text-black border-gray-200">
                    {admin.role || 'User'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/admins/update/${admin.id || admin._id}`)}
                    className="flex-1 group/btn text-sm border-gray-200 text-black hover:bg-gray-50"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    <span className="hidden sm:inline">Edit</span>
                    <span className="sm:hidden">Edit</span>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(admin.id || admin._id)}
                    className="flex-1 group/btn text-sm bg-black hover:bg-gray-800 text-white"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    <span className="hidden sm:inline">Delete</span>
                    <span className="sm:hidden">Del</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredAdmins.length === 0 && !isLoading && (
          <div className="text-center py-8 md:py-12 px-4">
            <Users className="w-10 h-10 md:w-12 md:h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-base md:text-lg font-medium mb-2 text-black">
              No admins found
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {searchTerm || filterRole !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by adding your first admin.'
              }
            </p>
            {(!searchTerm && filterRole === 'all') && (
              <Button onClick={() => navigate('/admins/register')} className="bg-black hover:bg-gray-800 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add First Admin
              </Button>
            )}
          </div>
        )}
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Admin
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this admin? This action cannot be undone.
              {adminToDelete && (
                <span className="block mt-2 text-sm font-medium">
                  Admin ID: {adminToDelete}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
            >
              Delete Admin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admins;
