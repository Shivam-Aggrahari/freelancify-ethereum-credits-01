
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { Gig } from "@/types/user";
import { useAuth } from "@/context/AuthContext";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

const GigDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  
  const [gig, setGig] = useState<Gig | null>(null);
  const [creator, setCreator] = useState<{ username: string; avatar_url: string | null } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [hasApplied, setHasApplied] = useState(false);
  
  useEffect(() => {
    const fetchGigDetails = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('gigs')
          .select(`
            *,
            creator:profiles!created_by(username, avatar_url)
          `)
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        // Transform data to match Gig type
        const formattedGig: Gig = {
          id: data.id,
          title: data.title,
          description: data.description,
          category: data.category,
          credits: data.credits,
          createdBy: data.created_by,
          createdAt: new Date(data.created_at),
          status: data.status,
          assignedTo: data.assigned_to
        };
        
        setGig(formattedGig);
        setCreator(data.creator);
        
        // Check if user has already applied
        if (user) {
          const { data: applications, error: appError } = await supabase
            .from('applications')
            .select('*')
            .eq('gig_id', id)
            .eq('user_id', user.id)
            .single();
          
          if (!appError && applications) {
            setHasApplied(true);
          }
        }
      } catch (error) {
        console.error("Error fetching gig details:", error);
        toast({
          title: "Error",
          description: "Failed to load gig details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGigDetails();
  }, [id, toast, user]);
  
  const handleApply = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "You need to be logged in to apply for gigs.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    if (!coverLetter.trim()) {
      toast({
        title: "Cover Letter Required",
        description: "Please provide a cover letter for your application.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsApplying(true);
      
      const { error } = await supabase
        .from('applications')
        .insert({
          gig_id: id,
          user_id: user?.id,
          cover_letter: coverLetter,
          status: 'pending'
        });
      
      if (error) throw error;
      
      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully.",
      });
      
      setHasApplied(true);
      setCoverLetter("");
    } catch (error) {
      console.error("Error applying for gig:", error);
      toast({
        title: "Application Failed",
        description: "Failed to submit your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsApplying(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto py-8 px-4 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </main>
      </div>
    );
  }
  
  if (!gig) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto py-8 px-4">
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">Gig Not Found</h3>
            <p className="text-muted-foreground mb-6">
              The gig you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate("/gigs")}>Browse Gigs</Button>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          Back to Gigs
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">{gig.title}</CardTitle>
                    <Badge className="mb-2">{gig.category}</Badge>
                  </div>
                  <div className="text-xl font-bold text-primary">
                    {gig.credits} Credits
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="whitespace-pre-wrap mb-6">{gig.description}</p>
                
                <div className="flex items-center">
                  <p className="text-sm text-muted-foreground">
                    Posted on {gig.createdAt.toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {isAuthenticated && gig.createdBy !== user?.id && (
              <Card>
                <CardHeader>
                  <CardTitle>Apply for this Gig</CardTitle>
                </CardHeader>
                
                <CardContent>
                  {hasApplied ? (
                    <div className="bg-primary/10 text-primary p-4 rounded-md">
                      You have already applied for this gig. The client will contact you if they're interested.
                    </div>
                  ) : (
                    <>
                      <p className="mb-4 text-muted-foreground">
                        Tell the client why you're the best person for this job.
                      </p>
                      
                      <Textarea
                        placeholder="Write your cover letter here..."
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        rows={6}
                        className="mb-4"
                      />
                      
                      <Button 
                        onClick={handleApply} 
                        disabled={isApplying || !coverLetter.trim()}
                        className="w-full"
                      >
                        {isApplying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isApplying ? "Submitting..." : "Submit Application"}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>About the Client</CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={creator?.avatar_url || undefined} />
                    <AvatarFallback>
                      {creator?.username?.substring(0, 2).toUpperCase() || "??"}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <p className="font-medium">{creator?.username || "Anonymous"}</p>
                    <p className="text-sm text-muted-foreground">Client</p>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant={gig.status === 'open' ? "success" : "secondary"}>
                      {gig.status.charAt(0).toUpperCase() + gig.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GigDetail;
