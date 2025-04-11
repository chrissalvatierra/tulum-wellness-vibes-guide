
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-tulum-teal text-white py-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-display mb-4">Tulum Wellness</h3>
            <p className="text-tulum-sand/90 max-w-xs">
              Discover and connect with the best wellness events and venues in Tulum.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-display mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-tulum-sand/90 hover:text-white transition-colors">Home</a></li>
              <li><a href="/events" className="text-tulum-sand/90 hover:text-white transition-colors">Events</a></li>
              <li><a href="/venues" className="text-tulum-sand/90 hover:text-white transition-colors">Venues</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-display mb-4">Connect</h3>
            <p className="text-tulum-sand/90 mb-2">
              Follow us for the latest wellness events
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-tulum-sand transition-colors">
                Instagram
              </a>
              <a href="#" className="text-white hover:text-tulum-sand transition-colors">
                Facebook
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-tulum-sand/20 text-center text-tulum-sand/90 flex items-center justify-center">
          <p>Made with</p>
          <Heart size={16} className="mx-1 inline-block" fill="currentColor" />
          <p>in Tulum © {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}
