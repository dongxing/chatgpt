import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProduct, getProducts } from '../api';
import ImageGallery from '../components/ImageGallery';
import Loading from '../components/Loading';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getProduct(id);
      setProduct(data);
      
      // Load related products (same category)
      const allProducts = await getProducts();
      const related = allProducts
        .filter(p => p.id !== parseInt(id) && p.category === data.category)
        .slice(0, 4);
      setRelatedProducts(related);
    } catch (err) {
      setError('Failed to load product');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  
  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{error || 'Product not found'}</h2>
          <button
            onClick={() => navigate('/products')}
            className="text-pink-500 hover:text-pink-600 font-medium"
          >
            ← Back to Products
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
            <Link to="/products" className="text-gray-500 hover:text-pink-500">Products</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-800 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <ImageGallery 
              images={product.images || []} 
              mainImage={product.image_url}
              alt={product.name}
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category Badge */}
            {product.category && (
              <span className="inline-block bg-pink-100 text-pink-600 text-sm font-medium px-4 py-1 rounded-full">
                {product.category}
              </span>
            )}

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">
              {product.name}
            </h1>

            {/* Description */}
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 text-lg leading-relaxed">
                {product.description || 'A beautiful floral arrangement crafted with care and attention to detail. Perfect for any special occasion or to brighten someone\'s day.'}
              </p>
            </div>

            {/* Features */}
            <div className="border-t border-b border-gray-200 py-6 space-y-4">
              <h3 className="font-semibold text-gray-800">What's Included:</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-pink-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Fresh, hand-selected flowers
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-pink-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Professional arrangement by expert florists
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-pink-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Elegant gift wrapping
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-pink-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Care instructions included
                </li>
              </ul>
            </div>

            {/* CTA */}
            <div className="space-y-4">
              <Link
                to="/contact"
                className="block w-full bg-pink-500 hover:bg-pink-600 text-white text-center py-4 px-8 rounded-lg font-semibold text-lg transition-colors"
              >
                Enquire Now
              </Link>
              <p className="text-center text-gray-500 text-sm">
                Contact us for pricing and availability
              </p>
            </div>

            {/* Back Button */}
            <button
              onClick={() => navigate('/products')}
              className="flex items-center text-gray-600 hover:text-pink-500 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Products
            </button>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((item) => (
                <Link
                  key={item.id}
                  to={`/products/${item.id}`}
                  className="group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={item.image_url || '/assets/images/img_1.svg'}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/images/img_1.svg';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-800 group-hover:text-pink-500 transition-colors">
                      {item.name}
                    </h3>
                    {item.category && (
                      <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                    )}
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

export default ProductDetail;
