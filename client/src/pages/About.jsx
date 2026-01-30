import Hero from '../components/Hero';
import HalfSection from '../components/HalfSection';
import Testimonial from '../components/Testimonial';

function About() {
  return (
    <div>
      {/* Hero Section */}
      <Hero
        title="About Us"
        subtitle="Crafting beautiful floral experiences since 2014"
        buttonText="Learn More"
        buttonLink="#story"
        backgroundImage="/assets/images/bg_1.jpg"
        centered={true}
      />

      {/* Our Story */}
      <HalfSection
        title="Our Story"
        description={[
          "Man Man Florist was founded with a simple mission: to bring joy through the beauty of flowers. What started as a small passion project has grown into a full-service floral studio serving customers across Singapore.",
          "Our team of experienced florists brings creativity, expertise, and a genuine love for flowers to every arrangement we create."
        ]}
        buttonText="View Our Work"
        buttonLink="/projects"
        imageUrl="/assets/images/img_2.jpg"
        imagePosition="left"
      />

      <HalfSection
        title="Our Philosophy"
        description={[
          "We believe that flowers have the power to transform spaces and uplift spirits. Every arrangement we create is designed to tell a story and evoke emotion.",
          "We source our flowers from trusted suppliers who share our commitment to quality and sustainability. This ensures that every bouquet we deliver is fresh, vibrant, and long-lasting."
        ]}
        buttonText="Contact Us"
        buttonLink="/contact"
        imageUrl="/assets/images/img_3.jpg"
        imagePosition="right"
      />

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light text-gray-800 pb-4 inline-block border-b-2 border-pink-500">
              Our Values
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Passion</h3>
              <p className="text-gray-600">We pour our hearts into every arrangement, treating each order as a work of art.</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Quality</h3>
              <p className="text-gray-600">We never compromise on the freshness and quality of our flowers and materials.</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Community</h3>
              <p className="text-gray-600">We believe in building lasting relationships with our customers and community.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light text-gray-800 pb-4 inline-block border-b-2 border-pink-500">
              Meet Our Team
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <img 
                src="/assets/images/person_1.jpg" 
                alt="Team Member" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect fill="%23e5e7eb" width="128" height="128" rx="64"/><text x="64" y="80" font-size="48" fill="%239ca3af" text-anchor="middle">👤</text></svg>';
                }}
              />
              <h3 className="text-lg font-semibold text-gray-800">Sarah Chen</h3>
              <p className="text-gray-500">Founder & Lead Florist</p>
            </div>
            <div className="text-center">
              <img 
                src="/assets/images/person_1.jpg" 
                alt="Team Member" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect fill="%23e5e7eb" width="128" height="128" rx="64"/><text x="64" y="80" font-size="48" fill="%239ca3af" text-anchor="middle">👤</text></svg>';
                }}
              />
              <h3 className="text-lg font-semibold text-gray-800">Michael Tan</h3>
              <p className="text-gray-500">Senior Designer</p>
            </div>
            <div className="text-center">
              <img 
                src="/assets/images/person_1.jpg" 
                alt="Team Member" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect fill="%23e5e7eb" width="128" height="128" rx="64"/><text x="64" y="80" font-size="48" fill="%239ca3af" text-anchor="middle">👤</text></svg>';
                }}
              />
              <h3 className="text-lg font-semibold text-gray-800">Emma Lim</h3>
              <p className="text-gray-500">Workshop Instructor</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <Testimonial
        quote="Working with Man Man Florist has been an absolute pleasure. Their team's creativity and professionalism made our wedding day truly magical."
        authorName="Happy Couple"
        authorTitle="Wedding Clients"
        authorImage="/assets/images/person_1.jpg"
      />
    </div>
  );
}

export default About;
