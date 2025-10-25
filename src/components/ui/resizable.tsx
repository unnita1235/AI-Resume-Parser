"use client"

import * as React from "react"
import { ImperativePanelHandle, Panel as ResizablePrimitivePanel, PanelGroup as ResizablePrimitivePanelGroup, PanelResizeHandle as ResizablePrimitivePanelResizeHandle } from "react-resizable-panels"

import { cn } from "@/lib/utils"

const ResizablePanelGroup = React.forwardRef<
  React.ElementRef<typeof ResizablePrimitivePanelGroup>,
  React.ComponentProps<typeof ResizablePrimitivePanelGroup>
>(({ className, ...props }, ref) => (
  <ResizablePrimitivePanelGroup
    ref={ref}
    className={cn(
      "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
      className
    )}
    {...props}
  />
))
ResizablePanelGroup.displayName = "ResizablePanelGroup"

const ResizablePanel = ResizablePrimitivePanel

const ResizableHandle = React.forwardRef<
  React.ElementRef<typeof ResizablePrimitivePanelResizeHandle>,
  React.ComponentProps<typeof ResizablePrimitivePanelResizeHandle> & { withHandle?: boolean }
>(({ className, withHandle, ...props }, ref) => (
  <ResizablePrimitivePanelResizeHandle
    className={cn(
      "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90",
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-2.5 w-2.5"
        >
          <path d="M9 18V6" />
          <path d="M15 18V6" />
        </svg>
      </div>
    )}
  </ResizablePrimitivePanelResizeHandle>
))
ResizableHandle.displayName = "ResizableHandle"

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
