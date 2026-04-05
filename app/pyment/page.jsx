"use client";

import { useState, useContext } from "react";
import { ChatContext } from "../context/chatcontext";
import api from "../apicall";


export default function TestPaymentScreen() {
    const [loading, setLoading] = useState(false);
    const { updatePremium, myUsername } = useContext(ChatContext);

    const payNow = async () => {
        setLoading(true);
        try {
            console.log("Creating order...");
            const res = await api.post("/pyment/order", { amount: 1000 }); // ₹10 for test
            const order = res.data;
            console.log("Order created:", order);

            const options = {
                key: "rzp_test_Raxrq2Oolz0F21",
                amount: order.amount,
                currency: "INR",
                name: "My App Premium",
                description: "Premium Membership",
                image: "https://yourapp.com/logo.png",
                order_id: order.id || order._id,
                prefill: { name: myUsername, email: "test@example.com", contact: "9569415328" },
                notes: { username: myUsername },
                theme: { color: "#FF6F61" },
                handler: async function (response) {
                    try {
                        const verify = await api.post("/pyment/verify", {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            username: myUsername,
                        });
                        const data = verify.data;

                        localStorage.setItem("isPremium", "true");
                        localStorage.setItem("premiumExpiry", data.premiumUntil.toString());

                        updatePremium(true, data.premiumUntil);

                        alert(`✅ Premium Activated! Valid till: ${data.premiumUntil}`);
                    } catch (err) {
                        console.log("Verification error:", err);
                        alert("❌ Payment verification failed");
                    }
                },
                modal: {
                    ondismiss: function () {
                        alert("❌ Payment cancelled");
                    },
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.log("Error creating order:", err);
            alert("❌ Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#FF6F61] to-[#DE4313]">
            <div className="bg-white rounded-2xl p-10 w-96 shadow-lg text-center">
                <span className="bg-[#FF6F61] text-white px-3 py-1 rounded-full text-sm font-bold">
                    🔥 Limited Offer
                </span>
                <h1 className="text-3xl font-bold mt-3 text-gray-800">Unlock Premium</h1>
                <p className="text-4xl font-extrabold text-[#DE4313] mt-2">₹25 Only</p>
                <p className="text-gray-600 mt-2 mb-6">
                    Enjoy all premium features for 1 month.
                </p>
                <button
                    className={`bg-[#FF6F61] text-white font-bold py-3 px-10 rounded-full ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#e65c52]"
                        }`}
                    onClick={payNow}
                    disabled={loading}
                >
                    {loading ? "Processing..." : "Pay Now"}
                </button>
                <p className="text-gray-400 text-sm mt-4">Paying as: {myUsername}</p>
            </div>
        </div>
    );
}
