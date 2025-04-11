
import { useState, useEffect, useMemo } from 'react';
import EventCard from '@/components/EventCard';
import FilterBar, { EventFilters } from '@/components/FilterBar';
import { Event, Venue } from '@/types';
import { supabase } from '@/lib/supabase';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [venueNameMap, setVenueNameMap] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<EventFilters>({
    search: '',
    eventTypes: [],
    priceRange: [0, null],
  });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch all events
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: true });
        
        if (eventsError) throw eventsError;
        
        // Fetch all venues to create name map
        const { data: venuesData, error: venuesError } = await supabase
          .from('venues')
          .select('id, name');
        
        if (venuesError) throw venuesError;
        
        // Create venue name map
        const venueMap: Record<number, string> = {};
        venuesData.forEach((venue: Venue) => {
          venueMap[venue.id] = venue.name;
        });
        
        setEvents(eventsData);
        setVenueNameMap(venueMap);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  // Apply filters to events
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Apply search filter
      if (filters.search && !event.title.toLowerCase().includes(filters.search.toLowerCase()) &&
          !event.description.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      // Apply event type filter
      if (filters.eventTypes.length > 0 && !filters.eventTypes.includes(event.event_type)) {
        return false;
      }
      
      // Apply price filter
      const [min, max] = filters.priceRange;
      if (event.price < min) return false;
      if (max !== null && event.price > max) return false;
      
      return true;
    });
  }, [events, filters]);

  return (
    <div className="tulum-container">
      <div className="mb-8">
        <h1 className="tulum-heading">Upcoming Events</h1>
        <p className="tulum-subheading">Explore wellness events in Tulum</p>
      </div>
      
      <FilterBar onFilterChange={setFilters} />
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="tulum-card animate-pulse">
              <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <EventCard 
              key={event.id} 
              event={event} 
              venueNameMap={venueNameMap} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-medium text-gray-600 mb-2">No events found</h3>
          <p className="text-gray-500">Try adjusting your filters to find events</p>
        </div>
      )}
    </div>
  );
}
