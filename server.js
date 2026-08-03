import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { connectMongoDB } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Supported Fiat Currencies & Dynamic Exchange Rates vs USD
let fiatCurrencies = [
  { modelSchema: 'FiatCurrencyTrustPay', code: 'USD', name: 'US Dollar', symbol: '$', rateToUsd: 1.0, flag: '🇺🇸', country: 'United States & Global' },
  { modelSchema: 'FiatCurrencyTrustPay', code: 'EUR', name: 'Euro', symbol: '€', rateToUsd: 0.92, flag: '🇪🇺', country: 'European Union' },
  { modelSchema: 'FiatCurrencyTrustPay', code: 'GBP', name: 'British Pound', symbol: '£', rateToUsd: 0.78, flag: '🇬🇧', country: 'United Kingdom' },
  { modelSchema: 'FiatCurrencyTrustPay', code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵', rateToUsd: 15.20, flag: '🇬🇭', country: 'Ghana' },
  { modelSchema: 'FiatCurrencyTrustPay', code: 'NGN', name: 'Nigerian Naira', symbol: '₦', rateToUsd: 1550.0, flag: '🇳🇬', country: 'Nigeria' },
  { modelSchema: 'FiatCurrencyTrustPay', code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', rateToUsd: 129.0, flag: '🇰🇪', country: 'Kenya' },
  { modelSchema: 'FiatCurrencyTrustPay', code: 'ZAR', name: 'South African Rand', symbol: 'R', rateToUsd: 18.25, flag: '🇿🇦', country: 'South Africa' },
  { modelSchema: 'FiatCurrencyTrustPay', code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', rateToUsd: 1.37, flag: '🇨🇦', country: 'Canada' },
  { modelSchema: 'FiatCurrencyTrustPay', code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rateToUsd: 1.52, flag: '🇦🇺', country: 'Australia' },
  { modelSchema: 'FiatCurrencyTrustPay', code: 'INR', name: 'Indian Rupee', symbol: '₹', rateToUsd: 83.50, flag: '🇮🇳', country: 'India' },
  { modelSchema: 'FiatCurrencyTrustPay', code: 'BRL', name: 'Brazilian Real', symbol: 'R$', rateToUsd: 5.45, flag: '🇧🇷', country: 'Brazil' },
  { modelSchema: 'FiatCurrencyTrustPay', code: 'AED', name: 'UAE Dirham', symbol: 'AED', rateToUsd: 3.67, flag: '🇦🇪', country: 'United Arab Emirates' }
];

// Initial Seed Users
let users = [
  {
    modelSchema: 'UserTrustPay',
    id: 'admin-1',
    username: 'admin',
    email: 'admin@trustpaycrypto.com',
    password: 'admin12345@',
    role: 'admin',
    status: 'Verified',
    kycStatus: 'Verified',
    country: 'United States',
    preferredCurrency: 'USD',
    phone: '+1 800 555 0199',
    referralCode: 'TRUSTPAY_ADMIN',
    btcBalance: 12.5,
    ethBalance: 140.0,
    usdtBalance: 85000.00,
    fiatBalance: 500000.00, // in USD
    createdAt: new Date(Date.now() - 120 * 24 * 3600 * 1000).toISOString(),
  },
  {
    modelSchema: 'UserTrustPay',
    id: 'u-1',
    username: 'john_doe',
    email: 'john@example.com',
    password: 'Password123!',
    role: 'user',
    status: 'Verified',
    kycStatus: 'Verified',
    country: 'United States',
    preferredCurrency: 'USD',
    phone: '+1 202 555 0148',
    referralCode: 'JOHN2026',
    referredBy: null,
    btcBalance: 0.0845,
    ethBalance: 1.25,
    usdtBalance: 450.00,
    fiatBalance: 2850.00,
    createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
  },
  {
    modelSchema: 'UserTrustPay',
    id: 'u-2',
    username: 'kwame_crypto',
    email: 'kwame@example.com',
    password: 'Password123!',
    role: 'user',
    status: 'Verified',
    kycStatus: 'Verified',
    country: 'Ghana',
    preferredCurrency: 'GHS',
    phone: '+233 20 987 6543',
    referralCode: 'KWAME99',
    referredBy: 'JOHN2026',
    btcBalance: 0.012,
    ethBalance: 0.45,
    usdtBalance: 120.00,
    fiatBalance: 800.00,
    createdAt: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
  }
];

// Base USD Prices for Crypto Coins
let rates = {
  BTC: {
    usdPrice: 67500,
    change24h: 3.42,
  },
  ETH: {
    usdPrice: 3200,
    change24h: -1.15,
  },
  USDT_ERC20: {
    usdPrice: 1.00,
    change24h: 0.02,
  },
  USDT_TRC20: {
    usdPrice: 1.00,
    change24h: 0.01,
  }
};

let platformWallets = [
  { modelSchema: 'PlatformWalletTrustPay', coin: 'BTC', network: 'Bitcoin Network', address: '13P7a4yK2aZ9kTrustPayCryptoBtcAddx', qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=13P7a4yK2aZ9kTrustPayCryptoBtcAddx' },
  { modelSchema: 'PlatformWalletTrustPay', coin: 'ETH', network: 'ERC20 (Ethereum)', address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=0x71C7656EC7ab88b098defB751B7401B5f6d8976F' },
  { modelSchema: 'PlatformWalletTrustPay', coin: 'USDT_ERC20', network: 'ERC20', address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=0x71C7656EC7ab88b098defB751B7401B5f6d8976F' },
  { modelSchema: 'PlatformWalletTrustPay', coin: 'USDT_TRC20', network: 'TRC20 (Tron)', address: 'TYDzsYUE2suY2p81y2vEWaAhG9p9981881', qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=TYDzsYUE2suY2p81y2vEWaAhG9p9981881' }
];

let orders = [
  {
    modelSchema: 'OrderTrustPay',
    id: 'ORD-88219',
    userId: 'u-1',
    username: 'john_doe',
    type: 'Buy',
    coin: 'BTC',
    network: 'Bitcoin Network',
    amountCrypto: 0.005,
    fiatCurrency: 'USD',
    amountFiat: 337.50,
    rateFiat: 67500,
    paymentMethod: 'Bank Wire Transfer',
    paymentDetails: 'Sent via Chase Wire #99281',
    destinationAddress: '13P7a4yK2aZ9kTrustPayCryptoBtcAddx',
    receiptUrl: 'https://placehold.co/400x600/005B52/FFFFFF?text=Chase+Wire+Receipt+#88219',
    txHash: '0x9a8f7e6d5c4b3a21...',
    status: 'Completed',
    adminNotes: 'Wire confirmed. BTC released to user wallet',
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
  },
  {
    modelSchema: 'OrderTrustPay',
    id: 'ORD-88220',
    userId: 'u-2',
    username: 'kwame_crypto',
    type: 'Sell',
    coin: 'USDT_TRC20',
    network: 'TRC20',
    amountCrypto: 100,
    fiatCurrency: 'GHS',
    amountFiat: 1520.00,
    rateFiat: 15.20,
    paymentMethod: 'MTN Mobile Money',
    paymentDetails: 'MoMo Acc: +233 20 987 6543',
    depositWallet: 'TYDzsYUE2suY2p81y2vEWaAhG9p9981881',
    receiptUrl: null,
    txHash: '4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d',
    status: 'Completed',
    adminNotes: 'USDT received on TRC20, GHS sent to Mobile Money',
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
  }
];

let referralEarnings = [
  {
    modelSchema: 'ReferralEarningTrustPay',
    id: 'ref-1',
    referrerId: 'u-1',
    referredUserId: 'u-2',
    referredUsername: 'kwame_crypto',
    orderId: 'ORD-88220',
    fiatCurrency: 'USD',
    orderAmountUsd: 100.00,
    commissionRate: 0.03, // 3%
    commissionUsd: 3.00,
    status: 'Paid',
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString()
  }
];

let swaps = [
  {
    modelSchema: 'SwapTrustPay',
    id: 'SWP-90123',
    userId: 'u-1',
    username: 'john_doe',
    fromCoin: 'BTC',
    toCoin: 'ETH',
    amountFrom: 0.05,
    amountTo: 1.0546,
    exchangeRate: 21.092,
    depositWallet: '13P7a4yK2aZ9kTrustPayCryptoBtcAddx',
    recipientAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    txHashFrom: '0x8f7e6d5c4b3a21...',
    txHashTo: '0x1a2b3c4d5e6f7a...',
    status: 'Completed',
    adminNotes: 'BTC received on Bitcoin network. ETH dispatched to user recipient address.',
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
  },
  {
    modelSchema: 'SwapTrustPay',
    id: 'SWP-90124',
    userId: 'u-2',
    username: 'kwame_crypto',
    fromCoin: 'USDT_TRC20',
    toCoin: 'BTC',
    amountFrom: 500.00,
    amountTo: 0.00739,
    exchangeRate: 0.0000148,
    depositWallet: 'TYDzsYUE2suY2p81y2vEWaAhG9p9981881',
    recipientAddress: '13P7a4yK2aZ9kTrustPayCryptoBtcAddx',
    txHashFrom: '3f2a1b0c9d8e7f6a5b4c3d2e1f',
    txHashTo: '0x7f6a5b4c3d2e1f0a9b8c7d',
    status: 'Completed',
    adminNotes: 'TRC20 USDT confirmed. BTC dispatched.',
    createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString()
  }
];

let notifications = [
  {
    modelSchema: 'NotificationTrustPay',
    id: 'n-1',
    userId: 'u-1',
    title: 'Order Completed',
    message: 'Your Buy order ORD-88219 for 0.005 BTC has been completed!',
    read: false,
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString()
  },
  {
    modelSchema: 'NotificationTrustPay',
    id: 'n-2',
    userId: 'u-1',
    title: 'Referral Bonus Earned! 🎉',
    message: 'You earned $3.00 (3%) from kwame_crypto\'s first trade!',
    read: false,
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString()
  }
];

let supportTickets = [
  {
    modelSchema: 'SupportTicketTrustPay',
    id: 'TCK-1002',
    userId: 'u-1',
    username: 'john_doe',
    subject: 'Deposit inquiry',
    category: 'Buy Crypto',
    priority: 'Medium',
    status: 'Open',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    messages: [
      { sender: 'user', message: 'Hello, I uploaded my receipt for ORD-88219 earlier today. Thank you!', timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString() }
    ]
  }
];

let faqs = [
  { id: 'f-1', question: 'Which countries and currencies are supported?', answer: 'TrustPay Crypto is a global platform supporting over 100+ countries with local bank transfers, mobile money, cards, Wise, Revolut, SEPA, and wire transfers across USD, EUR, GBP, GHS, NGN, KES, ZAR, CAD, AUD, INR, BRL, and AED.' },
  { id: 'f-2', question: 'How long does an exchange order take?', answer: 'Orders are processed automatically or manually within 5 to 15 minutes once payment or crypto deposit is confirmed on the blockchain.' },
  { id: 'f-3', question: 'How does the 3% Global Referral Program work?', answer: 'Share your unique referral link anywhere in the world. When a referred friend completes their first buy or sell trade, you receive a 3% cash bonus deposited directly into your fiat wallet!' },
  { id: 'f-4', question: 'Are there hidden fees?', answer: 'No hidden network fees. Exchange rates are calculated transparently with live rate conversion.' }
];

let testimonials = [
  { id: 't-1', name: 'Alexander Vance', role: 'Trader, London UK', comment: 'Fastest SEPA and Faster Payments settlement for BTC & USDT I have ever used in Europe.', rating: 5, avatar: 'https://i.pravatar.cc/150?img=12' },
  { id: 't-2', name: 'Grace Mensah', role: 'Business Owner, Ghana', comment: 'Seamless Mobile Money and Bank transfer integration. Rates are accurate and updated live.', rating: 5, avatar: 'https://i.pravatar.cc/150?img=32' },
  { id: 't-3', name: 'Chidubem Okonkwo', role: 'Freelancer, Nigeria', comment: 'Direct bank payout for USDT sales works like a charm. Top class security.', rating: 5, avatar: 'https://i.pravatar.cc/150?img=53' }
];

let contactMessages = [];

let platformSettings = {
  referralCommissionPercent: 3.0,
  minBuyAmountUsd: 10,
  maxBuyAmountUsd: 50000,
  supportEmail: 'support@trustpaycrypto.com',
  supportPhone: '+1 800 555 0199',
  maintenanceMode: false
};

// Process Referral Commission
function processReferralBonusIfEligible(completedOrder) {
  const user = users.find(u => u.id === completedOrder.userId);
  if (!user || !user.referredBy) return null;

  const userCompletedOrdersCount = orders.filter(
    o => o.userId === user.id && o.status === 'Completed'
  ).length;

  if (userCompletedOrdersCount === 1) {
    const referrer = users.find(u => u.referralCode === user.referredBy || u.username === user.referredBy);
    if (!referrer) return null;

    const existingRef = referralEarnings.find(r => r.referredUserId === user.id);
    if (existingRef) return null;

    const curr = fiatCurrencies.find(c => c.code === completedOrder.fiatCurrency) || fiatCurrencies[0];
    const orderUsdVal = completedOrder.amountFiat / (curr.rateToUsd || 1);
    const bonusUsd = parseFloat((orderUsdVal * (platformSettings.referralCommissionPercent / 100)).toFixed(2));

    const newEarning = {
      modelSchema: 'ReferralEarningTrustPay',
      id: `ref-${Date.now()}`,
      referrerId: referrer.id,
      referredUserId: user.id,
      referredUsername: user.username,
      orderId: completedOrder.id,
      fiatCurrency: 'USD',
      orderAmountUsd: orderUsdVal,
      commissionRate: platformSettings.referralCommissionPercent / 100,
      commissionUsd: bonusUsd,
      status: 'Paid',
      createdAt: new Date().toISOString()
    };

    referralEarnings.push(newEarning);
    referrer.fiatBalance = parseFloat((referrer.fiatBalance + bonusUsd).toFixed(2));

    notifications.push({
      modelSchema: 'NotificationTrustPay',
      id: `n-${Date.now()}`,
      userId: referrer.id,
      title: 'Referral Commission Paid! 🚀',
      message: `You earned $${bonusUsd.toFixed(2)} (${platformSettings.referralCommissionPercent}%) from ${user.username}'s first completed trade!`,
      read: false,
      createdAt: new Date().toISOString()
    });

    return newEarning;
  }
  return null;
}

// API ROUTES
// Currencies & Rates
app.get('/api/currencies', (req, res) => {
  res.json({ success: true, currencies: fiatCurrencies });
});

app.get('/api/rates', (req, res) => {
  res.json({ success: true, rates, currencies: fiatCurrencies });
});

app.put('/api/rates', (req, res) => {
  const { coin, usdPrice } = req.body;
  if (rates[coin]) {
    if (usdPrice) rates[coin].usdPrice = parseFloat(usdPrice);
    return res.json({ success: true, rate: rates[coin] });
  }
  return res.status(400).json({ success: false, message: 'Coin not found' });
});

// Auth & Users
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please enter both email/username and password' });
  }

  const cleanInput = email.trim().toLowerCase();
  const user = users.find(u => 
    (u.email.toLowerCase() === cleanInput || u.username.toLowerCase() === cleanInput) && 
    u.password === password
  );

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email/username or password' });
  }
  return res.json({ success: true, user });
});

app.post('/api/auth/register', (req, res) => {
  const { username, email, password, phone, country, preferredCurrency, ref } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'Username, email and password are required' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanUsername = username.trim().toLowerCase();

  const exists = users.find(u => u.email.toLowerCase() === cleanEmail || u.username.toLowerCase() === cleanUsername);
  if (exists) {
    return res.status(400).json({ success: false, message: 'User with this email or username already exists' });
  }

  const newUser = {
    modelSchema: 'UserTrustPay',
    id: `u-${Date.now()}`,
    username: username.trim(),
    email: cleanEmail,
    password,
    role: 'user',
    status: 'Verified',
    kycStatus: 'Pending',
    country: country || 'United States',
    preferredCurrency: preferredCurrency || 'USD',
    phone: phone || '',
    referralCode: username.toUpperCase().replace(/\s+/g, '') + Math.floor(100 + Math.random() * 899),
    referredBy: ref || null,
    btcBalance: 0.00,
    ethBalance: 0.00,
    usdtBalance: 0.00,
    fiatBalance: 0.00,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  notifications.push({
    modelSchema: 'NotificationTrustPay',
    id: `n-${Date.now()}`,
    userId: newUser.id,
    title: 'Welcome to TrustPay Crypto! 🎉',
    message: 'Your international crypto account is created. Verify identity and start trading globally.',
    read: false,
    createdAt: new Date().toISOString()
  });

  return res.json({ success: true, user: newUser });
});

app.get('/api/auth/me/:userId', (req, res) => {
  const user = users.find(u => u.id === req.params.userId);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  return res.json({ success: true, user });
});

// Orders (Buy & Sell)
app.get('/api/orders', (req, res) => {
  const { userId } = req.query;
  if (userId) {
    const userOrders = orders.filter(o => o.userId === userId);
    return res.json({ success: true, orders: userOrders });
  }
  return res.json({ success: true, orders });
});

app.post('/api/orders', (req, res) => {
  const { 
    userId, type, coin, network, amountCrypto, 
    fiatCurrency, amountFiat, rateFiat, paymentMethod, 
    paymentDetails, destinationAddress, depositWallet, receiptUrl, txHash 
  } = req.body;

  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  const newOrder = {
    modelSchema: 'OrderTrustPay',
    id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
    userId: user.id,
    username: user.username,
    type, // 'Buy' or 'Sell'
    coin,
    network: network || 'Mainnet',
    amountCrypto: parseFloat(amountCrypto),
    fiatCurrency: fiatCurrency || 'USD',
    amountFiat: parseFloat(amountFiat),
    rateFiat: parseFloat(rateFiat || 1),
    paymentMethod,
    paymentDetails: paymentDetails || '',
    destinationAddress: destinationAddress || '',
    depositWallet: depositWallet || '',
    receiptUrl: receiptUrl || null,
    txHash: txHash || null,
    status: 'Pending',
    adminNotes: 'Order submitted successfully. Awaiting payment verification.',
    createdAt: new Date().toISOString(),
    completedAt: null
  };

  orders.unshift(newOrder);

  notifications.push({
    modelSchema: 'NotificationTrustPay',
    id: `n-${Date.now()}`,
    userId: user.id,
    title: `${type} Request Submitted`,
    message: `Your ${type} order ${newOrder.id} for ${amountCrypto} ${coin.replace('_', ' ')} (${fiatCurrency} ${amountFiat}) is under processing.`,
    read: false,
    createdAt: new Date().toISOString()
  });

  return res.json({ success: true, order: newOrder });
});

app.put('/api/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, adminNotes, txHash } = req.body;
  const order = orders.find(o => o.id === id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

  order.status = status;
  if (adminNotes) order.adminNotes = adminNotes;
  if (txHash) order.txHash = txHash;

  if (status === 'Completed') {
    order.completedAt = new Date().toISOString();
    const user = users.find(u => u.id === order.userId);
    if (user) {
      if (order.type === 'Buy') {
        if (order.coin === 'BTC') user.btcBalance += order.amountCrypto;
        else if (order.coin === 'ETH') user.ethBalance += order.amountCrypto;
        else if (order.coin.startsWith('USDT')) user.usdtBalance += order.amountCrypto;
      } else if (order.type === 'Sell') {
        user.fiatBalance += order.amountFiat;
      }
    }

    notifications.push({
      modelSchema: 'NotificationTrustPay',
      id: `n-${Date.now()}`,
      userId: order.userId,
      title: `Order ${order.id} Completed! ✅`,
      message: `Your ${order.type} order for ${order.amountCrypto} ${order.coin.replace('_', ' ')} has been approved and processed!`,
      read: false,
      createdAt: new Date().toISOString()
    });

    processReferralBonusIfEligible(order);
  } else if (status === 'Rejected' || status === 'Cancelled') {
    notifications.push({
      modelSchema: 'NotificationTrustPay',
      id: `n-${Date.now()}`,
      userId: order.userId,
      title: `Order ${order.id} ${status}`,
      message: `Your order ${order.id} was marked as ${status}. Note: ${adminNotes || 'Contact support for details'}`,
      read: false,
      createdAt: new Date().toISOString()
    });
  }

  return res.json({ success: true, order });
});

// Crypto Swap Routes
app.get('/api/swaps', (req, res) => {
  const { userId } = req.query;
  if (userId) {
    const userSwaps = swaps.filter(s => s.userId === userId);
    return res.json({ success: true, swaps: userSwaps });
  }
  return res.json({ success: true, swaps });
});

app.post('/api/swaps', (req, res) => {
  const {
    userId, fromCoin, toCoin, amountFrom,
    recipientAddress, depositWallet, txHashFrom
  } = req.body;

  if (!fromCoin || !toCoin || !amountFrom || parseFloat(amountFrom) <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid swap pair or amount' });
  }

  if (fromCoin === toCoin) {
    return res.status(400).json({ success: false, message: 'Cannot swap a token to itself' });
  }

  const fromRate = rates[fromCoin] ? rates[fromCoin].usdPrice : 1;
  const toRate = rates[toCoin] ? rates[toCoin].usdPrice : 1;

  const rawExchangeRate = fromRate / toRate;
  // 0.2% swap fee
  const netRate = rawExchangeRate * 0.998;
  const amountTo = parseFloat((parseFloat(amountFrom) * netRate).toFixed(6));

  const user = users.find(u => u.id === userId);

  const newSwap = {
    modelSchema: 'SwapTrustPay',
    id: `SWP-${Math.floor(10000 + Math.random() * 90000)}`,
    userId: user ? user.id : 'guest',
    username: user ? user.username : 'Guest Swapper',
    fromCoin,
    toCoin,
    amountFrom: parseFloat(amountFrom),
    amountTo,
    exchangeRate: parseFloat(netRate.toFixed(6)),
    depositWallet: depositWallet || (platformWallets.find(w => w.coin === fromCoin)?.address || ''),
    recipientAddress: recipientAddress || '',
    txHashFrom: txHashFrom || null,
    txHashTo: null,
    status: 'Pending',
    adminNotes: 'Crypto swap requested. Waiting for deposit confirmation on blockchain.',
    createdAt: new Date().toISOString(),
    completedAt: null
  };

  swaps.unshift(newSwap);

  if (user) {
    notifications.push({
      modelSchema: 'NotificationTrustPay',
      id: `n-${Date.now()}`,
      userId: user.id,
      title: 'Crypto Swap Request Submitted 🔄',
      message: `Swapping ${amountFrom} ${fromCoin.replace('_', ' ')} for ~${amountTo} ${toCoin.replace('_', ' ')}. Ref ID: ${newSwap.id}`,
      read: false,
      createdAt: new Date().toISOString()
    });
  }

  return res.json({ success: true, swap: newSwap });
});

app.put('/api/swaps/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, adminNotes, txHashTo } = req.body;
  const swap = swaps.find(s => s.id === id);
  if (!swap) return res.status(404).json({ success: false, message: 'Swap order not found' });

  swap.status = status;
  if (adminNotes) swap.adminNotes = adminNotes;
  if (txHashTo) swap.txHashTo = txHashTo;

  if (status === 'Completed') {
    swap.completedAt = new Date().toISOString();
    const user = users.find(u => u.id === swap.userId);
    if (user) {
      // Deduct fromCoin if balance exists, add toCoin
      if (swap.fromCoin === 'BTC') user.btcBalance = Math.max(0, user.btcBalance - swap.amountFrom);
      else if (swap.fromCoin === 'ETH') user.ethBalance = Math.max(0, user.ethBalance - swap.amountFrom);
      else if (swap.fromCoin.startsWith('USDT')) user.usdtBalance = Math.max(0, user.usdtBalance - swap.amountFrom);

      if (swap.toCoin === 'BTC') user.btcBalance += swap.amountTo;
      else if (swap.toCoin === 'ETH') user.ethBalance += swap.amountTo;
      else if (swap.toCoin.startsWith('USDT')) user.usdtBalance += swap.amountTo;
    }

    if (swap.userId && swap.userId !== 'guest') {
      notifications.push({
        id: `n-${Date.now()}`,
        userId: swap.userId,
        title: `Crypto Swap ${swap.id} Completed! 🎉`,
        message: `Your swap of ${swap.amountFrom} ${swap.fromCoin.replace('_', ' ')} to ${swap.amountTo} ${swap.toCoin.replace('_', ' ')} is settled!`,
        read: false,
        createdAt: new Date().toISOString()
      });
    }
  }

  return res.json({ success: true, swap });
});

// Wallets & Payment Methods
app.get('/api/wallets', (req, res) => {
  res.json({ success: true, platformWallets });
});

app.put('/api/wallets', (req, res) => {
  const { coin, address } = req.body;
  const wallet = platformWallets.find(w => w.coin === coin);
  if (wallet) {
    wallet.address = address;
    wallet.qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(address)}`;
    return res.json({ success: true, wallet });
  }
  return res.status(400).json({ success: false, message: 'Wallet coin not found' });
});

// Referrals
app.get('/api/referral/stats/:userId', (req, res) => {
  const user = users.find(u => u.id === req.params.userId);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  const referredUsers = users.filter(u => u.referredBy === user.referralCode || u.referredBy === user.username);
  const earnings = referralEarnings.filter(r => r.referrerId === user.id);

  const totalReferrals = referredUsers.length;
  const activeReferrals = referredUsers.filter(u => u.status === 'Verified').length;
  const completedReferrals = referredUsers.filter(u => orders.some(o => o.userId === u.id && o.status === 'Completed')).length;
  const totalPaidUsd = earnings.reduce((sum, e) => sum + (e.commissionUsd || 0), 0);

  const leaderboardMap = {};
  users.forEach(u => {
    if (u.role !== 'admin') {
      const uReferred = users.filter(sub => sub.referredBy === u.referralCode || sub.referredBy === u.username);
      const uEarnings = referralEarnings.filter(r => r.referrerId === u.id).reduce((sum, e) => sum + (e.commissionUsd || 0), 0);
      if (uReferred.length > 0 || uEarnings > 0) {
        leaderboardMap[u.username] = {
          username: u.username,
          country: u.country || 'Global',
          totalReferred: uReferred.length,
          totalEarnedUsd: uEarnings
        };
      }
    }
  });

  const leaderboard = Object.values(leaderboardMap).sort((a, b) => b.totalEarnedUsd - a.totalEarnedUsd);

  return res.json({
    success: true,
    referralCode: user.referralCode,
    referralLink: `https://trustpaycrypto.com/register?ref=${user.referralCode}`,
    totalReferrals,
    activeReferrals,
    completedReferrals,
    totalEarnedUsd: totalPaidUsd,
    withdrawableBalance: user.fiatBalance,
    earnings,
    referredUsers: referredUsers.map(u => ({
      username: u.username,
      country: u.country || 'Global',
      status: u.status,
      createdAt: u.createdAt,
      hasCompletedFirstTrade: orders.some(o => o.userId === u.id && o.status === 'Completed')
    })),
    leaderboard
  });
});

// Notifications
app.get('/api/notifications/:userId', (req, res) => {
  const userNotifs = notifications.filter(n => n.userId === req.params.userId);
  res.json({ success: true, notifications: userNotifs });
});

app.put('/api/notifications/:id/read', (req, res) => {
  const notif = notifications.find(n => n.id === req.params.id);
  if (notif) notif.read = true;
  res.json({ success: true });
});

// Support Tickets
app.get('/api/support/tickets', (req, res) => {
  const { userId } = req.query;
  if (userId) {
    const userTickets = supportTickets.filter(t => t.userId === userId);
    return res.json({ success: true, tickets: userTickets });
  }
  return res.json({ success: true, tickets: supportTickets });
});

app.post('/api/support/tickets', (req, res) => {
  const { userId, subject, category, priority, message } = req.body;
  const user = users.find(u => u.id === userId);
  const newTicket = {
    modelSchema: 'SupportTicketTrustPay',
    id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
    userId,
    username: user ? user.username : 'User',
    subject,
    category: category || 'General',
    priority: priority || 'Medium',
    status: 'Open',
    createdAt: new Date().toISOString(),
    messages: [
      { sender: 'user', message, timestamp: new Date().toISOString() }
    ]
  };
  supportTickets.unshift(newTicket);
  return res.json({ success: true, ticket: newTicket });
});

app.post('/api/support/tickets/:id/reply', (req, res) => {
  const { id } = req.params;
  const { sender, message } = req.body;
  const ticket = supportTickets.find(t => t.id === id);
  if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });

  ticket.messages.push({
    sender,
    message,
    timestamp: new Date().toISOString()
  });

  if (sender === 'admin') {
    ticket.status = 'Answered';
    notifications.push({
      modelSchema: 'NotificationTrustPay',
      id: `n-${Date.now()}`,
      userId: ticket.userId,
      title: 'Support Ticket Reply',
      message: `Admin replied to your ticket ${ticket.id}`,
      read: false,
      createdAt: new Date().toISOString()
    });
  }

  return res.json({ success: true, ticket });
});

