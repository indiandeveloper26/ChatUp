"use client";
import React from "react";

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, info: null };
    }

    static getDerivedStateFromError(error) {
        // State update to show fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        // Log error to console or server
        console.error("🚨 ErrorBoundary caught an error:", error);
        console.error("Info:", info);
        this.setState({ info });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-red-900 text-white p-6">
                    <h1 className="text-2xl font-bold mb-4">Something went wrong!</h1>
                    <p className="mb-2">{this.state.error?.toString()}</p>
                    <pre className="text-xs">{this.state.info?.componentStack}</pre>
                </div>
            );
        }

        return this.props.children;
    }
}
