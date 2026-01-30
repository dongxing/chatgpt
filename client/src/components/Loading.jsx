function Loading({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-pink-500 rounded-full animate-spin mb-4"></div>
      <p className="text-gray-500">{text}</p>
    </div>
  );
}

export default Loading;