// Database Schemas Endpoint (TrustPay Database Schemas)
app.get('/api/schemas', (req, res) => {
  res.json({
    success: true,
    schemas: {
      UserTrustPay: {
        modelName: 'UserTrustPay',
        tableName: 'users_trustpay',
        fields: ['id', 'username', 'email', 'password', 'role', 'status', 'kycStatus', 'country', 'preferredCurrency', 'phone', 'referralCode', 'referredBy', 'btcBalance', 'ethBalance', 'usdtBalance', 'fiatBalance', 'createdAt']
      },
      OrderTrustPay: {
        modelName: 'OrderTrustPay',
        tableName: 'orders_trustpay',
        fields: ['id', 'userId', 'username', 'type', 'coin', 'network', 'amountCrypto', 'fiatCurrency', 'amountFiat', 'rateFiat', 'paymentMethod', 'paymentDetails', 'destinationAddress', 'depositWallet', 'receiptUrl', 'txHash', 'status', 'adminNotes', 'createdAt', 'completedAt']
      },
      SwapTrustPay: {
        modelName: 'SwapTrustPay',
        tableName: 'swaps_trustpay',
        fields: ['id', 'userId', 'username', 'fromCoin', 'toCoin', 'amountFrom', 'amountTo', 'exchangeRate', 'depositWallet', 'recipientAddress', 'txHashFrom', 'txHashTo', 'status', 'adminNotes', 'createdAt', 'completedAt']
      },
      NotificationTrustPay: {
        modelName: 'NotificationTrustPay',
        tableName: 'notifications_trustpay',
        fields: ['id', 'userId', 'title', 'message', 'read', 'createdAt']
      },
      SupportTicketTrustPay: {
        modelName: 'SupportTicketTrustPay',
        tableName: 'support_tickets_trustpay',
        fields: ['id', 'userId', 'username', 'subject', 'category', 'priority', 'status', 'createdAt', 'messages']
      },
      ReferralEarningTrustPay: {
        modelName: 'ReferralEarningTrustPay',
        tableName: 'referral_earnings_trustpay',
        fields: ['id', 'referrerId', 'referredUserId', 'referredUsername', 'orderId', 'fiatCurrency', 'orderAmountUsd', 'commissionRate', 'commissionUsd', 'status', 'createdAt']
      },
      FiatCurrencyTrustPay: {
        modelName: 'FiatCurrencyTrustPay',
        tableName: 'fiat_currencies_trustpay',
        fields: ['code', 'name', 'symbol', 'rateToUsd', 'flag', 'country']
      },
      PlatformWalletTrustPay: {
        modelName: 'PlatformWalletTrustPay',
        tableName: 'platform_wallets_trustpay',
        fields: ['coin', 'network', 'address', 'qrCode']
      },
      RateTrustPay: {
        modelName: 'RateTrustPay',
        tableName: 'rates_trustpay',
        fields: ['coin', 'usdPrice', 'change24h']
      }
    }
  });
});

