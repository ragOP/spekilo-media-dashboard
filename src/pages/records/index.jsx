import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Filter,
  Download,
  Plus,
  Globe,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Activity,
  Calendar,
  ArrowUpRight,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";

const Records = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy] = useState("recent"); // setSortBy removed as it's not used
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
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Website records data
  const websites = [
    {
      id: "#REC-045",
      website: "Astra Soul",
      domain: "https://www.astrasoul.in/",
      title: "Astra Soul",
      route: "lander1",
    },
    {
      id: "#REC-046",
      website: "AstraSoul Love",
      domain: "https://www.astrasoul.in/love-record",
      title: "AstraSoul Love",
      route: "lander2",
    },
    {
      id: "#REC-047",
      website: "Signature Main",
      domain: "https://www.astrasoul.in/signature/",
      title: "Signature Main",
      route: "lander4",
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
      route: "lander3",
    },
    {
      id: "#REC-053",
      website: "Sister 2",
      domain: "https://www.easyastro.in/sister2",
      title: "Sister 2",
      route: "lander5",
    },
    {
      id: "#REC-054",
      website: "Soul Mate Sketch",
      domain: "https://www.easyastro.in/soulmatesketch",
      title: "Soul Mate Sketch",
      route: "lander3",
    },
  ];

  // Filter websites based on search and status
  const filteredWebsites = websites.filter((website) => {
    const matchesSearch =
      website.website.toLowerCase().includes(searchQuery.toLowerCase()) ||
      website.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      website.domain.toLowerCase().includes(searchQuery.toLowerCase());

    // Since we don't have status field, always return true for status filter
    const matchesStatus = statusFilter === "all";

    return matchesSearch && matchesStatus;
  });

  // Sort websites
  const sortedWebsites = [...filteredWebsites].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.website.localeCompare(b.website);
      case "records":
      case "completion":
      case "recent":
      default:
        return a.website.localeCompare(b.website); // Default to alphabetical sort
    }
  });

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
              <h1 className="text-xl md:text-2xl font-bold truncate">
                Website Records
              </h1>
              <p className="text-sm text-muted-foreground hidden sm:block">
                Manage and monitor all website records
              </p>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Download className="w-4 h-4 mr-2" />
                Export All
              </Button>
              <Button variant="outline" size="sm" className="sm:hidden">
                <Download className="w-4 h-4" />
              </Button>
              <Button size="sm" className="hidden sm:flex">
                <Plus className="w-4 h-4 mr-2" />
                Add Website
              </Button>
              <Button size="sm" className="sm:hidden">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Search and Filter Bar */}
          <Card className="border-0 shadow-sm bg-gradient-to-r from-card to-card/50">
            <CardContent className="p-3 md:p-4">
              <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-center">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    placeholder={
                      isMobile
                        ? "Search websites..."
                        : "Search websites, categories, or descriptions..."
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
            <p className="text-sm text-muted-foreground">
              Showing {sortedWebsites.length} of {websites.length} websites
            </p>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <Activity className="w-3 h-3 sm:w-4 sm:h-4" />
              Last updated: just now
            </div>
          </div>

          {/* Website Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 animate-fade-in">
            {sortedWebsites.map((website, index) => (
              <Card
                key={website.id}
                className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-card to-card/50 group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                        <Globe className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-base md:text-lg group-hover:text-primary transition-colors truncate">
                          {website.website}
                        </CardTitle>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <Badge
                        variant="outline"
                        className="text-xs bg-blue-100 text-blue-700 border-blue-200 whitespace-nowrap"
                      >
                        <Globe className="w-3 h-3" />
                        <span className="ml-1 hidden sm:inline">Active</span>
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical classNamen="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 md:space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {website.title} - Website record management
                  </p>

                  {/* Website Link */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 bg-background/50 rounded-lg">
                      <Globe className="w-4 h-4 text-primary flex-shrink-0" />
                      <a
                        href={website.domain}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline truncate flex-1"
                      >
                        {website.domain}
                      </a>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      className="flex-1 group/btn text-sm"
                      disabled={website.route === ""}
                      onClick={() => {
                        navigate(`/records/${website.route}`);
                      }}
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

          {/* Empty State */}
          {sortedWebsites.length === 0 && (
            <div className="text-center py-8 md:py-12 px-4">
              <Globe className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-base md:text-lg font-medium mb-2">
                No websites found
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
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

export default Records;
