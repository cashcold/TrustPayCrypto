import React from 'react';
import { AppContext } from './context/AppContext.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import LiveTicker from './components/LiveTicker.jsx';
import NotificationToast from './components/NotificationToast.jsx';

// Pages
import Home from './pages/Home.jsx';
import BuyCrypto from './pages/BuyCrypto.jsx';
import SellCrypto from './pages/SellCrypto.jsx';
import SwapCrypto from './pages/SwapCrypto.jsx';
import LiveRates from './pages/LiveRates.jsx';
import ReferralProgram from './pages/ReferralProgram.jsx';
import Wallet from './pages/Wallet.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Transactions from './pages/Transactions.jsx';
import Profile from './pages/Profile.jsx';
import Notifications from './pages/Notifications.jsx';
import Support from './pages/Support.jsx';
import FAQ from './pages/FAQ.jsx';
import Contact from './pages/Contact.jsx';
import About from './pages/About.jsx';
import Terms from './pages/Terms.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import NotFound from './pages/NotFound.jsx';

export class App extends React.Component {
  static contextType = AppContext;

  renderPage() {
    const { activePage } = this.context;

    switch (activePage) {
      case 'home':
        return <Home />;
      case 'buy':
        return <BuyCrypto />;
      case 'sell':
        return <SellCrypto />;
      case 'swap':
        return <SwapCrypto />;
      case 'rates':
        return <LiveRates />;
      case 'referral':
        return <ReferralProgram />;
      case 'wallet':
        return <Wallet />;
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <Transactions />;
      case 'profile':
        return <Profile />;
      case 'notifications':
        return <Notifications />;
      case 'support':
        return <Support />;
      case 'faq':
        return <FAQ />;
      case 'contact':
        return <Contact />;
      case 'about':
        return <About />;
      case 'terms':
        return <Terms />;
      case 'privacy':
        return <PrivacyPolicy />;
      case 'login':
        return <Login />;
      case 'register':
        return <Register />;
      case 'forgot-password':
        return <ForgotPassword />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <NotFound />;
    }
  }

  render() {
    const { theme } = this.context;

    return (
      <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
        theme === 'dark' ? 'bg-[#121212] text-slate-100' : 'bg-slate-900 text-slate-100'
      }`}>
        {/* Top Price Ticker */}
        <LiveTicker />

        {/* Header Navigation */}
        <Header />

        {/* Main Content Area */}
        <main className="flex-1">
          {this.renderPage()}
        </main>

        {/* Footer */}
        <Footer />

        {/* Global Toast Notification */}
        <NotificationToast />
      </div>
    );
  }
}

export default App;
