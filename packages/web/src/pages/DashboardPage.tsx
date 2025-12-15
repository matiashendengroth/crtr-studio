// Dashboard page - main page after login
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
            CRTR Studio
          </h1>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-text-secondary">
              {user?.name || user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-border bg-surface-elevated px-4 py-2 text-sm text-text-secondary transition-all duration-200 hover:border-accent-primary hover:text-text-primary"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold text-text-primary">
            Welcome back{user?.name ? `, ${user.name}` : ''}!
          </h2>
          <p className="text-text-secondary">
            Ready to create your next documentary?
          </p>
        </div>

        {/* Projects Section */}
        <div className="rounded-2xl border border-border bg-surface p-8">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-text-primary">Your Projects</h3>
            <button className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-medium text-white shadow-lg shadow-accent-glow transition-all duration-200 hover:from-indigo-500 hover:to-purple-500 hover:scale-105">
              + New Project
            </button>
          </div>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-surface-elevated p-6">
              <svg className="h-12 w-12 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="mb-2 text-lg font-semibold text-text-primary">
              No projects yet
            </h4>
            <p className="mb-6 text-sm text-text-secondary">
              Create your first documentary project to get started
            </p>
            <button className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3 font-medium text-white shadow-lg shadow-accent-glow transition-all duration-200 hover:from-indigo-500 hover:to-purple-500 hover:scale-105">
              Create Your First Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


