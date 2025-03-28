
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Decentralized Freelancing with <span className="web3-gradient bg-clip-text text-transparent">Ethereum</span> Power
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Connect your skills to the blockchain economy. Earn platform credits through
              mining Ethereum or completing freelance tasks.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/gigs">
                <Button size="lg" className="w-full sm:w-auto">Find Jobs</Button>
              </Link>
              <Link to="/post-gig">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">Post a Job</Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Features */}
        <section className="py-16 px-6 bg-muted">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-sm text-center">
                <div className="w-16 h-16 rounded-full bg-web3-blue/10 text-web3-blue flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Connect Wallet</h3>
                <p className="text-muted-foreground">Sign up using MetaMask or WalletConnect to create your decentralized identity.</p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm text-center">
                <div className="w-16 h-16 rounded-full bg-web3-green/10 text-web3-green flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Post or Find Gigs</h3>
                <p className="text-muted-foreground">Create job listings or browse available opportunities in our decentralized marketplace.</p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm text-center">
                <div className="w-16 h-16 rounded-full bg-web3-blue/10 text-web3-blue flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Earn Credits</h3>
                <p className="text-muted-foreground">Get paid in platform credits, which you can also earn through Ethereum mining.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-20 px-6 bg-gradient-to-r from-web3-dark to-web3-blue text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to join the decentralized economy?</h2>
            <p className="text-lg max-w-2xl mx-auto mb-8">
              Connect your wallet now and start earning credits through mining or freelancing.
            </p>
            <Link to="/login">
              <Button size="lg" variant="secondary">Get Started</Button>
            </Link>
          </div>
        </section>
      </main>
      
      <footer className="py-8 px-6 bg-card border-t">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">
            &copy; {new Date().getFullYear()} FreelancifyETH. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
