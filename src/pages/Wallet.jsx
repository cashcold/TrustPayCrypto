import React from 'react';
import { AppContext } from '../context/AppContext.jsx';
import QRCodeModal from '../components/QRCodeModal.jsx';
import { 
  Wallet as WalletIcon, 
  ArrowDownLeft, 
  ArrowUpRight, 
  QrCode as QrIcon, 
  Copy, 
  Check, 
  Coins 
} from 'lucide-react';
import { formatGhs, formatCrypto, formatUsd } from '../utils/formatters.js';

export class Wallet extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      selectedWalletModal: null, // { coin, address, network }
      copied: false
    };
  }

  render() {
    const { user, rates, wallets, navigate } = this.context;

    if (!user) {
      return (
        <div className="max-w-md mx-auto my-20 p-8 glass-panel rounded-3xl text-center space-y-4 text-white">
          <WalletIcon className="w-12 h-12 text-[#00B894] mx-auto" />
          <h2 className="text-xl font-bold">Please Sign In</h2>
          <p className="text-xs text-slate-400">Log in to manage your crypto balances and wallet addresses.</p>
          <button
            onClick={() => navigate('login')}
            className="w-full py-3 rounded-xl bg-gradient-brand text-white font-bold text-sm"
          >
            Go to Login
          </button>
        </div>
      );
    }

    const btcGhs = user.btcBalance * (rates.BTC?.buyRateGhs || 895000);
    const ethGhs = user.ethBalance * (rates.ETH?.buyRateGhs || 42500);
    const usdtGhs = user.usdtBalance * (rates.USDT_TRC20?.buyRateGhs || 13.50);
    const totalGhsValue = btcGhs + ethGhs + usdtGhs + user.fiatBalance;

    const assets = [
      { id: 'BTC', name: 'Bitcoin', symbol: 'BTC', balance: user.btcBalance, ghsVal: btcGhs, color: 'bg-amber-500' },
      { id: 'ETH', name: 'Ethereum', symbol: 'ETH', balance: user.ethBalance, ghsVal: ethGhs, color: 'bg-blue-500' },
      { id: 'USDT', name: 'Tether USD', symbol: 'USDT', balance: user.usdtBalance, ghsVal: usdtGhs, color: 'bg-emerald-500' },
      { id: 'GHS', name: 'Ghana Cedi Fiat', symbol: 'GHS', balance: user.fiatBalance, ghsVal: user.fiatBalance, color: 'bg-purple-500' }
    ];

    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white">My Crypto Wallet</h1>
            <p className="text-slate-400 text-sm">Secure multi-currency wallet for BTC, ETH, USDT and GHS Cash.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('buy')}
              className="px-5 py-2.5 rounded-xl bg-gradient-brand text-white font-bold text-xs shadow-lg flex items-center gap-1.5"
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>Deposit / Buy</span>
            </button>
            <button
              onClick={() => navigate('sell')}
              className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-lg flex items-center gap-1.5"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Withdraw / Sell</span>
            </button>
          </div>
        </div>

        {/* Total Net Portfolio Value Card */}
        <div className="bg-gradient-to-r from-[#005B52] to-[#00B894] p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-semibold text-emerald-200 uppercase tracking-wider block">
              Estimated Total Portfolio Value
            </span>
            <h2 className="text-3xl sm:text-4xl font-black">{formatGhs(totalGhsValue)}</h2>
            <p className="text-emerald-100 text-xs">
              Includes BTC, ETH, USDT assets converted at live market rates + GHS Fiat.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="p-4 rounded-2xl bg-black/30 border border-white/10 text-center">
              <span className="text-[10px] text-emerald-200 uppercase block">Fiat Cash</span>
              <span className="text-lg font-bold text-white">{formatGhs(user.fiatBalance)}</span>
            </div>
            <div className="p-4 rounded-2xl bg-black/30 border border-white/10 text-center">
              <span className="text-[10px] text-emerald-200 uppercase block">Crypto Worth</span>
              <span className="text-lg font-bold text-white">{formatGhs(btcGhs + ethGhs + usdtGhs)}</span>
            </div>
          </div>
        </div>

        {/* Assets Breakdown Grid */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Your Balances & Addresses</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {assets.map((asset) => (
              <div key={asset.id} className="glass-card p-6 rounded-3xl space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${asset.color}`}></span>
                    <span className="font-bold text-white">{asset.name}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400">{asset.symbol}</span>
                </div>

                <div>
                  <span className="text-2xl font-black text-white block">
                    {asset.id === 'GHS' ? formatGhs(asset.balance) : formatCrypto(asset.balance, asset.id)}
                  </span>
                  <span className="text-xs text-slate-400 block mt-0.5">
                    ≈ {formatGhs(asset.ghsVal)}
                  </span>
                </div>

                {asset.id !== 'GHS' && (
                  <button
                    onClick={() => {
                      const w = wallets.find(item => item.coin.startsWith(asset.id)) || { address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', network: 'Default' };
                      this.setState({
                        selectedWalletModal: {
                          coin: asset.name,
                          address: w.address,
                          network: w.network
                        }
                      });
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <QrIcon className="w-3.5 h-3.5 text-[#00B894]" />
                    <span>Deposit Address QR</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* QR Modal */}
        {this.state.selectedWalletModal && (
          <QRCodeModal
            isOpen={!!this.state.selectedWalletModal}
            onClose={() => this.setState({ selectedWalletModal: null })}
            title={`Deposit ${this.state.selectedWalletModal.coin}`}
            address={this.state.selectedWalletModal.address}
            network={this.state.selectedWalletModal.network}
            onCopy={(msg) => this.context.showToast(msg, 'success')}
          />
        )}
      </div>
    );
  }
}

export default Wallet;
