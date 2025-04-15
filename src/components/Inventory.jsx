import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { useCart } from "../context/CartContext";
import { jwtDecode } from "jwt-decode";

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [userId, setUserId] = useState("");
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Fetching Inventory products..."); // Debugging output
        setLoading(true);
        const token = localStorage.getItem("token"); // Get token from localStorage
        console.log("Token In Inventory:", token); // Debugging output
        const response = await fetch(
          "https://swappo-6zd6.onrender.com/api/products/inventory",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        console.log("Fetched Products in Inventory:", data); // Debugging output
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    console.log("Token:", token); // Debugging output

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken); // Debugging output
        if (decodedToken.userId) {
          setUserId(decodedToken.userId);
          setUserRole(decodedToken.role); // assuming the token has a 'role' field
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

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = category === "All" || product.category === category;

    // If user is a vendor, only show their products

    if (userRole === "vendor") {
      const productOwnerId =
        typeof product.owner === "object" ? product.owner._id : product.owner;

      return productOwnerId === userId && matchesSearch && matchesCategory;
    }

    // If user is a client, show nothing
    return false;
  });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const displayedProducts = filteredProducts.slice(startIndex, endIndex);

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

    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("description", newProduct.description);
    formData.append("price", newProduct.price);
    formData.append("owner", newProduct.owner);

    for (let i = 0; i < newProduct.images.length; i++) {
      formData.append("images", newProduct.images[i]);
    }

    try {
      console.log("I am in try block");
      const response = await fetch(
        "https://swappo-6zd6.onrender.com/api/products",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // Attach the token
          },
          body: formData,
        }
      );

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
        `https://swappo-6zd6.onrender.com/api/products/${selectedProduct._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`, // Attach the token
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
        {userRole === "vendor" && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            Create Product
          </button>
        )}

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
                      ? `https://swappo-6zd6.onrender.com/uploads/${product.images[0]}`
                      : "https://via.placeholder.com/150" // Default placeholder image
                  }
                  alt={product.name}
                  className="h-32 w-auto object-contain mb-3"
                />
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-600">${product.price}</p>
                {/* <button
                  onClick={() => handleAddToCart(product)}
                  className="mt-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
                >
                  Add to Cart
                </button> */}
                {/* Edit Product Button */}
                <button
                  onClick={() => {
                    console.log("Product to Edit:", product); // Debugging output
                    setSelectedProduct({
                      ...product,
                      owner: product.owner || newProduct.owner,
                    });
                  }}
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Edit
                </button>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No products found.
            </p>
          )}
        </motion.div>
      </div>
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Create Product</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
              />
              <textarea
                placeholder="Description"
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Price"
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
              />
              <input
                type="file"
                multiple
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    images: Array.from(e.target.files),
                  })
                }
              />
              <button
                type="submit"
                className="bg-black text-white w-full p-3 rounded-lg hover:bg-gray-800"
              >
                Submit
              </button>
            </form>
            <button
              onClick={() => setShowForm(false)}
              className="mt-3 text-red-600 text-center block w-full"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <form onSubmit={handleUpdateProduct} className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={selectedProduct.name}
                className="w-full p-3 border rounded-lg"
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    name: e.target.value,
                  })
                }
              />
              <textarea
                placeholder="Description"
                value={selectedProduct.description}
                className="w-full p-3 border rounded-lg"
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    description: e.target.value,
                  })
                }
              />
              <input
                type="number"
                placeholder="Price"
                value={selectedProduct.price}
                className="w-full p-3 border rounded-lg"
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    price: e.target.value,
                  })
                }
              />
              <input
                type="file"
                multiple
                className="w-full p-3 border rounded-lg"
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    images: Array.from(e.target.files),
                  })
                }
              />
              <button
                type="submit"
                className="bg-black text-white w-full p-3 rounded-lg hover:bg-gray-800"
              >
                Update
              </button>
            </form>
            <button
              onClick={() => setSelectedProduct(null)}
              className="mt-3 text-red-600 text-center block w-full"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default Inventory;
