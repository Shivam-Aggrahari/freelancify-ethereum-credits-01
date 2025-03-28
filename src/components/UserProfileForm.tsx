
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { Education } from "@/types/user";

export function UserProfileForm() {
  const { user, updateProfile } = useAuth();
  
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
      github: user?.links.github || "",
      linkedin: user?.links.linkedin || "",
      portfolio: user?.links.portfolio || "",
    },
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const profileData = {
      username: formData.username,
      bio: formData.bio,
      skills: formData.skills,
      education: formData.education,
      links: formData.links,
    };
    
    await updateProfile(profileData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Basic Information</h2>
        
        <div className="space-y-2">
          <label htmlFor="username" className="block text-sm font-medium">Username</label>
          <Input
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Your username"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="bio" className="block text-sm font-medium">Bio</label>
          <Textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself"
            rows={4}
          />
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
        <h2 className="text-xl font-semibold">Links</h2>
        
        <div className="space-y-2">
          <label htmlFor="github" className="block text-sm font-medium">GitHub</label>
          <Input
            id="github"
            name="links.github"
            value={formData.links.github}
            onChange={handleChange}
            placeholder="https://github.com/yourusername"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="linkedin" className="block text-sm font-medium">LinkedIn</label>
          <Input
            id="linkedin"
            name="links.linkedin"
            value={formData.links.linkedin}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/yourusername"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="portfolio" className="block text-sm font-medium">Portfolio</label>
          <Input
            id="portfolio"
            name="links.portfolio"
            value={formData.links.portfolio}
            onChange={handleChange}
            placeholder="https://yourportfolio.com"
          />
        </div>
      </div>
      
      <Button type="submit" className="w-full">Save Profile</Button>
    </form>
  );
}
