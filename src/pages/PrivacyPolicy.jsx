import React from 'react';

export class PrivacyPolicy extends React.Component {
  render() {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 text-slate-300 text-xs leading-relaxed">
        <h1 className="text-3xl font-extrabold text-white">Privacy Policy</h1>
        <p className="text-slate-400">Last updated: August 2026</p>

        <div className="glass-panel p-8 rounded-3xl space-y-4">
          <h3 className="text-base font-bold text-white">1. Data Collection</h3>
          <p>We collect essential user information including username, email address, phone number, and KYC verification documents solely for legal compliance and order processing.</p>

          <h3 className="text-base font-bold text-white">2. Security Standards</h3>
          <p>All sensitive user data is encrypted using SSL/TLS encryption and stored in secure database clusters.</p>
        </div>
      </div>
    );
  }
}

export default PrivacyPolicy;
