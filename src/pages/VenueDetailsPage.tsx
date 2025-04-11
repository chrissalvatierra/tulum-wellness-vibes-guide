
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, ArrowLeft, Info, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Event, Venue } from '@/types';
import { supabase } from '@/lib/supabase';
import EventCard from '@/components/EventCard';

export default function VenueDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [venueEvents, setVenueEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVenueDetails() {
      if (!id) return;
      
      setLoading(true);
      try {
        // Fetch venue details
        const { data: venueData, error: venueError } = await supabase
          .from('venues')
          .select('*')
          .eq('id', id)
          .single();
        
        if (venueError) throw venueError;
        if (!venueData) {
          setError("Venue not found");
          return;
        }
        
        setVenue(venueData);
        
        // Fetch events at this venue
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .eq('venue_id', venueData.id)
          .order('date', { ascending: true });
        
        if (eventsError) throw eventsError;
        setVenueEvents(eventsData);
      } catch (error) {
        console.error("Error fetching venue details:", error);
        setError("Failed to load venue details");
      } finally {
        setLoading(false);
      }
    }
    
    fetchVenueDetails();
  }, [id]);

  // Create venue name map for event cards
  const venueNameMap: Record<number, string> = {};
  if (venue) {
    venueNameMap[venue.id] = venue.name;
  }

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

  if (error || !venue) {
    return (
      <div className="tulum-container text-center py-16">
        <Info size={48} className="mx-auto mb-4 text-tulum-coral" />
        <h2 className="text-2xl font-medium mb-2">{error || "Venue not found"}</h2>
        <p className="text-gray-600 mb-8">The venue you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/venues')}>
          Browse All Venues
        </Button>
      </div>
    );
  }

  return (
    <div className="tulum-container">
      <Button 
        variant="ghost" 
        className="mb-6 text-tulum-teal hover:text-tulum-ocean -ml-2"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={18} className="mr-1" />
        Back
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="rounded-lg overflow-hidden shadow-md">
          <img 
            src={venue.image_url || "/placeholder.svg"} 
            alt={venue.name}
            className="w-full h-auto object-cover"
          />
        </div>
        
        <div>
          <h1 className="tulum-heading mb-4">{venue.name}</h1>
          
          <div className="flex items-start gap-2 mb-6">
            <MapPin size={20} className="text-tulum-teal mt-1 flex-shrink-0" />
            <p className="text-gray-700">{venue.address}</p>
          </div>
          
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-line">{venue.description}</p>
          </div>
        </div>
      </div>
      
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <Calendar size={24} className="text-tulum-teal" />
          <h2 className="text-2xl font-display font-medium text-tulum-ocean">
            Upcoming Events at {venue.name}
          </h2>
        </div>
        
        {venueEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {venueEvents.map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                venueNameMap={venueNameMap} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No upcoming events at this venue</p>
          </div>
        )}
      </div>
    </div>
  );
}
