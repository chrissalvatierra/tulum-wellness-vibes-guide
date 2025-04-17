
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { Event } from '@/types';
import { Badge } from '@/components/ui/badge';
import { formatEventDate } from '@/lib/utils';

interface EventCardProps {
  event: Event;
  venueNameMap: Record<number, string>;
  featured?: boolean;
}

export default function EventCard({ event, venueNameMap, featured = false }: EventCardProps) {
  return (
    <div 
      className={`tulum-card group ${featured ? 'md:col-span-2 md:flex gap-6' : ''}`}
    >
      <div className={`relative overflow-hidden rounded-lg mb-4 ${featured ? 'md:w-1/2' : ''}`}>
        <img 
          src={event.image_url || "/placeholder.svg"} 
          alt={event.title}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {event.featured && !featured && (
          <Badge className="absolute top-2 right-2 bg-tulum-coral text-white">
            Featured
          </Badge>
        )}
      </div>
      
      <div className={`${featured ? 'md:w-1/2' : ''}`}>
        <div className="flex items-center gap-2 mb-2">
          <Link 
            to={`/events?category=${encodeURIComponent(event.category)}`}
            className="inline-block"
          >
            <Badge className={`
              cursor-pointer hover:opacity-80 transition-opacity
              ${event.category === 'yoga' ? 'bg-tulum-teal/20 text-tulum-teal hover:bg-tulum-teal/30' : ''}
              ${event.category === 'meditation' ? 'bg-tulum-leaf/20 text-tulum-leaf hover:bg-tulum-leaf/30' : ''}
              ${event.category === 'sound healing' ? 'bg-tulum-sunset/20 text-tulum-sunset hover:bg-tulum-sunset/30' : ''}
              ${event.category === 'workshop' ? 'bg-tulum-coral/20 text-tulum-coral hover:bg-tulum-coral/30' : ''}
              ${event.category === 'retreat' ? 'bg-tulum-ocean/20 text-tulum-ocean hover:bg-tulum-ocean/30' : ''}
              ${!['yoga', 'meditation', 'sound healing', 'workshop', 'retreat'].includes(event.category) ? 'bg-gray-200 text-gray-600 hover:bg-gray-300' : ''}
            `}>
              {event.category}
            </Badge>
          </Link>
          {event.price === '0' || event.price === '$0' ? (
            <Badge variant="outline" className="bg-tulum-sand/10 text-gray-700">Free</Badge>
          ) : (
            <Badge variant="outline" className="bg-tulum-sand/10 text-gray-700">{event.price}</Badge>
          )}
        </div>
        
        <h3 className="text-xl font-display font-medium mb-2 text-tulum-ocean line-clamp-1">
          {event.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar size={16} className="text-tulum-teal" />
            <span>{formatEventDate(event.date)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock size={16} className="text-tulum-teal" />
            <span>{event.time}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin size={16} className="text-tulum-teal" />
            <span>{venueNameMap[event.venue_id] || 'Unknown location'}</span>
          </div>
          
          {event.instructor && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <User size={16} className="text-tulum-teal" />
              <span>Instructor: {event.instructor}</span>
            </div>
          )}
        </div>
        
        <Link 
          to={`/events/${event.id}`} 
          className="inline-block text-tulum-teal font-medium hover:text-tulum-ocean hover:underline transition-colors"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}
