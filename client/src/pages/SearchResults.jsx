import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { search } from '../api';
import ProductCard from '../components/ProductCard';
import ServiceCard from '../components/ServiceCard';
import WorkshopCard from '../components/WorkshopCard';
import ProjectCard from '../components/ProjectCard';
import Loading from '../components/Loading';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState({ products: [], services: [], workshops: [], projects: [] });
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const fetchResults = async () => {
      if (!query || query.length < 2) {
        setResults({ products: [], services: [], workshops: [], projects: [] });
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await search(query);
        setResults(data);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const totalResults = 
    results.products.length + 
    results.services.length + 
    results.workshops.length + 
    results.projects.length;

  const filters = [
    { id: 'all', label: 'All', count: totalResults },
    { id: 'products', label: 'Products', count: results.products.length },
    { id: 'services', label: 'Services', count: results.services.length },
    { id: 'workshops', label: 'Workshops', count: results.workshops.length },
    { id: 'projects', label: 'Projects', count: results.projects.length },
  ];

  const showProducts = activeFilter === 'all' || activeFilter === 'products';
  const showServices = activeFilter === 'all' || activeFilter === 'services';
  const showWorkshops = activeFilter === 'all' || activeFilter === 'workshops';
  const showProjects = activeFilter === 'all' || activeFilter === 'projects';

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Search Results
          </h1>
          <p className="text-gray-600">
            {loading ? (
              'Searching...'
            ) : totalResults > 0 ? (
              <>Found <span className="font-semibold">{totalResults}</span> results for "<span className="font-semibold">{query}</span>"</>
            ) : query ? (
              <>No results found for "<span className="font-semibold">{query}</span>"</>
            ) : (
              'Enter a search term to find products, services, workshops, and projects'
            )}
          </p>
        </div>

        {/* Filters */}
        {totalResults > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === filter.id
                    ? 'bg-pink-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <Loading />
        ) : totalResults === 0 && query ? (
          /* No Results */
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No results found
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We couldn't find anything matching your search. Try different keywords or browse our categories.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/products"
                className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
              >
                Browse Products
              </Link>
              <Link
                to="/services"
                className="px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                View Services
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Products */}
            {showProducts && results.products.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Products ({results.products.length})
                  </h2>
                  {activeFilter === 'all' && results.products.length > 4 && (
                    <button
                      onClick={() => setActiveFilter('products')}
                      className="text-pink-500 hover:text-pink-600 text-sm font-medium"
                    >
                      View all →
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {(activeFilter === 'all' ? results.products.slice(0, 4) : results.products).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )}

            {/* Services */}
            {showServices && results.services.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Services ({results.services.length})
                  </h2>
                  {activeFilter === 'all' && results.services.length > 2 && (
                    <button
                      onClick={() => setActiveFilter('services')}
                      className="text-pink-500 hover:text-pink-600 text-sm font-medium"
                    >
                      View all →
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(activeFilter === 'all' ? results.services.slice(0, 2) : results.services).map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              </section>
            )}

            {/* Workshops */}
            {showWorkshops && results.workshops.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Workshops ({results.workshops.length})
                  </h2>
                  {activeFilter === 'all' && results.workshops.length > 3 && (
                    <button
                      onClick={() => setActiveFilter('workshops')}
                      className="text-pink-500 hover:text-pink-600 text-sm font-medium"
                    >
                      View all →
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(activeFilter === 'all' ? results.workshops.slice(0, 3) : results.workshops).map((workshop) => (
                    <WorkshopCard key={workshop.id} workshop={workshop} />
                  ))}
                </div>
              </section>
            )}

            {/* Projects */}
            {showProjects && results.projects.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Projects ({results.projects.length})
                  </h2>
                  {activeFilter === 'all' && results.projects.length > 2 && (
                    <button
                      onClick={() => setActiveFilter('projects')}
                      className="text-pink-500 hover:text-pink-600 text-sm font-medium"
                    >
                      View all →
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(activeFilter === 'all' ? results.projects.slice(0, 2) : results.projects).map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResults;
