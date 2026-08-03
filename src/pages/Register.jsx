import React from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { UserPlus, User, Mail, Phone, Lock, Share2, ArrowRight } from 'lucide-react';

export class Register extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      phone: '',
      password: '',
      referredByCode: '',
      isSubmitting: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    // Read ref code from URL query string if present
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    if (ref) {
      this.setState({ referredByCode: ref });
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { register, showToast, navigate } = this.context;
    const { username, email, phone, password, referredByCode } = this.state;

    if (!username || !email || !password) {
      showToast('Please fill in username, email, and password', 'error');
      return;
    }

    this.setState({ isSubmitting: true });
    const res = await register({ username, email, phone, password, referredByCode });
    this.setState({ isSubmitting: false });

    if (res.success) {
      showToast('Registration successful! Welcome to TrustPay Crypto.', 'success');
      navigate('dashboard');
    } else {
      showToast(res.message || 'Registration failed', 'error');
    }
  }

  render() {
    const { navigate } = this.context;

    return (
      <div className="max-w-md mx-auto my-10 px-4">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#005B52] text-[#00B894] flex items-center justify-center mx-auto border border-[#00B894]/30 shadow-md">
              <UserPlus className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-white">Create TrustPay Account</h1>
            <p className="text-slate-400 text-xs">Join thousands of traders buying and selling crypto in Ghana.</p>
          </div>

          <form onSubmit={this.handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Username</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                <input
                  type="text"
                  value={this.state.username}
                  onChange={(e) => this.setState({ username: e.target.value })}
                  placeholder="Choose username..."
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-[#00B894]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                <input
                  type="email"
                  value={this.state.email}
                  onChange={(e) => this.setState({ email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-[#00B894]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Phone Number (MoMo Wallet)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                <input
                  type="text"
                  value={this.state.phone}
                  onChange={(e) => this.setState({ phone: e.target.value })}
                  placeholder="+233 24 000 0000"
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-[#00B894]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                <input
                  type="password"
                  value={this.state.password}
                  onChange={(e) => this.setState({ password: e.target.value })}
                  placeholder="Create strong password..."
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-[#00B894]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Referral Code (Optional)</label>
              <div className="relative">
                <Share2 className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                <input
                  type="text"
                  value={this.state.referredByCode}
                  onChange={(e) => this.setState({ referredByCode: e.target.value })}
                  placeholder="Referral Code (e.g. KWAME2026)"
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-[#00B894]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={this.state.isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-brand text-white font-bold text-xs shadow-lg hover:opacity-90 flex items-center justify-center gap-2"
            >
              <span>{this.state.isSubmitting ? 'Creating Account...' : 'Register & Join'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
            Already registered?{' '}
            <button
              onClick={() => navigate('login')}
              className="font-bold text-[#00B894] hover:underline"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;
