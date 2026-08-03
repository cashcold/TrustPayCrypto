import React from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { FIAT_CURRENCIES } from '../utils/currencies.js';
import { 
  ShieldCheck, 
  Sun, 
  Moon, 
  Bell, 
  User, 
  LogOut, 
  Menu, 
  X, 
  LayoutDashboard, 
  ShieldAlert, 
  ArrowLeftRight, 
  Wallet, 
  Users, 
  Globe,
  ChevronDown,
  Zap,
  Coins,
  TrendingUp,
  HelpCircle,
  Clock,
  CheckCircle2,
  Lock
} from 'lucide-react';

export class Header extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      isMobileMenuOpen: false,
      isProfileDropdownOpen: false,
      isCurrencyDropdownOpen: false
    };

    this.toggleMobileMenu = this.toggleMobileMenu.bind(this);
    this.toggleProfileDropdown = this.toggleProfileDropdown.bind(this);
    this.toggleCurrencyDropdown = this.toggleCurrencyDropdown.bind(this);
    this.closeAll = this.closeAll.bind(this);
  }

  toggleMobileMenu() {
    this.setState((prev) => ({ 
      isMobileMenuOpen: !prev.isMobileMenuOpen,
      isProfileDropdownOpen: false,
      isCurrencyDropdownOpen: false
    }));
  }

  toggleProfileDropdown() {
    this.setState((prev) => ({ 
      isProfileDropdownOpen: !prev.isProfileDropdownOpen, 
      isCurrencyDropdownOpen: false 
    }));
  }

  toggleCurrencyDropdown() {
    this.setState((prev) => ({ 
      isCurrencyDropdownOpen: !prev.isCurrencyDropdownOpen, 
      isProfileDropdownOpen: false 
    }));
  }

  closeAll() {
    this.setState({
      isMobileMenuOpen: false,
      isProfileDropdownOpen: false,
      isCurrencyDropdownOpen: false
    });
  }

  render() {
    const { 
      user, 
      activePage, 
      navigate, 
      theme, 
      toggleTheme, 
      logout, 
      unreadNotifCount,
      selectedCurrency,
      setSelectedCurrency 
    } = this.context;

    const isDark = theme === 'dark';
    const activeCurrObj = FIAT_CURRENCIES.find(c => c.code === selectedCurrency) || FIAT_CURRENCIES[0];

    const navItems = [
      { id: 'home', label: 'Home', icon: ArrowLeftRight },
      { id: 'buy', label: 'Buy Crypto', icon: Zap },
      { id: 'sell', label: 'Sell Crypto', icon: Coins },
      { id: 'swap', label: 'Swap Crypto', icon: ArrowLeftRight },
      { id: 'rates', label: 'Live Rates', icon: TrendingUp },
      { id: 'referral', label: 'Referral (3%)', icon: Users },
      { id: 'wallet', label: 'Wallet', icon: Wallet },
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, authRequired: true },
      { id: 'support', label: 'Support', icon: HelpCircle }
    ];

    return (
      <header className={`sticky top-0 z-40 transition-colors duration-200 border-b ${
        isDark ? 'bg-[#121212]/95 border-slate-800/80 backdrop-blur-lg' : 'bg-slate-900/95 border-slate-800 backdrop-blur-lg text-white'
      }`}>
        {/* Top Global Status Banner */}
        <div className="bg-gradient-to-r from-[#005B52] to-[#00B894] text-white text-[11px] py-1.5 px-3 sm:px-4 shadow-inner">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-2 overflow-hidden">
            <div className="flex items-center gap-1.5 truncate">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300 flex-shrink-0" />
              <span className="font-extrabold flex-shrink-0">TrustPay Global:</span>
              <span className="text-emerald-100 truncate font-medium">
                100+ Countries • Instant Exchange • 0% Hidden Fees
              </span>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-100 flex-shrink-0">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
                <span className="hidden sm:inline">API Connected</span>
              </span>
            </div>
          </div>
        </div>

        {/* Primary Navigation Header */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Brand Logo */}
            <div 
              onClick={() => { this.closeAll(); navigate('home'); }}
              className="flex items-center gap-2 sm:gap-3 cursor-pointer group flex-shrink-0"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-brand flex items-center justify-center text-white shadow-lg shadow-[#00B894]/20 group-hover:scale-105 transition-transform">
                <ArrowLeftRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-1 leading-none">
                  TrustPay <span className="text-[#00B894]">Crypto</span>
                </span>
                <span className="text-[9px] sm:text-[10px] text-emerald-400 block font-medium tracking-wider uppercase mt-0.5">
                  Global Exchange
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links (Large Screens Only) */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                if (item.authRequired && !user) return null;
                const isActive = activePage === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => { this.closeAll(); navigate(item.id); }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive 
                        ? 'bg-[#005B52]/30 text-[#00B894] border border-[#00B894]/40 font-extrabold shadow-sm' 
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}

              {user && user.role === 'admin' && (
                <button
                  onClick={() => { this.closeAll(); navigate('admin'); }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    activePage === 'admin'
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </button>
              )}
            </nav>

            {/* Header Right Action Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              {/* International Country & Fiat Currency Selector (Compact on mobile) */}
              <div className="relative">
                <button
                  onClick={this.toggleCurrencyDropdown}
                  className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-800/90 border border-slate-700 hover:border-[#00B894] transition text-white text-xs font-bold"
                  title="Select Currency"
                >
                  <span className="text-base leading-none">{activeCurrObj.flag}</span>
                  <span className="text-xs font-mono">{activeCurrObj.code}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {this.state.isCurrencyDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 sm:w-64 rounded-2xl bg-[#1A1A1A] border border-slate-800 shadow-2xl py-2 z-50 text-slate-200 text-xs">
                    <div className="px-4 py-2 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-[#00B894]" />
                      Select Local Currency
                    </div>
                    <div className="max-h-60 overflow-y-auto py-1 scrollbar-none">
                      {FIAT_CURRENCIES.map((curr) => (
                        <button
                          key={curr.code}
                          onClick={() => {
                            setSelectedCurrency(curr.code);
                            this.setState({ isCurrencyDropdownOpen: false });
                          }}
                          className={`w-full px-4 py-2.5 text-left flex items-center justify-between hover:bg-white/5 transition ${
                            selectedCurrency === curr.code ? 'bg-[#00B894]/20 text-[#00B894] font-bold' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-lg">{curr.flag}</span>
                            <div>
                              <span className="font-bold block text-xs">{curr.code} - {curr.name}</span>
                              <span className="text-[10px] text-slate-400 block">{curr.country}</span>
                            </div>
                          </div>
                          <span className="font-mono text-slate-300 font-bold">{curr.symbol}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Theme Switcher (Hidden on small mobile to avoid header clutter, available in drawer) */}
              <button
                onClick={toggleTheme}
                title="Toggle Theme"
                className={`hidden sm:flex p-2 rounded-xl transition min-w-[36px] min-h-[36px] items-center justify-center ${
                  isDark ? 'bg-slate-800 text-amber-400 hover:bg-slate-700' : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                }`}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Logged In Quick Actions for Desktop */}
              {user ? (
                <>
                  {/* Notification Bell */}
                  <button
                    onClick={() => { this.closeAll(); navigate('notifications'); }}
                    className="relative p-2 rounded-xl bg-slate-800/90 border border-slate-700 hover:border-[#00B894] text-slate-300 transition min-w-[36px] min-h-[36px] flex items-center justify-center"
                    title="Notifications"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadNotifCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                        {unreadNotifCount}
                      </span>
                    )}
                  </button>

                  {/* Profile Dropdown Button (Desktop) */}
                  <div className="hidden lg:block relative">
                    <button
                      onClick={this.toggleProfileDropdown}
                      className="flex items-center gap-2 p-1.5 pl-3 rounded-xl bg-slate-800/90 border border-slate-700 hover:border-[#00B894] transition text-left"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#00B894] text-white flex items-center justify-center font-bold text-xs uppercase">
                        {user.username ? user.username.charAt(0) : 'U'}
                      </div>
                      <div className="text-left">
                        <span className="text-xs font-bold text-white block leading-none">{user.username}</span>
                        <span className="text-[10px] text-emerald-400 capitalize block leading-tight">{user.role}</span>
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
                    </button>

                    {this.state.isProfileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#1A1A1A] border border-slate-800 shadow-2xl py-2 z-50 text-slate-200 text-xs">
                        <div className="px-4 py-2 border-b border-slate-800">
                          <p className="font-bold text-white">{user.username}</p>
                          <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                        </div>

                        <button
                          onClick={() => { this.closeAll(); navigate('dashboard'); }}
                          className="w-full px-4 py-2.5 text-left hover:bg-white/5 flex items-center gap-2 font-medium"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#00B894]" />
                          <span>Dashboard</span>
                        </button>

                        <button
                          onClick={() => { this.closeAll(); navigate('wallet'); }}
                          className="w-full px-4 py-2.5 text-left hover:bg-white/5 flex items-center gap-2 font-medium"
                        >
                          <Wallet className="w-4 h-4 text-[#00B894]" />
                          <span>My Wallet</span>
                        </button>

                        <button
                          onClick={() => { this.closeAll(); navigate('transactions'); }}
                          className="w-full px-4 py-2.5 text-left hover:bg-white/5 flex items-center gap-2 font-medium"
                        >
                          <Clock className="w-4 h-4 text-[#00B894]" />
                          <span>Transaction History</span>
                        </button>

                        <button
                          onClick={() => { this.closeAll(); navigate('profile'); }}
                          className="w-full px-4 py-2.5 text-left hover:bg-white/5 flex items-center gap-2 font-medium"
                        >
                          <User className="w-4 h-4 text-[#00B894]" />
                          <span>Profile & KYC</span>
                        </button>

                        {user.role === 'admin' && (
                          <button
                            onClick={() => { this.closeAll(); navigate('admin'); }}
                            className="w-full px-4 py-2.5 text-left bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 flex items-center gap-2 font-bold"
                          >
                            <ShieldAlert className="w-4 h-4" />
                            <span>Admin Panel</span>
                          </button>
                        )}

                        <div className="border-t border-slate-800 my-1"></div>

                        <button
                          onClick={() => { this.closeAll(); logout(); }}
                          className="w-full px-4 py-2.5 text-left text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 font-bold"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="hidden sm:flex items-center gap-1.5">
                  <button
                    onClick={() => { this.closeAll(); navigate('login'); }}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-200 hover:text-white transition"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => { this.closeAll(); navigate('register'); }}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#005B52] hover:bg-[#00B894] text-white shadow-md transition-all"
                  >
                    Get Started
                  </button>
                </div>
              )}

              {/* Mobile Navigation Hamburger Menu Toggle Button */}
              <button
                onClick={this.toggleMobileMenu}
                className="lg:hidden p-2 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-200 hover:text-white transition min-w-[42px] min-h-[42px] flex items-center justify-center"
                aria-label="Toggle navigation menu"
              >
                {this.state.isMobileMenuOpen ? <X className="w-6 h-6 text-[#00B894]" /> : <Menu className="w-6 h-6 text-white" />}
              </button>
            </div>
          </div>
        </div>

        {/* Fully Mobile Responsive Overlay Navigation Drawer */}
        {this.state.isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-[#121212] px-4 py-6 space-y-6 shadow-2xl animate-fadeIn max-h-[calc(100vh-80px)] overflow-y-auto">
            {/* User Profile Card (if logged in on Mobile) */}
            {user ? (
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-brand text-white flex items-center justify-center font-black text-base uppercase shadow-md">
                      {user.username ? user.username.charAt(0) : 'U'}
                    </div>
                    <div>
                      <span className="font-extrabold text-white text-sm block leading-none">{user.username}</span>
                      <span className="text-[11px] text-slate-400 block truncate mt-0.5">{user.email}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#005B52]/30 text-[#00B894] text-[10px] font-bold uppercase">
                    {user.role}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => { this.closeAll(); navigate('dashboard'); }}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4 text-[#00B894]" />
                    <span>Dashboard</span>
                  </button>

                  <button
                    onClick={() => { this.closeAll(); navigate('wallet'); }}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2"
                  >
                    <Wallet className="w-4 h-4 text-[#00B894]" />
                    <span>My Wallet</span>
                  </button>

                  <button
                    onClick={() => { this.closeAll(); navigate('transactions'); }}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2"
                  >
                    <Clock className="w-4 h-4 text-[#00B894]" />
                    <span>History</span>
                  </button>

                  <button
                    onClick={() => { this.closeAll(); navigate('profile'); }}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-[#00B894]" />
                    <span>Profile & KYC</span>
                  </button>
                </div>

                {user.role === 'admin' && (
                  <button
                    onClick={() => { this.closeAll(); navigate('admin'); }}
                    className="w-full py-2.5 px-3 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>Admin Control Panel</span>
                  </button>
                )}
              </div>
            ) : (
              /* Auth Action Buttons (if logged out on Mobile) */
              <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <button
                  onClick={() => { this.closeAll(); navigate('login'); }}
                  className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { this.closeAll(); navigate('register'); }}
                  className="py-3 rounded-xl bg-gradient-brand text-white font-bold text-xs text-center shadow-lg"
                >
                  Create Account
                </button>
              </div>
            )}

            {/* Mobile Navigation Links */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 block mb-2">
                Navigation Menu
              </span>
              {navItems.map((item) => {
                if (item.authRequired && !user) return null;
                const IconComp = item.icon;
                const isActive = activePage === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      this.closeAll();
                      navigate(item.id);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition flex items-center justify-between min-h-[44px] ${
                      isActive 
                        ? 'bg-[#005B52] text-white shadow-lg border border-[#00B894]/40' 
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComp className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#00B894]'}`} />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <CheckCircle2 className="w-4 h-4 text-emerald-300" />}
                  </button>
                );
              })}
            </div>

            {/* Drawer Settings & Theme Bar */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 px-2">
              <div className="flex items-center gap-2">
                <span>Theme Mode:</span>
                <button
                  onClick={toggleTheme}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                    isDark ? 'bg-slate-800 text-amber-400' : 'bg-slate-200 text-slate-900'
                  }`}
                >
                  {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                  <span>{isDark ? 'Dark' : 'Light'}</span>
                </button>
              </div>

              {user && (
                <button
                  onClick={() => { this.closeAll(); logout(); }}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 font-bold flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    );
  }
}

export default Header;

