import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [suburb, setSuburb] = useState("");
  const [country, setCountry] = useState("Australia");
  const [state, setState] = useState("");
  const [postcode, setPostcode] = useState("");
  const [phone, setPhone] = useState("");

  const navigate = useNavigate();

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 p-6">
      {/* Left Side - Checkout Form */}
      <motion.div
        className="bg-white p-6 rounded-lg shadow-md w-full lg:w-2/3"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-semibold">Example Swappo Store</h1>
        <p className="text-gray-500">
          Cart {">"} Information {">"} Shipping {">"} Payment
        </p>

        {/* Express Checkout */}
        <div className="my-4 flex gap-3">
          <button className="bg-purple-600 text-white p-2 rounded w-full">
            Shop Pay
          </button>
          <button className="bg-yellow-500 text-black p-2 rounded w-full">
            PayPal
          </button>
          <button className="bg-black text-white p-2 rounded w-full">
            Google Pay
          </button>
        </div>

        <div className="text-center text-gray-500 my-2">OR</div>

        {/* Contact Information */}
        <h2 className="text-lg font-semibold mb-2">Contact Information</h2>
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className="flex items-center space-x-2 text-gray-600">
          <input type="checkbox" />
          <span>Email me with news and offers</span>
        </label>

        {/* Shipping Address */}
        <h2 className="text-lg font-semibold mt-4">Shipping Address</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="First Name"
            className="border p-2 rounded"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Last Name"
            className="border p-2 rounded"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <input
          type="text"
          placeholder="Company (optional)"
          className="border p-2 w-full my-3 rounded"
        />
        <input
          type="text"
          placeholder="Address"
          className="border p-2 w-full mb-3 rounded"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <input
          type="text"
          placeholder="Suburb"
          className="border p-2 w-full mb-3 rounded"
          value={suburb}
          onChange={(e) => setSuburb(e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select
            className="border p-2 rounded"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option>Australia</option>
            <option>USA</option>
            <option>UK</option>
          </select>
          <input
            type="text"
            placeholder="State/Territory"
            className="border p-2 rounded"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
          <input
            type="text"
            placeholder="Postcode"
            className="border p-2 rounded"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
          />
        </div>

        <input
          type="text"
          placeholder="Phone"
          className="border p-2 w-full mt-3 rounded"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        {/* Navigation */}
        <div className="flex justify-between items-center mt-4">
          <button onClick={() => navigate("/cart")} className="text-blue-600">
            ← Return to Cart
          </button>
          <motion.button
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            whileHover={{ scale: 1.05 }}
          >
            Continue to Shipping
          </motion.button>
        </div>
      </motion.div>

      {/* Right Side - Order Summary */}
      <motion.div
        className="bg-white p-6 rounded-lg shadow-md w-full lg:w-1/3 mt-6 lg:mt-0 lg:ml-6"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold">Order Summary</h2>
        <div className="mt-4 space-y-4">
          <div className="flex justify-between">
            <span>📦 Cypress Wallet - Dark Chocolate</span>
            <span>$99.95</span>
          </div>
          <div className="flex justify-between">
            <span>👟 Ashford Unisex Sandal - Brown</span>
            <span>$99.95</span>
          </div>
          <div className="border-t pt-2 flex justify-between">
            <input
              type="text"
              placeholder="Gift card or discount code"
              className="border p-2 w-2/3 rounded"
            />
            <button className="bg-gray-300 px-4 py-2 rounded">Apply</button>
          </div>
          <div className="border-t pt-2 flex justify-between">
            <span>Subtotal</span>
            <span>$199.90</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Shipping</span>
            <span>Calculated at next step</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-semibold">
            <span>Total</span>
            <span>AUD $199.90</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CheckoutPage;
