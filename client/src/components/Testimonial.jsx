function Testimonial({ 
  quote = "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.",
  authorName = "James Smith",
  authorTitle = "Happy Customer",
  authorImage = "/assets/images/person_1.jpg"
}) {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-light text-gray-800 pb-4 mb-8 inline-block border-b-2 border-pink-500">
            Customer Testimonial
          </h2>
          <blockquote>
            <p className="text-lg md:text-xl text-gray-600 italic leading-relaxed mb-8">
              "{quote}"
            </p>
            <div className="flex flex-col items-center">
              <img
                src={authorImage}
                alt={authorName}
                className="w-16 h-16 rounded-full mb-4 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect fill="%23e5e7eb" width="64" height="64" rx="32"/><text x="32" y="40" font-size="24" fill="%239ca3af" text-anchor="middle">👤</text></svg>';
                }}
              />
              <span className="text-lg font-semibold text-gray-800">{authorName}</span>
              <span className="text-sm text-gray-500">{authorTitle}</span>
            </div>
          </blockquote>
        </div>
      </div>
    </section>
  );
}

export default Testimonial;
