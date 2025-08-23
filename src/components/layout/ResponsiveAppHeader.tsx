import { Search } from 'lucide-react';
import { TimeSpotIcon } from '../common/TimeSpotIcon';
import { MobileNavigation } from './MobileNavigation';
import { useBreakpoint } from '../../hooks/useBreakpoint';

interface ResponsiveAppHeaderProps {
  onSearchClick: () => void;
}

export function ResponsiveAppHeader({ onSearchClick }: ResponsiveAppHeaderProps) {
  const { isMobile, isTablet } = useBreakpoint();

  // Mobile Navigation
  if (isMobile) {
    return <MobileNavigation onSearchClick={onSearchClick} />;
  }

  // Tablet & Desktop Navigation
  return (
    <header className="grid grid-cols-3 items-center mb-4 md:mb-6 lg:mb-8 px-2 md:px-0">
      {/* Left: Logo */}
      <div className="flex items-center space-x-2">
        <div className="p-0 m-[0px]">
          <TimeSpotIcon className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 text-black" />
        </div>
        <h1 className="text-xl md:text-2xl font-bold font-[Space_Grotesk]">
          TimeSpot
        </h1>
      </div>
      
      {/* Center: Search */}
      <div className="flex justify-center">
        <button
          onClick={onSearchClick}
          className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors bg-[rgba(255,255,255,0)] rounded-full px-3 md:px-4 py-2 border border-gray-200 min-h-[44px]"
        >
          <Search className="w-6 md:w-8 h-6 md:h-8" />
          <span className="font-[Space_Grotesk] text-gray-400 text-sm md:text-base">
            {isTablet ? 'Search' : 'Search cities'}
          </span>
        </button>
      </div>
      
      {/* Right: Actions */}
      <div className="flex items-center space-x-4 md:space-x-6 justify-end">
        <a className="text-gray-700 font-medium font-[Space_Grotesk] text-sm md:text-base hover:text-gray-900 transition-colors" href="#">
          Log In
        </a>
        <button className="bg-black text-white px-4 md:px-5 py-2 rounded-full font-medium font-[Space_Grotesk] text-sm md:text-base min-h-[44px] hover:bg-gray-800 transition-colors">
          Get the App
        </button>
      </div>
    </header>
  );
}