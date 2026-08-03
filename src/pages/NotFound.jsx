import React from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { AlertTriangle, Home } from 'lucide-react';

export class NotFound extends React.Component {
  static contextType = AppContext;

  render() {
    return (
      <div className="max-w-md mx-auto my-20 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black text-white">404 - Page Not Found</h1>
        <p className="text-slate-400 text-xs">The requested page does not exist or has been moved.</p>
        <button
          onClick={() => this.context.navigate('home')}
          className="px-6 py-3 rounded-xl bg-gradient-brand text-white font-bold text-xs inline-flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </button>
      </div>
    );
  }
}

export default NotFound;
