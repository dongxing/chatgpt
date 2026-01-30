import { Link } from 'react-router-dom';

function Hero({ 
  title = "For your Special Day", 
  subtitle = "",
  buttonText = "Explore More",
  buttonLink = "/products",
  backgroundImage = "/assets/images/bg_1.jpg",
  centered = false
}) {
  // Check if it's an anchor link
  const isAnchorLink = buttonLink.startsWith('#');

  const handleAnchorClick = (e) => {
    if (isAnchorLink) {
      e.preventDefault();
      const element = document.querySelector(buttonLink);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section 
      className="relative min-h-[70vh] flex items-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className={`max-w-3xl ${centered ? 'mx-auto text-center' : ''}`}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-4 leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg md:text-xl text-gray-200 mb-8">
              {subtitle}
            </p>
          )}
          {isAnchorLink ? (
            <a
              href={buttonLink}
              onClick={handleAnchorClick}
              className="inline-block bg-pink-500 text-white font-medium px-8 py-4 rounded uppercase tracking-wider hover:bg-pink-600 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
            >
              {buttonText}
            </a>
          ) : (
            <Link
              to={buttonLink}
              className="inline-block bg-pink-500 text-white font-medium px-8 py-4 rounded uppercase tracking-wider hover:bg-pink-600 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
            >
              {buttonText}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

export default Hero;
