import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import SectionHeading from '../components/SectionHeading';
import ProductCard from '../components/ProductCard';
import ServiceCard from '../components/ServiceCard';
import HalfSection from '../components/HalfSection';
import Testimonials from '../components/Testimonials';
import Loading from '../components/Loading';
import { getProducts, getServices } from '../api';

function Home() {
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, servicesData] = await Promise.all([
          getProducts(),
          getServices()
        ]);
        setProducts(productsData.slice(0, 4));
        setServices(servicesData.slice(0, 4));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <Hero
        title="For your Special Day"
        subtitle="Beautiful flowers crafted with love for every occasion"
        buttonText="Explore More"
        buttonLink="/products"
        backgroundImage="/assets/images/bg_1.jpg"
      />

      {/* Products Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <SectionHeading title="Flowers" />
          
          {loading ? (
            <Loading />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="text-center">
                <Link
                  to="/products"
                  className="inline-block bg-pink-500 text-white px-8 py-3 rounded hover:bg-pink-600 transition-colors duration-300"
                >
                  View All Flowers
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Our Services Header */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <SectionHeading title="Our Services" />
        </div>
      </section>

      {/* Half Sections for Services */}
      <HalfSection
        title="Customer Service"
        description={[
          "We pride ourselves on exceptional customer service. Our experienced florists work closely with you to understand your vision and create arrangements that exceed expectations.",
          "From consultation to delivery, we ensure every detail is perfect for your special occasion."
        ]}
        buttonText="Read More"
        buttonLink="/services"
        imageUrl="/assets/images/img_2.jpg"
        imagePosition="left"
      />

      <HalfSection
        title="Payment Options"
        description={[
          "We offer flexible payment options to make your flower shopping experience convenient. Accept all major credit cards, online payments, and installment plans for large orders.",
          "Corporate accounts available for businesses with regular floral needs."
        ]}
        buttonText="Learn More"
        buttonLink="/contact"
        imageUrl="/assets/images/img_3.jpg"
        imagePosition="right"
      />

      {/* More Services Grid */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeading title="More Services" />
          
          {loading ? (
            <Loading />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Call to Action */}
      <section className="py-16 bg-pink-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
            Ready to Order?
          </h2>
          <p className="text-pink-100 mb-8 max-w-2xl mx-auto">
            Contact us today to discuss your floral needs. Whether it's a wedding, corporate event, or a simple bouquet to brighten someone's day, we're here to help.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-white text-pink-500 font-medium px-8 py-4 rounded hover:bg-gray-100 transition-colors duration-300"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
