
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
  categories: string[];
  priceRange: [number, number | null];
}

const EVENT_CATEGORIES = ['yoga', 'meditation', 'sound healing', 'workshop', 'retreat'];

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState<number>(0);
  const [priceMax, setPriceMax] = useState<number | null>(null);
  
  // Update filters when any filter changes
  useEffect(() => {
    onFilterChange({
      search,
      categories: selectedCategories,
      priceRange: [priceMin, priceMax],
    });
  }, [search, selectedCategories, priceMin, priceMax, onFilterChange]);
  
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(t => t !== category) 
        : [...prev, category]
    );
  };
  
  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategories([]);
    setPriceMin(0);
    setPriceMax(null);
    setIsOpen(false);
  };
  
  const activeFilterCount = selectedCategories.length + (priceMin > 0 || priceMax !== null ? 1 : 0);

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
                <h3 className="font-medium mb-2">Event Category</h3>
                <div className="flex flex-wrap gap-2">
                  {EVENT_CATEGORIES.map(category => (
                    <Badge
                      key={category}
                      onClick={() => handleCategoryToggle(category)}
                      className={`cursor-pointer capitalize ${
                        selectedCategories.includes(category) 
                          ? 'bg-tulum-teal text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
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
