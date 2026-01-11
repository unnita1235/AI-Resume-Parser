"use client";

import { useState, useEffect, useCallback } from "react";

export type ConnectionStatus = "connected" | "checking" | "disconnected";

interface BackendStatusState {
  status: ConnectionStatus;
  isConnected: boolean;
  isChecking: boolean;
  isOffline: boolean;
  error: string | null;
  lastChecked: Date | null;
  retryCount: number;
}

interface UseBackendStatusOptions {
  /**
   * Interval in milliseconds to retry connection when disconnected
   * @default 30000 (30 seconds)
   */
  retryInterval?: number;
  /**
   * Interval in milliseconds for health checks when connected
   * @default 60000 (60 seconds)
   */
  healthCheckInterval?: number;
  /**
   * Maximum number of retries before giving up
   * @default 3
   */
  maxRetries?: number;
  /**
   * Enable automatic health checks
   * @default true
   */
  autoCheck?: boolean;
}

const DEFAULT_OPTIONS: Required<UseBackendStatusOptions> = {
  retryInterval: 30000,
  healthCheckInterval: 60000,
  maxRetries: 3,
  autoCheck: true,
};

/**
 * Hook to monitor backend/API connectivity status
 * Checks the /api/health endpoint and manages connection state
 */
export function useBackendStatus(options: UseBackendStatusOptions = {}) {
  const config = { ...DEFAULT_OPTIONS, ...options };

  const [state, setState] = useState<BackendStatusState>({
    status: "checking",
    isConnected: false,
    isChecking: true,
    isOffline: false,
    error: null,
    lastChecked: null,
    retryCount: 0,
  });

  const checkHealth = useCallback(async (): Promise<boolean> => {
    setState((prev) => ({
      ...prev,
      status: "checking",
      isChecking: true,
    }));

    try {
      // Check local API health first
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch("/api/health", {
        method: "GET",
        signal: controller.signal,
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();

        setState({
          status: "connected",
          isConnected: true,
          isChecking: false,
          isOffline: false,
          error: null,
          lastChecked: new Date(),
          retryCount: 0,
        });

        return true;
      } else {
        throw new Error(`Health check failed with status: ${response.status}`);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Connection failed";

      setState((prev) => ({
        status: "disconnected",
        isConnected: false,
        isChecking: false,
        isOffline: true,
        error: errorMessage,
        lastChecked: new Date(),
        retryCount: prev.retryCount + 1,
      }));

      return false;
    }
  }, []);

  const manualRetry = useCallback(async () => {
    setState((prev) => ({ ...prev, retryCount: 0 }));
    return checkHealth();
  }, [checkHealth]);

  // Initial health check on mount
  useEffect(() => {
    if (config.autoCheck) {
      checkHealth();
    }
  }, [checkHealth, config.autoCheck]);

  // Set up retry interval when disconnected
  useEffect(() => {
    if (!config.autoCheck) return;

    let intervalId: NodeJS.Timeout;

    if (state.isOffline && state.retryCount < config.maxRetries) {
      intervalId = setInterval(() => {
        checkHealth();
      }, config.retryInterval);
    } else if (state.isConnected) {
      // When connected, do periodic health checks
      intervalId = setInterval(() => {
        checkHealth();
      }, config.healthCheckInterval);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [
    state.isOffline,
    state.isConnected,
    state.retryCount,
    config.autoCheck,
    config.retryInterval,
    config.healthCheckInterval,
    config.maxRetries,
    checkHealth,
  ]);

  return {
    ...state,
    checkHealth,
    retry: manualRetry,
    isDemoMode: state.isOffline,
  };
}

export default useBackendStatus;
