
export interface User {
  id: string;
  address: string;
  username: string;
  credits: number;
  avatar?: string;
  bio?: string;
  skills: string[];
  education: Education[];
  links: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
  };
  reputation?: number;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface Gig {
  id: string;
  title: string;
  description: string;
  category: string;
  credits: number;
  createdBy: string;
  createdAt: Date;
  status: 'open' | 'assigned' | 'completed';
  assignedTo?: string;
}
