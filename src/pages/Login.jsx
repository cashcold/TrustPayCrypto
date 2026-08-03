import React from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { LogIn, Lock, User, Key, ArrowRight, ShieldCheck } from 'lucide-react';

export class Login extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      isSubmitting: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.quickFill = this.quickFill.bind(this);
  }

  quickFill(userType) {
    if (userType === 'admin') {
      this.setState({ username: 'admin@trustpaycrypto.com', password: 'admin12345@' });
    } else {
      this.setState({ username: 'john', password: '123456' });
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { login, showToast, navigate } = this.context;
    const { username, password } = this.state;

    if (!username || !password) {
      showToast('Please enter both username and password', 'error');
      return;
    }

    this.setState({ isSubmitting: true });
    const res = await login(username, password);
    this.setState({ isSubmitting: false });

    if (res.success) {
      showToast(`Welcome back, ${res.user.username}!`, 'success');
      if (res.user.role === 'admin') {
        navigate('admin');
      } else {
        navigate('dashboard');
      }
    } else {
      showToast(res.message || 'Invalid credentials', 'error');
    }
  }

  render() {
    const { navigate } = this.context;

    return (
      <div className="max-w-md mx-auto my-12 px-4">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl space-y-6 shadow-2xl relative overflow-hidden">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#005B52] text-[#00B894] flex items-center justify-center mx-auto border border-[#00B894]/30 shadow-md">
              <LogIn className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-white">Sign In to TrustPay</h1>
            <p className="text-slate-400 text-xs">Enter your account credentials to access your crypto wallet.</p>
          </div>

          {/* Quick Fill Demo Credentials Box */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
            <span className="font-bold text-amber-400 block flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Demo Quick Test Login:
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => this.quickFill('user')}
                className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold border border-slate-700"
              >
                User (john)
              </button>
              <button
                type="button"
                onClick={() => this.quickFill('admin')}
                className="flex-1 py-1.5 rounded-lg bg-[#005B52]/40 hover:bg-[#005B52] text-emerald-300 text-[11px] font-bold border border-[#00B894]/30"
              >
                Admin (admin)
              </button>
            </div>
          </div>

          <form onSubmit={this.handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Username or Email</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                <input
                  type="text"
                  value={this.state.username}
                  onChange={(e) => this.setState({ username: e.target.value })}
                  placeholder="Enter username or email..."
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-[#00B894]"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-400">Password</label>
                <button
                  type="button"
                  onClick={() => navigate('forgot-password')}
                  className="text-[11px] font-bold text-[#00B894] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                <input
                  type="password"
                  value={this.state.password}
                  onChange={(e) => this.setState({ password: e.target.value })}
                  placeholder="Enter password..."
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-[#00B894]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={this.state.isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-brand text-white font-bold text-xs shadow-lg hover:opacity-90 flex items-center justify-center gap-2"
            >
              <span>{this.state.isSubmitting ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('register')}
              className="font-bold text-[#00B894] hover:underline"
            >
              Register Account
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
