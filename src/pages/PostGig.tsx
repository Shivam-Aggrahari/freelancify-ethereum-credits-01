
import { useAuth } from "@/context/AuthContext";
import { GigForm } from "@/components/GigForm";
import { Navbar } from "@/components/Navbar";
import { Navigate } from "react-router-dom";

const PostGig = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2">Post a Gig</h1>
        <p className="text-muted-foreground mb-8">
          Create a new freelance opportunity for the community
        </p>
        
        <GigForm />
      </main>
    </div>
  );
};

export default PostGig;
