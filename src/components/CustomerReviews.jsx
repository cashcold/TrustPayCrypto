import React from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { 
  Star, 
  ThumbsUp, 
  CheckCircle, 
  MessageSquare, 
  Plus, 
  X, 
  Send, 
  ShieldCheck, 
  User, 
  Globe 
} from 'lucide-react';
import { formatDate } from '../utils/formatters.js';

const INITIAL_REVIEWS = [
  {
    id: 'rev-1',
    author: 'Kofi Mensah',
    country: 'Ghana',
    flag: '🇬🇭',
    rating: 5,
    tradeType: 'Sold 500 USDT via MTN MoMo',
    date: '12 minutes ago',
    title: 'Instant MoMo payout in less than 3 minutes!',
    comment: 'I was hesitant at first because of previous scam experiences on P2P platforms, but TrustPay Crypto credited my MTN Mobile Money wallet in under 3 minutes. Clean exchange rate and zero hidden fees. Highly recommended!',
    likes: 34,
    verified: true
  },
  {
    id: 'rev-2',
    author: 'Chinedu Oknwo',
    country: 'Nigeria',
    flag: '🇳🇬',
    rating: 5,
    tradeType: 'Bought 0.045 BTC via Bank Transfer',
    date: '45 minutes ago',
    title: 'Best rate in West Africa hands down',
    comment: 'Transferred NGN from my bank account and received Bitcoin directly to my Trust Wallet within 5 minutes. The 3% referral reward also works smoothly when my friends sign up.',
    likes: 28,
    verified: true
  },
  {
    id: 'rev-[#3]',
    author: 'Sarah Jenkins',
    country: 'United Kingdom',
    flag: '🇬🇧',
    rating: 5,
    tradeType: 'Bought 1.2 ETH via Wise Transfer',
    date: '2 hours ago',
    title: 'Super smooth GBP to Ethereum purchase',
    comment: 'Used Revolut & Wise bank transfer to acquire ETH. The calculated rate matched the market rate perfectly without sneaky slippage. Customer service answered my live chat question in 30 seconds.',
    likes: 19,
    verified: true
  },
  {
    id: 'rev-[#4]',
    author: 'Kiprono Cheruiyot',
    country: 'Kenya',
    flag: '🇰🇪',
    rating: 5,
    tradeType: 'Sold 250 USDT via M-Pesa',
    date: '3 hours ago',
    title: 'M-Pesa integration is fast and reliable',
    comment: 'Selling USDT for M-Pesa cash is seamless. I uploaded my payment confirmation receipt and got instant confirmation. TrustPay Crypto is now my main exchange platform.',
    likes: 42,
    verified: true
  },
  {
    id: 'rev-[#5]',
    author: 'Marcus Vance',
    country: 'United States',
    flag: '🇺🇸',
    rating: 5,
    tradeType: 'Bought $1,500 USDT via Wire',
    date: '5 hours ago',
    title: 'Top security and trustworthy transaction receipt',
    comment: 'Appreciate the downloadable official transaction receipt after every swap. Used Zelle & FedWire. Safe, compliant, and extremely fast delivery.',
    likes: 15,
    verified: true
  },
  {
    id: 'rev-[#6]',
    author: 'Fatima Al-Maktoum',
    country: 'UAE',
    flag: '🇦🇪',
    rating: 5,
    tradeType: 'Sold 0.15 BTC via AED Bank Wire',
    date: '1 day ago',
    title: 'Great international support and transparent rates',
    comment: 'Traded BTC for AED. Money landed in my Dubai NBD bank account promptly. The team provides top tier service for high volume trades.',
    likes: 22,
    verified: true
  }
];

