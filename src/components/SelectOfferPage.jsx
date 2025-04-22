import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import socket from "../socket";
import Navbar from "./Navbar";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "https://swappo-6zd6.onrender.com";

// const BASE_URL =
//   window.location.hostname === "localhost"
//     ? "http://localhost:5000"
//     : "https://swappo-6zd6.onrender.com";

const SelectOfferPage = () => {
  const { id } = useParams(); // fallback product id from URL
  const { state } = useLocation();
  const navigate = useNavigate();

  const [requestedProduct, setRequestedProduct] = useState(
    state?.requestedProduct || null
  );
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const fromUserId = localStorage.getItem("userId");

  // 🟡 Fetch requestedProduct if not in state
  useEffect(() => {
    const fetchRequestedProduct = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/products/${id}`);
        if (!res.ok) throw new Error("Failed to load requested product");
        const data = await res.json();
        setRequestedProduct(data);
      } catch (err) {
        console.error(err);
        navigate("/products");
      }
    };

    if (!requestedProduct && id) {
      fetchRequestedProduct();
    } else if (!requestedProduct) {
      navigate("/products");
    }
  }, [id, requestedProduct, navigate]);

  // 🟢 Fetch user's inventory
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/api/products/inventory`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch your inventory");

        const data = await response.json();
        setMyProducts(data);
      } catch (err) {
        console.error("Inventory Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchInventory();
    }
  }, [token]);

  const handleSelectProduct = (offeredProduct) => {
    // const token = localStorage.getItem("token");
    // if (token) {
    //   const decoded = jwt_decode(token);
    //   localStorage.setItem("userId", decoded.userId);
    // }

    // const fromUserId = localStorage.getItem("userId");
    // console.log("🧑 fromUserId:", fromUserId);

    const token = localStorage.getItem("token");
    const userId = token ? jwtDecode(token).userId : null;

    console.log("User ID in Trade Requests Page:", userId);
    console.log("Token in Trade Requests Page :", token);

    if (!requestedProduct) {
      console.warn("No requested product found. Cannot proceed with trade.");
      return;
    }

    const priceDifference = requestedProduct.price - offeredProduct.price;

    const payload = {
      fromUserId: userId, // will be '6803bad9cd91d4abd9cb7fec'
      toUserId: requestedProduct.owner._id,
      requestedProduct: requestedProduct._id,
      offeredProduct: offeredProduct._id,
      priceDifference,
    };

    console.log("📤 Sending trade request payload via socket.emit:", payload);

    socket.emit("tradeRequest", payload);

    alert("Trade request sent!");
    navigate("/cart");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold mb-6">Select Product to Offer</h1>

        {loading ? (
          <p>Loading your inventory...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : myProducts.length === 0 ? (
          <p>You have no products in your inventory.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {myProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-md p-4"
              >
                <img
                  src={
                    product.images?.length > 0
                      ? `${BASE_URL}/uploads/${product.images[0]}`
                      : "https://via.placeholder.com/150"
                  }
                  alt={product.name}
                  className="w-full h-40 object-cover rounded"
                />
                <h2 className="text-xl font-semibold mt-2">{product.name}</h2>
                <p className="text-gray-700">${product.price.toFixed(2)}</p>
                <button
                  onClick={() => handleSelectProduct(product)}
                  className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
                >
                  Select for Trade
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SelectOfferPage;

// import { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import socket from "../socket";
// import Navbar from "./Navbar";

// const BASE_URL =
//   window.location.hostname === "localhost"
//     ? "http://localhost:5000"
//     : "https://swappo-6zd6.onrender.com";

// const SelectOfferPage = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const requestedProduct = state?.requestedProduct;

//   const [myProducts, setMyProducts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const token = localStorage.getItem("token");
//   const fromUserId = localStorage.getItem("userId");

//   useEffect(() => {
//     if (!requestedProduct) {
//       navigate("/products");
//     }

//     const fetchInventory = async () => {
//       try {
//         console.log("Fetching Inventory products...");
//         setLoading(true);
//         const response = await fetch(`${BASE_URL}/api/products/inventory`, {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) throw new Error("Failed to fetch products");
//         const data = await response.json();
//         console.log("Fetched Products in Inventory:", data);
//         setMyProducts(data);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInventory();
//   }, [requestedProduct, token, navigate]);

//   const handleSelectProduct = (offeredProduct) => {
//     const requestedPrice = requestedProduct.price;
//     const offeredPrice = offeredProduct.price;
//     const priceDifference = requestedPrice - offeredPrice;

//     socket.emit("tradeRequest", {
//       fromUserId,
//       toUserId: requestedProduct.ownerId,
//       requestedProduct: requestedProduct._id,
//       offeredProduct: offeredProduct._id,
//       priceDifference,
//     });

//     alert("Trade request sent!");
//     navigate("/cart"); // You can change this to "/products" or wherever makes sense
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="min-h-screen bg-gray-100 p-6">
//         <h1 className="text-3xl font-bold mb-6">Select Product to Offer</h1>

//         {loading ? (
//           <p>Loading your inventory...</p>
//         ) : error ? (
//           <p className="text-red-500">{error}</p>
//         ) : myProducts.length === 0 ? (
//           <p>You have no products in your inventory.</p>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {myProducts.map((product) => (
//               <div
//                 key={product._id}
//                 className="bg-white rounded-lg shadow-md p-4"
//               >
//                 <img
//                   src={
//                     product.images && product.images.length > 0
//                       ? `${BASE_URL}/uploads/${product.images[0]}`
//                       : "https://via.placeholder.com/150"
//                   }
//                   alt={product.name}
//                   className="w-full h-40 object-cover rounded"
//                 />
//                 <h2 className="text-xl font-semibold mt-2">{product.name}</h2>
//                 <p className="text-gray-700">${product.price.toFixed(2)}</p>
//                 <button
//                   onClick={() => handleSelectProduct(product)}
//                   className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
//                 >
//                   Select for Trade
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default SelectOfferPage;

// import { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import socket from "../socket";
// import Navbar from "./Navbar";

// const BASE_URL =
//   window.location.hostname === "localhost"
//     ? "http://localhost:5000"
//     : "https://swappo-6zd6.onrender.com";

// const SelectOfferPage = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const requestedProduct = state?.requestedProduct;

//   const [myProducts, setMyProducts] = useState([]);
//   const token = localStorage.getItem("token");
//   const fromUserId = localStorage.getItem("userId");

//   useEffect(() => {
//     if (!requestedProduct) {
//       navigate("/products");
//     }

//     const fetchInventory = async () => {
//       try {
//         const res = await fetch(`${BASE_URL}/api/my-products`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const data = await res.json();
//         setMyProducts(data);
//       } catch (error) {
//         console.error("Failed to fetch inventory:", error);
//       }
//     };

//     fetchInventory();
//   }, [requestedProduct, token, navigate]);

//   const handleSelectProduct = (offeredProduct) => {
//     const requestedPrice = requestedProduct.price;
//     const offeredPrice = offeredProduct.price;
//     const priceDifference = requestedPrice - offeredPrice;

//     socket.emit("tradeRequest", {
//       fromUserId,
//       toUserId: requestedProduct.ownerId,
//       requestedProduct: requestedProduct._id,
//       offeredProduct: offeredProduct._id,
//       priceDifference,
//     });

//     alert("Trade request sent!");
//     navigate("/cart"); // or back to products page
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="min-h-screen bg-gray-100 p-6">
//         <h1 className="text-3xl font-bold mb-6">Select Product to Offer</h1>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {myProducts.length === 0 ? (
//             <p>You have no products in your inventory.</p>
//           ) : (
//             myProducts.map((product) => (
//               <div
//                 key={product._id}
//                 className="bg-white rounded-lg shadow-md p-4"
//               >
//                 <img
//                   src={
//                     product.images && product.images.length > 0
//                       ? `${BASE_URL}/uploads/${product.images[0]}`
//                       : "https://via.placeholder.com/150"
//                   }
//                   alt={product.name}
//                   className="w-full h-40 object-cover rounded"
//                 />
//                 <h2 className="text-xl font-semibold mt-2">{product.name}</h2>
//                 <p className="text-gray-700">${product.price.toFixed(2)}</p>
//                 <button
//                   onClick={() => handleSelectProduct(product)}
//                   className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
//                 >
//                   Select for Trade
//                 </button>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default SelectOfferPage;
