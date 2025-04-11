
export interface Event {
  id: number;
  title: string;
  description: string;
  event_type: string;
  date: string;
  time: string;
  venue_id: number;
  price: number;
  image_url: string;
  featured: boolean;
  created_at: string;
}

export interface Venue {
  id: number;
  name: string;
  address: string;
  description: string;
  image_url: string;
  created_at: string;
}