export class CustomerReviews extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    
    // Load persisted reviews if available
    let stored = [];
    try {
      const saved = localStorage.getItem('trustpay_user_reviews');
      if (saved) stored = JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }

    this.state = {
      reviews: stored.length > 0 ? [...stored, ...INITIAL_REVIEWS] : INITIAL_REVIEWS,
      isModalOpen: false,
      filter: 'all', // 'all', 'momo', 'bank', '5star'
      userLikes: {},

      // Form state
      newAuthor: '',
      newCountry: 'Ghana',
      newFlag: '🇬🇭',
      newRating: 5,
      newTradeType: 'Bought USDT via Mobile Money',
      newTitle: '',
      newComment: '',
      submitSuccess: false
    };

    this.handleLike = this.handleLike.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleLike(id) {
    if (this.state.userLikes[id]) return;

    this.setState((prev) => {
      const updated = prev.reviews.map(r => {
        if (r.id === id) return { ...r, likes: r.likes + 1 };
        return r;
      });
      return {
        reviews: updated,
        userLikes: { ...prev.userLikes, [id]: true }
      };
    });
  }

  handleFormSubmit(e) {
    e.preventDefault();
    const { newAuthor, newCountry, newFlag, newRating, newTradeType, newTitle, newComment } = this.state;

    if (!newAuthor || !newComment || !newTitle) return;

    const newRev = {
      id: `rev-custom-${Date.now()}`,
      author: newAuthor,
      country: newCountry,
      flag: newFlag,
      rating: parseInt(newRating, 10) || 5,
      tradeType: newTradeType,
      date: 'Just now',
      title: newTitle,
      comment: newComment,
      likes: 1,
      verified: true
    };

    const updatedReviews = [newRev, ...this.state.reviews];

    try {
      const customOnly = updatedReviews.filter(r => r.id.startsWith('rev-custom'));
      localStorage.setItem('trustpay_user_reviews', JSON.stringify(customOnly));
    } catch (err) {
      console.error(err);
    }

    this.setState({
      reviews: updatedReviews,
      submitSuccess: true
    });

    setTimeout(() => {
      this.setState({
        isModalOpen: false,
        submitSuccess: false,
        newAuthor: '',
        newTitle: '',
        newComment: ''
      });
    }, 1500);
  }

  renderStars(count) {
    return (
      <div className="flex items-center gap-0.5 text-amber-400">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-4 h-4 ${i < count ? 'fill-amber-400' : 'text-slate-700'}`} 
          />
        ))}
      </div>
    );
  }

  render() {
    const { reviews, isModalOpen, filter, submitSuccess, newRating } = this.state;

    const filteredReviews = reviews.filter(r => {
      if (filter === 'momo') return r.tradeType.toLowerCase().includes('momo') || r.tradeType.toLowerCase().includes('mobile');
      if (filter === 'bank') return r.tradeType.toLowerCase().includes('bank') || r.tradeType.toLowerCase().includes('wire') || r.tradeType.toLowerCase().includes('wise');
      if (filter === '5star') return r.rating === 5;
      return true;
    });

    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16">
        <div className="space-y-8">
          {/* Header & Overall Trust Score */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-800">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[#00B894] text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Trader Testimonials</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                What Our Traders Say
              </h2>
              <p className="text-sm text-slate-400 max-w-2xl">
                Real feedback from satisfied users trading crypto across Ghana, Nigeria, United Kingdom, Kenya, USA, and 100+ countries.
              </p>
            </div>

            {/* Scorecard */}
            <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <div className="text-center pr-4 border-r border-slate-800">
                <span className="text-3xl font-black text-white block leading-none">4.95</span>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">out of 5.0</span>
              </div>
              <div>
                {this.renderStars(5)}
                <span className="text-xs text-slate-300 font-bold block mt-1">
                  3,840+ Verified Reviews
                </span>
              </div>
              <button
                onClick={() => this.setState({ isModalOpen: true })}
                className="ml-2 px-4 py-2.5 rounded-xl bg-gradient-brand text-white text-xs font-bold flex items-center gap-1.5 shadow-lg hover:scale-105 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Leave Review</span>
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => this.setState({ filter: 'all' })}
              className={`px-4 py-2 rounded-xl font-bold transition ${
                filter === 'all' ? 'bg-[#005B52] text-white shadow' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              All Feedback ({reviews.length})
            </button>
            <button
              onClick={() => this.setState({ filter: 'momo' })}
              className={`px-4 py-2 rounded-xl font-bold transition ${
                filter === 'momo' ? 'bg-[#005B52] text-white shadow' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Mobile Money Trades
            </button>
            <button
              onClick={() => this.setState({ filter: 'bank' })}
              className={`px-4 py-2 rounded-xl font-bold transition ${
                filter === 'bank' ? 'bg-[#005B52] text-white shadow' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Bank & Wise Transfers
            </button>
            <button
              onClick={() => this.setState({ filter: '5star' })}
              className={`px-4 py-2 rounded-xl font-bold transition ${
                filter === '5star' ? 'bg-[#005B52] text-white shadow' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              5-Star Ratings ⭐⭐⭐⭐⭐
            </button>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((rev) => (
              <div 
                key={rev.id}
                className="glass-card p-6 rounded-3xl space-y-4 border border-slate-800 hover:border-[#00B894]/40 transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Author Bar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-brand text-white flex items-center justify-center font-bold text-sm shadow">
                        {rev.author.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white text-sm">{rev.author}</span>
                          <span className="text-base">{rev.flag}</span>
                        </div>
                        <span className="text-[11px] text-slate-400 block">{rev.country}</span>
                      </div>
                    </div>

                    {rev.verified && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center gap-1 border border-emerald-500/30">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>

                  {/* Rating & Trade Info */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      {this.renderStars(rev.rating)}
                      <span className="text-[10px] text-slate-500 font-mono">{rev.date}</span>
                    </div>
                    <span className="inline-block text-[11px] font-semibold text-[#00B894] bg-[#005B52]/20 px-2.5 py-0.5 rounded-lg border border-[#00B894]/20">
                      {rev.tradeType}
                    </span>
                  </div>

                  {/* Title & Comment */}
                  <h4 className="font-bold text-white text-base leading-snug">{rev.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>

                {/* Helpful Upvote Button */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-500">Was this review helpful?</span>
                  <button
                    onClick={() => this.handleLike(rev.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition ${
                      this.state.userLikes[rev.id] 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{rev.likes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal: Write a Review */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-lg rounded-3xl bg-[#1A1A1A] border border-slate-800 p-6 text-white shadow-2xl">
              <button
                onClick={() => this.setState({ isModalOpen: false })}
                className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#005B52] text-[#00B894] flex items-center justify-center border border-[#00B894]/30">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Leave Your Review</h3>
                    <p className="text-xs text-slate-400">Share your trading experience on TrustPay Crypto</p>
                  </div>
                </div>

                {submitSuccess ? (
                  <div className="p-6 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-center space-y-2">
                    <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                    <h4 className="font-bold text-white text-lg">Thank You For Your Review!</h4>
                    <p className="text-xs text-emerald-200">Your feedback has been published live on the homepage.</p>
                  </div>
                ) : (
                  <form onSubmit={this.handleFormSubmit} className="space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 font-bold mb-1">Your Name</label>
                        <input
                          type="text"
                          required
                          value={this.state.newAuthor}
                          onChange={(e) => this.setState({ newAuthor: e.target.value })}
                          placeholder="e.g. Kwame O. / Alex M."
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-[#00B894] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 font-bold mb-1">Your Country</label>
                        <select
                          value={this.state.newCountry}
                          onChange={(e) => {
                            const val = e.target.value;
                            let flag = '🇬🇭';
                            if (val === 'Nigeria') flag = '🇳🇬';
                            if (val === 'United Kingdom') flag = '🇬🇧';
                            if (val === 'United States') flag = '🇺🇸';
                            if (val === 'Kenya') flag = '🇰🇪';
                            if (val === 'UAE') flag = '🇦🇪';
                            this.setState({ newCountry: val, newFlag: flag });
                          }}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-[#00B894] outline-none"
                        >
                          <option value="Ghana">Ghana 🇬🇭</option>
                          <option value="Nigeria">Nigeria 🇳🇬</option>
                          <option value="United Kingdom">United Kingdom 🇬🇧</option>
                          <option value="United States">United States 🇺🇸</option>
                          <option value="Kenya">Kenya 🇰🇪</option>
                          <option value="South Africa">South Africa 🇿🇦</option>
                          <option value="UAE">UAE 🇦🇪</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Rating</label>
                      <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800">
                        {[5, 4, 3, 2, 1].map((num) => (
                          <button
                            type="button"
                            key={num}
                            onClick={() => this.setState({ newRating: num })}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                              newRating === num ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            <span>{num}</span>
                            <Star className="w-3.5 h-3.5 fill-current" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Trade Experience</label>
                      <input
                        type="text"
                        value={this.state.newTradeType}
                        onChange={(e) => this.setState({ newTradeType: e.target.value })}
                        placeholder="e.g. Sold 200 USDT via MoMo"
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-[#00B894] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Review Headline</label>
                      <input
                        type="text"
                        required
                        value={this.state.newTitle}
                        onChange={(e) => this.setState({ newTitle: e.target.value })}
                        placeholder="e.g. Fast payout & best exchange rate!"
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-[#00B894] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Your Detailed Comment</label>
                      <textarea
                        required
                        rows="3"
                        value={this.state.newComment}
                        onChange={(e) => this.setState({ newComment: e.target.value })}
                        placeholder="Tell others how fast your transaction was processed..."
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-[#00B894] outline-none"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-gradient-brand text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Post Live Review</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    );
  }
}

export default CustomerReviews;