// Contact
app.post('/api/contact', (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  contactMessages.unshift({
    id: `msg-${Date.now()}`,
    name, email, phone, subject, message,
    createdAt: new Date().toISOString()
  });
  return res.json({ success: true, message: 'Thank you! Your message has been received by support.' });
});

// Admin Stats
app.get('/api/admin/overview', (req, res) => {
  const totalUsers = users.filter(u => u.role !== 'admin').length;
  const verifiedUsers = users.filter(u => u.role !== 'admin' && u.status === 'Verified').length;
  const pendingUsers = users.filter(u => u.role !== 'admin' && u.status === 'Pending').length;

  const totalBuyRequests = orders.filter(o => o.type === 'Buy').length;
  const totalSellRequests = orders.filter(o => o.type === 'Sell').length;

  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const completedOrders = orders.filter(o => o.status === 'Completed').length;

  const totalVolumeUsd = orders.filter(o => o.status === 'Completed').reduce((sum, o) => {
    const curr = fiatCurrencies.find(c => c.code === o.fiatCurrency) || fiatCurrencies[0];
    return sum + (o.amountFiat / (curr.rateToUsd || 1));
  }, 0);

  return res.json({
    success: true,
    stats: {
      totalUsers,
      verifiedUsers,
      pendingUsers,
      totalBuyRequests,
      totalSellRequests,
      pendingOrders,
      completedOrders,
      totalVolumeUsd: parseFloat(totalVolumeUsd.toFixed(2)),
      btcHoldings: 14.85,
      ethHoldings: 185.20,
      usdtHoldings: 125000.00,
      revenueUsd: parseFloat((totalVolumeUsd * 0.015).toFixed(2))
    },
    users: users.filter(u => u.role !== 'admin'),
    orders,
    rates,
    currencies: fiatCurrencies,
    faqs,
    testimonials,
    contactMessages
  });
});

