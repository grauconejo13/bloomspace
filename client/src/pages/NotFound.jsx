import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

function NotFound() {
  return (
    <main
      className="flex-1 flex items-center justify-center text-center px-6 py-24"
      style={{ background: 'linear-gradient(to bottom, #faf6ef, #f2e9d8)' }}
    >
      <SEO
        title="Page Not Found"
        description="This page doesn't exist, or has wilted away. Head back to the Bloomspace garden."
        noindex
      />
      <div>
        <p className="text-[10px] font-bold tracking-widest uppercase text-moss/80 mb-4">
          404
        </p>
        <h1 className="font-heading text-4xl md:text-5xl text-moss mb-4">
          This flower has not bloomed yet 🌱
        </h1>
        <p className="text-moss/80 text-sm max-w-sm mx-auto leading-relaxed mb-8">
          The page you&rsquo;re looking for doesn&rsquo;t exist, or has wilted away.
        </p>
        <Link
          to="/garden"
          className="bg-sage text-cream px-8 py-3 rounded-full text-sm font-semibold hover:bg-sage-dark transition-all duration-300 cursor-pointer inline-block"
          style={{ boxShadow: '0 4px 18px rgba(122, 171, 120, 0.42)' }}
        >
          🌼 Back to the Garden
        </Link>
      </div>
    </main>
  );
}

export default NotFound;
