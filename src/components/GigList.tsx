
import { useState, useEffect } from "react";
import { Gig } from "@/types/user";
import { GigCard } from "@/components/GigCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

export function GigList() {
  const { toast } = useToast();
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  
  const categories = [
    "All Categories",
    "Web Development",
    "Mobile Development",
    "UI/UX Design",
    "Writing & Translation",
    "Data Science",
    "Blockchain Development",
    "Smart Contract Audit",
    "NFT Design",
    "Marketing",
    "Other",
  ];
  
  useEffect(() => {
    // In a real app, you would fetch gigs from your API
    // For now, we'll just mock some data
    const fetchGigs = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockGigs: Gig[] = [
          {
            id: "1",
            title: "Build a DeFi Dashboard",
            description: "Looking for a skilled developer to create a dashboard for tracking DeFi investments across multiple protocols. Should include charts, portfolio value, and transaction history.",
            category: "Web Development",
            credits: 500,
            createdBy: "0x123...",
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            status: "open",
          },
          {
            id: "2",
            title: "Smart Contract Security Audit",
            description: "Need an experienced auditor to review my NFT marketplace smart contract for security vulnerabilities and potential optimizations.",
            category: "Smart Contract Audit",
            credits: 800,
            createdBy: "0x456...",
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
            status: "assigned",
            assignedTo: "0x789...",
          },
          {
            id: "3",
            title: "Design NFT Collection",
            description: "Looking for an artist to create a collection of 10 unique NFTs for my upcoming project. The theme is futuristic cyberpunk.",
            category: "NFT Design",
            credits: 350,
            createdBy: "0xabc...",
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
            status: "open",
          },
          {
            id: "4",
            title: "Web3 Blog Content Writer",
            description: "Seeking a knowledgeable writer to create 5 articles about Web3 technologies, DeFi, and blockchain developments.",
            category: "Writing & Translation",
            credits: 200,
            createdBy: "0xdef...",
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            status: "open",
          },
          {
            id: "5",
            title: "Develop Mobile Wallet App",
            description: "Need a developer to build a mobile wallet app for Android and iOS that supports ERC-20 and ERC-721 tokens.",
            category: "Mobile Development",
            credits: 1000,
            createdBy: "0xghi...",
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
            status: "completed",
          },
        ];
        
        setGigs(mockGigs);
      } catch (error) {
        console.error("Error fetching gigs:", error);
        toast({
          title: "Error",
          description: "Failed to load gigs. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGigs();
  }, [toast]);
  
  const handleApply = (gigId: string) => {
    toast({
      title: "Application Submitted",
      description: "Your application has been sent to the client.",
    });
  };
  
  const filteredGigs = gigs.filter(gig => {
    const matchesSearch = gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gig.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "" || categoryFilter === "All Categories" || 
                           gig.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search gigs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        
        <Select
          value={categoryFilter}
          onValueChange={setCategoryFilter}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {filteredGigs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGigs.map((gig) => (
            <GigCard
              key={gig.id}
              gig={gig}
              onApply={() => handleApply(gig.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium">No gigs found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
