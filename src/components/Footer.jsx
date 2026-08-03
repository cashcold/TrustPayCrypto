import React from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { 
  ShieldCheck, 
  ArrowLeftRight, 
  Smartphone, 
  Lock, 
  CreditCard, 
  Globe, 
  HelpCircle, 
  Mail, 
  Phone, 
  AlertTriangle 
} from 'lucide-react';

export class Footer extends React.Component {
  static contextType = AppContext;

  render() {
    const { navigate, theme } = this.context;
    const isDark = theme === 'dark';

    return (
      <footer className={`border-t transition-colors ${
        isDark ? 'bg-[#0E0E0E] border-slate-800 text-slate-400' : 'bg-slate-900 border-slate-800 text-slate-300'
      }`}>
        {/* Top App Download CTA Banner (Styled inspired by modern crypto exchanges like Bitmama) */}
        <div className="bg-gradient-to-r from-[#005B52] to-[#00B894] py-12 px-4 sm:px-6 lg:px-8 text-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl text-center lg:text-left">
              <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
                Mobile Experience
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Did you know you can do more with crypto while on the go?
              </h3>
              <p className="text-emerald-100 text-sm sm:text-base">
                Get the TrustPay Crypto Mobile App for instant trade alerts, one-tap mobile money payouts, and live rates tracking anywhere in West Africa.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 flex-shrink-0">
              <button className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-black/40 hover:bg-black/60 border border-white/20 transition backdrop-blur-md">
                <Smartphone className="w-7 h-7 text-emerald-400" />
                <div className="text-left">
                  <span className="text-[10px] uppercase block text-slate-300">GET IT ON</span>
                  <span className="text-sm font-bold text-white">Google Play</span>
                </div>
              </button>

              <button className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-black/40 hover:bg-black/60 border border-white/20 transition backdrop-blur-md">
                <Globe className="w-7 h-7 text-emerald-400" />
                <div className="text-left">
                  <span className="text-[10px] uppercase block text-slate-300">Download on the</span>
                  <span className="text-sm font-bold text-white">App Store</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Financial Disclaimer Banner */}
        <div className="bg-[#181818] border-b border-slate-800 py-6 px-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4 text-xs text-slate-400">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-200">Financial & Regulatory Disclaimer:</p>
              <p>
                Cryptocurrency trading involves substantial risk and market volatility. Never invest funds you cannot afford to lose. TrustPay Crypto operates in compliance with local Ghanaian financial directives and international anti-money laundering (AML) standards.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Brand Column */}
            <div className="lg:col-span-2 space-y-4">
              <div 
                onClick={() => navigate('home')}
                className="flex items-center gap-3 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center text-white font-bold shadow-lg shadow-[#00B894]/20">
                  <ArrowLeftRight className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xl font-extrabold text-white">TrustPay <span className="text-[#00B894]">Crypto</span></span>
                </div>
              </div>

              <p className="text-sm text-slate-400 max-w-md leading-relaxed">
                "Buy & Sell Cryptocurrency Securely, Instantly, Anywhere." <br/>
                West Africa's leading peer-to-peer and liquidity crypto exchange supporting Bitcoin, Ethereum, and USDT with MoMo and Bank Transfer.
              </p>

              {/* Payment Methods Badges */}
              <div className="pt-2">
                <span className="text-xs uppercase font-semibold text-slate-400 block mb-2">Supported Payment Channels</span>
                <div className="flex flex-wrap gap-2 text-xs">
                  {['MTN MoMo', 'Telecel Cash', 'AirtelTigo', 'Bank Transfer', 'Visa', 'MasterCard'].map((pm) => (
                    <span key={pm} className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-medium border border-slate-700">
                      {pm}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Links</h4>
              <ul className="space-y-2.5 text-sm">
                <li><button onClick={() => navigate('home')} className="hover:text-[#00B894] transition">Home</button></li>
                <li><button onClick={() => navigate('buy')} className="hover:text-[#00B894] transition">Buy Crypto</button></li>
                <li><button onClick={() => navigate('sell')} className="hover:text-[#00B894] transition">Sell Crypto</button></li>
                <li><button onClick={() => navigate('rates')} className="hover:text-[#00B894] transition">Live Market Rates</button></li>
                <li><button onClick={() => navigate('referral')} className="hover:text-[#00B894] transition text-[#00B894] font-semibold">Referral Program (3%)</button></li>
              </ul>
            </div>

            {/* Account & Platform */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Account & Wallet</h4>
              <ul className="space-y-2.5 text-sm">
                <li><button onClick={() => navigate('dashboard')} className="hover:text-[#00B894] transition">User Dashboard</button></li>
                <li><button onClick={() => navigate('wallet')} className="hover:text-[#00B894] transition">Crypto Wallet</button></li>
                <li><button onClick={() => navigate('transactions')} className="hover:text-[#00B894] transition">Transaction History</button></li>
                <li><button onClick={() => navigate('profile')} className="hover:text-[#00B894] transition">Profile & Verification</button></li>
                <li><button onClick={() => navigate('admin')} className="hover:text-amber-400 transition text-amber-400 font-medium">Admin Portal</button></li>
              </ul>
            </div>

            {/* Support & Legal */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Support & Legal</h4>
              <ul className="space-y-2.5 text-sm">
                <li><button onClick={() => navigate('about')} className="hover:text-[#00B894] transition">About Us</button></li>
                <li><button onClick={() => navigate('support')} className="hover:text-[#00B894] transition">Help Center / Tickets</button></li>
                <li><button onClick={() => navigate('faq')} className="hover:text-[#00B894] transition">FAQ</button></li>
                <li><button onClick={() => navigate('contact')} className="hover:text-[#00B894] transition">Contact Us</button></li>
                <li><button onClick={() => navigate('terms')} className="hover:text-[#00B894] transition">Terms of Service</button></li>
                <li><button onClick={() => navigate('privacy')} className="hover:text-[#00B894] transition">Privacy Policy</button></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>© 2026 TrustPay Crypto Ltd. All Rights Reserved.</p>
            <div className="flex items-center gap-6">
              <button onClick={() => navigate('privacy')} className="hover:text-slate-300">Privacy Policy</button>
              <button onClick={() => navigate('terms')} className="hover:text-slate-300">Terms & Conditions</button>
              <button onClick={() => navigate('contact')} className="hover:text-slate-300">AML Policy</button>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
