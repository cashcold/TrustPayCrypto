import React from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { FIAT_CURRENCIES } from '../utils/currencies.js';
import { formatFiat, formatUsd } from '../utils/formatters.js';
import { TrendingUp, TrendingDown, RefreshCw, Zap, Coins, Globe } from 'lucide-react';

export class LiveRates extends React.Component {
  static contextType = AppContext;

  render() {
    const { rates, navigate, selectedCurrency, setSelectedCurrency } = this.context;
    const currObj = FIAT_CURRENCIES.find(c => c.code === selectedCurrency) || FIAT_CURRENCIES[0];
    const coins = Object.keys(rates || {});

    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-[#005B52]/20 text-[#00B894] text-xs font-bold uppercase tracking-wider">
              Real-Time Market Data
            </span>
            <h1 className="text-3xl font-extrabold text-white mt-1">Live Crypto Rates ({currObj.flag} {selectedCurrency})</h1>
            <p className="text-slate-400 text-sm">Updated automatically every 15 seconds. Exchange rates guaranteed with zero hidden fees.</p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white font-bold text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#00B894]"
            >
              {FIAT_CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.flag} {c.code} - {c.name}</option>
              ))}
            </select>

            <button
              onClick={() => this.context.refreshRates()}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4 text-[#00B894]" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Live Rates Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coins.map((key) => {
            const item = rates[key] || { usdPrice: 1, change24h: 0 };
            const isUp = (item.change24h || 0) >= 0;
            const displayName = key.replace('_', ' ');

            const priceInLocalFiat = (item.usdPrice || 1) * currObj.rateToUsd;

            return (
              <div key={key} className="glass-card p-6 rounded-3xl space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">{displayName}</h3>
                    <span className="text-xs text-slate-400">{formatUsd(item.usdPrice)} USD</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                    isUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                  }`}>
                    {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    {isUp ? '+' : ''}{item.change24h || 0}%
                  </span>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-xs">Local Exchange Rate ({selectedCurrency}):</span>
                    <span className="font-extrabold text-white">{formatFiat(priceInLocalFiat, selectedCurrency)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">24h Price Action:</span>
                    <span className={isUp ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {isUp ? 'Bullish ↑' : 'Bearish ↓'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => navigate('buy', { coin: key })}
                    className="flex-1 py-2.5 rounded-xl bg-[#005B52] hover:bg-[#00B894] text-white font-bold text-xs flex items-center justify-center gap-1"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Buy</span>
                  </button>
                  <button
                    onClick={() => navigate('sell', { coin: key })}
                    className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1"
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>Sell</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Currency Rates Table */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#00B894]" />
            Supported Global Fiat Rates Matrix
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3">Flag & Currency</th>
                  <th className="p-3">Country / Region</th>
                  <th className="p-3">USD Exchange Rate</th>
                  <th className="p-3">1 BTC Value</th>
                  <th className="p-3">1 ETH Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {FIAT_CURRENCIES.map(c => {
                  const btcVal = (rates.BTC?.usdPrice || 67500) * c.rateToUsd;
                  const ethVal = (rates.ETH?.usdPrice || 3200) * c.rateToUsd;
                  return (
                    <tr key={c.code} className="hover:bg-white/5 transition">
                      <td className="p-3 font-bold text-white flex items-center gap-2">
                        <span className="text-base">{c.flag}</span>
                        <span>{c.code} ({c.symbol})</span>
                      </td>
                      <td className="p-3 text-slate-400">{c.country}</td>
                      <td className="p-3 font-mono text-emerald-400">1 USD = {c.symbol} {c.rateToUsd}</td>
                      <td className="p-3 font-mono font-bold text-white">{formatFiat(btcVal, c.code)}</td>
                      <td className="p-3 font-mono text-slate-200">{formatFiat(ethVal, c.code)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default LiveRates;
