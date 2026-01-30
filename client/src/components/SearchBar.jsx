import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { search } from '../api';

const SearchBar = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ products: [], services: [], workshops: [], projects: [] });
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    if (!isOpen) {
      setQuery('');
      setResults({ products: [], services: [], workshops: [], projects: [] });
      setShowResults(false);
    }
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults({ products: [], services: [], workshops: [], projects: [] });
      setShowResults(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await search(query);
        setResults(data);
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
    if (e.key === 'Enter' && query.length >= 2) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      onClose();
    }
  };

  const handleResultClick = () => {
    setShowResults(false);
    onClose();
  };

  const totalResults = 
    results.products.length + 
    results.services.length + 
    results.workshops.length + 
    results.projects.length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}>
      <div 
        ref={containerRef}
        className="w-full max-w-2xl mx-auto mt-20 px-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="relative">
          <div className="flex items-center bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="pl-4 text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search products, services, workshops..."
              className="w-full px-4 py-4 text-lg outline-none"
            />
            {loading && (
              <div className="pr-4">
                <svg className="w-5 h-5 animate-spin text-pink-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            )}
            <button
              onClick={onClose}
              className="px-4 py-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search Results Dropdown */}
          {showResults && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl max-h-96 overflow-y-auto">
              {totalResults === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>No results found for "{query}"</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {/* Products */}
                  {results.products.length > 0 && (
                    <ResultSection
                      title="Products"
                      icon="🌸"
                      items={results.products}
                      type="product"
                      onItemClick={handleResultClick}
                    />
                  )}

                  {/* Services */}
                  {results.services.length > 0 && (
                    <ResultSection
                      title="Services"
                      icon="✨"
                      items={results.services}
                      type="service"
                      onItemClick={handleResultClick}
                    />
                  )}

                  {/* Workshops */}
                  {results.workshops.length > 0 && (
                    <ResultSection
                      title="Workshops"
                      icon="📚"
                      items={results.workshops}
                      type="workshop"
                      onItemClick={handleResultClick}
                    />
                  )}

                  {/* Projects */}
                  {results.projects.length > 0 && (
                    <ResultSection
                      title="Projects"
                      icon="🏆"
                      items={results.projects}
                      type="project"
                      onItemClick={handleResultClick}
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Search Tips */}
        <div className="mt-4 text-center text-sm text-gray-400">
          Press <kbd className="px-2 py-1 bg-white/20 rounded text-white">ESC</kbd> to close
          or <kbd className="px-2 py-1 bg-white/20 rounded text-white">Enter</kbd> to see all results
        </div>
      </div>
    </div>
  );
};

const ResultSection = ({ title, icon, items, type, onItemClick }) => {
  const getLink = (item) => {
    switch (type) {
      case 'product':
        return `/products/${item.id}`;
      case 'service':
        return `/services/${item.id}`;
      case 'workshop':
        return `/workshops/${item.id}`;
      case 'project':
        return `/projects/${item.id}`;
      default:
        return '/';
    }
  };

  const getName = (item) => {
    return item.name || item.title;
  };

  return (
    <div className="p-3">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
        {icon} {title}
      </div>
      <div className="space-y-1">
        {items.slice(0, 3).map((item) => (
          <Link
            key={item.id}
            to={getLink(item)}
            onClick={onItemClick}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-pink-50 transition-colors group"
          >
            {item.image_url && (
              <img
                src={item.image_url}
                alt={getName(item)}
                className="w-10 h-10 rounded-lg object-cover"
                onError={(e) => {
                  e.target.src = '/assets/images/sq_img_1.svg';
                }}
              />
            )}
            <div className="flex-grow min-w-0">
              <div className="font-medium text-gray-900 group-hover:text-pink-600 truncate">
                {getName(item)}
              </div>
              {item.description && (
                <div className="text-sm text-gray-500 truncate">
                  {item.description.substring(0, 60)}...
                </div>
              )}
            </div>
            <svg className="w-5 h-5 text-gray-300 group-hover:text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
