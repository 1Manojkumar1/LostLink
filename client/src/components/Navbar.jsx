import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PackageX, PackageCheck, LogOut, User, LayoutDashboard, Menu, X, FileText, Shield, GitCompare, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setShowMobileMenu(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/items', label: 'Browse', icon: Search },
    ...(isAuthenticated
      ? [
          { to: '/matches', label: 'Matches', icon: GitCompare },
          { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        ]
      : []),
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="border-b border-border bg-bg sticky top-0 z-50">
      <div className="page-container h-14 flex items-center justify-between">
        <Logo size="md" />

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                isActive(link.to)
                  ? 'text-text bg-surface-elevated'
                  : 'text-text-secondary hover:text-text hover:bg-surface'
              }`}
            >
              <link.icon className="w-3.5 h-3.5" />
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link to="/report?type=LOST" className="btn-secondary text-sm flex items-center gap-1.5">
                <PackageX className="w-3.5 h-3.5" />
                Report Lost
              </Link>
              <Link to="/report?type=FOUND" className="btn-primary text-sm flex items-center gap-1.5">
                <PackageCheck className="w-3.5 h-3.5" />
                Report Found
              </Link>

              {/* User Menu */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="avatar cursor-pointer ml-1"
                  aria-label="User menu"
                >
                  {user?.name?.charAt(0)?.toUpperCase() || <User className="w-4 h-4" />}
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-surface border border-border rounded-xl py-1 shadow-xl z-50">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="font-medium text-text text-sm truncate">{user?.name}</p>
                      <p className="text-xs text-text-muted truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-text hover:bg-surface-elevated transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <Link
                        to="/my-reports"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-text hover:bg-surface-elevated transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        My Reports
                      </Link>
                      <Link
                        to="/claims"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-text hover:bg-surface-elevated transition-colors"
                      >
                        <Shield className="w-4 h-4" />
                        Claims
                      </Link>
                    </div>
                    <div className="py-1 border-t border-border">
                      <button
                        onClick={() => { logout(); setShowUserMenu(false); }}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-error/10 transition-colors w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost text-sm">Log In</Link>
              <Link to="/register" className="btn-primary text-sm">Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-1.5 rounded-md text-text-secondary hover:text-text hover:bg-surface transition-colors"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          aria-label={showMobileMenu ? 'Close menu' : 'Open menu'}
        >
          {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-border bg-surface">
          <div className="page-container py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive(link.to)
                    ? 'text-text bg-surface-elevated'
                    : 'text-text-secondary hover:text-text hover:bg-surface-elevated'
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
            <div className="pt-2 mt-2 border-t border-border space-y-1">
              <Link to="/report?type=LOST" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-secondary hover:text-text hover:bg-surface-elevated transition-colors">
                <PackageX className="w-4 h-4" />
                Report Lost
              </Link>
              <Link to="/report?type=FOUND" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-secondary hover:text-text hover:bg-surface-elevated transition-colors">
                <PackageCheck className="w-4 h-4" />
                Report Found
              </Link>
            </div>
            {isAuthenticated && (
              <div className="pt-2 mt-2 border-t border-border">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-text">{user?.name}</p>
                  <p className="text-xs text-text-muted">{user?.email}</p>
                </div>
                <button
                  onClick={() => { logout(); setShowMobileMenu(false); }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-error hover:bg-error/10 transition-colors w-full"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
            {!isAuthenticated && (
              <div className="pt-2 mt-2 border-t border-border flex gap-2">
                <Link to="/login" onClick={() => setShowMobileMenu(false)} className="btn-ghost text-sm flex-1 text-center">Log In</Link>
                <Link to="/register" onClick={() => setShowMobileMenu(false)} className="btn-primary text-sm flex-1 text-center">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
