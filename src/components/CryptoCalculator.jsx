import React from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { FIAT_CURRENCIES, getCurrency } from '../utils/currencies.js';
import { formatFiat, formatCrypto } from '../utils/formatters.js';
import { 
  ArrowLeftRight, 
  Check, 
  Zap, 
  AlertCircle, 
  Info, 
  ChevronDown, 
  ShieldCheck, 
  Clock, 
  Sparkles,
  DollarSign,
  RefreshCw
} from 'lucide-react';

export class CryptoCalculator extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      mode: 'Buy', // 'Buy' or 'Sell'
      coin: 'BTC',
      amount: '500',
      showFeeDetails: false,
      validationError: ''
    };

    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleCoinChange = this.handleCoinChange.bind(this);
    this.handleModeChange = this.handleModeChange.bind(this);
    this.handleExecuteOrder = this.handleExecuteOrder.bind(this);
    this.handlePresetClick = this.handlePresetClick.bind(this);
    this.getValidationError = this.getValidationError.bind(this);
  }

  getValidationError() {
    const { amount, mode, coin } = this.state;
    const { selectedCurrency } = this.context;
    const currObj = getCurrency(selectedCurrency);
    const num = parseFloat(amount);

    if (!amount || amount.trim() === '') {
      return 'Please enter a trade amount';
    }

    if (isNaN(num) || num <= 0) {
      return 'Amount must be greater than zero';
    }

    if (mode === 'Buy') {
      // Min $10 USD equivalent in selected currency
      const minFiat = 10 * currObj.rateToUsd;
      // Max $100,000 USD equivalent in selected currency
      const maxFiat = 100000 * currObj.rateToUsd;

      if (num < minFiat) {
        return `Minimum buy amount is ${formatFiat(minFiat, selectedCurrency)}`;
      }
      if (num > maxFiat) {
        return `Maximum buy limit is ${formatFiat(maxFiat, selectedCurrency)}`;
      }
    } else {
      // Sell mode: validation in crypto
      let minCrypto = 0.0001;
      let maxCrypto = 100;
      if (coin === 'BTC') { minCrypto = 0.0001; maxCrypto = 10; }
      if (coin === 'ETH') { minCrypto = 0.002; maxCrypto = 200; }
      if (coin.includes('USDT')) { minCrypto = 10; maxCrypto = 100000; }

      if (num < minCrypto) {
        return `Minimum sell amount is ${minCrypto} ${coin.replace('_', ' ')}`;
      }
      if (num > maxCrypto) {
        return `Maximum sell limit is ${maxCrypto} ${coin.replace('_', ' ')}`;
      }
    }

    return '';
  }

  handleAmountChange(e) {
    const val = e.target.value;
    this.setState({ amount: val });
  }

  handleCoinChange(coin) {
    this.setState({ coin }, () => {
      // Adjust default amount when switching mode/coin
      if (this.state.mode === 'Sell' && coin.includes('USDT')) {
        this.setState({ amount: '100' });
      } else if (this.state.mode === 'Sell' && coin === 'BTC') {
        this.setState({ amount: '0.01' });
      } else if (this.state.mode === 'Sell' && coin === 'ETH') {
        this.setState({ amount: '0.2' });
      }
    });
  }

  handleModeChange(mode) {
    const defaultAmt = mode === 'Buy' ? '500' : (this.state.coin.includes('USDT') ? '100' : '0.01');
    this.setState({ mode, amount: defaultAmt });
  }

  handlePresetClick(presetVal) {
    this.setState({ amount: presetVal.toString() });
  }

  handleExecuteOrder() {
    const { navigate, selectedCurrency, showToast } = this.context;
    const { mode, coin, amount } = this.state;
    const validationError = this.getValidationError();

    if (validationError) {
      if (showToast) showToast(validationError, 'error');
      return;
    }

    const targetPage = mode === 'Buy' ? 'buy' : 'sell';
    if (navigate) {
      navigate(targetPage, { coin, amount, currency: selectedCurrency });
    }
  }

  render() {
    const { rates, theme, selectedCurrency, setSelectedCurrency } = this.context;
    const { mode, coin, amount, showFeeDetails } = this.state;
    const validationError = this.getValidationError();
    const isDark = theme === 'dark';

    const currentFiat = getCurrency(selectedCurrency);
    const coinUsdPrice = rates[coin] ? rates[coin].usdPrice : (coin === 'BTC' ? 67500 : (coin === 'ETH' ? 3250 : 1.0));

    // Rate in local currency per 1 crypto coin
    const rateInLocalFiat = coinUsdPrice * currentFiat.rateToUsd;
    const numericAmount = parseFloat(amount) || 0;

    let cryptoCalculated = 0;
    let fiatCalculated = 0;

    if (mode === 'Buy') {
      fiatCalculated = numericAmount;
      cryptoCalculated = rateInLocalFiat > 0 ? numericAmount / rateInLocalFiat : 0;
    } else {
      cryptoCalculated = numericAmount;
      fiatCalculated = numericAmount * rateInLocalFiat;
    }

    // Quick presets based on mode and selected currency
    const buyPresets = [
      Math.round(50 * currentFiat.rateToUsd),
      Math.round(100 * currentFiat.rateToUsd),
      Math.round(250 * currentFiat.rateToUsd),
      Math.round(500 * currentFiat.rateToUsd),
      Math.round(1000 * currentFiat.rateToUsd),
      Math.round(2500 * currentFiat.rateToUsd)
    ];

    const sellPresets = coin.includes('USDT') 
      ? ['50', '100', '250', '500', '1000', '5000']
      : coin === 'BTC' 
        ? ['0.001', '0.005', '0.01', '0.05', '0.1', '0.5']
        : ['0.05', '0.1', '0.25', '0.5', '1.0', '2.5'];

    return (
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-2xl transition-all relative overflow-hidden ${
        isDark ? 'glass-panel text-white border-slate-800' : 'glass-panel-light text-slate-900 border-slate-200'
      }`}>
        {/* Subtle background glow */}
        <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
          mode === 'Buy' ? 'bg-[#00B894]/10' : 'bg-amber-500/10'
        }`}></div>

        {/* Buy / Sell / Swap Toggle Tabs */}
        <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 mb-6 relative z-10 gap-1">
          <button
            onClick={() => this.handleModeChange('Buy')}
            className={`flex-1 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 ${
              mode === 'Buy'
                ? 'bg-gradient-brand text-white shadow-lg shadow-[#00B894]/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Buy</span>
          </button>

          <button
            onClick={() => this.handleModeChange('Sell')}
            className={`flex-1 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 ${
              mode === 'Sell'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>Sell</span>
          </button>

          <button
            onClick={() => {
              if (this.context.navigate) {
                this.context.navigate('swap', { fromCoin: coin, amountFrom: amount });
              }
            }}
            className="flex-1 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 text-slate-400 hover:text-white hover:bg-white/5"
          >
            <RefreshCw className="w-4 h-4 text-[#00B894]" />
            <span>Swap</span>
          </button>
        </div>

        {/* Currency & Coin Selector Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 relative z-10">
          {/* Fiat Currency Picker */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>{mode === 'Buy' ? 'Pay Currency' : 'Payout Currency'}</span>
              <span className="text-[10px] text-emerald-400 font-semibold">{currentFiat.country}</span>
            </label>
            <div className="relative">
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white font-extrabold py-3 px-3.5 rounded-xl text-xs appearance-none focus:outline-none focus:border-[#00B894] cursor-pointer shadow-inner"
              >
                {FIAT_CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code} - {c.name} ({c.symbol})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          {/* Crypto Asset Picker */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Select Crypto Asset
            </label>
            <div className="relative">
              <select
                value={coin}
                onChange={(e) => this.handleCoinChange(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white font-extrabold py-3 px-3.5 rounded-xl text-xs appearance-none focus:outline-none focus:border-[#00B894] cursor-pointer shadow-inner"
              >
                <option value="BTC">Bitcoin (BTC)</option>
                <option value="ETH">Ethereum (ETH)</option>
                <option value="USDT_TRC20">Tether USDT (TRC20)</option>
                <option value="USDT_ERC20">Tether USDT (ERC20)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Input Amount Section with Real-Time Validation */}
        <div className="space-y-4 mb-5 relative z-10">
          <div className={`p-4 sm:p-5 rounded-2xl bg-slate-950/90 border transition-all ${
            validationError 
              ? 'border-rose-500/80 shadow-lg shadow-rose-500/10' 
              : 'border-slate-800 focus-within:border-[#00B894]'
          }`}>
            <div className="flex justify-between items-center text-xs text-slate-400 mb-1.5">
              <span className="font-semibold">
                {mode === 'Buy' ? `You Pay (${selectedCurrency})` : `You Sell (${coin.replace('_', ' ')})`}
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                1 {coin.replace('_', ' ')} = {formatFiat(rateInLocalFiat, selectedCurrency)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                step="any"
                value={amount}
                onChange={this.handleAmountChange}
                placeholder="0.00"
                className="w-full bg-transparent text-2xl sm:text-3xl font-black text-white outline-none font-mono"
              />
              <span className={`px-3 py-1.5 rounded-xl text-xs font-black flex-shrink-0 flex items-center gap-1.5 ${
                mode === 'Buy' ? 'bg-[#005B52] text-emerald-300' : 'bg-amber-500/20 text-amber-300'
              }`}>
                <span>{mode === 'Buy' ? currentFiat.flag : '₿'}</span>
                <span>{mode === 'Buy' ? selectedCurrency : coin.replace('_', ' ')}</span>
              </span>
            </div>

            {/* Validation Error Banner */}
            {validationError && (
              <div className="mt-3 pt-2.5 border-t border-rose-500/30 flex items-center gap-2 text-rose-400 text-xs font-bold animate-fadeIn">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{validationError}</span>
              </div>
            )}
          </div>

          {/* Preset Pills Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
              Quick:
            </span>
            {(mode === 'Buy' ? buyPresets : sellPresets).map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => this.handlePresetClick(preset)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex-shrink-0 border ${
                  amount.toString() === preset.toString()
                    ? mode === 'Buy' 
                      ? 'bg-[#005B52] text-emerald-300 border-[#00B894]' 
                      : 'bg-amber-500/30 text-amber-300 border-amber-400'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                }`}
              >
                {mode === 'Buy' ? formatFiat(preset, selectedCurrency) : `${preset} ${coin.replace('_', '')}`}
              </button>
            ))}
          </div>

          {/* Calculated Receive Estimate Box */}
          <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
            mode === 'Buy'
              ? 'bg-[#005B52]/20 border-[#00B894]/40'
              : 'bg-amber-500/10 border-amber-500/30'
          }`}>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className={mode === 'Buy' ? 'text-emerald-300 font-semibold' : 'text-amber-300 font-semibold'}>
                {mode === 'Buy' ? 'You Receive (Estimated Crypto)' : 'You Receive (Estimated Local Cash)'}
              </span>
              <span className="text-[10px] bg-slate-900/80 px-2.5 py-0.5 rounded-full text-slate-300 font-bold border border-slate-700">
                Instant Lock-In Rate
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                {mode === 'Buy'
                  ? formatCrypto(cryptoCalculated, coin)
                  : formatFiat(fiatCalculated, selectedCurrency)}
              </span>
              <span className={`text-xs font-black uppercase px-2.5 py-1 rounded-lg ${
                mode === 'Buy' ? 'bg-[#00B894]/20 text-[#00B894]' : 'bg-amber-400/20 text-amber-400'
              }`}>
                {mode === 'Buy' ? coin.replace('_', ' ') : selectedCurrency}
              </span>
            </div>
          </div>
        </div>

        {/* Fee Breakdown Toggle */}
        <div className="mb-5 relative z-10">
          <button
            type="button"
            onClick={() => this.setState(prev => ({ showFeeDetails: !prev.showFeeDetails }))}
            className="text-xs text-slate-400 hover:text-white flex items-center justify-between w-full py-1 font-semibold transition"
          >
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#00B894]" />
              <span>Transparent Fee Breakdown</span>
            </span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFeeDetails ? 'rotate-180' : ''}`} />
          </button>

          {showFeeDetails && (
            <div className="mt-2 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-2 text-slate-300 animate-fadeIn">
              <div className="flex justify-between">
                <span className="text-slate-400">Platform Trading Fee:</span>
                <span className="text-emerald-400 font-bold">0.00% (FREE)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Blockchain Network Gas:</span>
                <span className="text-emerald-400 font-bold">Covered by TrustPay</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated Delivery:</span>
                <span className="text-white font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-400" />
                  <span>2–5 Minutes</span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Feature Highlights Bar */}
        <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-400 mb-6 relative z-10">
          <div className="flex items-center justify-center gap-1 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span className="truncate">Escrow Protection</span>
          </div>
          <div className="flex items-center justify-center gap-1 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
            <Zap className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span className="truncate">Instant Release</span>
          </div>
          <div className="flex items-center justify-center gap-1 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span className="truncate">Live Payouts</span>
          </div>
        </div>

        {/* Execute Order Button */}
        <button
          onClick={this.handleExecuteOrder}
          disabled={Boolean(validationError)}
          className={`w-full py-4 rounded-2xl font-extrabold text-base transition-all shadow-xl flex items-center justify-center gap-2 relative z-10 ${
            validationError 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
              : mode === 'Buy'
                ? 'bg-[#2ECC71] text-black hover:brightness-110 shadow-lg shadow-[#2ECC71]/20 active:scale-[0.99]'
                : 'bg-amber-400 hover:bg-amber-300 text-black shadow-amber-500/20 active:scale-[0.99]'
          }`}
        >
          {validationError ? (
            <span>Fix Validation Errors To Continue</span>
          ) : (
            <span>
              {mode === 'Buy' 
                ? `Continue to Buy ${coin.replace('_', ' ')}` 
                : `Continue to Sell ${coin.replace('_', ' ')}`}
            </span>
          )}
        </button>
      </div>
    );
  }
}

export default CryptoCalculator;

