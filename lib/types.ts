export interface Project {
  id: string;
  title: string;
  displayTitle: string;
  tagline: string;
  description: string;
  longDescription: string;
  year: number;
  status: "finished" | "wip";
  type: string;
  genre: string[];
  tech: string[];
  subdomain: string;
  githubUrl?: string;
  liveUrl?: string;
  thumbnail: {
    gradient: string;
    accent: string;
    icon: string;
    bgClass: string;
  };
  matchScore: number;
  maturityRating: string;
  featured?: boolean;
}
