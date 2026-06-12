function Navbar() {
  return (
    <nav className="w-full px-6 py-4 sticky top-0 z-10 bg-cream border-b border-sage-light/30">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <span className="font-heading text-xl font-semibold tracking-wide text-moss">
          🌸 Bloomspace
        </span>

        <ul className="flex gap-8 list-none m-0 p-0">
          {['Home', 'Garden', 'Plant a Flower', 'About'].map((link) => (
            <li key={link}>
              <a
                href="#"
                className="text-sm font-medium no-underline text-sage hover:text-moss transition-colors duration-200"
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
