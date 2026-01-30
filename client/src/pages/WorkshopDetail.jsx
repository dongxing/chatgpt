import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getWorkshop, getWorkshops } from '../api';
import ImageGallery from '../components/ImageGallery';
import Loading from '../components/Loading';

function WorkshopDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workshop, setWorkshop] = useState(null);
  const [relatedWorkshops, setRelatedWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadWorkshop();
  }, [id]);

  const loadWorkshop = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getWorkshop(id);
      setWorkshop(data);
      
      // Load related workshops
      const allWorkshops = await getWorkshops();
      const related = allWorkshops
        .filter(w => w.id !== parseInt(id))
        .slice(0, 3);
      setRelatedWorkshops(related);
    } catch (err) {
      setError('Failed to load workshop');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return <Loading />;
  
  if (error || !workshop) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{error || 'Workshop not found'}</h2>
          <button
            onClick={() => navigate('/workshops')}
            className="text-pink-500 hover:text-pink-600 font-medium"
          >
            ← Back to Workshops
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
            <Link to="/workshops" className="text-gray-500 hover:text-pink-500">Workshops</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-800 font-medium">{workshop.title}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <ImageGallery 
              images={workshop.images || []} 
              mainImage={workshop.image_url}
              alt={workshop.title}
            />
          </div>

          {/* Workshop Info */}
          <div className="space-y-6">
            {/* Date Badge */}
            <div className="inline-flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-full">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">{formatDate(workshop.schedule_date)}</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">
              {workshop.title}
            </h1>

            {/* Description */}
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 text-lg leading-relaxed">
                {workshop.description}
              </p>
            </div>

            {/* What You'll Learn */}
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-gray-800 flex items-center">
                <svg className="w-5 h-5 text-pink-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                What You'll Learn
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start text-gray-600">
                  <svg className="w-5 h-5 text-pink-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Flower selection and color coordination
                </li>
                <li className="flex items-start text-gray-600">
                  <svg className="w-5 h-5 text-pink-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Professional arranging techniques
                </li>
                <li className="flex items-start text-gray-600">
                  <svg className="w-5 h-5 text-pink-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Care and maintenance tips
                </li>
                <li className="flex items-start text-gray-600">
                  <svg className="w-5 h-5 text-pink-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Take home your own creation
                </li>
              </ul>
            </div>

            {/* Workshop Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-500 mb-1">Duration</div>
                <div className="font-semibold text-gray-800">2-3 Hours</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-500 mb-1">Skill Level</div>
                <div className="font-semibold text-gray-800">All Levels</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-500 mb-1">Materials</div>
                <div className="font-semibold text-gray-800">All Included</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-500 mb-1">Take Home</div>
                <div className="font-semibold text-gray-800">Your Creation</div>
              </div>
            </div>

            {/* CTA */}
            <div className="space-y-4 pt-4">
              <Link
                to="/contact"
                className="block w-full bg-pink-500 hover:bg-pink-600 text-white text-center py-4 px-8 rounded-lg font-semibold text-lg transition-colors"
              >
                Register Now
              </Link>
              <p className="text-center text-gray-500 text-sm">
                Limited spots available • Contact us to book
              </p>
            </div>

            {/* Back Button */}
            <button
              onClick={() => navigate('/workshops')}
              className="flex items-center text-gray-600 hover:text-pink-500 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Workshops
            </button>
          </div>
        </div>

        {/* Related Workshops */}
        {relatedWorkshops.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Other Workshops</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedWorkshops.map((item) => (
                <Link
                  key={item.id}
                  to={`/workshops/${item.id}`}
                  className="group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-video overflow-hidden relative">
                    <img
                      src={item.image_url || '/assets/images/img_1.svg'}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/images/img_1.svg';
                      }}
                    />
                    {item.schedule_date && (
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium px-3 py-1 rounded-full">
                        {new Date(item.schedule_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    )}
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

export default WorkshopDetail;
