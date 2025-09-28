const Luna = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <img
          src="/luna.jpeg"
          alt="Luna"
          className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
        />
        <div className="mt-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🐕 Luna 🐕</h1>
          <p className="text-xl text-gray-600 mb-6">The goodest girl</p>
          <a
            href="https://soundcloud.com/d1ss0c1at1ng"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            🎵 Luna's SoundCloud
          </a>
        </div>
      </div>
    </div>
  );
};

export default Luna;