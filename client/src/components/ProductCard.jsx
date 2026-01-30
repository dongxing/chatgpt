function ProductCard({ product }) {
  const { name, price, category, image_url } = product;

  return (
    <div className="group block relative overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white">
      <div className="relative overflow-hidden">
        <img
          src={image_url || '/assets/images/img_1.jpg'}
          alt={name}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/assets/images/img_1.jpg';
          }}
        />
        {category && (
          <span className="absolute top-3 left-3 bg-pink-500 text-white text-xs px-3 py-1 rounded-full">
            {category}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-800 mb-2">{name}</h3>
        <p className="text-pink-500 font-semibold text-lg">
          ${parseFloat(price).toFixed(2)}
        </p>
      </div>
    </div>
  );
}

export default ProductCard;
