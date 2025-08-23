import { Heart } from 'lucide-react';

interface StatusNotificationProps {
  serverConnected: boolean;
}

export function StatusNotification({ serverConnected }: StatusNotificationProps) {
  if (serverConnected) return null;

  return (
    <div className="mb-6 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
      <div className="flex items-center gap-2 text-yellow-800">
        <Heart className="w-4 h-4" />
        <span>Server offline - using real-time local data</span>
      </div>
    </div>
  );
}