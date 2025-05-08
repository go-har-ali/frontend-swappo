import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useState } from "react";

const Payment = ({ tradeId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://swappo-6zd6.onrender.com";

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   if (!stripe || !elements) return;

  //   const { error, paymentMethod } = await stripe.createPaymentMethod({
  //     type: "card",
  //     card: elements.getElement(CardElement),
  //   });

  //   if (error) {
  //     console.error(error);
  //     setLoading(false);
  //     return;
  //   }

  //   // const response = await fetch("/api/payment/pay", {
  //   //   method: "POST",
  //   //   headers: { "Content-Type": "application/json" },
  //   //   body: JSON.stringify({
  //   //     tradeId,
  //   //     paymentMethodId: paymentMethod.id,
  //   //   }),
  //   // });

  //   // 👇 Define paymentData here
  //   const paymentData = {
  //     amount: 1000, // amount in cents
  //     payment_method: paymentMethod.id,
  //   };

  //   const res = await fetch(`${BASE_URL}/api/payment/pay`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(paymentData),
  //   });

  //   //const data = await response.json();
  //   if (res.ok) {
  //     const data = await res.json();
  //     // use data
  //   } else {
  //     const errorText = await res.text(); // capture error message
  //     console.error("Error:", errorText);
  //   }

  //   setLoading(false);

  //   if (data.error) {
  //     console.error(data.error);
  //   } else {
  //     alert("Payment successful!");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) return;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (error) {
      console.error("Payment method creation error:", error);
      setLoading(false);
      return;
    }

    const paymentData = {
      amount: 1000, // amount in cents
      payment_method: paymentMethod.id,
    };

    try {
      const res = await fetch(`${BASE_URL}/api/payment/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      const data = await res.json(); // ✅ define 'data' here

      if (!res.ok) {
        throw new Error(data.message || "Payment failed");
      }

      // Confirm the payment using clientSecret
      const confirmResult = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (confirmResult.error) {
        console.error(
          "Payment confirmation error:",
          confirmResult.error.message
        );
        alert("Payment failed: " + confirmResult.error.message);
      } else if (confirmResult.paymentIntent.status === "succeeded") {
        alert("Payment successful!");
      }
    } catch (err) {
      console.error("Error during payment:", err.message);
      alert("Payment failed: " + err.message);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe || loading}>
        {loading ? "Processing..." : "Pay"}
      </button>
    </form>
  );
};

export default Payment;
