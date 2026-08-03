import React from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { api } from '../services/api.js';
import ReceiptModal from '../components/ReceiptModal.jsx';
import { FIAT_CURRENCIES, INTERNATIONAL_PAYMENT_METHODS } from '../utils/currencies.js';
import { formatFiat, formatCrypto } from '../utils/formatters.js';
import { 
  Zap, 
  CheckCircle, 
  Upload, 
  ArrowRight, 
  Copy, 
  Check, 
  ShieldCheck, 
  CreditCard,
  Landmark,
  Smartphone,
  Globe
} from 'lucide-react';

export class BuyCrypto extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      step: 1, // 1: Choose & Amount, 2: Payment Details & Receipt, 3: Order Submitted
      coin: 'BTC',
      network: 'Bitcoin Network',
      amountFiat: '500',
      paymentMethodId: '',
      paymentDetailsInput: '',
      destinationAddress: '',
      receiptUrl: null,
      isReceiptModalOpen: false,
      isSubmitting: false,
      copiedAddress: false,
      submittedOrder: null
    };

    this.handleNextStep = this.handleNextStep.bind(this);
    this.handleSubmitOrder = this.handleSubmitOrder.bind(this);
    this.copyAccount = this.copyAccount.bind(this);
  }

  componentDidMount() {
    const { pageParams, selectedCurrency } = this.context;
    if (pageParams) {
      if (pageParams.coin) {
        this.setState({ coin: pageParams.coin });
        if (pageParams.coin === 'BTC') this.setState({ network: 'Bitcoin Network' });
        if (pageParams.coin === 'ETH') this.setState({ network: 'ERC20' });
        if (pageParams.coin === 'USDT_ERC20') this.setState({ network: 'ERC20' });
        if (pageParams.coin === 'USDT_TRC20') this.setState({ network: 'TRC20' });
      }
      if (pageParams.amount) {
        this.setState({ amountFiat: pageParams.amount.toString() });
      }
    }

    const pmList = INTERNATIONAL_PAYMENT_METHODS[selectedCurrency] || INTERNATIONAL_PAYMENT_METHODS.USD;
    if (pmList.length > 0) {
      this.setState({ paymentMethodId: pmList[0].id });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { selectedCurrency } = this.context;
    if (selectedCurrency && selectedCurrency !== this.state.lastCurr) {
      const pmList = INTERNATIONAL_PAYMENT_METHODS[selectedCurrency] || INTERNATIONAL_PAYMENT_METHODS.USD;
      if (pmList.length > 0) {
        this.setState({ paymentMethodId: pmList[0].id, lastCurr: selectedCurrency });
      } else {
        this.setState({ lastCurr: selectedCurrency });
      }
    }
  }

  handleNextStep() {
    const { amountFiat, destinationAddress, coin, network } = this.state;
    const { selectedCurrency } = this.context;
    const currentFiat = FIAT_CURRENCIES.find(c => c.code === selectedCurrency) || FIAT_CURRENCIES[0];

    const numFiat = parseFloat(amountFiat);
    const minFiat = 10 * currentFiat.rateToUsd;
    const maxFiat = 100000 * currentFiat.rateToUsd;

    if (!amountFiat || isNaN(numFiat) || numFiat <= 0) {
      this.context.showToast(`Please enter a valid positive amount in ${selectedCurrency}`, 'error');
      return;
    }

    if (numFiat < minFiat) {
      this.context.showToast(`Minimum order amount is ${formatFiat(minFiat, selectedCurrency)}`, 'error');
      return;
    }

    if (numFiat > maxFiat) {
      this.context.showToast(`Maximum limit per order is ${formatFiat(maxFiat, selectedCurrency)}`, 'error');
      return;
    }

    if (this.state.step === 1) {
      const trimmedAddr = (destinationAddress || '').trim();
      if (!trimmedAddr) {
        this.context.showToast('Please enter your receiving wallet address', 'error');
        return;
      }

      // Format checking for crypto addresses
      if (coin === 'BTC' && !(trimmedAddr.startsWith('1') || trimmedAddr.startsWith('3') || trimmedAddr.startsWith('bc1') || trimmedAddr.length > 25)) {
        this.context.showToast('Invalid Bitcoin address format. BTC addresses usually start with 1, 3, or bc1', 'error');
        return;
      }
      if ((coin === 'ETH' || coin === 'USDT_ERC20') && (!trimmedAddr.startsWith('0x') || trimmedAddr.length < 30)) {
        this.context.showToast('Invalid Ethereum ERC20 address format. ERC20 addresses start with 0x', 'error');
        return;
      }
      if (coin === 'USDT_TRC20' && (!trimmedAddr.startsWith('T') || trimmedAddr.length < 25)) {
        this.context.showToast('Invalid TRC20 address format. TRC20 addresses start with T', 'error');
        return;
      }

      this.setState({ step: 2 });
    }
  }

  copyAccount(text) {
    navigator.clipboard.writeText(text);
    this.setState({ copiedAddress: true });
    this.context.showToast('Payment details copied to clipboard!', 'success');
    setTimeout(() => this.setState({ copiedAddress: false }), 3000);
  }

  async handleSubmitOrder() {
    const { user, showToast, refreshUser, selectedCurrency, setSelectedCurrency } = this.context;
    if (!user) {
      showToast('Please login to place a buy order', 'error');
      this.context.navigate('login');
      return;
    }

    const { coin, network, amountFiat, paymentMethodId, paymentDetailsInput, destinationAddress, receiptUrl } = this.state;
    const rates = this.context.rates;
    const currentFiat = FIAT_CURRENCIES.find(c => c.code === selectedCurrency) || FIAT_CURRENCIES[0];

    const coinUsdPrice = rates[coin] ? rates[coin].usdPrice : 67500;
    const rateInLocalFiat = coinUsdPrice * currentFiat.rateToUsd;
    const cryptoCalculated = rateInLocalFiat > 0 ? parseFloat(amountFiat) / rateInLocalFiat : 0;

    const pmList = INTERNATIONAL_PAYMENT_METHODS[selectedCurrency] || INTERNATIONAL_PAYMENT_METHODS.USD;
    const selectedPm = pmList.find(p => p.id === paymentMethodId) || pmList[0];

    this.setState({ isSubmitting: true });

    const orderData = {
      userId: user.id,
      type: 'Buy',
      coin,
      network,
      amountCrypto: cryptoCalculated,
      fiatCurrency: selectedCurrency,
      amountFiat: parseFloat(amountFiat),
      rateFiat: rateInLocalFiat,
      paymentMethod: selectedPm ? selectedPm.name : 'Bank Transfer',
      paymentDetails: paymentDetailsInput || `Paid via ${selectedPm ? selectedPm.name : 'Bank Wire'}`,
      destinationAddress,
      receiptUrl: receiptUrl || 'https://placehold.co/400x600/005B52/FFFFFF?text=Receipt+Attached'
    };

    const res = await api.createOrder(orderData);
    this.setState({ isSubmitting: false });

    if (res.success) {
      this.setState({ submittedOrder: res.order, step: 3 });
      showToast('Buy order submitted successfully!', 'success');
      refreshUser();
    } else {
      showToast(res.message || 'Failed to submit order', 'error');
    }
  }

  render() {
    const { rates, navigate, selectedCurrency, setSelectedCurrency } = this.context;
    const { step, coin, network, amountFiat, paymentMethodId, destinationAddress, receiptUrl, submittedOrder } = this.state;

    const currentFiat = FIAT_CURRENCIES.find(c => c.code === selectedCurrency) || FIAT_CURRENCIES[0];
    const coinUsdPrice = rates[coin] ? rates[coin].usdPrice : 67500;
    const rateInLocalFiat = coinUsdPrice * currentFiat.rateToUsd;

    const numericAmount = parseFloat(amountFiat) || 0;
    const cryptoCalculated = rateInLocalFiat > 0 ? numericAmount / rateInLocalFiat : 0;

    const pmList = INTERNATIONAL_PAYMENT_METHODS[selectedCurrency] || INTERNATIONAL_PAYMENT_METHODS.USD;
    const activePm = pmList.find(p => p.id === paymentMethodId) || pmList[0] || {
      name: 'Global Wire Transfer',
      account: 'SWIFT / FedWire Direct',
      type: 'Bank Wire'
    };

    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10 space-y-3">
          <div className="flex items-center justify-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#005B52]/20 text-[#00B894] text-xs font-bold uppercase tracking-wider">
              International Crypto Purchase
            </span>
            <button
              type="button"
              onClick={() => this.context.navigate('swap')}
              className="px-3 py-1 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5 transition"
            >
              <span>Need Crypto Swap?</span>
              <span className="underline">Swap Here ➔</span>
            </button>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Buy Cryptocurrency ({currentFiat.flag} {selectedCurrency})</h1>
          <p className="text-slate-400 text-sm">Pay in {currentFiat.name} ({selectedCurrency}) and receive crypto directly into your wallet.</p>
        </div>

        {/* Wizard Steps Tracker */}
        <div className="flex items-center justify-between mb-8 max-w-xl mx-auto text-xs font-bold">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#00B894]' : 'text-slate-600'}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center border ${step >= 1 ? 'bg-[#005B52] border-[#00B894] text-white' : 'border-slate-700'}`}>1</span>
            <span>Amount & Wallet</span>
          </div>
          <div className={`h-0.5 flex-1 mx-4 ${step >= 2 ? 'bg-[#00B894]' : 'bg-slate-800'}`}></div>
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#00B894]' : 'text-slate-600'}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center border ${step >= 2 ? 'bg-[#005B52] border-[#00B894] text-white' : 'border-slate-700'}`}>2</span>
            <span>Payment & Receipt</span>
          </div>
          <div className={`h-0.5 flex-1 mx-4 ${step >= 3 ? 'bg-[#00B894]' : 'bg-slate-800'}`}></div>
          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-[#00B894]' : 'text-slate-600'}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center border ${step >= 3 ? 'bg-[#005B52] border-[#00B894] text-white' : 'border-slate-700'}`}>3</span>
            <span>Complete</span>
          </div>
        </div>

        {/* STEP 1: AMOUNT & WALLET ADDRESS */}
        {step === 1 && (
          <div className="glass-panel p-6 sm:p-10 rounded-3xl space-y-6">
            {/* Currency Selector Bar */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{currentFiat.flag}</span>
                <div>
                  <span className="text-xs text-slate-400 block font-semibold">Paying Country / Currency</span>
                  <span className="text-sm font-bold text-white">{currentFiat.country} ({currentFiat.code})</span>
                </div>
              </div>
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white text-xs font-bold px-3 py-2 rounded-xl focus:outline-none focus:border-[#00B894]"
              >
                {FIAT_CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>{c.flag} {c.code} - {c.name}</option>
                ))}
              </select>
            </div>

            {/* Crypto Selection */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Select Asset To Buy</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'BTC', label: 'Bitcoin (BTC)', net: 'Bitcoin Network' },
                  { id: 'ETH', label: 'Ethereum (ETH)', net: 'ERC20' },
                  { id: 'USDT_ERC20', label: 'USDT ERC20', net: 'ERC20' },
                  { id: 'USDT_TRC20', label: 'USDT TRC20', net: 'TRC20' }
                ].map(c => (
                  <button
                    key={c.id}
                    onClick={() => this.setState({ coin: c.id, network: c.net })}
                    className={`p-3 rounded-2xl text-xs font-bold text-left border transition ${
                      coin === c.id ? 'bg-[#005B52] border-[#00B894] text-white shadow-lg' : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="block font-black text-sm">{c.label}</span>
                    <span className="text-[10px] text-slate-400 block mt-1">{c.net}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Input */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>Enter Pay Amount in {selectedCurrency}</span>
                <span>Rate: 1 {coin.replace('_', ' ')} = {formatFiat(rateInLocalFiat, selectedCurrency)}</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={amountFiat}
                  onChange={(e) => this.setState({ amountFiat: e.target.value })}
                  placeholder="0.00"
                  className="w-full bg-transparent text-2xl font-black text-white outline-none"
                />
                <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-emerald-400 font-extrabold text-sm flex-shrink-0">
                  {selectedCurrency}
                </span>
              </div>
            </div>

            {/* Calculated Output Box */}
            <div className="p-5 rounded-2xl bg-[#005B52]/20 border border-[#00B894]/40 flex justify-between items-center">
              <div>
                <span className="text-xs text-emerald-300 block font-semibold">You Will Receive (Estimated)</span>
                <span className="text-2xl font-black text-white">{formatCrypto(cryptoCalculated, coin)}</span>
              </div>
              <Zap className="w-8 h-8 text-[#00B894]" />
            </div>

            {/* Destination Wallet Address */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Your Receive Wallet Address ({network})
              </label>
              <input
                type="text"
                value={destinationAddress}
                onChange={(e) => this.setState({ destinationAddress: e.target.value })}
                placeholder={`Paste your ${coin.replace('_', ' ')} wallet address here...`}
                className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-[#00B894]"
              />
              <span className="text-[11px] text-amber-400 block">
                ⚠️ Double check your wallet address and ensure network is set to {network}.
              </span>
            </div>

            <button
              onClick={this.handleNextStep}
              className="w-full py-4 rounded-2xl bg-[#2ECC71] text-black font-extrabold text-base hover:brightness-110 shadow-xl transition flex items-center justify-center gap-2"
            >
              <span>Continue to Payment Instructions</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* STEP 2: PAYMENT & PROOF UPLOAD */}
        {step === 2 && (
          <div className="glass-panel p-6 sm:p-10 rounded-3xl space-y-6">
            <div className="text-center space-y-1">
              <h3 className="text-xl font-bold text-white">Payment Details & Verification</h3>
              <p className="text-xs text-slate-400">Send {formatFiat(amountFiat, selectedCurrency)} via your selected payment channel below.</p>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Select Payment Channel</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pmList.map(pm => (
                  <button
                    key={pm.id}
                    onClick={() => this.setState({ paymentMethodId: pm.id })}
                    className={`p-4 rounded-2xl text-left border transition ${
                      paymentMethodId === pm.id ? 'bg-[#005B52] border-[#00B894] text-white shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    <span className="font-bold block text-sm">{pm.name}</span>
                    <span className="text-xs text-slate-400 block mt-1">{pm.type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Account Info Box */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-[#00B894]/30 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-xs text-slate-400 font-bold uppercase">Platform Deposit Account</span>
                <span className="px-2.5 py-1 rounded bg-[#005B52]/30 text-[#00B894] text-[10px] font-bold">
                  Verified TrustPay Account
                </span>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-semibold text-white">{activePm.name}</div>
                <div className="p-3 rounded-xl bg-slate-900 font-mono text-emerald-400 font-bold text-sm flex items-center justify-between border border-slate-800">
                  <span>{activePm.account}</span>
                  <button
                    onClick={() => this.copyAccount(activePm.account)}
                    className="p-1.5 rounded-lg bg-slate-800 text-white hover:bg-slate-700"
                  >
                    {this.state.copiedAddress ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Reference & Transaction Details Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Sender Account / Reference ID
              </label>
              <input
                type="text"
                value={this.state.paymentDetailsInput}
                onChange={(e) => this.setState({ paymentDetailsInput: e.target.value })}
                placeholder="E.g. Sent from Chase Wire #99821 or MoMo Name/Number"
                className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-[#00B894]"
              />
            </div>

            {/* Attach Receipt Button */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Payment Receipt Proof</span>
                <span className="text-[10px] text-slate-400 block">Attach screenshot or bank confirmation receipt</span>
              </div>
              <button
                onClick={() => this.setState({ isReceiptModalOpen: true })}
                className="px-4 py-2 rounded-xl bg-[#005B52] hover:bg-[#00B894] text-white text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{receiptUrl ? 'Receipt Attached ✓' : 'Attach Receipt'}</span>
              </button>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => this.setState({ step: 1 })}
                className="flex-1 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition"
              >
                Back
              </button>
              <button
                onClick={this.handleSubmitOrder}
                disabled={this.state.isSubmitting}
                className="flex-[2] py-4 rounded-2xl bg-[#2ECC71] text-black font-extrabold text-base hover:brightness-110 shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>{this.state.isSubmitting ? 'Submitting...' : 'Confirm & Complete Buy Request'}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SUBMITTED CONFIRMATION */}
        {step === 3 && submittedOrder && (
          <div className="glass-panel p-8 sm:p-12 rounded-3xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-[#00B894] flex items-center justify-center mx-auto border border-[#00B894]/40">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">Buy Order Received!</h2>
              <p className="text-sm text-slate-300">
                Order ID: <strong className="text-[#00B894] font-mono">{submittedOrder.id}</strong>
              </p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Our verification desk is confirming your deposit of <strong>{formatFiat(submittedOrder.amountFiat, submittedOrder.fiatCurrency)}</strong>. Funds will be released to <strong>{submittedOrder.destinationAddress}</strong> within 5–15 minutes.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 max-w-md mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Crypto Amount:</span>
                <span className="font-bold text-white">{formatCrypto(submittedOrder.amountCrypto, submittedOrder.coin)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="font-bold text-amber-400">Pending Verification</span>
              </div>
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <button
                onClick={() => navigate('dashboard')}
                className="px-6 py-3.5 rounded-xl bg-[#005B52] hover:bg-[#00B894] text-white font-bold text-sm transition"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => this.setState({ step: 1, amountFiat: '500' })}
                className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition"
              >
                Place Another Order
              </button>
            </div>
          </div>
        )}

        {this.state.isReceiptModalOpen && (
          <ReceiptModal
            isOpen={this.state.isReceiptModalOpen}
            onClose={() => this.setState({ isReceiptModalOpen: false })}
            onUploadSuccess={(url) => this.setState({ receiptUrl: url, isReceiptModalOpen: false })}
          />
        )}
      </div>
    );
  }
}

export default BuyCrypto;
