import { useEffect, useState } from "react";
import socket from "../socket";

const OwnerDashboard = () => {
  const [tradeRequests, setTradeRequests] = useState([]);

  useEffect(() => {
    socket.on("receiveTradeRequest", (data) => {
      setTradeRequests((prev) => [...prev, data]);
    });

    return () => socket.off("receiveTradeRequest");
  }, []);

  const handleAccept = (request) => {
    socket.emit("respondToTrade", {
      ...request,
      status: "accepted",
    });
  };

  const handleReject = (request) => {
    socket.emit("respondToTrade", {
      ...request,
      status: "rejected",
    });
  };

  return (
    <div>
      {tradeRequests.map((req, idx) => (
        <div key={idx} className="border p-4 my-2 rounded">
          Offer: ${req.offerValue} from {req.fromUserId}
          <button onClick={() => handleAccept(req)}>Accept</button>
          <button onClick={() => handleReject(req)}>Reject</button>
        </div>
      ))}
    </div>
  );
};
