// CRTR Studio - Home Page
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center">
        <h1 className="mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-6xl font-bold text-transparent">
          CRTR Studio
        </h1>
        <p className="mb-8 text-xl text-text-secondary">
          Your Smart Research Assistant for Documentary Production
        </p>
        <p className="mb-12 max-w-2xl text-text-secondary">
          Transform a topic into an organized package of footage and narration.
          We research and gather the best assets, you create the masterpiece.
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center justify-center gap-4">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 font-medium text-white shadow-lg shadow-accent-glow transition-all duration-200 hover:from-indigo-500 hover:to-purple-500 hover:scale-105"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/signup"
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 font-medium text-white shadow-lg shadow-accent-glow transition-all duration-200 hover:from-indigo-500 hover:to-purple-500 hover:scale-105"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="rounded-xl border border-border bg-surface-elevated px-8 py-4 font-medium text-text-primary transition-all duration-200 hover:border-accent-primary hover:bg-surface"
              >
                Sign In
              </Link>
            </>
          )}
        </div>

        {/* Feature Highlights */}
        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="mb-3 text-3xl">🎬</div>
            <h3 className="mb-2 font-semibold text-text-primary">Real Footage First</h3>
            <p className="text-sm text-text-secondary">
              80% stock footage from NASA & Pexels. AI only where needed.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="mb-3 text-3xl">⚡</div>
            <h3 className="mb-2 font-semibold text-text-primary">20-30 Minutes</h3>
            <p className="text-sm text-text-secondary">
              Research and assembly in minutes, not hours.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="mb-3 text-3xl">💰</div>
            <h3 className="mb-2 font-semibold text-text-primary">$49 per Video</h3>
            <p className="text-sm text-text-secondary">
              67-84% cheaper than competitors. Professional quality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


