import React from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { User, ShieldCheck, Phone, Mail, Lock, Upload, Key, CheckCircle } from 'lucide-react';

export class Profile extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      idNumber: '',
      idType: 'Ghana Card',
      isSubmittingKyc: false,
      kycSubmitted: false
    };

    this.handleKycSubmit = this.handleKycSubmit.bind(this);
  }

  componentDidMount() {
    const { user } = this.context;
    if (user) {
      this.setState({ phone: user.phone || '' });
    }
  }

  handleKycSubmit(e) {
    e.preventDefault();
    if (!this.state.idNumber) {
      this.context.showToast('Please enter your ID number', 'error');
      return;
    }
    this.setState({ isSubmittingKyc: true });
    setTimeout(() => {
      this.setState({ isSubmittingKyc: false, kycSubmitted: true });
      this.context.showToast('KYC Verification submitted! Admin will review shortly.', 'success');
    }, 1000);
  }

  render() {
    const { user, navigate } = this.context;

    if (!user) {
      return (
        <div className="max-w-md mx-auto my-20 p-8 glass-panel rounded-3xl text-center text-white">
          <User className="w-12 h-12 text-[#00B894] mx-auto mb-2" />
          <h2 className="text-xl font-bold mb-4">Sign In Required</h2>
          <button onClick={() => navigate('login')} className="w-full py-3 bg-gradient-brand rounded-xl font-bold">Login</button>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white">User Profile & KYC</h1>
          <p className="text-slate-400 text-sm">Manage your personal details and identity verification.</p>
        </div>

        {/* Profile Card */}
        <div className="glass-panel p-8 rounded-3xl space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-brand text-white text-2xl font-black flex items-center justify-center uppercase shadow-lg">
              {user.username.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{user.username}</h3>
              <span className="text-xs text-slate-400">{user.email}</span>
              <div className="pt-1 flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  {user.kycStatus || 'Verified'} Member
                </span>
                <span className="text-xs text-slate-400 uppercase font-mono">Ref: {user.referralCode}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-4 border-t border-slate-800">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block mb-1">Phone Number</span>
              <span className="font-bold text-white text-sm">{user.phone || 'Not set'}</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block mb-1">Account Role</span>
              <span className="font-bold text-emerald-400 capitalize text-sm">{user.role}</span>
            </div>
          </div>
        </div>

        {/* KYC Document Submission Form */}
        <div className="glass-panel p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-[#00B894]" />
              <h3 className="text-lg font-bold text-white">KYC Identity Verification</h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
              Level 2 Verified
            </span>
          </div>

          {this.state.kycSubmitted ? (
            <div className="p-4 rounded-2xl bg-emerald-900/30 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span>Your KYC documents have been submitted and are under automated approval review.</span>
            </div>
          ) : (
            <form onSubmit={this.handleKycSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">ID Document Type</label>
                  <select
                    value={this.state.idType}
                    onChange={(e) => this.setState({ idType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none"
                  >
                    <option value="Ghana Card">Ghana Card (GHA-000000000-0)</option>
                    <option value="Passport">International Passport</option>
                    <option value="Drivers License">Driver's License</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">ID Document Number</label>
                  <input
                    type="text"
                    value={this.state.idNumber}
                    onChange={(e) => this.setState({ idNumber: e.target.value })}
                    placeholder="Enter ID Number..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={this.state.isSubmittingKyc}
                className="w-full py-3.5 rounded-xl bg-[#005B52] hover:bg-[#00B894] text-white font-bold text-xs transition"
              >
                {this.state.isSubmittingKyc ? 'Submitting Documents...' : 'Submit ID Verification'}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }
}

export default Profile;
