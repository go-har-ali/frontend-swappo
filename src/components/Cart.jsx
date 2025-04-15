import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import socket from "../socket";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  const handleTrade = (item) => {
    const fromUserId = localStorage.getItem("userId");
    const toUserId = item.ownerId; // Get this from product data

    const offerValue = item.price; // or user-entered value

    socket.emit("tradeRequest", {
      fromUserId,
      toUserId,
      productId: item._id,
      offerValue,
    });

    alert("Trade request sent!");
  };

  useEffect(() => {
    socket.on("tradeResponse", (data) => {
      alert(`Your trade was ${data.status}`);
    });

    return () => socket.off("tradeResponse");
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
        <div className="max-w-6xl w-full bg-white shadow-lg rounded-lg p-8">
          {cart.length === 0 ? (
            <p className="text-center text-gray-600 w-full">
              Your cart is empty.{" "}
              <Link to="/products" className="text-blue-600">
                Shop now
              </Link>
              .
            </p>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item._id} className="flex mb-6 border-b pb-6">
                  <div className="w-1/3 flex justify-center">
                    <img
                      src={
                        item.images && item.images.length > 0
                          ? `http://localhost:5000/uploads/${item.images[0]}`
                          : "https://via.placeholder.com/150"
                      }
                      alt={item.name}
                      className="w-40 h-40 object-cover rounded-lg shadow"
                    />

                    {/* <img
                      src={`http://localhost:5000/${item.img}`}
                      alt={item.name}
                      className="w-40 h-40 object-cover rounded-lg shadow"
                    /> */}
                  </div>

                  <div className="w-2/3 p-4">
                    <h2 className="text-2xl font-bold">{item.name}</h2>
                    <p className="text-xl font-semibold text-gray-800 mt-2">
                      ${item.price.toFixed(2)}
                    </p>

                    <div className="mt-4 flex items-center">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item._id,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
                      >
                        -
                      </button>
                      <span className="mx-4 text-xl font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity + 1)
                        }
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
                      >
                        +
                      </button>
                    </div>

                    <div className="mt-6 flex gap-4">
                      <button className="bg-black text-white px-6 py-3 rounded-lg text-lg">
                        TRADE
                      </button>
                      <button
                        onClick={() =>
                          navigate("/offer", { state: { product: item } })
                        }
                        className="bg-black text-white px-6 py-3 rounded-lg text-lg"
                      >
                        MAKE AN OFFER
                      </button>
                    </div>

                    <div className="mt-6">
                      <p className="text-gray-600">Sold By: Bids and Trades</p>
                      <p className="font-bold">Category: Men's Watches</p>
                    </div>

                    <div className="mt-6 flex space-x-2">
                      {["blue", "purple", "green", "red"].map(
                        (color, index) => (
                          <span
                            key={index}
                            className={`w-6 h-6 rounded-full border bg-${color}-500`}
                          ></span>
                        )
                      )}
                    </div>

                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="mt-4 flex items-center text-red-600"
                    >
                      <FaTrashAlt className="mr-2" /> Remove
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex justify-end">
                <button
                  onClick={clearCart}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg text-lg"
                >
                  Clear Cart
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;

// import { useCart } from "../context/CartContext";
// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import { FaTrashAlt } from "react-icons/fa";
// import Navbar from "./Navbar";

// const Cart = () => {
//   const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

//   return (
//     <>
//       <Navbar />
//       <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
//         <div className="max-w-6xl w-full bg-white shadow-lg rounded-lg p-8">
//           {cart.length === 0 ? (
//             <p className="text-center text-gray-600 w-full">
//               Your cart is empty.{" "}
//               <Link to="/products" className="text-blue-600">
//                 Shop now
//               </Link>
//               .
//             </p>
//           ) : (
//             <>
//               {cart.map((item) => (
//                 <div key={item.id} className="flex mb-6 border-b pb-6">
//                   <div className="w-1/3 flex justify-center">
//                     <img
//                       src={item.img}
//                       alt={item.name}
//                       className="w-40 h-40 object-cover rounded-lg shadow"
//                     />
//                   </div>

//                   <div className="w-2/3 p-4">
//                     <h2 className="text-2xl font-bold">{item.name}</h2>
//                     <p className="text-xl font-semibold text-gray-800 mt-2">
//                       ${item.price.toFixed(2)}
//                     </p>

//                     <div className="mt-4 flex items-center">
//                       <button
//                         onClick={() =>
//                           updateQuantity(
//                             item.id,
//                             Math.max(1, item.quantity - 1)
//                           )
//                         }
//                         className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
//                       >
//                         -
//                       </button>
//                       <span className="mx-4 text-xl font-semibold">
//                         {item.quantity}
//                       </span>
//                       <button
//                         onClick={() =>
//                           updateQuantity(item.id, item.quantity + 1)
//                         }
//                         className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
//                       >
//                         +
//                       </button>
//                     </div>

//                     <div className="mt-6 flex gap-4">
//                       <button className="bg-black text-white px-6 py-3 rounded-lg text-lg">
//                         TRADE
//                       </button>
//                       <button className="bg-black text-white px-6 py-3 rounded-lg text-lg">
//                         MAKE AN OFFER
//                       </button>
//                     </div>

//                     <div className="mt-6">
//                       <p className="text-gray-600">Sold By: Bids and Trades</p>
//                       <p className="font-bold">Category: Men's Watches</p>
//                     </div>

//                     <div className="mt-6 flex space-x-2">
//                       {["blue", "purple", "green", "red"].map(
//                         (color, index) => (
//                           <span
//                             key={index}
//                             className={`w-6 h-6 rounded-full border bg-${color}-500`}
//                           ></span>
//                         )
//                       )}
//                     </div>

//                     <button
//                       onClick={() => removeFromCart(item.id)}
//                       className="mt-4 flex items-center text-red-600"
//                     >
//                       <FaTrashAlt className="mr-2" /> Remove
//                     </button>
//                   </div>
//                 </div>
//               ))}

//               <div className="flex justify-end">
//                 <button
//                   onClick={clearCart}
//                   className="bg-red-600 text-white px-6 py-3 rounded-lg text-lg"
//                 >
//                   Clear Cart
//                 </button>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Cart;

// import { useCart } from "../context/CartContext";
// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import { FaTrashAlt } from "react-icons/fa";
// import Navbar from "./Navbar";

// const Cart = () => {
//   const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

//   return (
//     <>
//       <Navbar />

//       <div className="min-h-screen bg-gray-100 p-6">
//         <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
//           <h2 className="text-2xl font-bold mb-4 text-center">Your Cart</h2>

//           {cart.length === 0 ? (
//             <p className="text-center text-gray-600">
//               Your cart is empty.{" "}
//               <Link to="/products" className="text-blue-600">
//                 Shop now
//               </Link>
//               .
//             </p>
//           ) : (
//             <>
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//                 className="divide-y divide-gray-300"
//               >
//                 {cart.map((item) => (
//                   <motion.div
//                     key={item.id}
//                     initial={{ opacity: 0, x: -50 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     exit={{ opacity: 0, x: 50 }}
//                     transition={{ type: "spring", stiffness: 100 }}
//                     className="flex items-center justify-between py-4"
//                   >
//                     <div className="flex items-center space-x-4">
//                       <img
//                         src={item.img}
//                         alt={item.name}
//                         className="w-16 h-16 rounded-lg shadow"
//                       />
//                       <div>
//                         <h3 className="text-lg font-semibold">{item.name}</h3>
//                         <p className="text-gray-600">${item.price}</p>
//                       </div>
//                     </div>

//                     <div className="flex items-center space-x-4">
//                       <button
//                         onClick={() =>
//                           updateQuantity(item.id, item.quantity - 1)
//                         }
//                         disabled={item.quantity <= 1}
//                         className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md"
//                       >
//                         -
//                       </button>
//                       <span className="text-lg font-semibold">
//                         {item.quantity}
//                       </span>
//                       <button
//                         onClick={() =>
//                           updateQuantity(item.id, item.quantity + 1)
//                         }
//                         className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md"
//                       >
//                         +
//                       </button>
//                       <button
//                         onClick={() => removeFromCart(item.id)}
//                         className="text-red-500"
//                       >
//                         <FaTrashAlt />
//                       </button>
//                     </div>
//                   </motion.div>
//                 ))}
//               </motion.div>

//               <div className="mt-6 flex justify-between items-center">
//                 <button
//                   onClick={clearCart}
//                   className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
//                 >
//                   Clear Cart
//                 </button>
//                 <Link
//                   to="/checkout"
//                   className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//                 >
//                   Proceed to Checkout
//                 </Link>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Cart;
