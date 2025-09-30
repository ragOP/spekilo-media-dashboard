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
  Key, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Loader2,
  KeyRound,
  Shield,
  Eye,
  EyeOff,
  Copy,
  Calendar,
  Activity,
  AlertTriangle,
  FileText,
  MessageSquare
} from 'lucide-react';

const Passwords = () => {
  const [passwords, setPasswords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [passwordToDelete, setPasswordToDelete] = useState(null);
  const [showPasswords, setShowPasswords] = useState({});
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
    fetchPasswords();
  }, []);

  const fetchPasswords = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await fetch('https://skyscale-be.onrender.com/api/auth/get-passwords', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPasswords(data.passwords || data);
      } else {
        setError('Failed to fetch passwords');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (passwordId) => {
    setPasswordToDelete(passwordId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!passwordToDelete) return;

    try {
      const response = await fetch(`https://skyscale-be.onrender.com/api/auth/delete-password/${passwordToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setPasswords(prev => prev.filter(password => (password._id ?? password.id) !== passwordToDelete));
        setError('');
        fetchPasswords();
      } else {
        setError('Failed to delete password');
      }
    } catch {
      setError('Network error while deleting password');
    } finally {
      setDeleteDialogOpen(false);
      setPasswordToDelete(null);
    }
  };

  const togglePasswordVisibility = (passwordId) => {
    setShowPasswords(prev => ({
      ...prev,
      [passwordId]: !prev[passwordId]
    }));
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const filteredPasswords = passwords.filter(password => {
    const matchesSearch = password.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         password.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         password.remarks?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         password.others?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
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
            <p className="text-muted-foreground">Loading passwords...</p>
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
                <Key className="h-6 w-6" />
                Password Management
              </h1>
              <p className="text-sm text-muted-foreground hidden sm:block">
                Manage and secure your stored passwords
              </p>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <Button 
                onClick={() => navigate('/passwords/add')}
                className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white"
                size="sm"
              >
                <KeyRound className="h-4 w-4" />
                <span className="hidden sm:inline">Add New Password</span>
              </Button>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search passwords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Passwords Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPasswords.map((password) => (
              <Card key={password.id ?? password._id} className="border-2 border-border shadow-sm bg-gradient-to-br from-card to-card/50 hover:shadow-md transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{password.title}</CardTitle>
                      <CardDescription className="text-sm">
                        ID: {password.id}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/passwords/edit/${password._id ?? password.id}`)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(password._id ?? password.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {/* Password Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Password</label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 p-2 bg-muted/50 rounded border font-mono text-sm">
                        {showPasswords[password._id ?? password.id] ? password.password : '••••••••••••'}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePasswordVisibility(password._id ?? password.id)}
                        className="h-8 w-8 p-0"
                      >
                        {showPasswords[password._id ?? password.id] ? 
                          <EyeOff className="h-4 w-4" /> : 
                          <Eye className="h-4 w-4" />
                        }
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(password.password)}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Remarks Field */}
                  {password.remarks && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        Remarks
                      </label>
                      <p className="text-sm p-2 bg-muted/30 rounded border text-muted-foreground">
                        {password.remarks}
                      </p>
                    </div>
                  )}

                  {/* Others Field */}
                  {password.others && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        Others
                      </label>
                      <p className="text-sm p-2 bg-muted/30 rounded border text-muted-foreground">
                        {password.others}
                      </p>
                    </div>
                  )}

                  {/* Created Date */}
                  {password.createdAt && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2 border-t">
                      <Calendar className="h-3 w-3" />
                      <span>Created: {new Date(password.createdAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredPasswords.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Key className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No passwords found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first password'}
              </p>
              {!searchTerm && (
                <Button 
                  onClick={() => navigate('/passwords/add')}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  <KeyRound className="h-4 w-4 mr-2" />
                  Add First Password
                </Button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Password</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this password? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
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
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Passwords;
