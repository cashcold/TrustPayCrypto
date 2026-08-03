import React from 'react';
import { AppContext } from '../context/AppContext.jsx';
import CryptoCalculator from '../components/CryptoCalculator.jsx';
import CryptoPriceTicker from '../components/CryptoPriceTicker.jsx';
import LiveTransactionsFeed from '../components/LiveTransactionsFeed.jsx';
import CustomerReviews from '../components/CustomerReviews.jsx';
import { FIAT_CURRENCIES } from '../utils/currencies.js';
import { 
  ShieldCheck, 
  Zap, 
  Coins, 
  Smartphone, 
  Users, 
  ArrowRight, 
  Globe,
  Lock, 
  RefreshCw, 
  TrendingUp, 
  CheckCircle2
} from 'lucide-react';
import { formatFiat } from '../utils/formatters.js';

export class Home extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      activeFaq: 0,
      news: []
    };
  }

  componentDidMount() {
    this.fetchNews();
  }

  async fetchNews() {
    try {
      const res = await fetch('/api/news');
      const data = await res.json();
      if (data.success) {
        this.setState({ news: data.news });
      }
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    const { navigate, rates, theme, selectedCurrency } = this.context;
    const isDark = theme === 'dark';

    const currObj = FIAT_CURRENCIES.find(c => c.code === selectedCurrency) || FIAT_CURRENCIES[0];

    const supportedCoins = [
      { id: 'BTC', name: 'Bitcoin', symbol: 'BTC', network: 'Bitcoin Network', color: 'from-amber-500 to-orange-600', icon: '₿', usdPrice: rates.BTC?.usdPrice || 67500 },
      { id: 'ETH', name: 'Ethereum', symbol: 'ETH', network: 'ERC20 (Ethereum)', color: 'from-blue-500 to-indigo-600', icon: 'Ξ', usdPrice: rates.ETH?.usdPrice || 3200 },
      { id: 'USDT_ERC20', name: 'Tether USD', symbol: 'USDT', network: 'ERC20', color: 'from-emerald-500 to-teal-600', icon: '₮', usdPrice: rates.USDT_ERC20?.usdPrice || 1.0 },
      { id: 'USDT_TRC20', name: 'Tether USD', symbol: 'USDT', network: 'TRC20 (Tron)', color: 'from-red-500 to-rose-600', icon: '₮', usdPrice: rates.USDT_TRC20?.usdPrice || 1.0 }
    ];

    const paymentGateways = [
      { name: 'Global Wire Transfer', badge: 'SWIFT / FedWire / SEPA', desc: 'Instant bank transfer in USD, EUR, GBP, CAD, AUD, AED' },
      { name: 'Mobile Money', badge: 'M-Pesa / MoMo / Airtel', desc: 'Instant local payout in GHS, NGN, KES, ZAR' },
      { name: 'Credit & Debit Cards', badge: 'Visa / MasterCard', desc: 'Secure 3D-certified international card processing' },
      { name: 'Multi-Currency Accounts', badge: 'Wise / Revolut', desc: 'Seamless integration with Wise & Revolut wallets' },
      { name: 'Instant Bank P2P', badge: 'Zelle / Pix / PayID / UPI', desc: 'Instant regional payment networks across 100+ countries' }
    ];

    const faqs = [
      { q: 'Which countries and currencies are supported?', a: 'TrustPay Crypto is a fully international exchange supporting 100+ countries with local bank transfers, mobile money, cards, Wise, Revolut, SEPA, and wire transfers across USD, EUR, GBP, GHS, NGN, KES, ZAR, CAD, AUD, INR, BRL, and AED.' },
      { q: 'How long does a Buy or Sell order take?', a: 'Orders are processed automatically or manually within 5 to 15 minutes once payment or crypto deposit is confirmed on the blockchain.' },
      { q: 'How does the 3% Global Referral Program work?', a: 'Share your unique referral link anywhere in the world. When a referred friend completes their first buy or sell trade, you receive a 3% cash bonus deposited directly into your fiat wallet!' },
      { q: 'Are my funds secure on TrustPay Crypto?', a: 'Yes. We utilize bank-grade encryption, cold storage for crypto assets, and strict KYC verification to protect all users globally.' }
    ];

    return (
      <div className="space-y-20 pb-20">
        {/* Large Hero Section */}
        <section className="relative pt-12 lg:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Subtle Background Glow Spheres */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#00B894]/15 blur-[120px] rounded-full pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Text Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#00B894]/10 border border-[#00B894]/20 rounded-full w-max">
                <Globe className="w-3.5 h-3.5 text-[#00B894]" />
                <span className="text-xs font-bold text-[#00B894] uppercase tracking-wider">International Exchange: 100+ Countries</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
                Buy & Sell Crypto <br className="hidden sm:inline"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00B894] to-[#2ECC71]">In Any Local Currency.</span>
              </h1>

              <p className="text-gray-300 text-base sm:text-lg max-w-2xl leading-relaxed">
                Exchange Bitcoin, Ethereum, and USDT instantly with local bank transfers, mobile money, cards, Wise, SEPA, and Wire Transfers globally.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => navigate('buy')}
                  className="px-6 py-4 bg-[#00B894] text-white rounded-xl font-bold flex items-center gap-2 hover:translate-y-[-2px] transition-all shadow-lg shadow-[#00B894]/20"
                >
                  <Zap className="w-5 h-5" />
                  <span>Buy Crypto</span>
                </button>

                <button
                  onClick={() => navigate('sell')}
                  className="px-6 py-4 border border-white/20 hover:bg-white/5 text-white rounded-xl font-bold transition-all flex items-center gap-2"
                >
                  <Coins className="w-5 h-5 text-amber-400" />
                  <span>Sell Crypto</span>
                </button>

                <button
                  onClick={() => navigate('swap')}
                  className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 border border-emerald-400/30"
                >
                  <RefreshCw className="w-5 h-5 text-white" />
                  <span>Swap Crypto</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <span className="text-2xl font-black text-white block">$50M+</span>
                  <span className="text-xs text-slate-400">Global Traded Volume</span>
                </div>
                <div>
                  <span className="text-2xl font-black text-white block">&lt; 5 Mins</span>
                  <span className="text-xs text-slate-400">Avg Settlement</span>
                </div>
                <div>
                  <span className="text-2xl font-black text-[#00B894] block">3% Reward</span>
                  <span className="text-xs text-slate-400">Global Referral Program</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Calculator Widget */}
            <div className="lg:col-span-5">
              <CryptoCalculator />
            </div>
          </div>
        </section>

        {/* Real-time Cryptocurrency Price Ticker Section (BTC & ETH Glass Cards) */}
        <CryptoPriceTicker />

        {/* Live Market Pricing Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold text-[#00B894] uppercase tracking-wider">Live Market Pricing</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Supported Cryptocurrencies ({currObj.flag} {selectedCurrency})</h2>
            </div>
            <button 
              onClick={() => navigate('rates')}
              className="text-xs font-bold text-[#00B894] hover:underline flex items-center gap-1 mt-2 md:mt-0"
            >
              <span>View All Market Rates</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportedCoins.map((coin) => {
              const priceInLocalFiat = coin.usdPrice * currObj.rateToUsd;
              return (
                <div 
                  key={coin.id}
                  className="glass-card p-6 rounded-3xl space-y-4 hover:border-[#00B894]/50 transition group cursor-pointer"
                  onClick={() => navigate('buy', { coin: coin.id })}
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${coin.color} flex items-center justify-center text-white text-xl font-bold shadow-md`}>
                      {coin.icon}
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold">
                      {coin.network}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#00B894] transition">{coin.name}</h3>
                    <p className="text-xs text-slate-400">{coin.symbol}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Current Price ({selectedCurrency})</span>
                      <span className="font-bold text-white">{formatFiat(priceInLocalFiat, selectedCurrency)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-emerald-400 block font-bold">Instant Buy</span>
                      <span className="text-xs text-emerald-400 font-extrabold flex items-center gap-1">
                        Trade <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Dynamic Live Activity & Platform Transactions Feed */}
        <LiveTransactionsFeed />

        {/* Why Choose Us Features */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold text-[#00B894] uppercase tracking-wider">Enterprise Security & Global Reach</span>
            <h2 className="text-3xl font-extrabold text-white">Why Trade On TrustPay Crypto?</h2>
            <p className="text-slate-400 text-sm">
              We connect local payment methods with global liquidity pools to provide fast, secure, low-fee cryptocurrency exchange worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-3xl space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#005B52] text-[#00B894] flex items-center justify-center border border-[#00B894]/30">
                <Globe className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">100+ Countries & Currencies</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Pay in USD, EUR, GBP, GHS, NGN, KES, ZAR, CAD, AUD, INR, BRL, or AED. Pick your country and exchange instantly.
              </p>
            </div>

            <div className="glass-card p-8 rounded-3xl space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#005B52] text-[#00B894] flex items-center justify-center border border-[#00B894]/30">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">Bank-Grade Protection</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Protected by cold storage security, SSL encryption, and automated fraud protection algorithms for safe global transfers.
              </p>
            </div>

            <div className="glass-card p-8 rounded-3xl space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#005B52] text-[#00B894] flex items-center justify-center border border-[#00B894]/30">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">3% Referral Program</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Earn 3% commission on the first completed transaction of every user you invite to the platform. Instant withdrawal anytime.
              </p>
            </div>
          </div>
        </section>

        {/* International Payment Gateways Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel p-8 sm:p-12 rounded-3xl space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold text-[#00B894] uppercase tracking-wider">Global Payment Infrastructure</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Supported Payment Gateways</h2>
              <p className="text-slate-400 text-sm">Choose from local mobile wallets, card processing, or global banking rails.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paymentGateways.map((pm) => (
                <div key={pm.name} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{pm.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#005B52] text-emerald-300">
                      {pm.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{pm.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Verified Customer Reviews & Feedback Section */}
        <CustomerReviews />

        {/* Live Market News Feed */}
        {this.state.news.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Global Crypto Market News</h2>
              <span className="text-xs text-slate-400">Live API Feed</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {this.state.news.map((item) => (
                <div key={item.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <span className="px-2 py-0.5 rounded bg-[#005B52]/30 text-[#00B894] text-[10px] font-bold">
                    {item.category}
                  </span>
                  <h4 className="text-sm font-bold text-white line-clamp-2">{item.title}</h4>
                  <div className="flex justify-between items-center text-[11px] text-slate-500 pt-2 border-t border-slate-800">
                    <span>{item.source}</span>
                    <span>{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAQ Section */}
        <section className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10 space-y-2">
            <span className="text-xs font-bold text-[#00B894] uppercase tracking-wider">Frequently Asked Questions</span>
            <h2 className="text-3xl font-extrabold text-white">Everything You Need To Know</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((f, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 cursor-pointer"
                onClick={() => this.setState({ activeFaq: this.state.activeFaq === idx ? -1 : idx })}
              >
                <div className="flex justify-between items-center font-bold text-white text-sm">
                  <span>{f.q}</span>
                  <span className="text-[#00B894] text-lg">{this.state.activeFaq === idx ? '−' : '+'}</span>
                </div>
                {this.state.activeFaq === idx && (
                  <p className="mt-3 text-xs text-slate-400 leading-relaxed border-t border-slate-800 pt-3">
                    {f.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }
}

export default Home;
