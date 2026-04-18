import React, { useEffect, useState } from "react";
import axios from "axios";

const History = () => {
  const token = localStorage.getItem("token");
  const [payments, setPayments] = useState([]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/esewa/payment-history",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPayments(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const latestPayment = payments[0];

  const isActive = latestPayment
    ? new Date(latestPayment.expire_at) > new Date()
    : false;

  return (
    <div className="min-h-screen">
      <div className="p-8">
        <h2 className="text-2xl font-semibold mb-6">Payment History</h2>

        {/* Status Card */}
        {latestPayment && (
          <div className="bg-white p-4 rounded-xl mb-5 shadow-sm">
            <h3 className="text-lg font-medium">
              Subscription Status:{" "}
              <span
                className={`font-bold ${
                  isActive ? "text-green-600" : "text-red-500"
                }`}
              >
                {isActive ? "ACTIVE" : "EXPIRED"}
              </span>
            </h3>

            <p className="mt-2 text-gray-600">
              Expiry Date:{" "}
              {new Date(latestPayment.expire_at).toDateString()}
            </p>
          </div>
        )}

        {/* Table */}
        <div className="bg-white p-5 rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Transaction ID</th>
                <th className="p-3">Amount (Rs)</th>
                <th className="p-3">Status</th>
                <th className="p-3">Duration</th>
                <th className="p-3">Created</th>
                <th className="p-3">Expire</th>
                <th className="p-3">Active</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((p) => {
                const active = new Date(p.expire_at) > new Date();

                return (
                  <tr
                    key={p._id}
                    className="border-b last:border-none hover:bg-gray-50"
                  >
                    <td className="p-3">{p.payment_transaction_uuid}</td>
                    <td className="p-3">Rs {p.payment_amount}</td>
                    <td className="p-3">{p.payment_status}</td>
                    <td className="p-3">{p.duration} month</td>
                    <td className="p-3">
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      {new Date(p.expire_at).toLocaleDateString()}
                    </td>

                    <td className="p-3 font-bold">
                      <span
                        className={`${
                          active ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {active ? "ACTIVE" : "EXPIRED"}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {payments.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center p-4 text-gray-500">
                    No payment history found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;