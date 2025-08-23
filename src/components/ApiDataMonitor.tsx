import { ExtendedTimeZone } from '../types';
import { useBreakpoint } from '../hooks/useBreakpoint';

interface ApiDataMonitorProps {
  timeZones: ExtendedTimeZone[];
  serverConnected: boolean;
  className?: string;
}

export function ApiDataMonitor({ 
  timeZones, 
  serverConnected, 
  className = '' 
}: ApiDataMonitorProps) {
  const { isMobile } = useBreakpoint();
  
  const getStats = () => {
    const total = timeZones.length;
    const loaded = timeZones.filter(tz => tz.data && !tz.loading && !tz.error).length;
    const loading = timeZones.filter(tz => tz.loading).length;
    const errors = timeZones.filter(tz => tz.error).length;
    
    return { total, loaded, loading, errors };
  };

  const stats = getStats();
  
  if (!serverConnected || isMobile) {
    return null; // Ne pas afficher sur mobile ou si le serveur n'est pas connecté
  }

  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs font-[Space_Grotesk] ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full mr-2 ${serverConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
          <span className="font-medium">API Status</span>
        </div>
        <span className={`px-2 py-1 rounded text-[10px] ${
          serverConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {serverConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>
      
      <div className="grid grid-cols-4 gap-2 text-center">
        <div>
          <div className="text-lg font-semibold text-blue-600">{stats.total}</div>
          <div className="text-gray-500">Total</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-green-600">{stats.loaded}</div>
          <div className="text-gray-500">Loaded</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-yellow-600">{stats.loading}</div>
          <div className="text-gray-500">Loading</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-red-600">{stats.errors}</div>
          <div className="text-gray-500">Errors</div>
        </div>
      </div>
      
      {/* Detailed view for each timezone */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="text-[10px] text-gray-600 mb-1">Timezone Data:</div>
        <div className="max-h-20 overflow-y-auto space-y-1">
          {timeZones.map((tz, index) => (
            <div key={index} className="flex justify-between items-center text-[10px]">
              <span className="truncate max-w-[100px]">{tz.city}</span>
              <div className="flex items-center space-x-1">
                {tz.loading && <span className="text-yellow-500">⏳</span>}
                {tz.error && <span className="text-red-500">❌</span>}
                {tz.data && !tz.loading && !tz.error && (
                  <>
                    <span className="text-green-500">✅</span>
                    <span className="text-blue-500">{tz.data.abbreviation}</span>
                    {tz.data.dst && <span className="text-purple-500">🕐</span>}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}