import { Media } from "./media";


export interface Sponsor {
  id: number;
  name: string;
  logo: number | Media;
  category: 'gold' | 'silver' | 'bronze' | 'diamond';
  website?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  updatedAt: string;
  createdAt: string;
}