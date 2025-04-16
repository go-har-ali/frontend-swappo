// import { Link, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { useCart } from "../context/CartContext.jsx";
// import Footer from "./Footer.jsx";
// import Navbar from "./Navbar.jsx";
// import axios from "axios";

// const Home = () => {
//   const navigate = useNavigate();
//   const { addToCart } = useCart();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [products, setProducts] = useState([]);

//   // Fetch products from backend
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/api/products");
//         setProducts(response.data);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };
//     fetchProducts();
//   }, []);

//   // Add item to cart and navigate
//   const handleAddToCart = (product) => {
//     addToCart(product);
//     navigate("/cart");
//   };

//   return (
//     <>
//       <Navbar />

//       <div className="bg-gray-100 min-h-screen">
//         {/* Search Bar */}
//         <div className="bg-white p-4 flex justify-center items-center shadow-md">
//           <input
//             type="text"
//             placeholder="Search for products..."
//             className="border border-gray-300 p-2 w-2/3 sm:w-1/2"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <button className="bg-black text-white px-4 py-2 rounded-r-md hover:bg-gray-700">
//             Search
//           </button>
//         </div>

//         {/* Hero Section */}
//         <div className="bg-gray-100 text-black text-center py-12">
//           <h1 className="text-4xl font-bold">Welcome to Swappo</h1>
//           <p className="text-lg mt-2">
//             Find the best deals on your favorite products!
//           </p>
//           <Link
//             to="/products"
//             className="mt-4 inline-block bg-black text-white px-6 py-2 rounded-md font-semibold hover:bg-gray-800"
//           >
//             Shop Now
//           </Link>
//         </div>

//         {/* Featured Products Section */}
//         <div className="container mx-auto px-4 py-12">
//           <h2 className="text-5xl font-semibold text-center mb-6">
//             Hot Trades
//           </h2>
//           <hr className="border-t-2 border-gray-600 my-6" />

//           {products.length === 0 ? (
//             <p className="text-center text-gray-500">Loading products...</p>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
//               {products.map((product) => (
//                 <div
//                   key={product._id}
//                   className="bg-white shadow-md rounded-lg p-4 text-center"
//                 >
//                   <img
//                     src={product.img}
//                     alt={product.name}
//                     className="mx-auto mb-3 h-40 w-auto object-contain"
//                   />
//                   <h3 className="text-lg font-bold">{product.name}</h3>
//                   <p className="text-gray-600">${product.price.toFixed(2)}</p>
//                   <button
//                     onClick={() => handleAddToCart(product)}
//                     className="mt-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-700"
//                   >
//                     Add to Cart
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         <Footer />
//       </div>
//     </>
//   );
// };

// export default Home;

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import Footer from "./Footer.jsx";
import Navbar from "./Navbar.jsx";

