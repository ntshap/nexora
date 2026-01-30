import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-[#0A0A1E]">
            <div className="text-center px-4">
              <h1 className="text-2xl font-bold mb-4 text-white">Something went wrong</h1>
              <p className="text-gray-400 mb-6">We apologize for the inconvenience.</p>
              <button
                onClick={() => this.setState({ hasError: false })}
                className="px-6 py-3 bg-gradient-to-r from-[#9333ea] to-[#db2777] text-white rounded-full hover:opacity-90 transition-opacity"
              >
                Try again
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
