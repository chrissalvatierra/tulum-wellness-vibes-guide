
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <div className="bg-gradient-to-b from-tulum-teal/10 to-white">
      <div className="container mx-auto px-6 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-tulum-ocean mb-4">
              Find Your <span className="text-tulum-teal">Wellness</span> in Tulum
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Discover transformative experiences, healing retreats, and community gatherings in the heart of Tulum's wellness scene.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-tulum-teal hover:bg-tulum-ocean text-white">
                <Link to="/events">Explore Events</Link>
              </Button>
              <Button variant="outline" className="border-tulum-teal text-tulum-teal hover:bg-tulum-teal hover:text-white">
                <Link to="/venues">Discover Venues</Link>
              </Button>
            </div>
          </div>
          
          <div className="md:w-1/2 relative">
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-tulum-sand/30 rounded-full animate-gentle-wave"></div>
            <div className="absolute top-1/2 -right-5 w-16 h-16 bg-tulum-teal/20 rounded-full animate-gentle-wave" style={{ animationDelay: "1s" }}></div>
            <div className="relative z-10 rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt="Yoga in Tulum"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
