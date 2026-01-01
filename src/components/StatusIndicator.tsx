"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Wifi, WifiOff, Loader2, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import type { ConnectionStatus } from "@/hooks/useBackendStatus";

interface StatusIndicatorProps {
  status: ConnectionStatus;
  isChecking: boolean;
  error: string | null;
  lastChecked: Date | null;
  onRetry?: () => void;
  className?: string;
  showLabel?: boolean;
}

const statusConfig = {
  connected: {
    color: "bg-green-500",
    pulseColor: "bg-green-400",
    label: "Connected",
    icon: Wifi,
    description: "Backend is operational",
  },
  checking: {
    color: "bg-yellow-500",
    pulseColor: "bg-yellow-400",
    label: "Checking...",
    icon: Loader2,
    description: "Checking connection status",
  },
  disconnected: {
    color: "bg-red-500",
    pulseColor: "bg-red-400",
    label: "Offline - Demo Mode",
    icon: WifiOff,
    description: "Backend unavailable, using demo mode",
  },
};

export function StatusIndicator({
  status,
  isChecking,
  error,
  lastChecked,
  onRetry,
  className,
  showLabel = false,
}: StatusIndicatorProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const formatLastChecked = () => {
    if (!lastChecked) return "Never";
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastChecked.getTime()) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "flex items-center gap-2 cursor-default select-none",
              className
            )}
          >
            {/* Status Dot */}
            <div className="relative flex items-center justify-center">
              {/* Pulse animation for connected/checking states */}
              {(status === "connected" || status === "checking") && (
                <span
                  className={cn(
                    "absolute inline-flex h-3 w-3 rounded-full opacity-75",
                    config.pulseColor,
                    status === "checking" ? "animate-ping" : "animate-pulse"
                  )}
                />
              )}
              <span
                className={cn(
                  "relative inline-flex h-2.5 w-2.5 rounded-full",
                  config.color
                )}
              />
            </div>

            {/* Icon */}
            <Icon
              className={cn(
                "h-4 w-4",
                status === "connected" && "text-green-500",
                status === "checking" && "text-yellow-500 animate-spin",
                status === "disconnected" && "text-red-500"
              )}
            />

            {/* Label */}
            {showLabel && (
              <span
                className={cn(
                  "text-xs font-medium",
                  status === "connected" && "text-green-600 dark:text-green-400",
                  status === "checking" && "text-yellow-600 dark:text-yellow-400",
                  status === "disconnected" && "text-red-600 dark:text-red-400"
                )}
              >
                {config.label}
              </span>
            )}

            {/* Retry button for disconnected state */}
            {status === "disconnected" && onRetry && !isChecking && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 ml-1"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRetry();
                }}
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="space-y-1">
            <p className="font-medium">{config.label}</p>
            <p className="text-xs text-muted-foreground">{config.description}</p>
            {error && (
              <p className="text-xs text-red-500">Error: {error}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Last checked: {formatLastChecked()}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * Demo Mode Banner - Shows when backend is unavailable
 */
interface DemoModeBannerProps {
  isVisible: boolean;
  onRetry?: () => void;
  className?: string;
}

export function DemoModeBanner({
  isVisible,
  onRetry,
  className,
}: DemoModeBannerProps) {
  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800",
        "px-4 py-2 flex items-center justify-center gap-3 text-sm",
        "animate-in slide-in-from-top-2 duration-300",
        className
      )}
    >
      <WifiOff className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
      <span className="text-yellow-800 dark:text-yellow-200">
        <strong>Demo Mode:</strong> Backend is unavailable. Viewing sample output only.
      </span>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="h-7 text-xs border-yellow-300 dark:border-yellow-700 hover:bg-yellow-100 dark:hover:bg-yellow-900/40"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Retry Connection
        </Button>
      )}
    </div>
  );
}

export default StatusIndicator;
