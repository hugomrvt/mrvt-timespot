import { useState } from 'react';
import { Search, Menu, X, User, Download } from 'lucide-react';
import { TimeSpotIcon } from '../common/TimeSpotIcon';

interface MobileNavigationProps {
  onSearchClick: () => void;
}

export function MobileNavigation({ onSearchClick }: MobileNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      {/* Mobile Header */}
      <header className="flex items-center justify-between p-4 md:hidden">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <TimeSpotIcon className="w-8 h-8 text-black" />
          <h1 className="text-lg font-bold font-[Space_Grotesk]">TimeSpot</h1>
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onSearchClick}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Search cities"
          >
            <Search className="w-6 h-6 text-gray-600" />
          </button>
          
          <button
            onClick={toggleMenu}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeMenu}
          />
          
          {/* Menu Panel */}
          <div className="absolute top-0 right-0 w-80 max-w-[80vw] h-full bg-white shadow-2xl">
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <TimeSpotIcon className="w-6 h-6 text-black" />
                <span className="font-semibold font-[Space_Grotesk]">Menu</span>
              </div>
              <button
                onClick={closeMenu}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            {/* Menu Items */}
            <nav className="p-4 space-y-4">
              <button
                onClick={() => {
                  onSearchClick();
                  closeMenu();
                }}
                className="flex items-center space-x-3 w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Search className="w-5 h-5 text-gray-600" />
                <span className="font-[Space_Grotesk]">Search Cities</span>
              </button>
              
              <button className="flex items-center space-x-3 w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <User className="w-5 h-5 text-gray-600" />
                <span className="font-[Space_Grotesk]">Log In</span>
              </button>
              
              <button className="flex items-center space-x-3 w-full p-3 text-left bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                <Download className="w-5 h-5" />
                <span className="font-[Space_Grotesk]">Get the App</span>
              </button>
            </nav>
            
            {/* Menu Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-gray-50">
              <p className="text-sm text-gray-500 text-center font-[Space_Grotesk]">
                TimeSpot v1.0
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}