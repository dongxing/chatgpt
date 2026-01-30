function ProjectCard({ project }) {
  const { title, description, customer_feedback, image_url } = project;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
      <img
        src={image_url || '/assets/images/img_1.jpg'}
        alt={title}
        className="w-full h-56 object-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/assets/images/img_1.jpg';
        }}
      />
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">{description}</p>
        {customer_feedback && (
          <blockquote className="border-l-4 border-pink-500 pl-4 italic text-gray-500">
            <p className="text-sm">"{customer_feedback}"</p>
          </blockquote>
        )}
      </div>
    </div>
  );
}

export default ProjectCard;
