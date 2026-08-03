import React from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { api } from '../services/api.js';
import ReceiptModal from '../components/ReceiptModal.jsx';
import { Clock, Search, Filter, FileText, Download } from 'lucide-react';
import { formatFiat, formatCrypto, formatDate, getStatusBadgeClass } from '../utils/formatters.js';

export class Transactions extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      filterType: 'ALL',
      searchQuery: '',
      selectedReceiptOrder: null,
      isReceiptModalOpen: false
    };
  }

  componentDidMount() {
    this.fetchOrders();
  }

  async fetchOrders() {
    const { user } = this.context;
    if (user) {
      const res = await api.getOrders(user.id);
      const swapRes = await api.getSwaps(user.id);
      let combined = res.success ? [...res.orders] : [];
      if (swapRes.success && swapRes.swaps) {
        const mappedSwaps = swapRes.swaps.map(s => ({
          id: s.id,
          type: 'Swap',
          coin: `${s.fromCoin.replace('_', ' ')} ➔ ${s.toCoin.replace('_', ' ')}`,
          amountCrypto: s.amountFrom,
          fiatCurrency: s.toCoin.replace('_', ' '),
          amountFiat: s.amountTo,
          paymentMethod: 'Crypto Swap Pool',
          status: s.status,
          createdAt: s.createdAt,
          isSwap: true
        }));
        combined = [...combined, ...mappedSwaps];
      }
      combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      this.setState({ orders: combined });
    }
  }

  render() {
    const { navigate } = this.context;
    const { orders, filterType, searchQuery } = this.state;

    const filtered = orders.filter((o) => {
      const matchesType = filterType === 'ALL' || o.type === filterType || o.status === filterType;
      const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            o.coin.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            o.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });

    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Transaction History</h1>
          <p className="text-slate-400 text-sm">Full log of your Buy & Sell orders with official downloadable receipts.</p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            {['ALL', 'Buy', 'Sell', 'Swap', 'Pending', 'Completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => this.setState({ filterType: tab })}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  filterType === tab ? 'bg-[#005B52] text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => this.setState({ searchQuery: e.target.value })}
              placeholder="Search Order ID, Coin..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-[#00B894]"
            />
          </div>
        </div>

        {/* Transactions Table */}
        <div className="glass-panel p-6 rounded-3xl">
          {filtered.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-3.5 px-3">Date</th>
                    <th className="py-3.5 px-3">Order ID</th>
                    <th className="py-3.5 px-3">Type</th>
                    <th className="py-3.5 px-3">Coin</th>
                    <th className="py-3.5 px-3">Crypto Amount</th>
                    <th className="py-3.5 px-3">Fiat Total</th>
                    <th className="py-3.5 px-3">Payment Channel</th>
                    <th className="py-3.5 px-3">Status</th>
                    <th className="py-3.5 px-3 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filtered.map((order) => (
                    <tr key={order.id} className="hover:bg-white/5 transition">
                      <td className="py-3.5 px-3 text-slate-400">{formatDate(order.createdAt)}</td>
                      <td className="py-3.5 px-3 font-mono font-bold text-white">{order.id}</td>
                      <td className="py-3.5 px-3 font-bold">
                        <span className={order.type === 'Buy' ? 'text-emerald-400' : 'text-amber-400'}>
                          {order.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-slate-200">{order.coin.replace('_', ' ')}</td>
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
                        <button
                          onClick={() => this.setState({ selectedReceiptOrder: order, isReceiptModalOpen: true })}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                        >
                          <FileText className="w-4 h-4 text-[#00B894]" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              No transactions match your search or filter criteria.
            </div>
          )}
        </div>

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

export default Transactions;
