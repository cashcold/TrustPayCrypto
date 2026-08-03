import React from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { api } from '../services/api.js';
import ReceiptModal from '../components/ReceiptModal.jsx';
import { FIAT_CURRENCIES } from '../utils/currencies.js';
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowLeftRight, 
  Users, 
  Bell, 
  Clock, 
  CheckCircle, 
  FileText, 
  Zap, 
  Coins,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { formatFiat, formatCrypto, formatDate, getStatusBadgeClass } from '../utils/formatters.js';

export class Dashboard extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      isLoading: true,
      selectedReceiptOrder: null,
      isReceiptModalOpen: false
    };
  }

  componentDidMount() {
    this.fetchUserOrders();
  }

  async fetchUserOrders() {
    const { user } = this.context;
    if (user) {
      this.setState({ isLoading: true });
      const res = await api.getOrders(user.id);
      this.setState({ isLoading: false });
      if (res.success) {
        this.setState({ orders: res.orders });
      }
    }
  }

  render() {
    const { user, navigate, rates, selectedCurrency, setSelectedCurrency } = this.context;
    const { orders, isLoading } = this.state;

    if (!user) {
      return (
        <div className="max-w-md mx-auto my-20 p-8 glass-panel rounded-3xl text-center space-y-4 text-white">
          <LayoutDashboard className="w-12 h-12 text-[#00B894] mx-auto" />
          <h2 className="text-xl font-bold">Sign In to View Dashboard</h2>
          <button
            onClick={() => navigate('login')}
            className="w-full py-3 rounded-xl bg-gradient-brand text-white font-bold text-sm"
          >
            Login
          </button>
        </div>
      );
    }

    const currentFiat = FIAT_CURRENCIES.find(c => c.code === selectedCurrency) || FIAT_CURRENCIES[0];

    // Portfolio Value converted to selected fiat
    const btcUsd = rates.BTC?.usdPrice || 67500;
    const ethUsd = rates.ETH?.usdPrice || 3200;
    const usdtUsd = rates.USDT_TRC20?.usdPrice || 1.0;

    const btcLocal = (user.btcBalance * btcUsd) * currentFiat.rateToUsd;
    const ethLocal = (user.ethBalance * ethUsd) * currentFiat.rateToUsd;
    const usdtLocal = (user.usdtBalance * usdtUsd) * currentFiat.rateToUsd;
    const fiatLocal = user.fiatBalance * currentFiat.rateToUsd;

    const totalPortfolioValue = btcLocal + ethLocal + usdtLocal + fiatLocal;

    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        {/* Welcome Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-extrabold text-white">Hello, {user.username}!</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusBadgeClass(user.status)}`}>
                {user.status} KYC
              </span>
            </div>
            <p className="text-slate-400 text-sm">Welcome to your TrustPay Crypto Command Center.</p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white font-bold text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#00B894]"
            >
              {FIAT_CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
              ))}
            </select>

            <button
              onClick={() => navigate('buy')}
              className="px-5 py-2.5 rounded-xl bg-gradient-brand text-white font-bold text-xs shadow-lg flex items-center gap-1.5"
            >
              <Zap className="w-4 h-4" />
              <span>Buy Crypto</span>
            </button>

            <button
              onClick={() => navigate('sell')}
              className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-lg flex items-center gap-1.5"
            >
              <Coins className="w-4 h-4" />
              <span>Sell Crypto</span>
            </button>
          </div>
        </div>

        {/* Balance Overview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 rounded-3xl space-y-2 border-l-4 border-l-[#00B894]">
            <span className="text-xs text-slate-400 block font-semibold">Net Portfolio Value</span>
            <span className="text-2xl font-black text-white block">{formatFiat(totalPortfolioValue, selectedCurrency)}</span>
            <span className="text-[10px] text-emerald-400 block">{currentFiat.flag} All assets converted to {selectedCurrency}</span>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-2">
            <span className="text-xs text-slate-400 block font-semibold">Bitcoin (BTC)</span>
            <span className="text-xl font-bold text-amber-400 block">{formatCrypto(user.btcBalance, 'BTC')}</span>
            <span className="text-[10px] text-slate-400 block">≈ {formatFiat(btcLocal, selectedCurrency)}</span>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-2">
            <span className="text-xs text-slate-400 block font-semibold">Tether USD (USDT)</span>
            <span className="text-xl font-bold text-emerald-400 block">{formatCrypto(user.usdtBalance, 'USDT')}</span>
            <span className="text-[10px] text-slate-400 block">≈ {formatFiat(usdtLocal, selectedCurrency)}</span>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-2">
            <span className="text-xs text-slate-400 block font-semibold">Withdrawable Local Cash</span>
            <span className="text-xl font-bold text-white block">{formatFiat(fiatLocal, selectedCurrency)}</span>
            <span className="text-[10px] text-emerald-400 block">Includes Payouts & Referral Bonus</span>
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#00B894]" />
              <span>Recent Orders & Transactions</span>
            </h3>

            <button
              onClick={() => navigate('transactions')}
              className="text-xs font-bold text-[#00B894] hover:underline"
            >
              View All History
            </button>
          </div>

          {orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-3 px-3">Order ID</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-3">Coin</th>
                    <th className="py-3 px-3">Crypto Amount</th>
                    <th className="py-3 px-3">Fiat Value</th>
                    <th className="py-3 px-3">Payment Channel</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="hover:bg-white/5 transition">
                      <td className="py-3.5 px-3 font-mono font-bold text-slate-200">{order.id}</td>
                      <td className="py-3.5 px-3 font-bold">
                        <span className={order.type === 'Buy' ? 'text-emerald-400' : 'text-amber-400'}>
                          {order.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-medium text-white">{order.coin.replace('_', ' ')}</td>
                      <td className="py-3.5 px-3 font-mono text-slate-300">{formatCrypto(order.amountCrypto, order.coin)}</td>
                      <td className="py-3.5 px-3 font-bold text-white">
                        {formatFiat(order.amountFiat || order.amountGhs, order.fiatCurrency || 'USD')}
                      </td>
                      <td className="py-3.5 px-3 text-slate-400">{order.paymentMethod}</td>
                      <td className="py-3.5 px-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getStatusBadgeClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        {order.receiptUrl ? (
                          <a
                            href={order.receiptUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#00B894] hover:underline flex items-center justify-end gap-1 font-bold"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>View</span>
                          </a>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs space-y-3">
              <p>No orders recorded yet.</p>
              <button
                onClick={() => navigate('buy')}
                className="px-4 py-2 rounded-xl bg-[#005B52] text-white font-bold"
              >
                Place Your First Buy Order
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Dashboard;
