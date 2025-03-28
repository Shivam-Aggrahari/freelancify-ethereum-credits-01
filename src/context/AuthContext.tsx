
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Web3Service } from "@/services/web3Service";
import { User } from "@/types/user";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  loginWithGoogle: () => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if user is already connected
    const checkConnection = async () => {
      try {
        const web3Service = new Web3Service();
        const isConnected = await web3Service.isConnected();
        
        if (isConnected) {
          const address = await web3Service.getAddress();
          // In a real app, you would fetch user data from your backend here
          const mockUser = {
            id: "1",
            address,
            username: `user_${address.substring(2, 8)}`,
            credits: 100,
            skills: [],
            education: [],
            links: {},
          };
          setUser(mockUser);
        }
      } catch (error) {
        console.error("Error checking connection:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkConnection();
  }, []);
  
  const connectWallet = async () => {
    try {
      setIsLoading(true);
      const web3Service = new Web3Service();
      await web3Service.connect();
      const address = await web3Service.getAddress();
      
      // In a real app, you would check if user exists in your database
      // If not, you would create a new user
      // For now, we'll just mock it
      const mockUser = {
        id: "1",
        address,
        username: `user_${address.substring(2, 8)}`,
        credits: 100,
        skills: [],
        education: [],
        links: {},
      };
      
      setUser(mockUser);
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
  
  const disconnectWallet = () => {
    // In a real implementation, you would disconnect from the provider
    setUser(null);
    toast({
      title: "Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };
  
  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      // In a real app, you would use Firebase or another auth provider
      // For now, we'll just mock a successful login
      await new Promise(resolve => setTimeout(resolve, 1000)); // simulate API call
      
      const mockUser = {
        id: "2",
        address: "",
        username: "google_user",
        credits: 50,
        skills: [],
        education: [],
        links: {},
      };
      
      setUser(mockUser);
      toast({
        title: "Logged in!",
        description: "You've successfully logged in with Google.",
      });
    } catch (error) {
      console.error("Error logging in with Google:", error);
      toast({
        title: "Login Failed",
        description: "Failed to login with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateProfile = async (profileData: Partial<User>) => {
    try {
      setIsLoading(true);
      // In a real app, you would update the user's profile in your backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // simulate API call
      
      setUser(user => user ? { ...user, ...profileData } : null);
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
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        connectWallet,
        disconnectWallet,
        loginWithGoogle,
        updateProfile,
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
