import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import SectionHeading from '../components/SectionHeading';
import WorkshopCard from '../components/WorkshopCard';
import HalfSection from '../components/HalfSection';
import Testimonial from '../components/Testimonial';
import Loading from '../components/Loading';
import { getWorkshops } from '../api';

function Workshops() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const data = await getWorkshops();
        setWorkshops(data);
      } catch (err) {
        setError('Failed to load workshops');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshops();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <Hero
        title="Learn With Us"
        subtitle="Join our hands-on floral workshops and discover the art of flower arranging"
        buttonText="View Workshops"
        buttonLink="#workshops"
        backgroundImage="/assets/images/bg_1.jpg"
        centered={true}
      />

      {/* About Our Workshops */}
      <HalfSection
        title="Customer Service"
        description={[
          "Our workshops are designed for everyone, from complete beginners to experienced flower enthusiasts looking to refine their skills.",
          "Each session is led by our expert florists who share their knowledge and techniques in a fun, relaxed environment. All materials are provided."
        ]}
        buttonText="Read More"
        buttonLink="/contact"
        imageUrl="/assets/images/img_2.jpg"
        imagePosition="left"
      />

      <HalfSection
        title="Payment Options"
        description={[
          "We offer flexible payment options for our workshops including credit cards, online payments, and gift vouchers.",
          "Group bookings and corporate team building packages are available at special rates. Contact us to learn more."
        ]}
        buttonText="Learn More"
        buttonLink="/contact"
        imageUrl="/assets/images/img_3.jpg"
        imagePosition="right"
      />

      {/* Workshops List */}
      <section id="workshops" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <SectionHeading title="Upcoming Workshops" />

          {loading ? (
            <Loading text="Loading workshops..." />
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : workshops.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No workshops scheduled at the moment. Check back soon!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workshops.map((workshop) => (
                <WorkshopCard key={workshop.id} workshop={workshop} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeading title="What You'll Learn" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">🌸</div>
              <h3 className="font-semibold text-gray-800 mb-2">Flower Selection</h3>
              <p className="text-sm text-gray-600">Learn how to choose the right flowers for any occasion</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">✂️</div>
              <h3 className="font-semibold text-gray-800 mb-2">Cutting Techniques</h3>
              <p className="text-sm text-gray-600">Master proper stem cutting for longer-lasting arrangements</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="font-semibold text-gray-800 mb-2">Color Theory</h3>
              <p className="text-sm text-gray-600">Understand color combinations that create stunning displays</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">💐</div>
              <h3 className="font-semibold text-gray-800 mb-2">Design Principles</h3>
              <p className="text-sm text-gray-600">Learn balance, proportion, and focal points in arrangements</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <Testimonial
        quote="The workshop was such a fun experience! I learned so much and came home with a beautiful arrangement I made myself. Can't wait for the next one!"
        authorName="Workshop Participant"
        authorTitle="Beginner Flower Arranging"
        authorImage="/assets/images/person_1.jpg"
      />
    </div>
  );
}

export default Workshops;
