import { useState } from "react";
import { Link } from "react-router-dom";
export default function Navbar({ user }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="text-xl font-bold text-gray-800">
              My Ticketing App
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link className="text-gray-600 hover:text-gray-900" to="/">
              Home
            </Link>
            <Link className="text-gray-600 hover:text-gray-900" to="/tickets">
              Tickets
            </Link>
            <Link className="text-gray-600 hover:text-gray-900" to="/orders">
              Orders
            </Link>
            {!user && (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
            {user && (
              <>
                <Link
                  to="/logout"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Logout
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <Link className="block text-gray-600 hover:text-gray-900" to="/">
            Home
          </Link>

          <Link
            className="block text-gray-600 hover:text-gray-900"
            to="/tickets"
          >
            Tickets
          </Link>
          <Link
            className="block text-gray-600 hover:text-gray-900"
            to="/orders"
          >
            Orders
          </Link>

          <a
            href="#"
            className="block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Login
          </a>
        </div>
      )}
    </nav>
  );
}
