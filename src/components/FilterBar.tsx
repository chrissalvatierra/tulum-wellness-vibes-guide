
import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

interface FilterBarProps {
  onFilterChange: (filters: EventFilters) => void;
}

export interface EventFilters {
  search: string;
  eventTypes: string[];
  priceRange: [number, number | null];
}

const EVENT_TYPES = ['yoga', 'meditation', 'sound healing', 'workshop', 'retreat'];

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState<number>(0);
  const [priceMax, setPriceMax] = useState<number | null>(null);
  
  // Update filters when any filter changes
  useEffect(() => {
    onFilterChange({
      search,
      eventTypes: selectedTypes,
      priceRange: [priceMin, priceMax],
    });
  }, [search, selectedTypes, priceMin, priceMax, onFilterChange]);
  
  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };
  
  const handleClearFilters = () => {
    setSearch('');
    setSelectedTypes([]);
    setPriceMin(0);
    setPriceMax(null);
    setIsOpen(false);
  };
  
  const activeFilterCount = selectedTypes.length + (priceMin > 0 || priceMax !== null ? 1 : 0);

  return (
    <div className="bg-white py-4 px-4 rounded-lg shadow-sm border border-gray-100 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline"
              className="gap-2 relative"
            >
              <SlidersHorizontal size={16} />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-tulum-teal text-white">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Event Type</h3>
                <div className="flex flex-wrap gap-2">
                  {EVENT_TYPES.map(type => (
                    <Badge
                      key={type}
                      onClick={() => handleTypeToggle(type)}
                      className={`cursor-pointer capitalize ${
                        selectedTypes.includes(type) 
                          ? 'bg-tulum-teal text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Price Range</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price-min">Min ($)</Label>
                    <Input
                      id="price-min"
                      type="number"
                      min={0}
                      value={priceMin}
                      onChange={(e) => setPriceMin(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="price-max">Max ($)</Label>
                    <Input
                      id="price-max"
                      type="number"
                      min={0}
                      value={priceMax || ''}
                      onChange={(e) => setPriceMax(e.target.value ? Number(e.target.value) : null)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-tulum-teal hover:text-tulum-ocean flex gap-1"
                  onClick={handleClearFilters}
                >
                  <X size={16} />
                  Clear filters
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
