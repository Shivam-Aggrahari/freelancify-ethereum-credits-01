
import { User } from "@/types/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
          <h1 className="text-2xl font-bold mb-1">{user.username}</h1>
          <p className="text-muted-foreground mb-2">{user.address ? `${user.address.substring(0, 6)}...${user.address.substring(user.address.length - 4)}` : 'No wallet connected'}</p>
          
          {user.bio && <p className="mb-3">{user.bio}</p>}
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-web3-blue/10 text-web3-blue">
              {user.credits} Credits
            </Badge>
            
            {user.reputation && (
              <Badge variant="outline" className="bg-web3-green/10 text-web3-green">
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
          <CardTitle>Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {user.links?.github && (
              <a 
                href={user.links.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-web3-blue hover:underline"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                GitHub
              </a>
            )}
            
            {user.links?.linkedin && (
              <a 
                href={user.links.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-web3-blue hover:underline"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
                </svg>
                LinkedIn
              </a>
            )}
            
            {user.links?.portfolio && (
              <a 
                href={user.links.portfolio} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-web3-blue hover:underline"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                Portfolio
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
