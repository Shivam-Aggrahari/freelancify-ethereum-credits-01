
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

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
  
  // If showApplyButton is true and user hasn't applied yet, show a quick apply button
  if (showApplyButton && !status) {
    return (
      <Button 
        onClick={handleQuickApply} 
        disabled={isApplying}
        size="sm"
        variant="primary"
        className="flex items-center gap-1"
      >
        {isApplying ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Applying...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Apply
          </>
        )}
      </Button>
    );
  }
  
  return null;
}
