import React from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { api } from '../services/api.js';
import { 
  Users, 
  Copy, 
  Check, 
  Award, 
  DollarSign, 
  Share2, 
  CheckCircle, 
  TrendingUp, 
  Trophy 
} from 'lucide-react';
import { formatGhs, formatDate } from '../utils/formatters.js';

export class ReferralProgram extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      stats: null,
      isLoading: true,
      copiedLink: false
    };

    this.copyReferralLink = this.copyReferralLink.bind(this);
  }

  componentDidMount() {
    this.fetchReferralData();
  }

  async fetchReferralData() {
    const { user } = this.context;
    if (user) {
      this.setState({ isLoading: true });
      const res = await api.getReferralStats(user.id);
      this.setState({ isLoading: false });
      if (res.success) {
        this.setState({ stats: res });
      }
    } else {
      this.setState({ isLoading: false });
    }
  }

  copyReferralLink() {
    const { user } = this.context;
    const refLink = `https://trustpaycrypto.com/register?ref=${user ? user.referralCode : 'DEMO'}`;
    navigator.clipboard.writeText(refLink);
    this.setState({ copiedLink: true });
    this.context.showToast('Referral link copied to clipboard!', 'success');
    setTimeout(() => this.setState({ copiedLink: false }), 3000);
  }

  render() {
    const { user, navigate } = this.context;
    const { stats, isLoading } = this.state;

    const refCode = user ? user.referralCode : 'JOHN2026';
    const refLink = `https://trustpaycrypto.com/register?ref=${refCode}`;

    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-10">
        {/* Header Hero Banner */}
        <div className="bg-gradient-brand p-8 sm:p-12 rounded-3xl text-white shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl space-y-4 relative z-10">
            <span className="px-3 py-1 rounded-full bg-black/30 text-emerald-200 text-xs font-bold uppercase tracking-wider">
              3% One-Time Affiliate Bonus
            </span>
            <h1 className="text-3xl sm:text-4xl font-black">
              Earn 3% Cash On Every Friend's First Trade
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              When a user signs up with your unique referral link and completes their <span className="underline font-bold">FIRST successful Buy or Sell order</span>, you earn a 3% cash reward credited directly to your withdrawable balance!
            </p>

            {/* Referral Link Copy Bar */}
            <div className="pt-4 max-w-xl">
              <label className="text-xs font-bold text-emerald-100 block mb-1">Your Unique Referral Link</label>
              <div className="p-2.5 rounded-2xl bg-black/40 border border-white/20 flex items-center justify-between gap-2 backdrop-blur-md">
                <span className="font-mono text-xs text-white truncate pl-2">{refLink}</span>
                <button
                  onClick={this.copyReferralLink}
                  className="px-4 py-2 rounded-xl bg-white text-[#005B52] font-bold text-xs hover:bg-emerald-100 transition flex items-center gap-1.5 flex-shrink-0"
                >
                  {this.state.copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{this.state.copiedLink ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Rules & Requirements Box */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2 text-slate-300">
          <h4 className="font-bold text-white text-sm text-[#00B894]">Referral Program Rules & Conditions:</h4>
          <ul className="list-disc pl-5 space-y-1 text-slate-400">
            <li>Referral commission is exactly <strong className="text-white">3%</strong> calculated on the total transaction amount in GHS.</li>
            <li>Commission is paid <strong className="text-white">ONLY ONE TIME</strong> on the referred user's very FIRST completed Buy or Sell transaction.</li>
            <li>Future trades by the same user do not trigger additional referral earnings.</li>
            <li>Earnings are credited instantly to your withdrawable fiat balance for cash-out via MoMo or Bank.</li>
          </ul>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 rounded-3xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#005B52]/30 text-[#00B894] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black text-white block">{stats?.totalReferrals || 2}</span>
            <span className="text-xs text-slate-400">Total Referred Users</span>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black text-white block">{stats?.completedReferrals || 1}</span>
            <span className="text-xs text-slate-400">Completed 1st Trade</span>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black text-emerald-400 block">{formatGhs(stats?.totalEarnedGhs || 39.30)}</span>
            <span className="text-xs text-slate-400">Total Referral Earnings</span>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black text-white block">{formatGhs(user ? user.fiatBalance : 2850)}</span>
            <span className="text-xs text-slate-400">Withdrawable Balance</span>
          </div>
        </div>

        {/* Tables Grid: Referred Friends & Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Referral History */}
          <div className="lg:col-span-8 glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-[#00B894]" />
              <span>Referred Friends History</span>
            </h3>

            {stats?.referredUsers && stats.referredUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-3 px-2">User</th>
                      <th className="py-3 px-2">Joined Date</th>
                      <th className="py-3 px-2">1st Trade Status</th>
                      <th className="py-3 px-2 text-right">Commission</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {stats.referredUsers.map((u, idx) => (
                      <tr key={idx} className="hover:bg-white/5">
                        <td className="py-3 px-2 font-bold text-white">{u.username}</td>
                        <td className="py-3 px-2 text-slate-400">{formatDate(u.createdAt)}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.hasCompletedFirstTrade ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {u.hasCompletedFirstTrade ? '1st Trade Completed' : 'Awaiting 1st Trade'}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right font-bold text-emerald-400">
                          {u.hasCompletedFirstTrade ? '3% Paid' : '0.00'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                No referred users yet. Copy your referral link above and invite your friends!
              </div>
            )}
          </div>

          {/* Right: Referral Leaderboard */}
          <div className="lg:col-span-4 glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Referral Leaderboard</span>
            </h3>

            <div className="space-y-3">
              {(stats?.leaderboard || [
                { username: 'john', totalReferred: 2, totalEarnedGhs: 39.30 },
                { username: 'kwame_crypto', totalReferred: 1, totalEarnedGhs: 15.00 }
              ]).map((lb, index) => (
                <div key={index} className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full font-bold flex items-center justify-center text-[10px] ${
                      index === 0 ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'
                    }`}>
                      #{index + 1}
                    </span>
                    <div>
                      <span className="font-bold text-white block">{lb.username}</span>
                      <span className="text-[10px] text-slate-400">{lb.totalReferred} friends invited</span>
                    </div>
                  </div>
                  <span className="font-bold text-emerald-400">{formatGhs(lb.totalEarnedGhs)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ReferralProgram;
