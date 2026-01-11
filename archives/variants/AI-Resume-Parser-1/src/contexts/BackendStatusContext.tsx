"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { useBackendStatus, type ConnectionStatus } from "@/hooks/useBackendStatus";

interface BackendStatusContextValue {
  status: ConnectionStatus;
  isConnected: boolean;
  isChecking: boolean;
  isOffline: boolean;
  isDemoMode: boolean;
  error: string | null;
  lastChecked: Date | null;
  retryCount: number;
  checkHealth: () => Promise<boolean>;
  retry: () => Promise<boolean>;
}

const BackendStatusContext = createContext<BackendStatusContextValue | null>(null);

interface BackendStatusProviderProps {
  children: ReactNode;
}

export function BackendStatusProvider({ children }: BackendStatusProviderProps) {
  const backendStatus = useBackendStatus({
    retryInterval: 30000,
    healthCheckInterval: 60000,
    maxRetries: 3,
    autoCheck: true,
  });

  return (
    <BackendStatusContext.Provider value={backendStatus}>
      {children}
    </BackendStatusContext.Provider>
  );
}

export function useBackendStatusContext() {
  const context = useContext(BackendStatusContext);
  if (!context) {
    throw new Error(
      "useBackendStatusContext must be used within a BackendStatusProvider"
    );
  }
  return context;
}

export default BackendStatusContext;
