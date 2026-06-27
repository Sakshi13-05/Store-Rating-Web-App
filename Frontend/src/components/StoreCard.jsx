import React from 'react';
import { Star, ChevronRight } from 'lucide-react';
import './StoreCard.css';

export default function StoreCard({ store, onClick }) {
    return (
        <div className="store-card group" onClick={onClick}>
            {/* Store image with badge */}
            <div className="store-card-image-wrapper">
                <img
                    src={store.imageUrl}
                    alt={store.name}
                    className="store-card-image"
                    referrerPolicy="no-referrer"
                />
                {store.badge && (
                    <span className="store-card-badge">
                        {store.badge}
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="store-card-content">
                <span className="store-card-category">
                    {store.category}
                </span>
                <h4 className="store-card-title" title={store.name}>
                    {store.name}
                </h4>

                {/* Rating block */}
                <div className="store-card-rating">
                    <Star className="store-card-star-icon" />
                    <span className="store-card-rating-value">{store.overallRating}</span>
                    <span className="store-card-rating-count">({store.ratingCount} reviews)</span>
                </div>

                <div className="store-card-footer">
                    <span className="store-card-address">
                        {store.address.split(',')[1] || store.address}
                    </span>
                    <span className="store-card-action">
                        <span>Rate Store</span>
                        <ChevronRight className="store-card-arrow-icon" />
                    </span>
                </div>
            </div>
        </div>
    );
}
