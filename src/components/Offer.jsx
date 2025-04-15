import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";

const MakeAnOffer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  const [offerPrice, setOfferPrice] = useState("");
  const [error, setError] = useState("");

  if (!product) {
    return (
      <div className="text-center mt-10 text-gray-600">
        No product found. Go back to{" "}
        <span
          className="text-blue-600 underline cursor-pointer"
          onClick={() => navigate("/cart")}
        >
          cart
        </span>
        .
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!offerPrice || Number(offerPrice) < 1) {
      setError("Please enter a valid offer price.");
      return;
    }

    alert(`Offer of $${offerPrice} submitted for ${product.name}`);
    navigate("/cart");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
      >
        <h2 className="text-xl font-bold mb-4">
          Make an Offer for {product.name}
        </h2>

        <form onSubmit={handleSubmit}>
          <label className="block text-gray-700">Your Offer Price ($):</label>
          <input
            type="number"
            className="w-full border rounded-lg p-2 mt-2"
            value={offerPrice}
            onChange={(e) => setOfferPrice(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/cart")}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded-lg"
            >
              Submit Offer
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default MakeAnOffer;

// import { useState } from "react";
// import { motion } from "framer-motion";
// //import { useNavigate } from "react-router-dom";
// //import { useLocation } from "react-router-dom";

// const MakeAnOffer = ({ product, onClose, onSubmit }) => {
//   const [offerPrice, setOfferPrice] = useState("");
//   const [error, setError] = useState("");

//   if (!product) return null;

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!offerPrice || Number(offerPrice) < 1) {
//       setError("Please enter a valid offer price.");
//       return;
//     }

//     onSubmit({ productId: product.id, offerPrice: Number(offerPrice) });
//     handleClose();
//     //onClose(); // Close modal after submitting
//   };

//   const handleClose = () => {
//     setOfferPrice("");
//     setError("");
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//       <motion.div
//         initial={{ scale: 0.8, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
//       >
//         <h2 className="text-xl font-bold mb-4">
//           Make an Offer for {product.name}
//         </h2>

//         <form onSubmit={handleSubmit}>
//           <label className="block text-gray-700">Your Offer Price ($):</label>
//           <input
//             type="number"
//             className="w-full border rounded-lg p-2 mt-2"
//             value={offerPrice}
//             onChange={(e) => setOfferPrice(e.target.value)}
//           />
//           {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

//           <div className="mt-4 flex justify-end gap-3">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 border rounded-lg"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-black text-white rounded-lg"
//             >
//               Submit Offer
//             </button>
//           </div>
//         </form>
//       </motion.div>
//     </div>
//   );
// };

// export default MakeAnOffer;
