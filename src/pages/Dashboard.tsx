
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/Navbar";
import { Navigate, Link } from "react-router-dom";

const Dashboard = () => {
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
      
      <main className="flex-1 container mx-auto py-6 px-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <Link to="/profile/edit">
            <Button variant="outline">Edit Profile</Button>
          </Link>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Credit Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{user?.credits}</div>
              <p className="text-xs text-muted-foreground">
                Earned from completed tasks and mining
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Gigs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Currently assigned gigs
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Mining Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0.00 ETH/day</div>
              <p className="text-xs text-muted-foreground">
                Estimated earnings based on current hash rate
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="posted">
          <TabsList className="mb-6">
            <TabsTrigger value="posted">My Posted Gigs</TabsTrigger>
            <TabsTrigger value="assigned">My Assigned Gigs</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="posted" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Posted Gigs</CardTitle>
                <CardDescription>
                  Jobs you've created for others to work on
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10">
                  <p className="text-muted-foreground mb-4">You haven't posted any gigs yet</p>
                  <Link to="/post-gig">
                    <Button>Post Your First Gig</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="assigned" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Assigned Gigs</CardTitle>
                <CardDescription>
                  Jobs you're currently working on
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10">
                  <p className="text-muted-foreground mb-4">You don't have any assigned gigs</p>
                  <Link to="/gigs">
                    <Button>Find Gigs</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest transactions and platform activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No recent activity</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
