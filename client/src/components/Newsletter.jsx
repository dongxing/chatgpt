import { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    
    // Simulate subscription (in production, this would call an API)
    setTimeout(() => {
      setStatus('success');
      setMessage('Thank you for subscribing! 🌸');
      setEmail('');
      
      // Reset after a few seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    }, 1000);
  };

  return (
    <div className="bg-pink-50 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="font-semibold text-gray-900">Subscribe to Our Newsletter</h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        Get seasonal tips, exclusive offers, and inspiration delivered to your inbox.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={status === 'loading' || status === 'success'}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
        
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${
            status === 'success'
              ? 'bg-green-500 text-white'
              : status === 'loading'
              ? 'bg-pink-400 text-white cursor-wait'
              : 'bg-pink-500 text-white hover:bg-pink-600'
          }`}
        >
          {status === 'loading' ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Subscribing...
            </span>
          ) : status === 'success' ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Subscribed!
            </span>
          ) : (
            'Subscribe'
          )}
        </button>
        
        {message && status === 'error' && (
          <p className="text-sm text-red-600 mt-2">{message}</p>
        )}
        
        {message && status === 'success' && (
          <p className="text-sm text-green-600 mt-2 text-center">{message}</p>
        )}
      </form>
      
      <p className="text-xs text-gray-400 mt-3 text-center">
        We respect your privacy. Unsubscribe anytime.
      </p>
    </div>
  );
};

export default Newsletter;
