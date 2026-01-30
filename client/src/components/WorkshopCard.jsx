function WorkshopCard({ workshop }) {
  const { title, description, schedule_date, price, image_url } = workshop;

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative">
        <img
          src={image_url || '/assets/images/img_2.jpg'}
          alt={title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/assets/images/img_2.jpg';
          }}
        />
        {price && (
          <span className="absolute top-3 right-3 bg-pink-500 text-white font-semibold px-3 py-1 rounded-full">
            ${parseFloat(price).toFixed(2)}
          </span>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formatDate(schedule_date)}
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{description}</p>
        <button className="mt-4 w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600 transition-colors duration-300">
          Book Now
        </button>
      </div>
    </div>
  );
}

export default WorkshopCard;
