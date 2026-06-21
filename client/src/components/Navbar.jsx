import { useState } from "react";
import { NavLink } from "react-router-dom";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/garden", label: "Garden" },
  { to: "/create", label: "Plant a Flower" },
  { to: "/about", label: "About" },
];

function Navbar() {
  const [open, setOpen] = useState(false);

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

        <div className="hidden md:flex gap-6 text-sm">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink key={to} to={to} className={linkClass}>
              {label}
            </NavLink>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="md:hidden w-9 h-9 flex items-center justify-center text-xl text-moss cursor-pointer"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-60 opacity-100 mt-3" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-4 text-sm pb-2">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
