import React from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { HelpCircle } from 'lucide-react';

export class FAQ extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = { activeIndex: 0 };
  }

  render() {
    const faqs = [
      { q: 'How do I buy Bitcoin or USDT on TrustPay Crypto?', a: 'Go to the Buy Crypto page, select your preferred coin (BTC, ETH, USDT ERC20/TRC20), enter the amount in GHS, select your payment method (MTN MoMo, Telecel Cash, Bank, etc.), make payment to our merchant account, and upload your receipt.' },
      { q: 'How long does a trade take to complete?', a: 'Orders are processed instantly or within 5 to 15 minutes upon confirmation of payment or blockchain deposit by our automated verification and admin team.' },
      { q: 'How does the 3% Referral Bonus work?', a: 'Copy your unique referral link from your Referral Dashboard. Share it with friends. When a referred friend completes their FIRST successful trade, you automatically earn a 3% cash reward credited directly to your withdrawable balance!' },
      { q: 'What payment methods are supported in Ghana?', a: 'We support MTN Mobile Money, Telecel Cash, AirtelTigo Money, Bank Transfer (Ecobank, GCB, GTBank, etc.), Visa, and MasterCard.' },
      { q: 'What is the minimum and maximum trade limit?', a: 'Minimum trade amount is $10 (approx. GHS 135), and maximum per order is $10,000.' },
      { q: 'Are there hidden transaction fees?', a: 'No. All exchange rates displayed on TrustPay Crypto are all-inclusive with zero hidden service charges.' }
    ];

    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <div className="text-center space-y-2">
          <HelpCircle className="w-10 h-10 text-[#00B894] mx-auto" />
          <h1 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h1>
          <p className="text-slate-400 text-sm">Everything you need to know about trading crypto on TrustPay.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((f, idx) => (
            <div
              key={idx}
              onClick={() => this.setState({ activeIndex: this.state.activeIndex === idx ? -1 : idx })}
              className="glass-panel p-6 rounded-2xl cursor-pointer transition"
            >
              <div className="flex justify-between items-center font-bold text-white text-sm">
                <span>{f.q}</span>
                <span className="text-[#00B894] text-lg font-black">{this.state.activeIndex === idx ? '−' : '+'}</span>
              </div>
              {this.state.activeIndex === idx && (
                <p className="mt-3 text-xs text-slate-300 leading-relaxed border-t border-slate-800 pt-3">
                  {f.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default FAQ;
