
import { useState } from "react";
import { Link } from "react-router-dom";
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
import { Menu, X, User, LogOut } from "lucide-react";

export function Navbar() {
  const { user, isAuthenticated, disconnectWallet } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
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
                <DropdownMenuItem>
                  <Link to="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/dashboard" className="flex items-center">
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={disconnectWallet}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
              <button
                onClick={() => {
                  disconnectWallet();
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
}
