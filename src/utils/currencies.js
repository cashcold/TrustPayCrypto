// International Fiat Currencies and Country Payment Configurations for TrustPay Crypto

export const FIAT_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rateToUsd: 1.0, flag: '🇺🇸', country: 'United States & Global' },
  { code: 'EUR', name: 'Euro', symbol: '€', rateToUsd: 0.92, flag: '🇪🇺', country: 'European Union' },
  { code: 'GBP', name: 'British Pound', symbol: '£', rateToUsd: 0.78, flag: '🇬🇧', country: 'United Kingdom' },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵', rateToUsd: 15.20, flag: '🇬🇭', country: 'Ghana' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', rateToUsd: 1550.0, flag: '🇳🇬', country: 'Nigeria' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', rateToUsd: 129.0, flag: '🇰🇪', country: 'Kenya' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', rateToUsd: 18.25, flag: '🇿🇦', country: 'South Africa' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', rateToUsd: 1.37, flag: '🇨🇦', country: 'Canada' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rateToUsd: 1.52, flag: '🇦🇺', country: 'Australia' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rateToUsd: 83.50, flag: '🇮🇳', country: 'India' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', rateToUsd: 5.45, flag: '🇧🇷', country: 'Brazil' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED', rateToUsd: 3.67, flag: '🇦🇪', country: 'United Arab Emirates' }
];

export const INTERNATIONAL_PAYMENT_METHODS = {
  USD: [
    { id: 'bank_wire', name: 'Global Wire / FedWire', type: 'Bank Wire', account: 'SWIFT: TPCUS33XXX / TrustPay Global Inc' },
    { id: 'card', name: 'Visa / MasterCard Direct', type: 'Debit/Credit Card', account: 'Instant Gateway Processing' },
    { id: 'wise', name: 'Wise (TransferWise)', type: 'Multi-Currency Account', account: 'payments@trustpaycrypto.com' },
    { id: 'revolut', name: 'Revolut Pay', type: 'Instant Wallet', account: '@trustpayglobal' },
    { id: 'zelle', name: 'Zelle / Cash App', type: 'Instant P2P', account: 'pay@trustpaycrypto.com' }
  ],
  EUR: [
    { id: 'sepa', name: 'SEPA Instant Credit Transfer', type: 'Bank Transfer', account: 'IBAN: DE89 3704 0044 0532 0130 00' },
    { id: 'card', name: 'Visa / MasterCard (EUR)', type: 'Debit/Credit Card', account: 'Instant SEPA Gateway' },
    { id: 'revolut', name: 'Revolut EUR', type: 'Instant Transfer', account: '@trustpayeur' },
    { id: 'wise', name: 'Wise EUR Transfer', type: 'SEPA', account: 'eur@trustpaycrypto.com' }
  ],
  GBP: [
    { id: 'fps', name: 'UK Faster Payments', type: 'Instant Bank', account: 'Sort Code: 20-00-00 / Acc: 88392019' },
    { id: 'card', name: 'Visa / MasterCard (GBP)', type: 'Debit/Credit Card', account: 'UK Card Gateway' },
    { id: 'revolut', name: 'Revolut GBP', type: 'Instant UK', account: '@trustpayuk' }
  ],
  GHS: [
    { id: 'mtn', name: 'MTN Mobile Money', type: 'Mobile Money', account: '+233 24 555 0192 (TrustPay Merchant)' },
    { id: 'telecel', name: 'Telecel Cash', type: 'Mobile Money', account: '+233 20 555 0192 (TrustPay Telecel)' },
    { id: 'airteltigo', name: 'AirtelTigo Money', type: 'Mobile Money', account: '+233 27 555 0192 (TrustPay AT)' },
    { id: 'gh_bank', name: 'Ghana Bank Transfer', type: 'Bank Deposit', account: 'Ecobank Ghana - 1441000192831' }
  ],
  NGN: [
    { id: 'ngn_bank', name: 'Nigeria Instant Bank Transfer', type: 'Bank Deposit', account: 'GTBank - 0129384756 (TrustPay NG)' },
    { id: 'card', name: 'MasterCard / Visa (Naira)', type: 'Card Gateway', account: 'Flutterwave / Paystack Direct' }
  ],
  KES: [
    { id: 'mpesa', name: 'Safaricom M-Pesa', type: 'Mobile Money', account: 'Paybill: 522522 / Acc: 12938475' },
    { id: 'kes_bank', name: 'Kenya Bank Transfer', type: 'Bank Deposit', account: 'KCB Kenya - 1102938475' }
  ],
  ZAR: [
    { id: 'eft', name: 'South Africa Instant EFT', type: 'EFT Transfer', account: 'Standard Bank - 0029384756' },
    { id: 'card', name: 'Visa / MasterCard (ZAR)', type: 'Card Gateway', account: 'PayFast Direct' }
  ],
  CAD: [
    { id: 'interac', name: 'Interac e-Transfer', type: 'Instant Bank', account: 'cad-deposit@trustpaycrypto.com' },
    { id: 'cad_bank', name: 'Canada Bank Wire', type: 'EFT', account: 'RBC Royal Bank - Transit 00012' }
  ],
  AUD: [
    { id: 'payid', name: 'PayID / Osko', type: 'Instant Bank', account: 'payid@trustpaycrypto.com' },
    { id: 'aud_bank', name: 'Australia Wire', type: 'Bank Deposit', account: 'Commonwealth Bank - BSB 062-000' }
  ],
  INR: [
    { id: 'upi', name: 'UPI / PhonePe / GPay', type: 'UPI Direct', account: 'trustpay@ybl' },
    { id: 'inr_bank', name: 'IMPS / NEFT Bank Transfer', type: 'Bank Deposit', account: 'HDFC Bank - 501002938475' }
  ],
  BRL: [
    { id: 'pix', name: 'Pix Payment Instant', type: 'Pix QR / Key', account: 'pix@trustpaycrypto.com' },
    { id: 'brl_bank', name: 'TED / DOC Transfer', type: 'Bank Deposit', account: 'Itaú Unibanco - Ag 0123 Acc 45678-9' }
  ],
  AED: [
    { id: 'aed_bank', name: 'UAE Bank Wire', type: 'Bank Transfer', account: 'Emirates NBD - IBAN AE120260000000123456789' },
    { id: 'card', name: 'Visa / MasterCard (AED)', type: 'Card Gateway', account: 'UAE Card Gateway' }
  ]
};

export function getCurrency(code) {
  return FIAT_CURRENCIES.find(c => c.code === code) || FIAT_CURRENCIES[0];
}

export function convertAmount(amountInUsd, targetCurrencyCode) {
  const currency = getCurrency(targetCurrencyCode);
  return parseFloat((amountInUsd * currency.rateToUsd).toFixed(2));
}

export function convertToUsd(amountInFiat, sourceCurrencyCode) {
  const currency = getCurrency(sourceCurrencyCode);
  return parseFloat((amountInFiat / currency.rateToUsd).toFixed(2));
}
