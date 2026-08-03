import React from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { api } from '../services/api.js';
import { HelpCircle, MessageSquare, Plus, Send, Clock, CheckCircle } from 'lucide-react';
import { formatDate } from '../utils/formatters.js';

export class Support extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      tickets: [],
      activeTicketId: null,
      subject: '',
      category: 'Buy Crypto',
      priority: 'Medium',
      message: '',
      replyText: '',
      isCreatingTicket: false
    };

    this.handleCreateTicket = this.handleCreateTicket.bind(this);
    this.handleSendReply = this.handleSendReply.bind(this);
  }

  componentDidMount() {
    this.fetchTickets();
  }

  async fetchTickets() {
    const { user } = this.context;
    if (user) {
      const res = await api.getTickets(user.id);
      if (res.success && res.tickets) {
        this.setState({
          tickets: res.tickets,
          activeTicketId: res.tickets.length > 0 ? res.tickets[0].id : null
        });
      }
    }
  }

  async handleCreateTicket(e) {
    e.preventDefault();
    const { user, showToast } = this.context;
    const { subject, category, priority, message } = this.state;

    if (!user) {
      showToast('Please login to create a support ticket', 'error');
      return;
    }
    if (!subject || !message) {
      showToast('Please provide a subject and message', 'error');
      return;
    }

    const res = await api.createTicket({
      userId: user.id,
      subject,
      category,
      priority,
      message
    });

    if (res.success) {
      showToast('Support ticket created successfully!', 'success');
      this.setState({
        subject: '',
        message: '',
        isCreatingTicket: false
      });
      this.fetchTickets();
    }
  }

  async handleSendReply(e) {
    e.preventDefault();
    const { activeTicketId, replyText } = this.state;
    if (!replyText || !activeTicketId) return;

    const res = await api.replyTicket(activeTicketId, 'user', replyText);
    if (res.success) {
      this.setState({ replyText: '' });
      this.fetchTickets();
    }
  }

  render() {
    const { tickets, activeTicketId, isCreatingTicket } = this.state;
    const activeTicket = tickets.find(t => t.id === activeTicketId);

    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white">24/7 Customer Support</h1>
            <p className="text-slate-400 text-sm">Need help with an order, wallet, or referral? Create a ticket below.</p>
          </div>

          <button
            onClick={() => this.setState({ isCreatingTicket: !isCreatingTicket })}
            className="px-5 py-2.5 rounded-xl bg-gradient-brand text-white font-bold text-xs shadow-lg flex items-center gap-2 self-start"
          >
            <Plus className="w-4 h-4" />
            <span>{isCreatingTicket ? 'Cancel' : 'New Support Ticket'}</span>
          </button>
        </div>

        {/* New Ticket Form Modal/Drawer */}
        {isCreatingTicket && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4">
            <h3 className="text-lg font-bold text-white">Create New Support Ticket</h3>
            <form onSubmit={this.handleCreateTicket} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Subject</label>
                  <input
                    type="text"
                    value={this.state.subject}
                    onChange={(e) => this.setState({ subject: e.target.value })}
                    placeholder="e.g. Deposit confirmation inquiry"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Category</label>
                  <select
                    value={this.state.category}
                    onChange={(e) => this.setState({ category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none"
                  >
                    <option value="Buy Crypto">Buy Crypto</option>
                    <option value="Sell Crypto">Sell Crypto</option>
                    <option value="Wallet">Wallet</option>
                    <option value="Referrals">Referrals</option>
                    <option value="General">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Priority</label>
                  <select
                    value={this.state.priority}
                    onChange={(e) => this.setState({ priority: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High (Urgent)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Message Description</label>
                <textarea
                  rows="3"
                  value={this.state.message}
                  onChange={(e) => this.setState({ message: e.target.value })}
                  placeholder="Describe your issue or order ID details..."
                  className="w-full p-4 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#005B52] hover:bg-[#00B894] text-white font-bold text-xs"
              >
                Submit Ticket
              </button>
            </form>
          </div>
        )}

        {/* Tickets Thread View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Tickets List */}
          <div className="lg:col-span-4 glass-panel p-4 rounded-3xl space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Your Open Tickets</h4>
            {tickets.length > 0 ? (
              tickets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => this.setState({ activeTicketId: t.id })}
                  className={`p-4 rounded-2xl cursor-pointer transition border ${
                    activeTicketId === t.id
                      ? 'bg-[#005B52] border-[#00B894] text-white'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-[10px] font-bold">{t.id}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/30">
                      {t.status}
                    </span>
                  </div>
                  <h5 className="font-bold text-xs truncate">{t.subject}</h5>
                  <span className="text-[10px] text-slate-400 block mt-1">{formatDate(t.createdAt)}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 text-center py-6">No support tickets created yet.</p>
            )}
          </div>

          {/* Right Ticket Messages Conversation */}
          <div className="lg:col-span-8 glass-panel p-6 rounded-3xl flex flex-col justify-between min-h-[400px]">
            {activeTicket ? (
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="border-b border-slate-800 pb-4 mb-4 flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#00B894]">{activeTicket.category} • {activeTicket.priority} Priority</span>
                      <h3 className="text-lg font-bold text-white">{activeTicket.subject}</h3>
                      <span className="text-xs text-slate-400">Ticket #{activeTicket.id}</span>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold">
                      {activeTicket.status}
                    </span>
                  </div>

                  {/* Messages Thread */}
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                    {activeTicket.messages.map((m, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl max-w-md text-xs space-y-1 ${
                          m.sender === 'user'
                            ? 'bg-[#005B52] text-white ml-auto'
                            : 'bg-slate-900 border border-slate-800 text-slate-200'
                        }`}
                      >
                        <span className="font-bold block text-[10px] opacity-75 capitalize">{m.sender === 'user' ? 'You' : 'TrustPay Admin Support'}</span>
                        <p>{m.message}</p>
                        <span className="text-[9px] opacity-60 block text-right">{formatDate(m.timestamp)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reply Bar */}
                <form onSubmit={this.handleSendReply} className="flex gap-2 pt-4 border-t border-slate-800">
                  <input
                    type="text"
                    value={this.state.replyText}
                    onChange={(e) => this.setState({ replyText: e.target.value })}
                    placeholder="Type your message reply..."
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-[#00B894]"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-xl bg-[#005B52] hover:bg-[#00B894] text-white font-bold text-xs"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-20 text-slate-500 text-xs">
                Select a ticket on the left or create a new one to start chatting with support.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Support;
