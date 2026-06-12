function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-cream border-t border-sage-light/30 py-8 px-6 text-center">
      <p className="font-heading text-moss/60 text-sm font-medium">
        🌱 Bloomspace &copy; {currentYear}
      </p>
      <p className="text-sage/50 text-xs mt-1">
        Grow something beautiful, one flower at a time.
      </p>
    </footer>
  );
}

export default Footer;
