
import { useState, useEffect, useMemo } from 'react';
import EventCard from '@/components/EventCard';
import FilterBar, { EventFilters } from '@/components/FilterBar';
import { Event, Venue } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [venueNameMap, setVenueNameMap] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [filters, setFilters] = useState<EventFilters>({
    search: '',
    categories: [],
    priceRange: [0, null],
  });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        console.log("Fetching events from Supabase...");
        // Fetch all events
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: true });
        
        if (eventsError) {
          console.error("Supabase event fetch error:", eventsError);
          toast({
            title: "Error fetching events",
            description: eventsError.message,
            variant: "destructive",
          });
          throw eventsError;
        }
        
        console.log("Events data:", eventsData);
        
        // Fetch all venues to create name map
        const { data: venuesData, error: venuesError } = await supabase
          .from('venues')
          .select('id, name');
        
        if (venuesError) {
          console.error("Supabase venues fetch error:", venuesError);
          toast({
            title: "Error fetching venues",
            description: venuesError.message,
            variant: "destructive",
          });
          throw venuesError;
        }
        
        console.log("Venues data:", venuesData);
        
        // Create venue name map
        const venueMap: Record<number, string> = {};
        venuesData.forEach((venue: Venue) => {
          venueMap[venue.id] = venue.name;
        });
        
        // If there's no data, create some sample data
        if ((!eventsData || eventsData.length === 0) && (!venuesData || venuesData.length === 0)) {
          console.log("No data found, creating sample data...");
          await createSampleData();
          // Re-fetch data after creating samples
          const { data: newEvents } = await supabase.from('events').select('*').order('date', { ascending: true });
          const { data: newVenues } = await supabase.from('venues').select('id, name');
          
          if (newEvents && newEvents.length > 0) {
            setEvents(newEvents as Event[]);
            
            // Update venue map
            const newVenueMap: Record<number, string> = {};
            if (newVenues) {
              newVenues.forEach((venue: Venue) => {
                newVenueMap[venue.id] = venue.name;
              });
              setVenueNameMap(newVenueMap);
            }
          }
        } else {
          setEvents(eventsData as Event[]);
          setVenueNameMap(venueMap);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        toast({
          title: "Error loading data",
          description: "There was a problem loading the events. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [toast]);
  
  // Apply filters to events
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Apply search filter
      if (filters.search && !event.title.toLowerCase().includes(filters.search.toLowerCase()) &&
          !event.description.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      // Apply category filter
      if (filters.categories.length > 0 && !filters.categories.includes(event.category)) {
        return false;
      }
      
      // Apply price filter
      const [min, max] = filters.priceRange;
      const eventPrice = parseFloat(event.price.replace('$', ''));
      if (isNaN(eventPrice)) return true; // Skip price filtering if price is not a valid number
      if (eventPrice < min) return false;
      if (max !== null && eventPrice > max) return false;
      
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

// Function to create sample data in Supabase
async function createSampleData() {
  console.log("Creating sample venues");
  // First, create some sample venues
  const venues = [
    {
      name: "Azulik Cenote",
      address: "Carretera Tulum-Boca Paila Km. 5, Tulum",
      description: "A sacred natural cenote surrounded by jungle, perfect for healing sessions and connecting with nature.",
      image_url: "https://images.unsplash.com/photo-1607029222095-3c2a9c2d3dbf?q=80&w=1000&auto=format&fit=crop",
    },
    {
      name: "Holistika Sanctuary",
      address: "Av. 10 Sur, entre calles 1a y 3 Sur, Tulum",
      description: "An eco-friendly wellness center with yoga shalas and meditation spaces integrated into the jungle.",
      image_url: "https://images.unsplash.com/photo-1528275866426-2ed9a4094c18?q=80&w=1000&auto=format&fit=crop",
    },
    {
      name: "Papaya Playa Beach",
      address: "Carretera Tulum-Boca Paila Km. 4.5, Tulum",
      description: "An oceanfront location with pristine beaches and natural settings for sunrise ceremonies and workshops.",
      image_url: "https://images.unsplash.com/photo-1546708676-03fff85425b6?q=80&w=1000&auto=format&fit=crop",
    }
  ];

  // Insert venues and get their IDs
  const { data: venueData, error: venueError } = await supabase
    .from('venues')
    .insert(venues)
    .select();

  if (venueError) {
    console.error("Error creating venues:", venueError);
    return;
  }

  if (!venueData || venueData.length === 0) {
    console.error("No venue data returned after insert");
    return;
  }

  console.log("Created venues:", venueData);

  // Now create some events using the venue IDs
  const currentDate = new Date();
  const events = [
    {
      title: "Full Moon Meditation Circle",
      description: "Join our monthly full moon meditation circle to harness the powerful energies of the lunar cycle. This guided session combines breathwork, intention setting, and silent meditation.",
      category: "meditation",
      date: new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
      time: "19:00",
      venue_id: venueData[0].id,
      price: "$0",
      image_url: "https://images.unsplash.com/photo-1536623975707-c4b3b2af565d?q=80&w=1000&auto=format&fit=crop",
      featured: true,
      instructor: "Luna Flores"
    },
    {
      title: "Jungle Yoga Flow",
      description: "Experience a revitalizing vinyasa flow in the heart of the Tulum jungle. Connect with nature while moving through a sequence designed to energize the body and calm the mind.",
      category: "yoga",
      date: new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
      time: "08:00",
      venue_id: venueData[1].id,
      price: "$25",
      image_url: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=1000&auto=format&fit=crop",
      featured: false,
      instructor: "Carlos Mendez"
    },
    {
      title: "Cacao Ceremony & Sound Healing",
      description: "A sacred cacao ceremony followed by a deeply restorative sound bath using crystal bowls, gongs, and shamanic instruments to facilitate healing and inner journey work.",
      category: "sound healing",
      date: new Date(currentDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days from now
      time: "18:30",
      venue_id: venueData[2].id,
      price: "$40",
      image_url: "https://images.unsplash.com/photo-1519930041497-9c35eb04888c?q=80&w=1000&auto=format&fit=crop",
      featured: true,
      instructor: "Maya Johnson"
    },
    {
      title: "Breathwork & Ice Bath Workshop",
      description: "Learn powerful breathwork techniques and experience the transformative practice of ice bath immersion. This workshop combines ancient wisdom with modern science for enhanced wellbeing.",
      category: "workshop",
      date: new Date(currentDate.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 10 days from now
      time: "10:00",
      venue_id: venueData[0].id,
      price: "$65",
      image_url: "https://images.unsplash.com/photo-1600618528240-fb9fc964b853?q=80&w=1000&auto=format&fit=crop",
      featured: false,
      instructor: "Wim Hoffman"
    },
    {
      title: "Sunset Yin Yoga",
      description: "A gentle, slow-paced yin practice focusing on deep stretching and meditation. Perfect for releasing tension and finding balance as the day comes to a close.",
      category: "yoga",
      date: new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days from now
      time: "17:30",
      venue_id: venueData[2].id,
      price: "$20",
      image_url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000&auto=format&fit=crop",
      featured: false,
      instructor: "Sofia Garcia"
    },
    {
      title: "Plant Medicine Integration Circle",
      description: "A supportive gathering for those who have experienced plant medicine ceremonies and wish to share insights, challenges, and integration practices in a safe container.",
      category: "workshop",
      date: new Date(currentDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days from now
      time: "19:00",
      venue_id: venueData[1].id,
      price: "$0",
      image_url: "https://images.unsplash.com/photo-1524222835726-8e7d453fa83c?q=80&w=1000&auto=format&fit=crop",
      featured: true,
      instructor: null
    }
  ];

  console.log("Creating events with these venues:", venueData);

  // Insert events
  const { data: eventData, error: eventError } = await supabase
    .from('events')
    .insert(events);

  if (eventError) {
    console.error("Error creating events:", eventError);
    return;
  }

  console.log("Sample data created successfully");
}
