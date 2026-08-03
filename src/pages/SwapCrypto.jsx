import React from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { api } from '../services/api.js';
import { formatCrypto } from '../utils/formatters.js';
import { 
  ArrowLeftRight, 
  CheckCircle, 
  Copy, 
  Check, 
  ShieldCheck, 
  RefreshCw, 
  Info, 
  ArrowRight, 
  Zap, 
  Clock, 
  QrCode,
  Lock,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

const COIN_LIST = [
  { id: 'BTC', name: 'Bitcoin', symbol: 'BTC', network: 'Bitcoin Network', iconColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  { id: 'ETH', name: 'Ethereum', symbol: 'ETH', network: 'ERC20 Network', iconColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
  { id: 'USDT_TRC20', name: 'Tether TRC20', symbol: 'USDT', network: 'Tron Network (TRC20)', iconColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  { id: 'USDT_ERC20', name: 'Tether ERC20', symbol: 'USDT', network: 'Ethereum Network (ERC20)', iconColor: 'bg-teal-500/20 text-teal-400 border-teal-500/30' }
];

export class SwapCrypto extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      step: 1, // 1: Swap Calculator, 2: Deposit & Address, 3: Completed Receipt
      fromCoin: 'USDT_TRC20',
      toCoin: 'BTC',
      amountFrom: '1000',
      recipientAddress: '',
      txHashFrom: '',
      copiedDeposit: false,
      isSubmitting: false,
      submittedSwap: null,
      swapHistory: [],
      isLoadingHistory: false
    };

    this.handleFlip = this.handleFlip.bind(this);
    this.handleNextStep = this.handleNextStep.bind(this);
    this.handleSubmitSwap = this.handleSubmitSwap.bind(this);
    this.copyToClipboard = this.copyToClipboard.bind(this);
    this.loadSwapHistory = this.loadSwapHistory.bind(this);
  }

  componentDidMount() {
    const { pageParams } = this.context;
    if (pageParams) {
      if (pageParams.fromCoin) this.setState({ fromCoin: pageParams.fromCoin });
      if (pageParams.toCoin) this.setState({ toCoin: pageParams.toCoin });
      if (pageParams.amountFrom) this.setState({ amountFrom: String(pageParams.amountFrom) });
    }
    this.loadSwapHistory();
  }

  async loadSwapHistory() {
    this.setState({ isLoadingHistory: true });
    const { user } = this.context;
    const res = await api.getSwaps(user ? user.id : null);
    if (res.success && res.swaps) {
      this.setState({ swapHistory: res.swaps });
    }
    this.setState({ isLoadingHistory: false });
  }

  handleFlip() {
    this.setState((prev) => ({
      fromCoin: prev.toCoin,
      toCoin: prev.fromCoin
    }));
  }

  calculateAmountTo() {
    const { fromCoin, toCoin, amountFrom } = this.state;
    const { rates } = this.context;

    const numFrom = parseFloat(amountFrom);
    if (isNaN(numFrom) || numFrom <= 0) return 0;

    const fromUsd = rates[fromCoin] ? rates[fromCoin].usdPrice : 1;
    const toUsd = rates[toCoin] ? rates[toCoin].usdPrice : 1;

    const rawExchange = (numFrom * fromUsd) / toUsd;
    // 0.2% fee
    const netExchange = rawExchange * 0.998;
    return parseFloat(netExchange.toFixed(6));
  }

  getExchangeRateString() {
    const { fromCoin, toCoin } = this.state;
    const { rates } = this.context;

    const fromUsd = rates[fromCoin] ? rates[fromCoin].usdPrice : 1;
    const toUsd = rates[toCoin] ? rates[toCoin].usdPrice : 1;

    const rate = (fromUsd / toUsd) * 0.998;
    const fromLabel = fromCoin.replace('_', ' ');
    const toLabel = toCoin.replace('_', ' ');

    return `1 ${fromLabel} ≈ ${rate < 0.001 ? rate.toFixed(8) : rate.toFixed(6)} ${toLabel}`;
  }

  handleNextStep() {
    const { fromCoin, toCoin, amountFrom, recipientAddress } = this.state;
    const { showToast } = this.context;

    if (fromCoin === toCoin) {
      showToast('Please choose two different cryptocurrencies to swap', 'error');
      return;
    }

    const num = parseFloat(amountFrom);
    if (!amountFrom || isNaN(num) || num <= 0) {
      showToast('Please enter a valid positive swap amount', 'error');
      return;
    }

    // Min & Max checks
    let minFrom = 10;
    let maxFrom = 100000;
    if (fromCoin === 'BTC') { minFrom = 0.0001; maxFrom = 10; }
    if (fromCoin === 'ETH') { minFrom = 0.002; maxFrom = 200; }
    if (fromCoin.includes('USDT')) { minFrom = 10; maxFrom = 100000; }

    if (num < minFrom) {
      showToast(`Minimum swap amount for ${fromCoin.replace('_', ' ')} is ${minFrom}`, 'error');
      return;
    }

    if (num > maxFrom) {
      showToast(`Maximum swap limit for ${fromCoin.replace('_', ' ')} is ${maxFrom}`, 'error');
      return;
    }

    if (this.state.step === 1) {
      const trimmedAddr = (recipientAddress || '').trim();
      if (!trimmedAddr) {
        showToast(`Please enter your receiving wallet address for ${toCoin.replace('_', ' ')}`, 'error');
        return;
      }

      // Address format validation
      if (toCoin === 'BTC' && !(trimmedAddr.startsWith('1') || trimmedAddr.startsWith('3') || trimmedAddr.startsWith('bc1') || trimmedAddr.length > 25)) {
        showToast('Invalid Bitcoin address. BTC addresses start with 1, 3, or bc1', 'error');
        return;
      }
      if ((toCoin === 'ETH' || toCoin === 'USDT_ERC20') && (!trimmedAddr.startsWith('0x') || trimmedAddr.length < 30)) {
        showToast('Invalid Ethereum ERC20 address. Addresses start with 0x', 'error');
        return;
      }
      if (toCoin === 'USDT_TRC20' && (!trimmedAddr.startsWith('T') || trimmedAddr.length < 25)) {
        showToast('Invalid TRC20 address. TRC20 addresses start with T', 'error');
        return;
      }

      this.setState({ step: 2 });
    }
  }

  async handleSubmitSwap() {
    const { fromCoin, toCoin, amountFrom, recipientAddress, txHashFrom } = this.state;
    const { user, wallets, showToast, refreshUser } = this.context;

    const platformWallet = wallets.find(w => w.coin === fromCoin) || { address: 'PlatformDepositAddress' };

    this.setState({ isSubmitting: true });

    const swapPayload = {
      userId: user ? user.id : 'guest',
      fromCoin,
      toCoin,
      amountFrom: parseFloat(amountFrom),
      recipientAddress: recipientAddress.trim(),
      depositWallet: platformWallet.address,
      txHashFrom: txHashFrom ? txHashFrom.trim() : `0x${Math.random().toString(16).substring(2, 10)}...`
    };

    const res = await api.createSwap(swapPayload);
    this.setState({ isSubmitting: false });

    if (res.success && res.swap) {
      this.setState({
        submittedSwap: res.swap,
        step: 3
      });
      showToast('Swap order submitted successfully!', 'success');
      if (user) refreshUser();
      this.loadSwapHistory();
    } else {
      showToast(res.message || 'Failed to submit swap order', 'error');
    }
  }

  copyToClipboard(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      this.setState({ copiedDeposit: true });
      setTimeout(() => this.setState({ copiedDeposit: false }), 2000);
      this.context.showToast('Copied address to clipboard!', 'info');
    }
  }

  renderStep1() {
    const { fromCoin, toCoin, amountFrom, recipientAddress } = this.state;
    const { theme } = this.context;
    const isDark = theme === 'dark';

    const amountTo = this.calculateAmountTo();
    const exchangeRateStr = this.getExchangeRateString();

    const fromObj = COIN_LIST.find(c => c.id === fromCoin) || COIN_LIST[0];
    const toObj = COIN_LIST.find(c => c.id === toCoin) || COIN_LIST[1];

    const presetAmounts = fromCoin === 'BTC' ? ['0.01', '0.05', '0.1', '0.5'] :
                         fromCoin === 'ETH' ? ['0.1', '0.5', '1.0', '5.0'] :
                         ['100', '250', '500', '1000', '2500'];

    return (
      <div className="space-y-6">
        {/* Swap Calculator Container */}
        <div className={`p-5 sm:p-7 rounded-3xl border transition ${
          isDark ? 'bg-[#18181B] border-slate-800' : 'bg-slate-900 border-slate-800 text-white'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#00B894] flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              Instant Crypto Converter
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              0.2% Fee • Zero Gas Markup
            </span>
          </div>

          {/* FROM TOKEN BOX */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
              <span>You Pay</span>
              <span>Network: {fromObj.network}</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                step="any"
                value={amountFrom}
                onChange={(e) => this.setState({ amountFrom: e.target.value })}
                placeholder="0.00"
                className="w-full bg-transparent text-2xl sm:text-3xl font-mono font-black text-white focus:outline-none placeholder-slate-600"
              />

              {/* Coin Select */}
              <div className="relative flex-shrink-0">
                <select
                  value={fromCoin}
                  onChange={(e) => this.setState({ fromCoin: e.target.value })}
                  className="appearance-none bg-slate-800 hover:bg-slate-700 text-white font-black text-sm px-4 py-2.5 pr-8 rounded-xl border border-slate-700 cursor-pointer focus:outline-none focus:border-[#00B894]"
                >
                  {COIN_LIST.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.symbol} ({c.name})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 pt-1 overflow-x-auto scrollbar-none">
              <span className="text-[10px] text-slate-500 font-bold mr-1">Quick:</span>
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => this.setState({ amountFrom: preset })}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition ${
                    amountFrom === preset
                      ? 'bg-[#005B52] text-white border border-[#00B894]'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {preset} {fromObj.symbol}
                </button>
              ))}
            </div>
          </div>

          {/* FLIP BUTTON */}
          <div className="flex items-center justify-center -my-3 relative z-10">
            <button
              type="button"
              onClick={this.handleFlip}
              title="Swap From and To currencies"
              className="w-11 h-11 rounded-2xl bg-gradient-brand text-white flex items-center justify-center shadow-lg shadow-[#00B894]/30 hover:scale-110 active:scale-95 transition-all border-2 border-slate-900"
            >
              <ArrowLeftRight className="w-5 h-5 rotate-90" />
            </button>
          </div>

          {/* TO TOKEN BOX */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 mt-1">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
              <span>You Receive (Estimated)</span>
              <span>Network: {toObj.network}</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                readOnly
                value={amountTo > 0 ? amountTo : '0.00'}
                className="w-full bg-transparent text-2xl sm:text-3xl font-mono font-black text-emerald-400 focus:outline-none"
              />

              {/* Coin Select */}
              <div className="relative flex-shrink-0">
                <select
                  value={toCoin}
                  onChange={(e) => this.setState({ toCoin: e.target.value })}
                  className="appearance-none bg-slate-800 hover:bg-slate-700 text-white font-black text-sm px-4 py-2.5 pr-8 rounded-xl border border-slate-700 cursor-pointer focus:outline-none focus:border-[#00B894]"
                >
                  {COIN_LIST.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.symbol} ({c.name})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-3.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* RATE & FEE SUMMARY */}
          <div className="mt-4 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5 font-bold">
                <RefreshCw className="w-3.5 h-3.5 text-[#00B894]" />
                Live Rate:
              </span>
              <span className="font-mono font-extrabold text-white">{exchangeRateStr}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span>Exchange Fee:</span>
              <span className="font-mono text-emerald-400 font-bold">0.2% (Included in rate)</span>
            </div>
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span>Estimated Settlement:</span>
              <span className="font-medium text-slate-300">2 - 5 Minutes</span>
            </div>
          </div>

          {/* RECIPIENT WALLET ADDRESS FIELD */}
          <div className="mt-5 space-y-2">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300">
              Your Receiving Wallet Address ({toObj.symbol} - {toObj.network}) *
            </label>
            <input
              type="text"
              value={recipientAddress}
              onChange={(e) => this.setState({ recipientAddress: e.target.value })}
              placeholder={`Enter your ${toObj.symbol} wallet address to receive funds...`}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 font-mono text-xs sm:text-sm focus:outline-none focus:border-[#00B894]"
            />
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              Ensure you enter a valid {toObj.network} address matching {toObj.symbol}.
            </p>
          </div>

          {/* NEXT STEP BUTTON */}
          <button
            type="button"
            onClick={this.handleNextStep}
            className="w-full mt-6 py-4 rounded-2xl bg-gradient-brand hover:bg-[#00B894] text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-[#00B894]/20 flex items-center justify-center gap-2 transition-all"
          >
            <span>Proceed to Deposit Deposit Wallet</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  renderStep2() {
    const { fromCoin, toCoin, amountFrom, recipientAddress, txHashFrom, copiedDeposit } = this.state;
    const { wallets, theme } = this.context;
    const isDark = theme === 'dark';

    const amountTo = this.calculateAmountTo();
    const fromObj = COIN_LIST.find(c => c.id === fromCoin) || COIN_LIST[0];
    const toObj = COIN_LIST.find(c => c.id === toCoin) || COIN_LIST[1];

    const platformWallet = wallets.find(w => w.coin === fromCoin) || {
      address: '13P7a4yK2aZ9kTrustPayCryptoBtcAddx',
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${fromCoin}Deposit`
    };

    return (
      <div className="space-y-6 animate-fadeIn">
        <div className={`p-5 sm:p-7 rounded-3xl border transition ${
          isDark ? 'bg-[#18181B] border-slate-800' : 'bg-slate-900 border-slate-800 text-white'
        }`}>
          {/* STEP HEADER */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <QrCode className="w-5 h-5 text-[#00B894]" />
                Send {fromObj.symbol} Deposit
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Send exactly <span className="font-mono font-bold text-white">{amountFrom} {fromObj.symbol}</span> to the platform swap wallet below.
              </p>
            </div>
            <button
              onClick={() => this.setState({ step: 1 })}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
            >
              Back
            </button>
          </div>

          {/* SWAP ORDER SUMMARY BAR */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 mb-6 text-xs">
            <div>
              <span className="text-[11px] text-slate-500 uppercase font-bold block">You Send</span>
              <span className="font-mono font-extrabold text-white text-base">{amountFrom} {fromObj.symbol}</span>
              <span className="text-[10px] text-slate-400 block">{fromObj.network}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 uppercase font-bold block">You Receive</span>
              <span className="font-mono font-extrabold text-emerald-400 text-base">{amountTo} {toObj.symbol}</span>
              <span className="text-[10px] text-slate-400 block">{toObj.network}</span>
            </div>
          </div>

          {/* PLATFORM DEPOSIT WALLET & QR CODE */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider block">
              Official Platform {fromObj.name} Deposit Address
            </span>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* QR Code */}
              <div className="p-2 rounded-xl bg-white flex-shrink-0 shadow-lg">
                <img
                  src={platformWallet.qrCode || `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${platformWallet.address}`}
                  alt="Deposit QR Code"
                  className="w-32 h-32 sm:w-36 sm:h-36 object-contain"
                />
              </div>

              {/* Wallet Address & Copy */}
              <div className="flex-1 w-full space-y-2 text-center sm:text-left">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-emerald-300 break-all select-all font-bold">
                  {platformWallet.address}
                </div>

                <button
                  type="button"
                  onClick={() => this.copyToClipboard(platformWallet.address)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
                >
                  {copiedDeposit ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Copied Address!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#00B894]" />
                      <span>Copy Deposit Address</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* OPTIONAL TX HASH INPUT */}
          <div className="mt-6 space-y-2">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300">
              Blockchain Transaction Hash / TXID (Optional)
            </label>
            <input
              type="text"
              value={txHashFrom}
              onChange={(e) => this.setState({ txHashFrom: e.target.value })}
              placeholder="Paste your blockchain transaction hash once sent (e.g. 0x8a9b...)"
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 font-mono text-xs focus:outline-none focus:border-[#00B894]"
            />
          </div>

          {/* CONFIRM SWAP SUBMIT BUTTON */}
          <button
            type="button"
            disabled={this.state.isSubmitting}
            onClick={this.handleSubmitSwap}
            className="w-full mt-6 py-4 rounded-2xl bg-gradient-brand hover:bg-[#00B894] text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-[#00B894]/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {this.state.isSubmitting ? (
              <span className="animate-pulse">Processing Swap Order...</span>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>I Have Sent {amountFrom} {fromObj.symbol}</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  renderStep3() {
    const { submittedSwap } = this.state;
    const { navigate, theme } = this.context;
    const isDark = theme === 'dark';

    if (!submittedSwap) return null;

    return (
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 text-white text-center space-y-6 animate-fadeIn">
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-xl">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs uppercase">
            Order ID: {submittedSwap.id}
          </span>
          <h2 className="text-2xl font-black text-white mt-2">Swap Order Confirmed!</h2>
          <p className="text-xs text-slate-300 max-w-md mx-auto mt-1">
            Our automated liquidity nodes are verifying your deposit on the blockchain. Swapped funds will be dispatched to your receiving wallet shortly.
          </p>
        </div>

        {/* SWAP DETAILS SUMMARY TABLE */}
        <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-3 text-xs">
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">Status:</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[11px]">
              {submittedSwap.status}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Swapped From:</span>
            <span className="font-mono font-bold text-white">{submittedSwap.amountFrom} {submittedSwap.fromCoin.replace('_', ' ')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Swapped To:</span>
            <span className="font-mono font-bold text-emerald-400">{submittedSwap.amountTo} {submittedSwap.toCoin.replace('_', ' ')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Receiving Wallet:</span>
            <span className="font-mono text-[11px] text-slate-300 truncate max-w-[200px]">{submittedSwap.recipientAddress}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
            <span>Requested At:</span>
            <span>{new Date(submittedSwap.createdAt).toLocaleTimeString()}</span>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => this.setState({ step: 1, submittedSwap: null })}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Swap Another Token
          </button>
          <button
            onClick={() => navigate('dashboard')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-brand text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  renderHistoryTable() {
    const { swapHistory, isLoadingHistory } = this.state;
    const { theme } = this.context;
    const isDark = theme === 'dark';

    return (
      <div className={`mt-10 p-5 sm:p-7 rounded-3xl border ${
        isDark ? 'bg-[#18181B] border-slate-800' : 'bg-slate-900 border-slate-800 text-white'
      }`}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#00B894]" />
            Recent Swap Orders & Activity
          </h3>
          <button
            onClick={this.loadSwapHistory}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Refresh Swaps"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingHistory ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {swapHistory.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            No swap orders recorded yet. Complete your first swap above!
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-none">
            <table className="w-full text-left text-xs text-slate-300">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 px-2">Order ID</th>
                  <th className="pb-3 px-2">From</th>
                  <th className="pb-3 px-2">To (Est.)</th>
                  <th className="pb-3 px-2">Status</th>
                  <th className="pb-3 px-2 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {swapHistory.slice(0, 5).map((s) => (
                  <tr key={s.id} className="hover:bg-white/5 transition">
                    <td className="py-3 px-2 font-bold text-white">{s.id}</td>
                    <td className="py-3 px-2 text-amber-400">{s.amountFrom} {s.fromCoin.replace('_', ' ')}</td>
                    <td className="py-3 px-2 text-emerald-400">{s.amountTo} {s.toCoin.replace('_', ' ')}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-sans font-bold ${
                        s.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300' :
                        s.status === 'Pending' ? 'bg-amber-500/20 text-amber-300' :
                        'bg-rose-500/20 text-rose-300'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right text-slate-400 text-[11px] font-sans">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  render() {
    const { step } = this.state;
    const { theme } = this.context;
    const isDark = theme === 'dark';

    return (
      <div className={`py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto transition-colors duration-300 ${
        isDark ? 'text-slate-100' : 'text-slate-900'
      }`}>
        {/* PAGE TITLE HERO */}
        <div className="text-center mb-8 sm:mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#005B52]/30 border border-[#00B894]/40 text-[#00B894] text-xs font-extrabold uppercase tracking-wider">
            <ArrowLeftRight className="w-3.5 h-3.5" />
            Instant Crypto Swap Engine
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Swap BTC, ETH & USDT Instantly
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Exchange crypto-to-crypto seamlessly across Bitcoin, Ethereum, and Tron networks with minimum fees and automated liquidity settlement.
          </p>
        </div>

        {/* STEP CONTROLS */}
        {step === 1 && this.renderStep1()}
        {step === 2 && this.renderStep2()}
        {step === 3 && this.renderStep3()}

        {/* RECENT ACTIVITY TABLE */}
        {this.renderHistoryTable()}
      </div>
    );
  }
}

export default SwapCrypto;
