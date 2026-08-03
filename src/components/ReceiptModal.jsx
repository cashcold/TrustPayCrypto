import React from 'react';
import { X, Upload, FileText, Download, CheckCircle } from 'lucide-react';
import { formatFiat, formatCrypto, formatDate } from '../utils/formatters.js';

export class ReceiptModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      receiptPreview: null
    };

    this.handleFileChange = this.handleFileChange.bind(this);
    this.downloadReceipt = this.downloadReceipt.bind(this);
  }

  handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.setState({ receiptPreview: reader.result });
        if (this.props.onUploadSuccess) {
          this.props.onUploadSuccess(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  downloadReceipt() {
    const { order } = this.props;
    if (!order) return;

    const fiatDisplay = formatFiat(order.amountFiat || order.amountGhs, order.fiatCurrency || 'USD');

    const receiptContent = `
===============================================
            TRUSTPAY CRYPTO RECEIPT
===============================================
Order ID: ${order.id}
Date: ${formatDate(order.createdAt)}
Type: ${order.type}
Coin: ${order.coin ? order.coin.replace('_', ' ') : 'Crypto'}
Crypto Amount: ${formatCrypto(order.amountCrypto, order.coin)}
Fiat Total: ${fiatDisplay}
Payment Method: ${order.paymentMethod}
Status: ${order.status}
Destination/TX: ${order.destinationAddress || order.txHash || 'N/A'}
-----------------------------------------------
Thank you for trading with TrustPay Crypto!
Website: https://trustpaycrypto.com
    `.trim();

    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `TrustPay_Receipt_${order.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  render() {
    const { isOpen, onClose, mode, order } = this.props;
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <div className="relative w-full max-w-lg rounded-3xl bg-[#1A1A1A] border border-slate-800 p-6 text-white shadow-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          {mode === 'download' && order ? (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#005B52] text-[#00B894] flex items-center justify-center border border-[#00B894]/30">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Transaction Receipt</h3>
                  <p className="text-xs text-slate-400">Order #{order.id}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-sm">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Status</span>
                  <span className="font-bold text-emerald-400">{order.status}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Type</span>
                  <span className="font-bold text-white">{order.type}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Crypto Amount</span>
                  <span className="font-bold text-emerald-300">{formatCrypto(order.amountCrypto, order.coin)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Fiat Amount</span>
                  <span className="font-bold text-white">
                    {formatFiat(order.amountFiat || order.amountGhs, order.fiatCurrency || 'USD')}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Payment Channel</span>
                  <span className="font-medium text-slate-300">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Date</span>
                  <span className="text-xs text-slate-300">{formatDate(order.createdAt)}</span>
                </div>
              </div>

              <button
                onClick={this.downloadReceipt}
                className="w-full py-3.5 rounded-xl bg-gradient-brand text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Official Receipt (.TXT)</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Upload Payment Proof</h3>
              <p className="text-xs text-slate-400">
                Please upload a screenshot or photo of your payment confirmation (MoMo SMS, Bank Transfer slip, or Visa transaction receipt).
              </p>

              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 hover:border-[#00B894] rounded-2xl p-8 cursor-pointer bg-slate-900/60 transition">
                <Upload className="w-8 h-8 text-[#00B894] mb-2" />
                <span className="text-xs font-semibold text-slate-200">Click to upload payment receipt</span>
                <span className="text-[10px] text-slate-400">JPG, PNG, PDF up to 5MB</span>
                <input type="file" accept="image/*" onChange={this.handleFileChange} className="hidden" />
              </label>

              {this.state.receiptPreview && (
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                  <img src={this.state.receiptPreview} alt="Receipt Preview" className="w-16 h-16 object-cover rounded-lg" />
                  <div className="flex-1">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Receipt Attached
                    </span>
                    <p className="text-[10px] text-slate-400">Ready for submission to Admin</p>
                  </div>
                </div>
              )}

              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-slate-800 text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default ReceiptModal;
