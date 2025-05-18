import { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import EventCard from '@/components/EventCard';
import VenueCard from '@/components/VenueCard';
import { Button } from '@/components/ui/button';
import { Event, Venue } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

export default function HomePage() {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [popularVenues, setPopularVenues] = useState<Venue[]>([]);
  const [venueNameMap, setVenueNameMap] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      
      try {
        console.log("HomePage: Fetching featured events...");
        // Fetch featured events
        const { data: events, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .eq('featured', true)
          .order('date', { ascending: true })
          .limit(3);
        
        if (eventsError) {
          console.error("HomePage: Error fetching featured events:", eventsError);
          throw eventsError;
        }
        
        console.log("HomePage: Featured events data:", events);
        
        // Fetch popular venues
        console.log("HomePage: Fetching venues...");
        const { data: venues, error: venuesError } = await supabase
          .from('venues')
          .select('*')
          .limit(3);
        
        if (venuesError) {
          console.error("HomePage: Error fetching venues:", venuesError);
          throw venuesError;
        }
        
        console.log("HomePage: Venues data:", venues);
        
        // Create venue name map for event cards
        const venueMap: Record<number, string> = {};
        if (venues) {
          venues.forEach(venue => {
            venueMap[venue.id] = venue.name;
          });
        }
        
        setFeaturedEvents(events || []);
        setPopularVenues(venues || []);
        setVenueNameMap(venueMap);
      } catch (error) {
        console.error("HomePage: Error fetching data:", error);
        toast({
          title: "Error loading data",
          description: "There was a problem loading the featured content. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [toast]);

  return (
    <div>
      <Hero />
      
      <section className="tulum-container">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="tulum-heading">Featured Events</h2>
            <p className="tulum-subheading">Discover our curated selection</p>
          </div>
          <Link to="/events">
            <Button variant="ghost" className="text-tulum-teal hover:text-tulum-ocean">
              View all events →
            </Button>
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="tulum-card animate-pulse">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gray-200 h-12 w-12 rounded-full"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredEvents.map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                venueNameMap={venueNameMap} 
              />
            ))}
          </div>
        )}
      </section>
      
      <section className="bg-tulum-sand/10 py-12">
        <div className="tulum-container">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="tulum-heading">Popular Venues</h2>
              <p className="tulum-subheading">Explore wellness spaces in Tulum</p>
            </div>
            <Link to="/venues">
              <Button variant="ghost" className="text-tulum-teal hover:text-tulum-ocean">
                View all venues →
              </Button>
            </Link>
          </div>
          
          {/* Keep the venues section as it was since we're not changing venue cards */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="tulum-card animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {popularVenues.map(venue => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
