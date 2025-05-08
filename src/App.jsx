import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
//import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Cart from "./components/Cart";
import Products from "./components/Products";
import Contact from "./components/Contact";
import TradeRequestsPage from "./components/TradeRequestsPage";
import CheckoutPage from "./components/CheckoutPage";
import Login from "./components/Login";
import Register from "./components/Register";
import Inventory from "./components/Inventory";
//import CreateProducts from "./components/CreateProduct";
import MakeAnOffer from "./components/Offer";
import socket from "./socket";
import SelectOfferPage from "./components/SelectOfferPage";
import Payment from "./components/Payment.jsx";

const stripePromise = loadStripe(
  "pk_live_51RLEETBMLyUDYEuit3THsuCfms3nuCjmaQ4EOeubimrEMEwBxcSPOAJA1znd383OQKiDfJvQUUW5vi80PCDAHVcC00wYHGG5Kj"
);

<Elements stripe={stripePromise}>
  <Payment />
</Elements>;

function App() {
  useEffect(() => {
    const userId = localStorage.getItem("userId"); // or from context
    if (userId) {
      socket.emit("join", userId);
    }
  }, []);

  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* <Route path="/createproducts" element={<CreateProducts />} /> */}
          <Route path="/home" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/trade/:id" element={<SelectOfferPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/trade-requests" element={<TradeRequestsPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/offer" element={<MakeAnOffer />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;

// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
// import "./App.css";

// function App() {
//   const [count, setCount] = useState(0);

//   return (
//     <>
//       {/* <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p> */}
//     </>
//   );
// }

// export default App;
