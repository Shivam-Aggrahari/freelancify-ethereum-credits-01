
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export function GigForm() {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    credits: 100,
  });
  
  const categories = [
    "Web Development",
    "Mobile Development",
    "UI/UX Design",
    "Writing & Translation",
    "Data Science",
    "Blockchain Development",
    "Smart Contract Audit",
    "NFT Design",
    "Marketing",
    "Other",
  ];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCreditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setFormData(prev => ({ ...prev, credits: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for your gig",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.description.trim()) {
      toast({
        title: "Error",
        description: "Please enter a description for your gig",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.category) {
      toast({
        title: "Error",
        description: "Please select a category for your gig",
        variant: "destructive",
      });
      return;
    }
    
    if (formData.credits < 50) {
      toast({
        title: "Error",
        description: "Minimum credit amount is 50",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      const { data, error } = await supabase
        .from('gigs')
        .insert({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          credits: formData.credits,
          created_by: user.id,
          status: 'open'
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Success!",
        description: "Your gig has been posted successfully",
      });
      
      // Navigate to the gig detail page
      navigate(`/gig/${data.id}`);
    } catch (error) {
      console.error("Error posting gig:", error);
      toast({
        title: "Error",
        description: "Failed to post your gig. Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium">Title</label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="E.g., Build a responsive landing page"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium">Description</label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Provide details about your gig..."
          rows={6}
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="category" className="block text-sm font-medium">Category</label>
        <Select
          value={formData.category}
          onValueChange={(value) => handleSelectChange("category", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="credits" className="block text-sm font-medium">Credits</label>
        <div className="flex items-center gap-2">
          <Input
            id="credits"
            name="credits"
            type="number"
            min={50}
            value={formData.credits}
            onChange={handleCreditChange}
          />
          <span className="text-sm text-muted-foreground">Min: 50</span>
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Posting...
          </>
        ) : (
          "Post Gig"
        )}
      </Button>
    </form>
  );
}
