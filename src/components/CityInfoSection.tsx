import { Plus } from 'lucide-react';
import { ExtendedTimeZone } from '../types';

interface CityInfoSectionProps {
  selectedTimezone: ExtendedTimeZone | undefined;
  onAddCityClick: () => void;
}

export function CityInfoSection({ selectedTimezone, onAddCityClick }: CityInfoSectionProps) {
  return (
    <div className="grid grid-cols-3 items-center mb-8">
      {/* Left: City and Country */}
      <div>
        <h2 className="text-5xl font-normal text-gray-800 font-[Space_Grotesk]">
          {selectedTimezone?.city || 'London'},
        </h2>
        <h3 className="text-5xl font-normal text-gray-800 font-[Space_Grotesk]">
          {selectedTimezone?.country || 'United Kingdom'}
        </h3>
      </div>

      {/* Center: Slogan */}
      <div className="text-center">
        <p className="text-[rgba(164,164,164,1)] font-[Space_Grotesk] text-[13px]">
          Life moves fast. Stay on time<br/>
          and enjoy every moment!
        </p>
      </div>

      {/* Right: Add City Button */}
      <div className="text-right">
        <button 
          className="flex items-center text-gray-600 font-medium hover:text-gray-800 transition-colors ml-auto"
          onClick={onAddCityClick}
        >
          Add Another City 
          <div className="ml-2 w-6 h-6 rounded-full border border-[#B2B2B2] flex items-center justify-center">
            <Plus className="w-4 h-4 text-[#B2B2B2]" />
          </div>
        </button>
      </div>
    </div>
  );
}