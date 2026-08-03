// Utility formatters for TrustPay Crypto International Platform
import { FIAT_CURRENCIES } from './currencies.js';

export function formatFiat(amount, currencyCode = 'USD') {
  const val = parseFloat(amount || 0);
  const curr = FIAT_CURRENCIES.find(c => c.code === currencyCode) || FIAT_CURRENCIES[0];

  const formattedNumber = val.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return `${curr.symbol} ${formattedNumber}`;
}

export function formatGhs(amount) {
  return formatFiat(amount, 'GHS');
}

export function formatUsd(amount) {
  return formatFiat(amount, 'USD');
}

export function formatCrypto(amount, coin) {
  const val = parseFloat(amount || 0);
  let decimals = 4;
  if (coin === 'BTC') decimals = 6;
  if (coin === 'ETH') decimals = 4;
  if (coin && coin.startsWith('USDT')) decimals = 2;

  const formatted = val.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  const symbol = (coin || '').replace('_', ' ');
  return `${formatted} ${symbol}`;
}

export function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function getStatusBadgeClass(status) {
  switch (status) {
    case 'Completed':
    case 'Verified':
    case 'Paid':
      return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    case 'Pending':
    case 'Processing':
    case 'Awaiting Payment':
    case 'Awaiting Confirmation':
    case 'Open':
      return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    case 'Rejected':
    case 'Cancelled':
    case 'Suspended':
      return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
    default:
      return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
  }
}
