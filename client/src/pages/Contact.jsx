import Hero from '../components/Hero';
import SectionHeading from '../components/SectionHeading';
import ContactForm from '../components/ContactForm';
import Testimonial from '../components/Testimonial';

function Contact() {
  return (
    <div>
      {/* Hero Section */}
      <Hero
        title="Get In Touch"
        subtitle="We'd love to hear from you"
        buttonText="Contact Us"
        buttonLink="#contact"
        backgroundImage="/assets/images/bg_1.jpg"
        centered={true}
      />

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <p className="text-gray-600 leading-relaxed mb-8">
                We're here to help make your floral dreams come true. Whether you have questions about our products, 
                services, or want to discuss a custom order, feel free to reach out. Our friendly team is ready to assist you.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <div className="mb-6">
                    <span className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                      <span className="mr-2">✉️</span> Email
                    </span>
                    <a href="mailto:hello@manmanflorist.com" className="text-gray-800 hover:text-pink-500 transition-colors">
                      hello@manmanflorist.com
                    </a>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                      <span className="mr-2">📞</span> Phone
                    </span>
                    <a href="tel:+6591234567" className="text-gray-800 hover:text-pink-500 transition-colors">
                      +65 9123 4567
                    </a>
                  </div>
                </div>
                <div>
                  <div className="mb-6">
                    <span className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                      <span className="mr-2">📠</span> Fax
                    </span>
                    <span className="text-gray-800">+65 6789 0123</span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                      <span className="mr-2">📍</span> Address
                    </span>
                    <span className="text-gray-800">
                      123 Flower Street<br />
                      #04-56 Garden Mall<br />
                      Singapore 123456
                    </span>
                  </div>
                </div>
              </div>

              {/* Opening Hours */}
              <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Opening Hours</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 7:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 AM - 6:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sunday</span>
                    <span>11:00 AM - 5:00 PM</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <Testimonial
        quote="The team at Man Man Florist went above and beyond to create the perfect arrangements for our event. Their attention to detail and customer service is unmatched!"
        authorName="James Smith"
        authorTitle="Satisfied Customer"
        authorImage="/assets/images/person_1.jpg"
      />
    </div>
  );
}

export default Contact;
