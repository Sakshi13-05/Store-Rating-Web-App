import React, { useState, useEffect } from 'react';
import {
    Star, Search, ArrowRight, CheckCircle2, ChevronRight, MessageSquare, ShieldCheck, TrendingUp, Users
} from 'lucide-react';
import StoreCard from '../../components/StoreCard';
import './LandingPage.css';

export default function LandingPage({ onOpenAuth, onSelectStoreToRate }) {
    const [stores, setStores] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const fetchStores = async () => {
        try {
            const q = new URLSearchParams({
                search: searchQuery,
                category: selectedCategory,
            }).toString();

            const res = await fetch(`http://127.0.0.1:5000/api/stores?${q}`);
            const data = await res.json();
            if (res.ok) {
                setStores(data);
            }
        } catch (err) {
            console.error('Error fetching stores for landing page:', err);
        }
    };

    useEffect(() => {
        fetchStores();
    }, [searchQuery, selectedCategory]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const element = document.getElementById('curated-picks');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleCategoryClick = (cat) => {
        setSelectedCategory(cat);
        const element = document.getElementById('curated-picks');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const testimonials = [
        {
            quote: "RateNest helped me find the most incredible independent bookshop three blocks from my apartment. I never would have discovered it otherwise.",
            stars: 5,
            name: "Maria Esperanza",
            role: "Frequent Shopper",
            img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
        },
        {
            quote: "Since listing our bakery on RateNest, genuine customer feedback has helped us improve our opening hours and seating layout. Revenue is up 23%.",
            stars: 5,
            name: "James Okoro",
            role: "Small Business Owner",
            img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
        },
        {
            quote: "The review depth here is unmatched. Filters by atmosphere and service quality are exactly what I need when scouting locations.",
            stars: 5,
            name: "Priya Nambiar",
            role: "Food & Travel Blogger",
            img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150"
        }
    ];

    return (
        <div className="landing-container">

            {/* 1. HERO SECTION */}
            <section className="hero-section">
                <div className="hero-grid-overlay"></div>

                <div className="max-container relative z-10">
                    <div className="hero-grid">

                        {/* Hero Left */}
                        <div className="hero-left">
                            <div className="hero-pill">
                                <span className="hero-pill-dot animate-pulse"></span>
                                <span className="font-semibold tracking-wide">48,200 stores and growing</span>
                            </div>

                            <h1 className="hero-title">
                                Discover stores <br />
                                <span className="hero-title-gradient">
                                    worth your every visit.
                                </span>
                            </h1>

                            <p className="hero-desc">
                                Real ratings from real customers. Find hidden gems, avoid disappointments, and share your honest experience — one star at a time.
                            </p>

                            {/* Search Bar */}
                            <form onSubmit={handleSearchSubmit} className="hero-search-form">
                                <div className="hero-search-wrapper">
                                    <div className="hero-input-container">
                                        <Search className="hero-search-icon" />
                                        <input
                                            type="text"
                                            placeholder="Search stores, cafés, boutiques..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="hero-search-input"
                                        />
                                    </div>
                                    <button type="submit" className="hero-search-btn">
                                        Search
                                    </button>
                                </div>
                            </form>

                            {/* Popular Categories */}
                            <div className="hero-chips-container">
                                <span className="hero-chips-label">Popular:</span>
                                <button
                                    onClick={() => handleCategoryClick('coffee & specialty')}
                                    className="hero-chip"
                                >
                                    Coffee shops
                                </button>
                                <button
                                    onClick={() => handleCategoryClick('lifestyle & home')}
                                    className="hero-chip"
                                >
                                    Bookstores
                                </button>
                                <button
                                    onClick={() => handleCategoryClick('plants & wellness')}
                                    className="hero-chip"
                                >
                                    Organic grocers
                                </button>
                            </div>
                        </div>

                        {/* Hero Right - Featured Store */}
                        <div className="hero-right">
                            <div className="featured-card">
                                <span className="featured-label">Featured Store</span>

                                <div className="featured-header">
                                    <h4 className="featured-title">Harlow & Reed</h4>
                                    <div className="featured-star-badge">
                                        <Star className="star-filled" />
                                    </div>
                                </div>

                                <p className="featured-subtitle">
                                    <span className="featured-subtitle-dot"></span>
                                    New York, NY
                                </p>

                                <div className="featured-rating-row">
                                    <div className="featured-stars">
                                        <Star className="star-filled" />
                                        <Star className="star-filled" />
                                        <Star className="star-filled" />
                                        <Star className="star-filled" />
                                        <Star className="star-empty" />
                                    </div>
                                    <span className="featured-rating-num">4.9</span>
                                    <span className="featured-rating-count">(2,341 reviews)</span>
                                </div>

                                <div className="featured-tags">
                                    <span className="featured-tag">Great service</span>
                                    <span className="featured-tag">Clean space</span>
                                    <span className="featured-tag">Fair prices</span>
                                </div>

                                <div className="featured-review-alert">
                                    <p className="review-alert-label">New review added</p>
                                    <p className="review-alert-title">Verde Botanics</p>
                                    <div className="review-alert-stars">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star key={s} className="review-alert-star-icon" />
                                        ))}
                                    </div>
                                </div>

                                <div className="floating-pill">
                                    <span className="floating-pill-num">4.8</span>
                                    <span className="floating-pill-label">Avg. this week</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 2. STATS BAR */}
            <section className="stats-bar-section">
                <div className="max-container">
                    <div className="stats-grid">
                        <div className="stat-item">
                            <h4>48,200+</h4>
                            <p>Stores Rated</p>
                        </div>
                        <div className="stat-item">
                            <h4>1.2M+</h4>
                            <p>Verified Reviews</p>
                        </div>
                        <div className="stat-item">
                            <h4>320K+</h4>
                            <p>Active Users</p>
                        </div>
                        <div className="stat-item">
                            <h4 className="highlight">4.8★</h4>
                            <p>Platform Trust Score</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. CURATED PICKS */}
            <section id="curated-picks" className="curated-picks-section">
                <div className="max-container">
                    <div className="section-header-row">
                        <div>
                            <span className="section-pretitle">Curated Picks</span>
                            <h2 className="section-title">Stores people love</h2>
                        </div>
                        <button
                            onClick={() => onOpenAuth('signin')}
                            className="section-action-btn"
                        >
                            <span>View all stores</span>
                            <ArrowRight className="cta-btn-icon" />
                        </button>
                    </div>

                    {/* Cards Grid */}
                    <div className="cards-grid">
                        {stores.map((store) => (
                            <StoreCard
                                key={store.id}
                                store={store}
                                onClick={() => onSelectStoreToRate(store.id)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. HOW IT WORKS */}
            <section id="how-it-works" className="how-it-works-section">
                <div className="max-container">
                    <span className="section-pretitle">Simple by design</span>
                    <h2 className="section-title how-it-works-title">How RateNest works</h2>

                    <div className="steps-grid">
                        {/* Step 1 */}
                        <div className="step-item">
                            <div className="step-icon-wrapper">
                                <Search className="cta-btn-icon" />
                                <span className="step-number-badge">1</span>
                            </div>
                            <h4 className="step-title">Find any store</h4>
                            <p className="step-desc">
                                Search by name, category, or location. Our database covers 48,000+ stores nationwide.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="step-item">
                            <div className="step-icon-wrapper">
                                <Star className="cta-btn-icon" />
                                <span className="step-number-badge">2</span>
                            </div>
                            <h4 className="step-title">Read honest reviews</h4>
                            <p className="step-desc">
                                Every review is verified against a real purchase or visit — no fake ratings, ever.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="step-item">
                            <div className="step-icon-wrapper">
                                <TrendingUp className="cta-btn-icon" />
                                <span className="step-number-badge">3</span>
                            </div>
                            <h4 className="step-title">Rate your experience</h4>
                            <p className="step-desc">
                                Share detailed feedback across service, quality, value, and atmosphere.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. COMMUNITY TESTIMONIALS */}
            <section className="testimonials-section">
                <div className="max-container">
                    <span className="section-pretitle">Voices from the community</span>
                    <h2 className="section-title" style={{ marginBottom: '3rem' }}>Trusted by real people</h2>

                    <div className="testimonials-grid">
                        {testimonials.map((t, idx) => (
                            <div key={idx} className="testimonial-card">
                                <div className="testimonial-quote-bg">“</div>
                                <p className="testimonial-quote">"{t.quote}"</p>

                                <div className="testimonial-user-row">
                                    <div className="testimonial-stars">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star key={s} className="testimonial-star-icon" />
                                        ))}
                                    </div>
                                    <div className="testimonial-profile">
                                        <img
                                            src={t.img}
                                            alt={t.name}
                                            className="testimonial-avatar"
                                            referrerPolicy="no-referrer"
                                        />
                                        <div>
                                            <h5 className="testimonial-name">{t.name}</h5>
                                            <p className="testimonial-role">{t.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. CALL TO ACTION */}
            <section id="business-cta" className="cta-section">
                <div className="max-container" style={{ maxWidth: '64rem' }}>
                    <div className="cta-box">
                        <div className="cta-stars">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} className="cta-star-icon" />
                            ))}
                        </div>

                        <h2 className="cta-title">
                            Your review matters. <br />
                            Start rating today.
                        </h2>

                        <p className="cta-desc">
                            Join 320,000 shoppers helping others make better decisions — one honest rating at a time.
                        </p>

                        <div className="cta-buttons">
                            <button onClick={() => onOpenAuth('signup')} className="cta-primary-btn">
                                <span>Create free account</span>
                                <ArrowRight className="cta-btn-icon" />
                            </button>
                            <button onClick={() => onOpenAuth('signin')} className="cta-secondary-btn">
                                <ShieldCheck className="cta-btn-icon-brand" />
                                <span>For business owners</span>
                            </button>
                        </div>

                        <div className="cta-decor-circle-left"></div>
                        <div className="cta-decor-circle-right"></div>
                    </div>
                </div>
            </section>

        </div>
    );
}
