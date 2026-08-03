import React from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCw, 
  ShieldCheck, 
  Activity,
  Maximize2
} from 'lucide-react';
import { formatFiat, formatCrypto } from '../utils/formatters.js';
import { FIAT_CURRENCIES } from '../utils/currencies.js';

export class CryptoPriceTicker extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      // Mock live price state with trend histories
      tickerData: {
        BTC: {
          symbol: 'BTC',
          name: 'Bitcoin',
          usdPrice: 67540.25,
          change24h: 3.48,
          high24h: 68120.00,
          low24h: 65900.50,
          volume24hUsd: 38450120000,
          marketCapUsd: 1320400000000,
          history: [66200, 66450, 66100, 66800, 67100, 66950, 67200, 67400, 67350, 67540],
          lastUpdateDir: 'up' // 'up' or 'down'
        },
        ETH: {
          symbol: 'ETH',
          name: 'Ethereum',
          usdPrice: 3245.80,
          change24h: 2.15,
          high24h: 3290.00,
          low24h: 3140.20,
          volume24hUsd: 19820450000,
          marketCapUsd: 390150000000,
          history: [3150, 3175, 3160, 3190, 3210, 3205, 3220, 3235, 3230, 3245],
          lastUpdateDir: 'up'
        }
      },
      isLiveConnected: true,
      lastTickTime: new Date(),
      activeTab: 'all'
    };

    this.tickInterval = null;
    this.triggerMockTick = this.triggerMockTick.bind(this);
    this.handleQuickTrade = this.handleQuickTrade.bind(this);
  }

  componentDidMount() {
    // Start real-time mock price ticks every 3.5 seconds
    this.tickInterval = setInterval(() => {
      this.triggerMockTick();
    }, 3500);
  }

  componentWillUnmount() {
    if (this.tickInterval) clearInterval(this.tickInterval);
  }

  triggerMockTick() {
    if (!this.state.isLiveConnected) return;

    this.setState((prev) => {
      const updated = { ...prev.tickerData };

      ['BTC', 'ETH'].forEach((symbol) => {
        const coin = { ...updated[symbol] };
        // Random change between -0.18% and +0.22%
        const pctDelta = (Math.random() * 0.4 - 0.18) / 100;
        const priceDelta = coin.usdPrice * pctDelta;
        const newPrice = Math.max(1, coin.usdPrice + priceDelta);
        const dir = newPrice >= coin.usdPrice ? 'up' : 'down';

        // Update history array (keep last 12 points)
        const newHist = [...coin.history.slice(1), parseFloat(newPrice.toFixed(2))];

        coin.usdPrice = parseFloat(newPrice.toFixed(2));
        coin.change24h = parseFloat((coin.change24h + (pctDelta * 10)).toFixed(2));
        coin.history = newHist;
        coin.lastUpdateDir = dir;

        if (coin.usdPrice > coin.high24h) coin.high24h = coin.usdPrice;
        if (coin.usdPrice < coin.low24h) coin.low24h = coin.usdPrice;

        updated[symbol] = coin;
      });

      return {
        tickerData: updated,
        lastTickTime: new Date()
      };
    });
  }

  handleQuickTrade(coinSymbol, mode) {
    const { navigate } = this.context;
    if (navigate) {
      navigate(mode, { coin: coinSymbol });
    }
  }

  // Render SVG Sparkline
  renderSparkline(historyData, isPositive) {
    if (!historyData || historyData.length < 2) return null;

    const min = Math.min(...historyData);
    const max = Math.max(...historyData);
    const range = max - min || 1;
    const width = 160;
    const height = 40;

    const points = historyData.map((val, idx) => {
      const x = (idx / (historyData.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 8) - 4;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    const strokeColor = isPositive ? '#00B894' : '#F43F5E';
    const fillColor = isPositive ? 'rgba(0, 184, 148, 0.15)' : 'rgba(244, 63, 94, 0.15)';

    const firstPoint = `0,${height}`;
    const lastPoint = `${width},${height}`;
    const areaPoints = `${firstPoint} ${points} ${lastPoint}`;

    return (
      <div className="relative w-full h-10 overflow-hidden">
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          <polygon points={areaPoints} fill={fillColor} />
          <polyline
            fill="none"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
        </svg>
      </div>
    );
  }

  render() {
    const { selectedCurrency } = this.context;
    const { tickerData, isLiveConnected, lastTickTime } = this.state;

    const currObj = FIAT_CURRENCIES.find(c => c.code === selectedCurrency) || FIAT_CURRENCIES[0];

    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-xs font-bold text-[#00B894] uppercase tracking-wider">
                  Real-time Market Ticker
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
                Live BTC & ETH Price Stream
              </h2>
            </div>

            {/* Connection Status & Manual Refresh */}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="font-mono text-[11px] font-bold text-emerald-400">
                  {isLiveConnected ? 'FEED ACTIVE' : 'PAUSED'}
                </span>
                <span className="text-slate-600">|</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Updated {lastTickTime.toLocaleTimeString()}
                </span>
              </div>

              <button
                onClick={() => this.triggerMockTick()}
                title="Force Refresh Rates"
                className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cards Grid featuring BTC and ETH Glass Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* BITCOIN (BTC) GLASS CARD */}
            {(() => {
              const btc = tickerData.BTC;
              const localPrice = btc.usdPrice * currObj.rateToUsd;
              const isPositive = btc.change24h >= 0;
              const isFlashUp = btc.lastUpdateDir === 'up';

              return (
                <div className="glass-card p-6 sm:p-7 rounded-3xl space-y-5 border border-amber-500/30 hover:border-amber-500/60 transition-all shadow-2xl relative overflow-hidden group">
                  {/* Glowing background accent */}
                  <div className="absolute -top-16 -right-16 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

                  {/* Top Bar */}
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-amber-500/20 group-hover:scale-105 transition">
                        ₿
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-extrabold text-white">Bitcoin</h3>
                          <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase border border-amber-500/30">
                            BTC
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">Market Leader • Layer 1</span>
                      </div>
                    </div>

                    {/* 24h Change Badge */}
                    <div className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 shadow ${
                      isPositive 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      <span>{isPositive ? '+' : ''}{btc.change24h}%</span>
                    </div>
                  </div>

                  {/* Main Price & Local Fiat Display */}
                  <div className="space-y-1 relative z-10">
                    <div className="flex items-baseline gap-2">
                      <span className={`text-3xl sm:text-4xl font-black font-mono transition-colors duration-300 ${
                        isFlashUp ? 'text-emerald-300' : 'text-rose-300'
                      }`}>
                        {formatFiat(localPrice, selectedCurrency)}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold uppercase">
                        / 1 BTC
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
                      <span>USD: ${btc.usdPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-semibold">Live Socket Streaming</span>
                    </div>
                  </div>

                  {/* Sparkline Chart */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase mb-1">
                      <span>15-Tick Micro Trend</span>
                      <span className="text-amber-400 font-mono">${btc.low24h.toLocaleString()} - ${btc.high24h.toLocaleString()}</span>
                    </div>
                    {this.renderSparkline(btc.history, isPositive)}
                  </div>

                  {/* High / Low / Volume Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block font-bold uppercase">24h High</span>
                      <span className="font-mono font-bold text-white">
                        {formatFiat(btc.high24h * currObj.rateToUsd, selectedCurrency)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block font-bold uppercase">24h Low</span>
                      <span className="font-mono font-bold text-slate-300">
                        {formatFiat(btc.low24h * currObj.rateToUsd, selectedCurrency)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block font-bold uppercase">24h Volume</span>
                      <span className="font-mono font-bold text-emerald-400">
                        ${(btc.volume24hUsd / 1e9).toFixed(2)}B
                      </span>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                      onClick={() => this.handleQuickTrade('BTC', 'buy')}
                      className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                      <span>Instant Buy BTC</span>
                    </button>

                    <button
                      onClick={() => this.handleQuickTrade('BTC', 'sell')}
                      className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <ArrowDownLeft className="w-4 h-4 text-amber-400" />
                      <span>Sell BTC</span>
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* ETHEREUM (ETH) GLASS CARD */}
            {(() => {
              const eth = tickerData.ETH;
              const localPrice = eth.usdPrice * currObj.rateToUsd;
              const isPositive = eth.change24h >= 0;
              const isFlashUp = eth.lastUpdateDir === 'up';

              return (
                <div className="glass-card p-6 sm:p-7 rounded-3xl space-y-5 border border-indigo-500/30 hover:border-indigo-500/60 transition-all shadow-2xl relative overflow-hidden group">
                  {/* Glowing background accent */}
                  <div className="absolute -top-16 -right-16 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

                  {/* Top Bar */}
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition">
                        Ξ
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-extrabold text-white">Ethereum</h3>
                          <span className="px-2 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase border border-indigo-500/30">
                            ETH
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">Smart Contracts • Layer 1</span>
                      </div>
                    </div>

                    {/* 24h Change Badge */}
                    <div className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 shadow ${
                      isPositive 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      <span>{isPositive ? '+' : ''}{eth.change24h}%</span>
                    </div>
                  </div>

                  {/* Main Price & Local Fiat Display */}
                  <div className="space-y-1 relative z-10">
                    <div className="flex items-baseline gap-2">
                      <span className={`text-3xl sm:text-4xl font-black font-mono transition-colors duration-300 ${
                        isFlashUp ? 'text-emerald-300' : 'text-rose-300'
                      }`}>
                        {formatFiat(localPrice, selectedCurrency)}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold uppercase">
                        / 1 ETH
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
                      <span>USD: ${eth.usdPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-semibold">Live Socket Streaming</span>
                    </div>
                  </div>

                  {/* Sparkline Chart */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase mb-1">
                      <span>15-Tick Micro Trend</span>
                      <span className="text-indigo-400 font-mono">${eth.low24h.toLocaleString()} - ${eth.high24h.toLocaleString()}</span>
                    </div>
                    {this.renderSparkline(eth.history, isPositive)}
                  </div>

                  {/* High / Low / Volume Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block font-bold uppercase">24h High</span>
                      <span className="font-mono font-bold text-white">
                        {formatFiat(eth.high24h * currObj.rateToUsd, selectedCurrency)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block font-bold uppercase">24h Low</span>
                      <span className="font-mono font-bold text-slate-300">
                        {formatFiat(eth.low24h * currObj.rateToUsd, selectedCurrency)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block font-bold uppercase">24h Volume</span>
                      <span className="font-mono font-bold text-emerald-400">
                        ${(eth.volume24hUsd / 1e9).toFixed(2)}B
                      </span>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                      onClick={() => this.handleQuickTrade('ETH', 'buy')}
                      className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                      <span>Instant Buy ETH</span>
                    </button>

                    <button
                      onClick={() => this.handleQuickTrade('ETH', 'sell')}
                      className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <ArrowDownLeft className="w-4 h-4 text-indigo-400" />
                      <span>Sell ETH</span>
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </section>
    );
  }
}

export default CryptoPriceTicker;
