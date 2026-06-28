import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="py-10 px-6 text-center relative overflow-hidden"
      style={{ background: 'linear-gradient(to top, #ede0cc, #f2e9d8)' }}
    >
      {/* Decorative divider */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(196, 181, 212, 0.6), transparent)' }}
      />

      <div className="flex items-center justify-center gap-3 mb-2">
        <span className="text-lavender/50 text-xs">✦</span>
        <p className="font-heading text-moss/55 text-sm font-medium">
          Bloomspace &copy; {currentYear}
        </p>
        <span className="text-lavender/50 text-xs">✦</span>
      </div>
      <p className="text-sage-dark/45 text-xs mb-3">
        Grow something beautiful, one flower at a time.
      </p>
      <Link
        to="/about#faq"
        className="text-sage-dark/60 hover:text-moss text-xs font-semibold underline-offset-2 hover:underline transition-colors"
      >
        FAQ
      </Link>
    </footer>
  );
}

export default Footer;
