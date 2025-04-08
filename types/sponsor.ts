import { Media } from "./media";


export interface Sponsor {
  id: string;
  name: string;
  logo: Media;
  category: SponsorCategory;
  website?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;
  phone?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SponsorCategory {
  id: string;
  name: string;
}
