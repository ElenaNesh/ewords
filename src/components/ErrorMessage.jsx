import React from 'react';
import './ErrorMessage.css';

const ErrorMessage = ({ 
    error, 
    onDismiss, 
    type = 'error', 
    dismissible = true,
    className = '' 
}) => {
    if (!error) return null;

    const getErrorClass = () => {
        switch (type) {
            case 'warning':
                return 'error-message--warning';
            case 'info':
                return 'error-message--info';
            case 'success':
                return 'error-message--success';
            default:
                return 'error-message--error';
        }
    };

    const getErrorIcon = () => {
        switch (type) {
            case 'warning':
                return '⚠️';
            case 'info':
                return 'ℹ️';
            case 'success':
                return '✅';
            default:
                return '❌';
        }
    };

    return (
        <div className={`error-message ${getErrorClass()} ${className}`}>
            <div className="error-message__content">
                <span className="error-message__icon">
                    {getErrorIcon()}
                </span>
                <div className="error-message__text">
                    {typeof error === 'string' ? (
                        <p>{error}</p>
                    ) : (
                        <div>
                            {error.title && <h4>{error.title}</h4>}
                            <p>{error.message || error.toString()}</p>
                            {error.details && (
                                <details>
                                    <summary>Подробности</summary>
                                    <pre>{JSON.stringify(error.details, null, 2)}</pre>
                                </details>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {dismissible && onDismiss && (
                <button 
                    className="error-message__close"
                    onClick={onDismiss}
                    aria-label="Закрыть уведомление"
                >
                    ✕
                </button>
            )}
        </div>
    );
};

export default ErrorMessage;