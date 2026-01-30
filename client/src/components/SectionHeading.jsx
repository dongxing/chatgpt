function SectionHeading({ title, centered = true }) {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
      <h2 className="text-3xl md:text-4xl font-light text-gray-800 pb-4 inline-block border-b-2 border-pink-500">
        {title}
      </h2>
    </div>
  );
}

export default SectionHeading;
