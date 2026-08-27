import { Component } from 'react';
import { AlertTriangle } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg flex items-center justify-center px-6">
          <div className="card max-w-md w-full text-center">
            <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-warning" />
            </div>
            <h2 className="text-xl font-semibold text-text mb-2">Something Went Wrong</h2>
            <p className="text-text-secondary mb-6">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <button onClick={() => window.location.reload()} className="btn-primary">
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
