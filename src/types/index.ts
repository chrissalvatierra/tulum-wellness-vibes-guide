
export interface Event {
  id: number;
  title: string;
  description: string;
  category: string;  // Changed from event_type to category to match DB schema
  date: string;
  time: string;
  venue_id: number;
  price: string;  // Changed from number to string to match DB schema
  image_url: string;
  featured: boolean;
  created_at: string;
  instructor: string | null;
}

export interface Venue {
  id: number;
  name: string;
  address: string;
  description: string;
  image_url: string;
  created_at: string;
}
