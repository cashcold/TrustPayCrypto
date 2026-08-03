import React from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { KeyRound, Mail, ArrowRight, CheckCircle } from 'lucide-react';

export class ForgotPassword extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = { email: '', sent: false };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    if (!this.state.email) {
      this.context.showToast('Please enter your email', 'error');
      return;
    }
    this.setState({ sent: true });
    this.context.showToast('Password reset link sent to your email!', 'success');
  }

  render() {
    const { navigate } = this.context;

    return (
      <div className="max-w-md mx-auto my-16 px-4">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <KeyRound className="w-10 h-10 text-[#00B894] mx-auto" />
            <h1 className="text-2xl font-black text-white">Reset Password</h1>
            <p className="text-slate-400 text-xs">Enter your email to receive a password recovery link.</p>
          </div>

          {this.state.sent ? (
            <div className="p-6 rounded-2xl bg-emerald-900/30 border border-emerald-500/40 text-emerald-300 text-xs text-center space-y-3">
              <CheckCircle className="w-8 h-8 mx-auto" />
              <p>We've sent password reset instructions to <strong className="text-white">{this.state.email}</strong>.</p>
              <button
                onClick={() => navigate('login')}
                className="w-full py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs"
              >
                Back to Login
              </button>
            </div>
          ) : (
            <form onSubmit={this.handleSubmit} className="space-y-4">
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

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-brand text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2"
              >
                <span>Send Reset Link</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }
}

export default ForgotPassword;
