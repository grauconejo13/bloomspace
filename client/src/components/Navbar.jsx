function Navbar() {
  return (
    <nav
      className="w-full px-8 md:px-12 py-4 sticky top-0 z-50 border-b border-sage-light/20"
      style={{ background: 'rgba(250, 246, 239, 0.82)', backdropFilter: 'blur(14px)' }}
    >
      <div className="w-full flex justify-between items-center">
        <span
          className="font-heading text-xl font-semibold tracking-wide text-moss"
          style={{ textShadow: '0 0 18px rgba(122, 171, 120, 0.4)' }}
        >
          ✿ Bloomspace
        </span>

        <ul className="hidden sm:flex gap-1 list-none m-0 p-0">
          {['Home', 'Garden', 'Plant a Flower', 'About'].map((link) => (
            <li key={link}>
              <a
                href="#"
                className="text-sm font-medium no-underline text-sage-dark/80 hover:text-moss px-4 py-1.5 rounded-full transition-all duration-200 hover:bg-sage-light/20 inline-block"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
