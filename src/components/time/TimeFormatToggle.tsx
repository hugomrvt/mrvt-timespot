import { useBreakpoint } from '../../hooks/useBreakpoint';
import { useTouchDevice } from '../../hooks/useTouchDevice';

interface TimeFormatToggleProps {
  value: '12h' | '24h';
  onChange: (value: '12h' | '24h') => void;
}

export function TimeFormatToggle({ value, onChange }: TimeFormatToggleProps) {
  const { isMobile } = useBreakpoint();
  const isTouchDevice = useTouchDevice();

  // Responsive sizing
  const getToggleClasses = () => {
    if (isMobile) {
      return "flex items-center space-x-1 bg-white p-1 rounded-full min-h-[48px]";
    }
    return "flex items-center space-x-1 bg-white p-1 rounded-full";
  };

  const getButtonClasses = (isActive: boolean) => {
    const baseClasses = "rounded-full transition-all duration-200";
    const sizeClasses = isMobile ? "px-4 py-3 text-lg min-h-[44px] min-w-[60px]" : "px-3 py-1 text-[16px]";
    const stateClasses = isActive
      ? 'bg-black text-white'
      : 'bg-white text-black hover:text-gray-800';
    
    // Add extra touch feedback for touch devices
    const touchClasses = isTouchDevice ? 'active:scale-95' : '';
    
    return `${baseClasses} ${sizeClasses} ${stateClasses} ${touchClasses}`;
  };

  return (
    <div 
      className={getToggleClasses()}
      style={isMobile ? { transform: 'scale(0.85)' } : {}}
      role="radiogroup"
      aria-label="Time format selection"
    >
      <button
        onClick={() => onChange('12h')}
        className={getButtonClasses(value === '12h')}
        role="radio"
        aria-checked={value === '12h'}
        aria-label="12-hour format"
      >
        12h
      </button>
      <button
        onClick={() => onChange('24h')}
        className={getButtonClasses(value === '24h')}
        role="radio"
        aria-checked={value === '24h'}
        aria-label="24-hour format"
      >
        24h
      </button>
    </div>
  );
}