import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
//import { io } from "socket.io-client";
import Navbar from "./Navbar";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "https://swappo-6zd6.onrender.com";

// const BASE_URL =
//   window.location.hostname === "localhost"
//     ? "http://localhost:5000"
//     : "https://swappo-6zd6.onrender.com";

const TradeRequestsPage = () => {
  const [tradeRequests, setTradeRequests] = useState([]);
  //const userId = localStorage.getItem("userId");

  console.log(
    "Image URLs:",
    tradeRequests.map((t) => ({
      requested: `${BASE_URL}/uploads/${t.requestedProduct?.images?.[0]}`,
      offered: `${BASE_URL}/uploads/${t.offeredProduct?.images?.[0]}`,
    }))
  );

  //console.log("User ID in Trade Requests Page:", userId);
  const token = localStorage.getItem("token");
  const userId = token ? jwtDecode(token).userId : null;

  console.log("User ID in Trade Requests Page:", userId);
  console.log("Token in Trade Requests Page :", token);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTradeRequests = async () => {
      console.log("Fetching trade requests for user:", userId);
      try {
        const res = await fetch(`${BASE_URL}/api/trade-requests/received`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        console.log("Received trade requests:", data);

        setTradeRequests(data);
      } catch (error) {
        console.error("Failed to fetch trade requests:", error);
      }
    };

    fetchTradeRequests();
  }, [token]);

  useEffect(() => {
    socket.emit("join", userId);

    socket.on("tradeRequestReceived", (newTrade) => {
      setTradeRequests((prev) => [...prev, newTrade]);
    });

    return () => {
      socket.off("tradeRequestReceived");
    };
  }, [userId]);

  const TradeProductCard = ({ product }) => {
    const imageUrl =
      product?.images?.length > 0
        ? `${BASE_URL}/uploads/${product.images[0]}`
        : "https://via.placeholder.com/150";

    return (
      <div className="flex items-center gap-4">
        <img
          src={imageUrl}
          alt={product?.name || "Product"}
          className="w-24 h-24 object-cover rounded"
        />
        <div>
          <p className="font-bold">{product?.name || "Unnamed Product"}</p>
          <p>
            {typeof product?.price === "number"
              ? `$${product.price.toFixed(2)}`
              : "Price not available"}
          </p>
        </div>
      </div>
    );
  };

  const handleRespond = async (tradeId, status, priceDifference) => {
    socket.emit("respondToTrade", { tradeId, status });

    if (status === "accepted") {
      if (priceDifference > 0) {
        // Buyer must pay extra → Redirect to Stripe
        try {
          const res = await fetch(`${BASE_URL}/api/checkout`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              tradeId,
              amount: priceDifference * 100, // cents
            }),
          });

          const { url } = await res.json();
          window.location.href = url;
        } catch (err) {
          console.error("Stripe Checkout Error:", err);
        }
      } else if (priceDifference < 0) {
        alert(
          `You accepted the trade. Please collect extra $${Math.abs(
            priceDifference
          ).toFixed(2)} from the buyer.`
        );
      } else {
        alert("Trade accepted. No extra payment required.");
      }
    } else {
      alert("Trade rejected.");
    }

    // Optionally: Refresh list
    setTradeRequests((prev) => prev.filter((t) => t._id !== tradeId));
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold mb-6">Incoming Trade Requests</h1>

        {tradeRequests.length === 0 ? (
          <p>No trade requests at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tradeRequests.map((trade) => (
              <div
                key={trade._id}
                className="bg-white p-4 rounded shadow-md flex flex-col gap-4"
              >
                <h2 className="text-xl font-semibold">Requested Product</h2>
                <TradeProductCard product={trade.requestedProduct} />

                <h2 className="text-xl font-semibold">Offered Product</h2>
                <TradeProductCard product={trade.offeredProduct} />

                <p className="text-gray-700">
                  <strong>Price Difference:</strong>{" "}
                  {trade.priceDifference > 0
                    ? `$${trade.priceDifference.toFixed(2)} to pay`
                    : trade.priceDifference < 0
                    ? `$${Math.abs(trade.priceDifference).toFixed(
                        2
                      )} to collect`
                    : "Even trade"}
                </p>

                <div className="flex gap-4 mt-2">
                  <button
                    onClick={() =>
                      handleRespond(
                        trade._id,
                        "accepted",
                        trade.priceDifference
                      )
                    }
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRespond(trade._id, "rejected")}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default TradeRequestsPage;

// const TradeProductCard = ({ product }) => {
//   const imageUrl =
//     product.images && product.images.length > 0
//       ? `${BASE_URL}/uploads/${product.images[0]}`
//       : "https://via.placeholder.com/150";

//   return (
//     <div className="flex items-center gap-4">
//       <img
//         src={imageUrl}
//         alt={product.name}
//         className="w-24 h-24 object-cover rounded"
//       />
//       <div>
//         <p className="font-bold">{product.name}</p>
//         <p>${product.price.toFixed(2)}</p>
//       </div>
//     </div>
//   );
// };
