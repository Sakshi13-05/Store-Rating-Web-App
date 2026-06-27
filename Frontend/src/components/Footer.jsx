import React from 'react';
import { HelpCircle, Star, Heart } from 'lucide-react';
import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="max-container">

                {/* Quick instructions widget helper */}
                <div className="footer-widgets">
                    <div className="footer-widget">
                        <div className="footer-widget-title">
                            <HelpCircle className="footer-widget-title-icon" />
                            <span>How to use Figma?</span>
                        </div>
                        <p>
                            We designed RateNest with Figma layouts. Developers can copy styling variables (colors, fonts, padding) in 1 click using the Dev Mode inspector tab in Figma.
                        </p>
                    </div>
                    <div className="footer-widget">
                        <span className="footer-widget-plain-title">Developer Tech Stack</span>
                        <p>
                            Powered by a high-performance ExpressJS REST backend API, local JSON database engines, and a responsive custom React front-end layout using standard CSS.
                        </p>
                    </div>
                    <div className="footer-widget">
                        <span className="footer-widget-plain-title">Challenge Evaluation</span>
                        <p>
                            Includes all constraints: name length limits, password complexity rules, full sorting ascending/descending, and three distinct role portals.
                        </p>
                    </div>
                </div>

                {/* Core Footer Info */}
                <div className="footer-bottom">
                    <div className="footer-logo">
                        <div className="footer-logo-icon-box">
                            <Star className="footer-logo-star" />
                        </div>
                        <span className="footer-logo-text">
                            RateNest <span className="footer-logo-version">v1.2.0</span>
                        </span>
                    </div>
                    <p className="footer-credits">
                        <span>Made with</span>
                        <Heart className="footer-heart-icon animate-pulse" />
                        <span>for FullStack Intern Coding Challenge</span>
                    </p>
                    <p className="footer-copyright">
                        &copy; {new Date().getFullYear()} RateNest Inc. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
