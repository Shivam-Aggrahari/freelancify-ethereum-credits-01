
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";

interface GigApplicationProps {
  gigId: string;
}

export function GigApplication({ gigId }: GigApplicationProps) {
  const { user } = useAuth();
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
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
  
  if (isLoading || !status) return null;
  
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
