
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Upload, Loader2 } from "lucide-react";
import { Education } from "@/types/user";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserProfileForm() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  
  const [formData, setFormData] = useState({
    username: user?.username || "",
    bio: user?.bio || "",
    newSkill: "",
    skills: user?.skills || [],
    education: user?.education || [],
    newDegree: "",
    newInstitution: "",
    newYear: "",
    links: {
      github: user?.links?.github || "",
      linkedin: user?.links?.linkedin || "",
      portfolio: user?.links?.portfolio || "",
    },
    resume: user?.resume || "",
    avatar: user?.avatar || "",
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, unknown>),
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const addSkill = () => {
    if (formData.newSkill.trim() && !formData.skills.includes(formData.newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, prev.newSkill.trim()],
        newSkill: "",
      }));
    }
  };
  
  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill),
    }));
  };
  
  const addEducation = () => {
    if (formData.newDegree.trim() && formData.newInstitution.trim() && formData.newYear.trim()) {
      const newEducation: Education = {
        degree: formData.newDegree.trim(),
        institution: formData.newInstitution.trim(),
        year: formData.newYear.trim(),
      };
      
      setFormData(prev => ({
        ...prev,
        education: [...prev.education, newEducation],
        newDegree: "",
        newInstitution: "",
        newYear: "",
      }));
    }
  };
  
  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };
  
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file size (3MB max)
    if (file.size > 3 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Avatar image must be less than 3MB",
        variant: "destructive",
      });
      return;
    }
    
    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast({
        title: "Error",
        description: "Avatar must be a JPEG, PNG, or WebP image",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setUploadingAvatar(true);
      
      // Upload to Supabase Storage
      const fileName = `avatar_${user?.id}_${Date.now()}`;
      const { data, error } = await supabase.storage
        .from('profiles')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) throw error;
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('profiles')
        .getPublicUrl(data.path);
      
      setFormData(prev => ({
        ...prev,
        avatar: publicUrlData.publicUrl
      }));
      
      toast({
        title: "Avatar uploaded",
        description: "Your avatar has been uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your avatar",
        variant: "destructive",
      });
    } finally {
      setUploadingAvatar(false);
    }
  };
  
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Resume must be less than 5MB",
        variant: "destructive",
      });
      return;
    }
    
    // Validate file type
    if (!['application/pdf'].includes(file.type)) {
      toast({
        title: "Error",
        description: "Resume must be a PDF file",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setUploadingResume(true);
      
      // Upload to Supabase Storage
      const fileName = `resume_${user?.id}_${Date.now()}.pdf`;
      const { data, error } = await supabase.storage
        .from('profiles')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) throw error;
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('profiles')
        .getPublicUrl(data.path);
      
      setFormData(prev => ({
        ...prev,
        resume: publicUrlData.publicUrl
      }));
      
      toast({
        title: "Resume uploaded",
        description: "Your resume has been uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your resume",
        variant: "destructive",
      });
    } finally {
      setUploadingResume(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsUpdating(true);
      
      const profileData = {
        username: formData.username,
        bio: formData.bio,
        skills: formData.skills,
        education: formData.education,
        links: formData.links,
        avatar: formData.avatar,
        resume: formData.resume,
      };
      
      await updateProfile(profileData);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({
        title: "Update failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Basic Information</h2>
        
        <div className="flex flex-col md:flex-row gap-6 items-center mb-4">
          <div className="relative">
            <Avatar className="w-24 h-24">
              <AvatarImage src={formData.avatar} />
              <AvatarFallback className="text-lg">
                {formData.username ? formData.username.substring(0, 2).toUpperCase() : "??"}
              </AvatarFallback>
            </Avatar>
            
            <Label
              htmlFor="avatar-upload"
              className="absolute -bottom-2 -right-2 bg-primary text-white p-1.5 rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
            >
              {uploadingAvatar ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
            </Label>
            
            <Input
              id="avatar-upload"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={handleAvatarUpload}
              disabled={uploadingAvatar}
            />
          </div>
          
          <div className="space-y-2 flex-1">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Your username"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell potential clients about yourself, your expertise, and your work experience"
            rows={4}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Resume</h2>
        
        <div className="space-y-2">
          <Label htmlFor="resume-upload" className="block text-sm font-medium">
            Upload your resume (PDF, max 5MB)
          </Label>
          
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              id="resume-upload"
              type="file"
              accept="application/pdf"
              className="flex-1"
              onChange={handleResumeUpload}
              disabled={uploadingResume}
            />
            
            {uploadingResume && (
              <Button variant="outline" disabled>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Uploading...
              </Button>
            )}
          </div>
          
          {formData.resume && (
            <Card className="mt-2">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <div className="mr-2 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file">
                      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
                      <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
                    </svg>
                  </div>
                  <span className="truncate max-w-[200px]">Resume</span>
                </div>
                
                <div className="flex gap-2">
                  <a
                    href={formData.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80"
                  >
                    View
                  </a>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Skills</h2>
        
        <div className="flex gap-2">
          <Input
            name="newSkill"
            value={formData.newSkill}
            onChange={handleChange}
            placeholder="Add a skill"
          />
          <Button type="button" onClick={addSkill}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {formData.skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1 py-1.5">
              {skill}
              <button 
                type="button" 
                onClick={() => removeSkill(skill)}
                className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {formData.skills.length === 0 && (
            <p className="text-sm text-muted-foreground">No skills added yet</p>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Education</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Input
            name="newDegree"
            value={formData.newDegree}
            onChange={handleChange}
            placeholder="Degree"
          />
          <Input
            name="newInstitution"
            value={formData.newInstitution}
            onChange={handleChange}
            placeholder="Institution"
          />
          <div className="flex gap-2">
            <Input
              name="newYear"
              value={formData.newYear}
              onChange={handleChange}
              placeholder="Year"
            />
            <Button type="button" onClick={addEducation}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          {formData.education.map((edu, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-md">
              <div>
                <p className="font-medium">{edu.degree}</p>
                <p className="text-sm text-muted-foreground">
                  {edu.institution} • {edu.year}
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => removeEducation(index)}
                className="hover:bg-gray-200 p-1 rounded-full"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          {formData.education.length === 0 && (
            <p className="text-sm text-muted-foreground">No education added yet</p>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Professional Links</h2>
        
        <div className="space-y-2">
          <Label htmlFor="github">GitHub</Label>
          <Input
            id="github"
            name="links.github"
            value={formData.links.github}
            onChange={handleChange}
            placeholder="https://github.com/yourusername"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input
            id="linkedin"
            name="links.linkedin"
            value={formData.links.linkedin}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/yourusername"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="portfolio">Portfolio</Label>
          <Input
            id="portfolio"
            name="links.portfolio"
            value={formData.links.portfolio}
            onChange={handleChange}
            placeholder="https://yourportfolio.com"
          />
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={isUpdating}>
        {isUpdating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Profile"
        )}
      </Button>
    </form>
  );
}
