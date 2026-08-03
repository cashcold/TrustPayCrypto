/**
 * TrustPay Database Schema Models
 * Every model schema explicitly incorporates "TrustPay"
 */

export interface UserTrustPay {
  modelSchema: 'UserTrustPay';
  id: string;
  username: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
  status: 'Verified' | 'Pending' | 'Suspended';
  kycStatus: 'Verified' | 'Pending' | 'Unverified';
  country: string;
  preferredCurrency: string;
  phone: string;
  referralCode: string;
  referredBy?: string | null;
  btcBalance: number;
  ethBalance: number;
  usdtBalance: number;
  fiatBalance: number;
  createdAt: string;
}

export interface OrderTrustPay {
  modelSchema: 'OrderTrustPay';
  id: string;
  userId: string;
  username: string;
  type: 'Buy' | 'Sell';
  coin: string;
  network: string;
  amountCrypto: number;
  fiatCurrency: string;
  amountFiat: number;
  rateFiat: number;
  paymentMethod: string;
  paymentDetails?: string;
  destinationAddress?: string;
  depositWallet?: string;
  receiptUrl?: string | null;
  txHash?: string | null;
  status: 'Pending' | 'Completed' | 'Processing' | 'Cancelled';
  adminNotes?: string;
  createdAt: string;
  completedAt?: string | null;
}

export interface SwapTrustPay {
  modelSchema: 'SwapTrustPay';
  id: string;
  userId: string;
  username: string;
  fromCoin: string;
  toCoin: string;
  amountFrom: number;
  amountTo: number;
  exchangeRate: number;
  depositWallet: string;
  recipientAddress: string;
  txHashFrom?: string | null;
  txHashTo?: string | null;
  status: 'Pending' | 'Completed' | 'Processing' | 'Failed';
  adminNotes?: string;
  createdAt: string;
  completedAt?: string | null;
}

export interface NotificationTrustPay {
  modelSchema: 'NotificationTrustPay';
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface SupportTicketTrustPay {
  modelSchema: 'SupportTicketTrustPay';
  id: string;
  userId: string;
  username: string;
  subject: string;
  category: string;
  priority: string;
  status: 'Open' | 'Closed' | 'In Progress';
  createdAt: string;
  messages: Array<{
    sender: 'user' | 'admin' | 'system';
    message: string;
    timestamp: string;
  }>;
}

export interface ReferralEarningTrustPay {
  modelSchema: 'ReferralEarningTrustPay';
  id: string;
  referrerId: string;
  referredUserId: string;
  referredUsername: string;
  orderId: string;
  fiatCurrency: string;
  orderAmountUsd: number;
  commissionRate: number;
  commissionUsd: number;
  status: string;
  createdAt: string;
}

export interface FiatCurrencyTrustPay {
  modelSchema: 'FiatCurrencyTrustPay';
  code: string;
  name: string;
  symbol: string;
  rateToUsd: number;
  flag: string;
  country: string;
}

export interface PlatformWalletTrustPay {
  modelSchema: 'PlatformWalletTrustPay';
  coin: string;
  network: string;
  address: string;
  qrCode: string;
}

export interface RateTrustPay {
  modelSchema: 'RateTrustPay';
  coin: string;
  usdPrice: number;
  change24h: number;
}
