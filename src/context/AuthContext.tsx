import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Web3Service } from "@/services/web3Service";
import { User } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
  session: Session | null;
  logout: () => Promise<void>;
  createEscrow: (gigId: string, amount: number) => Promise<void>;
  releaseEscrow: (escrowId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state changed:", event, newSession);
        setSession(newSession);
        
        if (newSession?.user) {
          setTimeout(() => {
            fetchUserProfile(newSession.user.id);
          }, 0);
        } else {
          setUser(null);
        }
      }
    );
    
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id);
      } else {
        setIsLoading(false);
      }
    });
    
    return () => subscription.unsubscribe();
  }, []);
  
  const fetchUserProfile = async (userId: string) => {
    try {
      setIsLoading(true);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (profile) {
        const { data: skills } = await supabase
          .from('skills')
          .select('skill')
          .eq('user_id', userId);
        
        const { data: education } = await supabase
          .from('education')
          .select('*')
          .eq('user_id', userId);
        
        const { data: links } = await supabase
          .from('links')
          .select('platform, url')
          .eq('user_id', userId);
        
        const transformedLinks: Record<string, string> = {};
        if (links) {
          links.forEach(link => {
            transformedLinks[link.platform.toLowerCase()] = link.url;
          });
        }
        
        const userWithDetails: User = {
          id: profile.id,
          address: profile.address || "",
          username: profile.username || "",
          credits: profile.credits || 0,
          avatar: profile.avatar_url,
          bio: profile.bio,
          skills: skills ? skills.map(s => s.skill) : [],
          education: education || [],
          links: transformedLinks,
          reputation: profile.reputation,
          resume: profile.resume_url,
        };
        
        setUser(userWithDetails);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast({
        title: "Error",
        description: "Failed to fetch user profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const connectWallet = async () => {
    try {
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in with Google first before connecting your wallet.",
          variant: "destructive",
        });
        return;
      }
      
      setIsLoading(true);
      const web3Service = new Web3Service();
      await web3Service.connect();
      const address = await web3Service.getAddress();
      
      const { error } = await supabase
        .from('profiles')
        .update({ address })
        .eq('id', session.user.id);
      
      if (error) throw error;
      
      setUser(prev => prev ? { ...prev, address } : null);
      
      toast({
        title: "Connected!",
        description: "Your wallet has been connected successfully.",
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const disconnectWallet = async () => {
    try {
      if (!session || !user) return;
      
      const { error } = await supabase
        .from('profiles')
        .update({ address: null })
        .eq('id', session.user.id);
      
      if (error) throw error;
      
      setUser(prev => prev ? { ...prev, address: "" } : null);
      
      toast({
        title: "Disconnected",
        description: "Your wallet has been disconnected.",
      });
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      toast({
        title: "Error",
        description: "Failed to disconnect wallet.",
        variant: "destructive",
      });
    }
  };
  
  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard',
        }
      });
      
      if (error) throw error;
      
      // Auth state change will handle the rest
    } catch (error) {
      console.error("Error logging in with Google:", error);
      setIsLoading(false);
      toast({
        title: "Login Failed",
        description: "Failed to login with Google. Please try again.",
        variant: "destructive",
      });
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      // Auth state change will handle the rest
    } catch (error) {
      console.error("Error logging in with email:", error);
      setIsLoading(false);
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Failed to login with email. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const signUpWithEmail = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + '/dashboard',
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Registration Successful",
        description: "Please check your email to verify your account.",
      });
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error signing up with email:", error);
      setIsLoading(false);
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Failed to sign up with email. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      
      toast({
        title: "Logged out",
        description: "You've been successfully logged out.",
      });
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Logout Failed",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateProfile = async (profileData: Partial<User>) => {
    try {
      if (!user || !session) return;
      
      setIsLoading(true);
      
      const profileUpdate: any = {};
      if (profileData.username) profileUpdate.username = profileData.username;
      if (profileData.bio !== undefined) profileUpdate.bio = profileData.bio;
      if (profileData.avatar !== undefined) profileUpdate.avatar_url = profileData.avatar;
      if (profileData.resume !== undefined) profileUpdate.resume_url = profileData.resume;
      
      if (Object.keys(profileUpdate).length > 0) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update(profileUpdate)
          .eq('id', user.id);
        
        if (profileError) throw profileError;
      }
      
      if (profileData.skills) {
        const { error: deleteError } = await supabase
          .from('skills')
          .delete()
          .eq('user_id', user.id);
        
        if (deleteError) throw deleteError;
        
        const skillsToInsert = profileData.skills.map(skill => ({
          user_id: user.id,
          skill
        }));
        
        if (skillsToInsert.length > 0) {
          const { error: skillsError } = await supabase
            .from('skills')
            .insert(skillsToInsert);
          
          if (skillsError) throw skillsError;
        }
      }
      
      if (profileData.education) {
        const { error: deleteError } = await supabase
          .from('education')
          .delete()
          .eq('user_id', user.id);
        
        if (deleteError) throw deleteError;
        
        const educationToInsert = profileData.education.map(edu => ({
          user_id: user.id,
          degree: edu.degree,
          institution: edu.institution,
          year: edu.year
        }));
        
        if (educationToInsert.length > 0) {
          const { error: eduError } = await supabase
            .from('education')
            .insert(educationToInsert);
          
          if (eduError) throw eduError;
        }
      }
      
      if (profileData.links) {
        const { error: deleteError } = await supabase
          .from('links')
          .delete()
          .eq('user_id', user.id);
        
        if (deleteError) throw deleteError;
        
        const linksToInsert = Object.entries(profileData.links)
          .filter(([_, url]) => url)
          .map(([platform, url]) => ({
            user_id: user.id,
            platform,
            url
          }));
        
        if (linksToInsert.length > 0) {
          const { error: linksError } = await supabase
            .from('links')
            .insert(linksToInsert);
          
          if (linksError) throw linksError;
        }
      }
      
      fetchUserProfile(user.id);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const createEscrow = async (gigId: string, amount: number) => {
    try {
      if (!user || !session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in before creating an escrow.",
          variant: "destructive",
        });
        return;
      }
      
      setIsLoading(true);
      
      // @ts-ignore - Ignoring type error until Supabase types are updated
      const { data, error } = await supabase
        .from('escrow')
        .insert({
          gig_id: gigId,
          client_id: user.id,
          amount: amount,
          status: 'pending'
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Escrow Created",
        description: "Your funds have been placed in escrow for this gig.",
      });
      
      return;
    } catch (error) {
      console.error("Error creating escrow:", error);
      toast({
        title: "Escrow Failed",
        description: "Failed to create escrow. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const releaseEscrow = async (escrowId: string) => {
    try {
      if (!user || !session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to release escrow funds.",
          variant: "destructive",
        });
        return;
      }
      
      setIsLoading(true);
      
      const { error } = await supabase
        .from('escrow')
        .update({
          status: 'released',
          updated_at: new Date().toISOString()
        })
        .eq('id', escrowId)
        .eq('client_id', user.id);
      
      if (error) throw error;
      
      toast({
        title: "Funds Released",
        description: "Escrow funds have been released to the freelancer.",
      });
    } catch (error) {
      console.error("Error releasing escrow:", error);
      toast({
        title: "Release Failed",
        description: "Failed to release escrow funds. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!session,
        isLoading,
        connectWallet,
        disconnectWallet,
        loginWithGoogle,
        loginWithEmail,
        signUpWithEmail,
        updateProfile,
        session,
        logout,
        createEscrow,
        releaseEscrow
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
