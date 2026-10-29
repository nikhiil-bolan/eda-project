import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLocation as useGeoLocation } from '../context/LocationContext';
import {
  Zap,
  MapPin,
  Sun,
  Moon,
  LogOut,
  Calendar,
  Menu,
  X,
  ChevronDown,
  BarChart2,
  Compass,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, isGuest, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { userLocation, setShowLocationModal } = useGeoLocation();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [analyticsDropdownOpen, setAnalyticsDropdownOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isActive = (p: string) => {
    if (p === '/' && location.pathname === '/') return true;
    if (p !== '/' && location.pathname.startsWith(p)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo - Google/Tata Clean Corporate Typography */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 via-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <div className="flex flex-col">
                <div className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center space-x-1.5">
                  <span>EVision</span>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
                    Enterprise
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Smart EV Network & Analytics
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isActive('/')
                  ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Overview
            </Link>

            <Link
              to="/stations"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isActive('/stations')
                  ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Find Stations
            </Link>

            <Link
              to="/map"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isActive('/map')
                  ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Station Map
            </Link>

            {/* Dropdown 1: BI & Analytics */}
            <div className="relative group">
              <button
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isActive('/tableau') || isActive('/eda') || isActive('/gap-analysis')
                    ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <span>Analytics & BI</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              <div className="absolute left-0 top-full mt-1 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl py-2 hidden group-hover:block z-50">
                <Link
                  to="/tableau"
                  className="block px-4 py-2.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-sky-50 dark:hover:bg-sky-950/50 hover:text-sky-600 dark:hover:text-sky-400"
                >
                  <div className="font-bold">Executive BI Studio</div>
                  <div className="text-[11px] text-gray-400 font-normal">Interactive Tableau charts & metrics</div>
                </Link>
                <Link
                  to="/eda"
                  className="block px-4 py-2.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-sky-50 dark:hover:bg-sky-950/50 hover:text-sky-600 dark:hover:text-sky-400"
                >
                  <div className="font-bold">Data Insights & Trends</div>
                  <div className="text-[11px] text-gray-400 font-normal">Adoption growth mismatch analysis</div>
                </Link>
                <Link
                  to="/gap-analysis"
                  className="block px-4 py-2.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-sky-50 dark:hover:bg-sky-950/50 hover:text-sky-600 dark:hover:text-sky-400"
                >
                  <div className="font-bold">Regional Gap Index</div>
                  <div className="text-[11px] text-gray-400 font-normal">State deficit rankings (0-100)</div>
                </Link>
              </div>
            </div>

            {/* Dropdown 2: Planning & Projections */}
            <div className="relative group">
              <button
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isActive('/forecasting') || isActive('/planner')
                    ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <span>Planning & Growth</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              <div className="absolute left-0 top-full mt-1 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl py-2 hidden group-hover:block z-50">
                <Link
                  to="/forecasting"
                  className="block px-4 py-2.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-sky-50 dark:hover:bg-sky-950/50 hover:text-sky-600 dark:hover:text-sky-400"
                >
                  <div className="font-bold">Demand Projections (2030)</div>
                  <div className="text-[11px] text-gray-400 font-normal">Predictive vehicle & station forecasts</div>
                </Link>
                <Link
                  to="/planner"
                  className="block px-4 py-2.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-sky-50 dark:hover:bg-sky-950/50 hover:text-sky-600 dark:hover:text-sky-400"
                >
                  <div className="font-bold">Deployment Planner</div>
                  <div className="text-[11px] text-gray-400 font-normal">Customizable capital quota sliders</div>
                </Link>
              </div>
            </div>

            {/* Dropdown 3: Driver Services */}
            <div className="relative group">
              <button
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isActive('/calculator') || isActive('/marketplace') || isActive('/doorstep') || isActive('/assistant')
                    ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <span>Driver Services</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl py-2 hidden group-hover:block z-50">
                <Link
                  to="/calculator"
                  className="block px-4 py-2.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-sky-50 dark:hover:bg-sky-950/50 hover:text-sky-600 dark:hover:text-sky-400"
                >
                  <div className="font-bold">Battery & Cost Calculator</div>
                  <div className="text-[11px] text-gray-400 font-normal">Charge time, tariff, & CO₂ savings</div>
                </Link>
                <Link
                  to="/marketplace"
                  className="block px-4 py-2.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-sky-50 dark:hover:bg-sky-950/50 hover:text-sky-600 dark:hover:text-sky-400"
                >
                  <div className="font-bold">EV Models & Valuation</div>
                  <div className="text-[11px] text-gray-400 font-normal">Catalog specs & battery resale value</div>
                </Link>
                <Link
                  to="/doorstep"
                  className="block px-4 py-2.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-sky-50 dark:hover:bg-sky-950/50 hover:text-sky-600 dark:hover:text-sky-400"
                >
                  <div className="font-bold">Roadside Mobile Rescue</div>
                  <div className="text-[11px] text-gray-400 font-normal">Emergency DC charging van dispatch</div>
                </Link>
                <Link
                  to="/assistant"
                  className="block px-4 py-2.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-sky-50 dark:hover:bg-sky-950/50 hover:text-sky-600 dark:hover:text-sky-400"
                >
                  <div className="font-bold">AI Assistant (EVA)</div>
                  <div className="text-[11px] text-gray-400 font-normal">Instant Q&A and charging guide</div>
                </Link>
              </div>
            </div>

            {isAdmin && (
              <Link
                to="/admin"
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isActive('/admin')
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                Admin Desk
              </Link>
            )}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2.5">
            {/* Live GPS Location Pill */}
            <button
              onClick={() => setShowLocationModal(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 hover:bg-sky-100 transition-all shadow-sm"
              title="Calibrate live GPS coordinates"
            >
              <MapPin className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
              <span className="max-w-[100px] truncate">
                {userLocation ? userLocation.city : 'Detect Location'}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </button>

            {/* My Passes Pill */}
            {isAuthenticated && (
              <Link
                to="/my-bookings"
                className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 transition-colors"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>My Passes</span>
              </Link>
            )}

            {/* Theme Toggle Button with visible pill */}
            <button
              onClick={toggleTheme}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all text-xs font-semibold shadow-sm"
              title="Switch Light / Dark Theme"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline text-[11px]">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-gray-600" />
                  <span className="hidden sm:inline text-[11px]">Dark Mode</span>
                </>
              )}
            </button>

            {/* User Profile Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 pl-2 pr-1 py-1 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-600 to-teal-500 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                      <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                        {user?.name}
                      </p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                        {user?.email}
                      </p>
                      <span className="inline-block mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
                        {isAdmin ? 'Administrator' : isGuest ? 'Guest Driver' : 'Verified EV Driver'}
                      </span>
                    </div>

                    <Link
                      to="/my-bookings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Charging Passes</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        <span>Administrator Desk</span>
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 pt-2 pb-6 space-y-1">
          {[
            { label: 'Overview', path: '/' },
            { label: 'Find Stations', path: '/stations' },
            { label: 'Station Map', path: '/map' },
            { label: 'Executive BI Studio', path: '/tableau' },
            { label: 'Data Insights & Trends', path: '/eda' },
            { label: 'Regional Gap Index', path: '/gap-analysis' },
            { label: 'Demand Projections', path: '/forecasting' },
            { label: 'Deployment Planner', path: '/planner' },
            { label: 'Battery & Cost Calculator', path: '/calculator' },
            { label: 'EV Models & Valuation', path: '/marketplace' },
            { label: 'Roadside Mobile Rescue', path: '/doorstep' },
            { label: 'AI Assistant (EVA)', path: '/assistant' }
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-xs font-bold ${
                isActive(item.path)
                  ? 'bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100'
              }`}
            >
              {item.label}
            </Link>
          ))}
          {isAuthenticated && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
              }}
              className="w-full text-left px-3 py-2 text-xs font-bold text-rose-600"
            >
              Sign Out
            </button>
          )}
        </div>
      )}
    </header>
  );
};
