
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Loader2, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface Application {
  id: string;
  user_id: string;
  gig_id: string;
  cover_letter: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  applicant?: {
    username: string | null;
    avatar_url: string | null;
    skills: { skill: string }[];
    reputation: number | null;
    bio: string | null;
  };
}

interface Gig {
  id: string;
  title: string;
  status: string;
}

const ManageApplications = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  
  const [applications, setApplications] = useState<Application[]>([]);
  const [gig, setGig] = useState<Gig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [processingAction, setProcessingAction] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchApplicationsAndGig = async () => {
      if (!isAuthenticated || !user) {
        navigate("/login");
        return;
      }
      
      try {
        setIsLoading(true);
        
        // Fetch gig details first to verify ownership
        const { data: gigData, error: gigError } = await supabase
          .from('gigs')
          .select('id, title, status, created_by')
          .eq('id', id)
          .single();
        
        if (gigError) throw gigError;
        
        // Verify the user is the creator of this gig
        if (gigData.created_by !== user.id) {
          toast({
            title: "Access Denied",
            description: "You can only view applications for gigs you've created.",
            variant: "destructive",
          });
          navigate("/gigs");
          return;
        }
        
        setGig({
          id: gigData.id,
          title: gigData.title,
          status: gigData.status
        });
        
        // Fetch applications for this gig and join with profile data
        const { data: applicationsData, error: appError } = await supabase
          .from('applications')
          .select(`
            *,
            applicant:user_id(
              username:username, 
              avatar_url:avatar_url, 
              reputation:reputation,
              bio:bio,
              skills:skills(skill)
            )
          `)
          .eq('gig_id', id)
          .order('created_at', { ascending: false });
        
        if (appError) throw appError;
        
        // Process the data to ensure it matches our Application interface
        const processedApplications: Application[] = applicationsData.map((app: any) => ({
          id: app.id,
          user_id: app.user_id,
          gig_id: app.gig_id,
          cover_letter: app.cover_letter,
          status: app.status,
          created_at: app.created_at,
          applicant: app.applicant && !app.applicant.error ? {
            username: app.applicant.username,
            avatar_url: app.applicant.avatar_url,
            bio: app.applicant.bio,
            skills: app.applicant.skills || [],
            reputation: app.applicant.reputation
          } : undefined
        }));
        
        setApplications(processedApplications);
      } catch (error) {
        console.error("Error fetching applications:", error);
        toast({
          title: "Error",
          description: "Failed to load applications. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchApplicationsAndGig();
  }, [id, isAuthenticated, navigate, toast, user]);
  
  const handleAcceptApplication = async (applicationId: string, applicantId: string) => {
    setProcessingAction(applicationId);
    
    try {
      // Update the application status
      const { error: appError } = await supabase
        .from('applications')
        .update({ status: 'accepted' })
        .eq('id', applicationId);
      
      if (appError) throw appError;
      
      // Update the gig status and assign to the applicant
      const { error: gigError } = await supabase
        .from('gigs')
        .update({ 
          status: 'assigned',
          assigned_to: applicantId
        })
        .eq('id', id);
      
      if (gigError) throw gigError;
      
      // Reject all other applications for this gig
      const { error: rejectError } = await supabase
        .from('applications')
        .update({ status: 'rejected' })
        .eq('gig_id', id)
        .neq('id', applicationId);
      
      if (rejectError) throw rejectError;
      
      toast({
        title: "Application Accepted",
        description: "You've successfully accepted this application.",
      });
      
      // Update local state
      setGig(prev => prev ? { ...prev, status: 'assigned' } : null);
      
      setApplications(prev => prev.map(app => {
        if (app.id === applicationId) {
          return { ...app, status: 'accepted' };
        } else {
          return { ...app, status: 'rejected' };
        }
      }));
    } catch (error) {
      console.error("Error accepting application:", error);
      toast({
        title: "Error",
        description: "Failed to accept application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingAction(null);
    }
  };
  
  const handleRejectApplication = async (applicationId: string) => {
    setProcessingAction(applicationId);
    
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: 'rejected' })
        .eq('id', applicationId);
      
      if (error) throw error;
      
      toast({
        title: "Application Rejected",
        description: "You've rejected this application.",
      });
      
      // Update local state
      setApplications(prev => prev.map(app => {
        if (app.id === applicationId) {
          return { ...app, status: 'rejected' };
        }
        return app;
      }));
    } catch (error) {
      console.error("Error rejecting application:", error);
      toast({
        title: "Error",
        description: "Failed to reject application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingAction(null);
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
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <Button 
              variant="outline" 
              onClick={() => navigate("/gigs")}
              className="mb-2 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Gigs
            </Button>
            <h1 className="text-2xl font-bold">Applications for: {gig?.title}</h1>
            <div className="mt-2">
              <Badge variant={gig?.status === 'open' ? "success" : "secondary"}>
                {gig?.status.charAt(0).toUpperCase() + gig?.status.slice(1)}
              </Badge>
            </div>
          </div>
        </div>
        
        {applications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground mb-2">No applications received yet</p>
              <p className="text-sm text-muted-foreground">
                Applications will appear here when freelancers apply for your gig.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => (
              <Card key={application.id} className="overflow-hidden">
                <CardHeader className="pb-0">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="flex items-center gap-3 mb-2 sm:mb-0">
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Avatar className="h-10 w-10 cursor-pointer">
                            <AvatarImage src={application.applicant?.avatar_url || undefined} />
                            <AvatarFallback>
                              {application.applicant?.username?.substring(0, 2).toUpperCase() || "??"}
                            </AvatarFallback>
                          </Avatar>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={application.applicant?.avatar_url || undefined} />
                                <AvatarFallback>
                                  {application.applicant?.username?.substring(0, 2).toUpperCase() || "??"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="text-sm font-semibold">{application.applicant?.username || "Anonymous"}</h4>
                                <p className="text-xs text-muted-foreground">Reputation: {application.applicant?.reputation || 0}</p>
                              </div>
                            </div>
                            {application.applicant?.bio && (
                              <p className="text-sm">{application.applicant.bio}</p>
                            )}
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                      
                      <div>
                        <p className="font-medium">{application.applicant?.username || "Anonymous"}</p>
                        {application.applicant?.reputation !== null && (
                          <div className="flex items-center">
                            <span className="text-sm text-muted-foreground mr-1">Reputation:</span>
                            <span className="text-sm font-medium">{application.applicant?.reputation}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Badge 
                      variant={
                        application.status === 'accepted' ? "success" :
                        application.status === 'rejected' ? "destructive" : "outline"
                      }
                    >
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-4">
                  <div className="mb-2">
                    <p className="text-sm text-muted-foreground mb-1">Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {application.applicant?.skills?.length > 0 ? (
                        application.applicant.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill.skill}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">No skills listed</span>
                      )}
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Cover Letter:</p>
                    <p className="whitespace-pre-wrap text-sm">{application.cover_letter}</p>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-4">
                    Applied on {new Date(application.created_at).toLocaleDateString()}
                  </p>
                  
                  {gig?.status === 'open' && application.status === 'pending' && (
                    <div className="flex justify-end gap-2 mt-4">
                      <Button
                        variant="outline"
                        onClick={() => handleRejectApplication(application.id)}
                        disabled={!!processingAction}
                        className="flex items-center gap-1"
                      >
                        {processingAction === application.id ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        ) : (
                          <XCircle className="h-4 w-4 mr-1" />
                        )}
                        Reject
                      </Button>
                      
                      <Button
                        onClick={() => handleAcceptApplication(application.id, application.user_id)}
                        disabled={!!processingAction}
                        className="flex items-center gap-1"
                      >
                        {processingAction === application.id ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-1" />
                        )}
                        Accept
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ManageApplications;
