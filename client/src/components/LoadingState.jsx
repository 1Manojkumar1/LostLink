import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="w-6 h-6 text-primary animate-spin mb-3" />
      <p className="text-sm text-text-muted">{message}</p>
    </div>
  );
}
