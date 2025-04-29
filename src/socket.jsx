import { io } from "socket.io-client";

const BASE_URL = "https://swappo-6zd6.onrender.com";

const socket = io(BASE_URL, {
  transports: ["websocket"], // only websocket
  withCredentials: true,
});

export default socket;

// import { io } from "socket.io-client";

// const BASE_URL = "https://swappo-6zd6.onrender.com";

// // const BASE_URL =
// //   window.location.hostname === "localhost"
// //     ? "http://localhost:5000"
// //     : "https://swappo-6zd6.onrender.com";

// //const socket = io(BASE_URL); // Make sure it connects immediately

// const socket = io("https://swappo-6zd6.onrender.com", {
//   withCredentials: true,
//   transports: ["polling", "websocket"], // Add both
// });

// export default socket;
