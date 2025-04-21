import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { useCart } from "../context/CartContext";
import { jwtDecode } from "jwt-decode";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    images: [],
    owner: "user-id-here",
  });

  const productsPerPage = 7;
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://swappo-6zd6.onrender.com";

  const fetchAllProducts = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      console.log("Token in Products Page:", token);

      const publicRes = await fetch(`${BASE_URL}/api/products`);
      const publicData = await publicRes.json();

      let inventoryData = [];

      if (token) {
        const inventoryRes = await fetch(`${BASE_URL}/api/products/inventory`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (inventoryRes.ok) {
          inventoryData = await inventoryRes.json();
          console.log(
            "Fetched inventory data in Products page:",
            inventoryData
          );
        } else {
          const errorData = await inventoryRes.text();
          console.error(
            "Inventory fetch failed:",
            inventoryRes.status,
            errorData
          );
        }
      }

      const combined = [...publicData, ...inventoryData];
      const uniqueProducts = Array.from(
        new Map(combined.map((p) => [p._id, p])).values()
      );

      setProducts(uniqueProducts);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    console.log("Token:", token); // Debugging output

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken); // Debugging output
        if (decodedToken.userId) {
          setNewProduct((prev) => ({ ...prev, owner: decodedToken.userId })); // Set owner
        } else {
          console.error("UserId not found in token payload");
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token"); // Remove invalid token
      }
    }
  }, []);

  console.log("All combined products:", products);

  // const filteredProducts = products.filter(
  //   (product) =>
  //     product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
  //     (category === "All" || product.category === category)
  // );

  const filteredProducts = products;

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const displayedProducts = filteredProducts.slice(startIndex, endIndex);

  console.log("Displayed Products:", displayedProducts);

  const handleAddToCart = (product) => {
    addToCart(product);
    navigate("/cart");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // Retrieve token

    if (!token) {
      alert("User is not authenticated. Please log in.");
      return;
    }

    try {
      console.log("I am in try block");
      const response = await fetch(`${BASE_URL}/api/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      console.log("posted successfully!");

      const data = await response.json(); // ✅ Parse the response

      console.log("response dikh jaa...", data);

      if (!response.ok)
        throw new Error(data.error || "Failed to create product");

      console.log("🎉 Product created:", data);

      //const createdProduct = await response.json();
      setProducts([...products, data.product]);
      setShowForm(false);
      setNewProduct({
        name: "",
        description: "",
        price: "",
        images: [],
        owner: "",
      });
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // Retrieve token

    if (!token) {
      alert("User is not authenticated. Please log in.");
      return;
    }

    console.log("Selected Product Before Update:", selectedProduct); // Debugging output

    if (!selectedProduct.owner) {
      console.error("Error: Owner ID is missing");
      alert("Owner ID is missing. Please refresh and try again.");
      return;
    }

    // ✅ Ensure owner is a string
    const ownerId =
      typeof selectedProduct.owner === "object"
        ? selectedProduct.owner._id
        : selectedProduct.owner;

    const formData = new FormData();
    formData.append("name", selectedProduct.name);
    formData.append("description", selectedProduct.description);
    formData.append("price", selectedProduct.price);
    formData.append("owner", ownerId);

    for (let i = 0; i < selectedProduct.images.length; i++) {
      formData.append("images", selectedProduct.images[i]);
    }

    try {
      const response = await fetch(
        `${BASE_URL}/api/products/${selectedProduct._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
      console.log("Response from Server:", data);

      if (!response.ok) throw new Error(data.error || "Failed to update");

      setProducts(products.map((p) => (p._id === data._id ? data : p)));
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-white text-black min-h-screen p-6 flex flex-col items-center">
        <div className="text-center w-full mb-6">
          <h1 className="text-3xl font-bold text-black">
            Explore Our Products
          </h1>
        </div>

        {/* Inventory Button */}
        <button
          onClick={() => navigate("/inventory")}
          className="mt-4 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          Manage Inventory
        </button>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {displayedProducts.length > 0 ? (
            displayedProducts.map((product) => (
              <motion.div
                key={product._id}
                className="bg-gray-100 text-black p-4 rounded-lg shadow-md flex flex-col items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img
                  src={
                    product.images && product.images.length > 0
                      ? `${BASE_URL}/uploads/${product.images[0]}`
                      : "https://via.placeholder.com/150" // Default placeholder image
                  }
                  alt={product.name}
                  className="h-32 w-auto object-contain mb-3"
                />
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-600">${product.price}</p>
                <div className="flex justify-center gap-3 mt-3">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-black text-white px-4 py-2 rounded hover:bg-gray-700"
                  >
                    Buy Now
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      console.log("Navigating to:", `/trade/${product._id}`);
                      navigate(`/trade/${product._id}`);
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Trade
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No products found.
            </p>
          )}
        </motion.div>
        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-6 gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${
              currentPage === 1
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded ${
                  currentPage === page
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            Next
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Products;

// `https://swappo-6zd6.onrender.com/uploads/${product.images[0]}`

// useEffect(() => {
//   const fetchAllProducts = async () => {
//     try {
//       setLoading(true);

//       const token = localStorage.getItem("token");

//       // Public Products
//       const publicRes = await fetch(`${BASE_URL}/api/products`);
//       const publicData = await publicRes.json();

//       let inventoryData = [];

//       if (token) {
//         const inventoryRes = await fetch(
//           `${BASE_URL}/api/products/inventory`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         if (inventoryRes.ok) {
//           inventoryData = await inventoryRes.json();
//         }
//       }

//       // Combine both
//       const combined = [...publicData, ...inventoryData];

//       // Remove duplicates (optional)
//       const uniqueProducts = Array.from(
//         new Map(combined.map((p) => [p._id, p])).values()
//       );

//       setProducts(uniqueProducts);
//     } catch (err) {
//       console.error("Error fetching products:", err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchAllProducts();
// }, []);

// useEffect(() => {
//   const fetchProducts = async () => {
//     try {
//       setLoading(true);

//       const token = localStorage.getItem("token"); // Get token from localStorage
//       const response = await fetch(`${BASE_URL}/api/products`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) throw new Error("Failed to fetch products");
//       const data = await response.json();
//       setProducts(data);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };
//   fetchProducts();
// }, []);

// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import Footer from "./Footer";
// import Navbar from "./Navbar";
// import { useCart } from "../context/CartContext";

// const Products = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [category, setCategory] = useState("All");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [products, setProducts] = useState([]);
//   const [showForm, setShowForm] = useState(false); // Toggle for form
//   const [newProduct, setNewProduct] = useState({
//     name: "",
//     description: "",
//     price: "",
//     images: [],
//     owner: "user-id-here", // Replace with dynamic user ID if applicable
//   });

//   const productsPerPage = 7;
//   const { addToCart } = useCart();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/api/products");
//         const data = await response.json();
//         setProducts(data);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };
//     fetchProducts();
//   }, []);

//   const categories = ["All", "Electronics", "Accessories", "Fashion"];

//   const filteredProducts = products.filter(
//     (product) =>
//       product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
//       (category === "All" || product.category === category)
//   );

//   const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
//   const startIndex = (currentPage - 1) * productsPerPage;
//   const endIndex = startIndex + productsPerPage;
//   const displayedProducts = filteredProducts.slice(startIndex, endIndex);

//   const handleAddToCart = (product) => {
//     addToCart(product);
//     navigate("/cart");
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("name", newProduct.name);
//     formData.append("description", newProduct.description);
//     formData.append("price", newProduct.price);
//     formData.append("owner", newProduct.owner);

//     for (let i = 0; i < newProduct.images.length; i++) {
//       formData.append("images", newProduct.images[i]);
//     }

//     try {
//       const response = await fetch("http://localhost:5000/api/products", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) throw new Error("Failed to create product");

//       const createdProduct = await response.json();
//       setProducts([...products, createdProduct]); // Update UI
//       setShowForm(false);
//       setNewProduct({
//         name: "",
//         description: "",
//         price: "",
//         images: [],
//         owner: "user-id-here",
//       });
//     } catch (error) {
//       console.error("Error creating product:", error);
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="bg-white text-black min-h-screen p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold text-black">
//             Explore Our Products
//           </h1>
//           <button
//             onClick={() => setShowForm(true)}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-800"
//           >
//             Create Product
//           </button>
//         </div>

//         <motion.div
//           className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.6 }}
//         >
//           {displayedProducts.length > 0 ? (
//             displayedProducts.map((product) => (
//               <motion.div
//                 key={product._id}
//                 className="bg-gray-100 text-black p-4 rounded-lg shadow-md flex flex-col items-center"
//                 whileHover={{ scale: 1.05 }}
//                 transition={{ type: "spring", stiffness: 300 }}
//               >
//                 <img
//                   src={`http://localhost:5000/uploads/${product.images[0]}`}
//                   alt={product.name}
//                   className="h-32 w-auto object-contain mb-3"
//                 />
//                 <h3 className="text-lg font-semibold">{product.name}</h3>
//                 <p className="text-gray-600">${product.price}</p>
//                 <button
//                   onClick={() => handleAddToCart(product)}
//                   className="mt-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
//                 >
//                   Add to Cart
//                 </button>
//               </motion.div>
//             ))
//           ) : (
//             <p className="text-center text-gray-500 col-span-full">
//               No products found.
//             </p>
//           )}
//         </motion.div>
//       </div>

//       {showForm && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white p-6 rounded-lg w-96">
//             <h2 className="text-xl font-bold mb-4">Create Product</h2>
//             <form onSubmit={handleSubmit}>
//               <input
//                 type="text"
//                 placeholder="Name"
//                 required
//                 className="w-full p-2 border mb-2"
//                 onChange={(e) =>
//                   setNewProduct({ ...newProduct, name: e.target.value })
//                 }
//               />
//               <textarea
//                 placeholder="Description"
//                 required
//                 className="w-full p-2 border mb-2"
//                 onChange={(e) =>
//                   setNewProduct({ ...newProduct, description: e.target.value })
//                 }
//               />
//               <input
//                 type="number"
//                 placeholder="Price"
//                 required
//                 className="w-full p-2 border mb-2"
//                 onChange={(e) =>
//                   setNewProduct({ ...newProduct, price: e.target.value })
//                 }
//               />
//               <input
//                 type="file"
//                 multiple
//                 required
//                 className="w-full p-2 border mb-2"
//                 onChange={(e) =>
//                   setNewProduct({ ...newProduct, images: e.target.files })
//                 }
//               />
//               <button
//                 type="submit"
//                 className="bg-blue-600 text-white w-full p-2 rounded-lg hover:bg-blue-800"
//               >
//                 Submit
//               </button>
//             </form>
//             <button
//               onClick={() => setShowForm(false)}
//               className="mt-2 text-red-600"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}

//       <Footer />
//     </>
//   );
// };

// export default Products;

// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import Footer from "./Footer";
// import Navbar from "./Navbar";
// import { useCart } from "../context/CartContext";

// const Products = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [category, setCategory] = useState("All");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [products, setProducts] = useState([]);
//   const productsPerPage = 7;

//   const { addToCart } = useCart();
//   const navigate = useNavigate();

//   // Fetch Products from API
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/api/products");
//         const data = await response.json();
//         setProducts(data);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const categories = ["All", "Electronics", "Accessories", "Fashion"];

//   const filteredProducts = products.filter(
//     (product) =>
//       product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
//       (category === "All" || product.category === category)
//   );

//   const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
//   const startIndex = (currentPage - 1) * productsPerPage;
//   const endIndex = startIndex + productsPerPage;
//   const displayedProducts = filteredProducts.slice(startIndex, endIndex);

//   const handleAddToCart = (product) => {
//     addToCart(product);
//     navigate("/cart");
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="bg-white text-black min-h-screen p-6">
//         <h1 className="text-3xl font-bold text-center text-black mb-6">
//           Explore Our Products
//         </h1>

//         <motion.div
//           className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.6 }}
//         >
//           {displayedProducts.length > 0 ? (
//             displayedProducts.map((product) => (
//               <motion.div
//                 key={product._id}
//                 className="bg-gray-100 text-black p-4 rounded-lg shadow-md flex flex-col items-center"
//                 whileHover={{ scale: 1.05 }}
//                 transition={{ type: "spring", stiffness: 300 }}
//               >
//                 <img
//                   src={`http://localhost:5000${product.images[0]}`}
//                   alt={product.name}
//                   className="h-32 w-auto object-contain mb-3"
//                 />
//                 <h3 className="text-lg font-semibold">{product.name}</h3>
//                 <p className="text-gray-600">${product.price}</p>
//                 <button
//                   onClick={() => handleAddToCart(product)}
//                   className="mt-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
//                 >
//                   Add to Cart
//                 </button>
//               </motion.div>
//             ))
//           ) : (
//             <p className="text-center text-gray-500 col-span-full">
//               No products found.
//             </p>
//           )}
//         </motion.div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default Products;

// import { useState } from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom"; // Import useNavigate
// import Footer from "./Footer";
// import Navbar from "./Navbar";
// import { useCart } from "../context/CartContext"; // Import useCart

// const Products = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [category, setCategory] = useState("All");
//   const [currentPage, setCurrentPage] = useState(1);
//   const productsPerPage = 7;

//   const { addToCart } = useCart(); // Use addToCart from context
//   const navigate = useNavigate(); // Initialize navigate function

//   const products = [
//     {
//       id: 1,
//       name: "Laptop",
//       price: 999,
//       category: "Electronics",
//       img: "product1.jpg",
//     },
//     {
//       id: 2,
//       name: "Smartphone",
//       price: 799,
//       category: "Electronics",
//       img: "product2.jpg",
//     },
//     {
//       id: 3,
//       name: "Headphones",
//       price: 199,
//       category: "Accessories",
//       img: "product3.jpg",
//     },
//     {
//       id: 4,
//       name: "Running Shoes",
//       price: 120,
//       category: "Fashion",
//       img: "Sports_Trade.png",
//     },
//     {
//       id: 5,
//       name: "Smartwatch",
//       price: 250,
//       category: "Electronics",
//       img: "product3.jpg",
//     },
//     {
//       id: 6,
//       name: "Backpack",
//       price: 80,
//       category: "Accessories",
//       img: "Sports_Trade.png",
//     },
//     {
//       id: 7,
//       name: "Gaming Mouse",
//       price: 50,
//       category: "Accessories",
//       img: "product2.jpg",
//     },
//     {
//       id: 8,
//       name: "Bluetooth Speaker",
//       price: 150,
//       category: "Electronics",
//       img: "product1.jpg",
//     },
//   ];

//   const categories = ["All", "Electronics", "Accessories", "Fashion"];

//   const filteredProducts = products.filter(
//     (product) =>
//       product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
//       (category === "All" || product.category === category)
//   );

//   const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
//   const startIndex = (currentPage - 1) * productsPerPage;
//   const endIndex = startIndex + productsPerPage;
//   const displayedProducts = filteredProducts.slice(startIndex, endIndex);

//   // Function to handle adding to cart and navigating
//   const handleAddToCart = (product) => {
//     addToCart(product);
//     navigate("/cart"); // Navigate to cart page
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="bg-white text-black min-h-screen p-6">
//         <h1 className="text-3xl font-bold text-center text-black mb-6">
//           Explore Our Products
//         </h1>

//         <div className="flex flex-col md:flex-row justify-between items-center mb-6">
//           <div className="flex w-full md:w-1/3 border border-gray-300 rounded-md overflow-hidden">
//             <input
//               type="text"
//               placeholder="Search products..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="p-2 w-full outline-none"
//             />
//             <button className="bg-black text-white px-4 py-2 hover:bg-gray-800 transition">
//               🔍
//             </button>
//           </div>

//           <select
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             className="p-2 border border-gray-300 rounded-md w-full md:w-1/4 mt-3 md:mt-0"
//           >
//             {categories.map((cat) => (
//               <option key={cat} value={cat}>
//                 {cat}
//               </option>
//             ))}
//           </select>
//         </div>

//         <motion.div
//           className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.6 }}
//         >
//           {displayedProducts.length > 0 ? (
//             displayedProducts.map((product) => (
//               <motion.div
//                 key={product.id}
//                 className="bg-gray-100 text-black p-4 rounded-lg shadow-md flex flex-col items-center"
//                 whileHover={{ scale: 1.05 }}
//                 transition={{ type: "spring", stiffness: 300 }}
//               >
//                 <img
//                   src={product.img}
//                   alt={product.name}
//                   className="h-32 w-auto object-contain mb-3"
//                 />
//                 <h3 className="text-lg font-semibold">{product.name}</h3>
//                 <p className="text-gray-600">${product.price}</p>
//                 <button
//                   onClick={() => handleAddToCart(product)} // Call handleAddToCart
//                   className="mt-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
//                 >
//                   Add to Cart
//                 </button>
//               </motion.div>
//             ))
//           ) : (
//             <p className="text-center text-gray-500 col-span-full">
//               No products found.
//             </p>
//           )}
//         </motion.div>

//         {filteredProducts.length > productsPerPage && (
//           <div className="flex justify-center mt-6 space-x-4">
//             <button
//               onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//               className={`px-4 py-2 rounded ${
//                 currentPage === 1
//                   ? "bg-gray-300 cursor-not-allowed"
//                   : "bg-black text-white hover:bg-gray-800"
//               }`}
//               disabled={currentPage === 1}
//             >
//               Previous
//             </button>
//             <span className="px-4 py-2 bg-gray-200 rounded">
//               Page {currentPage} of {totalPages}
//             </span>
//             <button
//               onClick={() =>
//                 setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//               }
//               className={`px-4 py-2 rounded ${
//                 currentPage === totalPages
//                   ? "bg-gray-300 cursor-not-allowed"
//                   : "bg-black text-white hover:bg-gray-800"
//               }`}
//               disabled={currentPage === totalPages}
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default Products;

// import { useState } from "react";
// import { motion } from "framer-motion";
// import Footer from "./Footer";

// const Products = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [category, setCategory] = useState("All");
//   const [currentPage, setCurrentPage] = useState(1);
//   const productsPerPage = 7; // Set products per page to 8

//   const products = [
//     {
//       id: 1,
//       name: "Laptop",
//       price: "$999",
//       category: "Electronics",
//       img: "product1.jpg",
//     },
//     {
//       id: 2,
//       name: "Smartphone",
//       price: "$799",
//       category: "Electronics",
//       img: "product2.jpg",
//     },
//     {
//       id: 3,
//       name: "Headphones",
//       price: "$199",
//       category: "Accessories",
//       img: "product3.jpg",
//     },
//     {
//       id: 4,
//       name: "Running Shoes",
//       price: "$120",
//       category: "Fashion",
//       img: "Sports_Trade.png",
//     },
//     {
//       id: 5,
//       name: "Smartwatch",
//       price: "$250",
//       category: "Electronics",
//       img: "product3.jpg",
//     },
//     {
//       id: 6,
//       name: "Backpack",
//       price: "$80",
//       category: "Accessories",
//       img: "Sports_Trade.png",
//     },
//     {
//       id: 7,
//       name: "Gaming Mouse",
//       price: "$50",
//       category: "Accessories",
//       img: "product2.jpg",
//     },
//     {
//       id: 8,
//       name: "Bluetooth Speaker",
//       price: "$150",
//       category: "Electronics",
//       img: "product1.jpg",
//     },
//   ];

//   const categories = ["All", "Electronics", "Accessories", "Fashion"];

//   // Filter products based on search term and category
//   const filteredProducts = products.filter(
//     (product) =>
//       product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
//       (category === "All" || product.category === category)
//   );

//   // Pagination logic
//   const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
//   const startIndex = (currentPage - 1) * productsPerPage;
//   const endIndex = startIndex + productsPerPage;
//   const displayedProducts = filteredProducts.slice(startIndex, endIndex);

//   return (
//     <>
//       <div className="bg-white text-black min-h-screen p-6">
//         <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
//           Explore Our Products
//         </h1>

//         {/* Search & Filter Section */}
//         <div className="flex flex-col md:flex-row justify-between items-center mb-6">
//           {/* Search Bar */}
//           <div className="flex w-full md:w-1/3 border border-gray-300 rounded-md overflow-hidden">
//             <input
//               type="text"
//               placeholder="Search products..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="p-2 w-full outline-none"
//             />
//             <button className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition">
//               🔍
//             </button>
//           </div>

//           {/* Category Filter */}
//           <select
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             className="p-2 border border-gray-300 rounded-md w-full md:w-1/4 mt-3 md:mt-0"
//           >
//             {categories.map((cat) => (
//               <option key={cat} value={cat}>
//                 {cat}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Products Grid */}
//         <motion.div
//           className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.6 }}
//         >
//           {displayedProducts.length > 0 ? (
//             displayedProducts.map((product) => (
//               <motion.div
//                 key={product.id}
//                 className="bg-gray-100 text-black p-4 rounded-lg shadow-md flex flex-col items-center"
//                 whileHover={{ scale: 1.05 }}
//                 transition={{ type: "spring", stiffness: 300 }}
//               >
//                 <img
//                   src={product.img}
//                   alt={product.name}
//                   className="h-32 w-auto object-contain mb-3"
//                 />
//                 <h3 className="text-lg font-semibold">{product.name}</h3>
//                 <p className="text-gray-600">{product.price}</p>
//                 <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
//                   Add to Cart
//                 </button>
//               </motion.div>
//             ))
//           ) : (
//             <p className="text-center text-gray-500 col-span-full">
//               No products found.
//             </p>
//           )}
//         </motion.div>

//         {/* Pagination */}
//         {filteredProducts.length > productsPerPage && (
//           <div className="flex justify-center mt-6 space-x-4">
//             <button
//               onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//               className={`px-4 py-2 rounded ${
//                 currentPage === 1
//                   ? "bg-gray-300 cursor-not-allowed"
//                   : "bg-blue-600 text-white hover:bg-blue-700"
//               }`}
//               disabled={currentPage === 1}
//             >
//               Previous
//             </button>
//             <span className="px-4 py-2 bg-gray-200 rounded">
//               Page {currentPage} of {totalPages}
//             </span>
//             <button
//               onClick={() =>
//                 setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//               }
//               className={`px-4 py-2 rounded ${
//                 currentPage === totalPages
//                   ? "bg-gray-300 cursor-not-allowed"
//                   : "bg-blue-600 text-white hover:bg-blue-700"
//               }`}
//               disabled={currentPage === totalPages}
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default Products;

// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import Footer from "./Footer";
// import Navbar from "./Navbar";
// import { useCart } from "../context/CartContext";

// const Products = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [products, setProducts] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const productsPerPage = 7;

//   const { addToCart } = useCart();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch("http://localhost:5000/api/products");
//         if (!response.ok) throw new Error("Failed to fetch products");
//         const data = await response.json();
//         setProducts(data);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProducts();
//   }, []);

//   const totalPages = Math.ceil(products.length / productsPerPage);
//   const startIndex = (currentPage - 1) * productsPerPage;
//   const displayedProducts = products.slice(startIndex, startIndex + productsPerPage);

//   return (
//     <>
//       <Navbar />
//       <div className="bg-white text-black min-h-screen p-6 flex flex-col items-center">
//         <div className="text-center w-full mb-6">
//           <h1 className="text-3xl font-bold">Explore Our Products</h1>
//         </div>

//         {/* Inventory Button */}
//         <button
//           onClick={() => navigate("/inventory")}
//           className="mb-4 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
//         >
//           Manage Inventory
//         </button>

//         {/* Product Grid */}
//         {loading ? (
//           <p>Loading products...</p>
//         ) : error ? (
//           <p className="text-red-500">Error: {error}</p>
//         ) : (
//           <motion.div
//             className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.6 }}
//           >
//             {displayedProducts.length > 0 ? (
//               displayedProducts.map((product) => (
//                 <motion.div
//                   key={product._id}
//                   className="bg-gray-100 text-black p-4 rounded-lg shadow-md flex flex-col items-center"
//                   whileHover={{ scale: 1.05 }}
//                 >
//                   <img
//                     src={
//                       product.images && product.images.length > 0
//                         ? `http://localhost:5000/uploads/${product.images[0]}`
//                         : "https://via.placeholder.com/150"
//                     }
//                     alt={product.name}
//                     className="h-32 w-auto object-contain mb-3"
//                   />
//                   <h3 className="text-lg font-semibold">{product.name}</h3>
//                   <p className="text-gray-600">${product.price}</p>
//                   <button
//                     onClick={() => addToCart(product)}
//                     className="mt-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
//                   >
//                     Add to Cart
//                   </button>
//                 </motion.div>
//               ))
//             ) : (
//               <p className="text-center text-gray-500 col-span-full">No products found.</p>
//             )}
//           </motion.div>
//         )}

//         {/* Pagination */}
//         <div className="mt-6 flex space-x-2">
//           {[...Array(totalPages)].map((_, index) => (
//             <button
//               key={index}
//               onClick={() => setCurrentPage(index + 1)}
//               className={`px-4 py-2 rounded-lg ${
//                 currentPage === index + 1 ? "bg-black text-white" : "bg-gray-200"
//               }`}
//             >
//               {index + 1}
//             </button>
//           ))}
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default Products;

// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import Footer from "./Footer";
// import Navbar from "./Navbar";

// const Products = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch("http://localhost:5000/api/products");
//         if (!response.ok) throw new Error("Failed to fetch products");
//         const data = await response.json();
//         setProducts(data);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProducts();
//   }, []);

//   return (
//     <>
//       <Navbar />
//       <div className="bg-white text-black min-h-screen p-6 flex flex-col items-center">
//         <div className="text-center w-full mb-6">
//           <h1 className="text-3xl font-bold text-black">
//             Explore Our Products
//           </h1>
//         </div>

//         {/* Inventory Button */}
//         <button
//           onClick={() => navigate("/inventory")}
//           className="mb-6 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
//         >
//           Manage Inventory
//         </button>

//         {loading && <p>Loading products...</p>}
//         {error && <p className="text-red-500">{error}</p>}

//         <motion.div
//           className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.6 }}
//         >
//           {products.length > 0 ? (
//             products.map((product) => (
//               <motion.div
//                 key={product._id}
//                 className="bg-gray-100 text-black p-4 rounded-lg shadow-md flex flex-col items-center"
//                 whileHover={{ scale: 1.05 }}
//                 transition={{ type: "spring", stiffness: 300 }}
//               >
//                 <img
//                   src={
//                     product.images && product.images.length > 0
//                       ? `http://localhost:5000/uploads/${product.images[0]}`
//                       : "https://via.placeholder.com/150" // Default placeholder image
//                   }
//                   alt={product.name}
//                   className="h-32 w-auto object-contain mb-3"
//                 />
//                 <h3 className="text-lg font-semibold">{product.name}</h3>
//                 <p className="text-gray-600">${product.price}</p>
//               </motion.div>
//             ))
//           ) : (
//             <p className="text-center text-gray-500 col-span-full">
//               No products found.
//             </p>
//           )}
//         </motion.div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default Products;