app.put('/api/admin/users/:userId/status', (req, res) => {
  const { userId } = req.params;
  const { status, kycStatus } = req.body;
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  if (status) user.status = status;
  if (kycStatus) user.kycStatus = kycStatus;

  return res.json({ success: true, user });
});

app.delete('/api/admin/users/:userId', (req, res) => {
  const { userId } = req.params;
  users = users.filter(u => u.id !== userId);
  return res.json({ success: true, message: 'User deleted successfully' });
});

// News
app.get('/api/news', (req, res) => {
  res.json({
    success: true,
    news: [
      { id: '1', title: 'Global Institutional Inflows Propel Crypto Market Cap Above $2.5 Trillion', source: 'Bloomberg Crypto', time: '12 mins ago', category: 'Bitcoin' },
      { id: '2', title: 'Ethereum Staking Reaches All-Time High Across US and European Exchanges', source: 'CoinDesk', time: '1 hour ago', category: 'Ethereum' },
      { id: '3', title: 'USDT Cross-Border Settlement Growth Accelerates Across LATAM & West Africa', source: 'Global Fintech Today', time: '2 hours ago', category: 'USDT' },
      { id: '4', title: 'SEPA Instant & Faster Payments Integration Expands Global Crypto Access', source: 'TechCrunch', time: '4 hours ago', category: 'Banking' }
    ]
  });
});

// Start Vite middleware or static serving
async function startServer() {
  await connectMongoDB();

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 TrustPay Crypto Server running on http://localhost:${PORT}`);
  });
}

startServer();