const Home = () => {
  const navigate = useNavigate();
  const { cart, addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    savedCart.forEach((item) => addToCart(item));
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    navigate("/cart");
  };

  const products = [
    { id: 1, name: "Product 1", price: "$99.99", img: "product1.jpg" },
    { id: 2, name: "Product 2", price: "$79.99", img: "product2.jpg" },
    { id: 3, name: "Product 3", price: "$59.99", img: "product3.jpg" },
    { id: 4, name: "Product 4", price: "$49.99", img: "Sports_Trade.png" },
  ];

  return (
    <>
      <Navbar />

      <div className="bg-gray-100 min-h-screen">
        {/* Search Bar */}
        <div className="bg-white p-4 flex justify-center items-center shadow-md">
          {/* Categories Dropdown */}
          <select className="border border-gray-300 p-2 rounded-l-md bg-white text-gray-700">
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="fashion">Fashion</option>
            <option value="home">Home & Furniture</option>
            <option value="sports">Sports & Outdoors</option>
            <option value="toys">Toys & Games</option>
          </select>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search for products..."
            className="border border-gray-300 p-2 w-2/3 sm:w-1/2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Search Button */}
          <button className="bg-black text-white px-4 py-2 rounded-r-md hover:bg-gray-700">
            Search
          </button>
        </div>

        {/* 📽️ Intro Video Section */}
        <div className="w-full py-12 bg-gray-100">
          {/* <hr className="border-gray-300 my-4" /> */}

          <div className="w-full">
            <video
              className="w-full h-auto rounded-none"
              autoPlay
              loop
              muted
              controls
            >
              <source src="Swappo_Home_Intro.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gray-100 text-black text-center py-12">
          <h1 className="text-4xl font-bold">Welcome to Swappo</h1>
          <p className="text-lg mt-2">
            Find the best deals on your favorite products!
          </p>
          <Link
            to="/products"
            className="mt-4 inline-block bg-black text-white px-6 py-2 rounded-md font-semibold hover:bg-gray-800"
          >
            Shop Now
          </Link>
        </div>

        {/* Trade Section */}
        <div className="bg-gray-100 text-black text-center py-8 flex justify-center items-center gap-10">
          <div className="text-center">
            <div className="w-0 h-0 border-l-32 border-l-transparent border-r-32 border-r-transparent border-b-40 border-b-red-500 mx-auto"></div>

            <button className="bg-black mt-2 text-white px-8 py-3 text-lg rounded-md font-semibold border border-black">
              Trade Up
            </button>

            <p className="mt-2 text-xl font-semibold">Higher Value</p>
          </div>
          <img src="exchange.jpg" alt="Trade Illustration" className="h-32" />
          <div className="text-center">
            <p className="mb-2 text-xl font-semibold">Lower Value</p>
            <button className="bg-black text-white px-8 py-3 text-lg rounded-md mb-2 font-semibold border border-black">
              Trade In
            </button>
            <div className="w-0 h-0 border-l-32 border-l-transparent border-r-32 border-r-transparent border-t-40 border-t-red-500 mx-auto"></div>
          </div>
        </div>

        {/* Featured Products Section */}
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-5xl font-semibold text-center mb-6">
            Hot Trades
          </h2>
          <hr className="border-t-2 border-gray-600 my-6" />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white shadow-md rounded-lg p-4 text-center"
              >
                <img
                  src={product.img}
                  alt={product.name}
                  className="mx-auto mb-3 h-40 w-auto object-contain"
                />
                <h3 className="text-lg font-bold">{product.name}</h3>
                <p className="text-gray-600">{product.price}</p>

                <div className="flex justify-center gap-3 mt-3">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-black text-white px-4 py-2 rounded hover:bg-gray-700"
                  >
                    Buy Now
                  </button>
                  <button
                    onClick={() => navigate(`/trade/${product.id}`)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Trade
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Home;

// {products.map((product) => (
//   <div
//     key={product.id}
//     className="bg-white shadow-md rounded-lg p-4 text-center"
//   >
//     <img
//       src={product.img}
//       alt={product.name}
//       className="mx-auto mb-3 h-40 w-auto object-contain"
//     />
//     <h3 className="text-lg font-bold">{product.name}</h3>
//     <p className="text-gray-600">{product.price}</p>
//     <button
//       onClick={() => handleAddToCart(product)}
//       className="mt-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-700"
//     >
//       Add to Cart
//     </button>
//   </div>
// ))}

// import { Link, useNavigate } from "react-router-dom";
// import { useEffect } from "react";
// import { useCart } from "../context/CartContext.jsx";
// import Footer from "./Footer.jsx";

// const Home = () => {
//   const navigate = useNavigate();
//   const { cart, addToCart } = useCart();

//   useEffect(() => {
//     const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
//     savedCart.forEach((item) => addToCart(item));
//   }, []);

//   const handleAddToCart = (product) => {
//     addToCart(product);
//     navigate("/cart");
//   };

//   const products = [
//     { id: 1, name: "Product 1", price: "$99.99", img: "product1.jpg" },
//     { id: 2, name: "Product 2", price: "$79.99", img: "product2.jpg" },
//     { id: 3, name: "Product 3", price: "$59.99", img: "product3.jpg" },
//     { id: 4, name: "Product 4", price: "$49.99", img: "Sports_Trade.png" },
//   ];

//   return (
//     <div className="bg-gray-100 min-h-screen">
//       {/* Trade Section */}
//       <div className="bg-black text-white text-center py-8 flex justify-center items-center gap-10">
//         <div className="text-center">
//           <div className="bg-red-500 p-2 inline-block rounded-t-md"></div>
//           <button className="bg-black text-white px-6 py-2 rounded-md font-semibold border border-white mt-2">
//             Trade Up
//           </button>
//           <p className="mt-2">Higher Value</p>
//         </div>
//         <img src="image.png" alt="Trade Illustration" className="h-32" />
//         <div className="text-center">
//           <div className="bg-red-500 p-2 inline-block rounded-b-md"></div>
//           <button className="bg-black text-white px-6 py-2 rounded-md font-semibold border border-white mt-2">
//             Trade In
//           </button>
//           <p className="mt-2">Lower Value</p>
//         </div>
//       </div>

//       {/* Hero Section */}
//       <div className="bg-black text-white text-center py-16">
//         <h1 className="text-4xl font-bold">Welcome to Swappo</h1>
//         <p className="text-lg mt-2">
//           Find the best deals on your favorite products!
//         </p>
//         <Link
//           to="/products"
//           className="mt-4 inline-block bg-white text-black px-6 py-2 rounded-md font-semibold hover:bg-gray-200"
//         >
//           Shop Now
//         </Link>
//       </div>
//       {/* 📽️ Intro Video Section */}
//       <div className="container mx-auto px-4 py-12">
//         <h2 className="text-2xl font-semibold text-center mb-4">
//           Explore Swappo
//         </h2>
//         <div className="flex justify-center">
//           <video
//             className="w-full md:w-3/4 rounded-lg shadow-lg"
//             autoPlay
//             loop
//             muted
//             controls
//           >
//             <source src="Swappo_Home_Intro.mp4" type="video/mp4" />
//             Your browser does not support the video tag.
//           </video>
//         </div>
//       </div>

//       {/* Featured Products Section */}
//       <div className="container mx-auto px-4 py-12">
//         <h2 className="text-2xl font-semibold text-center mb-6">
//           Featured Products
//         </h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
//           {products.map((product) => (
//             <div
//               key={product.id}
//               className="bg-white shadow-md rounded-lg p-4 text-center"
//             >
//               <img
//                 src={product.img}
//                 alt={product.name}
//                 className="mx-auto mb-3 h-40 w-auto object-contain"
//               />
//               <h3 className="text-lg font-bold">{product.name}</h3>
//               <p className="text-gray-600">{product.price}</p>
//               <button
//                 onClick={() => handleAddToCart(product)}
//                 className="mt-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-700"
//               >
//                 Add to Cart
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Home;

// import { Link, useNavigate } from "react-router-dom";
// import { useEffect } from "react";
// import { useCart } from "../context/CartContext.jsx"; // Import the cart context
// import Footer from "./Footer.jsx";
// const Home = () => {
//   const navigate = useNavigate();
//   const { cart, addToCart } = useCart(); // Get cart and addToCart from context

//   // Load cart from localStorage on component mount
//   useEffect(() => {
//     const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
//     savedCart.forEach((item) => addToCart(item)); // Add saved items to context
//   }, []);

//   const handleAddToCart = (product) => {
//     addToCart(product); // Update the cart context
//     //localStorage.setItem("cart", JSON.stringify([...cart, product])); // Sync with localStorage
//     navigate("/cart"); // Redirect to cart page
//   };

//   const products = [
//     { id: 1, name: "Product 1", price: "$99.99", img: "product1.jpg" },
//     { id: 2, name: "Product 2", price: "$79.99", img: "product2.jpg" },
//     { id: 3, name: "Product 3", price: "$59.99", img: "product3.jpg" },
//     { id: 4, name: "Product 4", price: "$49.99", img: "Sports_Trade.png" },
//   ];

//   return (
//     <div className="bg-gray-100 min-h-screen">
//       {/* Hero Section */}
//       <div className="bg-blue-600 text-white text-center py-16">
//         <h1 className="text-4xl font-bold">Welcome to Swappo</h1>
//         <p className="text-lg mt-2">
//           Find the best deals on your favorite products!
//         </p>
//         <Link
//           to="/products"
//           className="mt-4 inline-block bg-white text-blue-600 px-6 py-2 rounded-md font-semibold hover:bg-gray-200"
//         >
//           Shop Now
//         </Link>
//       </div>

//       {/* 📽️ Intro Video Section */}
//       <div className="container mx-auto px-4 py-12">
//         <h2 className="text-2xl font-semibold text-center mb-4">
//           Explore Swappo
//         </h2>
//         <div className="flex justify-center">
//           <video
//             className="w-full md:w-3/4 rounded-lg shadow-lg"
//             autoPlay
//             loop
//             muted
//             controls
//           >
//             <source src="Swappo_Home_Intro.mp4" type="video/mp4" />
//             Your browser does not support the video tag.
//           </video>
//         </div>
//       </div>

//       {/* Featured Products Section */}
//       <div className="container mx-auto px-4 py-12">
//         <h2 className="text-2xl font-semibold text-center mb-6">
//           Featured Products
//         </h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
//           {products.map((product) => (
//             <div
//               key={product.id}
//               className="bg-white shadow-md rounded-lg p-4 text-center"
//             >
//               <img
//                 src={product.img}
//                 alt={product.name}
//                 className="mx-auto mb-3 h-40 w-auto object-contain"
//               />
//               <h3 className="text-lg font-bold">{product.name}</h3>
//               <p className="text-gray-600">{product.price}</p>
//               <button
//                 onClick={() => handleAddToCart(product)}
//                 className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//               >
//                 Add to Cart
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Home;

// import { Link, useNavigate } from "react-router-dom";

// const Home = () => {
//   const navigate = useNavigate(); // 🔹 Initialize navigation

//   const handleAddToCart = (productId) => {
//     // Redirect to the cart page when the button is clicked
//     navigate("/cart");
//   };

//   return (
//     <div className="bg-gray-100 min-h-screen">
//       {/* Hero Section */}
//       <div className="bg-blue-600 text-white text-center py-16">
//         <h1 className="text-4xl font-bold">Welcome to Swappo</h1>
//         <p className="text-lg mt-2">
//           Find the best deals on your favorite products!
//         </p>
//         <Link
//           to="/products"
//           className="mt-4 inline-block bg-white text-blue-600 px-6 py-2 rounded-md font-semibold hover:bg-gray-200"
//         >
//           Shop Now
//         </Link>
//       </div>

//       {/* 📽️ Intro Video Section */}
//       <div className="container mx-auto px-4 py-12">
//         <h2 className="text-2xl font-semibold text-center mb-4">
//           Explore Swappo
//         </h2>
//         <div className="flex justify-center">
//           <video
//             className="w-full md:w-3/4 rounded-lg shadow-lg"
//             autoPlay
//             loop
//             muted
//             controls
//           >
//             <source src="Swappo_Home_Intro.mp4" type="video/mp4" />
//             Your browser does not support the video tag.
//           </video>
//         </div>
//       </div>

//       {/* Featured Products Section */}
//       <div className="container mx-auto px-4 py-12">
//         <h2 className="text-2xl font-semibold text-center mb-6">
//           Featured Products
//         </h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
//           {/* Sample Product Cards */}
//           {[
//             { id: 1, name: "Product 1", price: "$99.99", img: "product1.jpg" },
//             { id: 2, name: "Product 2", price: "$79.99", img: "product2.jpg" },
//             { id: 3, name: "Product 3", price: "$59.99", img: "product3.jpg" },
//             {
//               id: 4,
//               name: "Product 4",
//               price: "$49.99",
//               img: "Sports_Trade.png",
//             },
//           ].map((product) => (
//             <div
//               key={product.id}
//               className="bg-white shadow-md rounded-lg p-4 text-center"
//             >
//               <img
//                 src={product.img}
//                 alt={product.name}
//                 className="mx-auto mb-3 h-40 w-auto object-contain"
//               />
//               <h3 className="text-lg font-bold">{product.name}</h3>
//               <p className="text-gray-600">{product.price}</p>
//               <button
//                 onClick={() => handleAddToCart(product.id)}
//                 className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//               >
//                 Add to Cart
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;

// import { Link } from "react-router-dom";

// const Home = () => {
//   return (
//     <div className="bg-gray-100 min-h-screen">
//       {/* Hero Section */}
//       <div className="bg-blue-600 text-white text-center py-16">
//         <h1 className="text-4xl font-bold">Welcome to Swappo</h1>
//         <p className="text-lg mt-2">
//           Find the best deals on your favorite products!
//         </p>
//         <Link
//           to="/products"
//           className="mt-4 inline-block bg-white text-blue-600 px-6 py-2 rounded-md font-semibold hover:bg-gray-200"
//         >
//           Shop Now
//         </Link>
//       </div>

//       {/* Featured Products Section */}
//       <div className="container mx-auto px-4 py-12">
//         <h2 className="text-2xl font-semibold text-center mb-6">
//           Featured Products
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {/* Sample Product Cards */}
//           <div className="bg-white shadow-md rounded-lg p-4 text-center">
//             <img src="product1.jpg" alt="Product" className="mx-auto mb-3" />
//             <h3 className="text-lg font-bold">Product 1</h3>
//             <p className="text-gray-600">$99.99</p>
//             <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
//               Add to Cart
//             </button>
//           </div>
//           <div className="bg-white shadow-md rounded-lg p-4 text-center">
//             <img src="product2.jpg" alt="Product" className="mx-auto mb-3" />
//             <h3 className="text-lg font-bold">Product 2</h3>
//             <p className="text-gray-600">$79.99</p>
//             <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
//               Add to Cart
//             </button>
//           </div>
//           <div className="bg-white shadow-md rounded-lg p-4 text-center">
//             <img src="product3.jpg" alt="Product" className="mx-auto mb-3" />
//             <h3 className="text-lg font-bold">Product 3</h3>
//             <p className="text-gray-600">$59.99</p>
//             <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
//               Add to Cart
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;
