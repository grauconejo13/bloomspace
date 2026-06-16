import { NavLink } from "react-router-dom";

function Navbar() {
  const linkClass = ({ isActive }) =>
    isActive
      ? "text-moss font-semibold"
      : "text-sage-dark hover:text-moss transition-colors";

  return (
    <nav className="w-full px-6 py-4">
      <div className="flex w-full items-center justify-between">
        <NavLink to="/" className="font-heading text-xl text-moss">
          ✿ Bloomspace
        </NavLink>

        <div className="flex gap-6 text-sm">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/garden" className={linkClass}>
            Garden
          </NavLink>
          <NavLink to="/create" className={linkClass}>
            Plant a Flower
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            About
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
