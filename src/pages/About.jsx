import React from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { ShieldCheck, Award, Users, Globe, Zap } from 'lucide-react';

export class About extends React.Component {
  static contextType = AppContext;

  render() {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
        <div className="text-center space-y-3">
          <span className="px-3 py-1 rounded-full bg-[#005B52]/20 text-[#00B894] text-xs font-bold uppercase tracking-wider">
            About TrustPay Crypto
          </span>
          <h1 className="text-4xl font-extrabold text-white">Empowering Crypto Trade Across Ghana & Beyond</h1>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            TrustPay Crypto is Ghana's leading digital currency brokerage platform, enabling safe, transparent, and instant trading of Bitcoin, Ethereum, and Tether (USDT).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-3xl space-y-3">
            <ShieldCheck className="w-8 h-8 text-[#00B894]" />
            <h3 className="text-lg font-bold text-white">Security First</h3>
            <p className="text-xs text-slate-400">Multi-signature cold storage and strict KYC procedures protect all platform assets.</p>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-3">
            <Zap className="w-8 h-8 text-amber-400" />
            <h3 className="text-lg font-bold text-white">Instant MoMo Settlements</h3>
            <p className="text-xs text-slate-400">Receive Mobile Money payments within minutes for all completed sell orders.</p>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-3">
            <Users className="w-8 h-8 text-blue-400" />
            <h3 className="text-lg font-bold text-white">3% Affiliate Rewards</h3>
            <p className="text-xs text-slate-400">Share your referral link and earn a 3% commission on your friend's first trade.</p>
          </div>
        </div>

        <div className="glass-panel p-8 sm:p-12 rounded-3xl space-y-4 text-slate-300 text-sm leading-relaxed">
          <h2 className="text-2xl font-bold text-white">Our Mission</h2>
          <p>
            Our mission is to democratize access to global financial markets for individuals and businesses across West Africa. By bridging local mobile money networks with decentralized blockchain technology, we provide an accessible, low-fee, and highly secure trading experience.
          </p>
        </div>
      </div>
    );
  }
}

export default About;
