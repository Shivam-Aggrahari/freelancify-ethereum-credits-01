
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
  resume?: string;
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

export interface Application {
  id: string;
  user_id: string;
  gig_id: string;
  cover_letter: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
}
