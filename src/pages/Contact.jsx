import React from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';

export class Contact extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      phone: '',
      message: '',
      submitted: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    if (!this.state.name || !this.state.message) {
      this.context.showToast('Please complete all required fields', 'error');
      return;
    }
    this.setState({ submitted: true });
    this.context.showToast('Message sent! Our support team will get back to you shortly.', 'success');
  }

  render() {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#00B894] uppercase tracking-wider">Get In Touch</span>
          <h1 className="text-3xl font-extrabold text-white">Contact TrustPay Crypto</h1>
          <p className="text-slate-400 text-sm">Have questions or need custom OTC desk support? We are available 24/7.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Details */}
          <div className="lg:col-span-5 glass-panel p-8 rounded-3xl space-y-6">
            <h3 className="text-lg font-bold text-white">Headquarters & Support</h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <MapPin className="w-5 h-5 text-[#00B894] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Accra Office</span>
                  <span className="text-slate-400">TrustPay Towers, Airport Residential Area, Accra, Ghana</span>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <Phone className="w-5 h-5 text-[#00B894] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">24/7 Phone / WhatsApp Hotline</span>
                  <span className="text-emerald-300 font-mono">+233 24 555 0192</span>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <Mail className="w-5 h-5 text-[#00B894] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Official Email</span>
                  <span className="text-slate-300 font-mono">support@trustpaycrypto.com</span>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <Clock className="w-5 h-5 text-[#00B894] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Operating Hours</span>
                  <span className="text-slate-400">24 Hours / 7 Days a Week</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 glass-panel p-8 rounded-3xl space-y-4">
            <h3 className="text-lg font-bold text-white">Send Us a Direct Message</h3>

            {this.state.submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-900/30 border border-emerald-500/40 text-emerald-300 text-sm text-center">
                Thank you! Your message has been sent successfully.
              </div>
            ) : (
              <form onSubmit={this.handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1">Your Name</label>
                    <input
                      type="text"
                      value={this.state.name}
                      onChange={(e) => this.setState({ name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-[#00B894]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1">Your Email</label>
                    <input
                      type="email"
                      value={this.state.email}
                      onChange={(e) => this.setState({ email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-[#00B894]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Phone Number (Optional)</label>
                  <input
                    type="text"
                    value={this.state.phone}
                    onChange={(e) => this.setState({ phone: e.target.value })}
                    placeholder="+233 24 000 0000"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-[#00B894]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Message</label>
                  <textarea
                    rows="4"
                    value={this.state.message}
                    onChange={(e) => this.setState({ message: e.target.value })}
                    placeholder="How can we help you today?"
                    className="w-full p-4 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-[#00B894]"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-brand text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Contact;
