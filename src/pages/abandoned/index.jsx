import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Sidebar from "@/components/Sidebar";
import {
  Search,
  Download,
  Plus,
  AlertTriangle,
  TrendingDown,
  Clock,
  AlertCircle,
  XCircle,
  Activity,
  ArrowUpRight,
  MoreVertical,
  Eye,
  RotateCcw,
  Globe,
  ArrowLeft,
} from "lucide-react";

const Abandoned = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [currentView, setCurrentView] = useState('overview'); // 'overview' or category id

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

  // Abandoned records data grouped by categories with role-based access
  const abandonedCategories = [
    {
      id: "astra",
      name: "Astra",
      description: "Astra Soul abandoned records and processes",
      allowedRoles: ["admin", "astra"],
      records: [
        {
          id: "#REC-045",
          website: "Astra Soul",
          domain: "https://www.astrasoul.in/consultation",
          title: "Astra Soul",
          route: "",
        },
        {
          id: "#REC-046",
          website: "AstraSoul Love",
          domain: "https://www.astrasoul.in/love-record",
          title: "AstraSoul Love",
          route: "",
        },
      ],
    },
    {
      id: "astro",
      name: "Astro",
      description: "Easy Astro abandoned records and processes",
      allowedRoles: ["admin", "astro"],
      records: [
        {
          id: "#REC-054",
          website: "Soul Mate Sketch",
          domain: "https://www.easyastro.in/soulmatesketch",
          title: "Soul Mate Sketch",
          route: "lander3",
        },
        {
          id: "#REC-050",
          website: "Easy Astro",
          domain: "https://www.easyastro.in/",
          title: "Easy Astro",
          route: "lander3",
        },
        {
          id: "#REC-051",
          website: "Easy Astro Exp",
          domain: "https://www.easyastro.in/exp",
          title: "Easy Astro Exp",
          route: "lander7",
        },
        {
          id: "#REC-052",
          website: "Sister",
          domain: "https://www.easyastro.in/sister",
          title: "Sister",
          route: "lander5",
        },
        {
          id: "#REC-053",
          website: "Sister 2",
          domain: "https://www.easyastro.in/sister2",
          title: "Sister 2",
          route: "lander5",
        },
      ],
    },
    {
      id: "signature",
      name: "Signature",
      description: "Signature Studio abandoned records and processes",
      allowedRoles: ["admin", "signature"],
      records: [
        {
          id: "#REC-047",
          website: "Signature Main",
          domain: "https://www.thesignaturestudio.in/signature/",
          title: "Signature Main",
          route: "",
        },
        {
          id: "#REC-048",
          website: "Signature New",
          domain: "https://www.thesignaturestudio.in/new",
          title: "Signature New",
          route: "lander42",
        },
        {
          id: "#REC-049",
          website: "Signature New 2",
          domain: "https://www.thesignaturestudio.in/signature-new ",
          title: "Signature New 2",
          route: "rag",
        },
        {
          id: "#REC-050",
          website: "Signature V2",
          domain: "https://www.thesignaturestudio.in/signature-v2 ",
          title: "Signature V2",
          route: "rag-v2",
        },
        {
          id: "#REC-050",
          website: "Signature 4",
          domain: "https://www.thesignaturestudio.in/signature4 ",
          title: "Signature 4",
          route: "lander5",
        },
      ],
    },
  ];

  // Filter categories based on user role
  const accessibleCategories = abandonedCategories.filter((category) => {
    if (!user || !user.role) return false;
    return category.allowedRoles.includes(user.role.toLowerCase());
  });

  // Filter categories and their records based on search
  const filteredCategories = accessibleCategories.map((category) => {
    const filteredRecords = category.records.filter((record) => {
      const matchesSearch =
        record.website.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });

    return {
      ...category,
      records: filteredRecords,
    };
  }).filter((category) => category.records.length > 0); // Only show categories that have records after filtering

  // Calculate total records for display
  const totalRecords = filteredCategories.reduce((total, category) => total + category.records.length, 0);
  const totalAccessibleRecords = accessibleCategories.reduce((total, category) => total + category.records.length, 0);

  // Navigate to category view
  const viewCategory = (categoryId) => {
    setCurrentView(categoryId);
  };

  // Navigate back to overview
  const backToOverview = () => {
    setCurrentView('overview');
  };

  // Get current category data
  const currentCategory = filteredCategories.find(cat => cat.id === currentView);


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
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {currentView !== 'overview' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={backToOverview}
                  className="p-2 hover:bg-gray-100"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <div className="flex-1 min-w-0">
                <h1 className="text-xl md:text-2xl font-bold truncate">
                  {currentView === 'overview' ? 'Abandoned Records' : currentCategory?.name}
                </h1>
                <p className="text-sm text-muted-foreground hidden sm:block">
                  {currentView === 'overview' 
                    ? 'Review and recover abandoned processes' 
                    : currentCategory?.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <Button variant="outline" size="sm" className="hidden sm:flex border-gray-200 text-black hover:bg-gray-50">
                <Download className="w-4 h-4 mr-2" />
                Export {currentView === 'overview' ? 'All' : currentCategory?.name}
              </Button>
              <Button variant="outline" size="sm" className="sm:hidden border-gray-200 text-black hover:bg-gray-50">
                <Download className="w-4 h-4" />
              </Button>
              <Button size="sm" className="hidden sm:flex bg-black hover:bg-gray-800 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Website
              </Button>
              <Button size="sm" className="sm:hidden bg-black hover:bg-gray-800 text-white">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Search and Filter Bar */}
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardContent className="p-3 md:p-4">
              <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-center">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-4 h-4" />
                  <input
                    type="text"
                    placeholder={isMobile ? "Search abandoned records..." : "Search abandoned records, websites, or categories..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-gray-400/20 focus:border-gray-400"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
            <p className="text-sm text-gray-600">
              {currentView === 'overview' 
                ? `Showing ${totalRecords} of ${totalAccessibleRecords} abandoned records across ${filteredCategories.length} categories`
                : `Showing ${currentCategory?.records.length} abandoned records in ${currentCategory?.name} category`
              }
            </p>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
              <Activity className="w-3 h-3 sm:w-4 sm:h-4" />
              Last updated: just now
            </div>
          </div>

          {/* Main Content Area */}
          {currentView === 'overview' ? (
            /* Overview - Category Cards */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              {filteredCategories.map((category, categoryIndex) => (
                <Card
                  key={category.id}
                  className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200 shadow-md bg-white group cursor-pointer"
                  style={{ animationDelay: `${categoryIndex * 0.1}s` }}
                  onClick={() => viewCategory(category.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="p-3 bg-gray-100 rounded-lg flex-shrink-0">
                          <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 text-black" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-lg md:text-xl group-hover:text-gray-700 transition-colors text-black">
                            {category.name}
                          </CardTitle>
                          <p className="text-sm text-gray-600 mt-1">
                            {category.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="text-xs bg-gray-100 text-black border-gray-200"
                        >
                          {category.records.length} record{category.records.length !== 1 ? 's' : ''}
                        </Badge>
                        <ArrowUpRight className="w-5 h-5 text-gray-600" />
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Click to view all {category.name.toLowerCase()} abandoned records
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* Category Detail View */
            <div className="space-y-6">
              {/* Category Info Card */}
              <Card className="border border-gray-200 shadow-sm bg-white">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <AlertTriangle className="w-8 h-8 text-black" />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-semibold text-black">
                        {currentCategory?.name}
                      </h2>
                      <p className="text-gray-600 mt-1">
                        {currentCategory?.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge
                          variant="outline"
                          className="text-sm bg-gray-100 text-black border-gray-200"
                        >
                          {currentCategory?.records.length} abandoned record{currentCategory?.records.length !== 1 ? 's' : ''}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          All abandoned records in this category
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Abandoned Records Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {currentCategory?.records.map((record, recordIndex) => (
                  <Card
                    key={record.id}
                    className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200 shadow-md bg-white group"
                    style={{ animationDelay: `${recordIndex * 0.1}s` }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                            <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-black" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <CardTitle className="text-base md:text-lg group-hover:text-gray-700 transition-colors truncate text-black">
                              {record.website}
                            </CardTitle>
                            <CardDescription className="text-xs truncate text-gray-600">
                              {record.id}
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 mt-3">
                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                          <Globe className="w-4 h-4 text-black flex-shrink-0" />
                          <a 
                            href={record.domain} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-gray-600 hover:underline truncate flex-1"
                          >
                            {record.domain}
                          </a>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3 md:space-y-4">
                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          className="flex-1 group/btn text-sm bg-black hover:bg-gray-800 text-white"
                          disabled={record.route === ""}
                          onClick={() =>
                            navigate(`/abandoned/${record.route}?website=${record.domain}`)
                          }
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          <span className="hidden sm:inline">View Details</span>
                          <span className="sm:hidden">View</span>
                          <ArrowUpRight className="w-3 h-3 ml-1 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredCategories.length === 0 && currentView === 'overview' && (
            <div className="text-center py-8 md:py-12 px-4">
              <AlertTriangle className="w-10 h-10 md:w-12 md:h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-base md:text-lg font-medium mb-2 text-black">
                No abandoned categories found
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button
                variant="outline"
                className="border-gray-200 text-black hover:bg-gray-50"
                onClick={() => {
                  setSearchQuery("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Category Empty State */}
          {currentView !== 'overview' && currentCategory?.records.length === 0 && (
            <div className="text-center py-8 md:py-12 px-4">
              <AlertTriangle className="w-10 h-10 md:w-12 md:h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-base md:text-lg font-medium mb-2 text-black">
                No abandoned records found in {currentCategory?.name}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Try adjusting your search criteria
              </p>
              <Button
                variant="outline"
                className="border-gray-200 text-black hover:bg-gray-50"
                onClick={() => {
                  setSearchQuery("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Abandoned;
