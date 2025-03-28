
import { useAuth } from "@/context/AuthContext";
import { UserProfile } from "@/components/UserProfile";
import { Navbar } from "@/components/Navbar";
import { Navigate } from "react-router-dom";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
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
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        {user && <UserProfile user={user} />}
      </main>
    </div>
  );
};

export default Profile;
