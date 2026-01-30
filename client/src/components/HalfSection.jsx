import { Link } from 'react-router-dom';

function HalfSection({
  title,
  description,
  buttonText = "Read More",
  buttonLink = "#",
  imageUrl = "/assets/images/img_2.jpg",
  imagePosition = "left" // 'left' or 'right'
}) {
  const imageSection = (
    <div 
      className="w-full md:w-1/2 min-h-[400px] bg-cover bg-center"
      style={{ backgroundImage: `url(${imageUrl})` }}
    />
  );

  const textSection = (
    <div className="w-full md:w-1/2 flex items-center">
      <div className="p-8 md:p-12 lg:p-16">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">{title}</h2>
        {Array.isArray(description) ? (
          description.map((para, index) => (
            <p key={index} className="text-gray-600 leading-relaxed mb-4">{para}</p>
          ))
        ) : (
          <p className="text-gray-600 leading-relaxed mb-4">{description}</p>
        )}
        <Link
          to={buttonLink}
          className="inline-block bg-pink-500 text-white px-6 py-3 rounded hover:bg-pink-600 transition-colors duration-300"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );

  return (
    <section className="flex flex-col md:flex-row min-h-[500px]">
      {imagePosition === 'left' ? (
        <>
          {imageSection}
          {textSection}
        </>
      ) : (
        <>
          {textSection}
          {imageSection}
        </>
      )}
    </section>
  );
}

export default HalfSection;
