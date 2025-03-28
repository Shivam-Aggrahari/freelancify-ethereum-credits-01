
import { GigList } from "@/components/GigList";
import { Navbar } from "@/components/Navbar";

const Gigs = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2">Available Gigs</h1>
        <p className="text-muted-foreground mb-8">
          Browse and apply for freelance opportunities
        </p>
        
        <GigList />
      </main>
    </div>
  );
};

export default Gigs;
