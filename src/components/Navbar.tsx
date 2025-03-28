
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, X, User, LogOut, Wallet } from "lucide-react";
import { Web3Service } from "@/services/web3Service";

export function Navbar() {
  const { user, isAuthenticated, logout, connectWallet } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Fetch wallet balance
  useEffect(() => {
    const fetchBalance = async () => {
      if (user?.address) {
        try {
          const web3Service = new Web3Service();
          const balance = await web3Service.getBalance(user.address);
          setWalletBalance(balance);
        } catch (error) {
          console.error("Error fetching wallet balance:", error);
        }
      } else {
        setWalletBalance(null);
      }
    };
    
    fetchBalance();
    // Set up a poll to update balance every 30 seconds
    const intervalId = setInterval(fetchBalance, 30000);
    
    return () => clearInterval(intervalId);
  }, [user?.address]);
  
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  
  const handleConnectWallet = async () => {
    if (!user?.address) {
      await connectWallet();
    }
  };
  
  return (
    <nav className="border-b py-4 px-6 bg-background">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-web3-blue">
          FreelancifyETH
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/gigs" className="hover:text-web3-blue">
            Find Gigs
          </Link>
          <Link to="/post-gig" className="hover:text-web3-blue">
            Post a Gig
          </Link>
          <Link to="/mining" className="hover:text-web3-blue">
            Mining
          </Link>
          
          {isAuthenticated ? (
            <>
              {user?.address && walletBalance && (
                <div className="flex items-center text-sm font-medium px-3 py-1 bg-web3-blue/10 text-web3-blue rounded-full">
                  <Wallet className="h-3.5 w-3.5 mr-1.5" />
                  {walletBalance} ETH
                </div>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} alt={user?.username} />
                      <AvatarFallback>{user?.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user?.username}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user?.address ? 
                          `${user.address.substring(0, 6)}...${user.address.substring(user.address.length - 4)}` : 
                          "No wallet connected"}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center">
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  {!user?.address && (
                    <DropdownMenuItem onClick={handleConnectWallet}>
                      <Wallet className="mr-2 h-4 w-4" />
                      <span>Connect Wallet</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link to="/login">
              <Button>Connect</Button>
            </Link>
          )}
        </div>
        
        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden mt-4 px-6 py-4 space-y-4 bg-background">
          <Link
            to="/gigs"
            className="block hover:text-web3-blue"
            onClick={() => setIsOpen(false)}
          >
            Find Gigs
          </Link>
          <Link
            to="/post-gig"
            className="block hover:text-web3-blue"
            onClick={() => setIsOpen(false)}
          >
            Post a Gig
          </Link>
          <Link
            to="/mining"
            className="block hover:text-web3-blue"
            onClick={() => setIsOpen(false)}
          >
            Mining
          </Link>
          
          {isAuthenticated ? (
            <>
              {user?.address && walletBalance && (
                <div className="flex items-center text-sm font-medium py-1 text-web3-blue">
                  <Wallet className="h-3.5 w-3.5 mr-1.5" />
                  {walletBalance} ETH
                </div>
              )}
              <Link
                to="/profile"
                className="block hover:text-web3-blue"
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>
              <Link
                to="/dashboard"
                className="block hover:text-web3-blue"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              {!user?.address && (
                <button
                  onClick={() => {
                    handleConnectWallet();
                    setIsOpen(false);
                  }}
                  className="block text-left w-full hover:text-web3-blue"
                >
                  Connect Wallet
                </button>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="block text-left w-full hover:text-web3-blue"
              >
                Log out
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setIsOpen(false)}>
              <Button>Connect</Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};
