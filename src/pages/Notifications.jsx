import React from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { api } from '../services/api.js';
import { Bell, Check, Clock } from 'lucide-react';
import { formatDate } from '../utils/formatters.js';

export class Notifications extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      notifications: [],
      isLoading: true
    };
  }

  componentDidMount() {
    this.fetchNotifs();
  }

  async fetchNotifs() {
    const { user } = this.context;
    if (user) {
      const res = await api.getNotifications(user.id);
      if (res.success) {
        this.setState({ notifications: res.notifications, isLoading: false });
      }
    }
  }

  async markRead(id) {
    await api.markNotificationRead(id);
    this.fetchNotifs();
  }

  render() {
    const { notifications } = this.state;

    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Notifications</h1>
            <p className="text-slate-400 text-sm">System updates, order alerts, and referral rewards.</p>
          </div>
          <Bell className="w-8 h-8 text-[#00B894]" />
        </div>

        <div className="space-y-3">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-5 rounded-2xl border transition flex items-start justify-between gap-4 ${
                  n.read ? 'bg-slate-900/50 border-slate-800/80 text-slate-400' : 'bg-slate-900 border-[#00B894]/40 text-white shadow-lg'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm">{n.title}</h4>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-emerald-400"></span>}
                  </div>
                  <p className="text-xs leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-slate-500 block">{formatDate(n.createdAt)}</span>
                </div>

                {!n.read && (
                  <button
                    onClick={() => this.markRead(n.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 flex-shrink-0"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs glass-panel rounded-2xl">
              You have no notifications yet.
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Notifications;
