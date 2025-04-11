
import { useState, useEffect } from 'react';
import VenueCard from '@/components/VenueCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Venue } from '@/types';
import { supabase } from '@/lib/supabase';

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchVenues() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('venues')
          .select('*')
          .order('name');
        
        if (error) throw error;
        setVenues(data);
        setFilteredVenues(data);
      } catch (error) {
        console.error("Error fetching venues:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchVenues();
  }, []);
  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredVenues(venues);
      return;
    }
    
    const filtered = venues.filter(venue => 
      venue.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      venue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredVenues(filtered);
  }, [searchQuery, venues]);

  return (
    <div className="tulum-container">
      <div className="mb-8">
        <h1 className="tulum-heading">Wellness Venues</h1>
        <p className="tulum-subheading">Discover the best wellness spaces in Tulum</p>
      </div>
      
      <div className="relative max-w-md mx-auto mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder="Search venues..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="tulum-card animate-pulse">
              <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : filteredVenues.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVenues.map(venue => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-medium text-gray-600 mb-2">No venues found</h3>
          <p className="text-gray-500">Try a different search term</p>
        </div>
      )}
    </div>
  );
}
