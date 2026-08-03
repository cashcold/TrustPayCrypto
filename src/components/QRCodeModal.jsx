import React from 'react';
import QRCode from 'qrcode';
import { X, Copy, Check, QrCode as QrIcon } from 'lucide-react';

export class QRCodeModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      qrDataUrl: '',
      copied: false
    };

    this.copyToClipboard = this.copyToClipboard.bind(this);
  }

  componentDidMount() {
    this.generateQR();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.address !== this.props.address) {
      this.generateQR();
    }
  }

  async generateQR() {
    const { address } = this.props;
    if (address) {
      try {
        const url = await QRCode.toDataURL(address, {
          width: 240,
          margin: 1,
          color: {
            dark: '#005B52',
            light: '#FFFFFF'
          }
        });
        this.setState({ qrDataUrl: url });
      } catch (err) {
        // Fallback image API
        this.setState({
          qrDataUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(address)}`
        });
      }
    }
  }

  copyToClipboard() {
    const { address, onCopy } = this.props;
    if (address) {
      navigator.clipboard.writeText(address);
      this.setState({ copied: true });
      if (onCopy) onCopy('Wallet address copied to clipboard!');
      setTimeout(() => this.setState({ copied: false }), 3000);
    }
  }

  render() {
    const { isOpen, onClose, title, address, network } = this.props;
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <div className="relative w-full max-w-sm rounded-3xl bg-[#1A1A1A] border border-slate-800 p-6 text-center text-white shadow-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
            <QrIcon className="w-6 h-6" />
          </div>

          <h3 className="text-lg font-bold text-white mb-1">{title || 'Scan QR Code'}</h3>
          <p className="text-xs text-slate-400 mb-4">{network || 'Crypto Wallet Network'}</p>

          <div className="bg-white p-4 rounded-2xl inline-block mb-4 shadow-inner">
            {this.state.qrDataUrl ? (
              <img src={this.state.qrDataUrl} alt="Deposit QR Code" className="w-48 h-48 mx-auto" />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-slate-900 text-xs">Generating QR...</div>
            )}
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 mb-4 text-left">
            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Wallet Address</span>
            <p className="text-xs font-mono text-emerald-300 break-all">{address}</p>
          </div>

          <button
            onClick={this.copyToClipboard}
            className="w-full py-3 rounded-xl bg-[#005B52] hover:bg-[#00B894] text-white font-bold text-sm transition flex items-center justify-center gap-2"
          >
            {this.state.copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{this.state.copied ? 'Address Copied!' : 'Copy Wallet Address'}</span>
          </button>
        </div>
      </div>
    );
  }
}

export default QRCodeModal;
