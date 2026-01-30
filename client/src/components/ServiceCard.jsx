function ServiceCard({ service, variant = 'horizontal' }) {
  const { title, description, image_url } = service;

  if (variant === 'vertical') {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
        <img
          src={image_url || '/assets/images/img_1.jpg'}
          alt={title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/assets/images/img_1.jpg';
          }}
        />
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div 
        className="w-32 h-32 flex-shrink-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${image_url || '/assets/images/img_1.jpg'})` }}
      />
      <div className="p-4 flex-1">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{description}</p>
      </div>
    </div>
  );
}

export default ServiceCard;
