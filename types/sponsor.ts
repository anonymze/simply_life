import { Media } from "./media";


export interface Sponsor {
  id: string;
  name: string;
  logo: Media;
  categories: SponsorCategory[];
  website?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  updatedAt: string;
  createdAt: string;
}

export interface SponsorCategory {
  id: string;
  name: string;
}
