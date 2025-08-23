import { useBreakpoint } from "../../hooks/useBreakpoint";

export function Credits() {
  const { isMobile, isVerySmall } = useBreakpoint();

  const getTextSize = () => {
    if (isVerySmall) return "text-xs";
    if (isMobile) return "text-sm";
    return "text-sm";
  };

  const getPadding = () => {
    if (isVerySmall) return "py-3 px-2";
    if (isMobile) return "py-4 px-3";
    return "py-4 px-4";
  };

  return (
    <div
      className={`${getPadding()} text-center border-t border-gray-300/30`}
    >
      <p
        className={`${getTextSize()} text-gray-600 font-[Space_Grotesk] leading-relaxed`}
      >
        Credits: Built with{" "}
        <span className="font-medium text-gray-700">
          Figma Make
        </span>{" "}
        | Dribbble Concept by{" "}
        <a
          href="https://dribbble.com/shots/26022641-Dashboard-World-Clock-UI"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-[#E64002] hover:text-[#cc3602] transition-colors duration-200 underline decoration-1 underline-offset-2 hover:decoration-2"
        >
          Nixtio
        </a>{" "}
        | Vibe coded by{" "}
        <a
          href="https://www.linkedin.com/in/hugomrvt/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-[#E64002] hover:text-[#cc3602] transition-colors duration-200 underline decoration-1 underline-offset-2 hover:decoration-2"
        >
          Hugo Mourlevat
        </a>
      </p>
    </div>
  );
}