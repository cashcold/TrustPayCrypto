import React from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { formatFiat } from '../utils/formatters.js';
import { FIAT_CURRENCIES } from '../utils/currencies.js';

export class LiveTicker extends React.Component {
  static contextType = AppContext;

  render() {
    const { rates, selectedCurrency, theme } = this.context;
    const isDark = theme === 'dark';

    const currObj = FIAT_CURRENCIES.find(c => c.code === selectedCurrency) || FIAT_CURRENCIES[0];

    const coinItems = [
      { id: 'BTC', label: 'BTC' },
      { id: 'ETH', label: 'ETH' },
      { id: 'USDT_ERC20', label: 'USDT (ERC20)' },
      { id: 'USDT_TRC20', label: 'USDT (TRC20)' }
    ];

    return (
      <div className={`border-b text-xs py-2 px-4 transition-colors ${
        isDark ? 'bg-black/90 border-slate-800 text-slate-300' : 'bg-slate-900 border-slate-800 text-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto whitespace-nowrap scrollbar-none gap-6">
          <div className="flex items-center gap-2 flex-shrink-0 font-bold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>LIVE RATES ({currObj.flag} {selectedCurrency}):</span>
          </div>

          <div className="flex items-center gap-6 font-mono text-[11px]">
            {coinItems.map((item) => {
              const data = rates[item.id] || { usdPrice: 1, change24h: 0 };
              const localPrice = data.usdPrice * currObj.rateToUsd;
              const isUp = (data.change24h || 0) >= 0;

              return (
                <div key={item.id} className="flex items-center gap-2">
                  <span className="text-white font-sans font-bold">{item.label}</span>
                  <span className="text-slate-100 font-semibold">{formatFiat(localPrice, selectedCurrency)}</span>
                  <span className={`flex items-center text-[10px] font-bold ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isUp ? <TrendingUp className="w-3 h-3 mr-0.5 inline" /> : <TrendingDown className="w-3 h-3 mr-0.5 inline" />}
                    {isUp ? '+' : ''}{data.change24h || 0}%
                  </span>
                </div>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-4 text-slate-400 text-[10px] flex-shrink-0">
            <span className="flex items-center gap-1">
              <RefreshCw className="w-3 h-3 text-emerald-400 animate-spin" style={{ animationDuration: '10s' }} />
              Realtime Auto-Sync
            </span>
            <span>24h Global Volume: <strong className="text-white">$1.24B</strong></span>
          </div>
        </div>
      </div>
    );
  }
}

export default LiveTicker;
