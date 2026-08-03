import React from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { api } from '../services/api.js';
import ReceiptModal from '../components/ReceiptModal.jsx';
import { 
  ShieldCheck, 
  Users, 
  FileText, 
  DollarSign, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Wallet, 
  HelpCircle,
  MessageSquare,
  Edit2,
  Save,
  Search
} from 'lucide-react';
import { formatGhs, formatCrypto, formatDate, getStatusBadgeClass } from '../utils/formatters.js';

export class AdminPanel extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'orders', // orders, rates, users, wallets, support
      orders: [],
      usersList: [],
      editingRates: {},
      editingWallets: {},
      selectedReceiptOrder: null,
      isReceiptModalOpen: false,
      searchQuery: ''
    };

    this.fetchAdminData = this.fetchAdminData.bind(this);
    this.handleUpdateOrderStatus = this.handleUpdateOrderStatus.bind(this);
    this.handleSaveRates = this.handleSaveRates.bind(this);
    this.handleSaveWallets = this.handleSaveWallets.bind(this);
  }

  componentDidMount() {
    this.fetchAdminData();
    if (this.context.rates) {
      this.setState({ editingRates: { ...this.context.rates } });
    }
  }

  async fetchAdminData() {
    const ordersRes = await api.getAdminOrders();
    if (ordersRes.success) {
      this.setState({ orders: ordersRes.orders });
    }

    const usersRes = await api.getAdminUsers();
    if (usersRes.success) {
      this.setState({ usersList: usersRes.users });
    }
  }

  async handleUpdateOrderStatus(orderId, newStatus) {
    const { showToast, refreshUser } = this.context;
    const res = await api.updateOrderStatus(orderId, newStatus);
    if (res.success) {
      showToast(`Order #${orderId} marked as ${newStatus}!`, 'success');
      this.fetchAdminData();
      refreshUser();
    } else {
      showToast(res.message || 'Failed to update order status', 'error');
    }
  }

  async handleSaveRates() {
    const { showToast, refreshRates } = this.context;
    const res = await api.updateRates(this.state.editingRates);
    if (res.success) {
      showToast('Market rates updated successfully!', 'success');
      refreshRates();
    } else {
      showToast('Failed to update rates', 'error');
    }
  }

  async handleSaveWallets() {
    const { showToast, refreshWallets, wallets } = this.context;
    showToast('Platform wallet deposit addresses updated!', 'success');
    refreshWallets();
  }

  render() {
    const { user, navigate, rates, wallets } = this.context;
    const { activeTab, orders, usersList, editingRates, searchQuery } = this.state;

    // Check if user is Admin
    if (!user || user.role !== 'admin') {
      return (
        <div className="max-w-md mx-auto my-20 p-8 glass-panel rounded-3xl text-center space-y-4 text-white">
          <ShieldCheck className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold">Admin Access Restricted</h2>
          <p className="text-xs text-slate-400">You must be logged in as an Administrator to view this panel.</p>
          <button
            onClick={() => navigate('login')}
            className="w-full py-3 rounded-xl bg-gradient-brand text-white font-bold text-sm"
          >
            Sign In as Admin
          </button>
        </div>
      );
    }

    // Metrics summary
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    const totalVolumeGhs = orders.reduce((acc, o) => acc + (o.amountGhs || 0), 0);

    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider">
                Administrator
              </span>
              <h1 className="text-3xl font-black text-white">TrustPay Admin Control Center</h1>
            </div>
            <p className="text-slate-400 text-sm mt-1">Manage orders, update rates, approve KYC, and issue referral payouts.</p>
          </div>

          <button
            onClick={this.fetchAdminData}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 self-start"
          >
            <RefreshCw className="w-4 h-4 text-[#00B894]" />
            <span>Refresh Admin Data</span>
          </button>
        </div>

        {/* Overview Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 rounded-3xl space-y-2 border-l-4 border-l-amber-400">
            <span className="text-xs text-slate-400 block font-semibold">Pending Orders Action</span>
            <span className="text-2xl font-black text-amber-400 block">{pendingOrders}</span>
            <span className="text-[10px] text-slate-400 block">Requires Admin verification</span>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-2 border-l-4 border-l-emerald-400">
            <span className="text-xs text-slate-400 block font-semibold">Total Orders Processed</span>
            <span className="text-2xl font-black text-white block">{orders.length}</span>
            <span className="text-[10px] text-emerald-400 block">Buy & Sell trades</span>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-2 border-l-4 border-l-[#00B894]">
            <span className="text-xs text-slate-400 block font-semibold">Total Traded Volume</span>
            <span className="text-2xl font-black text-[#00B894] block">{formatGhs(totalVolumeGhs)}</span>
            <span className="text-[10px] text-slate-400 block">Platform liquidity traded</span>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-2 border-l-4 border-l-blue-400">
            <span className="text-xs text-slate-400 block font-semibold">Registered Traders</span>
            <span className="text-2xl font-black text-white block">{usersList.length}</span>
            <span className="text-[10px] text-slate-400 block">Active platform accounts</span>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex border-b border-slate-800 space-x-4 overflow-x-auto">
          {[
            { id: 'orders', label: 'Order Management', count: pendingOrders },
            { id: 'rates', label: 'Manage Rates' },
            { id: 'users', label: 'User Accounts' },
            { id: 'wallets', label: 'Platform Wallets' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => this.setState({ activeTab: tab.id })}
              className={`pb-3 px-2 text-xs font-bold transition flex items-center gap-2 border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[#00B894] text-[#00B894]'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px]">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: ORDER MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">All Platform Orders</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-3 px-3">Order ID</th>
                    <th className="py-3 px-3">User ID</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-3">Coin</th>
                    <th className="py-3 px-3">Crypto / GHS</th>
                    <th className="py-3 px-3">Payment Info</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-white/5 transition">
                      <td className="py-3.5 px-3 font-mono font-bold text-white">{o.id}</td>
                      <td className="py-3.5 px-3 text-slate-400">{o.userId}</td>
                      <td className="py-3.5 px-3 font-bold">
                        <span className={o.type === 'Buy' ? 'text-emerald-400' : 'text-amber-400'}>
                          {o.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-white">{o.coin.replace('_', ' ')}</td>
                      <td className="py-3.5 px-3 font-mono">
                        <span className="block font-bold text-white">{formatGhs(o.amountGhs)}</span>
                        <span className="text-[10px] text-slate-400">{formatCrypto(o.amountCrypto, o.coin)}</span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-300 max-w-xs truncate">
                        <span className="font-bold text-white block">{o.paymentMethod}</span>
                        <span className="text-[10px] text-slate-400">{o.paymentDetails || o.destinationAddress}</span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getStatusBadgeClass(o.status)}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right flex items-center justify-end gap-1.5">
                        {o.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => this.handleUpdateOrderStatus(o.id, 'Completed')}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] flex items-center gap-1"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => this.handleUpdateOrderStatus(o.id, 'Cancelled')}
                              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] flex items-center gap-1"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => this.setState({ selectedReceiptOrder: o, isReceiptModalOpen: true })}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                          title="View Receipt"
                        >
                          <FileText className="w-4 h-4 text-[#00B894]" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: RATES MANAGEMENT */}
        {activeTab === 'rates' && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Edit Market Exchange Rates (GHS / USD)</h3>
              <button
                onClick={this.handleSaveRates}
                className="px-5 py-2.5 rounded-xl bg-gradient-brand text-white font-bold text-xs flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Rate Changes</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.keys(editingRates).map((coinKey) => {
                const r = editingRates[coinKey];
                return (
                  <div key={coinKey} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                    <h4 className="font-bold text-white text-sm">{coinKey.replace('_', ' ')}</h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-slate-400 block mb-1">Buy Rate (GHS)</label>
                        <input
                          type="number"
                          value={r.buyRateGhs}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            this.setState({
                              editingRates: {
                                ...editingRates,
                                [coinKey]: { ...r, buyRateGhs: val }
                              }
                            });
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">Sell Rate (GHS)</label>
                        <input
                          type="number"
                          value={r.sellRateGhs}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            this.setState({
                              editingRates: {
                                ...editingRates,
                                [coinKey]: { ...r, sellRateGhs: val }
                              }
                            });
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-amber-400 font-bold"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: USER ACCOUNTS */}
        {activeTab === 'users' && (
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="text-lg font-bold text-white">Registered Platform Users</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-3 px-3">Username</th>
                    <th className="py-3 px-3">Email</th>
                    <th className="py-3 px-3">Role</th>
                    <th className="py-3 px-3">KYC Status</th>
                    <th className="py-3 px-3">BTC Bal</th>
                    <th className="py-3 px-3">ETH Bal</th>
                    <th className="py-3 px-3">USDT Bal</th>
                    <th className="py-3 px-3">Fiat Bal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-white/5">
                      <td className="py-3 px-3 font-bold text-white">{u.username}</td>
                      <td className="py-3 px-3 text-slate-400">{u.email}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.role === 'admin' ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-300'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getStatusBadgeClass(u.kycStatus)}`}>
                          {u.kycStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-amber-400">{u.btcBalance}</td>
                      <td className="py-3 px-3 font-mono text-blue-400">{u.ethBalance}</td>
                      <td className="py-3 px-3 font-mono text-emerald-400">{u.usdtBalance}</td>
                      <td className="py-3 px-3 font-bold text-white">{formatGhs(u.fiatBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: PLATFORM WALLETS */}
        {activeTab === 'wallets' && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
            <h3 className="text-lg font-bold text-white">Platform Deposit Wallets</h3>
            <div className="space-y-4">
              {wallets.map((w) => (
                <div key={w.coin} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-sm">{w.coin} ({w.network})</span>
                  </div>
                  <input
                    type="text"
                    defaultValue={w.address}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 font-mono text-xs text-amber-300 outline-none"
                  />
                </div>
              ))}
              <button
                onClick={this.handleSaveWallets}
                className="px-6 py-3 rounded-xl bg-[#005B52] hover:bg-[#00B894] text-white font-bold text-xs"
              >
                Save Deposit Addresses
              </button>
            </div>
          </div>
        )}

        {/* Modal */}
        {this.state.selectedReceiptOrder && (
          <ReceiptModal
            isOpen={this.state.isReceiptModalOpen}
            onClose={() => this.setState({ isReceiptModalOpen: false })}
            mode="download"
            order={this.state.selectedReceiptOrder}
          />
        )}
      </div>
    );
  }
}

export default AdminPanel;
