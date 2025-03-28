
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/Navbar";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Login = () => {
  const { loginWithGoogle, connectWallet, isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("google");
  const [error, setError] = useState<string | null>(null);
  const [showConnectWallet, setShowConnectWallet] = useState(false);
  
  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      await loginWithGoogle();
      // Redirect is handled by Supabase OAuth flow
    } catch (error) {
      console.error("Failed to login with Google:", error);
      setError("Google login failed. Please try again.");
    }
  };
  
  const handleWalletConnect = async () => {
    try {
      setError(null);
      await connectWallet();
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      setError("Failed to connect wallet. Please ensure MetaMask is installed and try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
            <CardDescription>
              First authenticate with Google, then connect your wallet
            </CardDescription>
          </CardHeader>
          
          {error && (
            <Alert variant="destructive" className="mx-6 mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}
          
          {!user ? (
            <CardContent className="py-4">
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Sign in with your Google account first
                  </p>
                </div>
                
                <Button
                  onClick={handleGoogleLogin}
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : null}
                  <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                  </svg>
                  Sign in with Google
                </Button>
              </div>
            </CardContent>
          ) : !user.address ? (
            <CardContent className="py-4">
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Now connect your Ethereum wallet
                  </p>
                </div>
                
                <Button
                  onClick={handleWalletConnect}
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : null}
                  Connect with MetaMask
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/dashboard")}
                >
                  Skip for now
                </Button>
              </div>
            </CardContent>
          ) : (
            <CardContent className="py-4">
              <div className="space-y-4 text-center">
                <p className="text-green-600 font-medium">You're all set!</p>
                <Button
                  onClick={() => navigate("/dashboard")}
                  className="w-full"
                >
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          )}
          
          <CardFooter className="flex flex-col space-y-4 border-t p-6">
            <div className="text-sm text-center text-muted-foreground">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default Login;
