
import { User } from "@/types/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Star, Github, Linkedin, Globe, FileText } from "lucide-react";

interface UserProfileProps {
  user: User;
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <Avatar className="w-24 h-24">
          <AvatarImage src={user.avatar} alt={user.username} />
          <AvatarFallback className="text-lg">{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <h1 className="text-2xl font-bold">{user.username}</h1>
            <Link to="/profile/edit">
              <Button variant="outline" size="sm">Edit Profile</Button>
            </Link>
          </div>
          
          <p className="text-muted-foreground mb-2">{user.address ? `${user.address.substring(0, 6)}...${user.address.substring(user.address.length - 4)}` : 'No wallet connected'}</p>
          
          {user.bio && <p className="mb-3">{user.bio}</p>}
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary">
              {user.credits} Credits
            </Badge>
            
            {user.reputation !== undefined && (
              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 flex items-center">
                <Star className="h-3 w-3 mr-1 fill-yellow-500 text-yellow-500" />
                {user.reputation} Reputation
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {user.skills && user.skills.length > 0 ? (
                user.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-muted-foreground">No skills added yet</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Education</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {user.education && user.education.length > 0 ? (
                user.education.map((edu, index) => (
                  <div key={index}>
                    <p className="font-medium">{edu.degree}</p>
                    <p className="text-sm text-muted-foreground">
                      {edu.institution} • {edu.year}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No education added yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Professional Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {user.links?.github && (
              <a 
                href={user.links.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <Github className="h-5 w-5" />
                GitHub
              </a>
            )}
            
            {user.links?.linkedin && (
              <a 
                href={user.links.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <Linkedin className="h-5 w-5" />
                LinkedIn
              </a>
            )}
            
            {user.links?.portfolio && (
              <a 
                href={user.links.portfolio} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <Globe className="h-5 w-5" />
                Portfolio
              </a>
            )}
            
            {user.resume && (
              <a 
                href={user.resume} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <FileText className="h-5 w-5" />
                Resume
              </a>
            )}
          </div>
          
          {!user.links?.github && !user.links?.linkedin && !user.links?.portfolio && !user.resume && (
            <p className="text-muted-foreground">No professional links added yet</p>
          )}
        </CardContent>
      </Card>
      
      {/* Add completed gigs section if we had that data */}
    </div>
  );
}
