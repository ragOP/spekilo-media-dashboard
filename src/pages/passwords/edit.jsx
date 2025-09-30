import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import Sidebar from '../../components/Sidebar';
import { 
  Key, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Lock, 
  Shield,
  Loader2,
  CheckCircle,
  Save,
  FileText,
  MessageSquare,
  AlertTriangle
} from 'lucide-react';

const PasswordEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    id: '',
    password: '',
    remarks: '',
    others: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Check if device is mobile
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

  useEffect(() => {
    if (id) {
      fetchPasswordData();
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchPasswordData = async () => {
    try {
      setIsLoadingPassword(true);
      setError('');
      
      const response = await fetch(`https://skyscale-be.onrender.com/api/auth/get-passwords`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const passwords = data.passwords || data;
        const password = passwords.find(p => (p._id ?? p.id) === id);
        
        if (password) {
          setFormData({
            title: password.title || '',
            id: password.id || '',
            password: password.password || '',
            remarks: password.remarks || '',
            others: password.others || ''
          });
        } else {
          setError('Password not found');
        }
      } else {
        setError('Failed to load password data');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoadingPassword(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.id.trim()) {
      setError('ID is required');
      return false;
    }
    if (!formData.password.trim()) {
      setError('Password is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      const updateData = {
        title: formData.title,
        id: formData.id,
        password: formData.password,
        remarks: formData.remarks,
        others: formData.others
      };

      const response = await fetch(`https://skyscale-be.onrender.com/api/auth/update-password/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/passwords');
        }, 2000);
      } else {
        setError(data.message || 'Update failed. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingPassword) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        <main className="flex-1 overflow-auto scrollbar-thin flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading password data...</p>
          </div>
        </main>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        <main className="flex-1 overflow-auto scrollbar-thin flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <h2 className="text-2xl font-bold">Password Updated Successfully!</h2>
            <p className="text-muted-foreground">Redirecting to password list...</p>
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
                Edit Password
              </h1>
              <p className="text-sm text-muted-foreground hidden sm:block">
                Update password information
              </p>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <Button
                variant="ghost"
                onClick={() => navigate('/passwords')}
                size="sm"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Back to Passwords</span>
              </Button>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-6">
          <div className="max-w-2xl mx-auto">

            <Card className="border-0 shadow-sm bg-gradient-to-br from-card to-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Password Information
                </CardTitle>
                <CardDescription>
                  Update the details for this password entry
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Error Display */}
                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm">{error}</span>
                    </div>
                  )}

                  {/* Title Field */}
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter password title (e.g., Gmail, Facebook, etc.)"
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>

                  {/* ID Field */}
                  <div className="space-y-2">
                    <label htmlFor="id" className="text-sm font-medium flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      ID *
                    </label>
                    <input
                      type="text"
                      id="id"
                      name="id"
                      value={formData.id}
                      onChange={handleInputChange}
                      placeholder="Enter unique identifier"
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter the password"
                        className="w-full px-3 py-2 pr-10 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remarks Field */}
                  <div className="space-y-2">
                    <label htmlFor="remarks" className="text-sm font-medium flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Remarks
                    </label>
                    <textarea
                      id="remarks"
                      name="remarks"
                      value={formData.remarks}
                      onChange={handleInputChange}
                      placeholder="Additional notes or comments"
                      rows={3}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Others Field */}
                  <div className="space-y-2">
                    <label htmlFor="others" className="text-sm font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Others
                    </label>
                    <textarea
                      id="others"
                      name="others"
                      value={formData.others}
                      onChange={handleInputChange}
                      placeholder="Any other relevant information"
                      rows={3}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/passwords')}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-black hover:bg-gray-800 text-white"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Update Password
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PasswordEdit;
