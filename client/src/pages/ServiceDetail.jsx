import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getService, getServices } from '../api';
import ImageGallery from '../components/ImageGallery';
import Loading from '../components/Loading';

function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [relatedServices, setRelatedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadService();
  }, [id]);

  const loadService = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getService(id);
      setService(data);
      
      // Load related services
      const allServices = await getServices();
      const related = allServices
        .filter(s => s.id !== parseInt(id))
        .slice(0, 3);
      setRelatedServices(related);
    } catch (err) {
      setError('Failed to load service');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  
  if (error || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{error || 'Service not found'}</h2>
          <button
            onClick={() => navigate('/services')}
            className="text-pink-500 hover:text-pink-600 font-medium"
          >
            ← Back to Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-pink-500">Home</Link>
            <span className="text-gray-400">/</span>
            <Link to="/services" className="text-gray-500 hover:text-pink-500">Services</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-800 font-medium">{service.title}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <ImageGallery 
              images={service.images || []} 
              mainImage={service.image_url}
              alt={service.title}
            />
          </div>

          {/* Service Info */}
          <div className="space-y-6">
            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">
              {service.title}
            </h1>

            {/* Description */}
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 text-lg leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* What's Included */}
            <div className="bg-pink-50 rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-gray-800 flex items-center">
                <svg className="w-5 h-5 text-pink-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                What's Included
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start text-gray-600">
                  <svg className="w-5 h-5 text-pink-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Free consultation to discuss your vision
                </li>
                <li className="flex items-start text-gray-600">
                  <svg className="w-5 h-5 text-pink-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Custom design proposals and mood boards
                </li>
                <li className="flex items-start text-gray-600">
                  <svg className="w-5 h-5 text-pink-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Premium quality fresh flowers and materials
                </li>
                <li className="flex items-start text-gray-600">
                  <svg className="w-5 h-5 text-pink-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Professional setup and styling
                </li>
              </ul>
            </div>

            {/* Process */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-gray-800 mb-4">Our Process</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-semibold mr-4 flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-medium text-gray-800">Consultation</h4>
                    <p className="text-gray-600 text-sm">We discuss your needs, preferences, and budget</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-semibold mr-4 flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-medium text-gray-800">Design</h4>
                    <p className="text-gray-600 text-sm">Our team creates a custom proposal for your approval</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-semibold mr-4 flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-medium text-gray-800">Delivery</h4>
                    <p className="text-gray-600 text-sm">We handle setup and ensure everything is perfect</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="space-y-4 pt-4">
              <Link
                to="/contact"
                className="block w-full bg-pink-500 hover:bg-pink-600 text-white text-center py-4 px-8 rounded-lg font-semibold text-lg transition-colors"
              >
                Request a Quote
              </Link>
              <p className="text-center text-gray-500 text-sm">
                Free consultation • Custom pricing • No obligation
              </p>
            </div>

            {/* Back Button */}
            <button
              onClick={() => navigate('/services')}
              className="flex items-center text-gray-600 hover:text-pink-500 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Services
            </button>
          </div>
        </div>

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Other Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedServices.map((item) => (
                <Link
                  key={item.id}
                  to={`/services/${item.id}`}
                  className="group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={item.image_url || '/assets/images/img_1.svg'}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/images/img_1.svg';
                      }}
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-800 group-hover:text-pink-500 transition-colors mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ServiceDetail;
