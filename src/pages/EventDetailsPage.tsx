
import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowLeft, Info, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Event, Venue } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { formatEventDate } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";

export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchEventDetails() {
      if (!id) return;
      
      setLoading(true);
      try {
        console.log(`EventDetailsPage: Fetching event with ID ${id}`);
        // Fetch event details
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('*')
          .eq('id', parseInt(id)) // Convert string id to number
          .single();
        
        if (eventError) {
          console.error("EventDetailsPage: Error fetching event:", eventError);
          throw eventError;
        }
        
        if (!eventData) {
          setError("Event not found");
          toast({
            title: "Event not found",
            description: "The event you're looking for doesn't exist or has been removed.",
            variant: "destructive",
          });
          return;
        }
        
        console.log("EventDetailsPage: Event data:", eventData);
        setEvent(eventData);
        
        // Fetch venue details
        console.log(`EventDetailsPage: Fetching venue with ID ${eventData.venue_id}`);
        const { data: venueData, error: venueError } = await supabase
          .from('venues')
          .select('*')
          .eq('id', eventData.venue_id)
          .single();
        
        if (venueError) {
          console.error("EventDetailsPage: Error fetching venue:", venueError);
          throw venueError;
        }
        
        console.log("EventDetailsPage: Venue data:", venueData);
        setVenue(venueData);
      } catch (error) {
        console.error("Error fetching event details:", error);
        setError("Failed to load event details");
        toast({
          title: "Error loading event",
          description: "There was a problem loading the event details. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchEventDetails();
  }, [id, toast]);

  if (loading) {
    return (
      <div className="tulum-container animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-200 h-96 rounded-lg"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="tulum-container text-center py-16">
        <Info size={48} className="mx-auto mb-4 text-tulum-coral" />
        <h2 className="text-2xl font-medium mb-2">{error || "Event not found"}</h2>
        <p className="text-gray-600 mb-8">The event you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/events')}>
          Browse All Events
        </Button>
      </div>
    );
  }

  return (
    <div className="tulum-container">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="mb-4 text-tulum-teal hover:text-tulum-ocean -ml-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} className="mr-1" />
          Back
        </Button>
        
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge className={`
            ${event.category === 'yoga' ? 'bg-tulum-teal/20 text-tulum-teal' : ''}
            ${event.category === 'meditation' ? 'bg-tulum-leaf/20 text-tulum-leaf' : ''}
            ${event.category === 'sound healing' ? 'bg-tulum-sunset/20 text-tulum-sunset' : ''}
            ${event.category === 'workshop' ? 'bg-tulum-coral/20 text-tulum-coral' : ''}
            ${event.category === 'retreat' ? 'bg-tulum-ocean/20 text-tulum-ocean' : ''}
            ${!['yoga', 'meditation', 'sound healing', 'workshop', 'retreat'].includes(event.category) ? 'bg-gray-200 text-gray-600' : ''}
          `}>
            {event.category}
          </Badge>
          {event.price === '0' || event.price === '$0' ? (
            <Badge variant="outline" className="bg-tulum-sand/10 text-gray-700">Free</Badge>
          ) : (
            <Badge variant="outline" className="bg-tulum-sand/10 text-gray-700">{event.price}</Badge>
          )}
          {event.featured && (
            <Badge className="bg-tulum-coral text-white">
              Featured
            </Badge>
          )}
        </div>
        
        <h1 className="tulum-heading mb-2">{event.title}</h1>
      </div>
      
      <div className="grid grid-cols-1 gap-8 mb-12">
        <div>
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-tulum-teal" />
              <span>{formatEventDate(event.date)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock size={20} className="text-tulum-teal" />
              <span>{event.time}</span>
            </div>
            
            {venue && (
              <div>
                <div className="flex items-center gap-2">
                  <MapPin size={20} className="text-tulum-teal" />
                  <Link 
                    to={`/venues/${venue.id}`}
                    className="font-medium hover:text-tulum-teal hover:underline"
                  >
                    {venue.name}
                  </Link>
                </div>
                <p className="text-sm text-gray-500 ml-7">{venue.address}</p>
              </div>
            )}

            {event.instructor && (
              <div className="flex items-center gap-2">
                <User size={20} className="text-tulum-teal" />
                <span>{event.instructor}</span>
              </div>
            )}
          </div>
          
          <div className="prose max-w-none">
            <h3 className="text-xl font-display font-medium text-tulum-ocean mb-2">About This Event</h3>
            <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
          </div>
          
          <div className="mt-8">
            <Button className="bg-tulum-teal hover:bg-tulum-ocean text-white">
              Register for Event
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
