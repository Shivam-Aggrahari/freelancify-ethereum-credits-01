
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/Navbar";
import { Navigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const Mining = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [miningActive, setMiningActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [estimatedEarnings, setEstimatedEarnings] = useState(0);
  
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
  
  const toggleMining = () => {
    if (miningActive) {
      setMiningActive(false);
      setProgress(0);
      toast({
        title: "Mining Stopped",
        description: "Your mining session has been terminated.",
      });
    } else {
      setMiningActive(true);
      simulateMining();
      toast({
        title: "Mining Started",
        description: "Your computer is now mining Ethereum.",
      });
    }
  };
  
  const simulateMining = () => {
    // In a real application, this would connect to a mining pool
    // or set up local mining. For this demo, we'll just simulate progress.
    let currentProgress = 0;
    const interval = setInterval(() => {
      if (currentProgress < 100) {
        currentProgress += 1;
        setProgress(currentProgress);
        setEstimatedEarnings((currentProgress / 100) * 0.0001);
      } else {
        clearInterval(interval);
        toast({
          title: "Mining Cycle Complete",
          description: "You've earned credits from your mining session!",
        });
        setMiningActive(false);
        setProgress(0);
      }
    }, 500);
    
    return () => clearInterval(interval);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2">Mining Dashboard</h1>
        <p className="text-muted-foreground mb-8">
          Earn platform credits by mining Ethereum
        </p>
        
        <Tabs defaultValue="mining">
          <TabsList className="mb-6">
            <TabsTrigger value="mining">Mining</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="convert">Convert</TabsTrigger>
          </TabsList>
          
          <TabsContent value="mining" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mining Status</CardTitle>
                <CardDescription>
                  Start mining to earn platform credits
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-sm text-muted-foreground">Hashrate</p>
                    <p className="text-2xl font-medium">
                      {miningActive ? "32.5 MH/s" : "0 MH/s"}
                    </p>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-sm text-muted-foreground">Est. Daily ETH</p>
                    <p className="text-2xl font-medium">
                      {miningActive ? "0.0005 ETH" : "0 ETH"}
                    </p>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-sm text-muted-foreground">Est. Daily Credits</p>
                    <p className="text-2xl font-medium">
                      {miningActive ? "25 Credits" : "0 Credits"}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={toggleMining} 
                  className={miningActive ? "bg-destructive hover:bg-destructive/90" : ""}
                  variant={miningActive ? "destructive" : "default"}
                >
                  {miningActive ? "Stop Mining" : "Start Mining"}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Current Session</CardTitle>
                <CardDescription>
                  Your current mining session details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Status</span>
                    <span className={miningActive ? "text-green-500" : "text-red-500"}>
                      {miningActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Session Duration</span>
                    <span>{miningActive ? `${Math.floor(progress / 10)}m ${progress % 10 * 6}s` : "0m 0s"}</span>
                  </div>
                  
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Estimated Earnings</span>
                    <span>{estimatedEarnings.toFixed(6)} ETH</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Credit Conversion</span>
                    <span>{Math.floor(estimatedEarnings * 50000)} Credits</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="stats" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mining Statistics</CardTitle>
                <CardDescription>
                  Your historical mining performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10">
                  <p className="text-muted-foreground mb-4">No mining history available</p>
                  <p className="text-sm">Start mining to see your statistics</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="convert" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Convert ETH to Credits</CardTitle>
                <CardDescription>
                  Exchange your mined Ethereum for platform credits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10">
                  <p className="text-muted-foreground mb-4">No ETH available for conversion</p>
                  <p className="text-sm">Mine Ethereum first to convert it to credits</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Mining;
