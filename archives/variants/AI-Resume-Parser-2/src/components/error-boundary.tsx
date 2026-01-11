"use client";

import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Error caught by boundary:", error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
                    <Card className="max-w-md w-full">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                                <AlertTriangle className="h-8 w-8 text-destructive" />
                            </div>
                            <CardTitle className="text-2xl">Something went wrong</CardTitle>
                            <CardDescription>
                                We encountered an unexpected error. Please try again.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {process.env.NODE_ENV === "development" && this.state.error && (
                                <div className="p-4 bg-muted rounded-lg text-sm font-mono overflow-auto max-h-32">
                                    {this.state.error.message}
                                </div>
                            )}
                            <div className="flex gap-4">
                                <Button onClick={this.handleRetry} className="flex-1 gap-2">
                                    <RefreshCw className="h-4 w-4" />
                                    Try Again
                                </Button>
                                <Link href="/" className="flex-1">
                                    <Button variant="outline" className="w-full gap-2">
                                        <Home className="h-4 w-4" />
                                        Go Home
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}

// Hook-based error boundary wrapper for functional components
export function withErrorBoundary<P extends object>(
    Component: React.ComponentType<P>,
    fallback?: React.ReactNode
) {
    return function WrappedComponent(props: P) {
        return (
            <ErrorBoundary>
                <Component {...props} />
            </ErrorBoundary>
        );
    };
}
