function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <p>Bloomspace © {currentYear}</p>
    </footer>
  );
}

export default Footer;
