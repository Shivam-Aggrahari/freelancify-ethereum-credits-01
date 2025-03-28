
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Gig } from "@/types/user";
import { Link } from "react-router-dom";

export function GigList() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [filteredGigs, setFilteredGigs] = useState<Gig[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch gigs from Supabase
  useEffect(() => {
    const fetchGigs = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('gigs')
          .select(`
            *,
            creator:profiles!created_by(username, avatar_url)
          `)
          .eq('status', 'open')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        // Transform data to match Gig type
        const formattedGigs: Gig[] = data.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          category: item.category,
          credits: item.credits,
          createdBy: item.creator?.username || 'Unknown',
          createdAt: new Date(item.created_at),
          status: item.status === 'open' ? 'open' : item.status === 'assigned' ? 'assigned' : 'completed',
          assignedTo: item.assigned_to
        }));

        setGigs(formattedGigs);
        setFilteredGigs(formattedGigs);

        // Extract unique categories
        const uniqueCategories = Array.from(new Set(formattedGigs.map(gig => gig.category)));
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching gigs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGigs();
  }, []);

  // Filter gigs based on search term and category
  useEffect(() => {
    let result = gigs;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        gig => 
          gig.title.toLowerCase().includes(searchLower) || 
          gig.description.toLowerCase().includes(searchLower)
      );
    }

    if (categoryFilter) {
      result = result.filter(gig => gig.category === categoryFilter);
    }

    setFilteredGigs(result);
  }, [searchTerm, categoryFilter, gigs]);

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              placeholder="Search gigs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-categories">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={resetFilters} className="flex items-center gap-2">
              <Filter className="h-4 w-4" /> Reset
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-2" />
                <Skeleton className="h-4 w-4/6" />
              </CardContent>
              <CardFooter className="flex justify-between border-t p-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-9 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredGigs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGigs.map((gig) => (
            <Card key={gig.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle>{gig.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-2">
                  {gig.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {gig.category}
                  </span>
                </div>
                <p className="text-sm font-medium">Posted by: {gig.createdBy}</p>
              </CardContent>
              <CardFooter className="flex justify-between border-t p-4">
                <p className="font-semibold">{gig.credits} Credits</p>
                <Link to={`/gig/${gig.id}`}>
                  <Button>Apply</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No gigs found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search or filter criteria
          </p>
          <Button onClick={resetFilters}>Reset Filters</Button>
        </div>
      )}
    </div>
  );
}
