import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import SectionHeading from '../components/SectionHeading';
import ProductCard from '../components/ProductCard';
import Testimonial from '../components/Testimonial';
import Loading from '../components/Loading';
import { getProducts } from '../api';

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        setError('Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Get unique categories
  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

  const handleCategoryFilter = (category) => {
    setActiveCategory(category);
    if (category === 'All') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === category));
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <Hero
        title="Flowers"
        subtitle="Browse our beautiful collection of hand-crafted arrangements"
        buttonText="View Collection"
        buttonLink="#products"
        backgroundImage="/assets/images/bg_1.jpg"
        centered={true}
      />

      {/* Products Section */}
      <section id="products" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <SectionHeading title="Top Seller Flowers" />

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryFilter(category)}
                className={`px-4 py-2 rounded-full transition-colors duration-300 ${
                  activeCategory === category
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {loading ? (
            <Loading text="Loading flowers..." />
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No products found</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonial */}
      <Testimonial
        quote="The flowers were absolutely stunning! Everyone at our wedding commented on how beautiful the arrangements were. Thank you for making our special day even more memorable!"
        authorName="James Smith"
        authorTitle="Chief Executive Officer"
        authorImage="/assets/images/person_1.jpg"
      />
    </div>
  );
}

export default Products;
