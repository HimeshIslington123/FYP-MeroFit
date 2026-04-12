import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";

const PaymentSuccess = () => {
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const dataQuery = search.get("data");
  const token = localStorage.getItem("token");
  const [values, setValues] = useState(null);
  const duration = localStorage.getItem("duration");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.post(
          `http://localhost:4000/esewa/paymentverify/${dataQuery}`,
          { duration },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setValues(res.data);
      } catch (err) {
        setValues({ success: false, message: "Verification failed" });
      }
    };

    verify();
  }, []);

  if (!values)
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500 text-lg">Verifying payment...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        {/* eSewa Logo */}
        <img
          src="https://esewa.com.np/common/images/esewa_logo.png"
          alt="eSewa"
          className="h-10 mx-auto mb-4"
        />

        {values.success ? (
          <>
            <CheckCircle className="mx-auto text-green-600" size={70} />
            <h1 className="text-2xl font-bold mt-4 text-green-600">
              Payment Successful
            </h1>
            <p className="text-gray-600 mt-2">
              Your transaction was completed successfully.
            </p>

            <div className="mt-6 bg-gray-50 rounded-xl p-4 text-left">
              <p className="text-sm text-gray-500">Amount Paid</p>
              <p className="text-lg font-semibold text-gray-800">
                Rs. {values.data?.total_amount}
              </p>
            </div>

            <button
              onClick={() => navigate("/userhome/home")}
              className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl transition"
            >
              Go to Dashboard
            </button>
          </>
        ) : (
          <>
            <XCircle className="mx-auto text-red-500" size={70} />
            <h1 className="text-2xl font-bold mt-4 text-red-500">
              Payment Failed
            </h1>
            <p className="text-gray-600 mt-2">
              {values.message || "Something went wrong"}
            </p>

            <button
              onClick={() => navigate("/userhome/userpayment")}
              className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl transition"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;