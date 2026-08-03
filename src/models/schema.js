/**
 * TrustPay Database Schema Specifications
 * All database models explicitly tagged with TrustPay schema designations.
 */

export const UserTrustPaySchema = {
  modelName: 'UserTrustPay',
  tableName: 'users_trustpay',
  fields: {
    id: 'STRING',
    username: 'STRING',
    email: 'STRING',
    password: 'STRING',
    role: 'STRING',
    status: 'STRING',
    kycStatus: 'STRING',
    country: 'STRING',
    preferredCurrency: 'STRING',
    phone: 'STRING',
    referralCode: 'STRING',
    referredBy: 'STRING',
    btcBalance: 'FLOAT',
    ethBalance: 'FLOAT',
    usdtBalance: 'FLOAT',
    fiatBalance: 'FLOAT',
    createdAt: 'DATETIME'
  }
};

export const OrderTrustPaySchema = {
  modelName: 'OrderTrustPay',
  tableName: 'orders_trustpay',
  fields: {
    id: 'STRING',
    userId: 'STRING',
    username: 'STRING',
    type: 'STRING',
    coin: 'STRING',
    network: 'STRING',
    amountCrypto: 'FLOAT',
    fiatCurrency: 'STRING',
    amountFiat: 'FLOAT',
    rateFiat: 'FLOAT',
    paymentMethod: 'STRING',
    paymentDetails: 'STRING',
    destinationAddress: 'STRING',
    depositWallet: 'STRING',
    receiptUrl: 'STRING',
    txHash: 'STRING',
    status: 'STRING',
    adminNotes: 'STRING',
    createdAt: 'DATETIME',
    completedAt: 'DATETIME'
  }
};

export const SwapTrustPaySchema = {
  modelName: 'SwapTrustPay',
  tableName: 'swaps_trustpay',
  fields: {
    id: 'STRING',
    userId: 'STRING',
    username: 'STRING',
    fromCoin: 'STRING',
    toCoin: 'STRING',
    amountFrom: 'FLOAT',
    amountTo: 'FLOAT',
    exchangeRate: 'FLOAT',
    depositWallet: 'STRING',
    recipientAddress: 'STRING',
    txHashFrom: 'STRING',
    txHashTo: 'STRING',
    status: 'STRING',
    adminNotes: 'STRING',
    createdAt: 'DATETIME',
    completedAt: 'DATETIME'
  }
};

export const NotificationTrustPaySchema = {
  modelName: 'NotificationTrustPay',
  tableName: 'notifications_trustpay',
  fields: {
    id: 'STRING',
    userId: 'STRING',
    title: 'STRING',
    message: 'STRING',
    read: 'BOOLEAN',
    createdAt: 'DATETIME'
  }
};

export const SupportTicketTrustPaySchema = {
  modelName: 'SupportTicketTrustPay',
  tableName: 'support_tickets_trustpay',
  fields: {
    id: 'STRING',
    userId: 'STRING',
    username: 'STRING',
    subject: 'STRING',
    category: 'STRING',
    priority: 'STRING',
    status: 'STRING',
    createdAt: 'DATETIME',
    messages: 'ARRAY'
  }
};

export const ReferralEarningTrustPaySchema = {
  modelName: 'ReferralEarningTrustPay',
  tableName: 'referral_earnings_trustpay',
  fields: {
    id: 'STRING',
    referrerId: 'STRING',
    referredUserId: 'STRING',
    referredUsername: 'STRING',
    orderId: 'STRING',
    fiatCurrency: 'STRING',
    orderAmountUsd: 'FLOAT',
    commissionRate: 'FLOAT',
    commissionUsd: 'FLOAT',
    status: 'STRING',
    createdAt: 'DATETIME'
  }
};

export const FiatCurrencyTrustPaySchema = {
  modelName: 'FiatCurrencyTrustPay',
  tableName: 'fiat_currencies_trustpay',
  fields: {
    code: 'STRING',
    name: 'STRING',
    symbol: 'STRING',
    rateToUsd: 'FLOAT',
    flag: 'STRING',
    country: 'STRING'
  }
};

export const PlatformWalletTrustPaySchema = {
  modelName: 'PlatformWalletTrustPay',
  tableName: 'platform_wallets_trustpay',
  fields: {
    coin: 'STRING',
    network: 'STRING',
    address: 'STRING',
    qrCode: 'STRING'
  }
};

export const RateTrustPaySchema = {
  modelName: 'RateTrustPay',
  tableName: 'rates_trustpay',
  fields: {
    coin: 'STRING',
    usdPrice: 'FLOAT',
    change24h: 'FLOAT'
  }
};

export const TrustPayDatabaseSchemas = {
  UserTrustPay: UserTrustPaySchema,
  OrderTrustPay: OrderTrustPaySchema,
  SwapTrustPay: SwapTrustPaySchema,
  NotificationTrustPay: NotificationTrustPaySchema,
  SupportTicketTrustPay: SupportTicketTrustPaySchema,
  ReferralEarningTrustPay: ReferralEarningTrustPaySchema,
  FiatCurrencyTrustPay: FiatCurrencyTrustPaySchema,
  PlatformWalletTrustPay: PlatformWalletTrustPaySchema,
  RateTrustPay: RateTrustPaySchema
};
