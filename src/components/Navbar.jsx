import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-black text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/home" className="text-2xl font-bold">
          <img src="Swappo.png" alt="Product" className="mx-auto mb-3" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Link to="/home" className="hover:text-gray-400">
            Home
          </Link>
          <Link to="/products" className="hover:text-gray-400">
            Products
          </Link>
          <Link to="/cart" className="hover:text-gray-400">
            Cart
          </Link>
          <Link
            to="/trade-requests"
            className="text-white hover:text-gray-300 transition"
          >
            Trade Requests
          </Link>
          <Link to="/contact" className="hover:text-gray-400">
            Contact
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center bg-gray-900 py-4 space-y-4">
          <Link
            to="/"
            className="hover:text-gray-400"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/products"
            className="hover:text-gray-400"
            onClick={() => setMenuOpen(false)}
          >
            Products
          </Link>
          <Link
            to="/cart"
            className="hover:text-gray-400"
            onClick={() => setMenuOpen(false)}
          >
            Cart
          </Link>
          <Link
            to="/contact"
            className="hover:text-gray-400"
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { FiMenu, FiX } from "react-icons/fi";

// const Navbar = () => {
//   const [menuOpen, setMenuOpen] = useState(false);

//   return (
//     <nav className="bg-blue-600 text-white p-4 shadow-md">
//       <div className="container mx-auto flex justify-between items-center">
//         {/* Logo */}
//         <Link to="/" className="text-2xl font-bold">
//           <img src="Swappo.png" alt="Product" className="mx-auto mb-3" />
//         </Link>

//         {/* Desktop Menu */}
//         <div className="hidden md:flex space-x-6">
//           <Link to="/" className="hover:text-gray-200">
//             Home
//           </Link>
//           <Link to="/products" className="hover:text-gray-200">
//             Products
//           </Link>
//           <Link to="/cart" className="hover:text-gray-200">
//             Cart
//           </Link>
//           <Link to="/contact" className="hover:text-gray-200">
//             Contact
//           </Link>
//         </div>

//         {/* Mobile Menu Button */}
//         <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
//           {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       {menuOpen && (
//         <div className="md:hidden flex flex-col items-center bg-blue-700 py-4 space-y-4">
//           <Link
//             to="/"
//             className="hover:text-gray-200"
//             onClick={() => setMenuOpen(false)}
//           >
//             Home
//           </Link>
//           <Link
//             to="/products"
//             className="hover:text-gray-200"
//             onClick={() => setMenuOpen(false)}
//           >
//             Products
//           </Link>
//           <Link
//             to="/cart"
//             className="hover:text-gray-200"
//             onClick={() => setMenuOpen(false)}
//           >
//             Cart
//           </Link>
//           <Link
//             to="/contact"
//             className="hover:text-gray-200"
//             onClick={() => setMenuOpen(false)}
//           >
//             Contact
//           </Link>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;
