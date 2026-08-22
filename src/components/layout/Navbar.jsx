import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTrips } from '../../context/TripContext';
import { useNotification } from '../../context/NotificationContext';
import {
  Compass,
  Search,
  Bell,
  Plus,
  User,
  LogOut,
  ChevronDown,
  ShieldCheck,
  MapPin,
  Heart,
  Sliders,
  Menu,
  X,
  Layers,
  FileText,
} from 'lucide-react';
import Button from '../common/Button';

export function Navbar({ onMenuToggle }) {
  const { currentUser, logout, currency, setCurrency } = useAuth();
  const { savedPlaces } = useTrips();
  const { notifications, unreadCount, markAsRead } = useNotification();

  const [searchQuery, setSearchQuery] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const profileRef = useRef(null);
  const currencyRef = useRef(null);
  const notifRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
      if (currencyRef.current && !currencyRef.current.contains(e.target)) {
        setCurrencyDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/explore?q=${encodeURIComponent(searchQuery)}`);
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Explore', path: '/explore' },
    { label: 'My Trips', path: '/trips' },
    { label: 'Saved', path: '/saved', badge: savedPlaces.length || null },
    { label: 'Dashboard', path: '/dashboard' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left: Brand Logo & Desktop Nav Links */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-[6px] bg-[#714B67] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-[#1B1B26] font-display">
                GlobeTrotter
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive =
                  link.path === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(link.path);

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-1.5 rounded-[6px] text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[#714B67]/10 text-[#714B67]'
                        : 'text-[#1B1B26]/80 hover:text-[#1B1B26] hover:bg-slate-100'
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.badge ? (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-[#F16E62]/20 text-[#F16E62]">
                        {link.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Center Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden lg:flex flex-1 max-w-xs items-center relative"
          >
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destinations, activities..."
              className="w-full pl-9 pr-3.5 py-1.5 text-xs font-medium rounded-[6px] bg-[#F1F1F3] text-[#1B1B26] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#714B67]/30 border border-transparent focus:border-[#714B67] transition-all"
            />
          </form>

          {/* Right Action Icons & Profile Dropdown */}
          <div className="flex items-center gap-2.5">
            {/* Currency Selector Dropdown */}
            <div className="relative" ref={currencyRef}>
              <button
                type="button"
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-[6px] text-xs font-bold text-[#1B1B26] hover:bg-slate-100 transition-colors border border-slate-200 cursor-pointer"
              >
                <span>{currency === 'INR' ? '₹ INR' : currency === 'USD' ? '$ USD' : '€ EUR'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {currencyDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 rounded-[6px] bg-white border border-slate-200 shadow-lg p-1 z-50 text-xs font-semibold animate-scale-in">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrency('INR');
                      setCurrencyDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-[4px] transition-colors cursor-pointer ${
                      currency === 'INR' ? 'bg-[#714B67]/10 text-[#714B67] font-bold' : 'hover:bg-slate-50'
                    }`}
                  >
                    ₹ INR (Indian Rupee)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrency('USD');
                      setCurrencyDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-[4px] transition-colors cursor-pointer ${
                      currency === 'USD' ? 'bg-[#714B67]/10 text-[#714B67] font-bold' : 'hover:bg-slate-50'
                    }`}
                  >
                    $ USD (US Dollar)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrency('EUR');
                      setCurrencyDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-[4px] transition-colors cursor-pointer ${
                      currency === 'EUR' ? 'bg-[#714B67]/10 text-[#714B67] font-bold' : 'hover:bg-slate-50'
                    }`}
                  >
                    € EUR (Euro)
                  </button>
                </div>
              )}
            </div>

            {/* Notifications Bell Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-slate-600 hover:text-slate-900 rounded-[6px] hover:bg-slate-100 transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#F16E62] ring-2 ring-white" />
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-[6px] bg-white border border-slate-200 shadow-xl p-4 z-50 animate-scale-in space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-[#1B1B26]">Notifications</h4>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-[#714B67]/15 text-[#714B67]">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <Link
                      to="/notifications"
                      onClick={() => setNotificationsOpen(false)}
                      className="text-[11px] font-bold text-[#714B67] hover:underline"
                    >
                      View All
                    </Link>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {notifications.slice(0, 3).map((notif) => (
                      <Link
                        key={notif.id}
                        to={notif.link || '/notifications'}
                        onClick={() => {
                          markAsRead(notif.id);
                          setNotificationsOpen(false);
                        }}
                        className={`block p-2.5 rounded-[4px] border transition-colors text-left ${
                          !notif.read ? 'bg-[#714B67]/5 border-[#714B67]/20' : 'bg-slate-50 border-slate-100'
                        }`}
                      >
                        <h5 className="text-xs font-bold text-[#1B1B26]">{notif.title}</h5>
                        <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">
                          {notif.message}
                        </p>
                        <span className="text-[9px] text-slate-400 mt-1 block">{notif.time}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Plan Trip CTA */}
            <Link to="/trips/create" className="hidden sm:block">
              <Button size="sm" variant="primary" icon={Plus}>
                Plan Trip
              </Button>
            </Link>

            {/* User Profile Dropdown */}
            {currentUser ? (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-2 rounded-full hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                >
                  <img
                    src={
                      currentUser?.profileImage ||
                      currentUser?.avatar ||
                      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
                    }
                    alt={currentUser?.name || 'User'}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 mr-1" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-[6px] bg-white border border-slate-200 shadow-xl p-2 z-50 text-xs font-medium animate-scale-in space-y-1">
                    {/* User info Header */}
                    <div className="p-3 border-b border-slate-100">
                      <p className="font-extrabold text-[#1B1B26] text-sm truncate">
                        {currentUser?.name || 'Priya Sharma'}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {currentUser?.email || 'priya.sharma@globetrotter.io'}
                      </p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-[#714B67]/10 text-[#714B67]">
                          {currentUser?.role || 'Traveler'}
                        </span>
                      </div>
                    </div>

                    {/* Menu Links */}
                    <Link
                      to="/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-[4px] text-slate-700 hover:bg-slate-50 hover:text-[#714B67] transition-colors"
                    >
                      <Layers className="w-4 h-4 text-slate-400" />
                      Dashboard
                    </Link>

                    <Link
                      to="/documents"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-[4px] text-slate-700 hover:bg-slate-50 hover:text-[#714B67] transition-colors"
                    >
                      <FileText className="w-4 h-4 text-slate-400" />
                      Document Vault
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-[4px] text-slate-700 hover:bg-slate-50 hover:text-[#714B67] transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      Traveler Profile
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-[4px] text-slate-700 hover:bg-slate-50 hover:text-[#714B67] transition-colors"
                    >
                      <Sliders className="w-4 h-4 text-slate-400" />
                      Settings & Preferences
                    </Link>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                          navigate('/login');
                        }}
                        className="flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-[4px] text-rose-600 hover:bg-rose-50 font-semibold transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button size="xs" variant="secondary">
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="xs" variant="primary">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-[6px] hover:bg-slate-100 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Flyout Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 space-y-2 animate-fade-in text-left">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-[6px] text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between px-3">
              <Link
                to="/trips/create"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full"
              >
                <Button size="sm" variant="primary" className="w-full" icon={Plus}>
                  Plan New Trip
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
