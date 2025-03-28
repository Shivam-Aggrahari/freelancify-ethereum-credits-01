
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface GigApplicationProps {
  gigId: string;
  onApply?: () => void;
  showApplyButton?: boolean;
}

export function GigApplication({ gigId, onApply, showApplyButton = false }: GigApplicationProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    const checkApplicationStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('applications')
          .select('status')
          .eq('gig_id', gigId)
          .eq('user_id', user.id)
          .single();
        
        if (error) {
          if (error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
            console.error("Error checking application status:", error);
          }
          setStatus(null);
        } else {
          setStatus(data.status);
        }
      } catch (err) {
        console.error("Error checking application:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkApplicationStatus();
  }, [gigId, user]);

  const handleApply = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You need to be logged in to apply for gigs.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    try {
      setIsApplying(true);
      
      const { error } = await supabase
        .from('applications')
        .insert({
          gig_id: gigId,
          user_id: user.id,
          cover_letter: coverLetter || "I'm interested in this gig and would like to apply.",
          status: 'pending'
        });
      
      if (error) throw error;
      
      toast({
        title: "Application Submitted",
        description: "Your application has been submitted. Check your dashboard for status updates.",
      });
      
      setStatus('pending');
      setDialogOpen(false);
      
      if (onApply) {
        onApply();
      }
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
  
  const handleQuickApply = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You need to be logged in to apply for gigs.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    try {
      setIsApplying(true);
      
      // Create a default application with a basic cover letter
      const { error } = await supabase
        .from('applications')
        .insert({
          gig_id: gigId,
          user_id: user.id,
          cover_letter: "I'm interested in this gig and would like to apply.",
          status: 'pending'
        });
      
      if (error) throw error;
      
      toast({
        title: "Application Submitted",
        description: "Your quick application has been submitted. Check your dashboard for status updates.",
      });
      
      setStatus('pending');
      
      if (onApply) {
        onApply();
      }
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
  
  if (isLoading) return null;
  
  // If the user has already applied, show the application status
  if (status) {
    return (
      <Badge 
        variant={
          status === 'accepted' ? "success" : 
          status === 'rejected' ? "destructive" : 
          "outline"
        }
        className="ml-2"
      >
        {status === 'accepted' ? 'Accepted' : 
         status === 'rejected' ? 'Rejected' : 
         'Applied'}
      </Badge>
    );
  }
  
  // If showApplyButton is true and user hasn't applied yet, show apply options
  if (showApplyButton && !status) {
    return (
      <>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="default"
              size="sm"
              className="flex items-center gap-1"
            >
              <Send className="h-4 w-4" />
              Apply
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Apply for this Gig</DialogTitle>
              <DialogDescription>
                Write a brief message to explain why you're a good fit for this gig.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Textarea
                placeholder="Describe your skills and experience relevant to this gig..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                onClick={handleApply}
                disabled={isApplying}
              >
                {isApplying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>Submit Application</>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Button 
          onClick={handleQuickApply} 
          disabled={isApplying}
          size="sm"
          variant="outline"
          className="hidden md:flex items-center gap-1"
        >
          {isApplying ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Applying...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Quick Apply
            </>
          )}
        </Button>
      </>
    );
  }
  
  return null;
}
