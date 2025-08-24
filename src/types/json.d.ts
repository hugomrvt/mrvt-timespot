// Type declarations for JSON imports
declare module '*.json' {
  const value: any;
  export default value;
}

// Specific type for timezone.json structure
declare module '@docs/timezone.json' {
  interface TimezoneDumpEntry {
    key: string;
    value: any;
  }
  
  const timezoneDump: TimezoneDumpEntry[];
  export default timezoneDump;
}