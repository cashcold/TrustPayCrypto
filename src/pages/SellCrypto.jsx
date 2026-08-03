import React from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { api } from '../services/api.js';
import QRCodeModal from '../components/QRCodeModal.jsx';
import { FIAT_CURRENCIES, INTERNATIONAL_PAYMENT_METHODS } from '../utils/currencies.js';
import { formatFiat, formatCrypto } from '../utils/formatters.js';
import { 
  ArrowLeftRight, 
  Copy, 
  Check, 
  QrCode as QrIcon, 
  CheckCircle, 
  ArrowRight, 
  Coins,
  Building2,
  Smartphone
} from 'lucide-react';

export class SellCrypto extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      step: 1, // 1: Select & Amount, 2: Send Crypto & TX Hash, 3: Order Submitted
      coin: 'USDT_TRC20',
      network: 'TRC20',
      amountCrypto: '100',
      paymentMethodId: '',
      accountDetailsInput: '',
      txHash: '',
      isQRModalOpen: false,
      isSubmitting: false,
      submittedOrder: null,
      copiedDepositAddress: false
    };

    this.handleNextStep = this.handleNextStep.bind(this);
    this.handleSubmitSellOrder = this.handleSubmitSellOrder.bind(this);
    this.copyDepositAddress = this.copyDepositAddress.bind(this);
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
    }

    const pmList = INTERNATIONAL_PAYMENT_METHODS[selectedCurrency] || INTERNATIONAL_PAYMENT_METHODS.USD;
    if (pmList.length > 0) {
      this.setState({ paymentMethodId: pmList[0].id });
    }
  }

  handleNextStep() {
    const { amountCrypto, accountDetailsInput, coin } = this.state;
    const numCrypto = parseFloat(amountCrypto);

    if (!amountCrypto || isNaN(numCrypto) || numCrypto <= 0) {
      this.context.showToast('Please enter a valid positive crypto amount to sell', 'error');
      return;
    }

    let minCrypto = 0.0001;
    let maxCrypto = 100;
    if (coin === 'BTC') { minCrypto = 0.0001; maxCrypto = 10; }
    if (coin === 'ETH') { minCrypto = 0.002; maxCrypto = 200; }
    if (coin.includes('USDT')) { minCrypto = 10; maxCrypto = 100000; }

    if (numCrypto < minCrypto) {
      this.context.showToast(`Minimum sell amount for ${coin.replace('_', ' ')} is ${minCrypto}`, 'error');
      return;
    }

    if (numCrypto > maxCrypto) {
      this.context.showToast(`Maximum sell limit for ${coin.replace('_', ' ')} is ${maxCrypto}`, 'error');
      return;
    }

    if (this.state.step === 1) {
      const trimmedDetails = (accountDetailsInput || '').trim();
      if (!trimmedDetails) {
        this.context.showToast('Please provide your bank account or mobile money details to receive your cash payout', 'error');
        return;
      }

      if (trimmedDetails.length < 5) {
        this.context.showToast('Account details are too short. Please include full account number / phone number & name', 'error');
        return;
      }

      this.setState({ step: 2 });
    }
  }

  copyDepositAddress(addr) {
    navigator.clipboard.writeText(addr);
    this.setState({ copiedDepositAddress: true });
    this.context.showToast('Platform deposit address copied to clipboard!', 'success');
    setTimeout(() => this.setState({ copiedDepositAddress: false }), 3000);
  }

  async handleSubmitSellOrder() {
    const { user, showToast, refreshUser, wallets, selectedCurrency } = this.context;
    if (!user) {
      showToast('Please login to place a sell order', 'error');
      this.context.navigate('login');
      return;
    }

    const { coin, network, amountCrypto, paymentMethodId, accountDetailsInput, txHash } = this.state;
    const rates = this.context.rates;
    const currentFiat = FIAT_CURRENCIES.find(c => c.code === selectedCurrency) || FIAT_CURRENCIES[0];

    const coinUsdPrice = rates[coin] ? rates[coin].usdPrice : 1;
    const rateInLocalFiat = coinUsdPrice * currentFiat.rateToUsd;
    const fiatAmountCalculated = parseFloat(amountCrypto) * rateInLocalFiat;

    const pmList = INTERNATIONAL_PAYMENT_METHODS[selectedCurrency] || INTERNATIONAL_PAYMENT_METHODS.USD;
    const selectedPm = pmList.find(p => p.id === paymentMethodId) || pmList[0];

    const matchedWallet = wallets.find(w => w.coin === coin) || { address: 'TYDzsYUE2suY2p81y2vEWaAhG9p9981881' };

    this.setState({ isSubmitting: true });

    const orderData = {
      userId: user.id,
      type: 'Sell',
      coin,
      network,
      amountCrypto: parseFloat(amountCrypto),
      fiatCurrency: selectedCurrency,
      amountFiat: fiatAmountCalculated,
      rateFiat: rateInLocalFiat,
      paymentMethod: selectedPm ? selectedPm.name : 'Bank Transfer',
      paymentDetails: accountDetailsInput,
      depositWallet: matchedWallet.address,
      txHash: txHash || 'Pending Blockchain Hash'
    };

    const res = await api.createOrder(orderData);
    this.setState({ isSubmitting: false });

    if (res.success) {
      this.setState({ submittedOrder: res.order, step: 3 });
      showToast('Sell order submitted successfully!', 'success');
      refreshUser();
    } else {
      showToast(res.message || 'Failed to submit sell order', 'error');
    }
  }

  render() {
    const { rates, wallets, navigate, selectedCurrency, setSelectedCurrency } = this.context;
    const { step, coin, network, amountCrypto, paymentMethodId, accountDetailsInput, txHash, submittedOrder } = this.state;

    const currentFiat = FIAT_CURRENCIES.find(c => c.code === selectedCurrency) || FIAT_CURRENCIES[0];
    const coinUsdPrice = rates[coin] ? rates[coin].usdPrice : 1;
    const rateInLocalFiat = coinUsdPrice * currentFiat.rateToUsd;

    const numericCrypto = parseFloat(amountCrypto) || 0;
    const fiatCalculated = numericCrypto * rateInLocalFiat;

    const pmList = INTERNATIONAL_PAYMENT_METHODS[selectedCurrency] || INTERNATIONAL_PAYMENT_METHODS.USD;

    const matchedWallet = wallets.find(w => w.coin === coin) || {
      coin: coin,
      network: network,
      address: coin === 'BTC' ? '13P7a4yK2aZ9kTrustPayCryptoBtcAddx' : 'TYDzsYUE2suY2p81y2vEWaAhG9p9981881'
    };

    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10 space-y-3">
          <div className="flex items-center justify-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
              Instant Global Cash Out
            </span>
            <button
              type="button"
              onClick={() => this.context.navigate('swap')}
              className="px-3 py-1 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5 transition"
            >
              <span>Swap Crypto to Crypto?</span>
              <span className="underline">Swap Here ➔</span>
            </button>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Sell Cryptocurrency ({currentFiat.flag} {selectedCurrency})</h1>
          <p className="text-slate-400 text-sm">Send crypto to TrustPay and receive instant local payout in {currentFiat.name}.</p>
        </div>

        {/* Wizard Steps Tracker */}
        <div className="flex items-center justify-between mb-8 max-w-xl mx-auto text-xs font-bold">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-amber-400' : 'text-slate-600'}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center border ${step >= 1 ? 'bg-amber-500 border-amber-400 text-slate-950 font-black' : 'border-slate-700'}`}>1</span>
            <span>Order Setup</span>
          </div>
          <div className={`h-0.5 flex-1 mx-4 ${step >= 2 ? 'bg-amber-400' : 'bg-slate-800'}`}></div>
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-amber-400' : 'text-slate-600'}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center border ${step >= 2 ? 'bg-amber-500 border-amber-400 text-slate-950 font-black' : 'border-slate-700'}`}>2</span>
            <span>Send Crypto</span>
          </div>
          <div className={`h-0.5 flex-1 mx-4 ${step >= 3 ? 'bg-amber-400' : 'bg-slate-800'}`}></div>
          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-amber-400' : 'text-slate-600'}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center border ${step >= 3 ? 'bg-amber-500 border-amber-400 text-slate-950 font-black' : 'border-slate-700'}`}>3</span>
            <span>Complete</span>
          </div>
        </div>

        {/* STEP 1: AMOUNT & RECEIVING PAYOUT ACCOUNT */}
        {step === 1 && (
          <div className="glass-panel p-6 sm:p-10 rounded-3xl space-y-6">
            {/* Currency Selector Bar */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{currentFiat.flag}</span>
                <div>
                  <span className="text-xs text-slate-400 block font-semibold">Payout Country & Currency</span>
                  <span className="text-sm font-bold text-white">{currentFiat.country} ({currentFiat.code})</span>
                </div>
              </div>
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white text-xs font-bold px-3 py-2 rounded-xl focus:outline-none focus:border-amber-400"
              >
                {FIAT_CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>{c.flag} {c.code} - {c.name}</option>
                ))}
              </select>
            </div>

            {/* Asset Selector */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Select Asset To Sell</label>
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
                      coin === c.id ? 'bg-amber-500 border-amber-400 text-slate-950 font-black shadow-lg' : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="block text-sm">{c.label}</span>
                    <span className="text-[10px] block opacity-80 mt-1">{c.net}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Input */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>Crypto Amount To Sell</span>
                <span>Rate: 1 {coin.replace('_', ' ')} = {formatFiat(rateInLocalFiat, selectedCurrency)}</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={amountCrypto}
                  onChange={(e) => this.setState({ amountCrypto: e.target.value })}
                  placeholder="0.00"
                  className="w-full bg-transparent text-2xl font-black text-white outline-none"
                />
                <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-amber-400 font-extrabold text-sm flex-shrink-0">
                  {coin.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Calculated Output Box */}
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex justify-between items-center">
              <div>
                <span className="text-xs text-amber-300 block font-semibold">You Will Receive ({selectedCurrency})</span>
                <span className="text-2xl font-black text-white">{formatFiat(fiatCalculated, selectedCurrency)}</span>
              </div>
              <Coins className="w-8 h-8 text-amber-400" />
            </div>

            {/* Receiving Payment Channel & Details */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Where Should We Send Your Cash?</label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pmList.map(pm => (
                  <button
                    key={pm.id}
                    onClick={() => this.setState({ paymentMethodId: pm.id })}
                    className={`p-3.5 rounded-2xl text-left border transition ${
                      paymentMethodId === pm.id ? 'bg-amber-500 border-amber-400 text-slate-950 font-extrabold shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    <span className="block text-sm">{pm.name}</span>
                    <span className="text-[11px] block opacity-80 mt-0.5">{pm.type}</span>
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={accountDetailsInput}
                onChange={(e) => this.setState({ accountDetailsInput: e.target.value })}
                placeholder="Enter Account Number / Mobile Money Number / IBAN / Wise Tag..."
                className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              onClick={this.handleNextStep}
              className="w-full py-4 rounded-2xl bg-amber-400 text-slate-950 font-extrabold text-base hover:bg-amber-300 shadow-xl transition flex items-center justify-center gap-2"
            >
              <span>Get Deposit Wallet Address</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* STEP 2: DEPOSIT CRYPTO & SUBMIT HASH */}
        {step === 2 && (
          <div className="glass-panel p-6 sm:p-10 rounded-3xl space-y-6">
            <div className="text-center space-y-1">
              <h3 className="text-xl font-bold text-white">Send Crypto Deposit</h3>
              <p className="text-xs text-slate-400">Transfer <strong>{amountCrypto} {coin.replace('_', ' ')}</strong> to TrustPay's official deposit address below.</p>
            </div>

            {/* Platform Deposit Address Box */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-amber-500/30 text-center space-y-4">
              <div className="flex justify-between items-center text-xs text-slate-400 border-b border-slate-800 pb-2">
                <span>Official Deposit Address</span>
                <span className="text-amber-400 font-bold">{network}</span>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl font-mono text-xs text-amber-300 break-all flex items-center justify-between border border-slate-800">
                <span>{matchedWallet.address}</span>
                <button
                  onClick={() => this.copyDepositAddress(matchedWallet.address)}
                  className="p-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 ml-2"
                >
                  {this.state.copiedDepositAddress ? <Check className="w-4 h-4 text-amber-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => this.setState({ isQRModalOpen: true })}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <QrIcon className="w-4 h-4 text-amber-400" />
                  <span>Show QR Code</span>
                </button>
              </div>
            </div>

            {/* Blockchain TX Hash Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Transaction Hash / TXID (Optional but speeds up payout)
              </label>
              <input
                type="text"
                value={txHash}
                onChange={(e) => this.setState({ txHash: e.target.value })}
                placeholder="Paste blockchain transaction hash / TXID..."
                className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => this.setState({ step: 1 })}
                className="flex-1 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition"
              >
                Back
              </button>
              <button
                onClick={this.handleSubmitSellOrder}
                disabled={this.state.isSubmitting}
                className="flex-[2] py-4 rounded-2xl bg-amber-400 text-slate-950 font-extrabold text-base hover:bg-amber-300 shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{this.state.isSubmitting ? 'Submitting Order...' : 'Confirm Crypto Sent'}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CONFIRMATION */}
        {step === 3 && submittedOrder && (
          <div className="glass-panel p-8 sm:p-12 rounded-3xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-400/40">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">Sell Order Submitted!</h2>
              <p className="text-sm text-slate-300">
                Order ID: <strong className="text-amber-400 font-mono">{submittedOrder.id}</strong>
              </p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Once blockchain deposit confirmation is detected, <strong>{formatFiat(submittedOrder.amountFiat, submittedOrder.fiatCurrency)}</strong> will be dispatched to your account details.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 max-w-md mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Crypto Sold:</span>
                <span className="font-bold text-white">{formatCrypto(submittedOrder.amountCrypto, submittedOrder.coin)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payout Account:</span>
                <span className="font-bold text-amber-400 truncate">{submittedOrder.paymentDetails}</span>
              </div>
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <button
                onClick={() => navigate('dashboard')}
                className="px-6 py-3.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm transition hover:bg-amber-400"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => this.setState({ step: 1, amountCrypto: '100' })}
                className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition"
              >
                Sell More Crypto
              </button>
            </div>
          </div>
        )}

        {this.state.isQRModalOpen && (
          <QRCodeModal
            isOpen={this.state.isQRModalOpen}
            onClose={() => this.setState({ isQRModalOpen: false })}
            address={matchedWallet.address}
            title={`Scan QR Code to Deposit ${coin.replace('_', ' ')}`}
          />
        )}
      </div>
    );
  }
}

export default SellCrypto;
