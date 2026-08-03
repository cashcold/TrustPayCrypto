import React from 'react';

export class Terms extends React.Component {
  render() {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 text-slate-300 text-xs leading-relaxed">
        <h1 className="text-3xl font-extrabold text-white">Terms of Service</h1>
        <p className="text-slate-400">Last updated: August 2026</p>

        <div className="glass-panel p-8 rounded-3xl space-y-4">
          <h3 className="text-base font-bold text-white">1. Acceptance of Terms</h3>
          <p>By accessing and trading on TrustPay Crypto, you agree to comply with all platform policies, Ghanaian AML/KYC guidelines, and terms outlined herein.</p>

          <h3 className="text-base font-bold text-white">2. Referral Program Policy</h3>
          <p>A 3% referral commission is credited to the referrer ONCE upon the referred friend's first completed Buy or Sell transaction. Fraudulent self-referrals will result in account termination.</p>

          <h3 className="text-base font-bold text-white">3. Transaction Confirmations</h3>
          <p>Crypto orders are subject to blockchain network confirmation. Always verify network addresses before transferring funds.</p>
        </div>
      </div>
    );
  }
}

export default Terms;
