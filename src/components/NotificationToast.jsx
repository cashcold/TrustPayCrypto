import React from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export class NotificationToast extends React.Component {
  static contextType = AppContext;

  render() {
    const { toast } = this.context;
    if (!toast) return null;

    let bgClass = 'bg-[#005B52] border-[#00B894] text-white';
    let IconComponent = Info;

    if (toast.type === 'success') {
      bgClass = 'bg-emerald-900/90 border-emerald-500 text-emerald-100';
      IconComponent = CheckCircle;
    } else if (toast.type === 'error') {
      bgClass = 'bg-rose-900/90 border-rose-500 text-rose-100';
      IconComponent = AlertCircle;
    }

    return (
      <div className="fixed bottom-6 right-6 z-50 max-w-md animate-bounce-short">
        <div className={`flex items-center gap-3 px-5 py-4 rounded-xl border shadow-2xl backdrop-blur-md ${bgClass}`}>
          <IconComponent className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium pr-2">{toast.message}</p>
        </div>
      </div>
    );
  }
}

export default NotificationToast;
