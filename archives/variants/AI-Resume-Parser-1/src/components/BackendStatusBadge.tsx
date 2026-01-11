'use client';

import { useBackendStatus } from '@/hooks/useBackendStatus';

export function BackendStatusBadge() {
  const status = useBackendStatus();

  const getStatusColor = () => {
    if (status.isChecking) return 'bg-yellow-400';
    if (status.isConnected) return 'bg-green-500';
    return 'bg-red-500';
  };

  const getStatusText = () => {
    if (status.isChecking) return 'Checking...';
    if (status.isConnected) {
      return status.isDemoMode ? 'Demo Mode' : 'Live';
    }
    return 'Offline - Demo Mode';
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 hover:border-gray-300 transition-colors">
      <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor()} ${!status.isChecking ? 'animate-pulse' : ''}`} />
      <span className="text-xs font-medium text-gray-700 whitespace-nowrap">
        {getStatusText()}
      </span>
    </div>
  );
}
