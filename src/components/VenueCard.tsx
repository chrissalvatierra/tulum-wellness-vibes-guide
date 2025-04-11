
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { Venue } from '@/types';

interface VenueCardProps {
  venue: Venue;
}

export default function VenueCard({ venue }: VenueCardProps) {
  return (
    <div className="tulum-card h-full flex flex-col">
      <div className="relative overflow-hidden rounded-lg mb-4 h-48">
        <img 
          src={venue.image_url || "/placeholder.svg"} 
          alt={venue.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      
      <h3 className="text-xl font-display font-medium mb-2 text-tulum-ocean">
        {venue.name}
      </h3>
      
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
        <MapPin size={16} className="text-tulum-teal" />
        <span>{venue.address}</span>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">{venue.description}</p>
      
      <Link 
        to={`/venues/${venue.id}`} 
        className="inline-block text-tulum-teal font-medium hover:text-tulum-ocean hover:underline transition-colors mt-auto"
      >
        View Venue →
      </Link>
    </div>
  );
}
