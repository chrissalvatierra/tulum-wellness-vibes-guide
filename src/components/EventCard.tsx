
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, User, Yoga, Leaf, Music, BookOpen, Tent } from 'lucide-react';
import { Event } from '@/types';
import { Badge } from '@/components/ui/badge';
import { formatEventDate } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface EventCardProps {
  event: Event;
  venueNameMap: Record<number, string>;
  featured?: boolean;
}

// Helper function to get the appropriate icon based on category
const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'yoga':
      return <Yoga size={24} className="text-tulum-teal" />;
    case 'meditation':
      return <Leaf size={24} className="text-tulum-leaf" />;
    case 'sound healing':
      return <Music size={24} className="text-tulum-sunset" />;
    case 'workshop':
      return <BookOpen size={24} className="text-tulum-coral" />;
    case 'retreat':
      return <Tent size={24} className="text-tulum-ocean" />;
    default:
      return <Calendar size={24} className="text-gray-500" />;
  }
};

export default function EventCard({ event, venueNameMap, featured = false }: EventCardProps) {
  const categoryIcon = getCategoryIcon(event.category);
  
  return (
    <Card className={`tulum-card group ${featured ? 'md:col-span-2' : ''}`}>
      <CardContent className="pt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gray-100 rounded-full">
            {categoryIcon}
          </div>
          <div className="flex-1">
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
          </div>
          {event.featured && !featured && (
            <Badge className="bg-tulum-coral text-white">Featured</Badge>
          )}
        </div>
        
        <h3 className="text-xl font-display font-medium mb-2 text-tulum-ocean">
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
      </CardContent>
    </Card>
  );
}
