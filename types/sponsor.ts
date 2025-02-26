import { Media } from "./media";


export interface Sponsor {
  id: string;
  name: string;
  logo: Media;
  category: 'gold' | 'silver' | 'bronze' | 'diamond';
  website?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  updatedAt: string;
  createdAt: string;
}

