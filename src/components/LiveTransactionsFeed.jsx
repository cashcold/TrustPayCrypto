import React from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle2, 
  Clock, 
  Zap, 
  ShieldCheck, 
  Bell, 
  X,
  TrendingUp,
  Globe
} from 'lucide-react';
import { formatFiat, formatCrypto } from '../utils/formatters.js';
import { FIAT_CURRENCIES } from '../utils/currencies.js';

const RANDOM_NAMES = [
  { name: 'Kow Kwame', country: 'Ghana', flag: '🇬🇭', defaultFiat: 'GHS' },
  { name: 'Amina B.', country: 'Nigeria', flag: '🇳🇬', defaultFiat: 'NGN' },
  { name: 'Michael S.', country: 'United States', flag: '🇺🇸', defaultFiat: 'USD' },
  { name: 'David W.', country: 'United Kingdom', flag: '🇬🇧', defaultFiat: 'GBP' },
  { name: 'Kipchoge M.', country: 'Kenya', flag: '🇰🇪', defaultFiat: 'KES' },
  { name: 'Sophie L.', country: 'Germany', flag: '🇩🇪', defaultFiat: 'EUR' },
  { name: 'Sipho N.', country: 'South Africa', flag: '🇿🇦', defaultFiat: 'ZAR' },
  { name: 'Tariq H.', country: 'UAE', flag: '🇦🇪', defaultFiat: 'AED' },
  { name: 'Jean-Claude', country: 'France', flag: '🇫🇷', defaultFiat: 'EUR' },
  { name: 'Liam P.', country: 'Canada', flag: '🇨🇦', defaultFiat: 'CAD' },
  { name: 'Aarav K.', country: 'India', flag: '🇮🇳', defaultFiat: 'INR' },
  { name: 'Lucas R.', country: 'Brazil', flag: '🇧🇷', defaultFiat: 'BRL' }
];

const COINS = [
  { symbol: 'BTC', usdPrice: 67500 },
  { symbol: 'ETH', usdPrice: 3200 },
  { symbol: 'USDT_TRC20', usdPrice: 1.0 },
  { symbol: 'USDT_ERC20', usdPrice: 1.0 }
];

const PAYMENT_METHODS = [
  'MTN Mobile Money',
  'Telecel Cash',
  'Bank Wire Transfer',
  'Wise Payment',
  'Revolut Instant',
  'Visa Card',
  'Zelle P2P',
  'SEPA Instant'
];

