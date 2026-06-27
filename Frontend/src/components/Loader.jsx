import React from 'react';
import { RefreshCw } from 'lucide-react';
import './Loader.css';

export default function Loader({ message = 'Loading...' }) {
    return (
        <div className="loader-container">
            <div className="loader-content">
                <RefreshCw className="loader-spinner animate-spin" />
                <p className="loader-message">{message}</p>
            </div>
        </div>
    );
}
