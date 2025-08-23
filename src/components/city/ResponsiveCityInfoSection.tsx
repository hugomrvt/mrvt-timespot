import { Plus } from 'lucide-react';
import { ExtendedTimeZone } from '../../types';
import { useBreakpoint } from '../../hooks/useBreakpoint';

interface ResponsiveCityInfoSectionProps {
  selectedTimezone: ExtendedTimeZone | undefined;
  onAddCityClick: () => void;
}

export function ResponsiveCityInfoSection({ selectedTimezone, onAddCityClick }: ResponsiveCityInfoSectionProps) {
  const { isMobile, isTablet, isVerySmall } = useBreakpoint();

  // Design mobile/tablette selon Figma
  if (isMobile || isTablet) {
    return (
      <div className="space-y-6 mb-6 text-center">
        {/* Ville et Pays */}
        <div className="text-center space-y-2">
          <h2 className={`${isVerySmall ? 'text-2xl' : isMobile ? 'text-3xl' : 'text-4xl'} font-normal text-black font-[Space_Grotesk] leading-tight`}>
            {selectedTimezone?.city || 'Paris'}
          </h2>
          <h3 className={`${isVerySmall ? 'text-xl' : isMobile ? 'text-2xl' : 'text-3xl'} font-normal text-gray-600 font-[Space_Grotesk]`}>
            {selectedTimezone?.country || 'France'}
          </h3>
        </div>

        {/* Slogan */}
        <div className="text-center py-4">
          <p className={`text-[rgba(164,164,164,1)] font-[Space_Grotesk] ${isVerySmall ? 'text-xs' : 'text-sm'} leading-relaxed`}>
            Life moves fast. Stay on time<br/>
            and enjoy every moment!
          </p>
        </div>

        {/* Bouton Add Another City */}
        <div className="flex justify-center">
          <button 
            className={`flex items-center justify-center text-gray-600 font-medium hover:text-gray-800 transition-colors bg-white rounded-full shadow-sm border min-h-[48px] ${isVerySmall ? 'px-4 py-3 text-sm' : 'px-6 py-3 text-base'} font-[Space_Grotesk]`}
            onClick={onAddCityClick}
          >
            Add Another City 
            <div className="ml-3 w-6 h-6 rounded-full border border-[#B2B2B2] flex items-center justify-center">
              <Plus className="w-4 h-4 text-[#B2B2B2]" />
            </div>
          </button>
        </div>
      </div>
    );
  }

  // Desktop Layout (inchangé)
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
          className="flex items-center text-gray-600 font-medium hover:text-gray-800 transition-colors ml-auto min-h-[44px]"
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