import React from 'react';
import { api } from '../services/api.js';
import { FIAT_CURRENCIES } from '../utils/currencies.js';

export const AppContext = React.createContext();

export class AppProvider extends React.Component {
  constructor(props) {
    super(props);

    // Initialize user from local storage if previously logged in
    let savedUser = null;
    let savedCurrency = 'USD';

    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('trustpay_user');
        if (storedUser) savedUser = JSON.parse(storedUser);

        const storedCurr = localStorage.getItem('trustpay_currency');
        if (storedCurr) savedCurrency = storedCurr;
        else if (savedUser && savedUser.preferredCurrency) savedCurrency = savedUser.preferredCurrency;
      } catch (e) {
        console.error('Failed to parse localStorage user/currency', e);
      }
    }

    this.state = {
      user: savedUser,
      selectedCurrency: savedCurrency, // 'USD', 'EUR', 'GBP', 'GHS', 'NGN', 'KES', 'ZAR', 'CAD', 'AUD', 'INR', 'BRL', 'AED'
      currencies: FIAT_CURRENCIES,
      activePage: 'home',
      pageParams: {},
      theme: 'dark',
      rates: {
        BTC: { usdPrice: 67500, change24h: 3.42 },
        ETH: { usdPrice: 3200, change24h: -1.15 },
        USDT_ERC20: { usdPrice: 1.00, change24h: 0.02 },
        USDT_TRC20: { usdPrice: 1.00, change24h: 0.01 }
      },
      wallets: [],
      unreadNotifCount: 0,
      toast: null,
      isLoading: false
    };

    this.navigate = this.navigate.bind(this);
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
    this.logout = this.logout.bind(this);
    this.setSelectedCurrency = this.setSelectedCurrency.bind(this);
    this.toggleTheme = this.toggleTheme.bind(this);
    this.showToast = this.showToast.bind(this);
    this.refreshUser = this.refreshUser.bind(this);
    this.refreshRates = this.refreshRates.bind(this);
    this.refreshWallets = this.refreshWallets.bind(this);
  }

  componentDidMount() {
    this.refreshRates();
    this.refreshWallets();

    if (this.state.user) {
      this.refreshUser();
    }

    // Parse URL query parameter or hash for referral code or page
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const ref = urlParams.get('ref');
      const pageParam = urlParams.get('page');
      const hashPage = window.location.hash.replace('#', '').trim();
      const pathPage = window.location.pathname.replace('/', '').trim();

      const initialPage = pageParam || hashPage || (pathPage && ['admin', 'swap', 'buy', 'sell', 'login', 'register', 'dashboard', 'transactions', 'wallet', 'support', 'rates'].includes(pathPage) ? pathPage : null);

      if (initialPage) {
        this.state.activePage = initialPage;
      }

      if (ref) {
        this.setState({ pageParams: { ref } });
      }

      window.addEventListener('hashchange', () => {
        const hp = window.location.hash.replace('#', '').trim();
        if (hp && hp !== this.state.activePage) {
          this.setState({ activePage: hp });
        }
      });
    }

    // Auto update rates timer
    this.rateInterval = setInterval(() => {
      this.refreshRates();
    }, 15000);
  }

  componentWillUnmount() {
    if (this.rateInterval) clearInterval(this.rateInterval);
  }

  setSelectedCurrency(currencyCode) {
    this.setState({ selectedCurrency: currencyCode });
    if (typeof window !== 'undefined') {
      localStorage.setItem('trustpay_currency', currencyCode);
    }
  }

  navigate(page, pageParams = {}) {
    this.setState({ activePage: page, pageParams });
    if (typeof window !== 'undefined') {
      window.location.hash = page;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async login(email, password) {
    this.setState({ isLoading: true });
    const res = await api.login(email, password);
    this.setState({ isLoading: false });

    if (res.success) {
      this.setState({ 
        user: res.user,
        selectedCurrency: res.user.preferredCurrency || this.state.selectedCurrency 
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem('trustpay_user', JSON.stringify(res.user));
        if (res.user.preferredCurrency) {
          localStorage.setItem('trustpay_currency', res.user.preferredCurrency);
        }
      }

      this.showToast(`Welcome back, ${res.user.username}!`, 'success');
      if (res.user.role === 'admin') {
        this.navigate('admin');
      } else {
        this.navigate('dashboard');
      }
      return res;
    } else {
      this.showToast(res.message || 'Login failed', 'error');
      return res;
    }
  }

  async register(data) {
    this.setState({ isLoading: true });
    const res = await api.register(data);
    this.setState({ isLoading: false });

    if (res.success) {
      this.setState({ 
        user: res.user,
        selectedCurrency: res.user.preferredCurrency || this.state.selectedCurrency
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem('trustpay_user', JSON.stringify(res.user));
        if (res.user.preferredCurrency) {
          localStorage.setItem('trustpay_currency', res.user.preferredCurrency);
        }
      }

      this.showToast(`Account created successfully! Welcome, ${res.user.username}.`, 'success');
      this.navigate('dashboard');
      return res;
    } else {
      this.showToast(res.message || 'Registration failed', 'error');
      return res;
    }
  }

  logout() {
    this.setState({ user: null });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('trustpay_user');
    }
    this.showToast('You have been logged out', 'info');
    this.navigate('home');
  }

  async refreshUser() {
    if (this.state.user && this.state.user.id) {
      const res = await api.getUserProfile(this.state.user.id);
      if (res.success && res.user) {
        this.setState({ user: res.user });
        if (typeof window !== 'undefined') {
          localStorage.setItem('trustpay_user', JSON.stringify(res.user));
        }
      }
    }
  }

  async refreshRates() {
    const res = await api.getRates();
    if (res.success && res.rates) {
      this.setState({ rates: res.rates });
    }
  }

  async refreshWallets() {
    const res = await api.getWallets();
    if (res.success) {
      this.setState({
        wallets: res.platformWallets || []
      });
    }
  }

  toggleTheme() {
    this.setState((prevState) => ({
      theme: prevState.theme === 'dark' ? 'light' : 'dark'
    }));
  }

  showToast(message, type = 'info') {
    this.setState({ toast: { message, type } });
    setTimeout(() => {
      this.setState({ toast: null });
    }, 4000);
  }

  render() {
    const contextValue = {
      ...this.state,
      navigate: this.navigate,
      login: this.login,
      register: this.register,
      logout: this.logout,
      setSelectedCurrency: this.setSelectedCurrency,
      toggleTheme: this.toggleTheme,
      showToast: this.showToast,
      refreshUser: this.refreshUser,
      refreshRates: this.refreshRates,
      refreshWallets: this.refreshWallets
    };

    return (
      <AppContext.Provider value={contextValue}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export default AppContext;
