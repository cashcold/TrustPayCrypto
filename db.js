import mongoose from 'mongoose';

const DEFAULT_MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://capital:mangement12345@capgainco.o3hgd.mongodb.net/?retryWrites=true&w=majority&appName=Capgainco';

// Define TrustPay Schemas
const UserTrustPaySchema = new mongoose.Schema({
  modelSchema: { type: String, default: 'UserTrustPay' },
  id: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String },
  role: { type: String, default: 'user' },
  status: { type: String, default: 'Verified' },
  kycStatus: { type: String, default: 'Verified' },
  country: { type: String, default: 'United States' },
  preferredCurrency: { type: String, default: 'USD' },
  phone: { type: String },
  referralCode: { type: String },
  referredBy: { type: String, default: null },
  btcBalance: { type: Number, default: 0 },
  ethBalance: { type: Number, default: 0 },
  usdtBalance: { type: Number, default: 0 },
  fiatBalance: { type: Number, default: 0 },
  createdAt: { type: String, default: () => new Date().toISOString() }
}, { timestamps: true });

const OrderTrustPaySchema = new mongoose.Schema({
  modelSchema: { type: String, default: 'OrderTrustPay' },
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  username: { type: String },
  type: { type: String, required: true },
  coin: { type: String, required: true },
  network: { type: String },
  amountCrypto: { type: Number, required: true },
  fiatCurrency: { type: String },
  amountFiat: { type: Number, required: true },
  rateFiat: { type: Number },
  paymentMethod: { type: String },
  paymentDetails: { type: String },
  destinationAddress: { type: String },
  depositWallet: { type: String },
  receiptUrl: { type: String, default: null },
  txHash: { type: String, default: null },
  status: { type: String, default: 'Pending' },
  adminNotes: { type: String },
  createdAt: { type: String, default: () => new Date().toISOString() },
  completedAt: { type: String, default: null }
}, { timestamps: true });

const SwapTrustPaySchema = new mongoose.Schema({
  modelSchema: { type: String, default: 'SwapTrustPay' },
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  username: { type: String },
  fromCoin: { type: String },
  toCoin: { type: String },
  amountFrom: { type: Number },
  amountTo: { type: Number },
  exchangeRate: { type: Number },
  depositWallet: { type: String },
  recipientAddress: { type: String },
  txHashFrom: { type: String, default: null },
  txHashTo: { type: String, default: null },
  status: { type: String, default: 'Pending' },
  adminNotes: { type: String },
  createdAt: { type: String, default: () => new Date().toISOString() },
  completedAt: { type: String, default: null }
}, { timestamps: true });

const NotificationTrustPaySchema = new mongoose.Schema({
  modelSchema: { type: String, default: 'NotificationTrustPay' },
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: String, default: () => new Date().toISOString() }
}, { timestamps: true });

const SupportTicketTrustPaySchema = new mongoose.Schema({
  modelSchema: { type: String, default: 'SupportTicketTrustPay' },
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  username: { type: String },
  subject: { type: String, required: true },
  category: { type: String },
  priority: { type: String, default: 'Normal' },
  status: { type: String, default: 'Open' },
  createdAt: { type: String, default: () => new Date().toISOString() },
  messages: { type: Array, default: [] }
}, { timestamps: true });

const ReferralEarningTrustPaySchema = new mongoose.Schema({
  modelSchema: { type: String, default: 'ReferralEarningTrustPay' },
  id: { type: String, required: true, unique: true },
  referrerId: { type: String, required: true },
  referredUserId: { type: String },
  referredUsername: { type: String },
  orderId: { type: String },
  fiatCurrency: { type: String },
  orderAmountUsd: { type: Number },
  commissionRate: { type: Number },
  commissionUsd: { type: Number },
  status: { type: String, default: 'Paid' },
  createdAt: { type: String, default: () => new Date().toISOString() }
}, { timestamps: true });

const FiatCurrencyTrustPaySchema = new mongoose.Schema({
  modelSchema: { type: String, default: 'FiatCurrencyTrustPay' },
  code: { type: String, required: true, unique: true },
  name: { type: String },
  symbol: { type: String },
  rateToUsd: { type: Number },
  flag: { type: String },
  country: { type: String }
}, { timestamps: true });

const PlatformWalletTrustPaySchema = new mongoose.Schema({
  modelSchema: { type: String, default: 'PlatformWalletTrustPay' },
  coin: { type: String, required: true },
  network: { type: String },
  address: { type: String },
  qrCode: { type: String }
}, { timestamps: true });

const RateTrustPaySchema = new mongoose.Schema({
  modelSchema: { type: String, default: 'RateTrustPay' },
  coin: { type: String, required: true, unique: true },
  usdPrice: { type: Number },
  change24h: { type: Number }
}, { timestamps: true });

export const UserTrustPayModel = mongoose.models.UserTrustPay || mongoose.model('UserTrustPay', UserTrustPaySchema);
export const OrderTrustPayModel = mongoose.models.OrderTrustPay || mongoose.model('OrderTrustPay', OrderTrustPaySchema);
export const SwapTrustPayModel = mongoose.models.SwapTrustPay || mongoose.model('SwapTrustPay', SwapTrustPaySchema);
export const NotificationTrustPayModel = mongoose.models.NotificationTrustPay || mongoose.model('NotificationTrustPay', NotificationTrustPaySchema);
export const SupportTicketTrustPayModel = mongoose.models.SupportTicketTrustPay || mongoose.model('SupportTicketTrustPay', SupportTicketTrustPaySchema);
export const ReferralEarningTrustPayModel = mongoose.models.ReferralEarningTrustPay || mongoose.model('ReferralEarningTrustPay', ReferralEarningTrustPaySchema);
export const FiatCurrencyTrustPayModel = mongoose.models.FiatCurrencyTrustPay || mongoose.model('FiatCurrencyTrustPay', FiatCurrencyTrustPaySchema);
export const PlatformWalletTrustPayModel = mongoose.models.PlatformWalletTrustPay || mongoose.model('PlatformWalletTrustPay', PlatformWalletTrustPaySchema);
export const RateTrustPayModel = mongoose.models.RateTrustPay || mongoose.model('RateTrustPay', RateTrustPaySchema);

let isConnected = false;

export async function connectMongoDB() {
  if (isConnected) return;
  const uri = process.env.MONGO_URI || DEFAULT_MONGO_URI;
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log('Successfully connected to MongoDB Atlas for TrustPay!');
  } catch (err) {
    console.warn('MongoDB connection notice:', err.message);
    // Keep server running smoothly even if Mongo atlas IP whitelist or connection requires fallback
  }
}
