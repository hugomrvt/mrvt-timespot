import { Search } from 'lucide-react';
import { TimeSpotIcon } from './TimeSpotIcon';

interface AppHeaderProps {
  onSearchClick: () => void;
}

export function AppHeader({ onSearchClick }: AppHeaderProps) {
  return (
    <header className="grid grid-cols-3 items-center mb-8">
      {/* Left: Logo */}
      <div className="flex items-center space-x-2">
        <div className="p-0 m-[0px]">
          <TimeSpotIcon className="w16 h-16 text-black" />
        </div>
        <h1 className="text-2xl font-bold font-[Space_Grotesk]">TimeSpot</h1>
      </div>
      
      {/* Center: Search */}
      <div className="flex justify-center">
        <button
          onClick={onSearchClick}
          className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors bg-[rgba(255,255,255,0)] rounded-full px-4 py-2 border border-gray-200"
        >
          <Search className="w-8 h-8" />
          <span className="font-[Space_Grotesk] text-gray-400">Search</span>
        </button>
      </div>
      
      {/* Right: Actions */}
      <div className="flex items-center space-x-6 justify-end">
        <a className="text-gray-700 font-medium font-[Space_Grotesk]" href="#">Log In</a>
        <button className="bg-black text-white px-5 py-2 rounded-full font-medium font-[Space_Grotesk]">Get the App</button>
      </div>
    </header>
  );
}