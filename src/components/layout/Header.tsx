import { Search, X, MapPin, Clock } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { LocalTimeApiService, CitySearchResult } from '../../lib/api/localTimeApi';
import { logger } from '../../lib/utils/secureLogger';

interface HeaderProps {
  onCitySelect?: (city: CitySearchResult) => void;
  onClose?: () => void;
}

export function Header({ onCitySelect, onClose }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CitySearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Focus l'input au montage du composant
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const searchCities = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setIsSearching(true);
      try {
        logger.info(`Searching for cities: "${searchQuery}"`, undefined, 'Header');
        const results = await LocalTimeApiService.searchCities(searchQuery);
        logger.info(`Search results: ${results.length} cities found`, { count: results.length }, 'Header');
        setSearchResults(results);
        setShowResults(results.length > 0);
      } catch (error) {
        logger.error('Search error:', error, 'Header');
        setSearchResults([]);
        setShowResults(false);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchCities, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleCitySelect = (city: CitySearchResult) => {
    logger.info(`City selected: ${city.name} (${city.timezone})`, { city }, 'Header');
    setSearchQuery('');
    setShowResults(false);
    onCitySelect?.(city);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowResults(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (searchQuery) {
        clearSearch();
      } else {
        onClose?.();
      }
    } else if (e.key === 'ArrowDown' && searchResults.length > 0) {
      e.preventDefault();
      // Focus sur le premier résultat
      const firstResult = document.querySelector('[data-search-result="0"]') as HTMLElement;
      if (firstResult) {
        firstResult.focus();
      }
    }
  };

  const handleResultKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowDown' && index < searchResults.length - 1) {
      e.preventDefault();
      const nextResult = document.querySelector(`[data-search-result="${index + 1}"]`) as HTMLElement;
      if (nextResult) {
        nextResult.focus();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (index > 0) {
        const prevResult = document.querySelector(`[data-search-result="${index - 1}"]`) as HTMLElement;
        if (prevResult) {
          prevResult.focus();
        }
      } else {
        // Retour à l'input
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    } else if (e.key === 'Enter') {
      handleCitySelect(searchResults[index]);
    } else if (e.key === 'Escape') {
      onClose?.();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="flex items-start justify-center min-h-screen pt-4 md:pt-20 px-2 md:px-4">
        <div className="w-full max-w-2xl">
          {/* Search Input */}
          <div ref={searchRef} className="bg-white rounded-2xl md:rounded-2xl shadow-2xl overflow-hidden mx-2 md:mx-0">
            <div className="flex items-center p-4 md:p-6 border-b border-gray-100">
              <Search className="w-5 h-5 md:w-6 md:h-6 text-gray-400 mr-3 md:mr-4 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search cities by name or country..."
                className="flex-1 text-base md:text-lg font-[Space_Grotesk] placeholder-gray-400 bg-transparent outline-none min-h-[44px]"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="ml-2 p-2 hover:bg-gray-100 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  <X className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                </button>
              )}
              {isSearching && (
                <div className="ml-2 w-4 h-4 md:w-5 md:h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              )}
            </div>

            {/* Search Results */}
            {showResults && (
              <div className="max-h-96 overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div className="py-2">
                    {searchResults.map((city, index) => (
                      <button
                        key={`${city.timezone}-${index}`}
                        data-search-result={index}
                        onClick={() => handleCitySelect(city)}
                        onKeyDown={(e) => handleResultKeyDown(e, index)}
                        className="w-full px-4 md:px-6 py-4 text-left hover:bg-gray-50 focus:bg-gray-50 transition-colors outline-none group min-h-[60px]"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 md:space-x-4 flex-1 min-w-0">
                            <div className="p-2 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors flex-shrink-0">
                              <MapPin className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-medium font-[Space_Grotesk] text-gray-900 text-sm md:text-base truncate">
                                {city.name}
                              </h3>
                              <p className="text-xs md:text-sm text-gray-500 font-[Space_Grotesk] truncate">
                                {city.country}
                              </p>
                            </div>
                          </div>
                          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-400 flex-shrink-0">
                            <Clock className="w-4 h-4" />
                            <span className="font-[Space_Grotesk]">
                              {city.timezone.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  searchQuery.length >= 2 && !isSearching && (
                    <div className="px-6 py-8 text-center text-gray-500">
                      <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="font-[Space_Grotesk]">
                        No cities found for &quot;{searchQuery}&quot;
                      </p>
                      <p className="text-sm text-gray-400 mt-1 font-[Space_Grotesk]">
                        Try searching for a different city or country name
                      </p>
                    </div>
                  )
                )}
              </div>
            )}

            {/* Search Suggestions */}
            {!showResults && searchQuery.length < 2 && (
              <div className="px-6 py-4 text-center text-gray-500">
                <div className="space-y-2">
                  <p className="font-[Space_Grotesk] text-sm">
                    🌍 Search for any city or country
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {['London', 'New York', 'Tokyo', 'Paris', 'Sydney', 'Dubai'].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setSearchQuery(suggestion)}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-[Space_Grotesk] text-gray-600 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-4 text-center text-white/70">
            <p className="text-sm font-[Space_Grotesk]">
              💡 Use arrow keys to navigate, Enter to select, Esc to close
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}