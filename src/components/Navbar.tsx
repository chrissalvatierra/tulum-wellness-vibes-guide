
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm py-4 px-6 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-tulum-ocean font-display text-2xl">Tulum Wellness</span>
        </Link>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
        
        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="font-medium text-gray-700 hover:text-tulum-teal">Home</Link>
          <Link to="/events" className="font-medium text-gray-700 hover:text-tulum-teal">Events</Link>
          <Link to="/venues" className="font-medium text-gray-700 hover:text-tulum-teal">Venues</Link>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-md py-3 px-6 z-50 animate-fade-in">
          <div className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className="font-medium text-gray-700 hover:text-tulum-teal py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/events" 
              className="font-medium text-gray-700 hover:text-tulum-teal py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Events
            </Link>
            <Link 
              to="/venues" 
              className="font-medium text-gray-700 hover:text-tulum-teal py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Venues
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