export class LiveTransactionsFeed extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      transactions: [],
      filter: 'all', // 'all', 'buy', 'sell'
      latestToast: null,
      showToasts: true,
      tradedVolume10mUsd: 24850
    };

    this.timer = null;
    this.timeUpdateTimer = null;
    this.generateNewTransaction = this.generateNewTransaction.bind(this);
    this.dismissToast = this.dismissToast.bind(this);
  }

  componentDidMount() {
    // Generate initial 6 transactions spanning the last 9 minutes
    const initialTxs = [];
    const now = Date.now();
    const timesInMinsAgo = [0.5, 2, 4, 6, 8, 9.5];

    timesInMinsAgo.forEach((mins, i) => {
      initialTxs.push(this.createRandomTx(now - mins * 60 * 1000, i));
    });

    this.setState({ transactions: initialTxs });

    // Set interval to add a new transaction every 14 seconds (approx 3 transactions every 45-60s, continuous stream)
    this.timer = setInterval(() => {
      this.generateNewTransaction();
    }, 14000);

    // Update relative timestamps every 10 seconds
    this.timeUpdateTimer = setInterval(() => {
      this.forceUpdate();
    }, 10000);
  }

  componentWillUnmount() {
    if (this.timer) clearInterval(this.timer);
    if (this.timeUpdateTimer) clearInterval(this.timeUpdateTimer);
  }

  createRandomTx(timestamp, index) {
    const userObj = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
    const coinObj = COINS[Math.floor(Math.random() * COINS.length)];
    const type = Math.random() > 0.45 ? 'BUY' : 'SELL';
    
    // Generate crypto amount
    let cryptoAmt = 0;
    if (coinObj.symbol === 'BTC') {
      cryptoAmt = parseFloat((Math.random() * 0.15 + 0.005).toFixed(5));
    } else if (coinObj.symbol === 'ETH') {
      cryptoAmt = parseFloat((Math.random() * 2.5 + 0.1).toFixed(4));
    } else {
      cryptoAmt = parseFloat((Math.random() * 1500 + 50).toFixed(2));
    }

    const usdVal = cryptoAmt * coinObj.usdPrice;
    const payment = PAYMENT_METHODS[Math.floor(Math.random() * PAYMENT_METHODS.length)];

    return {
      id: `TX-${Date.now().toString().slice(-6)}-${index || Math.floor(Math.random() * 100)}`,
      user: userObj.name,
      country: userObj.country,
      flag: userObj.flag,
      fiatCode: userObj.defaultFiat,
      type,
      coin: coinObj.symbol,
      cryptoAmount: cryptoAmt,
      usdValue: usdVal,
      paymentMethod: payment,
      status: 'Completed',
      timestamp: timestamp || Date.now()
    };
  }

  generateNewTransaction() {
    const newTx = this.createRandomTx(Date.now());
    this.setState((prev) => {
      const updatedList = [newTx, ...prev.transactions.slice(0, 14)]; // keep last 15
      const newVolume = prev.tradedVolume10mUsd + newTx.usdValue;
      return {
        transactions: updatedList,
        latestToast: newTx,
        tradedVolume10mUsd: newVolume
      };
    });

    // Auto dismiss toast after 6 seconds
    setTimeout(() => {
      this.setState((prev) => {
        if (prev.latestToast && prev.latestToast.id === newTx.id) {
          return { latestToast: null };
        }
        return null;
      });
    }, 6000);
  }

  dismissToast() {
    this.setState({ latestToast: null });
  }

  getRelativeTime(timestamp) {
    const diffSecs = Math.floor((Date.now() - timestamp) / 1000);
    if (diffSecs < 15) return 'Just now';
    if (diffSecs < 60) return `${diffSecs}s ago`;
    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins === 1) return '1m ago';
    if (diffMins < 60) return `${diffMins}m ago`;
    return '10m+ ago';
  }

  render() {
    const { selectedCurrency } = this.context;
    const { transactions, filter, latestToast, showToasts, tradedVolume10mUsd } = this.state;

    const currObj = FIAT_CURRENCIES.find(c => c.code === selectedCurrency) || FIAT_CURRENCIES[0];

    // Filter transactions
    const filteredTxs = transactions.filter(tx => {
      if (filter === 'buy') return tx.type === 'BUY';
      if (filter === 'sell') return tx.type === 'SELL';
      return true;
    });

    // Count within last 10 mins
    const now = Date.now();
    const last10mCount = transactions.filter(t => (now - t.timestamp) <= 10 * 60 * 1000).length;

    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12">
        <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 relative border border-slate-800">
          {/* Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-bold text-[#00B894] uppercase tracking-wider">
                  Live Global Activity Stream
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Recent Platform Transactions
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Real-time stream of crypto buys & sells executed on TrustPay Crypto across 100+ countries.
              </p>
            </div>

            {/* Quick Metrics Badge */}
            <div className="flex flex-wrap items-center gap-3 bg-slate-900/90 p-3 rounded-2xl border border-slate-800 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Volume (Last 10m)</span>
                <span className="text-white font-extrabold font-mono">
                  {formatFiat(tradedVolume10mUsd * currObj.rateToUsd, selectedCurrency)}
                </span>
              </div>
              <div className="h-6 w-px bg-slate-800"></div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Active Trades</span>
                <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-emerald-400" />
                  {last10mCount + 3} Trades / 10m
                </span>
              </div>
            </div>
          </div>

          {/* Filter Controls & Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => this.setState({ filter: 'all' })}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition ${
                  filter === 'all' ? 'bg-[#005B52] text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                All Live Orders
              </button>
              <button
                onClick={() => this.setState({ filter: 'buy' })}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1 ${
                  filter === 'buy' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-emerald-400'
                }`}
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                Buy Orders
              </button>
              <button
                onClick={() => this.setState({ filter: 'sell' })}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1 ${
                  filter === 'sell' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-amber-400'
                }`}
              >
                <ArrowDownLeft className="w-3.5 h-3.5" />
                Sell Orders
              </button>
            </div>

            <button
              onClick={() => this.setState(p => ({ showToasts: !p.showToasts }))}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                showToasts 
                  ? 'bg-slate-800 border-emerald-500/40 text-emerald-300' 
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{showToasts ? 'Live Popups Enabled' : 'Popups Muted'}</span>
            </button>
          </div>

          {/* Live Transactions List / Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredTxs.map((tx) => {
              const localFiatVal = tx.usdValue * currObj.rateToUsd;
              const isBuy = tx.type === 'BUY';

              return (
                <div 
                  key={tx.id}
                  className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/90 hover:border-[#00B894]/40 transition space-y-2.5 text-xs group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{tx.flag}</span>
                      <div>
                        <span className="font-bold text-white block leading-none">{tx.user}</span>
                        <span className="text-[10px] text-slate-400">{tx.country}</span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 ${
                      isBuy ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {isBuy ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownLeft className="w-3 h-3" />}
                      {tx.type}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Traded Asset</span>
                      <span className="font-mono font-bold text-white text-xs">
                        {formatCrypto(tx.cryptoAmount, tx.coin)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-semibold">Value</span>
                      <span className="font-mono font-black text-emerald-400 text-xs">
                        {formatFiat(localFiatVal, selectedCurrency)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1 text-slate-300">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#00B894]" />
                      {tx.paymentMethod}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[10px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      {this.getRelativeTime(tx.timestamp)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center pt-2">
            <span className="text-[11px] text-slate-400 font-medium">
              ⚡ Over <strong className="text-white">1,420+ transactions</strong> processed in the last 24 hours with 99.8% instant settlement speed.
            </span>
          </div>
        </div>

        {/* Live Floating Toast Popup Notification */}
        {showToasts && latestToast && (
          <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#1A1A1A] border-2 border-[#00B894] p-4 rounded-2xl shadow-2xl text-white animate-bounce-subtle flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#005B52] text-[#00B894] flex-shrink-0">
              <Zap className="w-5 h-5 fill-[#00B894]" />
            </div>

            <div className="flex-1 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  New Trade Completed
                </span>
                <button onClick={this.dismissToast} className="text-slate-400 hover:text-white p-0.5">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-slate-200">
                <strong className="text-white">{latestToast.flag} {latestToast.user}</strong> ({latestToast.country}) just{' '}
                <span className="text-emerald-300 font-bold">{latestToast.type.toLowerCase()}ed</span>{' '}
                <strong>{formatCrypto(latestToast.cryptoAmount, latestToast.coin)}</strong> using {latestToast.paymentMethod}!
              </p>

              <span className="text-[10px] text-slate-400 font-mono block pt-0.5">
                Valued at {formatFiat(latestToast.usdValue * currObj.rateToUsd, selectedCurrency)} • Just now
              </span>
            </div>
          </div>
        )}
      </section>
    );
  }
}

export default LiveTransactionsFeed;
